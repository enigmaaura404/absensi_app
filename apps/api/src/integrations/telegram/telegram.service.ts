import { Injectable, Logger } from '@nestjs/common';
import * as https from 'https';
import * as http from 'http';

export interface TelegramSendResult {
  ok: boolean;
  error?: string;
}

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  /**
   * Send a message to a Telegram chat via Bot API.
   * Token and chatId come from the caller (resolved from encrypted DB settings).
   */
  async sendMessage(
    botToken: string,
    chatId: string,
    text: string,
    parseMode: 'Markdown' | 'HTML' = 'Markdown',
  ): Promise<TelegramSendResult> {
    return new Promise((resolve) => {
      const payload = JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode,
      });

      const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${botToken}/sendMessage`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk: Buffer) => (body += chunk.toString()));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body) as { ok: boolean; description?: string };
            if (parsed.ok) {
              resolve({ ok: true });
            } else {
              resolve({ ok: false, error: parsed.description ?? 'Telegram API error' });
            }
          } catch {
            resolve({ ok: false, error: 'Invalid response from Telegram' });
          }
        });
      });

      req.on('error', (err: Error) => {
        this.logger.error('Telegram request error', err.message);
        resolve({ ok: false, error: err.message });
      });

      req.setTimeout(10000, () => {
        req.destroy();
        resolve({ ok: false, error: 'Request timeout' });
      });

      req.write(payload);
      req.end();
    });
  }

  /**
   * Verify bot token by calling getMe and return bot username.
   */
  async getBotInfo(
    botToken: string,
  ): Promise<{ ok: boolean; username?: string; firstName?: string; error?: string }> {
    return new Promise((resolve) => {
      const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${botToken}/getMe`,
        method: 'GET',
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk: Buffer) => (body += chunk.toString()));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body) as {
              ok: boolean;
              result?: { username: string; first_name: string };
              description?: string;
            };
            if (parsed.ok && parsed.result) {
              resolve({
                ok: true,
                username: parsed.result.username,
                firstName: parsed.result.first_name,
              });
            } else {
              resolve({ ok: false, error: parsed.description ?? 'Invalid token' });
            }
          } catch {
            resolve({ ok: false, error: 'Invalid response' });
          }
        });
      });

      req.on('error', (err: Error) => {
        resolve({ ok: false, error: err.message });
      });

      req.setTimeout(10000, () => {
        req.destroy();
        resolve({ ok: false, error: 'Request timeout' });
      });

      req.end();
    });
  }

  /** Render a template string replacing {{key}} with values from context */
  renderTemplate(template: string, context: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => context[key] ?? `{{${key}}}`);
  }
}
