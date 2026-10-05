import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { EmployeesModule } from './employees/employees.module';
import { RequestsModule } from './requests/requests.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LocationsModule } from './locations/locations.module';
import { HolidaysModule } from './holidays/holidays.module';
import { DevicesModule } from './devices/devices.module';
import { AuditModule } from './audit/audit.module';
import { SettingsModule } from './settings/settings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { IntegrationsModule } from './integrations/integrations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    PrismaModule,
    AuthModule,
    AttendanceModule,
    EmployeesModule,
    RequestsModule,
    DashboardModule,
    LocationsModule,
    HolidaysModule,
    DevicesModule,
    AuditModule,
    SettingsModule,
    NotificationsModule,
    IntegrationsModule,
  ],
})
export class AppModule {}
