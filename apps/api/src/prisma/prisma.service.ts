import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    let dbUrl = process.env.DATABASE_URL;

    // Resilient SQLite path resolver across monorepo root & apps/api directory execution
    if (!dbUrl || dbUrl.includes('.db')) {
      const cleanPath = (dbUrl || '').replace(/^file:/, '').replace(/^\/+/, '');
      const candidates = [
        // If an explicit path was provided in env
        cleanPath ? path.resolve(process.cwd(), cleanPath) : null,
        // Common monorepo locations
        path.resolve(process.cwd(), 'packages/database/prisma/dev.db'),
        path.resolve(process.cwd(), '../../packages/database/prisma/dev.db'),
        path.resolve(process.cwd(), '../packages/database/prisma/dev.db'),
        path.resolve(__dirname, '../../../../packages/database/prisma/dev.db'),
        path.resolve(__dirname, '../../../packages/database/prisma/dev.db'),
      ].filter((p): p is string => Boolean(p));

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          dbUrl = `file:${candidate}`;
          break;
        }
      }
    }

    super(dbUrl ? { datasources: { db: { url: dbUrl } } } : undefined);
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected successfully to the database.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
