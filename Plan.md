# Sistem Absensi — Feature List

## 1. Dashboard

Dashboard berbeda berdasarkan role.

### Dashboard Karyawan
- Status kehadiran hari ini
- Jam masuk
- Jam pulang
- Status: Hadir / Terlambat / Dinas / Sakit / Izin / Cuti
- Tombol **Check-In**
- Tombol **Check-Out**
- Tombol **Dinas / Tugas Keluar**
- Ringkasan kehadiran bulan berjalan
- Sisa cuti
- Pengajuan yang sedang diproses
- Riwayat aktivitas terbaru

### Dashboard Admin
- Total karyawan
- Hadir hari ini
- Terlambat
- Belum check-in
- Sedang dinas
- Sakit
- Izin
- Cuti
- Rekap kehadiran hari ini
- Aktivitas terbaru
- Notifikasi pengajuan
- Monitoring perangkat / lokasi / aktivitas mencurigakan

---

# 2. Absensi

## Check-In / Absensi Masuk

Wajib:
- Foto selfie
- Face Detection
- Face Matching
- Liveness Detection
- GPS Location
- Validasi radius kantor / Geofencing
- Server-side timestamp
- Validasi user & device
- Konfirmasi sebelum submit

Alur:

**Selfie → Face Verification → Liveness → GPS → Geofence → Device Validation → Check-In**

Data yang disimpan:
- User
- Waktu server
- Foto selfie
- GPS latitude
- GPS longitude
- Akurasi GPS
- Device ID
- IP Address
- Status validasi
- Hasil face verification
- Hasil liveness detection

---

# 3. Check-Out / Absensi Pulang

Fitur sama dengan Check-In.

Wajib:
- Selfie
- Face Verification
- Liveness Detection
- GPS
- Geofencing
- Device Validation
- Server Timestamp
- Confirmation Popup

Alur:

**Selfie → Face Verification → Liveness → GPS → Geofence → Device Validation → Check-Out**

---

# 4. Dinas / Tugas Keluar

Karyawan dapat membuat status:

**Dinas / Tugas Keluar**

Contoh:
- Meeting client
- Kunjungan cabang
- Pengantaran dokumen
- Survey
- Tugas lapangan

Data:
- Tujuan
- Alamat / lokasi
- Keperluan
- Waktu mulai
- Waktu selesai
- Keterangan
- Bukti / foto jika diperlukan

Dapat menggunakan mekanisme:

**Request → Approval → Status Dinas**

Status:
- Draft
- Menunggu Approval
- Disetujui
- Ditolak
- Selesai

---

# 5. Status Kehadiran

Sistem memiliki status standar:

- Hadir
- Terlambat
- Pulang
- Dinas
- Tugas Keluar
- Sakit
- Izin
- Cuti
- Tidak Hadir
- Libur
- Hari Libur Nasional
- Hari Libur Custom

---

# 6. Pengajuan & Perizinan

## Menu: Pengajuan & Perizinan

Untuk semua jenis request karyawan.

### Pengajuan:
- Izin
- Sakit
- Cuti
- Dinas
- Tugas keluar
- Koreksi absensi
- Lupa check-in
- Lupa check-out

### Status:
- Draft
- Pending
- Approved
- Rejected
- Cancelled

### Approval Workflow

Contoh:

**Karyawan → Atasan → HR/Admin**

Sistem dapat dikembangkan menjadi approval bertingkat:

**Employee → Supervisor → Manager → HR**

---

# 7. Cuti

Menu khusus untuk cuti.

Fitur:
- Pengajuan cuti
- Jenis cuti
- Tanggal mulai
- Tanggal selesai
- Jumlah hari
- Alasan
- Lampiran
- Approval
- Riwayat cuti
- Sisa cuti

Jenis cuti dapat dibuat configurable oleh admin.

Contoh:
- Cuti Tahunan
- Cuti Sakit
- Cuti Melahirkan
- Cuti Khusus
- Cuti Bersama

---

# 8. Sakit & Izin

### Sakit
- Tanggal sakit
- Alasan
- Catatan
- Upload surat dokter
- Approval

### Izin
- Tanggal
- Jam
- Jenis izin
- Alasan
- Lampiran
- Approval

---

# 9. Kalender & Hari Libur

## Custom Holiday

Admin dapat membuat hari libur manual.

