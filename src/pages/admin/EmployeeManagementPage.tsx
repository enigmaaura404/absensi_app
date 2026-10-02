import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  ShieldCheck,
  Smartphone,
  ScanFace,
  CheckCircle2,
  XCircle,
  MoreVertical,
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';

interface EmployeeManagementPageProps {
  employees: User[];
  onAddEmployee: (employee: User) => void;
  onUpdateEmployee: (employee: User) => void;
  onDeleteEmployee: (id: string) => void;
}

export const EmployeeManagementPage: React.FC<EmployeeManagementPageProps> = ({
  employees,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [roleFilter, setRoleFilter] = useState('Semua');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<User | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<User | null>(null);
  const [viewCandidate, setViewCandidate] = useState<User | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Technology');
  const [position, setPosition] = useState('');
  const [role, setRole] = useState<UserRole>('Employee');

  const departments = ['Semua', 'Technology', 'Human Resources', 'Finance', 'Operations', 'Marketing', 'Legal'];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'Semua' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'Semua' || emp.status === statusFilter;
    const matchesRole = roleFilter === 'Semua' || emp.role === roleFilter;

    return matchesSearch && matchesDept && matchesStatus && matchesRole;
  });

  const handleOpenAdd = () => {
    setName('');
    setEmail('');
    setPhone('0812-');
    setDepartment('Technology');
    setPosition('');
    setRole('Employee');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (emp: User) => {
    setEditingEmployee(emp);
    setName(emp.name);
    setEmail(emp.email);
    setPhone(emp.phone);
    setDepartment(emp.department);
    setPosition(emp.position);
    setRole(emp.role);
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEmployee) {
      onUpdateEmployee({
        ...editingEmployee,
        name,
        email,
        phone,
        department,
        position,
        role,
      });
      setEditingEmployee(null);
    } else {
      const nextIdNum = 130 + employees.length;
      const newEmp: User = {
        id: `usr-${Date.now()}`,
        employeeId: `EMP-00${nextIdNum}`,
        name,
        email,
        phone,
        role,
        department,
        position,
        joinDate: '02 Oktober 2026',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
        status: 'Active',
        faceVerified: false,
        deviceVerified: false,
        leaveBalance: { total: 12, used: 0, pending: 0, remaining: 12 },
      };
      onAddEmployee(newEmp);
      setIsAddModalOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteCandidate) {
      onDeleteEmployee(deleteCandidate.id);
      setDeleteCandidate(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Manajemen Karyawan
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700">
              {employees.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Kelola data staf, jabatan kerja, status biometrik wajah, dan binding perangkat.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Karyawan</span>
        </button>
      </div>

      {/* Toolbar: Search, Dept, Status, Role */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-3 sm:p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama / NIK..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  Dept: {d}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              <option value="Semua">Status: Semua</option>
              <option value="Active">Status: Active</option>
              <option value="On Leave">Status: On Leave</option>
              <option value="Inactive">Status: Inactive</option>
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            >
              <option value="Semua">Role: Semua</option>
              <option value="Employee">Role: Employee</option>
              <option value="HR">Role: HR</option>
              <option value="Admin">Role: Admin</option>
              <option value="Superadmin">Role: Superadmin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table (Prompt Specified Layout) */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 text-[11px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Device</th>
                <th className="py-3 px-4">Face Verification</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                      />
                      <div>
                        <p className="font-bold text-neutral-900">{emp.name}</p>
                        <p className="text-[10px] text-neutral-400 font-mono">
                          {emp.employeeId} • {emp.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-neutral-700">{emp.department}</td>
                  <td className="py-3 px-4 text-neutral-600">{emp.position}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={emp.status} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded text-[10px]">
                      {emp.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {emp.deviceVerified ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Bound
                      </span>
                    ) : (
                      <span className="text-neutral-400">Unbound</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {emp.faceVerified ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <ScanFace className="w-3.5 h-3.5" /> Ready (99%)
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setViewCandidate(emp)}
                        className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(emp)}
                        className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteCandidate(emp)}
                        className="p-1.5 rounded-lg border border-neutral-200 hover:bg-rose-50 hover:text-rose-600 text-neutral-400"
                        title="Disable / Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Employee */}
      {(isAddModalOpen || editingEmployee) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingEmployee(null);
          }}
          title={editingEmployee ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
          description="Masukkan informasi karyawan untuk pembuatan kredensial akses."
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEmployee} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Andi Wijaya"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Perusahaan
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@company.id"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Departemen
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  {departments.filter((d) => d !== 'Semua').map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Jabatan / Posisi
                </label>
                <input
                  type="text"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Contoh: Backend Engineer"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Role Sistem
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="Employee">Employee (Standar)</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Manager">Manager</option>
                  <option value="HR">HR Specialist</option>
                  <option value="Admin">Admin</option>
                  <option value="Superadmin">Superadmin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingEmployee(null);
                }}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs"
              >
                {editingEmployee ? 'Simpan Perubahan' : 'Daftarkan Karyawan'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete / Disable Confirmation Modal */}
      {deleteCandidate && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setDeleteCandidate(null)}
          onConfirm={handleConfirmDelete}
          title="Hapus Karyawan?"
          description={`Data karyawan ${deleteCandidate.name} (${deleteCandidate.employeeId}) akan dinonaktifkan dari sistem absensi.`}
          confirmText="Hapus"
          cancelText="Batal"
          variant="danger"
        />
      )}

      {/* View Detail Modal */}
      {viewCandidate && (
        <Modal
          isOpen={true}
          onClose={() => setViewCandidate(null)}
          title={`Profil: ${viewCandidate.name}`}
          description={`${viewCandidate.employeeId} • ${viewCandidate.position}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
              <img
                src={viewCandidate.avatar}
                alt={viewCandidate.name}
                className="w-14 h-14 rounded-xl object-cover border"
              />
              <div>
                <p className="text-sm font-bold text-neutral-900">{viewCandidate.name}</p>
                <p className="text-neutral-500">{viewCandidate.email}</p>
                <p className="text-neutral-500">{viewCandidate.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-neutral-50 border">
                <span className="text-[10px] text-neutral-400 block font-bold uppercase">Role</span>
                <span className="font-semibold text-neutral-900">{viewCandidate.role}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border">
                <span className="text-[10px] text-neutral-400 block font-bold uppercase">Dept</span>
                <span className="font-semibold text-neutral-900">{viewCandidate.department}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewCandidate(null)}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-semibold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
