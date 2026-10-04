/**
 * Biometric Verification Types & Contracts (Core Features 06 & 07)
 */

export type FaceDetectionStatus = 'NOT_STARTED' | 'PROCESSING' | 'VERIFIED' | 'FAILED';
export type FaceMatchingStatus = 'NOT_STARTED' | 'PROCESSING' | 'VERIFIED' | 'FAILED';
export type LivenessStatus = 'READY' | 'PROCESSING' | 'PASSED' | 'FAILED';
export type AntiSpoofStatus = 'NOT_STARTED' | 'PROCESSING' | 'PASSED' | 'FAILED';

export interface BiometricVerificationState {
  faceDetection: FaceDetectionStatus;
  faceMatching: FaceMatchingStatus;
  liveness: LivenessStatus;
  antiSpoof: AntiSpoofStatus;
  isMock: boolean;
  providerName: string;
  message: string;
}

export interface LivenessProvider {
  name: string;
  isMock: boolean;
  verifyLiveness(imageBlobOrUrl?: string | null): Promise<{
    passed: boolean;
    livenessScore?: number;
    details: string;
  }>;
}

export interface FaceMatchingProvider {
  name: string;
  isMock: boolean;
  matchFace(
    capturedImage: string | null | undefined,
    referenceAvatarUrl: string | null | undefined
  ): Promise<{
    matched: boolean;
    details: string;
  }>;
}
