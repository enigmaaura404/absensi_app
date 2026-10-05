/**
 * GoogleSheetsPage — Live integration with backend API
 * Superadmin only: configures Google Sheets OAuth2 for automatic attendance reporting
 */
import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Plug,
  PlugZap,
  TableProperties,
} from 'lucide-react';
import { apiClient } from '../../services/api/api.client';

type Status = 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

export const GoogleSheetsPage: React.FC = () => {
  const [status, setStatus] = useState<Status>('DISCONNECTED');
  const [configuredKeys, setConfiguredKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [sheetId, setSheetId] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    apiClient.getIntegrationProvider('GOOGLE_SHEETS')
      .then((p) => {
        setStatus(p.status as Status);
        setConfiguredKeys(p.configuredKeys || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    const settings: { key: string; value: string }[] = [];
    if (clientId) settings.push({ key: 'CLIENT_ID', value: clientId });
    if (clientSecret) settings.push({ key: 'CLIENT_SECRET', value: clientSecret });
    if (refreshToken) settings.push({ key: 'REFRESH_TOKEN', value: refreshToken });
    if (sheetId) settings.push({ key: 'SHEET_ID', value: sheetId });

    if (!settings.length) return;
    setIsSaving(true);
    setFeedback(null);
    try {
      await apiClient.saveIntegrationSettings('GOOGLE_SHEETS', settings);
      setClientId(''); setClientSecret(''); setRefreshToken(''); setSheetId('');
      const provider = await apiClient.getIntegrationProvider('GOOGLE_SHEETS');
      setConfiguredKeys(provider.configuredKeys || []);
      setFeedback({ ok: true, message: 'Credential berhasil disimpan dan dienkripsi.' });
    } catch (err: any) {
      setFeedback({ ok: false, message: err.message || 'Gagal menyimpan.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setFeedback(null);
    try {
      const result = await apiClient.testIntegrationConnection('GOOGLE_SHEETS');
      setFeedback(result);
      setStatus(result.ok ? 'CONNECTED' : 'ERROR');
    } catch (err: any) {
      setFeedback({ ok: false, message: err.message || 'Koneksi gagal.' });
      setStatus('ERROR');
    } finally {
      setIsTesting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Yakin ingin memutus koneksi Google Sheets?')) return;
    try {
      await apiClient.disconnectIntegration('GOOGLE_SHEETS');
      setStatus('DISCONNECTED');
      setConfiguredKeys([]);
      setFeedback({ ok: true, message: 'Koneksi Google Sheets diputus.' });
    } catch (err: any) {
      setFeedback({ ok: false, message: err.message || 'Gagal memutus koneksi.' });
    }
  };

  const statusBadge: Record<Status, { label: string; cls: string }> = {
    CONNECTED: { label: 'Terhubung', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    DISCONNECTED: { label: 'Belum Terhubung', cls: 'bg-neutral-100 text-neutral-600 border-neutral-200' },
    ERROR: { label: 'Error', cls: 'bg-rose-100 text-rose-700 border-rose-200' },
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">Google Sheets Integration</h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Sinkronisasi otomatis laporan absensi ke Google Sheets cloud.
        </p>
      </div>

      {feedback && (
        <div className={`p-3.5 rounded-2xl border flex items-start gap-2 text-xs font-medium ${
          feedback.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-700'
        }`}>
          {feedback.ok ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
          {feedback.message}
        </div>
      )}

      {/* Connection Card */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-neutral-900">Google Sheets</h3>
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
              <button type="button" onClick={handleDisconnect}
                className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors flex items-center gap-1.5">
                <PlugZap className="w-3.5 h-3.5" /> Putus
              </button>
            )}
            <button type="button" onClick={handleTest} disabled={isTesting || configuredKeys.length < 3}
              className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow transition-colors flex items-center gap-2 disabled:opacity-50">
              {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plug className="w-3.5 h-3.5" />}
              Test Koneksi
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="mt-8 border-t border-neutral-100 pt-6 space-y-4">
          <h4 className="text-sm font-semibold text-neutral-800">Kredensial OAuth2 + Spreadsheet</h4>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                Client ID {configuredKeys.includes('CLIENT_ID') && <span className="text-emerald-600">✓</span>}
              </label>
              <input type="text" value={clientId} onChange={(e) => setClientId(e.target.value)}
                placeholder="123456-abc.apps.googleusercontent.com"
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-900" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                Client Secret {configuredKeys.includes('CLIENT_SECRET') && <span className="text-emerald-600">✓</span>}
              </label>
              <div className="relative">
                <input type={showSecret ? 'text' : 'password'} value={clientSecret} onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="GOCSPX-..."
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-900" />
                <button type="button" onClick={() => setShowSecret(!showSecret)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400">
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                Refresh Token {configuredKeys.includes('REFRESH_TOKEN') && <span className="text-emerald-600">✓</span>}
              </label>
              <div className="relative">
                <input type={showToken ? 'text' : 'password'} value={refreshToken} onChange={(e) => setRefreshToken(e.target.value)}
                  placeholder="1//0e..."
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-900" />
                <button type="button" onClick={() => setShowToken(!showToken)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400">
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                Spreadsheet ID {configuredKeys.includes('SHEET_ID') && <span className="text-emerald-600">✓</span>}
              </label>
              <input type="text" value={sheetId} onChange={(e) => setSheetId(e.target.value)}
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74IT8tf9A..."
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-900" />
              <p className="text-[11px] text-neutral-400 mt-1">
                Ambil dari URL: docs.google.com/spreadsheets/d/<strong>[ID INI]</strong>/edit
              </p>
            </div>
          </div>

          <button type="button" onClick={handleSave} disabled={isSaving || (!clientId && !clientSecret && !refreshToken && !sheetId)}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow transition flex items-center gap-2 disabled:opacity-50">
            {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Simpan & Enkripsi
          </button>

          <p className="text-[11px] text-neutral-400">
            🔐 Credential dienkripsi AES-256-GCM. Sync dilakukan secara background (non-blocking) setiap check-in/check-out.
          </p>
        </div>
      </div>

      {/* Columns Info */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm">
        <h4 className="text-sm font-semibold text-neutral-800 flex items-center gap-2 mb-4">
          <TableProperties className="w-4 h-4 text-emerald-600" />
          Kolom Sheet yang Di-sync Otomatis
        </h4>
        <div className="overflow-x-auto">
          <table className="text-xs w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-100">
                {['Kolom', 'Keterangan', 'Contoh'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 font-semibold text-neutral-500 bg-neutral-50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {[
                ['Tanggal', 'Tanggal presensi', '2026-10-04'],
                ['Nama Karyawan', 'Full name dari database', 'Budi Santoso'],
                ['NIK / Kode', 'Employee number', 'EMP-00101'],
                ['Departemen', 'Nama departemen', 'Technology'],
                ['Jam Masuk', 'Waktu check-in (WIB)', '08:01:32'],
                ['Jam Keluar', 'Waktu check-out (WIB)', '17:05:12'],
                ['Durasi Kerja', 'Total jam bekerja', '9h 3m'],
                ['Status', 'TEPAT_WAKTU / TERLAMBAT', 'TERLAMBAT'],
                ['Menit Terlambat', 'Keterlambatan dari jadwal', '1'],
                ['Lokasi', 'Nama kantor dari geofence', 'Kantor Pusat Bandung'],
              ].map(([col, desc, ex]) => (
                <tr key={col} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-2 px-3 font-mono font-semibold text-neutral-800">{col}</td>
                  <td className="py-2 px-3 text-neutral-500">{desc}</td>
                  <td className="py-2 px-3 font-mono text-neutral-600 bg-neutral-50 rounded">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
