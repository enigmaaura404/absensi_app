import { describe, it, expect } from 'vitest';
import { validateDeviceBinding } from './device';
import { User, DeviceItem } from '../types';

describe('Device Binding Business Rules (Core Feature 10)', () => {
  const mockUser: User = {
    id: 'u1',
    employeeId: 'EMP-00124',
    name: 'Budi Santoso',
    email: 'budi@test.com',
    phone: '08123456789',
    role: 'Employee',
    department: 'Technology',
    position: 'Developer',
    joinDate: '2023-01-01',
    avatar: '',
    status: 'Active',
    faceVerified: true,
    deviceVerified: true,
    leaveBalance: { total: 12, used: 2, pending: 0, remaining: 10 },
  };

  const registeredDevices: DeviceItem[] = [
    {
      id: 'dev-1',
      employeeId: 'EMP-00124',
      employeeName: 'Budi Santoso',
      department: 'Technology',
      deviceModel: 'Samsung Galaxy S24 Ultra',
      os: 'Android 14',
      browser: 'Chrome Mobile',
      deviceId: 'hw-samsung-uuid-999',
      lastActive: '2026-10-01',
      status: 'Active',
    },
    {
      id: 'dev-2',
      employeeId: 'EMP-00050',
      employeeName: 'Andi',
      department: 'Finance',
      deviceModel: 'iPhone 15 Pro',
      os: 'iOS 17',
      browser: 'Safari',
      deviceId: 'hw-iphone-uuid-111',
      lastActive: '2026-10-01',
      status: 'Disabled',
    },
  ];

  it('rejects attendance if device ID is missing or empty', () => {
    const result = validateDeviceBinding(mockUser, registeredDevices, '');
    expect(result.allowed).toBe(false);
    expect(result.status).toBe('MISMATCH');
  });

  it('allows binding when user has no devices registered yet (initial device binding)', () => {
    const newUser = { ...mockUser, employeeId: 'EMP-NEW' };
    const result = validateDeviceBinding(newUser, registeredDevices, 'hw-new-phone-888');
    expect(result.allowed).toBe(true);
    expect(result.status).toBe('UNBOUND');
  });

  it('validates and allows attendance from registered active device', () => {
    const result = validateDeviceBinding(
      mockUser,
      registeredDevices,
      'hw-samsung-uuid-999'
    );
    expect(result.allowed).toBe(true);
    expect(result.status).toBe('VALID');
    expect(result.device?.deviceModel).toBe('Samsung Galaxy S24 Ultra');
  });

  it('rejects attendance when user attempts check-in from an unregistered device', () => {
    const result = validateDeviceBinding(
      mockUser,
      registeredDevices,
      'hw-stranger-phone-000'
    );
    expect(result.allowed).toBe(false);
    expect(result.status).toBe('MISMATCH');
    expect(result.reason).toContain('Perangkat tidak cocok');
  });

  it('rejects attendance when registered device is disabled/blocked by admin', () => {
    const userWithBlockedDev = { ...mockUser, employeeId: 'EMP-00050' };
    const result = validateDeviceBinding(
      userWithBlockedDev,
      registeredDevices,
      'hw-iphone-uuid-111'
    );
    expect(result.allowed).toBe(false);
    expect(result.status).toBe('BLOCKED');
    expect(result.reason).toContain('dibekukan');
  });
});
