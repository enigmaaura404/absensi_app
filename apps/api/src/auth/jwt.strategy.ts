import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload, AuthUser } from '@absensi/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-attendance-jwt-key-2026',
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
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

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User account is inactive or not found');
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
