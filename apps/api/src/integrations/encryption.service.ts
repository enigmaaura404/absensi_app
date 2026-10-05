import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);
  private readonly key: Buffer;

  constructor() {
    const hexKey = process.env.ENCRYPTION_KEY || '';
    if (hexKey.length !== 64) {
      this.logger.warn(
        'ENCRYPTION_KEY is not a valid 32-byte hex string. Using dev fallback — SET THIS IN PRODUCTION!',
      );
      // Dev-only fallback — 32 zero bytes
      this.key = Buffer.alloc(32, 0);
    } else {
      this.key = Buffer.from(hexKey, 'hex');
    }
  }

  /**
   * Encrypt a plain-text string using AES-256-GCM.
   * Returns: base64(iv + authTag + ciphertext)
   */
  encrypt(plainText: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv);

    const encrypted = Buffer.concat([
      cipher.update(plainText, 'utf8'),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    // Layout: [iv (16)] + [authTag (16)] + [ciphertext]
    const combined = Buffer.concat([iv, authTag, encrypted]);
    return combined.toString('base64');
  }

  /**
   * Decrypt a base64-encoded AES-256-GCM payload.
   */
  decrypt(encryptedBase64: string): string {
    const combined = Buffer.from(encryptedBase64, 'base64');

    const iv = combined.subarray(0, IV_LENGTH);
    const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const ciphertext = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, this.key, iv);
    decipher.setAuthTag(authTag);

    return decipher.update(ciphertext) + decipher.final('utf8');
  }

  /** Safely decrypt — returns null on failure instead of throwing */
  safeDecrypt(encryptedBase64: string): string | null {
    try {
      return this.decrypt(encryptedBase64);
    } catch {
      this.logger.warn('Decryption failed for a stored secret');
      return null;
    }
  }
}
