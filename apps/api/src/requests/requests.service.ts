import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateLeaveRequestDto,
  LeaveRequestDto,
  PaginatedResponse,
  AuthUser,
} from '@absensi/types';

@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    employeeId?: string;
    status?: string;
    type?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<LeaveRequestDto>> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (params.employeeId) where.employeeId = params.employeeId;
    if (params.status) where.status = params.status.toUpperCase();
    if (params.type) where.type = params.type.toUpperCase();

    const [total, items] = await Promise.all([
      this.prisma.request.count({ where }),
      this.prisma.request.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          employee: {
            include: { department: true },
          },
          leaveType: true,
          approvalHistory: {
            orderBy: { timestamp: 'asc' },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      items: items.map((req) => this.mapToDto(req)),
      total,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async create(employeeId: string, dto: CreateLeaveRequestDto): Promise<LeaveRequestDto> {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const request = await this.prisma.request.create({
      data: {
        employeeId,
        type: dto.requestType.toUpperCase(),
        leaveTypeId: dto.leaveTypeId,
        startDate: dto.startDate,
        endDate: dto.endDate,
        days: daysCount,
        reason: dto.reason,
        status: 'PENDING',
        approvalHistory: {
          create: {
            approverId: employee.id,
            approverName: employee.name,
            approverRole: 'EMPLOYEE',
            action: 'SUBMITTED',
            step: '1',
            note: 'Request submitted',
          },
        },
      },
      include: {
        employee: {
          include: { department: true },
        },
        leaveType: true,
        approvalHistory: true,
      },
    });

    return this.mapToDto(request);
  }

  async approve(requestId: string, approver: AuthUser, notes?: string): Promise<LeaveRequestDto> {
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
      include: { approvalHistory: true },
    });

    if (!request) {
      throw new NotFoundException(`Request with ID ${requestId} not found`);
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException(`Request is already ${request.status.toLowerCase()}`);
    }

    const updated = await this.prisma.request.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        approvalHistory: {
          create: {
            approverId: approver.employeeId || approver.id,
            approverName: approver.employeeName || approver.email,
            approverRole: approver.roles[0]?.toUpperCase() || 'APPROVER',
            action: 'APPROVED',
            step: String(request.approvalHistory.length + 1),
            note: notes || 'Approved',
          },
        },
      },
      include: {
        employee: {
          include: { department: true },
        },
        leaveType: true,
        approvalHistory: true,
      },
    });

    return this.mapToDto(updated);
  }

  async reject(requestId: string, approver: AuthUser, notes?: string): Promise<LeaveRequestDto> {
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
      include: { approvalHistory: true },
    });

    if (!request) {
      throw new NotFoundException(`Request with ID ${requestId} not found`);
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException(`Request is already ${request.status.toLowerCase()}`);
    }

    const updated = await this.prisma.request.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        approvalHistory: {
          create: {
            approverId: approver.employeeId || approver.id,
            approverName: approver.employeeName || approver.email,
            approverRole: approver.roles[0]?.toUpperCase() || 'APPROVER',
            action: 'REJECTED',
            step: String(request.approvalHistory.length + 1),
            note: notes || 'Rejected',
          },
        },
      },
      include: {
        employee: {
          include: { department: true },
        },
        leaveType: true,
        approvalHistory: true,
      },
    });

    return this.mapToDto(updated);
  }

  async getLeaveTypes() {
    return this.prisma.leaveType.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async getLeaveBalances(employeeId: string) {
    return this.prisma.leaveBalance.findMany({
      where: { employeeId },
      include: { leaveType: true },
    });
  }

  private mapToDto(req: any): LeaveRequestDto {
    return {
      id: req.id,
      employeeId: req.employeeId,
      employeeName: req.employee?.name,
      departmentName: req.employee?.department?.name,
      requestType: (req.type?.toLowerCase() as any) || 'leave',
      leaveTypeId: req.leaveTypeId,
      leaveTypeName: req.leaveType?.name,
      startDate: req.startDate,
      endDate: req.endDate,
      daysCount: req.days || 1,
      reason: req.reason,
      status: (req.status?.toLowerCase() as any) || 'pending',
      createdAt: req.createdAt ? new Date(req.createdAt).toISOString() : '',
      updatedAt: req.updatedAt ? new Date(req.updatedAt).toISOString() : '',
      approvalHistory: req.approvalHistory?.map((ah: any) => ({
        id: ah.id,
        approverId: ah.approverId,
        approverName: ah.approverName,
        action: ah.action,
        step: parseInt(ah.step, 10) || 1,
        comment: ah.note,
        createdAt: ah.timestamp ? new Date(ah.timestamp).toISOString() : '',
      })),
    };
  }
}
