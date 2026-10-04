/**
 * Biometric Verification Service (Core Features 06 & 07)
 *
 * Implements strict separation between:
 * - Face Detection
 * - Face Matching
 * - Liveness Detection
 * - Anti-Spoofing
 *
 * Provides extensible providers without false hardcoded similarity scores.
 */

import {
  BiometricVerificationState,
  LivenessProvider,
  FaceMatchingProvider,
} from './biometric.types';

export class MockLivenessProvider implements LivenessProvider {
  name = 'Simulated 3D Liveness Provider (Prototype)';
  isMock = true;

  async verifyLiveness(imageBlobOrUrl?: string | null): Promise<{
    passed: boolean;
    details: string;
  }> {
    if (!imageBlobOrUrl) {
      return {
        passed: false,
        details: 'Tidak ada citra wajah yang ditangkap kamera.',
      };
    }

    // In prototype simulation, valid capture passes with clear MOCK indication
    return {
      passed: true,
      details: '[MOCK / SIMULASI] Liveness pasif terverifikasi via deteksi frame kamera.',
    };
  }
}

export class MockFaceMatchingProvider implements FaceMatchingProvider {
  name = 'Simulated Biometric Matcher (Prototype)';
  isMock = true;

  async matchFace(
    capturedImage: string | null | undefined,
    referenceAvatarUrl: string | null | undefined
  ): Promise<{
    matched: boolean;
    details: string;
  }> {
    if (!capturedImage) {
      return {
        matched: false,
        details: 'Foto verifikasi wajah belum diambil.',
      };
    }

    // Prototype matching: confirms user has an enrolled face profile
    if (!referenceAvatarUrl) {
      return {
        matched: false,
        details: 'Profil biometrik wajah belum terdaftar di sistem HR.',
      };
    }

    return {
      matched: true,
      details: '[MOCK / SIMULASI] Kesesuaian biometrik terverifikasi terhadap profil karyawan.',
    };
  }
}

const defaultLivenessProvider = new MockLivenessProvider();
const defaultMatchingProvider = new MockFaceMatchingProvider();

/**
 * Executes end-to-end biometric validation pipeline
 */
export async function performBiometricVerification(
  capturedImage: string | null | undefined,
  referenceAvatarUrl: string | null | undefined,
  livenessProvider: LivenessProvider = defaultLivenessProvider,
  matchingProvider: FaceMatchingProvider = defaultMatchingProvider
): Promise<BiometricVerificationState> {
  // Step 1: Face Detection
  if (!capturedImage) {
    return {
      faceDetection: 'NOT_STARTED',
      faceMatching: 'NOT_STARTED',
      liveness: 'READY',
      antiSpoof: 'NOT_STARTED',
      isMock: true,
      providerName: livenessProvider.name,
      message: 'Kamera aktif. Posisikan wajah di dalam frame.',
    };
  }

  // Step 2: Liveness Check
  const livenessRes = await livenessProvider.verifyLiveness(capturedImage);
  if (!livenessRes.passed) {
    return {
      faceDetection: 'VERIFIED',
      faceMatching: 'FAILED',
      liveness: 'FAILED',
      antiSpoof: 'FAILED',
      isMock: livenessProvider.isMock,
      providerName: livenessProvider.name,
      message: `Uji liveness gagal: ${livenessRes.details}`,
    };
  }

  // Step 3: Face Matching against identity reference
  const matchRes = await matchingProvider.matchFace(capturedImage, referenceAvatarUrl);
  if (!matchRes.matched) {
    return {
      faceDetection: 'VERIFIED',
      faceMatching: 'FAILED',
      liveness: 'PASSED',
      antiSpoof: 'PASSED',
      isMock: matchingProvider.isMock,
      providerName: matchingProvider.name,
      message: `Pencocokan wajah gagal: ${matchRes.details}`,
    };
  }

  return {
    faceDetection: 'VERIFIED',
    faceMatching: 'VERIFIED',
    liveness: 'PASSED',
    antiSpoof: 'PASSED',
    isMock: livenessProvider.isMock || matchingProvider.isMock,
    providerName: livenessProvider.name,
    message: '[MOCK / SIMULASI] Verifikasi biometrik wajah & liveness lolos.',
  };
}
