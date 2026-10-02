import React, { useState } from 'react';
import {
  ScanFace,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Camera,
  AlertCircle,
  Check,
} from 'lucide-react';
import { User } from '../../types';
import { CameraScanner } from '../../components/common/CameraScanner';
import { Modal } from '../../components/common/Modal';

interface FaceVerificationPageProps {
  user: User;
}

export const FaceVerificationPage: React.FC<FaceVerificationPageProps> = ({ user }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [successUpdate, setSuccessUpdate] = useState(false);

  const handleCaptureNewFace = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setIsUpdateModalOpen(false);
      setSuccessUpdate(true);
      setTimeout(() => setSuccessUpdate(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
          Face Verification
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Verifikasi biometrik wajah referensi karyawan untuk pencegahan manipulasi dan kecurangan kehadiran.
        </p>
      </div>

      {successUpdate && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Foto referensi wajah Anda berhasil diperbarui dan disinkronkan ke database sistem!</span>
        </div>
      )}

      {/* Main Face Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Reference Face Preview */}
          <div className="relative">
            <div className="w-36 h-36 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md relative bg-neutral-900">
              <img
                src={user.avatar}
                alt="Reference Face"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border border-emerald-400/50 rounded-2xl pointer-events-none" />
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
              Verified ✓
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-lg font-bold text-neutral-900">
                Data Biometrik Wajah Aktif
              </h3>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                Match 99.1%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">
                  Terdaftar (Registered)
                </span>
                <span className="font-semibold text-neutral-800 font-mono mt-0.5 block">
                  20 September 2026
                </span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase font-bold">
                  Verifikasi Terakhir
                </span>
                <span className="font-semibold text-neutral-800 font-mono mt-0.5 block">
                  02 Oktober 2026 (08:01 WIB)
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsUpdateModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors shadow-xs inline-flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Update Face Reference</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Parameters Checklist (Prompt Specified) */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs">
        <h4 className="text-sm font-bold text-neutral-900 mb-4">
          Spesifikasi & Proteksi Biometrik
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Check className="w-4 h-4" />
            </div>
            <h5 className="text-xs font-bold text-neutral-900">Face Matching</h5>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Membandingkan 128 titik landmark biometrik wajah terhadap referensi dengan tingkat akurasi 99.8%.
            </p>
            <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Enabled ✓
            </span>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h5 className="text-xs font-bold text-neutral-900">Liveness Detection</h5>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Mendeteksi keaslian subjek manusia hidup melalui kedipan mata dan gerakan micro-expression secara realtime.
            </p>
            <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Enabled ✓
            </span>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h5 className="text-xs font-bold text-neutral-900">Anti-Spoof Protection</h5>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Mencegah pemalsuan melalui foto cetak, rekaman video layar tablet, atau topeng silikon 3D.
            </p>
            <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Enabled ✓
            </span>
          </div>
        </div>
      </div>

      {/* Modal: Update Face */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Pembaruan Foto Referensi Wajah"
        description="Ambil foto wajah Anda di pencahayaan yang cukup tanpa kacamata gelap atau masker."
        maxWidth="md"
      >
        <div className="space-y-4">
          <CameraScanner title="Tatap kamera dan tahan posisi" />

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsUpdateModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={isCapturing}
              onClick={handleCaptureNewFace}
              className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              {isCapturing ? 'Menyimpan Biometrik...' : 'Simpan Foto Referensi'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
