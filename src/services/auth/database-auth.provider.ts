/**
 * Database / API-backed Authentication Provider
 * Communicates with the NestJS backend and PostgreSQL/SQLite database.
 */

import { AuthProvider, AuthCredentials, AuthUser } from './auth.types';
import { sessionService } from './session.service';
import { apiClient } from '../api/api.client';
import { ROLE_PERMISSIONS, Permission } from '../../config/navigation';
import { UserRole } from '../../types';

export class DatabaseAuthProvider implements AuthProvider {
  async authenticate(credentials: AuthCredentials): Promise<AuthUser | null> {
    try {
      const response = await apiClient.login({
        email: credentials.email,
        password: credentials.password,
      });

      if (!response || !response.user) {
        return null;
      }

      const rawUser = response.user;
      const roleRaw = rawUser.roles?.[0] || 'Employee';
      const roleMap: Record<string, UserRole> = {
        admin: 'Admin',
        ADMIN: 'Admin',
        Admin: 'Admin',
        employee: 'Employee',
        EMPLOYEE: 'Employee',
        Employee: 'Employee',
        hr: 'HR',
        HR: 'HR',
        manager: 'Manager',
        MANAGER: 'Manager',
        Manager: 'Manager',
        supervisor: 'Supervisor',
        SUPERVISOR: 'Supervisor',
        Supervisor: 'Supervisor',
        superadmin: 'Superadmin',
        SUPERADMIN: 'Superadmin',
        Superadmin: 'Superadmin',
      };
      const primaryRole: UserRole = roleMap[roleRaw] || 'Employee';

      // Map permissions or fallback to role defaults
      const permissions: Permission[] =
        rawUser.permissions && rawUser.permissions.length > 0
          ? (rawUser.permissions as Permission[])
          : ROLE_PERMISSIONS[primaryRole] || [];

      const authUser: AuthUser = {
        id: rawUser.id,
        employeeId: rawUser.employeeId || rawUser.id,
        name: rawUser.employeeName || rawUser.email.split('@')[0],
        email: rawUser.email,
        role: primaryRole,
        department: rawUser.departmentName || 'General',
        position: rawUser.positionName || 'Staff',
        avatar:
          rawUser.avatarUrl ||
          `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80`,
        permissions,
      };

      sessionService.create(authUser);
      return authUser;
    } catch (err) {
      console.warn('[DatabaseAuthProvider] Login request failed:', err);
      return null;
    }
  }

  getCurrentUser(): AuthUser | null {
    const session = sessionService.get();
    if (!session) return null;

    const permissions: Permission[] = ROLE_PERMISSIONS[session.role] || [];

    return {
      id: session.userId,
      employeeId: session.employeeId,
      name: session.name,
      email: session.email,
      role: session.role,
      department: session.department,
      position: session.position || 'Staff',
      avatar: session.avatar || '',
      permissions,
    };
  }

  logout(): void {
    apiClient.logout().catch(() => {});
    sessionService.clear();
  }
}
