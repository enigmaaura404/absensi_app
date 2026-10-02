import React, { useState } from 'react';
import {
  Send,
  Check,
  Bell,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Users,
  Settings,
  Sparkles,
} from 'lucide-react';

export const TelegramBotPage: React.FC = () => {
  const [notificationToggles, setNotificationToggles] = useState({
    checkIn: true,
    checkOut: true,
    lateAttendance: true,
    approval: true,
    securityAlert: true,
    dailyReport: true,
  });

  const [testSent, setTestSent] = useState(false);

  const toggle = (key: keyof typeof notificationToggles) => {
    setNotificationToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendTestMessage = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
          Telegram Bot Integration
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Notifikasi instan untuk tim HR & manajemen mengenai keterlambatan, pengajuan approval, dan peringatan kecurangan.
        </p>
      </div>

      {testSent && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pesan uji coba berhasil dikirim ke grup Telegram Manajemen!</span>
        </div>
      )}

      {/* Bot Connection Card (Prompt Specified Layout) */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0">
              <Send className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-neutral-900">Attendance Monitoring Bot</h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Connected
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Username: @AttendanceMonitoringBot • Token: ••••••••:AAHq••••••••
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSendTestMessage}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim Notifikasi Tes</span>
          </button>
        </div>

        {/* Access Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-neutral-100 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase block">
                Access Mode
              </span>
              <span className="font-bold text-neutral-900 text-sm mt-0.5 block">
                Private / Invite Only
              </span>
            </div>
            <span className="text-neutral-400 text-xs">Admin Group</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase block">
                Registered Users (Admin)
              </span>
              <span className="font-bold text-neutral-900 text-sm mt-0.5 block">
                7 Pengguna Terhubung
              </span>
            </div>
            <button
              onClick={() => alert('Daftar Admin Telegram: Siti Rahma, Andi Wijaya, Budi Santoso, Tri Mulyadi, Dewi Anggraini, HR Bot Manager.')}
              className="text-xs font-semibold text-neutral-900 underline"
            >
              Manage Access
            </button>
          </div>
        </div>
      </div>

      {/* Notification Preferences (Prompt Specified Toggles) */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-neutral-900">
          Konfigurasi Trigger Notifikasi Bot
        </h3>

        <div className="divide-y divide-neutral-100">
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-900">Check-In Notification</p>
              <p className="text-[11px] text-neutral-500">Notifikasi saat karyawan melakukan absensi masuk</p>
            </div>
            <button
              onClick={() => toggle('checkIn')}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                notificationToggles.checkIn ? 'bg-neutral-900' : 'bg-neutral-200'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  notificationToggles.checkIn ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-900">Check-Out Notification</p>
              <p className="text-[11px] text-neutral-500">Notifikasi saat karyawan menyelesaikan jam kerja</p>
            </div>
            <button
              onClick={() => toggle('checkOut')}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                notificationToggles.checkOut ? 'bg-neutral-900' : 'bg-neutral-200'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  notificationToggles.checkOut ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-900">Late Attendance Alert</p>
              <p className="text-[11px] text-neutral-500">Peringatan otomatis jika karyawan terlambat melebihi grace period</p>
            </div>
            <button
              onClick={() => toggle('lateAttendance')}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                notificationToggles.lateAttendance ? 'bg-neutral-900' : 'bg-neutral-200'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  notificationToggles.lateAttendance ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-900">Approval Request Alert</p>
              <p className="text-[11px] text-neutral-500">Alert permohonan cuti dan sakit baru ke smartphone manajer</p>
            </div>
            <button
              onClick={() => toggle('approval')}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                notificationToggles.approval ? 'bg-neutral-900' : 'bg-neutral-200'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  notificationToggles.approval ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-900">Security Alert</p>
              <p className="text-[11px] text-neutral-500">Peringatan darurat percobaan fake GPS atau spoofing biometrik</p>
            </div>
            <button
              onClick={() => toggle('securityAlert')}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                notificationToggles.securityAlert ? 'bg-neutral-900' : 'bg-neutral-200'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  notificationToggles.securityAlert ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-neutral-900">Daily Attendance Summary Report</p>
              <p className="text-[11px] text-neutral-500">Ringkasan harian pukul 18:30 WIB mengenai persentase kehadiran</p>
            </div>
            <button
              onClick={() => toggle('dailyReport')}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                notificationToggles.dailyReport ? 'bg-neutral-900' : 'bg-neutral-200'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  notificationToggles.dailyReport ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
