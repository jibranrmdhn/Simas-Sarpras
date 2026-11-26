# SIMAS - Sistem Informasi Sarana & Prasarana Kampus
### Fullstack Web Application: PHP Native (PDO) + SQLite + Tailwind CSS + JavaScript + RBAC

Aplikasi manajemen sarana dan prasarana kampus dengan **REST API PHP Native**, frontend **HTML + Tailwind CSS + Vanilla JavaScript**, database **SQLite**, serta pemisahan hak akses **4 Role (RBAC)**.

> Catatan: folder `app/`, `routes/`, `resources/views/`, `database/migrations/`, `artisan`, dan `composer.json` adalah **scaffold Laravel yang tidak dipakai** oleh aplikasi ini. Aplikasi berjalan dengan PHP native melalui `router.php` + `backend-php/`.

---

## 📂 1. Arsitektur & Struktur Folder

```text
├── pages/                    # Halaman frontend (HTML statis)
│   ├── login.html            # Login, registrasi & ACC akun
│   ├── index.html            # Dashboard (adaptif per role)
│   ├── aset.html             # Inventaris aset
│   ├── gedung.html           # Gedung & ruangan
│   ├── peminjaman.html       # Peminjaman & pengembalian
│   ├── antrean.html          # Antrean persetujuan
│   ├── tiket.html            # Pemeliharaan (Kanban)
│   ├── mutasi.html           # Mutasi aset
│   ├── stock.html            # Stock opname
│   ├── laporan.html          # Laporan & audit trail
│   ├── pengguna.html         # Kelola akun & ACC pendaftaran
│   └── ...                   # Halaman pendukung lainnya
├── js/                       # Logika frontend & RBAC client
│   ├── auth.js               # Sesi login & akun demo
│   ├── rbac.js               # Permission & proteksi halaman
│   ├── api.js                # Client REST API
│   ├── navigation.js         # Sidebar & tema
│   └── ...                   # Modul per halaman
├── css/                      # Stylesheet tambahan
├── backend-php/              # REST API PHP Native (dipakai saat ini)
│   ├── routes.php            # Seluruh endpoint /api/...
│   ├── db.php                # Koneksi PDO SQLite & seeding
│   └── helpers.php           # Helper JSON, CORS & log aktivitas
├── backend/                  # Alternatif backend Node.js Express
│   ├── server.js
│   └── db.js
├── data/
│   └── simas.db              # Database SQLite (dibuat otomatis)
├── assets/                   # Gambar aset & avatar
├── router.php                # Entry point PHP built-in server
├── index.php                 # Entry point untuk Apache/XAMPP
└── package.json              # Script Node (opsional)
```

**Alur aplikasi:**

```text
Browser (pages/*.html + js/*.js)
        ↓ fetch /api/...
PHP Native (router.php → backend-php/routes.php)
        ↓ PDO
SQLite (data/simas.db)
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

### A. PHP Built-in Server (utama)

```bash
php -S localhost:3000 router.php
```

Atau lewat npm:

```bash
npm run dev:php
```

Buka browser: **`http://localhost:3000/pages/login.html`**

### B. XAMPP / Apache

Arahkan document root ke folder project ini. `index.php` akan otomatis mengarahkan ke halaman login dan meneruskan request `/api/...` ke `backend-php/routes.php`.

### C. Node.js Express (alternatif)

```bash
npm install
npm run dev
```

---

## 🗄️ 4. Catatan Database

- Database SQLite berada di `data/simas.db` dan **dibuat otomatis** saat pertama kali dijalankan.
- Seed data peminjaman sengaja dinonaktifkan agar daftar peminjaman kosong saat demo/presentasi. Data baru tetap bisa dibuat lewat menu Peminjaman.
- Akun demo (admin, petugas, pimpinan, peminjam) dibuat otomatis saat seeding.
