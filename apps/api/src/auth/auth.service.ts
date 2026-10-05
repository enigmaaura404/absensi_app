import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
  Optional,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginRequestDto, LoginResponseDto, AuthUser } from '@absensi/types';

// Optional circular-dep workaround: imported lazily so AuthModule doesn't depend on IntegrationsModule
import type { EncryptionService } from '../integrations/encryption.service';
import type { TelegramService } from '../integrations/telegram/telegram.service';

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const OTP_MAX_ATTEMPTS = 5;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Optional() private readonly encryptionService: EncryptionService,
    @Optional() private readonly telegramService: TelegramService,
  ) {}

  private verifyPassword(inputPassword: string, storedHash: string): boolean {
    if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$')) {
      return bcrypt.compareSync(inputPassword, storedHash);
    }
    const sha256Hash = crypto.createHash('sha256').update(inputPassword).digest('hex');
    return sha256Hash === storedHash;
  }

  /** Generate 6-digit OTP */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /** Hash OTP using SHA-256 (not bcrypt — OTPs are ephemeral and short-lived) */
  private hashOtp(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  /** Check if 2FA is required for this user */
  private async is2FARequired(userId: string): Promise<boolean> {
    // Check DB setting
    const setting = await this.prisma.systemSetting.findUnique({
      where: { key: 'SUPERADMIN_2FA_REQUIRED' },
    });
    return setting?.value === 'true';
  }

  /** Check if user is superadmin */
  private isSuperadmin(roles: string[]): boolean {
    return roles.some((r) => r.toLowerCase() === 'superadmin');
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

    // 2FA flow for superadmin
    if (this.isSuperadmin(roles) && (await this.is2FARequired(user.id))) {
      const otp = this.generateOtp();
      const otpHash = this.hashOtp(otp);
      const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

      // Invalidate old sessions
      await this.prisma.twoFactorSession.deleteMany({
        where: { userId: user.id, verified: false },
      });

      const session = await this.prisma.twoFactorSession.create({
        data: { userId: user.id, otpHash, expiresAt },
      });

      // Try to send via Telegram (non-blocking best-effort)
      const employeeName = user.employee?.name ?? user.email;
      this.sendTelegramOtp(otp, employeeName, user.email).catch((err: Error) =>
        this.logger.warn(`Telegram OTP send failed: ${err.message}`),
      );

      this.logger.log(`[2FA] OTP generated for ${user.email} — session ${session.id}`);

      return {
        accessToken: '',
        expiresIn: 0,
        user: {
          id: user.id,
          email: user.email,
          isActive: false,
          employeeId: null,
          employeeName: null,
          employeeCode: null,
          departmentId: null,
          departmentName: null,
          positionId: null,
          positionName: null,
          avatarUrl: null,
          roles: [],
          permissions: [],
        },
        requires2FA: true,
        twoFactorSessionId: session.id,
        // In dev mode, expose OTP in response (remove in production!)
        ...(process.env.NODE_ENV !== 'production' ? { devOtp: otp } : {}),
      } as LoginResponseDto & { requires2FA: boolean; twoFactorSessionId: string; devOtp?: string };
    }

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

  /** Verify 2FA OTP and return full JWT on success */
  async verify2FA(sessionId: string, otp: string): Promise<LoginResponseDto> {
    const session = await this.prisma.twoFactorSession.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          include: {
            employee: {
              include: {
                department: true,
                position: true,
                userRoles: {
                  include: {
                    role: {
                      include: {
                        rolePermissions: { include: { permission: true } },
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

    if (!session) throw new UnauthorizedException('Invalid 2FA session');
    if (session.verified) throw new UnauthorizedException('Session already used');
    if (session.expiresAt < new Date()) throw new UnauthorizedException('OTP expired');

    if (session.attempt >= OTP_MAX_ATTEMPTS) {
      throw new UnauthorizedException('Maximum OTP attempts exceeded');
    }

    const otpHash = this.hashOtp(otp.trim());
    if (otpHash !== session.otpHash) {
      await this.prisma.twoFactorSession.update({
        where: { id: sessionId },
        data: { attempt: { increment: 1 } },
      });
      throw new UnauthorizedException(
        `Invalid OTP. Attempts remaining: ${OTP_MAX_ATTEMPTS - (session.attempt + 1)}`,
      );
    }

    // Mark session as verified
    await this.prisma.twoFactorSession.update({
      where: { id: sessionId },
      data: { verified: true },
    });

    const user = session.user;
    const roles: string[] =
      user.employee?.userRoles.map((ur) => ur.role.name.toLowerCase()) || [];
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

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      employeeId: user.employee?.id,
      roles,
      permissions,
    });

    this.logger.log(`[2FA] Verified for ${user.email}`);

    return { accessToken, expiresIn: 7 * 24 * 3600, user: authUser };
  }

  /** Resend OTP — creates a new session */
  async resend2FA(sessionId: string): Promise<{ sessionId: string }> {
    const existing = await this.prisma.twoFactorSession.findUnique({
      where: { id: sessionId },
    });
    if (!existing || existing.verified) {
      throw new BadRequestException('Invalid or expired session');
    }

    const otp = this.generateOtp();
    const otpHash = this.hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

    // Invalidate old session
    await this.prisma.twoFactorSession.update({
      where: { id: sessionId },
      data: { verified: true },
    });

    const newSession = await this.prisma.twoFactorSession.create({
      data: { userId: existing.userId, otpHash, expiresAt },
    });

    // Send via Telegram (best-effort)
    this.sendTelegramOtp(otp, 'Superadmin', '').catch(() => {});

    this.logger.log(`[2FA] OTP resent — new session ${newSession.id}`);

    return {
      sessionId: newSession.id,
      ...(process.env.NODE_ENV !== 'production' ? { devOtp: otp } : {}),
    } as { sessionId: string };
  }

  /** Non-blocking Telegram OTP sender */
  private async sendTelegramOtp(
    otp: string,
    employeeName: string,
    email: string,
  ): Promise<void> {
    if (!this.encryptionService || !this.telegramService) {
      this.logger.debug('[2FA] Encryption/Telegram service not available — OTP not sent');
      return;
    }
    try {
      // Resolve Telegram credentials from SystemIntegrationSetting
      const provider = await this.prisma.integrationProvider.findUnique({
        where: { type: 'TELEGRAM' },
        include: { settings: true },
      });

      if (!provider || provider.status !== 'CONNECTED') {
        this.logger.debug('[2FA] Telegram not configured — OTP not sent via Telegram');
        return;
      }

      const tokenSetting = provider.settings.find((s) => s.key === 'BOT_TOKEN');
      const chatIdSetting = provider.settings.find((s) => s.key === 'CHAT_ID');

      if (!tokenSetting || !chatIdSetting) {
        this.logger.debug('[2FA] Telegram BOT_TOKEN or CHAT_ID missing');
        return;
      }

      // Decrypt using EncryptionService injected via constructor
      const botToken = this.encryptionService.safeDecrypt(tokenSetting.encryptedValue);
      const chatId = this.encryptionService.safeDecrypt(chatIdSetting.encryptedValue);

      if (!botToken || !chatId) {
        this.logger.warn('[2FA] Could not decrypt Telegram credentials');
        return;
      }

      const message =
        `🔐 *Kode OTP Login*\n\n` +
        `User: ${employeeName}\n` +
        `Email: ${email}\n` +
        `Kode: \`${otp}\`\n` +
        `Berlaku: 5 menit\n\n` +
        `_Jangan bagikan kode ini kepada siapapun._`;

      const result = await this.telegramService.sendMessage(botToken, chatId, message);
      if (!result.ok) {
        this.logger.warn(`[2FA] Telegram send failed: ${result.error}`);
      }
    } catch (err) {
      this.logger.error('[2FA] sendTelegramOtp error', (err as Error).message);
    }
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
