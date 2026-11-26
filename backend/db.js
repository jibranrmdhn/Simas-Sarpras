/**
 * SIMAS - Backend Database Module (Node.js 24 SQLite DatabaseSync)
 * Lokasi berkas database: data/simas.db
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.resolve(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'simas.db');
const db = new DatabaseSync(DB_PATH);

// Aktifkan Foreign Keys & WAL mode
db.exec(`
  PRAGMA foreign_keys = ON;
`);

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nama TEXT NOT NULL,
      nip TEXT,
      email TEXT,
      unit TEXT DEFAULT '',
      account_type TEXT DEFAULT '',
      role TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      rejection_reason TEXT DEFAULT '',
      approved_by TEXT DEFAULT '',
      approved_at DATETIME,
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
      peminjam_nama TEXT NOT NULL,
      peminjam_nip TEXT,
      keperluan TEXT,
      tgl_pinjam TEXT,
      tgl_kembali TEXT,
      status TEXT DEFAULT 'Menunggu Approval',
      catatan TEXT,
      approved_by TEXT,
      approved_at TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS approvals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kode TEXT UNIQUE NOT NULL,
      tag TEXT,
      is_urgent INTEGER DEFAULT 0,
      title TEXT NOT NULL,
      category TEXT,
      requester_name TEXT,
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
      asset_id INTEGER,
      asset_kode TEXT DEFAULT '',
      asset_nama TEXT DEFAULT '',
      target_type TEXT DEFAULT 'aset',
      title TEXT NOT NULL,
      location TEXT,
      gedung TEXT,
      priority TEXT DEFAULT 'NORMAL',
      category TEXT,
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
      nup TEXT,
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
  `);

  try {
    db.exec("ALTER TABLE mutations ADD COLUMN doc_status TEXT DEFAULT 'Menunggu TTD';");
  } catch (_) {
    // Column already exists
  }

  const userMigrations = [
    "ALTER TABLE users ADD COLUMN unit TEXT DEFAULT '';",
    "ALTER TABLE users ADD COLUMN account_type TEXT DEFAULT '';",
    "ALTER TABLE users ADD COLUMN status TEXT NOT NULL DEFAULT 'active';",
    "ALTER TABLE users ADD COLUMN rejection_reason TEXT DEFAULT '';",
    "ALTER TABLE users ADD COLUMN approved_by TEXT DEFAULT '';",
    "ALTER TABLE users ADD COLUMN approved_at DATETIME;"
  ];
  for (const sql of userMigrations) {
    try {
      db.exec(sql);
    } catch (_) {
      // Column already exists
    }
  }

  const ticketMigrations = [
    "ALTER TABLE tickets ADD COLUMN asset_id INTEGER;",
    "ALTER TABLE tickets ADD COLUMN asset_kode TEXT DEFAULT '';",
    "ALTER TABLE tickets ADD COLUMN asset_nama TEXT DEFAULT '';",
    "ALTER TABLE tickets ADD COLUMN target_type TEXT DEFAULT 'aset';"
  ];
  for (const sql of ticketMigrations) {
    try {
      db.exec(sql);
    } catch (_) {
      // Column already exists
    }
  }
}

function seedData() {
  // 1. Seed Users
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (username, password, nama, nip, email, role, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run('admin', 'admin123', 'Dr. Hendro Purnomo, M.Kom', '198203152008121001', 'hendro.admin@institusi.ac.id', 'admin', '../assets/avatar_hendro.jpg');
    insertUser.run('petugas', 'petugas123', 'Siti Nurhaliza, S.T', '199008242014042002', 'siti.sarpras@institusi.ac.id', 'petugas', '../assets/avatar_bambang.jpg');
    insertUser.run('pimpinan', 'pimpinan123', 'Prof. Ir. Bambang Soeprapto', '196511101991031003', 'bambang.pimpinan@institusi.ac.id', 'pimpinan', '../assets/avatar_hendro.jpg');
    insertUser.run('peminjam', 'peminjam123', 'Ahmad Fauzi (Dosen/Mhs)', '2021510045', 'ahmad.fauzi@mahasiswa.ac.id', 'peminjam', '../assets/avatar_bambang.jpg');
  }

  // 2. Seed Categories
  const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
  if (catCount === 0) {
    const insertCat = db.prepare(`
      INSERT INTO categories (kode, nama, icon, desc, susut, color)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertCat.run('KAT-01', 'Elektronik & Multimedia', 'monitor', 'Laptop, PC Desktop, Proyektor, Smartboard, Sound System, TV Display', '4 Tahun', 'blue');
    insertCat.run('KAT-02', 'Alat Laboratorium & Riset', 'flask-conical', 'Mikroskop, Spektrofotometer, Centrifuge, Timbangan Analitik, Osiloskop', '5 Tahun', 'teal');
    insertCat.run('KAT-03', 'Utilitas & Kelistrikan', 'zap', 'AC Daikin Inverter, Genset Silent, Pompa Booster, Panel Induk MDP, UPS Server', '8 Tahun', 'amber');
    insertCat.run('KAT-04', 'Mebel & Furnitur', 'armchair', 'Meja Rapat Konferensi Kayu Jati, Kursi Ergonomis, Lemari Arsip Tahan Api', '10 Tahun', 'indigo');
  }

  // 3. Seed Buildings & Locations
  const bldgCount = db.prepare('SELECT COUNT(*) as count FROM buildings').get().count;
  if (bldgCount === 0) {
    const insertBldg = db.prepare('INSERT INTO buildings (kode, nama, tipe, jumlah_lantai, pic) VALUES (?, ?, ?, ?, ?)');
    insertBldg.run('GD-REK', 'Gedung Rektorat (Pusat)', 'Rektorat', 4, 'Bambang Irawan');
    insertBldg.run('GD-FT', 'Gedung Fakultas Teknik', 'Fakultas', 5, 'Ir. Hendro Wicaksono');
    insertBldg.run('GD-LAB', 'Gedung Laboratorium Terpadu', 'Laboratorium', 4, 'Dr. Sri Rejeki');
    insertBldg.run('GD-PASCA', 'Gedung Pascasarjana & Riset', 'Pascasarjana', 3, 'Prof. Bambang');

    const insertLoc = db.prepare('INSERT INTO locations (kode, nama, gedung_kode, lantai, kapasitas, luas, kondisi, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    insertLoc.run('R-REK-01', 'Ruang Rapat Dekanat Lt. 3', 'GD-REK', 'Lantai 3', '25 Orang', '85 m²', 'Sangat Baik', 'Tersedia');
    insertLoc.run('R-REK-AUD', 'Auditorium Sidang Senat Lt. 2', 'GD-REK', 'Lantai 2', '350 Orang', '420 m²', 'Sangat Baik', 'Tersedia');
    insertLoc.run('R-FT-LAB1', 'Lab Komputasi & Jaringan A.201', 'GD-FT', 'Lantai 2', '40 Mahasiswa', '110 m²', 'Baik', 'Tersedia');
    insertLoc.run('R-FT-LAB2', 'Studio Podcast & Multimedia B.102', 'GD-FT', 'Lantai 1', '12 Orang', '45 m²', 'Sangat Baik', 'Tersedia');
    insertLoc.run('R-LAB-BIO', 'Lab Terpadu Bioteknologi B.302', 'GD-LAB', 'Lantai 3', '30 Mahasiswa', '125 m²', 'Baik', 'Tersedia');
  }

  // 4. Seed Employees
  const empCount = db.prepare('SELECT COUNT(*) as count FROM employees').get().count;
  if (empCount === 0) {
    const insertEmp = db.prepare('INSERT INTO employees (nip, nama, unit_kerja, jabatan, email, telepon, status_aset) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insertEmp.run('197804152003121002', 'Dr. Ir. Hendro Wicaksono, M.T.', 'Rektorat / Pimpinan', 'Wakil Rektor II', 'hendro@institusi.ac.id', '0812-3456-7890', '14 Ruangan Rektorat');
    insertEmp.run('198403152008121002', 'Bambang Irawan, S.Kom', 'Bagian Umum & Sarpras', 'Kepala Subbag Sarpras', 'bambang@institusi.ac.id', '0813-8822-1100', '2.845 Seluruh Aset Master');
    insertEmp.run('198709122010012003', 'Dewi Sartika, S.E.', 'Biro Kepegawaian & TU', 'Staf Keuangan & Gaji', 'dewi@institusi.ac.id', '0815-7766-5544', '4 Perangkat Komputasi');
    insertEmp.run('198807212012011004', 'Joko Supriyanto, A.Md', 'Divisi Operasional & Servis', 'Teknisi Sarpras Utama', 'joko@institusi.ac.id', '0818-9900-4433', '188 Tiket Servis');
  }

  // 5. Seed Assets
  const assetCount = db.prepare('SELECT COUNT(*) as count FROM assets').get().count;
  if (assetCount === 0) {
    const insertAsset = db.prepare(`
      INSERT INTO assets (nup, nama, kode, kategori_id, kategori_nama, lokasi, gedung, pic, pic_nip, kondisi, status, tahun, nilai, foto, serial, desc)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const assetsInit = [
      {
        nup: 'SAR/2024/0101',
        nama: 'Laptop ThinkPad T14 Gen 4 Intel Core i7',
        kode: 'AST-LPT-001',
        catId: 1,
        catName: 'Elektronik & Multimedia',
        lokasi: 'Ruang Rapat Dekanat Lt. 3',
        gedung: 'Gedung Rektorat (Pusat)',
        pic: 'Bambang Irawan, S.Kom',
        picNip: '198403152008121002',
        kondisi: 'Baik',
        status: 'Tersedia',
        tahun: '2024',
        nilai: 24500000,
        foto: '../assets/laptop.jpg',
        serial: 'PF-4J28901',
        desc: 'Laptop inventaris dinas pimpinan & riset, RAM 32GB SSD 1TB.'
      },
      {
        nup: 'SAR/2023/0440',
        nama: 'Mikroskop Binokuler Olympus CX23 LED',
        kode: 'AST-LAB-012',
        catId: 2,
        catName: 'Alat Laboratorium & Riset',
        lokasi: 'Lab Terpadu Bioteknologi B.302',
        gedung: 'Gedung Laboratorium Terpadu',
        pic: 'Dr. Ir. Hendro Wicaksono, M.T.',
        picNip: '197804152003121002',
        kondisi: 'Baik',
        status: 'Tersedia',
        tahun: '2023',
        nilai: 38200000,
        foto: '../assets/mikroskop.jpg',
        serial: 'OLY-883921',
        desc: 'Mikroskop riset laboratorium dengan pembesaran hingga 1000x optik plan achromat.'
      },
      {
        nup: 'SAR/2024/0088',
        nama: 'AC Split Daikin Inverter 2 PK Flash',
        kode: 'AST-AC-028',
        catId: 3,
        catName: 'Utilitas & Kelistrikan',
        lokasi: 'Auditorium Sidang Senat Lt. 2',
        gedung: 'Gedung Rektorat (Pusat)',
        pic: 'Joko Supriyanto, A.Md',
        picNip: '198807212012011004',
        kondisi: 'Rusak Ringan',
        status: 'Perawatan',
        tahun: '2024',
        nilai: 14800000,
        foto: '../assets/ac.jpg',
        serial: 'DKN-FTKC50-9912',
        desc: 'Perlu servis modul PCB outdoor dan pembersihan berkala freon R32.'
      },
      {
        nup: 'SAR/2022/0312',
        nama: 'Meja Rapat Konferensi Kayu Jati Solid 12 Kursi',
        kode: 'AST-MEB-004',
        catId: 4,
        catName: 'Mebel & Furnitur',
        lokasi: 'Ruang Rapat Dekanat Lt. 3',
        gedung: 'Gedung Rektorat (Pusat)',
        pic: 'Dewi Sartika, S.E.',
        picNip: '198709122010012003',
        kondisi: 'Baik',
        status: 'Tersedia',
        tahun: '2022',
        nilai: 32000000,
        foto: '../assets/meja-rapat.jpg',
        serial: 'FUR-JAT-2022-004',
        desc: 'Meja bundar oval kayu jati Jepara finishing melamin doff dengan socket cable management.'
      },
      {
        nup: 'SAR/2023/0015',
        nama: 'Genset Cummins Silent 100 kVA Standby Power',
        kode: 'AST-GEN-001',
        catId: 3,
        catName: 'Utilitas & Kelistrikan',
        lokasi: 'Rumah Genset & Power House Barat',
        gedung: 'Gedung Pascasarjana & Riset',
        pic: 'Joko Supriyanto, A.Md',
        picNip: '198807212012011004',
        kondisi: 'Baik',
        status: 'Tersedia',
        tahun: '2023',
        nilai: 245000000,
        foto: '../assets/genset_cummins.jpg',
        serial: 'CUM-6BT5.9-G2',
        desc: 'Pembangkit daya darurat kampus otomatis ATS saat suplai PLN padam.'
      },
      {
        nup: 'SAR/2024/0219',
        nama: 'PC Desktop Lenovo ThinkCentre M70s Gen 4',
        kode: 'AST-PC-019',
        catId: 1,
        catName: 'Elektronik & Multimedia',
        lokasi: 'Lab Komputasi & Jaringan A.201',
        gedung: 'Gedung Fakultas Teknik',
        pic: 'Bambang Irawan, S.Kom',
        picNip: '198403152008121002',
        kondisi: 'Baik',
        status: 'Dipinjam',
        tahun: '2024',
        nilai: 18500000,
        foto: '../assets/pc_thinkcentre.jpg',
        serial: 'MJ-098K4L1',
        desc: 'Workstation komputasi praktikum mahasiswa TI, Intel Core i7 16GB SSD 512GB.'
      },
      {
        nup: 'SAR/2023/0891',
        nama: 'Wireless Microphone Sennheiser EW-D Digital',
        kode: 'AST-AUD-042',
        catId: 1,
        catName: 'Elektronik & Multimedia',
        lokasi: 'Studio Podcast & Multimedia B.102',
        gedung: 'Gedung Fakultas Teknik',
        pic: 'Dewi Sartika, S.E.',
        picNip: '198709122010012003',
        kondisi: 'Baik',
        status: 'Tersedia',
        tahun: '2023',
        nilai: 12800000,
        foto: '../assets/mic_sennheiser.jpg',
        serial: 'SN-MIC-2023-8891',
        desc: 'Sistem mikrofon nirkabel digital latensi rendah 1.9 ms untuk seminar dan podcast.'
      },
      {
        nup: 'SAR/2024/0520',
        nama: 'Laser Projector Epson EB-L730U 7000 Lumens',
        kode: 'AST-PRJ-008',
        catId: 1,
        catName: 'Elektronik & Multimedia',
        lokasi: 'Auditorium Sidang Senat Lt. 2',
        gedung: 'Gedung Rektorat (Pusat)',
        pic: 'Bambang Irawan, S.Kom',
        picNip: '198403152008121002',
        kondisi: 'Baik',
        status: 'Tersedia',
        tahun: '2024',
        nilai: 54000000,
        foto: '../assets/proyektor.jpg',
        serial: 'EPS-L730U-00918',
        desc: 'Proyektor laser Full HD WUXGA 7.000 lumens untuk ruang aula besar berkapasitas 500 orang.'
      }
    ];

    for (const a of assetsInit) {
      insertAsset.run(
        a.nup, a.nama, a.kode, a.catId, a.catName, a.lokasi, a.gedung,
        a.pic, a.picNip, a.kondisi, a.status, a.tahun, a.nilai,
        a.foto, a.serial, a.desc
      );
    }
  }

  // 6. Seed Loans
  // CATATAN: Seed data peminjaman sengaja DINONAKTIFKAN agar daftar peminjaman
  // kosong saat demo/presentasi. Data baru tetap bisa dibuat lewat menu Peminjaman.
  // Aktifkan kembali blok di bawah ini jika ingin memakai data contoh bawaan.
  const SEED_LOANS = false;
  const loanCount = db.prepare('SELECT COUNT(*) as count FROM loans').get().count;
  if (SEED_LOANS && loanCount === 0) {
    const insertLoan = db.prepare(`
      INSERT INTO loans (kode, asset_id, asset_nama, user_id, peminjam_nama, peminjam_nip, keperluan, tgl_pinjam, tgl_kembali, status, catatan)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertLoan.run('PINJAM-2025-001', 6, 'PC Desktop Lenovo ThinkCentre M70s Gen 4', 4, 'Ahmad Fauzi (Dosen/Mhs)', '2021510045', 'Uji Coba Sistem Server Akreditasi Prodi TI', '2025-03-25', '2025-04-01', 'Aktif', 'Disetujui untuk riset akreditasi lab');
    insertLoan.run('PINJAM-2025-002', 1, 'Laptop ThinkPad T14 Gen 4 Intel Core i7', 4, 'Ahmad Fauzi (Dosen/Mhs)', '2021510045', 'Presentasi Konferensi Ilmiah Nasional', '2025-03-28', '2025-03-30', 'Menunggu Approval', 'Menunggu persetujuan pimpinan');
    insertLoan.run('PINJAM-2025-003', 7, 'Wireless Microphone Sennheiser EW-D Digital', 2, 'Siti Nurhaliza, S.T', '199008242014042002', 'Kuliah Tamu Industri Kampus Merdeka', '2025-03-20', '2025-03-22', 'Selesai', 'Dikembalikan dalam kondisi baik dan lengkap');
  }

  // 7. Seed Approvals
  const appvCount = db.prepare('SELECT COUNT(*) as count FROM approvals').get().count;
  if (appvCount === 0) {
    const insertAppv = db.prepare(`
      INSERT INTO approvals (kode, tag, is_urgent, title, category, requester_name, requester_nip, requester_phone, requester_email, requester_avatar, doc_number, doc_label, schedule, facility, waiting_for, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertAppv.run(
      '#APV-2025-0142',
      'PEMINJAMAN RUANGAN & ALAT • URGENT',
      1,
      'Workshop Akreditasi Internasional ABET',
      'ruangan',
      'Dr. Ir. Hendro Wicaksono, M.T.',
      '197804152003121002 • Ka. Prodi Teknik Informatika',
      '0812-3456-7890',
      'hendro@institusi.ac.id',
      '../assets/avatar_hendro.jpg',
      '412/FT-TI/UND/2025',
      'Surat Pengantar Dekan',
      'Sabtu, 29 Maret 2025 • 08:00 - 17:00 WIB',
      'Auditorium Utama & 4 Mic Sennheiser',
      'Menunggu: Ka. Biro Sarpras',
      'Sedang Ditinjau'
    );

    insertAppv.run(
      '#APV-2025-0143',
      'PERPANJANGAN FASILITAS • NORMAL',
      0,
      'Riset Laboratorium Biomedika Bersama Mitra Industri',
      'ruangan',
      'Dewi Sartika, S.E.',
      '198709122010012003 • Ka. Laboratorium Biologi',
      '0815-7766-5544',
      'dewi@institusi.ac.id',
      '../assets/avatar_bambang.jpg',
      '118/LAB-BIO/2025',
      'Surat Izin Pemakaian Riset',
      '31 Maret - 5 April 2025 • 08:00 - 20:00 WIB',
      'Lab Terpadu Bioteknologi B.302 & Mikroskop Olympus',
      'Menunggu: Wakil Rektor II',
      'Sedang Ditinjau'
    );
  }

  // 8. Seed Maintenance Tickets
  const ticketCount = db.prepare('SELECT COUNT(*) as count FROM tickets').get().count;
  if (ticketCount === 0) {
    const insertTicket = db.prepare(`
      INSERT INTO tickets (kode, title, location, gedung, priority, category, reporter, tech_name, status, desc, cost)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertTicket.run('TKT-0841', 'AC Daikin Tidak Dingin & Menetes Freon', 'Auditorium Sidang Senat Lt. 2', 'Gedung Rektorat (Pusat)', 'TINGGI', 'Utilitas AC', 'Bambang Irawan', 'Joko Supriyanto', 'proses', 'Kondensor outdoor berisik dan pipa evaporator membeku.', 650000);
    insertTicket.run('TKT-0842', 'Proyektor Laser Epson Mati Total (No Power)', 'Ruang Rapat Dekanat Lt. 3', 'Gedung Rektorat (Pusat)', 'URGENT', 'Multimedia', 'Dewi Sartika', 'Joko Supriyanto', 'sparepart', 'Kabel power normal, power supply internal butuh penggantian sekring/modul.', 1200000);
    insertTicket.run('TKT-0843', 'Panel Distribusi Listrik MCB Trip Berkala', 'Lab Komputasi A.201', 'Gedung Fakultas Teknik', 'TINGGI', 'Kelistrikan', 'Hendro Wicaksono', 'Teknisi PLN Vendor', 'baru', 'Beban over saat 30 PC dinyalakan serempak, perlu rebalancing phase.', 450000);
    insertTicket.run('TKT-0839', 'Pintu Kaca Otomatis Lobi Macet Sensor', 'Lobi Utama Rektorat', 'Gedung Rektorat (Pusat)', 'NORMAL', 'Fasilitas Gedung', 'Satpam Rektorat', 'Joko Supriyanto', 'selesai', 'Sensor inframerah kotor dan motor stepper telah diservis serta diberi pelumas.', 150000);
  }

  // 9. Seed Mutations
  const mutCount = db.prepare('SELECT COUNT(*) as count FROM mutations').get().count;
  if (mutCount === 0) {
    const insertMut = db.prepare(`
      INSERT INTO mutations (bast_no, asset_id, asset_name, nup, unit_count, origin_loc, origin_pic, origin_nip, dest_loc, dest_pic, dest_nip, purpose, status, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertMut.run(
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
    );
  }

  // 10. Seed Stock Opname
  const stockCount = db.prepare('SELECT COUNT(*) as count FROM stock_opname').get().count;
  if (stockCount === 0) {
    const insertStock = db.prepare(`
      INSERT INTO stock_opname (code, name, category, sn, actual_loc, master_loc, is_loc_diff, audit_status, condition, auditor, scan_time, session_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStock.run('SAR/2023/0440', 'Mikroskop Binokuler Olympus CX23 LED', 'Alat Laboratorium & Riset', 'OLY-883921', 'Lab Terpadu Bioteknologi B.302', 'Lab Biologi Dasar R. 101', 1, 'Ditemukan (Selisih Lokasi)', 'Baik', 'Dedi Ardiansyah', 'Scan QR - 28 Mar 10:14', 'Audit Semester 1 - 2025');
    insertStock.run('SAR/2024/0101', 'Laptop ThinkPad T14 Gen 4 Intel Core i7', 'Elektronik & Multimedia', 'PF-4J28901', 'Ruang Rapat Dekanat Lt. 3', 'Ruang Rapat Dekanat Lt. 3', 0, 'Cocok Sesuai Data', 'Baik', 'Irfan Kusuma', 'Scan QR - 28 Mar 09:30', 'Audit Semester 1 - 2025');
    insertStock.run('SAR/2024/0088', 'AC Split Daikin Inverter 2 PK Flash', 'Utilitas & Kelistrikan', 'DKN-FTKC50-9912', 'Auditorium Sidang Senat Lt. 2', 'Auditorium Sidang Senat Lt. 2', 0, 'Cocok Sesuai Data', 'Rusak Ringan', 'Joko Supriyanto', 'Scan QR - 28 Mar 11:05', 'Audit Semester 1 - 2025');
  }

  // 11. Seed Settings
  const setCount = db.prepare('SELECT COUNT(*) as count FROM settings').get().count;
  if (setCount === 0) {
    const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    insertSetting.run('nama_institusi', 'Universitas Teknologi & Sains Nusantara');
    insertSetting.run('durasi_peminjaman_hari', '7');
    insertSetting.run('approval_bertingkat', '1');
    insertSetting.run('email_notifikasi', 'sarpras@institusi.ac.id');
    insertSetting.run('versi_sistem', '2.5.0-Enterprise');
  }

  // 12. Seed Activity Logs
  const logCount = db.prepare('SELECT COUNT(*) as count FROM activity_logs').get().count;
  if (logCount === 0) {
    const insertLog = db.prepare('INSERT INTO activity_logs (user_name, action, details) VALUES (?, ?, ?)');
    insertLog.run('System', 'Inisialisasi Database', 'Database SIMAS SQLite berhasil dibuat dan di-seed dengan data awal.');
    insertLog.run('Dr. Hendro Purnomo', 'Login', 'Login administrator sarpras terverifikasi.');
  }
}

// Inisialisasi skema dan data
initSchema();
seedData();

module.exports = {
  db,
  initSchema,
  seedData
};

