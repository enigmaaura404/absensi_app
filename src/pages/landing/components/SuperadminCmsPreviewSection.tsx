import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Lock,
  Layers,
  Users,
  Building2,
  Calendar,
  KeyRound,
  MapPin,
  Smartphone,
  Sliders,
  DollarSign,
  Send,
  MoreVertical,
} from 'lucide-react';

export const SuperadminCmsPreviewSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDemoUser, setSelectedDemoUser] = useState<any | null>(null);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const cmsTree = [
    {
      category: 'People',
      icon: Users,
      items: ['Employees (CRUD)', 'Departments', 'Positions'],
    },
    {
      category: 'Workforce',
      icon: Calendar,
      items: ['Schedules', 'Shifts', 'Holidays (CRUD)'],
    },
    {
      category: 'Access Control',
      icon: KeyRound,
      items: ['Roles Matrix', 'Permissions RBAC'],
    },
    {
      category: 'Security & Forensics',
      icon: Lock,
      items: ['Device Binding', 'Audit Trail', 'Security Events'],
    },
    {
      category: 'Location & Perimeter',
      icon: MapPin,
      items: ['Geofences (CRUD)', 'Radius Polygons'],
    },
    {
      category: 'Integrations & API',
      icon: Send,
      items: ['Google Drive & Sheets', 'Telegram Bot', '2FA OTP'],
    },
    {
      category: 'System & Payroll',
      icon: Sliders,
      items: ['System Settings', 'Payroll Cut-off'],
    },
  ];

  const sampleEmployees = [
    {
      id: 'EMP-00124',
      name: 'Budi Santoso',
      role: 'Senior Software Engineer',
      department: 'Technology',
      status: 'Active',
      device: 'Samsung Galaxy S24 Ultra',
      verified: true,
    },
    {
      id: 'EMP-00018',
      name: 'Siti Rahma, S.Psi',
      role: 'Head of People & Culture',
      department: 'Human Resources',
      status: 'Active',
      device: 'iPhone 15 Pro',
      verified: true,
    },
    {
      id: 'EMP-00045',
      name: 'Ahmad Fauzi, S.T.',
      role: 'Engineering Team Lead',
      department: 'Technology',
      status: 'Active',
      device: 'Google Pixel 8',
      verified: true,
    },
  ];

  const filteredEmployees = sampleEmployees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="cms" className="py-24 bg-white border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Centralized System Management</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Kelola konfigurasi dan data inti sistem dari satu tempat.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            Seluruh fungsi CRUD data master, manajemen otorisasi, dan konfigurasi integrasi dikendalikan secara eksklusif oleh Superadmin melalui CMS internal yang aman dan terlindungi audit trail.
          </p>
        </div>

        {/* CMS Architecture Tree Grid */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50/80 border border-neutral-200/80 space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200/60 pb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Struktur Domain Superadmin CMS
              </h3>
              <p className="text-xs text-neutral-500">
                Akses level sistem terisolasi dari antarmuka karyawan publik untuk kepatuhan tata kelola ISO
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-neutral-700 bg-white border border-neutral-200 px-2.5 py-1 rounded-lg w-fit">
              Route Protected: /app/admin/*
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cmsTree.map((sec) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.category}
                  className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-2.5 text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-neutral-900">
                      {sec.category}
                    </span>
                  </div>

                  <ul className="space-y-1 text-[11px] text-neutral-600">
                    {sec.items.map((it) => (
                      <li key={it} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate">{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* CMS CRUD Interface Interactive Preview */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/90 shadow-xl space-y-6 text-left">
          {/* Header of CMS Table Preview */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Visual Preview Master Data CRUD
              </span>
              <h3 className="text-lg font-bold text-neutral-900 mt-0.5">
                Master Data Karyawan (Employees)
              </h3>
              <p className="text-xs text-neutral-500">
                Pencarian, filter status, tambah baru, edit, nonaktifkan, dan hapus dengan dialog konfirmasi.
              </p>
            </div>

            {/* Toolbar Buttons */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari karyawan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:border-neutral-900 w-44 sm:w-56"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedDemoUser({
                    name: 'Karyawan Baru',
                    role: 'Product Specialist',
                    department: 'Operations',
                    id: 'EMP-NEW',
                  });
                  setShowDemoModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tambah Karyawan</span>
              </button>
            </div>
          </div>

          {/* Interactive Table Mockup */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                <tr>
                  <th className="py-2.5 px-3">Karyawan</th>
                  <th className="py-2.5 px-3">Departemen & Jabatan</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Perangkat Bound</th>
                  <th className="py-2.5 px-3 text-right">Aksi CRUD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-bold text-neutral-900">{emp.name}</p>
                      <p className="text-[10px] font-mono text-neutral-400">{emp.id}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-neutral-800">{emp.role}</p>
                      <p className="text-[10px] text-neutral-500">{emp.department}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="text-neutral-700 font-medium truncate max-w-[180px]">{emp.device}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold">Face ID Terdaftar</p>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDemoUser(emp);
                            setShowDemoModal(true);
                          }}
                          className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                          title="Lihat Detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDemoUser(emp);
                            setShowDemoModal(true);
                          }}
                          className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDemoUser(emp);
                            setShowDemoModal(true);
                          }}
                          className="p-1.5 rounded-lg border border-neutral-200 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          title="Hapus"
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

          {/* Bottom Security Note */}
          <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-2">
            <span>
              🔒 CRUD system management dikendalikan dari Superadmin CMS berdasarkan RBAC dan audit trail.
            </span>
            <span className="font-mono text-[10px] text-neutral-400">
              Menampilkan {filteredEmployees.length} dari 124 data
            </span>
          </div>
        </div>

        {/* Demo Modal for Preview */}
        {showDemoModal && selectedDemoUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-md w-full p-6 space-y-4 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h4 className="text-sm font-bold text-neutral-900">
                  Preview CMS Record ({selectedDemoUser.id})
                </h4>
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="text-neutral-400 hover:text-neutral-700 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-neutral-50 rounded-xl space-y-1">
                  <p className="font-bold text-neutral-900 text-sm">{selectedDemoUser.name}</p>
                  <p className="text-neutral-600">{selectedDemoUser.role} • {selectedDemoUser.department}</p>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Ini adalah preview interaktif fitur CRUD pada landing page. Untuk menambah, menyunting, atau menghapus master data riil, silakan masuk sebagai Superadmin pada aplikasi terotentikasi.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDemoModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold hover:bg-neutral-50"
                >
                  Tutup Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
