/**
 * Environment Configuration
 * Provides typed access to import.meta.env with production-safe fallbacks.
 */

export interface RoleCredential {
  email: string;
  password: string;
}

export interface AppEnvConfig {
  appName: string;
  appVersion: string;
  appEnv: 'development' | 'staging' | 'production';
  appUrl: string;
  apiBaseUrl: string;
  defaultGeofenceRadius: number;
  maxGpsAccuracy: number;
  faceSimilarityThreshold: number;
  faceVerificationEnabled: boolean;
  livenessDetectionEnabled: boolean;
  authCredentials: {
    employee: RoleCredential;
    supervisor: RoleCredential;
    manager: RoleCredential;
    hr: RoleCredential;
    admin: RoleCredential;
    superadmin: RoleCredential;
  };
}

export const ENV: AppEnvConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'Sistem Absensi',
  appVersion: import.meta.env.VITE_APP_VERSION || '2.6 Enterprise',
  appEnv: (import.meta.env.VITE_APP_ENV as 'development' | 'staging' | 'production') || 'development',
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
  apiBaseUrl: (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api').replace(/\/v1\/?$/, ''),
  defaultGeofenceRadius: Number(import.meta.env.VITE_DEFAULT_GEOFENCE_RADIUS_METERS) || 100,
  maxGpsAccuracy: Number(import.meta.env.VITE_GEOFENCE_MAX_GPS_ACCURACY_METERS) || 50,
  faceSimilarityThreshold: Number(import.meta.env.VITE_FACE_SIMILARITY_THRESHOLD) || 0.75,
  faceVerificationEnabled: import.meta.env.VITE_FACE_VERIFICATION_ENABLED !== 'false',
  livenessDetectionEnabled: import.meta.env.VITE_LIVENESS_DETECTION_ENABLED !== 'false',
  authCredentials: {
    employee: {
      email: import.meta.env.VITE_AUTH_EMPLOYEE_EMAIL || 'budi.santoso@company.id',
      password: import.meta.env.VITE_AUTH_EMPLOYEE_PASSWORD || 'Employee123!',
    },
    supervisor: {
      email: import.meta.env.VITE_AUTH_SUPERVISOR_EMAIL || 'ahmad.fauzi@company.id',
      password: import.meta.env.VITE_AUTH_SUPERVISOR_PASSWORD || 'Supervisor123!',
    },
    manager: {
      email: import.meta.env.VITE_AUTH_MANAGER_EMAIL || 'tri.mulyadi@company.id',
      password: import.meta.env.VITE_AUTH_MANAGER_PASSWORD || 'Manager123!',
    },
    hr: {
      email: import.meta.env.VITE_AUTH_HR_EMAIL || 'siti.rahma@company.id',
      password: import.meta.env.VITE_AUTH_HR_PASSWORD || 'HR123!',
    },
    admin: {
      email: import.meta.env.VITE_AUTH_ADMIN_EMAIL || 'bambang.s@company.id',
      password: import.meta.env.VITE_AUTH_ADMIN_PASSWORD || 'Admin123!',
    },
    superadmin: {
      email: import.meta.env.VITE_AUTH_SUPERADMIN_EMAIL || 'andi.wijaya@company.id',
      password: import.meta.env.VITE_AUTH_SUPERADMIN_PASSWORD || 'Superadmin123!',
    },
  },
};