Data:
- Nama hari libur
- Tanggal
- Keterangan
- Status aktif

Contoh:
- Libur perusahaan
- Annual shutdown
- Libur khusus kantor
- Event perusahaan

## Sinkronisasi Hari Libur

Integrasi dengan Google Calendar untuk mendapatkan kalender hari libur nasional.

Fungsi:
- Sync holiday
- Import holiday
- Update holiday
- Prevent duplicate holiday
- Manual override

Admin tetap dapat mengubah / menambahkan hari libur secara manual.

---

# 10. Riwayat & Aktivitas Kehadiran

## Menu: Riwayat Kehadiran

Karyawan dapat melihat:
- Riwayat check-in
- Riwayat check-out
- Jam masuk
- Jam keluar
- Status
- Lokasi
- Foto selfie
- Dinas
- Izin
- Sakit
- Cuti

Filter:
- Hari
- Minggu
- Bulan
- Tahun
- Status

---

# 11. Laporan & Rekapitulasi

## Menu: Reporting

Laporan:

### Laporan Kehadiran
- Rekap harian
- Rekap mingguan
- Rekap bulanan
- Rekap tahunan

### Laporan Karyawan
- Jumlah hadir
- Jumlah terlambat
- Jumlah izin
- Jumlah sakit
- Jumlah cuti
- Jumlah dinas
- Jumlah tidak hadir

### Laporan Jam Kerja
- Total jam kerja
- Jam lembur
- Keterlambatan
- Pulang lebih awal

### Export
- Excel
- CSV
- PDF

---

# 12. Google Sheets Integration

Integrasi langsung dengan Google Sheets.

Contoh:

**Attendance PostgreSQL → Reporting Service → Google Sheets**

Fungsi:
- Export data absensi
- Sync data laporan
- Generate spreadsheet
- Rekap otomatis
- Laporan bulanan

Admin dapat memilih:
- Sheet
- Periode
- Department
- Employee
- Jenis laporan

---

# 13. Google Drive Integration

Google Drive digunakan untuk menyimpan file.

File yang dapat disimpan:
- Foto selfie
- Dokumen cuti
- Surat dokter
- Lampiran izin
- Dokumen dinas
- File laporan

Struktur folder dapat dibuat otomatis:

```text
Google Drive
└── Absensi
    ├── Selfie
    │   └── 2026
    │       └── 10
    ├── Dokumen
    │   ├── Cuti
    │   ├── Sakit
    │   └── Izin
    └── Reports
```

PostgreSQL menyimpan metadata dan reference file, sedangkan file fisik disimpan di Google Drive.

---

# 14. Profil Karyawan

## Menu: Profil

Data:
- Foto profil
- Nama
- Employee ID
- Email
- Nomor telepon
- Department
- Jabatan
- Atasan
- Tanggal bergabung
- Status karyawan

### Face Profile

Digunakan sebagai reference untuk face matching.

Data:
- Face reference
- Face embedding / template
- Status verifikasi
- Waktu registrasi

---

# 15. Perangkat

## Menu: Device Management

Informasi:
- Device name
- Device type
- OS
- Browser
- Device ID
- Last activity
- Last login
- Status device

### Single Device Binding

Satu akun dapat dibatasi menggunakan satu perangkat terdaftar.

Contoh:

**Employee → Device A**

Ketika login dari Device B:
- Tolak
- Request device replacement
- Admin approval

Fitur tambahan:
- Unbind device
- Rebind device
- Device history

---

# 16. GPS & Geofencing

## GPS Validation

Saat absensi:
- Latitude
- Longitude
- GPS accuracy
- Timestamp

## Geofence

Admin menentukan:

```text
Office
Latitude
Longitude
Radius: 100 Meter
```

Contoh:

**Karyawan harus berada dalam radius 100 meter dari kantor.**

Status:
- Inside geofence
- Outside geofence
- GPS inaccurate

---

# 17. Anti Fake GPS / Location Fraud

Sistem melakukan beberapa pemeriksaan:

- Mock location detection
- GPS accuracy validation
- Location consistency
- Server-side validation
- IP information
- Device information
- Browser/device signals
- Impossible travel detection
- Suspicious location pattern

Perlu dicatat: pada aplikasi web/PWA, deteksi fake GPS tidak bisa dijamin 100%. Pendekatannya lebih tepat sebagai **lapisan mitigasi fraud**, bukan jaminan absolut.

