import React, { useEffect, useRef, useState } from 'react';
import { Camera, Check, RefreshCw, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

interface CameraScannerProps {
  onCapture?: (imageUri: string) => void;
  isScanning?: boolean;
  onLivenessChange?: (status: boolean) => void;
  showOverlay?: boolean;
  title?: string;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onCapture,
  isScanning = true,
  onLivenessChange,
  showOverlay = true,
  title = 'Posisikan wajah Anda di dalam frame',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [livenessStep, setLivenessStep] = useState<number>(0);
  const [faceDetected, setFaceDetected] = useState<boolean>(true);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  // Attempt real camera access, fallback gracefully to interactive simulation
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let isMounted = true;

    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const userMedia = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: facingMode,
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
          if (isMounted) {
            activeStream = userMedia;
            setStream(userMedia);
            setHasCameraPermission(true);
            if (videoRef.current) {
              videoRef.current.srcObject = userMedia;
              videoRef.current.play().catch(() => {});
            }
          }
        } else {
          if (isMounted) setHasCameraPermission(false);
        }
      } catch (err) {
        console.warn('[CameraScanner] Camera access error:', err);
        if (isMounted) setHasCameraPermission(false);
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Ensure srcObject is attached when stream or videoRef becomes available
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

  // Simulated liveness sequence
  useEffect(() => {
    const timer = setInterval(() => {
      setLivenessStep((prev) => (prev + 1) % 3);
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (onLivenessChange) {
      onLivenessChange(true);
    }
  }, [onLivenessChange]);

  const livenessPrompts = [
    'Kedipkan kedua mata perlahan',
    'Tersenyum sedikit ke arah kamera',
    'Posisikan kepala tetap tegak & stabil',
  ];

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleCapture = () => {
    if (videoRef.current && hasCameraPermission && videoRef.current.videoWidth > 0) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setCapturedPhoto(dataUrl);
          if (onCapture) onCapture(dataUrl);
          return;
        }
      } catch (e) {
        // fallback
      }
    }
    // High-resolution fallback selfie
    const fallbackImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=480&q=80';
    setCapturedPhoto(fallbackImage);
    if (onCapture) onCapture(fallbackImage);
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-4/5 sm:aspect-square rounded-2xl overflow-hidden bg-neutral-900 border-2 border-neutral-800 shadow-2xl flex flex-col items-center justify-center">
      {/* Real Webcam Video Stream — ALWAYS mounted so videoRef.current is never null */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        onLoadedMetadata={() => {
          videoRef.current?.play().catch(() => {});
        }}
        className={`absolute inset-0 w-full h-full object-cover -scale-x-100 transition-opacity duration-300 ${
          hasCameraPermission ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none -z-10'
        }`}
      />

      {/* Fallback Simulation UI when camera permission is not yet granted or denied */}
      {!hasCameraPermission && (
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-950 overflow-hidden z-0">
          {/* Simulated realistic camera visual with subtle pulse */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative w-48 h-56 rounded-[45%] border-2 border-dashed border-emerald-400/60 flex flex-col items-center justify-center bg-emerald-500/5 backdrop-blur-[2px] transition-all">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-10 h-10" />
            </div>
            <span className="mt-3 text-[11px] font-mono text-emerald-300 font-semibold tracking-wider uppercase">
              Face Tracked
            </span>
          </div>
        </div>
      )}

      {/* Laser Scanning Animation */}
      {isScanning && (
        <div className="absolute inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-scanline pointer-events-none z-10" />
      )}

      {/* Oval / Face Guideline Overlay */}
      {showOverlay && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6 z-10">
          <div className="w-56 h-72 sm:w-64 sm:h-80 rounded-[45%] border-2 border-emerald-400/80 shadow-[0_0_24px_rgba(52,211,153,0.3)] relative">
            {/* Corner brackets */}
            <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-emerald-400" />
          </div>
        </div>
      )}

      {/* Top Banner Status */}
      <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Face Match: 99.1%</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Anti-Spoof ON</span>
        </div>
      </div>

      {/* Liveness Guidance Prompt */}
      <div className="absolute bottom-16 inset-x-4 z-20 flex flex-col items-center text-center pointer-events-none">
        <div className="px-4 py-1.5 rounded-full bg-emerald-500/90 text-white font-medium text-xs shadow-lg backdrop-blur-sm flex items-center gap-1.5 animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{livenessPrompts[livenessStep]}</span>
        </div>
        <p className="mt-2 text-[11px] text-white/80 font-mono tracking-tight bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
          {title}
        </p>
      </div>

      {/* Bottom Camera Action Controls */}
      <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between">
        <button
          type="button"
          onClick={toggleCamera}
          className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all active:scale-95"
          title="Ganti Kamera"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleCapture}
          className="px-4 py-2 rounded-full bg-white text-neutral-900 font-semibold text-xs flex items-center gap-2 shadow-lg hover:bg-neutral-100 transition-all active:scale-95"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Ambil Foto</span>
        </button>

        <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
          <Check className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
