<?php
/**
 * SIMAS - Backend Database Module (PHP PDO SQLite)
 * Database file: data/simas.db
 */

function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $dataDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data';
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0777, true);
    }

    $dbPath = $dataDir . DIRECTORY_SEPARATOR . 'simas.db';
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec('PRAGMA foreign_keys = ON;');

    initSchema($pdo);
    seedData($pdo);

    return $pdo;
}

function initSchema(PDO $pdo) {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            nama TEXT NOT NULL,
            nip TEXT,
            email TEXT,
            role TEXT NOT NULL,
            avatar TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            kode TEXT UNIQUE NOT NULL,
            nama TEXT NOT NULL,
            icon TEXT DEFAULT 'archive',
            desc TEXT,
            susut TEXT,
            color TEXT DEFAULT 'blue',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS buildings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            kode TEXT UNIQUE NOT NULL,
            nama TEXT NOT NULL,
            tipe TEXT,
            jumlah_lantai INTEGER DEFAULT 3,
            pic TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            kode TEXT UNIQUE NOT NULL,
            nama TEXT NOT NULL,
            gedung_kode TEXT,
            lantai TEXT,
            kapasitas TEXT,
            luas TEXT,
            kondisi TEXT DEFAULT 'Baik',
            status TEXT DEFAULT 'Tersedia',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nip TEXT UNIQUE NOT NULL,
            nama TEXT NOT NULL,
            unit_kerja TEXT,
            jabatan TEXT,
            email TEXT,
            telepon TEXT,
            status_aset TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS assets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nup TEXT UNIQUE NOT NULL,
            nama TEXT NOT NULL,
            kode TEXT,
            kategori_id INTEGER,
            kategori_nama TEXT,
            lokasi TEXT,
            gedung TEXT,
            pic TEXT,
            pic_nip TEXT,
            kondisi TEXT DEFAULT 'Baik',
            status TEXT DEFAULT 'Tersedia',
            tahun TEXT,
            nilai INTEGER DEFAULT 0,
            foto TEXT,
            serial TEXT,
            desc TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS loans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            kode TEXT UNIQUE NOT NULL,
            asset_id INTEGER,
            asset_nama TEXT,
            user_id INTEGER,
            peminjam_nama TEXT,
            peminjam_nip TEXT,
            keperluan TEXT,
            tgl_pinjam TEXT,
            tgl_kembali TEXT,
            status TEXT DEFAULT 'Menunggu Approval',
            catatan TEXT,
            approved_by TEXT,
            approved_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS approvals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            kode TEXT UNIQUE NOT NULL,
            tag TEXT,
            is_urgent INTEGER DEFAULT 0,
            title TEXT NOT NULL,
            category TEXT DEFAULT 'ruangan',
            requester_name TEXT NOT NULL,
            requester_nip TEXT,
            requester_phone TEXT,
            requester_email TEXT,
            requester_avatar TEXT,
            doc_number TEXT,
            doc_label TEXT,
            schedule TEXT,
            facility TEXT,
            waiting_for TEXT,
            status TEXT DEFAULT 'Sedang Ditinjau',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            kode TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            location TEXT,
            gedung TEXT,
            priority TEXT DEFAULT 'NORMAL',
            category TEXT DEFAULT 'Umum',
            reporter TEXT,
            tech_name TEXT,
            status TEXT DEFAULT 'baru',
            desc TEXT,
            cost INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS mutations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bast_no TEXT UNIQUE NOT NULL,
            asset_id INTEGER,
            asset_name TEXT NOT NULL,
            nup TEXT NOT NULL,
            unit_count TEXT DEFAULT '1 Unit',
            origin_loc TEXT,
            origin_pic TEXT,
            origin_nip TEXT,
            dest_loc TEXT,
            dest_pic TEXT,
            dest_nip TEXT,
            purpose TEXT,
            doc_status TEXT DEFAULT 'Menunggu TTD',
            status TEXT DEFAULT 'Dalam Proses Pemindahan',
            date TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS stock_opname (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            category TEXT,
            sn TEXT,
            actual_loc TEXT,
            master_loc TEXT,
            is_loc_diff INTEGER DEFAULT 0,
            audit_status TEXT DEFAULT 'Cocok Sesuai Data',
            condition TEXT DEFAULT 'Baik',
            auditor TEXT,
            scan_time TEXT,
            session_name TEXT DEFAULT 'Audit Semester 1 - 2025',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        );

        CREATE TABLE IF NOT EXISTS activity_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_name TEXT,
            action TEXT,
            details TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    try {
        $pdo->exec("ALTER TABLE mutations ADD COLUMN doc_status TEXT DEFAULT 'Menunggu TTD';");
    } catch (Exception $e) {
        // Column already exists
    }
}