---

# 18. Selfie & Face Verification

## Selfie Capture

Kamera browser digunakan untuk mengambil foto.

Fitur:
- Kamera depan
- Preview
- Retake
- Capture

## Face Detection

Memastikan terdapat wajah di dalam foto.

## Face Matching

Membandingkan wajah dengan reference face karyawan.

Contoh:

```text
Captured Face
      ↓
Face Detection
      ↓
Face Embedding
      ↓
Compare Reference
      ↓
Similarity Score
      ↓
Pass / Fail
```

---

# 19. Liveness Detection

Memastikan wajah berasal dari orang yang benar-benar hadir.

Pemeriksaan dapat mencakup:
- Face presence
- Movement
- Blink
- Head movement
- Depth / presentation attack detection
- Challenge-response

Tujuan:
- Mengurangi penggunaan foto
- Mengurangi penggunaan video
- Mengurangi penggunaan replay media
- Mengurangi spoofing

---

# 20. Anti-Spoofing

Lapisan tambahan untuk mencegah:

- Foto
- Screenshot
- Video replay
- Foto dari layar
- Media manipulatif

Status hasil:

```text
Face Detection       ✓
Face Matching        ✓
Liveness             ✓
Anti-Spoofing        ✓
```

---

# 21. Browser Face Verification

Karena sistem menggunakan Web/PWA, proses verifikasi wajah dapat dilakukan dari browser.

Teknologi dapat diarahkan ke:

**Browser Camera → Face Detection → Face Verification → Attendance API**

Tidak perlu aplikasi mobile native untuk fungsi dasar.

---

# 22. Jailbreak & Root Detection

Untuk perangkat mobile/native application, sistem dapat memeriksa:

- Root detection
- Jailbreak detection
- Debug environment
- Device integrity

Untuk PWA/browser, kemampuan deteksi lebih terbatas. Jadi fitur ini lebih cocok diposisikan sebagai **tambahan ketika nanti tersedia native mobile wrapper/app**.

---

# 23. Wi-Fi Office Validation

## BSSID / SSID Lock

Coming Soon.

Tujuan:
- Memastikan perangkat terhubung ke Wi-Fi kantor
- Validasi SSID
- Validasi BSSID

Contoh:

```text
GPS ✓
Geofence ✓
Wi-Fi SSID ✓
Device ✓
Face ✓
Liveness ✓
```

Catatan: akses BSSID/SSID dari browser modern memiliki keterbatasan, sehingga fitur ini lebih realistis sebagai opsi native/mobile atau network-side validation.

---

# 24. Konfirmasi Aksi

Setiap aksi penting membutuhkan confirmation popup.

Contoh:

**Check-In**

> Apakah Anda yakin ingin melakukan Check-In sekarang?

**Approve Request**

> Apakah Anda yakin ingin menyetujui pengajuan ini?

**Delete Employee**

> Data karyawan akan dihapus. Lanjutkan?

Aksi sensitif menggunakan:
- Confirmation
- Warning
- Destructive action confirmation

---

# 25. Audit Trail

## Immutable Audit Trail

Semua aktivitas penting dicatat.

Contoh:

```text
USER LOGIN
CHECK-IN
CHECK-OUT
CREATE REQUEST
APPROVE REQUEST
REJECT REQUEST
EDIT EMPLOYEE
CHANGE ROLE
DELETE DATA
DEVICE BINDING
ADMIN ACTION
```

Data audit:
- User
- Action
- Timestamp
- IP
- Device
- Target
- Before value
- After value
- Result

Audit trail dibuat append-only dan tidak tersedia fungsi edit manual melalui dashboard.

---

# 26. Server-Side Timestamp Validation

Waktu absensi harus menggunakan waktu server.

Bukan waktu dari device.

Contoh:

```text
Device Time:      08:12
Server Time:      08:15

Recorded Time:
08:15
```

Tujuan:
- Mencegah manipulasi waktu
- Konsistensi laporan
- Mencegah perubahan timezone manual

---

# 27. Authentication

Pilihan:

**Auth.js / Managed Authentication**

Fitur:
- Login
- Logout
- Forgot password
- Reset password
- Session management
- Session expiration
- Device verification
- Email verification

---

