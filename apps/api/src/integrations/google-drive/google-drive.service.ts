import { Injectable, Logger } from '@nestjs/common';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

export interface DriveUploadResult {
  ok: boolean;
  fileId?: string;
  webViewLink?: string;
  error?: string;
}

export interface DriveTestResult {
  ok: boolean;
  accountEmail?: string;
  folderName?: string;
  error?: string;
}

@Injectable()
export class GoogleDriveService {
  private readonly logger = new Logger(GoogleDriveService.name);

  /**
   * Get a new access token using refresh token (OAuth2 flow)
   */
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
            if (parsed.access_token) {
              resolve({ accessToken: parsed.access_token });
            } else {
              resolve({
                accessToken: null,
                error: parsed.error_description ?? parsed.error ?? 'Token refresh failed',
              });
            }
          } catch {
            resolve({ accessToken: null, error: 'Invalid token response' });
          }
        });
      });

      req.on('error', (err: Error) => resolve({ accessToken: null, error: err.message }));
      req.setTimeout(10000, () => {
        req.destroy();
        resolve({ accessToken: null, error: 'Timeout' });
      });
      req.write(payload);
      req.end();
    });
  }

  /**
   * Test connection by listing root or folder info
   */
  async testConnection(credentials: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    folderId?: string;
  }): Promise<DriveTestResult> {
    const { accessToken, error } = await this.refreshAccessToken(
      credentials.clientId,
      credentials.clientSecret,
      credentials.refreshToken,
    );

    if (!accessToken) {
      return { ok: false, error: error ?? 'Failed to get access token' };
    }

    return new Promise((resolve) => {
      const fid = credentials.folderId ?? 'root';
      const options = {
        hostname: 'www.googleapis.com',
        port: 443,
        path: `/drive/v3/files/${fid}?fields=id,name`,
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk: Buffer) => (body += chunk.toString()));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body) as { id?: string; name?: string; error?: { message: string } };
            if (parsed.id) {
              resolve({ ok: true, folderName: parsed.name ?? fid });
            } else {
              resolve({ ok: false, error: parsed.error?.message ?? 'Folder not found' });
            }
          } catch {
            resolve({ ok: false, error: 'Invalid response' });
          }
        });
      });

      req.on('error', (err: Error) => resolve({ ok: false, error: err.message }));
      req.setTimeout(10000, () => {
        req.destroy();
        resolve({ ok: false, error: 'Timeout' });
      });
      req.end();
    });
  }

  /**
   * Upload a file (base64 data or buffer) to Google Drive.
   * Returns the Drive file ID.
   */
  async uploadFile(
    credentials: {
      clientId: string;
      clientSecret: string;
      refreshToken: string;
      folderId: string;
    },
    file: {
      name: string;
      mimeType: string;
      data: Buffer;
    },
  ): Promise<DriveUploadResult> {
    const { accessToken, error } = await this.refreshAccessToken(
      credentials.clientId,
      credentials.clientSecret,
      credentials.refreshToken,
    );

    if (!accessToken) {
      return { ok: false, error: error ?? 'Failed to get access token' };
    }

    // Multipart upload
    const boundary = `--------GoogleDrive_${Date.now()}`;
    const metadata = JSON.stringify({ name: file.name, parents: [credentials.folderId] });
    const metaPart =
      `--${boundary}\r\n` +
      `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
      `${metadata}\r\n`;
    const dataPart =
      `--${boundary}\r\n` + `Content-Type: ${file.mimeType}\r\n\r\n`;
    const ending = `\r\n--${boundary}--`;

    const body = Buffer.concat([
      Buffer.from(metaPart),
      Buffer.from(dataPart),
      file.data,
      Buffer.from(ending),
    ]);

    return new Promise((resolve) => {
      const options = {
        hostname: 'www.googleapis.com',
        port: 443,
        path: '/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
          'Content-Length': body.length,
        },
      };

      const req = https.request(options, (res) => {
        let resBody = '';
        res.on('data', (chunk: Buffer) => (resBody += chunk.toString()));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(resBody) as {
              id?: string;
              webViewLink?: string;
              error?: { message: string };
            };
            if (parsed.id) {
              resolve({ ok: true, fileId: parsed.id, webViewLink: parsed.webViewLink });
            } else {
              resolve({ ok: false, error: parsed.error?.message ?? 'Upload failed' });
            }
          } catch {
            resolve({ ok: false, error: 'Invalid upload response' });
          }
        });
      });

      req.on('error', (err: Error) => resolve({ ok: false, error: err.message }));
      req.setTimeout(30000, () => {
        req.destroy();
        resolve({ ok: false, error: 'Upload timeout' });
      });
      req.write(body);
      req.end();
    });
  }
}
