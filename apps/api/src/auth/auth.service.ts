import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginRequestDto, LoginResponseDto, AuthUser } from '@absensi/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private verifyPassword(inputPassword: string, storedHash: string): boolean {
    if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$')) {
      return bcrypt.compareSync(inputPassword, storedHash);
    }
    const sha256Hash = crypto.createHash('sha256').update(inputPassword).digest('hex');
    return sha256Hash === storedHash;
  }

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password } = dto;
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        employee: {
          include: {
            department: true,
            position: true,
            userRoles: {
              include: {
                role: {
                  include: {
                    rolePermissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isValid = this.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Upgrade hash to bcrypt if it was sha256
    if (!user.passwordHash.startsWith('$2a$') && !user.passwordHash.startsWith('$2b$')) {
      const salt = bcrypt.genSaltSync(10);
      const newHash = bcrypt.hashSync(password, salt);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newHash },
      });
    }

    const roles: string[] = user.employee?.userRoles.map((ur) => ur.role.name.toLowerCase()) || [];
    const permissions: string[] = Array.from(
      new Set(
        user.employee?.userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map((rp) => rp.permission.code),
        ) || [],
      ),
    );

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      isActive: user.status === 'ACTIVE',
      employeeId: user.employee?.id ?? null,
      employeeName: user.employee?.name ?? null,
      employeeCode: user.employee?.employeeNumber ?? null,
      departmentId: user.employee?.departmentId ?? null,
      departmentName: user.employee?.department?.name ?? null,
      positionId: user.employee?.positionId ?? null,
      positionName: user.employee?.position?.name ?? null,
      avatarUrl: user.employee?.avatarUrl ?? null,
      roles,
      permissions,
    };

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      employeeId: user.employee?.id,
      roles,
      permissions,
    };

    const accessToken = this.jwtService.sign(tokenPayload);

    return {
      accessToken,
      expiresIn: 7 * 24 * 3600,
      user: authUser,
    };
  }

  async getCurrentUser(userId: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        employee: {
          include: {
            department: true,
            position: true,
            userRoles: {
              include: {
                role: {
                  include: {
                    rolePermissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const roles: string[] = user.employee?.userRoles.map((ur) => ur.role.name.toLowerCase()) || [];
    const permissions: string[] = Array.from(
      new Set(
        user.employee?.userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map((rp) => rp.permission.code),
        ) || [],
      ),
    );

    return {
      id: user.id,
      email: user.email,
      isActive: user.status === 'ACTIVE',
      employeeId: user.employee?.id ?? null,
      employeeName: user.employee?.name ?? null,
      employeeCode: user.employee?.employeeNumber ?? null,
      departmentId: user.employee?.departmentId ?? null,
      departmentName: user.employee?.department?.name ?? null,
      positionId: user.employee?.positionId ?? null,
      positionName: user.employee?.position?.name ?? null,
      avatarUrl: user.employee?.avatarUrl ?? null,
      roles,
      permissions,
    };
  }
}
