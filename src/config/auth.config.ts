/**
 * Centralized Authentication Configuration
 * Provides fallback credentials for EnvAuthProvider (offline mode).
 * Primary authentication runs through NestJS API (DatabaseAuthProvider).
 *
 * NOTE: These fallback credentials mirror the database seed for development.
 * They are stored in .env.local and are NOT shipped to production.
 */

import { ENV } from './env';
import { UserRole } from '../types';
import { ROLE_PERMISSIONS, Permission } from './navigation';

export interface ConfiguredAuthUser {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
  position: string;
  avatar: string;
  phone?: string;
  permissions: Permission[];
}

/**
 * Startup validation: warn in development if any credential is unconfigured.
 */
function validateAuthConfig(users: ConfiguredAuthUser[]) {
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    users.forEach((u) => {
      if (!u.email || !u.password) {
        console.warn(`[AUTH CONFIG WARNING] ${u.role} credentials are not fully configured in environment.`);
      }
    });
  }
}

/**
 * Returns the list of fallback credentials used by EnvAuthProvider.
 * These mirror the seeded database users exactly.
 * Primary auth always tries DatabaseAuthProvider (NestJS API) first.
 */
export function getAuthUsersConfig(): ConfiguredAuthUser[] {
  const users: ConfiguredAuthUser[] = [
    {
      id: 'usr-budi-santoso',
      employeeId: 'EMP-00124',
      name: 'Budi Santoso',
      email: ENV.authCredentials.employee.email,
      password: ENV.authCredentials.employee.password,
      role: 'Employee',
      department: 'Technology',
      position: 'Senior Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      phone: '0812-3456-7890',
      permissions: ROLE_PERMISSIONS['Employee'],
    },
    {
      id: 'usr-ahmad-fauzi',
      employeeId: 'EMP-00045',
      name: 'Ahmad Fauzi, S.T.',
      email: ENV.authCredentials.supervisor.email,
      password: ENV.authCredentials.supervisor.password,
      role: 'Supervisor',
      department: 'Technology',
      position: 'Engineering Team Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      phone: '0812-9876-5432',
      permissions: ROLE_PERMISSIONS['Supervisor'],
    },
    {
      id: 'usr-tri-mulyadi',
      employeeId: 'EMP-00022',
      name: 'Tri Mulyadi, S.E.',
      email: ENV.authCredentials.manager.email,
      password: ENV.authCredentials.manager.password,
      role: 'Manager',
      department: 'Operations',
      position: 'Head of Operations',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
      phone: '0813-8877-6655',
      permissions: ROLE_PERMISSIONS['Manager'],
    },
    {
      id: 'usr-siti-rahma',
      employeeId: 'EMP-00018',
      name: 'Siti Rahma',
      email: ENV.authCredentials.hr.email,
      password: ENV.authCredentials.hr.password,
      role: 'HR',
      department: 'Human Resources',
      position: 'Head of People & Culture',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      phone: '0812-3344-5566',
      permissions: ROLE_PERMISSIONS['HR'],
    },
    {
      id: 'usr-bambang-soediro',
      employeeId: 'EMP-00005',
      name: 'Bambang Soediro',
      email: ENV.authCredentials.admin.email,
      password: ENV.authCredentials.admin.password,
      role: 'Admin',
      department: 'General Affairs',
      position: 'Senior Operations Admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
      phone: '0812-7788-9900',
      permissions: ROLE_PERMISSIONS['Admin'],
    },
    {
      id: 'usr-andi-wijaya',
      employeeId: 'EMP-00001',
      name: 'Andi Wijaya, M.Kom.',
      email: ENV.authCredentials.superadmin.email,
      password: ENV.authCredentials.superadmin.password,
      role: 'Superadmin',
      department: 'Executive',
      position: 'Chief Technology Officer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      phone: '0811-2345-6789',
      permissions: ROLE_PERMISSIONS['Superadmin'],
    },
  ];

  validateAuthConfig(users);
  return users;
}
