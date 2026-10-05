import { Injectable, Logger } from '@nestjs/common';
import * as https from 'https';

export interface SheetsTestResult {
  ok: boolean;
  spreadsheetTitle?: string;
  error?: string;
}

export interface SheetsAppendResult {
  ok: boolean;
  updatedRange?: string;
  error?: string;
}

@Injectable()
export class GoogleSheetsService {
  private readonly logger = new Logger(GoogleSheetsService.name);

  private async refreshAccessToken(
    clientId: string,
    clientSecret: string,
    refreshToken: string,
  ): Promise<{ accessToken: string | null; error?: string }> {
    return new Promise((resolve) => {
      const payload = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }).toString();

      const options = {
        hostname: 'oauth2.googleapis.com',
        port: 443,
        path: '/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(payload),
        },
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk: Buffer) => (body += chunk.toString()));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body) as {
              access_token?: string;
              error?: string;
              error_description?: string;
            };
            resolve(
              parsed.access_token
                ? { accessToken: parsed.access_token }
                : { accessToken: null, error: parsed.error_description ?? parsed.error ?? 'Refresh failed' },
            );
          } catch {
            resolve({ accessToken: null, error: 'Invalid token response' });
          }
        });
      });

      req.on('error', (err: Error) => resolve({ accessToken: null, error: err.message }));
      req.setTimeout(10000, () => { req.destroy(); resolve({ accessToken: null, error: 'Timeout' }); });
      req.write(payload);
      req.end();
    });
  }

  /** Test connection: fetch spreadsheet metadata */
  async testConnection(credentials: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    spreadsheetId: string;
  }): Promise<SheetsTestResult> {
    const { accessToken, error } = await this.refreshAccessToken(
      credentials.clientId,
      credentials.clientSecret,
      credentials.refreshToken,
    );
    if (!accessToken) return { ok: false, error };

    return new Promise((resolve) => {
      const options = {
        hostname: 'sheets.googleapis.com',
        port: 443,
        path: `/v4/spreadsheets/${credentials.spreadsheetId}?fields=properties.title`,
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk: Buffer) => (body += chunk.toString()));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body) as {
              properties?: { title: string };
              error?: { message: string };
            };
            if (parsed.properties) {
              resolve({ ok: true, spreadsheetTitle: parsed.properties.title });
            } else {
              resolve({ ok: false, error: parsed.error?.message ?? 'Spreadsheet not found' });
            }
          } catch {
            resolve({ ok: false, error: 'Invalid response' });
          }
        });
      });

      req.on('error', (err: Error) => resolve({ ok: false, error: err.message }));
      req.setTimeout(10000, () => { req.destroy(); resolve({ ok: false, error: 'Timeout' }); });
      req.end();
    });
  }

  /** Append a row to a sheet */
  async appendRow(
    credentials: {
      clientId: string;
      clientSecret: string;
      refreshToken: string;
      spreadsheetId: string;
    },
    sheetName: string,
    values: (string | number | null)[],
  ): Promise<SheetsAppendResult> {
    const { accessToken, error } = await this.refreshAccessToken(
      credentials.clientId,
      credentials.clientSecret,
      credentials.refreshToken,
    );
    if (!accessToken) return { ok: false, error };

    const payload = JSON.stringify({
      values: [values.map((v) => (v === null ? '' : String(v)))],
    });

    return new Promise((resolve) => {
      const range = encodeURIComponent(`${sheetName}!A1`);
      const options = {
        hostname: 'sheets.googleapis.com',
        port: 443,
        path: `/v4/spreadsheets/${credentials.spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk: Buffer) => (body += chunk.toString()));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body) as {
              updates?: { updatedRange: string };
              error?: { message: string };
            };
            if (parsed.updates) {
              resolve({ ok: true, updatedRange: parsed.updates.updatedRange });
            } else {
              resolve({ ok: false, error: parsed.error?.message ?? 'Append failed' });
            }
          } catch {
            resolve({ ok: false, error: 'Invalid response' });
          }
        });
      });

      req.on('error', (err: Error) => resolve({ ok: false, error: err.message }));
      req.setTimeout(15000, () => { req.destroy(); resolve({ ok: false, error: 'Timeout' }); });
      req.write(payload);
      req.end();
    });
  }
}
