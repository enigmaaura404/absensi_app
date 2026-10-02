import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  UserCheck,
  Calendar,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { MOCK_EMPLOYEES } from '../../data/mockData';

export const TimSayaPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  const teamMembers = [
    {
      id: 'tm-1',
      name: 'Budi Santoso',
      role: 'Senior Software Engineer',
      status: 'Hadir',
      checkIn: '08:01 WIB',
      location: 'Kantor Pusat Bandung (32m)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      phone: '0812-3456-7890',
    },
    {
      id: 'tm-2',
      name: 'Dewi Anggraini',
      role: 'Financial Analyst',
      status: 'Terlambat',
      checkIn: '08:24 WIB',
      location: 'Kantor Cabang Jakarta',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      phone: '0815-4433-2211',
    },
    {
      id: 'tm-3',
      name: 'Rizky Pratama',
      role: 'Operations Officer',
      status: 'Hadir',
      checkIn: '07:55 WIB',
      location: 'Kantor Pusat Bandung',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      phone: '0817-6655-4433',
    },
    {
      id: 'tm-4',
      name: 'Nadia Putri',
      role: 'Brand Specialist',
      status: 'Hadir',
      checkIn: '08:05 WIB',
      location: 'Kantor Cabang Jakarta',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      phone: '0819-3322-1100',
    },
    {
      id: 'tm-5',
      name: 'Hendra Gunawan',
      role: 'Legal Specialist',
      status: 'Cuti',
      checkIn: '-',
      location: 'Cuti Tahunan (Disetujui)',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      phone: '0812-9911-2233',
    },
  ];

  const filteredMembers = teamMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Kehadiran Tim Hari Ini
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700">
            5 Anggota Terpantau
          </span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Pantau status absensi langsung, jam masuk, dan keterlambatan bawahan di divisi Anda.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Anggota Tim"
          value="5"
          subtext="Divisi Teknologi & Operasional"
          icon={Users}
        />
        <StatCard
          title="Hadir Tepat Waktu"
          value="3"
          subtext="60% dari regu kerja"
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Terlambat"
          value="1"
          subtext="1 staf melewati 08:10"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Cuti / Izin"
          value="1"
          subtext="1 staf cuti terkonfirmasi"
          icon={Calendar}
          variant="info"
        />
      </div>

      {/* Toolbar Search & Status Filter */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
            Status:
          </span>
          {['Semua', 'Hadir', 'Terlambat', 'Cuti'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama anggota tim..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-11 h-11 rounded-full object-cover border border-neutral-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{member.name}</h4>
                    <p className="text-xs text-neutral-500">{member.role}</p>
                  </div>
                </div>
                <StatusBadge status={member.status} size="sm" />
              </div>

              <div className="mt-4 p-3 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Jam Check-In:</span>
                  <strong className="text-neutral-900 font-mono">{member.checkIn}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Lokasi:</span>
                  <span className="text-neutral-700 truncate max-w-[150px] font-medium">
                    {member.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-neutral-400 font-mono">{member.phone}</span>
              <a
                href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
              >
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>Hubungi</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
