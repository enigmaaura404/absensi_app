import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Navigation,
  CheckCircle2,
  Trash2,
  Edit2,
  Sliders,
  Layers,
  Compass,
} from 'lucide-react';
import { GeofenceLocation } from '../../types';
import { Modal } from '../../components/common/Modal';

interface GeofencePageProps {
  locations: GeofenceLocation[];
  onAddLocation: (loc: GeofenceLocation) => void;
  onUpdateLocation: (loc: GeofenceLocation) => void;
  onDeleteLocation: (id: string) => void;
}

export const GeofencePage: React.FC<GeofencePageProps> = ({
  locations,
  onAddLocation,
  onUpdateLocation,
  onDeleteLocation,
}) => {
  const [selectedLoc, setSelectedLoc] = useState<GeofenceLocation>(locations[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<GeofenceLocation | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState('-6.917464');
  const [longitude, setLongitude] = useState('107.619123');
  const [radius, setRadius] = useState(100);
  const [address, setAddress] = useState('');

  const handleOpenAdd = () => {
    setEditingLoc(null);
    setName('');
    setCity('');
    setLatitude('-6.917464');
    setLongitude('107.619123');
    setRadius(100);
    setAddress('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (loc: GeofenceLocation) => {
    setEditingLoc(loc);
    setName(loc.name);
    setCity(loc.city);
    setLatitude(loc.latitude.toString());
    setLongitude(loc.longitude.toString());
    setRadius(loc.radiusMeters);
    setAddress(loc.address);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingLoc) {
      const updated: GeofenceLocation = {
        ...editingLoc,
        name,
        city,
        latitude: parseFloat(latitude) || -6.9174,
        longitude: parseFloat(longitude) || 107.6191,
        radiusMeters: radius,
        address,
      };
      onUpdateLocation(updated);
      setSelectedLoc(updated);
    } else {
      const newLoc: GeofenceLocation = {
        id: `geo-${Date.now()}`,
        name,
        city,
        latitude: parseFloat(latitude) || -6.9174,
        longitude: parseFloat(longitude) || 107.6191,
        radiusMeters: radius,
        address,
        active: true,
        totalEmployees: 0,
      };
      onAddLocation(newLoc);
      setSelectedLoc(newLoc);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            Lokasi Kantor & Geofence
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Atur batas radius GPS lokasi presensi kantor untuk memastikan karyawan check-in di area resmi.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Lokasi Kantor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Locations List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Daftar Kantor Terdaftar ({locations.length})
          </h3>

          <div className="space-y-2.5">
            {locations.map((loc) => {
              const isSelected = selectedLoc.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLoc(loc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                      : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold">{loc.name}</h4>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {loc.city}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-white/20 text-emerald-300'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      Radius {loc.radiusMeters} m
                    </span>
                  </div>

                  <p className={`text-[11px] mt-2 line-clamp-2 ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {loc.address}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className={isSelected ? 'text-neutral-300' : 'text-neutral-400'}>
                      {loc.totalEmployees} Karyawan Terdaftar
                    </span>
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(loc)}
                        className={`p-1 rounded hover:bg-neutral-500/20 ${isSelected ? 'text-white' : 'text-neutral-600'}`}
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {locations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onDeleteLocation(loc.id)}
                          className={`p-1 rounded hover:bg-rose-500/20 ${isSelected ? 'text-rose-300' : 'text-rose-600'}`}
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Visual Map & Coordinates Inspector */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-2xs">
            {/* Visual Geofence Map Simulator (High Fidelity Mock) */}
            <div className="relative w-full aspect-16/9 bg-neutral-900 flex items-center justify-center overflow-hidden">
              {/* Map grid lines */}
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px]" />
              <div className="absolute inset-x-0 h-px bg-white/10 top-1/2" />
              <div className="absolute inset-y-0 w-px bg-white/10 left-1/2" />

              {/* Map roads simulation */}
              <div className="absolute inset-x-0 h-10 bg-neutral-800/80 -rotate-12 transform top-1/3 border-y border-white/5" />
              <div className="absolute inset-y-0 w-12 bg-neutral-800/80 rotate-45 transform left-1/3 border-x border-white/5" />

              {/* Concentric Geofence Radius Circles */}
              <div
                style={{
                  width: `${Math.min(380, selectedLoc.radiusMeters * 2.2)}px`,
                  height: `${Math.min(380, selectedLoc.radiusMeters * 2.2)}px`,
                }}
                className="rounded-full border-2 border-emerald-400 bg-emerald-500/15 backdrop-blur-[1px] flex items-center justify-center relative shadow-[0_0_30px_rgba(52,211,153,0.3)] animate-pulse"
              >
                {/* Center Pin Marker */}
                <div className="w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center shadow-2xl border-2 border-emerald-400 z-10">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>

                {/* Distance Badge */}
                <div className="absolute -top-3 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-md">
                  Radius Geofence: {selectedLoc.radiusMeters} meter
                </div>
              </div>

              {/* Overlay Map Controls */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedLoc.name}</span>
                </span>
              </div>

              <div className="absolute bottom-4 right-4 z-20">
                <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-neutral-300 font-mono text-[10px] border border-white/10">
                  Lat: {selectedLoc.latitude.toFixed(4)}, Long: {selectedLoc.longitude.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Inspector Details */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                <div>
                  <h4 className="text-base font-bold text-neutral-900">{selectedLoc.name}</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">{selectedLoc.address}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(selectedLoc)}
                  className="px-3.5 py-1.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Edit Konfigurasi
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
                <div>
                  <span className="text-neutral-400 uppercase font-bold text-[10px] block">
                    Latitude
                  </span>
                  <span className="font-mono font-semibold text-neutral-800">
                    {selectedLoc.latitude}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 uppercase font-bold text-[10px] block">
                    Longitude
                  </span>
                  <span className="font-mono font-semibold text-neutral-800">
                    {selectedLoc.longitude}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 uppercase font-bold text-[10px] block">
                    Radius Maksimum
                  </span>
                  <span className="font-mono font-bold text-emerald-700">
                    {selectedLoc.radiusMeters} Meter
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 uppercase font-bold text-[10px] block">
                    Status Validasi
                  </span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Add / Edit Location */}
      {isModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          title={editingLoc ? 'Edit Lokasi Geofence' : 'Tambah Lokasi Kantor Baru'}
          description="Tentukan koordinat GPS dan radius jangkauan presensi karyawan."
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Nama Kantor
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Kantor Pusat Bandung / Cabang Surabaya"
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Kota / Wilayah
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Contoh: Bandung, Jawa Barat"
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Latitude
                </label>
                <input
                  type="text"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="-6.917464"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Longitude
                </label>
                <input
                  type="text"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="107.619123"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-neutral-700">
                  Radius Geofence: <strong className="font-mono text-neutral-900">{radius} meter</strong>
                </label>
                <span className="text-[11px] text-neutral-400">Rekomendasi: 50 - 150m</span>
              </div>
              <input
                type="range"
                min="30"
                max="500"
                step="10"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value, 10))}
                className="w-full accent-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Alamat Fisik Lengkap
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Asia Afrika No. 45, Gedung Graha Mandiri Lt. 8..."
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs"
              >
                {editingLoc ? 'Simpan Perubahan' : 'Save Location'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
