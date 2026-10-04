import { describe, it, expect } from 'vitest';
import {
  MockLivenessProvider,
  MockFaceMatchingProvider,
  performBiometricVerification,
} from './biometric.service';

describe('Biometric Verification Pipeline (Core Features 06 & 07)', () => {
  it('returns NOT_STARTED when no captured image is provided', async () => {
    const result = await performBiometricVerification(null, 'https://example.com/avatar.jpg');
    expect(result.faceDetection).toBe('NOT_STARTED');
    expect(result.faceMatching).toBe('NOT_STARTED');
    expect(result.liveness).toBe('READY');
    expect(result.isMock).toBe(true);
  });

  it('fails with FAILED liveness when liveness provider rejects image', async () => {
    const failingLiveness = {
      name: 'Custom Failing Liveness',
      isMock: true,
      async verifyLiveness() {
        return { passed: false, details: 'Anti-spoofing mendeteksi layar foto/layar digital.' };
      },
    };

    const result = await performBiometricVerification(
      'data:image/jpeg;base64,sample',
      'https://example.com/avatar.jpg',
      failingLiveness
    );

    expect(result.liveness).toBe('FAILED');
    expect(result.antiSpoof).toBe('FAILED');
    expect(result.faceMatching).toBe('FAILED');
    expect(result.message).toContain('Anti-spoofing');
  });

  it('fails face matching when employee has no enrolled avatar reference', async () => {
    const result = await performBiometricVerification(
      'data:image/jpeg;base64,sample',
      undefined
    );

    expect(result.liveness).toBe('PASSED');
    expect(result.faceMatching).toBe('FAILED');
    expect(result.message).toContain('belum terdaftar');
  });

  it('succeeds with explicit MOCK indicator when all verification checks pass', async () => {
    const result = await performBiometricVerification(
      'data:image/jpeg;base64,sample',
      'https://example.com/budi.jpg'
    );

    expect(result.faceDetection).toBe('VERIFIED');
    expect(result.faceMatching).toBe('VERIFIED');
    expect(result.liveness).toBe('PASSED');
    expect(result.antiSpoof).toBe('PASSED');
    expect(result.isMock).toBe(true);
    expect(result.message).toContain('[MOCK / SIMULASI]');
  });
});
