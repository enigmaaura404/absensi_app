import { Injectable, Logger } from '@nestjs/common';

export interface QueueJob {
  type: 'TELEGRAM_NOTIFICATION' | 'SHEETS_SYNC';
  payload: Record<string, unknown>;
  scheduledAt?: Date;
}

/**
 * NotificationQueueService — lightweight async job queue abstraction.
 *
 * Design goals:
 * - Non-blocking: all jobs fire-and-forget from the caller's perspective.
 * - Replaceable: swap this implementation with BullMQ / RabbitMQ when ready.
 *   Just inject and call `enqueue()` — callers don't change.
 *
 * Current implementation: in-process async queue (no external dependency).
 * Replace `processJob()` or the entire class with a real queue worker in production.
 */
@Injectable()
export class NotificationQueueService {
  private readonly logger = new Logger(NotificationQueueService.name);
  private readonly handlers = new Map<
    QueueJob['type'],
    (payload: Record<string, unknown>) => Promise<void>
  >();

  /** Register a handler for a job type */
  register(
    type: QueueJob['type'],
    handler: (payload: Record<string, unknown>) => Promise<void>,
  ): void {
    this.handlers.set(type, handler);
  }

  /**
   * Enqueue a job for async processing.
   * Returns immediately — the job runs in the background.
   */
  enqueue(job: QueueJob): void {
    const delay = job.scheduledAt
      ? Math.max(0, job.scheduledAt.getTime() - Date.now())
      : 0;

    setTimeout(() => {
      this.processJob(job).catch((err: Error) => {
        this.logger.error(`Job ${job.type} failed: ${err.message}`);
      });
    }, delay);
  }

  private async processJob(job: QueueJob): Promise<void> {
    const handler = this.handlers.get(job.type);
    if (!handler) {
      this.logger.warn(`No handler registered for job type: ${job.type}`);
      return;
    }

    try {
      await handler(job.payload);
      this.logger.debug(`Job ${job.type} completed successfully`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Job ${job.type} handler error: ${message}`);
      throw err;
    }
  }
}
