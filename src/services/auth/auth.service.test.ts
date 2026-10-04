/**
 * Authentication Service Tests
 *
 * Tests the complete auth flow:
 *  - Credential validation per role
 *  - Invalid credential rejection
 *  - Session creation and restoration
 *  - Logout / session clearing
 *  - Role immutability (no switching after login)
 *
 * @module auth.service.test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EnvAuthProvider } from './auth.service';
import { sessionService } from './session.service';

// ---------------------------------------------------------------------------
// Mock environment credentials (mirrors .env.local defaults)
// ---------------------------------------------------------------------------
vi.mock('../../config/auth.config', () => ({
  getAuthUsersConfig: () => [
    {
      id: 'usr-emp',
      employeeId: 'EMP-00124',
      name: 'Budi Santoso',
      email: 'employee@example.com',
      password: 'Employee123!',
      role: 'Employee',
      department: 'Technology',
      position: 'Software Engineer',
      avatar: 'https://example.com/avatar.jpg',
      phone: '08123456789',
      permissions: [],
    },
    {
      id: 'usr-spv',
      employeeId: 'EMP-00125',
      name: 'Ahmad Fauzi',
      email: 'supervisor@example.com',
      password: 'Supervisor123!',
      role: 'Supervisor',
      department: 'Technology',
      position: 'Engineering Team Lead',
      avatar: 'https://example.com/avatar2.jpg',
      phone: '08129876543',
      permissions: [],
    },
    {
      id: 'usr-mgr',
      employeeId: 'EMP-00126',
      name: 'Andi Wijaya',
      email: 'manager@example.com',
      password: 'Manager123!',
      role: 'Manager',
      department: 'Operations',
      position: 'Head of Operations',
      avatar: 'https://example.com/avatar3.jpg',
      phone: '08131234567',
      permissions: [],
    },
    {
      id: 'usr-hr',
      employeeId: 'EMP-00127',
      name: 'Siti Rahma',
      email: 'hr@example.com',
      password: 'HR123!',
      role: 'HR',
      department: 'Human Resources',
      position: 'People Operations Lead',
      avatar: 'https://example.com/avatar4.jpg',
      phone: '08133344556',
      permissions: [],
    },
    {
      id: 'usr-adm',
      employeeId: 'ADM-00001',
      name: 'Admin Attendance',
      email: 'admin@example.com',
      password: 'Admin123!',
      role: 'Admin',
      department: 'General Affairs',
      position: 'Senior Operations Admin',
      avatar: 'https://example.com/avatar5.jpg',
      phone: '08137788990',
      permissions: [],
    },
    {
      id: 'usr-sa',
      employeeId: 'SYS-00001',
      name: 'Superadmin Attendance',
      email: 'superadmin@example.com',
      password: 'Superadmin123!',
      role: 'Superadmin',
      department: 'System',
      position: 'System Administrator',
      avatar: 'https://example.com/avatar6.jpg',
      phone: '08130000001',
      permissions: [],
    },
  ],
}));

vi.mock('../../config/navigation', () => ({
  ROLE_PERMISSIONS: {
    Employee: ['attendance.view', 'attendance.create'],
    Supervisor: ['attendance.view', 'request.approve', 'team.view'],
    Manager: ['attendance.view', 'request.approve', 'team.view', 'report.view'],
    HR: ['attendance.view', 'employee.manage', 'report.view'],
    Admin: ['attendance.view', 'employee.manage', 'system.settings'],
    Superadmin: ['*'],
  },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
let authService: EnvAuthProvider;

beforeEach(() => {
  authService = new EnvAuthProvider();
  sessionService.clear();
});

afterEach(() => {
  sessionService.clear();
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Role-specific login tests
// ---------------------------------------------------------------------------
describe('authenticate() — valid credentials', () => {
  it('Employee: correct credentials → AuthUser with role Employee', async () => {
    const user = await authService.authenticate({
      email: 'employee@example.com',
      password: 'Employee123!',
    });

    expect(user).not.toBeNull();
    expect(user?.role).toBe('Employee');
    expect(user?.email).toBe('employee@example.com');
    expect(user?.name).toBe('Budi Santoso');
    expect(user?.employeeId).toBe('EMP-00124');
  });

  it('Supervisor: correct credentials → AuthUser with role Supervisor', async () => {
    const user = await authService.authenticate({
      email: 'supervisor@example.com',
      password: 'Supervisor123!',
    });

    expect(user).not.toBeNull();
    expect(user?.role).toBe('Supervisor');
    expect(user?.name).toBe('Ahmad Fauzi');
  });

  it('Manager: correct credentials → AuthUser with role Manager', async () => {
    const user = await authService.authenticate({
      email: 'manager@example.com',
      password: 'Manager123!',
    });

    expect(user).not.toBeNull();
    expect(user?.role).toBe('Manager');
    expect(user?.name).toBe('Andi Wijaya');
  });

  it('HR: correct credentials → AuthUser with role HR', async () => {
    const user = await authService.authenticate({
      email: 'hr@example.com',
      password: 'HR123!',
    });

    expect(user).not.toBeNull();
    expect(user?.role).toBe('HR');
    expect(user?.name).toBe('Siti Rahma');
  });

  it('Admin: correct credentials → AuthUser with role Admin', async () => {
    const user = await authService.authenticate({
      email: 'admin@example.com',
      password: 'Admin123!',
    });

    expect(user).not.toBeNull();
    expect(user?.role).toBe('Admin');
    expect(user?.name).toBe('Admin Attendance');
  });

  it('Superadmin: correct credentials → AuthUser with role Superadmin', async () => {
    const user = await authService.authenticate({
      email: 'superadmin@example.com',
      password: 'Superadmin123!',
    });

    expect(user).not.toBeNull();
    expect(user?.role).toBe('Superadmin');
    expect(user?.name).toBe('Superadmin Attendance');
  });
});

// ---------------------------------------------------------------------------
// Invalid credential rejection
// ---------------------------------------------------------------------------
describe('authenticate() — invalid credentials', () => {
  it('valid email + wrong password → null', async () => {
    const user = await authService.authenticate({
      email: 'employee@example.com',
      password: 'wrongpassword',
    });

    expect(user).toBeNull();
  });

  it('unknown email → null', async () => {
    const user = await authService.authenticate({
      email: 'unknown@example.com',
      password: 'Employee123!',
    });

    expect(user).toBeNull();
  });

  it('empty email → null', async () => {
    const user = await authService.authenticate({
      email: '',
      password: 'Employee123!',
    });

    expect(user).toBeNull();
  });

  it('empty password → null', async () => {
    const user = await authService.authenticate({
      email: 'employee@example.com',
      password: '',
    });

    expect(user).toBeNull();
  });

  it('email case-insensitive matching (EMPLOYEE@EXAMPLE.COM)', async () => {
    const user = await authService.authenticate({
      email: 'EMPLOYEE@EXAMPLE.COM',
      password: 'Employee123!',
    });

    expect(user).not.toBeNull();
    expect(user?.role).toBe('Employee');
  });

  it('Employee credential does NOT grant Superadmin role', async () => {
    const user = await authService.authenticate({
      email: 'employee@example.com',
      password: 'Employee123!',
    });

    expect(user?.role).not.toBe('Superadmin');
    expect(user?.role).not.toBe('Admin');
    expect(user?.role).not.toBe('HR');
  });

  it('returned AuthUser does NOT expose password', async () => {
    const user = await authService.authenticate({
      email: 'employee@example.com',
      password: 'Employee123!',
    });

    expect(user).not.toBeNull();
    expect((user as unknown as Record<string, unknown>)['password']).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Session management
// ---------------------------------------------------------------------------
describe('Session lifecycle', () => {
  it('authenticate() creates a session automatically', async () => {
    await authService.authenticate({
      email: 'employee@example.com',
      password: 'Employee123!',
    });

    expect(sessionService.isAuthenticated()).toBe(true);
  });

  it('getCurrentUser() returns session user after login', async () => {
    await authService.authenticate({
      email: 'employee@example.com',
      password: 'Employee123!',
    });

    const current = authService.getCurrentUser();
    expect(current).not.toBeNull();
    expect(current?.role).toBe('Employee');
    expect(current?.email).toBe('employee@example.com');
  });

  it('getCurrentUser() returns null when not authenticated', () => {
    const current = authService.getCurrentUser();
    expect(current).toBeNull();
  });

  it('logout() clears the session', async () => {
    await authService.authenticate({
      email: 'employee@example.com',
      password: 'Employee123!',
    });

    expect(sessionService.isAuthenticated()).toBe(true);

    authService.logout();

    expect(sessionService.isAuthenticated()).toBe(false);
    expect(authService.getCurrentUser()).toBeNull();
  });

  it('session restore: getCurrentUser() returns same user after simulated page reload', async () => {
    await authService.authenticate({
      email: 'superadmin@example.com',
      password: 'Superadmin123!',
    });

    // Simulate a new service instance (page reload)
    const newInstance = new EnvAuthProvider();
    const restored = newInstance.getCurrentUser();

    expect(restored).not.toBeNull();
    expect(restored?.role).toBe('Superadmin');
    expect(restored?.email).toBe('superadmin@example.com');
  });
});

// ---------------------------------------------------------------------------
// Role immutability — no role switching after login
// ---------------------------------------------------------------------------
describe('Role immutability', () => {
  it('authService has no switchRole / switchDevRole method', () => {
    expect((authService as unknown as Record<string, unknown>)['switchRole']).toBeUndefined();
    expect((authService as unknown as Record<string, unknown>)['switchDevRole']).toBeUndefined();
    expect((authService as unknown as Record<string, unknown>)['setRole']).toBeUndefined();
  });

  it('public API is limited to: authenticate, getCurrentUser, logout', () => {
    const publicMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(authService))
      .filter((m) => m !== 'constructor');

    expect(publicMethods).toContain('authenticate');
    expect(publicMethods).toContain('getCurrentUser');
    expect(publicMethods).toContain('logout');

    // Must NOT have any role-switching methods
    expect(publicMethods).not.toContain('switchRole');
    expect(publicMethods).not.toContain('switchDevRole');
    expect(publicMethods).not.toContain('changeRole');
    expect(publicMethods).not.toContain('setRole');
  });

  it('logging in as Employee and then Admin requires a new authenticate() call', async () => {
    const employee = await authService.authenticate({
      email: 'employee@example.com',
      password: 'Employee123!',
    });
    expect(employee?.role).toBe('Employee');

    // After logout + re-authenticate with Admin, role changes
    authService.logout();

    const admin = await authService.authenticate({
      email: 'admin@example.com',
      password: 'Admin123!',
    });
    expect(admin?.role).toBe('Admin');
    expect(authService.getCurrentUser()?.role).toBe('Admin');
  });
});
