import React from 'react';
import { ShieldCheck, Check, Lock, User, Users, Sliders, Shield } from 'lucide-react';

export const RbacMatrixSection: React.FC = () => {
  const roles = [
    {
      role: 'Employee',
      scope: 'Attendance / Request / History',
      description: 'Presensi mandiri, pengajuan cuti & izin, monitoring riwayat kerja pribadi, verifikasi selfie & perangkat.',
      accessLevel: 'Self-Service',
      icon: User,
      modules: ['Presensi Harian', 'Pengajuan Cuti', 'Riwayat Kerja', 'Profil Pribadi'],
    },
    {
      role: 'Supervisor',
      scope: 'Team / Approval',
      description: 'Monitoring kehadiran anggota regu kerja secara langsung dan persetujuan pengajuan tingkat pertama.',
      accessLevel: 'Team Lead',
      icon: Users,
      modules: ['Presensi Mandiri', 'Approval Tim', 'Monitoring Regu Kerja', 'Rekap Tim'],
    },
    {
      role: 'Manager',
      scope: 'Team / Approval / Reports',
      description: 'Evaluasi kinerja divisi, approval tingkat lanjut, dan akses laporan keterlambatan & jam kerja komprehensif.',
      accessLevel: 'Department Head',
      icon: Users,
      modules: ['Semua Modul Supervisor', 'Approval Lanjut', 'Ekspor Laporan', 'Analisis Divisi'],
    },
    {
      role: 'HR',
      scope: 'Employees / Attendance / Reports',
      description: 'Manajemen direktori karyawan, persetujuan hak cuti, kalender libur nasional, dan rekapitulasi data payroll.',
      accessLevel: 'People Ops',
      icon: ShieldCheck,
      modules: ['Data Karyawan', 'Approval HR', 'Kalender & Libur', 'Laporan Lengkap'],
    },
    {
      role: 'Admin',
      scope: 'Operations / Management',
      description: 'Pengaturan geofence kantor cabang, binding hardware smartphone, audit forensik, dan konfigurasi operasional.',
      accessLevel: 'Operations',
      icon: Sliders,
      modules: ['Semua Modul HR', 'Lokasi Geofence', 'Manajemen Perangkat', 'Audit Trail'],
    },
    {
      role: 'Superadmin',
      scope: 'Full System Control',
      description: 'Kendali penuh atas seluruh data master (CRUD), matriks permission, integrasi cloud, dan konfigurasi inti sistem.',
      accessLevel: 'Executive / Root',
      icon: Shield,
      modules: ['Full Master Data CRUD', 'RBAC & Permission', 'Integrasi API Cloud', 'System Settings'],
    },
  ];

  return (
    <section className="py-24 bg-neutral-900 text-white border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Granular Access Governance</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Setiap user melihat apa yang memang mereka butuhkan.
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Sistem menerapkan arsitektur <strong className="text-emerald-400 font-bold">Role-Based Access Control (RBAC) + Granular Permission</strong> untuk menjamin prinsip *least privilege*, menjaga privasi data, dan mencegah kekacauan navigasi.
          </p>
        </div>

        {/* Roles Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {roles.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.role}
                className="p-6 rounded-2xl bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-neutral-800 text-emerald-400 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-white">{item.role}</h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-850 text-neutral-400 border border-neutral-800">
                      {item.accessLevel}
                    </span>
                  </div>

                  <div className="pt-1">
                    <span className="text-xs font-semibold text-emerald-400 block font-mono">
                      → {item.scope}
                    </span>
                    <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-850 space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Cakupan Modul:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.modules.map((mod) => (
                      <span
                        key={mod}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-850 text-neutral-300 border border-neutral-800 flex items-center gap-1"
                      >
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
