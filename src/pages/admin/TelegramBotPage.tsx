/**
 * TelegramBotPage — Live integration with backend API
 * Superadmin only: configures Telegram Bot Token, Chat ID, notification toggles
 */
import React, { useState, useEffect } from 'react';
import {
  Send,
  Check,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Settings,
  Bell,
  ShieldAlert,
  Clock,
  Eye,
  EyeOff,
  Plug,
  PlugZap,
} from 'lucide-react';
import { apiClient } from '../../services/api/api.client';

type Status = 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

export const TelegramBotPage: React.FC = () => {
  const [status, setStatus] = useState<Status>('DISCONNECTED');
  const [configuredKeys, setConfiguredKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [showToken, setShowToken] = useState(false);

  const [templates, setTemplates] = useState<any[]>([]);
  const [templateToggles, setTemplateToggles] = useState<Record<string, boolean>>({});

  // Load provider + templates
  useEffect(() => {
    const load = async () => {
      try {
        const [provider, tmpl] = await Promise.all([
          apiClient.getIntegrationProvider('TELEGRAM'),
          apiClient.getNotificationTemplates(),
        ]);
        setStatus(provider.status as Status);
        setConfiguredKeys(provider.configuredKeys || []);
        setTemplates(tmpl);
        const toggles: Record<string, boolean> = {};
        tmpl.forEach((t: any) => (toggles[t.event] = t.isActive));
        setTemplateToggles(toggles);
      } catch {
        // not connected — expected
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!botToken && !chatId) return;
    setIsSaving(true);
    setTestResult(null);
    try {
      const settings: { key: string; value: string }[] = [];
      if (botToken) settings.push({ key: 'BOT_TOKEN', value: botToken });
      if (chatId) settings.push({ key: 'CHAT_ID', value: chatId });
      await apiClient.saveIntegrationSettings('TELEGRAM', settings);
      setBotToken('');
      setChatId('');
      setTestResult({ ok: true, message: 'Pengaturan berhasil disimpan.' });
      // Refresh keys
      const provider = await apiClient.getIntegrationProvider('TELEGRAM');
      setConfiguredKeys(provider.configuredKeys || []);
    } catch (err: any) {
      setTestResult({ ok: false, message: err.message || 'Gagal menyimpan.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await apiClient.testIntegrationConnection('TELEGRAM');
      setTestResult(result);
      if (result.ok) {
        setStatus('CONNECTED');
      } else {
        setStatus('ERROR');
      }
    } catch (err: any) {
      setTestResult({ ok: false, message: err.message || 'Koneksi gagal.' });
      setStatus('ERROR');
    } finally {
      setIsTesting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Yakin ingin memutus koneksi Telegram?')) return;
    try {
      await apiClient.disconnectIntegration('TELEGRAM');
      setStatus('DISCONNECTED');
      setConfiguredKeys([]);
      setTestResult({ ok: true, message: 'Koneksi Telegram diputus.' });
    } catch (err: any) {
      setTestResult({ ok: false, message: err.message || 'Gagal memutus koneksi.' });
    }
  };

  const handleTemplateToggle = async (event: string) => {
    const newVal = !templateToggles[event];
    setTemplateToggles((prev) => ({ ...prev, [event]: newVal }));
    const tpl = templates.find((t) => t.event === event);
    if (tpl) {
      try {
        await apiClient.updateNotificationTemplate(event, tpl.template, newVal);
      } catch {
        setTemplateToggles((prev) => ({ ...prev, [event]: !newVal }));
      }
    }
  };

  const statusBadge: Record<Status, { label: string; cls: string }> = {
    CONNECTED: { label: 'Terhubung', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    DISCONNECTED: { label: 'Belum Terhubung', cls: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
    ERROR: { label: 'Error', cls: 'bg-rose-100 text-rose-700 border-rose-200' },
  };

  const notifCategories = [
    { key: 'CHECK_IN', label: 'Check-In', icon: Check, desc: 'Notifikasi setiap karyawan check-in' },
    { key: 'CHECK_OUT', label: 'Check-Out', icon: Check, desc: 'Notifikasi karyawan selesai kerja' },
    { key: 'LATE_CHECK_IN', label: 'Keterlambatan', icon: Clock, desc: 'Terlambat melebihi grace period' },
    { key: 'OUTSIDE_GEOFENCE', label: 'Luar Geofence', icon: ShieldAlert, desc: 'Check-in di luar radius kantor' },
    { key: 'FAILED_FACE_VERIFICATION', label: 'Gagal Verifikasi', icon: AlertCircle, desc: 'Face verification failure' },
    { key: 'FAILED_LOGIN', label: 'Login Gagal', icon: ShieldAlert, desc: 'Percobaan login yang mencurigakan' },
    { key: 'LEAVE_APPROVED', label: 'Cuti Disetujui', icon: CheckCircle2, desc: 'Notif approval cuti karyawan' },
    { key: 'LEAVE_CREATED', label: 'Pengajuan Cuti', icon: Bell, desc: 'Pengajuan cuti baru masuk' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
          Telegram Bot Integration
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Notifikasi instan presensi, keamanan, dan approval untuk tim HR & manajemen.
        </p>
      </div>

      {/* Feedback Alert */}
      {testResult && (
        <div className={`p-3.5 rounded-2xl border flex items-start gap-2 text-xs font-medium ${
          testResult.ok
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-700'
        }`}>
          {testResult.ok
            ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
          {testResult.message}
        </div>
      )}

      {/* Connection Card */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
              <Send className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-neutral-900">Telegram Bot</h3>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusBadge[status].cls}`}>
                  {statusBadge[status].label}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {configuredKeys.length > 0
                  ? `Dikonfigurasi: ${configuredKeys.join(', ')}`
                  : 'Belum ada konfigurasi tersimpan'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {status === 'CONNECTED' && (
              <button
                type="button"
                onClick={handleDisconnect}
                className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <PlugZap className="w-3.5 h-3.5" />
                Putus
              </button>
            )}
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting || configuredKeys.length === 0}
              className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plug className="w-3.5 h-3.5" />}
              Test Koneksi
            </button>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="mt-8 border-t border-neutral-100 pt-6 space-y-4">
          <h4 className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
            <Settings className="w-4 h-4 text-neutral-400" />
            Konfigurasi Bot
          </h4>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                Bot Token {configuredKeys.includes('BOT_TOKEN') && <span className="text-emerald-600">✓ Tersimpan</span>}
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder="1234567890:AAHq..."
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                Chat ID (Grup/Channel) {configuredKeys.includes('CHAT_ID') && <span className="text-emerald-600">✓ Tersimpan</span>}
              </label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="-100123456789"
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || (!botToken && !chatId)}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow transition flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Simpan & Enkripsi
          </button>

          <p className="text-[11px] text-neutral-400">
            🔐 Semua credential dienkripsi dengan AES-256-GCM sebelum disimpan di database. Token tidak pernah dikirim ke client.
          </p>
        </div>
      </div>

      {/* Notification Templates */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
        <h4 className="text-sm font-semibold text-neutral-800 flex items-center gap-2 mb-5">
          <Bell className="w-4 h-4 text-neutral-400" />
          Template Notifikasi
        </h4>
        <div className="space-y-3">
          {notifCategories.map(({ key, label, icon: Icon, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-2xl border border-neutral-100 hover:border-neutral-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-500 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">{label}</div>
                  <div className="text-xs text-neutral-500">{desc}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleTemplateToggle(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  templateToggles[key] ? 'bg-neutral-900' : 'bg-neutral-200'
                }`}
                aria-pressed={templateToggles[key]}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    templateToggles[key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
