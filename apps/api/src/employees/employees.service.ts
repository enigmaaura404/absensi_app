import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResponse, EmployeeProfileDto } from '@absensi/types';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    search?: string;
    departmentId?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<EmployeeProfileDto>> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (params.departmentId) {
      where.departmentId = params.departmentId;
    }
    if (params.status) {
      where.status = params.status.toUpperCase();
    }
    if (params.search) {
      where.OR = [
        { name: { contains: params.search } },
        { employeeNumber: { contains: params.search } },
        { user: { email: { contains: params.search } } },
      ];
    }

    const [total, employees] = await Promise.all([
      this.prisma.employee.count({ where }),
      this.prisma.employee.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
        include: {
          user: true,
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: { permission: true },
                  },
                },
              },
            },
          },
          department: true,
          position: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      items: employees.map((emp) => this.mapToProfile(emp)),
      total,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findOne(id: string): Promise<EmployeeProfileDto> {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        user: true,
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
        department: true,
        position: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return this.mapToProfile(employee);
  }

  async getDepartments() {
    return this.prisma.department.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { employees: true },
        },
      },
    });
  }

  async getPositions() {
    return this.prisma.position.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { employees: true },
        },
      },
    });
  }

  async create(dto: any): Promise<EmployeeProfileDto> {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new BadRequestException(`User with email ${email} already exists`);
    }

    const passwordHash = dto.password
      ? bcrypt.hashSync(dto.password, 10)
      : bcrypt.hashSync('Employee123!', 10);

    const empCount = await this.prisma.employee.count();
    const employeeCode = dto.employeeCode || `EMP-${String(empCount + 1).padStart(5, '0')}`;

    // Find or fallback department
    let departmentId = dto.departmentId;
    if (!departmentId || departmentId === 'General') {
      const defaultDept = await this.prisma.department.findFirst();
      departmentId = defaultDept ? defaultDept.id : 'dept-tech';
    }

    // Find or fallback position
    let positionId = dto.positionId;
    if (!positionId || positionId === 'Staff') {
      const defaultPos = await this.prisma.position.findFirst();
      positionId = defaultPos ? defaultPos.id : 'pos-staff';
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        status: 'ACTIVE',
      },
    });

    const employee = await this.prisma.employee.create({
      data: {
        userId: user.id,
        employeeNumber: employeeCode,
        name: dto.fullName || dto.name,
        phone: dto.phone,
        departmentId,
        positionId,
        status: 'ACTIVE',
        joinedAt: dto.joinDate ? new Date(dto.joinDate) : new Date(),
      },
    });

    // Assign role if specified
    const targetRoleName = (dto.role || 'employee').toUpperCase();
    const roleRecord = await this.prisma.role.findFirst({
      where: { name: targetRoleName },
    });

    if (roleRecord) {
      await this.prisma.userRole.create({
        data: {
          employeeId: employee.id,
          roleId: roleRecord.id,
        },
      }).catch(() => {});
    }

    return this.findOne(employee.id);
  }

  async update(id: string, dto: any): Promise<EmployeeProfileDto> {
    const emp = await this.prisma.employee.findUnique({ where: { id } });
    if (!emp) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    await this.prisma.employee.update({
      where: { id },
      data: {
        ...(dto.fullName && { name: dto.fullName }),
        ...(dto.name && { name: dto.name }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.departmentId && { departmentId: dto.departmentId }),
        ...(dto.positionId && { positionId: dto.positionId }),
        ...(dto.status && { status: dto.status.toUpperCase() }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
      },
    });

    return this.findOne(id);
  }

  async delete(id: string): Promise<boolean> {
    const emp = await this.prisma.employee.findUnique({ where: { id } });
    if (!emp) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    await this.prisma.employee.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });

    return true;
  }

  private mapToProfile(emp: any): EmployeeProfileDto {
    const roles: string[] = emp.userRoles?.map((ur: any) => ur.role.name.toLowerCase()) || [];
    const permissions: string[] = Array.from(
      new Set(
        emp.userRoles?.flatMap((ur: any) =>
          ur.role.rolePermissions.map((rp: any) => rp.permission.code),
        ) || [],
      ),
    );

    return {
      id: emp.id,
      userId: emp.userId,
      employeeCode: emp.employeeNumber,
      fullName: emp.name,
      email: emp.user?.email || '',
      phone: emp.phone || undefined,
      avatarUrl: emp.avatarUrl || undefined,
      departmentId: emp.departmentId,
      departmentName: emp.department?.name || '',
      positionId: emp.positionId,
      positionName: emp.position?.name || '',
      joinDate: emp.joinedAt ? new Date(emp.joinedAt).toISOString() : '',
      employmentType: 'permanent',
      employmentStatus: (emp.status?.toLowerCase() as any) || 'active',
      roles,
      permissions,
    };
  }
}

