/**
 * Device Binding & Hardware Verification (Core Feature 10)
 */

import { DeviceItem, User } from '../types';

export interface DeviceValidationResult {
  allowed: boolean;
  status: 'VALID' | 'MISMATCH' | 'BLOCKED' | 'UNBOUND';
  reason?: string;
  device?: DeviceItem;
}

/**
 * Validates whether an employee's device is authorized for attendance.
 *
 * @param employee The authenticated user
 * @param registeredDevices The organization device registry
 * @param currentDeviceId The UUID / hardware fingerprint of the current client
 */
export function validateDeviceBinding(
  employee: User,
  registeredDevices: DeviceItem[],
  currentDeviceId: string
): DeviceValidationResult {
  if (!currentDeviceId || currentDeviceId.trim() === '') {
    return {
      allowed: false,
      status: 'MISMATCH',
      reason: 'Hardware Device ID tidak terdeteksi. Absensi diblokir.',
    };
  }

  // Find all devices registered to this employee
  const userDevices = registeredDevices.filter(
    (d) => d.employeeId === employee.employeeId
  );

  // If no device has been registered yet, system permits binding of first device
  if (userDevices.length === 0) {
    return {
      allowed: true,
      status: 'UNBOUND',
      reason: 'Perangkat pertama belum terdaftar. Menyetujui registrasi binding awal.',
    };
  }

  // Check matching device
  const matchingDevice = userDevices.find((d) => d.deviceId === currentDeviceId);

  if (!matchingDevice) {
    return {
      allowed: false,
      status: 'MISMATCH',
      reason: `Perangkat tidak cocok! Absensi wajib dilakukan menggunakan perangkat terdaftar (ID: ${userDevices[0].deviceId.slice(-6)}). Hubungi HR untuk pergantian perangkat.`,
      device: userDevices[0],
    };
  }

  if (matchingDevice.status === 'Disabled' || matchingDevice.status === 'Suspicious') {
    return {
      allowed: false,
      status: 'BLOCKED',
      reason: `Perangkat ini dibekukan (${matchingDevice.status}) oleh Administrator karena indikasi anomali keamanan.`,
      device: matchingDevice,
    };
  }

  return {
    allowed: true,
    status: 'VALID',
    device: matchingDevice,
  };
}
