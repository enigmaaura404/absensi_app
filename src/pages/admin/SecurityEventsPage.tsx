import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
  ScanFace,
  MapPin,
  Smartphone,
  CheckCircle2,
  Filter,
  Eye,
  Check,
} from 'lucide-react';
import { SecurityEventItem } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

interface SecurityEventsPageProps {
  events: SecurityEventItem[];
  onResolveEvent: (id: string) => void;
}

export const SecurityEventsPage: React.FC<SecurityEventsPageProps> = ({
  events,
  onResolveEvent,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<SecurityEventItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'All' | 'Critical' | 'Warning' | 'Info'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Investigating' | 'Action Required' | 'Resolved'>('All');

  // Dynamic KPI Metrics
  const failedLogins = events.filter((e) => e.type === 'Failed Login').length;
  const faceFailures = events.filter((e) => e.type === 'Face Verification Failed').length;
  const suspiciousGps = events.filter((e) => e.type === 'Suspicious GPS').length;
  const unresolvedCount = events.filter((e) => e.status !== 'Resolved').length;

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'All' || ev.severity === filterSeverity;
    const matchesStatus = filterStatus === 'All' || ev.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Security Events & Fraud Prevention
          </h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            {unresolvedCount > 0 ? `${unresolvedCount} Active Alerts` : 'System Secure'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Deteksi otomatis percobaan spoofing biometrik, manipulasi fake GPS mock, dan anomali login.
        </p>
      </div>

      {/* KPI Metrics Cards (Dynamic from real telemetry events) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Failed Login"
          value={failedLogins.toString()}
          subtext="Percobaan login gagal"
          icon={Lock}
          variant={failedLogins > 0 ? 'warning' : 'default'}
        />

        <StatCard
          title="Face Verification Failed"
          value={faceFailures.toString()}
          subtext="Liveness / anti-spoof reject"
          icon={ScanFace}
          variant={faceFailures > 0 ? 'danger' : 'default'}
        />

        <StatCard
          title="Suspicious GPS"
          value={suspiciousGps.toString()}
          subtext="Mock GPS / geofence breach"
          icon={MapPin}
          variant={suspiciousGps > 0 ? 'danger' : 'default'}
        />

        <StatCard
          title="Active Incidents"
          value={unresolvedCount.toString()}
          subtext="Memerlukan tindakan admin"
          icon={ShieldAlert}
          variant={unresolvedCount > 0 ? 'danger' : 'success'}
        />
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari berdasarkan tipe, user, IP, atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
            <Filter className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-neutral-500 shrink-0">Severity:</span>
            {(['All', 'Critical', 'Warning', 'Info'] as const).map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterSeverity === sev
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-neutral-500 shrink-0">Status:</span>
            {(['All', 'Action Required', 'Investigating', 'Resolved'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterStatus === st
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Security Incident Log Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Log Insiden Keamanan</h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Menampilkan {filteredEvents.length} dari {events.length} total rekaman forensik
            </p>
          </div>
          <span className="text-xs text-neutral-400 font-mono">Real-time Telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 text-[11px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Tipe Insiden</th>
                <th className="py-3 px-4">User Terkait</th>
                <th className="py-3 px-4">Tingkat Keparahan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-neutral-400">
                    Tidak ada insiden keamanan yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-neutral-600">
                      {ev.timestamp}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-neutral-900">
                      {ev.type}
                      <p className="text-[11px] font-normal text-neutral-500 mt-0.5 line-clamp-1">
                        {ev.description}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-neutral-800">
                      {ev.user}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={ev.severity} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={ev.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-500 text-[11px]">
                      {ev.ip}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedEvent(ev)}
                          className="px-2.5 py-1 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-700 font-semibold text-[11px]"
                        >
                          Detail
                        </button>
                        {ev.status !== 'Resolved' && (
                          <button
                            type="button"
                            onClick={() => onResolveEvent(ev.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px]"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEvent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedEvent(null)}
          title={`Forensik Keamanan: ${selectedEvent.type}`}
          description={`Insiden ID: ${selectedEvent.id} • ${selectedEvent.timestamp}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                Deskripsi Lengkap
              </span>
              <p className="text-neutral-800 font-medium mt-1 leading-relaxed">
                {selectedEvent.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-neutral-50 border">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">User</span>
                <span className="font-semibold text-neutral-900">{selectedEvent.user}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">IP Origin</span>
                <span className="font-mono text-neutral-900">{selectedEvent.ip}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              {selectedEvent.status !== 'Resolved' ? (
                <button
                  type="button"
                  onClick={() => {
                    onResolveEvent(selectedEvent.id);
                    setSelectedEvent(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Tandai Selesai (Resolve)</span>
                </button>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Masalah Telah Diinvestigasi
                </span>
              )}

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-xs"
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
