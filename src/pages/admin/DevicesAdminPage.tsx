import React, { useState } from 'react';
import {
  Smartphone,
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Ban,
  Eye,
} from 'lucide-react';
import { DeviceItem } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { Modal } from '../../components/common/Modal';

interface DevicesAdminPageProps {
  devices: DeviceItem[];
  onUnbindDevice: (id: string) => void;
  onDisableDevice: (id: string) => void;
}

export const DevicesAdminPage: React.FC<DevicesAdminPageProps> = ({
  devices,
  onUnbindDevice,
  onDisableDevice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [selectedDevice, setSelectedDevice] = useState<DeviceItem | null>(null);
  const [actionType, setActionType] = useState<'unbind' | 'disable' | null>(null);
  const [viewDevice, setViewDevice] = useState<DeviceItem | null>(null);

  const filteredDevices = devices.filter((d) => {
    const matchesSearch =
      d.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.deviceModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.deviceId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Semua' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAction = (dev: DeviceItem, type: 'unbind' | 'disable') => {
    setSelectedDevice(dev);
    setActionType(type);
  };

  const handleConfirmAction = () => {
    if (!selectedDevice || !actionType) return;
    if (actionType === 'unbind') {
      onUnbindDevice(selectedDevice.id);
    } else {
      onDisableDevice(selectedDevice.id);
    }
    setSelectedDevice(null);
    setActionType(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Device Management (Hardware Binding)
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Daftar smartphone terdaftar dan kebijakan 1 akun 1 perangkat untuk mencegah kecurangan absensi.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
            Status:
          </span>
          {['Semua', 'Active', 'Suspicious', 'Disabled'].map((s) => (
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
            placeholder="Cari karyawan / model device..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>
      </div>

      {/* Devices Table (Prompt Specified Layout) */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 text-[11px] font-bold text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Device Model</th>
                <th className="py-3 px-4">OS & Browser</th>
                <th className="py-3 px-4">Device ID</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredDevices.map((dev) => (
                <tr key={dev.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-neutral-900">{dev.employeeName}</p>
                    <p className="text-[10px] text-neutral-400 font-mono">
                      {dev.employeeId} • {dev.department}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-neutral-800">
                    {dev.deviceModel}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600">
                    <p>{dev.os}</p>
                    <p className="text-[10px] text-neutral-400">{dev.browser}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-500">
                    {dev.deviceId}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-neutral-600 text-[11px]">
                    {dev.lastActive}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={dev.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setViewDevice(dev)}
                        className="px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-medium text-[11px]"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenAction(dev, 'unbind')}
                        className="px-2.5 py-1 rounded-lg border border-neutral-200 hover:border-amber-300 hover:bg-amber-50 text-neutral-700 hover:text-amber-700 font-medium text-[11px]"
                      >
                        Unbind
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenAction(dev, 'disable')}
                        className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-medium text-[11px]"
                      >
                        Disable
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedDevice && actionType && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => {
            setSelectedDevice(null);
            setActionType(null);
          }}
          onConfirm={handleConfirmAction}
          title={actionType === 'unbind' ? 'Lepas Binding Perangkat?' : 'Nonaktifkan Perangkat?'}
          description={
            actionType === 'unbind'
              ? `Perangkat ${selectedDevice.deviceModel} milik ${selectedDevice.employeeName} akan dilepas tautannya. Karyawan dapat mengaitkan perangkat baru.`
              : `Perangkat ${selectedDevice.deviceModel} akan diblokir dari sistem absensi.`
          }
          confirmText={actionType === 'unbind' ? 'Unbind Device' : 'Disable Device'}
          cancelText="Batal"
          variant={actionType === 'unbind' ? 'warning' : 'danger'}
        />
      )}

      {/* View Detail Modal */}
      {viewDevice && (
        <Modal
          isOpen={true}
          onClose={() => setViewDevice(null)}
          title="Detail Perangkat Karyawan"
          description={`ID: ${viewDevice.id} • ${viewDevice.employeeName}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100">
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                Model Perangkat
              </span>
              <p className="text-sm font-bold text-neutral-900 mt-0.5">{viewDevice.deviceModel}</p>
              <p className="font-mono text-neutral-500 mt-1">{viewDevice.deviceId}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-neutral-50 border">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">OS</span>
                <span className="font-semibold text-neutral-900">{viewDevice.os}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">Browser</span>
                <span className="font-semibold text-neutral-900">{viewDevice.browser}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewDevice(null)}
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
