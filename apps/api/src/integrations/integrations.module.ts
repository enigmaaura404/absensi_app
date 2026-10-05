import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EncryptionService } from './encryption.service';
import { TelegramService } from './telegram/telegram.service';
import { GoogleDriveService } from './google-drive/google-drive.service';
import { GoogleSheetsService } from './google-sheets/google-sheets.service';
import { NotificationQueueService } from './notification-queue.service';
import { IntegrationsService } from './integrations.service';
import { IntegrationsController } from './integrations.controller';

@Module({
  imports: [PrismaModule],
  controllers: [IntegrationsController],
  providers: [
    EncryptionService,
    TelegramService,
    GoogleDriveService,
    GoogleSheetsService,
    NotificationQueueService,
    IntegrationsService,
  ],
  exports: [
    EncryptionService,
    TelegramService,
    GoogleDriveService,
    GoogleSheetsService,
    NotificationQueueService,
    IntegrationsService,
  ],
})
export class IntegrationsModule {}
