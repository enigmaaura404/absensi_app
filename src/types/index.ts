export type UserRole = 'Employee' | 'HR' | 'Admin' | 'Superadmin' | 'Manager' | 'Supervisor';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  position: string;
  joinDate: string;
  avatar: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  faceVerified: boolean;
  deviceVerified: boolean;
  leaveBalance: {
    total: number;
    used: number;
    pending: number;
    remaining: number;
  };
}

export type AttendanceStatus = 'Hadir' | 'Terlambat' | 'Izin' | 'Sakit' | 'Cuti' | 'Dinas' | 'Belum Check-In';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: AttendanceStatus;
  duration: string | null;
  location: string;
  coordinates?: string;
  selfieUrl?: string;
  device: string;
  ip: string;
  notes?: string;
}

export type RequestType = 'Cuti' | 'Sakit' | 'Izin' | 'Dinas' | 'Koreksi';
export type RequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export interface RequestItem {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: RequestType;
  subType?: string;
  startDate: string;
  endDate: string;
  days: number;
  timeStart?: string;
  timeEnd?: string;
  destination?: string;
  reason: string;
  notes?: string;
  status: RequestStatus;
  submittedAt: string;
  approvedAt?: string;
  approverName?: string;
  attachmentName?: string;
  rejectionReason?: string;
}

export interface GeofenceLocation {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  address: string;
  active: boolean;
  totalEmployees: number;
}

export interface DeviceItem {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  deviceModel: string;
  os: string;
  browser: string;
  deviceId: string;
  lastActive: string;
  status: 'Active' | 'Bound' | 'Suspicious' | 'Disabled';
}

export interface HolidayItem {
  id: string;
  name: string;
  date: string;
  type: 'Nasional' | 'Perusahaan' | 'Cuti Bersama';
  description: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: 'CHECK_IN' | 'CHECK_OUT' | 'LEAVE_APPLY' | 'APPROVAL_GRANTED' | 'APPROVAL_REJECTED' | 'DEVICE_BIND' | 'FACE_UPDATE' | 'SETTINGS_CHANGED' | 'LOGIN';
  module: 'Attendance' | 'Approval' | 'Employees' | 'Security' | 'System' | 'Auth';
  ip: string;
  device: string;
  result: 'SUCCESS' | 'FAILED';
  details?: string;
}

export interface SecurityEventItem {
  id: string;
  timestamp: string;
  type: 'Failed Login' | 'Face Verification Failed' | 'Suspicious GPS' | 'Device Blocked' | 'Multiple Device Attempt';
  description: string;
  user: string;
  severity: 'Info' | 'Warning' | 'Critical';
  status: 'Investigating' | 'Resolved' | 'Action Required';
  ip: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'Attendance' | 'Approval' | 'Security' | 'System';
  timestamp: string;
  unread: boolean;
}

export interface PayrollPrepItem {
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  workingDays: number;
  presentDays: number;
  lateCount: number;
  overtimeHours: number;
  leaveDays: number;
  absentDays: number;
  calculatedAllowance: string;
  status: 'Ready' | 'Review Needed' | 'Processed';
}
