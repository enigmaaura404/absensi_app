import React, { useState } from 'react';
import {
  Sliders,
  Clock,
  ScanFace,
  MapPin,
  Smartphone,
  Save,
  CheckCircle2,
  Bell,
  HardDrive,
  Shield,
  Building,
} from 'lucide-react';

export interface SystemSettings {
  gracePeriod: number;
  requiredSelfie: boolean;
  faceVerification: boolean;
  livenessDetection: boolean;
  gpsRequired: boolean;
  geofenceRequired: boolean;
  companyName: string;
  timezone: string;
  workStartTime: string;
  workEndTime: string;
}

interface SystemSettingsPageProps {
  settings?: SystemSettings;
  onSaveSettings?: (settings: SystemSettings) => void;
}

const DEFAULT_SETTINGS: SystemSettings = {
  gracePeriod: 10,
  requiredSelfie: true,
  faceVerification: true,
  livenessDetection: true,
  gpsRequired: true,
  geofenceRequired: true,
  companyName: 'PT Teknologi Absensi Mandiri',
  timezone: 'Asia/Jakarta (WIB)',
  workStartTime: '08:00',
  workEndTime: '17:00',
};

export const SystemSettingsPage: React.FC<SystemSettingsPageProps> = ({
  settings = DEFAULT_SETTINGS,
  onSaveSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'General' | 'Attendance' | 'Security' | 'Notification' | 'Storage'>('Attendance');

  // Attendance settings states (Prompt Specified)
  const [gracePeriod, setGracePeriod] = useState(settings.gracePeriod.toString());
  const [requiredSelfie, setRequiredSelfie] = useState(settings.requiredSelfie);
  const [faceVerification, setFaceVerification] = useState(settings.faceVerification);
  const [livenessDetection, setLivenessDetection] = useState(settings.livenessDetection);
  const [gpsRequired, setGpsRequired] = useState(settings.gpsRequired);
  const [geofenceRequired, setGeofenceRequired] = useState(settings.geofenceRequired);

  // General settings
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [timezone, setTimezone] = useState(settings.timezone);
  const [workStartTime, setWorkStartTime] = useState(settings.workStartTime);
  const [workEndTime, setWorkEndTime] = useState(settings.workEndTime);

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: SystemSettings = {
      gracePeriod: parseInt(gracePeriod, 10) || 0,
      requiredSelfie,
      faceVerification,
      livenessDetection,
      gpsRequired,
      geofenceRequired,
      companyName,
      timezone,
      workStartTime,
      workEndTime,
    };

    if (onSaveSettings) {
      onSaveSettings(updatedSettings);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            System Settings & Kebijakan
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Konfigurasi aturan absensi, toleransi keterlambatan, verifikasi biometrik, dan sistem.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Konfigurasi</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pengaturan sistem berhasil disimpan dan langsung disinkronkan ke seluruh klien!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-2 shadow-2xs flex items-center gap-1.5 overflow-x-auto">
        {(['General', 'Attendance', 'Security', 'Notification', 'Storage'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Settings Form Container */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-2xs">
        {activeTab === 'Attendance' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="text-base font-bold text-neutral-900">Aturan & Validasi Presensi</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Konfigurasi parameter biometrik, toleransi menit, dan proteksi anti-spoof.
              </p>
            </div>

            {/* Grace Period */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-neutral-900">Grace Period (Toleransi Keterlambatan)</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Batas menit keterlambatan tanpa pemotongan tunjangan kehadiran.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={gracePeriod}
                  onChange={(e) => setGracePeriod(e.target.value)}
                  className="w-20 px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                />
                <span className="text-xs text-neutral-600 font-semibold">Menit</span>
              </div>
            </div>

            {/* Attendance Toggles (Prompt Specified) */}
            <div className="divide-y divide-neutral-100 text-xs">
              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-neutral-900">Required Selfie</p>
                  <p className="text-[11px] text-neutral-500">Wajib mengambil foto wajah saat check-in & check-out</p>
                </div>
                <button
                  type="button"
                  onClick={() => setRequiredSelfie(!requiredSelfie)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    requiredSelfie ? 'bg-neutral-900' : 'bg-neutral-200'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      requiredSelfie ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-neutral-900">Face Verification (Biometrik Wajah)</p>
                  <p className="text-[11px] text-neutral-500">Membandingkan wajah dengan foto referensi yang terdaftar</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFaceVerification(!faceVerification)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    faceVerification ? 'bg-neutral-900' : 'bg-neutral-200'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      faceVerification ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-neutral-900">Liveness Detection 3D</p>
                  <p className="text-[11px] text-neutral-500">Deteksi kedipan mata dan micro-expression pencegah foto cetak</p>
                </div>
                <button
                  type="button"
                  onClick={() => setLivenessDetection(!livenessDetection)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    livenessDetection ? 'bg-neutral-900' : 'bg-neutral-200'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      livenessDetection ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-neutral-900">GPS Required</p>
                  <p className="text-[11px] text-neutral-500">Wajib menyalakan GPS dan izin geolokasi browser smartphone</p>
                </div>
                <button
                  type="button"
                  onClick={() => setGpsRequired(!gpsRequired)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    gpsRequired ? 'bg-neutral-900' : 'bg-neutral-200'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      gpsRequired ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-neutral-900">Geofence Required</p>
                  <p className="text-[11px] text-neutral-500">Hanya izinkan absensi jika berada di dalam radius kantor</p>
                </div>
                <button
                  type="button"
                  onClick={() => setGeofenceRequired(!geofenceRequired)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    geofenceRequired ? 'bg-neutral-900' : 'bg-neutral-200'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      geofenceRequired ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'General' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Nama Perusahaan (Organization Name)
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 font-semibold focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Zona Waktu Standar Operasional
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                <option>Asia/Jakarta (WIB - UTC+7)</option>
                <option>Asia/Makassar (WITA - UTC+8)</option>
                <option>Asia/Jayapura (WIT - UTC+9)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Jam Mulai Shift Pagi
                </label>
                <input
                  type="time"
                  value={workStartTime}
                  onChange={(e) => setWorkStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Jam Akhir Shift Pagi
                </label>
                <input
                  type="time"
                  value={workEndTime}
                  onChange={(e) => setWorkEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Security' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
              <h4 className="font-bold text-neutral-900">Enkripsi Data Biometrik</h4>
              <p className="text-neutral-500 leading-relaxed">
                Landmark biometrik dienkripsi menggunakan standar FIPS 140-2 AES-256 pada level storage database.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
              <h4 className="font-bold text-neutral-900">Single Device Policy</h4>
              <p className="text-neutral-500 leading-relaxed">
                Binding hardware UUID smartphone wajib diaktifkan pada seluruh departemen.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'Notification' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <h4 className="font-bold text-neutral-900">Saluran Notifikasi Email</h4>
              <p className="text-neutral-500 mt-0.5">Email harian rekap kehadiran dikirimkan setiap pukul 18:30 WIB.</p>
            </div>
          </div>
        )}

        {activeTab === 'Storage' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <h4 className="font-bold text-neutral-900">Cloud Storage Backup</h4>
              <p className="text-neutral-500 mt-0.5">Penyimpanan arsip foto diarahkan otomatis ke Google Drive Enterprise.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
