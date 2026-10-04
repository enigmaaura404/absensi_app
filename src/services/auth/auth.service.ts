/**
 * Authentication Service
 *
 * Implements real Database / API-backed authentication via NestJS + SQLite/PostgreSQL.
 * Falls back to EnvAuthProvider if API is offline during development.
 */

import { AuthProvider, AuthCredentials, AuthUser } from './auth.types';
import { DatabaseAuthProvider } from './database-auth.provider';
import { sessionService } from './session.service';
import { getAuthUsersConfig } from '../../config/auth.config';
import { ROLE_PERMISSIONS } from '../../config/navigation';

export class EnvAuthProvider implements AuthProvider {
  async authenticate(credentials: AuthCredentials): Promise<AuthUser | null> {
    const { email, password } = credentials;
    if (!email || !password) return null;

    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    const configuredUsers = getAuthUsersConfig();
    const matched = configuredUsers.find(
      (u) => u.email.toLowerCase().trim() === cleanEmail && u.password === cleanPassword
    );

    if (!matched) return null;

    const authUser: AuthUser = {
      id: matched.id,
      employeeId: matched.employeeId,
      name: matched.name,
      email: matched.email,
      role: matched.role,
      department: matched.department,
      position: matched.position,
      avatar: matched.avatar,
      phone: matched.phone,
      permissions: ROLE_PERMISSIONS[matched.role] || [],
    };

    sessionService.create(authUser);
    return authUser;
  }

  getCurrentUser(): AuthUser | null {
    const session = sessionService.get();
    if (!session) return null;

    return {
      id: session.userId,
      employeeId: session.employeeId,
      name: session.name,
      email: session.email,
      role: session.role,
      department: session.department,
      position: session.position || 'Staff',
      avatar: session.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      permissions: ROLE_PERMISSIONS[session.role] || [],
    };
  }

  logout(): void {
    sessionService.clear();
  }
}

/**
 * Composite AuthProvider: Tries DatabaseAuthProvider first, falls back to EnvAuthProvider if offline.
 */
export class HybridAuthProvider implements AuthProvider {
  private dbProvider = new DatabaseAuthProvider();
  private envProvider = new EnvAuthProvider();

  async authenticate(credentials: AuthCredentials): Promise<AuthUser | null> {
    const dbUser = await this.dbProvider.authenticate(credentials);
    if (dbUser) {
      return dbUser;
    }
    // Fallback if local backend is down
    return this.envProvider.authenticate(credentials);
  }

  getCurrentUser(): AuthUser | null {
    return this.dbProvider.getCurrentUser() || this.envProvider.getCurrentUser();
  }

  logout(): void {
    this.dbProvider.logout();
    this.envProvider.logout();
  }
}

export const authService = new HybridAuthProvider();
