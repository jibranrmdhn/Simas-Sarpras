# SIMAS - Sistem Informasi Sarana & Prasarana Kampus
### Fullstack Web Application: Laravel 11 MVC (Eloquent ORM) + SQLite + Tailwind CSS + RBAC

Aplikasi manajemen sarana dan prasarana kampus berbasis arsitektur **Laravel 11 MVC (Model - View - Controller)** dengan **6 Menu Inti** dan pemisahan hak akses **4 Role (RBAC)**.

---

## 📂 1. Struktur Folder Laravel 11 MVC (Mudah Dipresentasikan)

Seluruh kode backend disusun mengikuti standar **Laravel 11** agar ringkas, rapi, dan mudah dijelaskan saat presentasi:

```text
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php        # Login, Sesi & Daftar Pengguna
│   │   │   ├── DashboardController.php   # Statistik KPI Dashboard per Role
│   │   │   ├── AssetController.php       # CRUD Master Inventaris Aset
│   │   │   ├── LocationController.php    # CRUD Gedung & Ketersediaan Ruangan
│   │   │   ├── LoanController.php        # Peminjaman, Approve/Reject & Pengembalian
│   │   │   ├── TicketController.php      # Kanban Pemeliharaan & Biaya Servis
│   │   │   └── ReportController.php      # Laporan & Log Audit Aktivitas
│   │   └── Middleware/
│   │       └── RoleMiddleware.php        # Pembatas Hak Akses 4 Role (RBAC)
│   └── Models/
│       ├── User.php                      # Eloquent Model Pengguna & Role
│       ├── Asset.php                     # Eloquent Model Inventaris Aset
│       ├── Location.php                  # Eloquent Model Gedung & Ruangan
│       ├── Loan.php                      # Eloquent Model Peminjaman Sarana
│       ├── Ticket.php                    # Eloquent Model Tiket Pemeliharaan
│       └── ActivityLog.php               # Eloquent Model Audit Log
├── routes/
│   ├── web.php                           # Route 6 Menu Utama + Middleware Role
│   └── api.php                           # Route RESTful API (Route::apiResource)
├── database/
│   ├── migrations/
│   │   └── 2025_01_01_000001_create_simas_tables.php  # Skema Tabel Database
│   └── seeders/
│       └── DatabaseSeeder.php            # Seeder 4 Akun Demo & Data Awal
├── pages/                                # View Halaman Frontend (6 Menu Inti)
├── js/                                   # Modul Interaktif Frontend & RBAC Client
├── composer.json                         # Konfigurasi Paket Laravel 11
└── artisan                               # CLI Laravel Artisan
```

---

## 🔐 2. Daftar 4 Akun Role (RBAC) & Batas Wewenangnya

| Role | Username | Password | Aktor Demo | Fitur & Batas Wewenang |
| :--- | :--- | :--- | :--- | :--- |
| **1. Admin Sarpras** | `admin` | `admin123` | Bambang Irawan, S.Kom | **Kontrol Penuh (6 Menu)**: Tambah/Edit/Hapus Aset & Ruangan, Setujui Pinjaman, Kelola Tiket Kanban, dan Cetak Laporan. |
| **2. Petugas Sarpras** | `petugas` | `petugas123` | Joko Supriyanto, A.Md | **Operasional & Teknisi (6 Menu)**: Tambah & Edit kondisi fisik aset/ruangan, verifikasi barang kembali, dan kerjakan tiket perbaikan Kanban. *(Dilarang menghapus aset & tidak bisa Approve pinjaman)*. |
| **3. Pimpinan Institusi** | `pimpinan` | `pimpinan123` | Dr. Ir. Hendro Wicaksono, M.T. | **Eksekutif & Otorisasi (6 Menu)**: Memantau nilai aset & okupansi (*Read-Only*), **Menyetujui / Menolak (`Approve / Reject`)** permohonan peminjaman, dan mengesahkan laporan. |
| **4. Peminjam (Dosen/Mhs)** | `peminjam` | `peminjam123` | Budi Santoso, M.Kom | **Portal Layanan Mandiri (4 Menu)**: Dashboard khusus Peminjam, cek katalog barang & ruangan kosong, ajukan peminjaman & pengembalian. *(Menu Pemeliharaan & Laporan ditutup)*. |

---

## 🚀 3. Cara Menjalankan Aplikasi

### A. Menjalankan di Lingkungan Laravel (Lokal / Laragon / XAMPP)
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=3000
```

### B. Menjalankan di Cloud Preview / Node.js Runner
```bash
npm run dev
```
Akses di browser: **`http://localhost:3000`**
