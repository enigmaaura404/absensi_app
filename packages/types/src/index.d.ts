/**
 * @absensi/types - Shared contracts and data transfer types
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
    meta?: {
        timestamp: string;
        version?: string;
    };
}
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export interface PaginationParams {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export type SystemRole = 'employee' | 'supervisor' | 'manager' | 'hr' | 'admin' | 'superadmin';
export interface UserRoleInfo {
    roleId: string;
    roleCode: string;
    roleName: string;
}
export interface AuthUser {
    id: string;
    email: string;
    isActive: boolean;
    employeeId: string | null;
    employeeName: string | null;
    employeeCode: string | null;
    departmentId: string | null;
    departmentName: string | null;
    positionId: string | null;
    positionName: string | null;
    avatarUrl: string | null;
    roles: string[];
    permissions: string[];
}
export interface LoginRequestDto {
    email: string;
    password: string;
    deviceId?: string;
    deviceName?: string;
}
export interface LoginResponseDto {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    user: AuthUser;
}
export interface JwtPayload {
    sub: string;
    email: string;
    employeeId?: string;
    roles: string[];
    permissions: string[];
    iat?: number;
    exp?: number;
}
export type AttendanceStatus = 'present' | 'late' | 'early_leave' | 'absent' | 'leave' | 'holiday' | 'day_off';
export interface LocationCoordinates {
    latitude: number;
    longitude: number;
    accuracy?: number;
}
export interface CheckInRequestDto {
    coordinates: LocationCoordinates;
    address?: string;
    faceConfidence?: number;
    faceCapturedPhoto?: string;
    deviceFingerprint?: string;
    notes?: string;
    clientTimestamp?: string;
}
export interface CheckOutRequestDto {
    coordinates: LocationCoordinates;
    address?: string;
    faceConfidence?: number;
    faceCapturedPhoto?: string;
    deviceFingerprint?: string;
    notes?: string;
    clientTimestamp?: string;
}
export interface AttendanceRecordDto {
    id: string;
    employeeId: string;
    employeeName?: string;
    employeeCode?: string;
    departmentName?: string;
    date: string;
    shiftId?: string;
    shiftName?: string;
    scheduledIn?: string;
    scheduledOut?: string;
    checkIn?: string;
    checkOut?: string;
    checkInLat?: number;
    checkInLng?: number;
    checkInAddress?: string;
    checkOutLat?: number;
    checkOutLng?: number;
    checkOutAddress?: string;
    lateMinutes: number;
    earlyMinutes: number;
    workMinutes: number;
    status: AttendanceStatus;
    isOvertime: boolean;
    overtimeMinutes: number;
    notes?: string;
}
export interface AttendanceSummaryDto {
    totalDays: number;
    present: number;
    late: number;
    earlyLeave: number;
    absent: number;
    leave: number;
    attendanceRate: number;
    averageWorkMinutes: number;
}
export type EmploymentType = 'permanent' | 'contract' | 'probation' | 'intern';
export type EmploymentStatus = 'active' | 'suspended' | 'resigned' | 'terminated';
export interface EmployeeProfileDto {
    id: string;
    userId: string;
    employeeCode: string;
    fullName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    departmentId: string;
    departmentName: string;
    positionId: string;
    positionName: string;
    joinDate: string;
    employmentType: EmploymentType;
    employmentStatus: EmploymentStatus;
    roles: string[];
    permissions: string[];
}
export interface CreateEmployeeDto {
    fullName: string;
    email: string;
    password?: string;
    phone?: string;
    employeeCode?: string;
    departmentId: string;
    positionId: string;
    joinDate: string;
    employmentType: EmploymentType;
    roles?: string[];
}
export interface UpdateEmployeeDto {
    fullName?: string;
    phone?: string;
    departmentId?: string;
    positionId?: string;
    employmentType?: EmploymentType;
    employmentStatus?: EmploymentStatus;
    avatarUrl?: string;
}
export type RequestType = 'leave' | 'sick' | 'permit' | 'overtime' | 'shift_change';
export type RequestStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';
export interface LeaveRequestDto {
    id: string;
    employeeId: string;
    employeeName?: string;
    departmentName?: string;
    requestType: RequestType;
    leaveTypeId?: string;
    leaveTypeName?: string;
    startDate: string;
    endDate: string;
    daysCount: number;
    reason: string;
    status: RequestStatus;
    attachmentUrl?: string;
    createdAt: string;
    updatedAt: string;
    approvalHistory?: ApprovalHistoryDto[];
}
export interface CreateLeaveRequestDto {
    requestType: RequestType;
    leaveTypeId?: string;
    startDate: string;
    endDate: string;
    reason: string;
    attachmentUrl?: string;
}
export interface ApprovalActionDto {
    action: 'approve' | 'reject';
    notes?: string;
}
export interface ApprovalHistoryDto {
    id: string;
    approverId: string;
    approverName: string;
    action: string;
    step: number;
    comment?: string;
    createdAt: string;
}
export interface DashboardStatsDto {
    totalEmployees: number;
    presentToday: number;
    lateToday: number;
    onLeaveToday: number;
    absentToday: number;
    pendingRequests: number;
    weeklyTrend: {
        date: string;
        present: number;
        late: number;
        absent: number;
    }[];
    departmentBreakdown: {
        departmentId: string;
        departmentName: string;
        attendanceRate: number;
    }[];
}
export interface OfficeLocationDto {
    id: string;
    name: string;
    address?: string | null;
    city?: string | null;
    latitude: number;
    longitude: number;
    radiusMeters: number;
    accuracyLimitMeters: number;
    isActive: boolean;
}
export interface CreateOfficeLocationDto {
    name: string;
    address?: string;
    city?: string;
    latitude: number;
    longitude: number;
    radiusMeters?: number;
    accuracyLimitMeters?: number;
}
export interface HolidayDto {
    id: string;
    name: string;
    date: string;
    type: string;
    source?: string;
    description?: string | null;
    isActive: boolean;
}
export interface CreateHolidayDto {
    name: string;
    date: string;
    type: string;
    description?: string;
}
export interface DeviceDto {
    id: string;
    employeeId: string;
    employeeName?: string;
    deviceIdentifier: string;
    deviceModel?: string | null;
    deviceType?: string | null;
    platform?: string | null;
    browser?: string | null;
    status: string;
    registeredAt: string;
    lastSeenAt?: string | null;
}
export interface AuditLogDto {
    id: string;
    actorId?: string | null;
    actorName?: string | null;
    actorRole?: string | null;
    action: string;
    module: string;
    targetId?: string | null;
    targetType?: string | null;
    ipAddress?: string | null;
    result: string;
    details?: string | null;
    createdAt: string;
}
export interface SystemSettingDto {
    id: string;
    key: string;
    value: string;
    type: string;
    label?: string | null;
}
//# sourceMappingURL=index.d.ts.map