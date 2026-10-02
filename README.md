# Sistem Absensi — Smart Attendance Management

> Platform manajemen kehadiran berbasis web (PWA-ready) dengan verifikasi biometrik wajah, GPS & Geofencing, Device Binding, Audit Trail, dan integrasi Google Workspace & Telegram.

---

## Daftar Isi

- [Gambaran Umum](#gambaran-umum)
- [Tech Stack](#tech-stack)
- [Struktur Proyek](#struktur-proyek)
- [Fitur Utama](#fitur-utama)
- [Role & Hak Akses (RBAC)](#role--hak-akses-rbac)
- [Alur Absensi](#alur-absensi)
- [Quick Start](#quick-start)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Akun Demo](#akun-demo)
- [Fase Pengembangan](#fase-pengembangan)

---

## Gambaran Umum

Sistem Absensi adalah platform manajemen kehadiran karyawan yang dirancang untuk mencegah fraud dengan pendekatan berlapis:

```
Identity → Face Verification → Liveness → GPS → Geofence → Device → Server Time → Audit Trail
```

Sistem ini berjalan sebagai **Single Page Application (React + Vite)** dengan arsitektur yang siap untuk backend NestJS + PostgreSQL dan integrasi Google Workspace.

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8 |
| **Styling** | Tailwind CSS v4 |
| **Animasi** | Motion (Framer Motion) |
| **Icons** | Lucide React |
| **Backend (planned)** | Node.js, NestJS |
| **Database (planned)** | PostgreSQL + Prisma ORM |
| **Auth (planned)** | Auth.js / JWT |
| **Storage** | Google Drive |
| **Reporting** | Google Sheets |
| **Notifikasi** | Telegram Bot |
| **Testing (planned)** | Vitest, Playwright |

---

## Struktur Proyek

```
absensi_app/
├── src/
│   ├── components/
│   │   ├── common/          # Toast, Modal, CommandMenu
│   │   └── layout/          # Sidebar, Topbar, MobileNav
│   ├── config/
│   │   └── navigation.ts    # RBAC + navigasi terpusat
│   ├── data/
│   │   └── mockData.ts      # Data mock untuk development
│   ├── pages/
│   │   ├── auth/            # LoginPage
│   │   ├── landing/         # LandingPage
│   │   ├── employee/        # Dashboard, Kehadiran, Pengajuan, dll.
│   │   ├── supervisor/      # Tim Saya
│   │   └── admin/           # Dashboard Admin, Approval, Laporan, dll.
│   ├── types/
│   │   └── index.ts         # TypeScript types & interfaces
│   ├── App.tsx
│   └── main.tsx
├── .env                     # ⚠️ JANGAN di-commit (ada di .gitignore)
├── .env.example             # Template environment variables
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Fitur Utama

### Absensi & Kehadiran
- **Check-In / Check-Out** dengan selfie, face verification, GPS, dan geofencing
- **Liveness Detection** untuk mencegah penggunaan foto/video palsu
- **Anti-Spoofing** — deteksi presentasi foto/layar
- **Server-Side Timestamp** — waktu absensi dari server, bukan device
- **Status Kehadiran**: Hadir, Terlambat, Izin, Sakit, Cuti, Dinas, Tidak Hadir, Libur

### Pengajuan & Perizinan
- Izin, Sakit, Cuti, Dinas, Koreksi Absensi
- Workflow approval: Karyawan → Atasan → HR/Admin
- Status: Pending, Approved, Rejected, Cancelled

### GPS & Geofencing
- Validasi koordinat GPS saat absensi
- Admin menentukan radius kantor (default: 100 meter)
- Deteksi **Fake GPS / Mock Location**
- **Impossible Travel Detection** (kecepatan perpindahan tidak wajar)

### Face Verification
- Kamera browser untuk selfie
- Face Detection memastikan ada wajah di foto
- Face Matching membandingkan dengan foto referensi karyawan
- Similarity threshold dapat dikonfigurasi via `.env`

### Device Binding
- Single Device Lock — satu akun hanya bisa dari satu perangkat
- Admin dapat melakukan unbind / rebind perangkat
- Penggantian perangkat memerlukan approval admin

### Dashboard Role-Based
- **Employee**: Status hari ini, tombol Check-In/Out, ringkasan bulan, sisa cuti
- **Admin/HR**: Total karyawan, rekap harian, notifikasi pengajuan, monitoring

### Security & Audit
- **Audit Trail** append-only — semua aksi penting dicatat
- **Security Events** — failed login, suspicious GPS, face verification gagal
- **2FA Superadmin** via OTP Telegram
- IP Whitelist untuk akun Superadmin

### Integrasi
- **Telegram Bot** — notifikasi check-in, approval, laporan harian, alert keamanan
- **Google Drive** — penyimpanan selfie, dokumen cuti/sakit, file laporan
- **Google Sheets** — sinkronisasi data kehadiran otomatis terjadwal
- **Google Calendar** — sinkronisasi hari libur nasional Indonesia

### Laporan & Ekspor
- Rekap harian, mingguan, bulanan, tahunan
- Laporan per karyawan dan per department
- Export: Excel, CSV, PDF
- Payroll Preparation (cut-off penggajian)

---

## Role & Hak Akses (RBAC)

| Fitur | Employee | Supervisor | Manager | HR | Admin | Superadmin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Check-In/Out | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Pengajuan | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Approval | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tim Saya | — | ✓ | ✓ | — | — | ✓ |
| Laporan | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| Export Laporan | — | — | ✓ | ✓ | ✓ | ✓ |
| Manajemen Karyawan | — | — | — | ✓ | ✓ | ✓ |
| Geofence | — | — | — | — | ✓ | ✓ |
| Device Management | — | — | — | — | ✓ | ✓ |
| Audit & Security | — | — | — | — | ✓ | ✓ |
| Kalender & Libur | — | — | — | ✓ | ✓ | ✓ |
| RBAC / Roles | — | — | — | — | — | ✓ |
| Integrasi | — | — | — | — | — | ✓ |
| 2FA Superadmin | — | — | — | — | — | ✓ |
| Payroll | — | — | — | — | — | ✓ |
| System Settings | — | — | — | ✓ | ✓ | ✓ |

---

## Alur Absensi

```
Karyawan Buka Aplikasi
        ↓
     Login
        ↓
  Device Validation
        ↓
    Ambil Selfie
        ↓
  Face Detection
        ↓
  Face Matching
        ↓
Liveness / Anti-Spoof
        ↓
  GPS Validation
        ↓
  Geofence Check
        ↓
  Server Timestamp
        ↓
  Attendance Record
        ↓
   Audit Trail
        ↓
Telegram Notification
```

---

## Quick Start

### Prasyarat

- Node.js >= 18
- npm >= 9

### Instalasi

```bash
# Clone repository
git clone https://github.com/enigmaaura404/absensi_app.git
cd absensi_app

# Install dependencies
npm install

# Salin template environment
cp .env.example .env
# Edit .env dan isi dengan nilai yang sesuai

# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`.

### Scripts

```bash
npm run dev      # Development server (port 3000)
npm run build    # Build production bundle
npm run preview  # Preview production build
npm run lint     # TypeScript type check
npm run clean    # Bersihkan dist dan server.js
```

---

## Konfigurasi Environment

Semua konfigurasi sistem disimpan di file `.env`. Salin [`.env.example`](./.env.example) sebagai template.

> ⚠️ **PENTING**: File `.env` sudah ada di `.gitignore`. Jangan pernah meng-commit file `.env` yang berisi kredensial nyata.

### Variabel Utama

#### App

| Variabel | Keterangan |
|---|---|
| `VITE_APP_NAME` | Nama aplikasi |
| `VITE_APP_ENV` | `development` / `staging` / `production` |
| `VITE_APP_URL` | URL frontend |
| `VITE_API_BASE_URL` | Base URL backend API |

#### Demo Login (Development Only)

| Variabel | Keterangan |
|---|---|
| `VITE_DEMO_EMPLOYEE_EMAIL` | Email akun Employee demo |
| `VITE_DEMO_EMPLOYEE_PASSWORD` | Password akun Employee demo |
| `VITE_DEMO_HR_EMAIL` | Email akun HR demo |
| `VITE_DEMO_HR_PASSWORD` | Password akun HR demo |
| `VITE_DEMO_SUPERADMIN_EMAIL` | Email akun Superadmin demo |
| `VITE_DEMO_SUPERADMIN_PASSWORD` | Password akun Superadmin demo |

> Kosongkan atau hapus variabel `VITE_DEMO_*` di production untuk menonaktifkan quick-login panel.

#### Database

| Variabel | Keterangan |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Prisma) |
| `DB_HOST` | Host database |
| `DB_PORT` | Port database (default: 5432) |
| `DB_NAME` | Nama database |
| `DB_USER` | Username database |
| `DB_PASSWORD` | Password database |
| `DB_SSL` | Aktifkan SSL (`true` di production) |

#### Authentication

| Variabel | Keterangan |
|---|---|
| `NEXTAUTH_SECRET` | Secret untuk Auth.js (min. 32 karakter) |
| `JWT_SECRET` | Secret JWT (min. 32 karakter) |
| `JWT_EXPIRES_IN` | Durasi token JWT (contoh: `8h`) |
| `SESSION_MAX_AGE` | Durasi sesi dalam detik |
| `REFRESH_TOKEN_SECRET` | Secret refresh token |

#### Superadmin 2FA

| Variabel | Keterangan |
|---|---|
| `SUPERADMIN_2FA_ENABLED` | Aktifkan 2FA (`true`/`false`) |
| `SUPERADMIN_OTP_EXPIRES_SECONDS` | Durasi OTP (default: 300 detik) |
| `SUPERADMIN_SESSION_TIMEOUT_MINUTES` | Timeout sesi Superadmin |
| `SUPERADMIN_IP_WHITELIST` | Daftar IP yang diizinkan (comma-separated) |

#### Telegram Bot

| Variabel | Keterangan |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Token dari @BotFather |
| `TELEGRAM_BOT_USERNAME` | Username bot (dengan @) |
| `TELEGRAM_MANAGEMENT_CHAT_ID` | Chat/Group ID untuk notifikasi HR |
| `TELEGRAM_SUPERADMIN_CHAT_ID` | Chat ID Superadmin |
| `TELEGRAM_2FA_CHAT_ID` | Chat ID untuk kirim OTP 2FA |
| `TELEGRAM_WEBHOOK_SECRET` | Secret untuk validasi webhook |
| `TELEGRAM_ALLOWED_USER_IDS` | Telegram User IDs yang diizinkan (comma-separated) |

#### Google Workspace

| Variabel | Keterangan |
|---|---|
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Email Service Account |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | Private key Service Account |
| `GOOGLE_PROJECT_ID` | Google Cloud Project ID |
| `GOOGLE_DRIVE_ROOT_FOLDER_ID` | ID folder root di Google Drive |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | ID spreadsheet untuk laporan |
| `GOOGLE_CALENDAR_HOLIDAY_ID` | ID Google Calendar hari libur Indonesia |

#### Geofencing

| Variabel | Keterangan |
|---|---|
| `VITE_DEFAULT_GEOFENCE_RADIUS_METERS` | Radius geofence default (meter) |
| `VITE_GEOFENCE_MAX_GPS_ACCURACY_METERS` | Batas akurasi GPS (meter) |

#### Face Verification

| Variabel | Keterangan |
|---|---|
| `VITE_FACE_VERIFICATION_ENABLED` | Aktifkan face verification |
| `VITE_FACE_SIMILARITY_THRESHOLD` | Threshold kesamaan wajah (0.0–1.0) |
| `VITE_LIVENESS_DETECTION_ENABLED` | Aktifkan liveness detection |
| `VITE_ANTI_SPOOFING_ENABLED` | Aktifkan anti-spoofing |

#### Device Binding

| Variabel | Keterangan |
|---|---|
| `VITE_DEVICE_BINDING_ENABLED` | Aktifkan device binding |
| `VITE_SINGLE_DEVICE_LOCK` | Satu akun = satu perangkat |
| `VITE_DEVICE_REPLACEMENT_REQUIRES_APPROVAL` | Pergantian device butuh approval |

---

## Akun Demo

Pada mode development, tersedia tiga akun demo untuk quick-login:

| Role | Email | Password |
|---|---|---|
| **Employee** | `budi@example.com` | `demo1234` |
| **HR (Admin)** | `siti.rahma@company.id` | `demo1234` |
| **Superadmin** | `andi.wijaya@company.id` | `demo1234` |

Kredensial demo dibaca dari variabel `VITE_DEMO_*` di file `.env`. Kosongkan variabel tersebut di production untuk menonaktifkan fitur quick-login.

---

## Fase Pengembangan

### Phase 1 — Core MVP *(In Progress)*
- [x] UI/UX Frontend lengkap (React + TypeScript)
- [x] RBAC & navigasi dinamis
- [x] Dashboard Employee & Admin
- [x] Check-In / Check-Out flow
- [x] Face Verification (UI)
- [x] GPS & Geofencing (UI)
- [x] Pengajuan & Approval
- [x] Riwayat Kehadiran
- [x] Laporan & Export
- [x] Audit Trail & Security Events
- [x] Telegram Bot (UI)
- [x] Google Drive (UI)
- [x] Google Sheets (UI)
- [x] Kalender & Hari Libur
- [x] Payroll Preparation (UI)
- [ ] Backend API (NestJS)
- [ ] Database PostgreSQL + Prisma
- [ ] Auth.js Authentication

### Phase 2 — Security & Anti-Fraud
- [ ] Liveness Detection (aktif)
- [ ] Anti-Spoofing (aktif)
- [ ] Device Binding (backend)
- [ ] Mock GPS Detection (backend)
- [ ] Suspicious Activity Detection
- [ ] Superadmin 2FA (aktif)
- [ ] Private Telegram Bot (aktif)

### Phase 3 — Integration
- [ ] Google Calendar holiday sync
- [ ] Email Notification (SMTP)
- [ ] WhatsApp Notification
- [ ] Payroll Integration
- [ ] Advanced Reporting

### Phase 4 — Advanced Device Security
- [ ] BSSID / SSID Validation
- [ ] Root/Jailbreak Detection
- [ ] Native Mobile Wrapper / PWA full
- [ ] Device Integrity Checking

---

## Berkontribusi

Kontribusi sangat disambut! Ikuti langkah berikut:

1. **Fork** repository ini
2. Buat branch fitur: `git checkout -b feat/nama-fitur`
3. Commit perubahan: `git commit -m "feat: deskripsi singkat"`
4. Push ke branch: `git push origin feat/nama-fitur`
5. Buka **Pull Request** ke branch `main`

Pastikan kode sudah melewati `npm run lint` sebelum membuka PR.

---

## Lisensi

Proyek ini dilisensikan di bawah **MIT License** — bebas digunakan, dimodifikasi, dan didistribusikan, termasuk untuk kepentingan komersial, selama menyertakan copyright notice.

Lihat file [`LICENSE`](./LICENSE) untuk teks lengkap.

```
MIT License — Copyright (c) 2026 Sistem Absensi Contributors
```
