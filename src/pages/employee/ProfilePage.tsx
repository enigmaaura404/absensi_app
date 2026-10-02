import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  ScanFace,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Edit2,
  KeyRound,
  Check,
  RefreshCw,
  Sparkles,
  RotateCcw,
  Lock,
} from 'lucide-react';
import { User } from '../../types';
import { CameraScanner } from '../../components/common/CameraScanner';
import { Modal } from '../../components/common/Modal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';

interface ProfilePageProps {
  user: User;
  onNavigate: (route: string) => void;
  onUpdatePhone?: (phone: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onNavigate, onUpdatePhone }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'face' | 'device' | 'security'>('info');

  // Contact edit
  const [isEditing, setIsEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user.phone);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Face update modal
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const [faceUpdateSuccess, setFaceUpdateSuccess] = useState(false);

  // Device reset modal
  const [isDeviceResetModalOpen, setIsDeviceResetModalOpen] = useState(false);
  const [deviceResetSuccess, setDeviceResetSuccess] = useState(false);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdatePhone) onUpdatePhone(phoneNumber);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCaptureFace = () => {
    setIsFaceModalOpen(false);
    setFaceUpdateSuccess(true);
    setTimeout(() => setFaceUpdateSuccess(false), 3000);
  };

  const handleConfirmResetDevice = () => {
    setIsDeviceResetModalOpen(false);
    setDeviceResetSuccess(true);
    setTimeout(() => setDeviceResetSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-neutral-200 shadow-sm">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
              <Check className="w-4 h-4" />
            </div>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                  {user.name}
                </h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <span className="font-mono text-xs font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                    {user.employeeId}
                  </span>
                  <span className="text-xs text-neutral-400">•</span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                    {user.status}
                  </span>
                  <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                    {user.role}
                  </span>
                </div>
              </div>

              {activeTab === 'info' && (
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Batal' : 'Edit Kontak'}</span>
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm font-semibold text-neutral-700 mt-2">
              {user.position} • {user.department} Department
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>{user.email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>{phoneNumber}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span>Bergabung {user.joinDate}</span>
              </span>
            </div>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center animate-in fade-in">
            Informasi kontak berhasil diperbarui!
          </div>
        )}

        {faceUpdateSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center animate-in fade-in">
            Foto referensi wajah biometrik berhasil diperbarui!
          </div>
        )}

        {deviceResetSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold text-center animate-in fade-in">
            Permohonan reset/unbind perangkat telah dikirimkan ke HRD.
          </div>
        )}
      </div>

      {/* Secondary Tabs Navigation (Prompt Specified) */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-2 shadow-2xs flex items-center gap-1.5 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'info'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Informasi Pribadi
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('face')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'face'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <ScanFace className="w-3.5 h-3.5" />
          <span>Face Verification</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('device')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'device'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Perangkat</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Keamanan & Sandi</span>
        </button>
      </div>

      {/* TAB 1: Informasi */}
      {activeTab === 'info' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {isEditing && (
            <form onSubmit={handleSaveContact} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 uppercase">Ubah Nomor Telepon</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition-colors"
                >
                  Simpan Kontak
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                <UserIcon className="w-4 h-4 text-neutral-600" />
                <h3 className="text-sm font-bold text-neutral-900">Personal Information</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-neutral-50">
                  <span className="text-neutral-400">Nama Lengkap</span>
                  <span className="font-semibold text-neutral-900">{user.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-50">
                  <span className="text-neutral-400">NIK / KTP</span>
                  <span className="font-mono text-neutral-700">327325••••••••01</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-50">
                  <span className="text-neutral-400">Email Perusahaan</span>
                  <span className="text-neutral-700">{user.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-50">
                  <span className="text-neutral-400">Kota Domisili</span>
                  <span className="text-neutral-700">Bandung, Jawa Barat</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                <Briefcase className="w-4 h-4 text-neutral-600" />
                <h3 className="text-sm font-bold text-neutral-900">Employment Details</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-neutral-50">
                  <span className="text-neutral-400">ID Karyawan</span>
                  <span className="font-mono font-bold text-neutral-900">{user.employeeId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-50">
                  <span className="text-neutral-400">Departemen</span>
                  <span className="font-semibold text-neutral-700">{user.department}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-50">
                  <span className="text-neutral-400">Jabatan</span>
                  <span className="text-neutral-700">{user.position}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-50">
                  <span className="text-neutral-400">Status Kontrak</span>
                  <span className="font-semibold text-emerald-700">Karyawan Tetap (PKWTT)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Face Verification */}
      {activeTab === 'face' && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-2xs space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-neutral-100 pb-6">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md relative bg-neutral-900">
              <img src={user.avatar} alt="Face Reference" className="w-full h-full object-cover" />
              <div className="absolute inset-0 border border-emerald-400/50 rounded-2xl pointer-events-none" />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-3">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-base font-bold text-neutral-900">Foto Referensi Wajah Biometrik</h3>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Verified ✓
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Data biometrik aktif digunakan untuk memverifikasi keaslian wajah saat check-in & check-out.
              </p>
              <button
                type="button"
                onClick={() => setIsFaceModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold shadow-xs inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Perbarui Foto Referensi</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Face Match</span>
              <strong className="text-emerald-700">99.1% Akurasi</strong>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Liveness Check</span>
              <strong className="text-emerald-700">3D Live Active</strong>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Anti-Spoofing</span>
              <strong className="text-emerald-700">Hardware Depth ON</strong>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Perangkat */}
      {activeTab === 'device' && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-2xs space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-neutral-100 pb-5">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-emerald-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-7 h-7" />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-base font-bold text-neutral-900">Samsung Galaxy S24 Ultra</h3>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Bound & Active
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Operating System: Android 15 • Browser: Chrome Mobile 128 • Device ID: ••••••8241
              </p>
              <button
                type="button"
                onClick={() => setIsDeviceResetModalOpen(true)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
                <span>Ajukan Unbind / Ganti Ponsel</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 text-xs text-neutral-600 leading-relaxed">
            <strong>Single Device Policy:</strong> Untuk mencegah kecurangan titip absen, akun Anda hanya dapat melakukan presensi melalui perangkat yang sudah di-binding ini.
          </div>
        </div>
      )}

      {/* TAB 4: Keamanan */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-2xs space-y-4 animate-in fade-in duration-150">
          <h3 className="text-base font-bold text-neutral-900">Keamanan Akun</h3>
          <p className="text-xs text-neutral-500">Atur kata sandi dan riwayat sesi login Anda.</p>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => alert('Fitur ubah kata sandi: Link reset telah dikirimkan ke email terdaftar.')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-900 text-white font-semibold text-xs shadow-xs"
            >
              Kirim Link Ubah Kata Sandi
            </button>
          </div>
        </div>
      )}

      {/* Face Modal */}
      {isFaceModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsFaceModalOpen(false)}
          title="Update Foto Referensi Wajah"
          description="Posisikan wajah di dalam bingkai dengan pencahayaan jelas."
          maxWidth="md"
        >
          <div className="space-y-4">
            <CameraScanner title="Tatap kamera dan tahan posisi" />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFaceModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCaptureFace}
                className="px-5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold shadow-xs"
              >
                Simpan Wajah
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Device Reset Confirmation Modal */}
      {isDeviceResetModalOpen && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setIsDeviceResetModalOpen(false)}
          onConfirm={handleConfirmResetDevice}
          title="Ajukan Ganti / Unbind Perangkat?"
          description="Apakah Anda ingin melepas tautan smartphone ini dari akun Anda? Permohonan akan diajukan ke HRD untuk verifikasi keamanan."
          confirmText="Kirim Permohonan"
          cancelText="Batal"
          variant="warning"
        />
      )}
    </div>
  );
};