function seedData(PDO $pdo) {
    // 1. Users
    $userCount = (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    if ($userCount === 0) {
        $stmt = $pdo->prepare("INSERT INTO users (username, password, nama, nip, email, role, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute(['admin', 'admin123', 'Dr. Hendro Purnomo, M.Kom', '198203152008121001', 'hendro.admin@institusi.ac.id', 'admin', '../assets/avatar_hendro.jpg']);
        $stmt->execute(['petugas', 'petugas123', 'Siti Nurhaliza, S.T', '199008242014042002', 'siti.sarpras@institusi.ac.id', 'petugas', '../assets/avatar_bambang.jpg']);
        $stmt->execute(['pimpinan', 'pimpinan123', 'Prof. Ir. Bambang Soeprapto', '196511101991031003', 'bambang.pimpinan@institusi.ac.id', 'pimpinan', '../assets/avatar_hendro.jpg']);
        $stmt->execute(['peminjam', 'peminjam123', 'Ahmad Fauzi (Dosen/Mhs)', '2021510045', 'ahmad.fauzi@mahasiswa.ac.id', 'peminjam', '../assets/avatar_bambang.jpg']);
    }

    // 2. Categories
    $catCount = (int)$pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
    if ($catCount === 0) {
        $stmt = $pdo->prepare("INSERT INTO categories (kode, nama, icon, desc, susut, color) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute(['KAT-01', 'Elektronik & Multimedia', 'monitor', 'Laptop, PC Desktop, Proyektor, Smartboard, Sound System, TV Display', '4 Tahun', 'blue']);
        $stmt->execute(['KAT-02', 'Alat Laboratorium & Riset', 'flask-conical', 'Mikroskop, Spektrofotometer, Centrifuge, Timbangan Analitik, Osiloskop', '5 Tahun', 'teal']);
        $stmt->execute(['KAT-03', 'Utilitas & Kelistrikan', 'zap', 'AC Daikin Inverter, Genset Silent, Pompa Booster, Panel Induk MDP, UPS Server', '8 Tahun', 'amber']);
        $stmt->execute(['KAT-04', 'Mebel & Furnitur', 'armchair', 'Meja Rapat Konferensi Kayu Jati, Kursi Ergonomis, Lemari Arsip Tahan Api', '10 Tahun', 'indigo']);
    }

    // 3. Buildings & Locations
    $bldgCount = (int)$pdo->query("SELECT COUNT(*) FROM buildings")->fetchColumn();
    if ($bldgCount === 0) {
        $stmt = $pdo->prepare("INSERT INTO buildings (kode, nama, tipe, jumlah_lantai, pic) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute(['GD-REK', 'Gedung Rektorat (Pusat)', 'Rektorat', 4, 'Bambang Irawan']);
        $stmt->execute(['GD-FT', 'Gedung Fakultas Teknik', 'Fakultas', 5, 'Ir. Hendro Wicaksono']);
        $stmt->execute(['GD-LAB', 'Gedung Laboratorium Terpadu', 'Laboratorium', 4, 'Dr. Sri Rejeki']);
        $stmt->execute(['GD-PASCA', 'Gedung Pascasarjana & Riset', 'Pascasarjana', 3, 'Prof. Bambang']);
    }

    $locCount = (int)$pdo->query("SELECT COUNT(*) FROM locations")->fetchColumn();
    if ($locCount === 0) {
        $stmt = $pdo->prepare("INSERT INTO locations (kode, nama, gedung_kode, lantai, kapasitas, luas, kondisi, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute(['R-REK-01', 'Ruang Rapat Dekanat Lt. 3', 'GD-REK', 'Lantai 3', '25 Orang', '85 m²', 'Sangat Baik', 'Tersedia']);
        $stmt->execute(['R-REK-AUD', 'Auditorium Sidang Senat Lt. 2', 'GD-REK', 'Lantai 2', '350 Orang', '420 m²', 'Sangat Baik', 'Tersedia']);
        $stmt->execute(['R-FT-LAB1', 'Lab Komputasi & Jaringan A.201', 'GD-FT', 'Lantai 2', '40 Mahasiswa', '110 m²', 'Baik', 'Tersedia']);
        $stmt->execute(['R-FT-LAB2', 'Studio Podcast & Multimedia B.102', 'GD-FT', 'Lantai 1', '12 Orang', '45 m²', 'Sangat Baik', 'Tersedia']);
        $stmt->execute(['R-LAB-BIO', 'Lab Terpadu Bioteknologi B.302', 'GD-LAB', 'Lantai 3', '30 Mahasiswa', '125 m²', 'Baik', 'Tersedia']);
    }

    // 4. Employees
    $empCount = (int)$pdo->query("SELECT COUNT(*) FROM employees")->fetchColumn();
    if ($empCount === 0) {
        $stmt = $pdo->prepare("INSERT INTO employees (nip, nama, unit_kerja, jabatan, email, telepon, status_aset) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute(['197804152003121002', 'Dr. Ir. Hendro Wicaksono, M.T.', 'Rektorat / Pimpinan', 'Wakil Rektor II', 'hendro@institusi.ac.id', '0812-3456-7890', '14 Ruangan Rektorat']);
        $stmt->execute(['198403152008121002', 'Bambang Irawan, S.Kom', 'Bagian Umum & Sarpras', 'Kepala Subbag Sarpras', 'bambang@institusi.ac.id', '0813-8822-1100', '2.845 Seluruh Aset Master']);
        $stmt->execute(['198709122010012003', 'Dewi Sartika, S.E.', 'Biro Kepegawaian & TU', 'Staf Keuangan & Gaji', 'dewi@institusi.ac.id', '0815-7766-5544', '4 Perangkat Komputasi']);
        $stmt->execute(['198807212012011004', 'Joko Supriyanto, A.Md', 'Divisi Operasional & Servis', 'Teknisi Sarpras Utama', 'joko@institusi.ac.id', '0818-9900-4433', '188 Tiket Servis']);
    }

    // 5. Assets
    $assetCount = (int)$pdo->query("SELECT COUNT(*) FROM assets")->fetchColumn();
    if ($assetCount === 0) {
        $stmt = $pdo->prepare("INSERT INTO assets (nup, nama, kode, kategori_id, kategori_nama, lokasi, gedung, pic, pic_nip, kondisi, status, tahun, nilai, foto, serial, desc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $assetsInit = [
            ['SAR/2024/0101', 'Laptop ThinkPad T14 Gen 4 Intel Core i7', 'AST-LPT-001', 1, 'Elektronik & Multimedia', 'Ruang Rapat Dekanat Lt. 3', 'Gedung Rektorat (Pusat)', 'Bambang Irawan, S.Kom', '198403152008121002', 'Baik', 'Tersedia', '2024', 24500000, '../assets/laptop.jpg', 'PF-4J28901', 'Laptop inventaris dinas pimpinan & riset, RAM 32GB SSD 1TB.'],
            ['SAR/2023/0440', 'Mikroskop Binokuler Olympus CX23 LED', 'AST-LAB-012', 2, 'Alat Laboratorium & Riset', 'Lab Terpadu Bioteknologi B.302', 'Gedung Laboratorium Terpadu', 'Dr. Ir. Hendro Wicaksono, M.T.', '197804152003121002', 'Baik', 'Tersedia', '2023', 38200000, '../assets/mikroskop.jpg', 'OLY-883921', 'Mikroskop riset laboratorium dengan pembesaran hingga 1000x optik plan achromat.'],
            ['SAR/2024/0088', 'AC Split Daikin Inverter 2 PK Flash', 'AST-AC-028', 3, 'Utilitas & Kelistrikan', 'Auditorium Sidang Senat Lt. 2', 'Gedung Rektorat (Pusat)', 'Joko Supriyanto, A.Md', '198807212012011004', 'Rusak Ringan', 'Perawatan', '2024', 14800000, '../assets/ac.jpg', 'DKN-FTKC50-9912', 'Perlu servis modul PCB outdoor dan pembersihan berkala freon R32.'],
            ['SAR/2022/0312', 'Meja Rapat Konferensi Kayu Jati Solid 12 Kursi', 'AST-MEB-004', 4, 'Mebel & Furnitur', 'Ruang Rapat Dekanat Lt. 3', 'Gedung Rektorat (Pusat)', 'Dewi Sartika, S.E.', '198709122010012003', 'Baik', 'Tersedia', '2022', 32000000, '../assets/meja-rapat.jpg', 'FUR-JAT-2022-004', 'Meja bundar oval kayu jati Jepara finishing melamin doff dengan socket cable management.'],
            ['SAR/2023/0015', 'Genset Cummins Silent 100 kVA Standby Power', 'AST-GEN-001', 3, 'Utilitas & Kelistrikan', 'Rumah Genset & Power House Barat', 'Gedung Pascasarjana & Riset', 'Joko Supriyanto, A.Md', '198807212012011004', 'Baik', 'Tersedia', '2023', 245000000, '../assets/genset_cummins.jpg', 'CUM-6BT5.9-G2', 'Pembangkit daya darurat kampus otomatis ATS saat suplai PLN padam.'],
            ['SAR/2024/0219', 'PC Desktop Lenovo ThinkCentre M70s Gen 4', 'AST-PC-019', 1, 'Elektronik & Multimedia', 'Lab Komputasi & Jaringan A.201', 'Gedung Fakultas Teknik', 'Bambang Irawan, S.Kom', '198403152008121002', 'Baik', 'Dipinjam', '2024', 18500000, '../assets/pc_thinkcentre.jpg', 'MJ-098K4L1', 'Workstation komputasi praktikum mahasiswa TI, Intel Core i7 16GB SSD 512GB.'],
            ['SAR/2023/0891', 'Wireless Microphone Sennheiser EW-D Digital', 'AST-AUD-042', 1, 'Elektronik & Multimedia', 'Studio Podcast & Multimedia B.102', 'Gedung Fakultas Teknik', 'Dewi Sartika, S.E.', '198709122010012003', 'Baik', 'Tersedia', '2023', 12800000, '../assets/mic_sennheiser.jpg', 'SN-MIC-2023-8891', 'Sistem mikrofon nirkabel digital latensi rendah 1.9 ms untuk seminar dan podcast.'],
            ['SAR/2024/0520', 'Laser Projector Epson EB-L730U 7000 Lumens', 'AST-PRJ-008', 1, 'Elektronik & Multimedia', 'Auditorium Sidang Senat Lt. 2', 'Gedung Rektorat (Pusat)', 'Bambang Irawan, S.Kom', '198403152008121002', 'Baik', 'Tersedia', '2024', 54000000, '../assets/proyektor.jpg', 'EPS-L730U-00918', 'Proyektor laser Full HD WUXGA 7.000 lumens untuk ruang aula besar berkapasitas 500 orang.']
        ];
        foreach ($assetsInit as $a) {
            $stmt->execute($a);
        }
    }

    // 6. Loans
    // CATATAN: Seed data peminjaman sengaja DINONAKTIFKAN agar daftar peminjaman
    // kosong saat demo/presentasi. Ubah SEED_LOANS menjadi true bila ingin data contoh.
    $seedLoans = false;
    $loanCount = (int)$pdo->query("SELECT COUNT(*) FROM loans")->fetchColumn();
    if ($seedLoans && $loanCount === 0) {
        $stmt = $pdo->prepare("INSERT INTO loans (kode, asset_id, asset_nama, user_id, peminjam_nama, peminjam_nip, keperluan, tgl_pinjam, tgl_kembali, status, catatan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute(['PINJAM-2025-001', 6, 'PC Desktop Lenovo ThinkCentre M70s Gen 4', 4, 'Ahmad Fauzi (Dosen/Mhs)', '2021510045', 'Uji Coba Sistem Server Akreditasi Prodi TI', '2025-03-25', '2025-04-01', 'Aktif', 'Disetujui untuk riset akreditasi lab']);
        $stmt->execute(['PINJAM-2025-002', 1, 'Laptop ThinkPad T14 Gen 4 Intel Core i7', 4, 'Ahmad Fauzi (Dosen/Mhs)', '2021510045', 'Presentasi Konferensi Ilmiah Nasional', '2025-03-28', '2025-03-30', 'Menunggu Approval', 'Menunggu persetujuan pimpinan']);
        $stmt->execute(['PINJAM-2025-003', 7, 'Wireless Microphone Sennheiser EW-D Digital', 2, 'Siti Nurhaliza, S.T', '199008242014042002', 'Kuliah Tamu Industri Kampus Merdeka', '2025-03-20', '2025-03-22', 'Selesai', 'Dikembalikan dalam kondisi baik dan lengkap']);
    }

    // 7. Approvals
    $appvCount = (int)$pdo->query("SELECT COUNT(*) FROM approvals")->fetchColumn();
    if ($appvCount === 0) {
        $stmt = $pdo->prepare("INSERT INTO approvals (kode, tag, is_urgent, title, category, requester_name, requester_nip, requester_phone, requester_email, requester_avatar, doc_number, doc_label, schedule, facility, waiting_for, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute(['#APV-2025-0142', 'PEMINJAMAN RUANGAN & ALAT • URGENT', 1, 'Workshop Akreditasi Internasional ABET', 'ruangan', 'Dr. Ir. Hendro Wicaksono, M.T.', '197804152003121002 • Ka. Prodi Teknik Informatika', '0812-3456-7890', 'hendro@institusi.ac.id', '../assets/avatar_hendro.jpg', '412/FT-TI/UND/2025', 'Surat Pengantar Dekan', 'Sabtu, 29 Maret 2025 • 08:00 - 17:00 WIB', 'Auditorium Utama & 4 Mic Sennheiser', 'Menunggu: Ka. Biro Sarpras', 'Sedang Ditinjau']);
        $stmt->execute(['#APV-2025-0143', 'PERPANJANGAN FASILITAS • NORMAL', 0, 'Riset Laboratorium Biomedika Bersama Mitra Industri', 'ruangan', 'Dewi Sartika, S.E.', '198709122010012003 • Ka. Laboratorium Biologi', '0815-7766-5544', 'dewi@institusi.ac.id', '../assets/avatar_bambang.jpg', '118/LAB-BIO/2025', 'Surat Izin Pemakaian Riset', '31 Maret - 5 April 2025 • 08:00 - 20:00 WIB', 'Lab Terpadu Bioteknologi B.302 & Mikroskop Olympus', 'Menunggu: Wakil Rektor II', 'Sedang Ditinjau']);
    }

    // 8. Tickets
    $ticketCount = (int)$pdo->query("SELECT COUNT(*) FROM tickets")->fetchColumn();
    if ($ticketCount === 0) {
        $stmt = $pdo->prepare("INSERT INTO tickets (kode, title, location, gedung, priority, category, reporter, tech_name, status, desc, cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute(['TKT-0841', 'AC Daikin Tidak Dingin & Menetes Freon', 'Auditorium Sidang Senat Lt. 2', 'Gedung Rektorat (Pusat)', 'TINGGI', 'Utilitas AC', 'Bambang Irawan', 'Joko Supriyanto', 'proses', 'Kondensor outdoor berisik dan pipa evaporator membeku.', 650000]);
        $stmt->execute(['TKT-0842', 'Proyektor Laser Epson Mati Total (No Power)', 'Ruang Rapat Dekanat Lt. 3', 'Gedung Rektorat (Pusat)', 'URGENT', 'Multimedia', 'Dewi Sartika', 'Joko Supriyanto', 'sparepart', 'Kabel power normal, power supply internal butuh penggantian sekring/modul.', 1200000]);
        $stmt->execute(['TKT-0843', 'Panel Distribusi Listrik MCB Trip Berkala', 'Lab Komputasi A.201', 'Gedung Fakultas Teknik', 'TINGGI', 'Kelistrikan', 'Hendro Wicaksono', 'Teknisi PLN Vendor', 'baru', 'Beban over saat 30 PC dinyalakan serempak, perlu rebalancing phase.', 450000]);
        $stmt->execute(['TKT-0839', 'Pintu Kaca Otomatis Lobi Macet Sensor', 'Lobi Utama Rektorat', 'Gedung Rektorat (Pusat)', 'NORMAL', 'Fasilitas Gedung', 'Satpam Rektorat', 'Joko Supriyanto', 'selesai', 'Sensor inframerah kotor dan motor stepper telah diservis serta diberi pelumas.', 150000]);
    }

    // 9. Mutations
    $mutCount = (int)$pdo->query("SELECT COUNT(*) FROM mutations")->fetchColumn();
    if ($mutCount === 0) {
        $stmt = $pdo->prepare("INSERT INTO mutations (bast_no, asset_id, asset_name, nup, unit_count, origin_loc, origin_pic, origin_nip, dest_loc, dest_pic, dest_nip, purpose, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            'BAST/MUT/2025/0082',
            1,
            'Laptop ThinkPad T14 Gen 4 Intel Core i7',
            'SAR/2024/0101',
            '2 Unit',
            'Ruang Tata Usaha Rektorat Lt. 1',
            'Dewi Sartika, S.E.',
            '198709122010012003',
            'Studio Podcast & Multimedia B.102',
            'Bambang Irawan, S.Kom',
            '198403152008121002',
            'Dukungan Produksi Konten Pembelajaran Daring & Podcast Kampus',
            'Dalam Proses Pemindahan',
            '28 Maret 2025'
        ]);
    }

    // 10. Stock Opname
    $stockCount = (int)$pdo->query("SELECT COUNT(*) FROM stock_opname")->fetchColumn();
    if ($stockCount === 0) {
        $stmt = $pdo->prepare("INSERT INTO stock_opname (code, name, category, sn, actual_loc, master_loc, is_loc_diff, audit_status, condition, auditor, scan_time, session_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute(['SAR/2023/0440', 'Mikroskop Binokuler Olympus CX23 LED', 'Alat Laboratorium & Riset', 'OLY-883921', 'Lab Terpadu Bioteknologi B.302', 'Lab Biologi Dasar R. 101', 1, 'Ditemukan (Selisih Lokasi)', 'Baik', 'Dedi Ardiansyah', 'Scan QR - 28 Mar 10:14', 'Audit Semester 1 - 2025']);
        $stmt->execute(['SAR/2024/0101', 'Laptop ThinkPad T14 Gen 4 Intel Core i7', 'Elektronik & Multimedia', 'PF-4J28901', 'Ruang Rapat Dekanat Lt. 3', 'Ruang Rapat Dekanat Lt. 3', 0, 'Cocok Sesuai Data', 'Baik', 'Irfan Kusuma', 'Scan QR - 28 Mar 09:30', 'Audit Semester 1 - 2025']);
        $stmt->execute(['SAR/2024/0088', 'AC Split Daikin Inverter 2 PK Flash', 'Utilitas & Kelistrikan', 'DKN-FTKC50-9912', 'Auditorium Sidang Senat Lt. 2', 'Auditorium Sidang Senat Lt. 2', 0, 'Cocok Sesuai Data', 'Rusak Ringan', 'Joko Supriyanto', 'Scan QR - 28 Mar 11:05', 'Audit Semester 1 - 2025']);
    }

    // 11. Settings
    $setCount = (int)$pdo->query("SELECT COUNT(*) FROM settings")->fetchColumn();
    if ($setCount === 0) {
        $stmt = $pdo->prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
        $stmt->execute(['nama_institusi', 'Universitas Teknologi & Sains Nusantara']);
        $stmt->execute(['durasi_peminjaman_hari', '7']);
        $stmt->execute(['approval_bertingkat', '1']);
        $stmt->execute(['email_notifikasi', 'sarpras@institusi.ac.id']);
        $stmt->execute(['versi_sistem', '2.5.0-Enterprise']);
    }

    // 12. Activity Logs
    $logCount = (int)$pdo->query("SELECT COUNT(*) FROM activity_logs")->fetchColumn();
    if ($logCount === 0) {
        $stmt = $pdo->prepare("INSERT INTO activity_logs (user_name, action, details) VALUES (?, ?, ?)");
        $stmt->execute(['System', 'Inisialisasi Database', 'Database SIMAS SQLite berhasil dibuat dan di-seed dengan data awal.']);
        $stmt->execute(['Dr. Hendro Purnomo', 'Login', 'Login administrator sarpras terverifikasi.']);
    }
}

