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

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Security Events & Fraud Prevention
          </h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            Active Guard
          </span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Deteksi otomatis percobaan spoofing biometrik, manipulasi fake GPS mock, dan anomali login.
        </p>
      </div>

      {/* KPI Metrics Cards (Prompt Specified) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Failed Login"
          value="12"
          subtext="Kesalahan password berulang"
          icon={Lock}
          variant="warning"
        />

        <StatCard
          title="Face Verification Failed"
          value="3"
          subtext="Liveness check tidak lolos"
          icon={ScanFace}
          variant="danger"
        />

        <StatCard
          title="Suspicious GPS"
          value="2"
          subtext="Indikasi Mock/Fake GPS"
          icon={MapPin}
          variant="danger"
        />

        <StatCard
          title="Device Blocked"
          value="1"
          subtext="Perangkat ilegal dibekukan"
          icon={Smartphone}
          variant="default"
        />
      </div>

      {/* Security Incident Log Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900">Log Insiden Keamanan Terbaru</h3>
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
              {events.map((ev) => (
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
              ))}
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
