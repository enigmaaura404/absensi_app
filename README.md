# Sistem Absensi — Enterprise Smart Attendance Management System

> Platform manajemen absensi dan kehadiran modern berbasis web enterprise (PWA-ready) dengan arsitektur monorepo, **NestJS REST API**, **Prisma ORM**, **PostgreSQL**, verifikasi biometrik wajah & liveness detection, GPS Geofencing presisi, Device Binding, Audit Trail forensik, dan Role-Based Access Control (RBAC) granular.

---

## Daftar Isi

- [Gambaran Umum](#gambaran-umum)
- [Arsitektur & Tech Stack](#arsitektur--tech-stack)
- [Struktur Monorepo](#struktur-monorepo)
- [Fitur Utama](#fitur-utama)
- [Role & Hak Akses (RBAC)](#role--hak-akses-rbac)
- [Alur Absensi Berlapis](#alur-absensi-berlapis)
- [Panduan Instalasi & Menjalankan](#panduan-instalasi--menjalankan)
- [Database & Seed Data](#database--seed-data)
- [Akun Demo Terdaftar](#akun-demo-terdaftar)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Status & Roadmap Proyek](#status--roadmap-proyek)
- [Lisensi](#lisensi)

---

## Gambaran Umum

Sistem Absensi dirancang untuk operasional perusahaan berskala multi-cabang dengan kebijakan **Zero-Trust & Anti-Fraud**:

```text
Identitas Karyawan → Verifikasi Wajah → Liveness Detection 3D → GPS Validasi → Geofence Radius → Device Binding → Server Timestamp → Persistent Database → Audit Trail
```

Seluruh data bisnis berjalan di atas **Real Database Layer (PostgreSQL / Prisma ORM)** yang dilayani oleh **NestJS REST API** independen, bebas dari data tiruan (*zero mock data*).

---

## Arsitektur & Tech Stack

| Layer | Teknologi | Deskripsi |
|---|---|---|
| **Monorepo Manager** | PNPM Workspaces | Manajemen paket monorepo terpadu, dependency isolation, dan fast symlinking. |
| **Frontend Web** | React 19, TypeScript, Vite 8 | UI interaktif responsif berbasis komponen modular, atomic design, dan dark/light mode. |
| **Styling & UI** | Tailwind CSS v4, Motion, Lucide | Design system modern, mikro-animasi fluid, dan icon set enterprise. |
| **Backend API** | NestJS 10, Node.js 20+ | RESTful API arsitektur modular, JWT Strategy, Passport, Class Validator, CORS security. |
| **ORM & Database** | Prisma ORM, PostgreSQL | Skema data relasional kuat, migrasi otomatis, idempotent seed data, indeks teroptimasi. |
| **Authentication** | JWT (JSON Web Token) + BCrypt / SHA-256 | Multi-role stateless authentication dengan role normalization dan permission guards. |
| **Testing** | Vitest, Jest | Automated unit & integration testing untuk utilities, rule approval, reporting, dan auth. |

---

## Struktur Monorepo

```text
absensi_app/
├── apps/
│   ├── api/                     # NestJS REST API Server (Port 4000)
│   │   ├── src/
│   │   │   ├── attendance/      # Controller & Service Absensi (Check-in/out, History)
│   │   │   ├── auth/            # JWT Auth, Login, Strategy, Guards
│   │   │   ├── employees/       # Manajemen Karyawan & Profil
│   │   │   ├── requests/        # Pengajuan Cuti, Sakit, Izin, Dinas, Koreksi
│   │   │   ├── dashboard/       # Aggregator Statistik Role-based
│   │   │   ├── locations/       # Manajemen Geofence & Kantor Cabang
│   │   │   ├── devices/         # Device Binding & Penggantian Perangkat
│   │   │   ├── holidays/        # Kalender & Hari Libur Nasional
│   │   │   ├── audit/           # Forensik Audit Trail & Security Events
│   │   │   ├── notifications/   # Sistem Notifikasi Pengajuan & Alert
│   │   │   └── settings/        # System Settings & Konfigurasi Global
│   │   └── package.json
│   └── web/                     # Workspace package target untuk web client
├── packages/
│   ├── database/                # Prisma Schema, Migrations, Seed, & Verify
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # Model Relasional Database
│   │   │   ├── seed.ts          # Idempotent Seed Data (15 User, 177 Absensi)
│   │   │   └── verify.ts        # Script Otomatis Integritas Database
│   │   └── package.json
│   ├── types/                   # DTOs, Enums, dan Shared TypeScript Interfaces
│   ├── config/                  # Shared Configuration Constants
│   └── utils/                   # Shared Business Helpers
├── src/                         # React Frontend Application (Port 3000)
│   ├── components/              # Komponen UI: CameraScanner, Modal, Toast, Topbar, Sidebar
│   ├── config/                  # Client Environment & Navigasi RBAC
│   ├── pages/                   # Pages: Auth, Employee, Supervisor, Admin Dashboard
│   ├── services/                # API Client, Session Service, Biometric Verification
│   ├── types/                   # Client-side Types
│   ├── utils/                   # Geo, Time, Leave, Approval, Reporting Helpers
│   ├── App.tsx                  # Root Routing & State Hub
│   └── main.tsx
├── package.json                 # Monorepo Scripts Hub
├── pnpm-workspace.yaml          # Monorepo Workspace Definitions
├── tsconfig.json                # TypeScript Root Configuration
└── vite.config.ts               # Vite Configuration
```

---

## Fitur Utama

### 1. Absensi Masuk & Pulang (Check-In / Check-Out)
- **Kamera Biometrik Wajah**: Pengambilan selfie langsung dengan deteksi wajah real-time.
- **Liveness Detection & Anti-Spoofing**: Proteksi dari penggunaan foto statis, rekaman video, atau topeng.
- **Validasi Geofence GPS Presisi**: Perhitungan formula *Haversine* jarak radius kantor meter-level dengan toleransi akurasi GPS.
- **Server-Side Timestamp**: Waktu pencatatan mutlak berasal dari server untuk mencegah manipulasi jam lokal perangkat.
- **Validasi Single Device**: Pencegahan titip absen melalui kunci fingerprint ID perangkat unik.

### 2. Pengajuan, Perizinan & Koreksi
- **Kategori Lengkap**: Cuti Tahunan, Izin Sakit, Izin Pribadi, Dinas / Tugas Luar Kantor, dan Koreksi Jam Absensi.
- **Workflow Approval Multi-Tier**: Pengajuan Karyawan → Persetujuan Atasan Langsung / Supervisor → Validasi Final HR.
- **Validasi Bentrok Tanggal**: Algoritma cerdas yang mencegah pengajuan cuti tumpang tindih (*leave date overlap protection*).

### 3. Monitoring & Analitik Admin / HR
- **Dashboard Eksekutif**: Metrik kehadiran harian (*Hadir, Terlambat, Izin, Sakit, Cuti, Belum Masuk*).
- **Laporan Komprehensif**: Rekap kehadiran divisi, analisis persentase keterlambatan, dan jam kerja bersih.
- **Ekspor Dokumen**: Laporan siap cetak dalam format CSV, Excel, dan PDF untuk proses payroll.

### 4. Keamanan & Audit Trail Forensik
- **Audit Log Append-Only**: Seluruh aktivitas approval, perubahan shift, pembatalan, dan modifikasi tercatat tak terhapus.
- **Security Event Monitoring**: Deteksi anomali GPS (*Impossible Travel / Mock Location*), login gagal berulang, dan ketidaksesuaian biometrik.

---

## Role & Hak Akses (RBAC)

Sistem mendukung 6 role hierarkis dengan pembatasan hak akses ketat:

| Menu & Fitur | Employee | Supervisor | Manager | HR | Admin | Superadmin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Dashboard Kehadiran** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Check-In & Check-Out** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Form Pengajuan & Cuti** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Approval Permohonan Tim** | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Menu Tim Saya** | — | ✓ | ✓ | — | — | ✓ |
| **Laporan & Rekapitulasi** | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Ekspor Laporan Payroll** | — | — | ✓ | ✓ | ✓ | ✓ |
| **Manajemen Karyawan** | — | — | — | ✓ | ✓ | ✓ |
| **Kelola Radius Geofence** | — | — | — | — | ✓ | ✓ |
| **Manajemen Device Binding** | — | — | — | — | ✓ | ✓ |
| **Kalender & Hari Libur** | — | — | — | ✓ | ✓ | ✓ |
| **Audit Trail & Keamanan** | — | — | — | — | ✓ | ✓ |
| **Roles & Permissions** | — | — | — | — | — | ✓ |
| **System Settings** | — | — | — | ✓ | ✓ | ✓ |

---

## Alur Absensi Berlapis

```text
   Karyawan Buka Aplikasi
             ↓
     Login Akun (JWT)
             ↓
   Validasi Device Lock
             ↓
   Ambil Foto Selfie
             ↓
  Deteksi Wajah & Liveness
             ↓
   Ambil Koordinat GPS
             ↓
 Validasi Radius Geofence
             ↓
  Kirim ke NestJS Backend
             ↓
Catat Database & Audit Log
             ↓
    Status Selesai (UI)
```

---

## Panduan Instalasi & Menjalankan

### Prasyarat
- **Node.js**: Versi `>= 18.0.0` (Disarankan Node LTS v20+)
- **PNPM**: Versi `>= 8.0.0` (`npm install -g pnpm`)
- **Git**

### 1. Clone Repository & Setup Monorepo
```bash
git clone https://github.com/enigmaaura404/absensi_app.git
cd absensi_app

# Install seluruh dependensi lintas workspace
pnpm install
```

### 2. Konfigurasi Environment File
Salin template konfigurasi `.env.example`:
```bash
cp .env.example .env
```
Pastikan `DATABASE_URL` dan konfigurasi JWT telah disesuaikan:
```env
DATABASE_URL="file:./dev.db" # Atau postgresql://user:password@localhost:5432/absensi_db
JWT_SECRET="super-secret-jwt-key-for-attendance-system-2026"
PORT=4000
VITE_API_BASE_URL="http://localhost:4000/api"
```

### 3. Generate & Migrasi Database
```bash
# Generate Prisma Client
npm run db:generate

# Jalankan migrasi dan seed data realistis
npm run db:seed

# Jalankan validasi integritas database
npm run db:verify
```

### 4. Menjalankan Aplikasi Development
Jalankan server Backend NestJS (Port 4000) dan Client Vite (Port 3000) secara serentak:
```bash
npm run dev
```
Akses aplikasi melalui peramban:
- **Web Portal**: [http://localhost:3000](http://localhost:3000)
- **REST API Endpoint**: [http://localhost:4000/api](http://localhost:4000/api)

---

## Database & Seed Data

Sistem dilengkapi data awal sintetis (*synthetic demo data*) yang mencakup struktur organisasi perusahaan riil:

```bash
npm run db:verify
```
Output Verifikasi Integritas:
- ✅ **15 Pengguna & Karyawan** aktif lintas divisi (Teknologi, HR, Keuangan, Operasional, Pemasaran).
- ✅ **6 Role Hierarkis & 28 Permissions** relasional granular.
- ✅ **4 Shift Kerja** (Regular, Pagi, Sore, Malam/Overnight).
- ✅ **2 Kantor Cabang Geofence**:
  - *Kantor Pusat Bandung*: Jl. Asia Afrika No. 45 (Radius 100 meter).
  - *Kantor Cabang Jakarta*: Sudirman Central Business District (Radius 100 meter).
- ✅ **177 Riwayat Absensi Nyata** (Kombinasi Hadir Tepat Waktu, Terlambat, Cuti, dan Sakit).
- ✅ **15 Rekening Sisa Cuti** (*Leave Balance*) terhubung ke masing-masing karyawan.
- ✅ **9 Perangkat Terdaftar** (*Device Binding*).

---

## Akun Demo Terdaftar

Untuk memudahkan peninjauan, pada halaman login tersedia tombol **Quick Fill Demo Accounts**:

| Role | Nama | Email Kantor | Password |
|---|---|---|---|
| **Superadmin** | Andi Wijaya, M.Kom | `andi.wijaya@company.id` | `Superadmin123!` |
| **HR Head** | Siti Rahma | `siti.rahma@company.id` | `HR123!` |
| **Supervisor** | Ahmad Fauzi, S.T. | `ahmad.fauzi@company.id` | `Supervisor123!` |
| **Karyawan** | Budi Santoso | `budi.santoso@company.id` | `Employee123!` |
| **Manager Tech** | Tri Mulyadi | `tri.mulyadi@company.id` | `Manager123!` |
| **Admin Ops** | Bambang Soediro | `bambang.s@company.id` | `Admin123!` |

---

## Konfigurasi Scripts (Package.json)

| Perintah | Deskripsi |
|---|---|
| `npm run dev` | Menjalankan NestJS API (port 4000) & Vite Web (port 3000) secara paralel dengan *concurrently*. |
| `npm run dev:api` | Menjalankan backend NestJS API dalam watch mode. |
| `npm run dev:web` | Menjalankan frontend Vite client pada port 3000. |
| `npm run build` | Melakukan kompilasi types, build NestJS API, dan bundling produksi Vite. |
| `npm run lint` | Menjalankan static type checking `tsc --noEmit` di seluruh repo. |
| `npm test` | Menjalankan pengujian otomatis frontend (Vitest) dan backend (Jest). |
| `npm run db:seed` | Menjalankan seeding data realistis ke dalam database. |
| `npm run db:verify` | Menjalankan skrip validasi integritas 15 poin relasi database. |
| `npm run db:studio` | Membuka antarmuka grafis Prisma Studio untuk inspeksi tabel. |

---

## Testing & Quality Assurance

Sistem telah diuji secara menyeluruh dengan **119 automated test cases**:

```bash
npm test
```

Cakupan pengujian meliputi:
1. `leave.test.ts`: Perhitungan hari kerja, pemotongan kuota cuti, dan deteksi bentrok tanggal (*date overlap*).
2. `approval.test.ts`: Workflow persetujuan bertingkat dan audit jejak approval.
3. `geo.test.ts`: Formula validasi jarak geofence Haversine dan akurasi GPS.
4. `payroll.test.ts`: Perhitungan potongan gaji dan jam keterlambatan.
5. `auth.service.test.ts`: Validasi token JWT, hashing password, dan mapping role.
6. `reporting.test.ts`: Agregasi statistik kehadiran per departemen.
7. `device.test.ts`: Validasi sidik jari perangkat unik dan binding lock.
8. `biometric.service.test.ts`: Algoritma pencocokan kemiripan wajah.
9. `time.test.ts`: Validasi toleransi keterlambatan dan durasi kerja.

---

## Status & Roadmap Proyek

- [x] **Arsitektur Monorepo**: Integrasi PNPM Workspace lintas paket.
- [x] **Database Relasional Penuh**: Skema Prisma lengkap, migrasi, dan seed idempotent.
- [x] **Pembersihan Total Mock Data**: `src/data/mockData.ts` dihapus, 100% data persistent dari database.
- [x] **NestJS REST API**: 12 Controller, Services, JWT Authentication & RBAC Guards.
- [x] **Frontend Refactor**: Mengonsumsi data real-time dari backend API via Axios/Fetch client.
- [x] **Anti-Fraud & Biometrics**: Face detection, geofencing, single device lock, dan audit trail.
- [x] **Zero TypeScript Errors**: 100% type-safe compilation pada `tsc --noEmit`.
- [x] **Automated Test Suite**: 119 unit & integration tests lulus.
- [ ] **Push Notification**: Integrasi WebPush PWA untuk reminder jam kerja.
- [ ] **Multi-Company SaaS Mode**: Dukungan multi-tenancy untuk organisasi terpisah.

---

## Lisensi

Proyek ini dirilis di bawah lisensi [MIT](./LICENSE). Bebas digunakan dan dikembangkan untuk keperluan komersial maupun internal organisasi.

```text
MIT License — Copyright (c) 2026 Sistem Absensi Enterprise Contributors
```