# 28. 2FA Superadmin

Khusus Superadmin menggunakan 2FA tambahan.

Konsep:

**Login → Password → 2FA → Dashboard**

Telegram digunakan sebagai media OTP / verification notification.

---

# 29. Private Telegram Bot

Telegram Bot digunakan untuk monitoring.

Bot bersifat private / invite only.

Flow:

```text
Superadmin
    ↓
Telegram User ID
    ↓
Invite / Registration
    ↓
Dashboard verification
    ↓
Allowed Telegram User
```

Hanya Telegram account yang sudah terdaftar di dashboard yang dapat mengakses bot.

---

# 30. Telegram Notification

Telegram Bot dapat mengirim:

### Attendance
- Check-in
- Check-out
- Late attendance
- Missing check-out

### Request
- Leave request
- Sick leave
- Permission
- Business trip

### Security
- Failed login
- Suspicious attendance
- Multiple device attempts
- Suspicious GPS
- Face verification failure

### Reporting
- Daily attendance report
- Weekly report
- Monthly report

---

# 31. Email / WhatsApp

## Coming Soon

Integrasi:
- Email notification
- WhatsApp notification

Contoh:
- Approval notification
- Leave approval
- Attendance reminder
- Late notification
- Payroll notification

---

# 32. Payroll Integration

## Coming Soon

UI payroll sudah disiapkan sejak awal meskipun integrasinya belum aktif.

Menu:

**Payroll**

Contoh:

```text
Payroll
├── Period
├── Attendance Summary
├── Working Hours
├── Overtime
├── Late Deduction
├── Leave
└── Payroll Export
```

Nantinya dapat diintegrasikan dengan sistem payroll eksternal.

---

# 33. Superadmin / System Management

## Menu: System Management

Superadmin dapat mengatur:

- Company
- Branch
- Department
- Position
- Employee
- Work schedule
- Shift
- Holiday
- Leave type
- Attendance settings
- Geofence
- Device policy
- Security policy
- Notification settings
- Integration settings

---

# 34. CRUD Management

Semua data master menggunakan CRUD:

**Create**
**Read**
**Update**
**Delete**

Contoh:

### Employee
- Create employee
- View employee
- Edit employee
- Disable employee

### Department
- Create
- Read
- Update
- Delete

### Schedule
- Create
- Read
- Update
- Delete

---

# 35. RBAC Lengkap

## Role

Contoh:

```text
SUPERADMIN
ADMIN
HR
MANAGER
SUPERVISOR
EMPLOYEE
```

Permission dibuat granular.

Contoh:

```text
attendance.view
attendance.create
attendance.update

employee.view
employee.create
employee.update
employee.delete

leave.view
leave.create
leave.approve
leave.reject

report.view
report.export

system.manage
audit.view
```

Dengan demikian role tidak perlu hard-coded.

---

# 36. Work Schedule

Menu:

**Jadwal Kerja**

Fitur:
- Jam masuk
- Jam pulang
- Break
- Work days
- Shift
- Grace period
- Overtime

Contoh:

```text
Senin - Jumat
08:00 - 17:00
Break: 12:00 - 13:00
Late tolerance: 10 menit
```

---

# 37. Shift Management

Untuk perusahaan yang memiliki shift.

Contoh:

```text
Shift Pagi
06:00 - 14:00

Shift Siang
14:00 - 22:00

Shift Malam
22:00 - 06:00
```

---

# 38. Security & Data Protection

## Encryption

Data sensitif harus dilindungi dengan encryption at rest dan encryption in transit.

Semua komunikasi menggunakan:

**HTTPS / TLS**

### E2EE

End-to-End Encryption dapat digunakan untuk skenario komunikasi tertentu, terutama messaging/notification. Untuk database attendance biasa, pendekatan yang tepat adalah kombinasi **TLS + encryption at rest + access control + key management**, karena server tetap harus memproses data absensi.

---

# 39. Database

## PostgreSQL

Menyimpan:
- Employee
- User
- Role
- Permission
- Attendance
- Check-in
- Check-out
- Location
- Schedule
- Shift
- Holiday
- Leave
- Permission Request
- Business Trip
- Device
- Face verification result
- Audit trail
- Notification
- Payroll preparation data

---

# 40. PWA

Sistem dapat dibuat sebagai Progressive Web App.

Teknologi:
- Web App Manifest
- Service Worker
- Installable PWA
- Responsive mobile UI
- Camera access
- GPS access

Target penggunaan utama:

**Mobile Browser**

sehingga karyawan tidak harus menginstal aplikasi native.

---

# 41. Testing

## Unit Testing
**Vitest**

Testing:
- Attendance logic
- Leave calculation
- Geofence logic
- Permission logic
- RBAC
- Validation

## E2E Testing
**Playwright**

Testing:
- Login
- Check-in
- Check-out
- Leave request
- Approval
- Reporting
- Admin workflow

---

# 42. Technology Stack

## Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

## Backend
- Node.js
- NestJS
- Next.js API jika diperlukan untuk endpoint tertentu

## Database
- PostgreSQL
- Prisma ORM

## Authentication
- Auth.js / Managed Authentication

## Storage
- Google Drive

## Reporting
- Google Sheets

## Notification
- Telegram Bot
- Email — Coming Soon
- WhatsApp — Coming Soon

## PWA
- Web App Manifest
- Service Worker

## Testing
- Vitest
- Playwright

## Deployment
- HTTPS
- Web hosting
- Backend/API hosting
- PostgreSQL hosting
- Secure environment variables

---

# 43. Struktur Menu Utama

Struktur dashboard dapat dibuat sesederhana ini:

```text
Dashboard

Absensi
├── Check-In
├── Check-Out
├── Dinas / Tugas
└── Status Hari Ini

Pengajuan
├── Izin
├── Sakit
├── Cuti
├── Dinas
└── Koreksi Absensi

Riwayat
└── Riwayat Kehadiran

Laporan
├── Rekap Kehadiran
├── Rekap Karyawan
├── Jam Kerja
└── Export / Google Sheets

Kalender
├── Hari Libur Nasional
└── Hari Libur Custom

Profil
├── Profil Saya
├── Face Verification
└── Perangkat

Admin
├── Employees
├── Departments
├── Positions
├── Schedule
├── Shift
├── Leave Type
├── Holiday
├── Geofence
└── Device Management

Security
├── Audit Trail
├── Login Activity
└── Security Events

System Management
├── Roles
├── Permissions
├── Integrations
├── Notification
└── System Settings

Payroll
└── Payroll Preparation
```

# 44. Prioritas Pengembangan

## Phase 1 — Core / MVP

Fokus agar sistem langsung bisa digunakan:

- Login
- Employee management
- RBAC
- Check-in
- Check-out
- Selfie
- Face verification
- GPS
- Geofence
- Work schedule
- Izin
- Sakit
- Cuti
- Dinas
- Approval
- Riwayat
- Dashboard
- Laporan
- Audit trail
- Telegram notification
- Google Drive
- Google Sheets

## Phase 2 — Security & Anti-Fraud

- Liveness detection
- Anti-spoofing
- Device binding
- Mock GPS detection
- Suspicious activity detection
- Advanced audit trail
- Superadmin 2FA
- Private Telegram bot

## Phase 3 — Integration

- Google Calendar holiday sync
- Email
- WhatsApp
- Payroll integration
- Advanced reporting

## Phase 4 — Advanced Device Security

- BSSID / SSID validation
- Root detection
- Jailbreak detection
- Native mobile wrapper/application
- Device integrity checking
```

### Konsep inti sistem

Secara sederhana, **jangan membuat absensi hanya menjadi tombol Check-In/Check-Out**. Nilai utama sistem justru ada pada kombinasi:

**Identity + Face + Liveness + GPS + Geofence + Device + Server Time + Audit Trail**

Sehingga satu transaksi absensi dapat direpresentasikan seperti:

```text
EMPLOYEE
   ↓
LOGIN
   ↓
DEVICE VALIDATION
   ↓
SELFIE
   ↓
FACE DETECTION
   ↓
FACE MATCHING
   ↓
LIVENESS / ANTI-SPOOF
   ↓
GPS VALIDATION
   ↓
GEOFENCE CHECK
   ↓
SERVER TIMESTAMP
   ↓
ATTENDANCE RECORD
   ↓
AUDIT TRAIL
   ↓
TELEGRAM NOTIFICATION
```

Ini membuat sistem tetap **sederhana di sisi pengguna**, tetapi memiliki banyak lapisan validasi di backend.