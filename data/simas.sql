-- SIMAS Database Dump
-- Generated for PWEB2

CREATE TABLE users (
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

INSERT INTO users (id, username, password, nama, nip, email, role, avatar, created_at) VALUES ('1', 'admin', 'admin123', 'Dr. Hendro Purnomo, M.Kom', '198203152008121001', 'hendro.admin@institusi.ac.id', 'admin', '../assets/avatar_hendro.jpg', '2026-11-03 14:21:24');
INSERT INTO users (id, username, password, nama, nip, email, role, avatar, created_at) VALUES ('2', 'petugas', 'petugas123', 'Siti Nurhaliza, S.T', '199008242014042002', 'siti.sarpras@institusi.ac.id', 'petugas', '../assets/avatar_bambang.jpg', '2026-11-03 14:21:24');
INSERT INTO users (id, username, password, nama, nip, email, role, avatar, created_at) VALUES ('3', 'pimpinan', 'pimpinan123', 'Prof. Ir. Bambang Soeprapto', '196511101991031003', 'bambang.pimpinan@institusi.ac.id', 'pimpinan', '../assets/avatar_hendro.jpg', '2026-11-03 14:21:24');
INSERT INTO users (id, username, password, nama, nip, email, role, avatar, created_at) VALUES ('4', 'peminjam', 'peminjam123', 'Ahmad Fauzi (Dosen/Mhs)', '2021510045', 'ahmad.fauzi@mahasiswa.ac.id', 'peminjam', '../assets/avatar_bambang.jpg', '2026-11-03 14:21:24');

CREATE TABLE categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kode TEXT UNIQUE NOT NULL,
      nama TEXT NOT NULL,
      icon TEXT DEFAULT 'archive',
      desc TEXT,
      susut TEXT,
      color TEXT DEFAULT 'blue',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO categories (id, kode, nama, icon, desc, susut, color, created_at) VALUES ('1', 'KAT-01', 'Elektronik & Multimedia', 'monitor', 'Laptop, PC Desktop, Proyektor, Smartboard, Sound System, TV Display', '4 Tahun', 'blue', '2026-11-03 14:21:24');
INSERT INTO categories (id, kode, nama, icon, desc, susut, color, created_at) VALUES ('2', 'KAT-02', 'Alat Laboratorium & Riset', 'flask-conical', 'Mikroskop, Spektrofotometer, Centrifuge, Timbangan Analitik, Osiloskop', '5 Tahun', 'teal', '2026-11-03 14:21:24');
INSERT INTO categories (id, kode, nama, icon, desc, susut, color, created_at) VALUES ('3', 'KAT-03', 'Utilitas & Kelistrikan', 'zap', 'AC Daikin Inverter, Genset Silent, Pompa Booster, Panel Induk MDP, UPS Server', '8 Tahun', 'amber', '2026-11-03 14:21:24');
INSERT INTO categories (id, kode, nama, icon, desc, susut, color, created_at) VALUES ('4', 'KAT-04', 'Mebel & Furnitur', 'armchair', 'Meja Rapat Konferensi Kayu Jati, Kursi Ergonomis, Lemari Arsip Tahan Api', '10 Tahun', 'indigo', '2026-11-03 14:21:24');

CREATE TABLE buildings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kode TEXT UNIQUE NOT NULL,
      nama TEXT NOT NULL,
      tipe TEXT,
      jumlah_lantai INTEGER DEFAULT 3,
      pic TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO buildings (id, kode, nama, tipe, jumlah_lantai, pic, created_at) VALUES ('1', 'GD-REK', 'Gedung Rektorat (Pusat)', 'Rektorat', '4', 'Bambang Irawan', '2026-11-03 14:21:24');
INSERT INTO buildings (id, kode, nama, tipe, jumlah_lantai, pic, created_at) VALUES ('2', 'GD-FT', 'Gedung Fakultas Teknik', 'Fakultas', '5', 'Ir. Hendro Wicaksono', '2026-11-03 14:21:24');
INSERT INTO buildings (id, kode, nama, tipe, jumlah_lantai, pic, created_at) VALUES ('3', 'GD-LAB', 'Gedung Laboratorium Terpadu', 'Laboratorium', '4', 'Dr. Sri Rejeki', '2026-11-03 14:21:24');
INSERT INTO buildings (id, kode, nama, tipe, jumlah_lantai, pic, created_at) VALUES ('4', 'GD-PASCA', 'Gedung Pascasarjana & Riset', 'Pascasarjana', '3', 'Prof. Bambang', '2026-11-03 14:21:24');

CREATE TABLE locations (
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

INSERT INTO locations (id, kode, nama, gedung_kode, lantai, kapasitas, luas, kondisi, status, created_at) VALUES ('1', 'R-REK-01', 'Ruang Rapat Dekanat Lt. 3', 'GD-REK', 'Lantai 3', '25 Orang', '85 m²', 'Sangat Baik', 'Tersedia', '2026-11-03 14:21:24');
INSERT INTO locations (id, kode, nama, gedung_kode, lantai, kapasitas, luas, kondisi, status, created_at) VALUES ('2', 'R-REK-AUD', 'Auditorium Sidang Senat Lt. 2', 'GD-REK', 'Lantai 2', '350 Orang', '420 m²', 'Sangat Baik', 'Tersedia', '2026-11-03 14:21:24');
INSERT INTO locations (id, kode, nama, gedung_kode, lantai, kapasitas, luas, kondisi, status, created_at) VALUES ('3', 'R-FT-LAB1', 'Lab Komputasi & Jaringan A.201', 'GD-FT', 'Lantai 2', '40 Mahasiswa', '110 m²', 'Baik', 'Tersedia', '2026-11-03 14:21:24');
INSERT INTO locations (id, kode, nama, gedung_kode, lantai, kapasitas, luas, kondisi, status, created_at) VALUES ('4', 'R-FT-LAB2', 'Studio Podcast & Multimedia B.102', 'GD-FT', 'Lantai 1', '12 Orang', '45 m²', 'Sangat Baik', 'Tersedia', '2026-11-03 14:21:24');
INSERT INTO locations (id, kode, nama, gedung_kode, lantai, kapasitas, luas, kondisi, status, created_at) VALUES ('5', 'R-LAB-BIO', 'Lab Terpadu Bioteknologi B.302', 'GD-LAB', 'Lantai 3', '30 Mahasiswa', '125 m²', 'Baik', 'Tersedia', '2026-11-03 14:21:24');

CREATE TABLE employees (
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

INSERT INTO employees (id, nip, nama, unit_kerja, jabatan, email, telepon, status_aset, created_at) VALUES ('1', '197804152003121002', 'Dr. Ir. Hendro Wicaksono, M.T.', 'Rektorat / Pimpinan', 'Wakil Rektor II', 'hendro@institusi.ac.id', '0812-3456-7890', '14 Ruangan Rektorat', '2026-11-03 14:21:24');
INSERT INTO employees (id, nip, nama, unit_kerja, jabatan, email, telepon, status_aset, created_at) VALUES ('2', '198403152008121002', 'Bambang Irawan, S.Kom', 'Bagian Umum & Sarpras', 'Kepala Subbag Sarpras', 'bambang@institusi.ac.id', '0813-8822-1100', '2.845 Seluruh Aset Master', '2026-11-03 14:21:24');
INSERT INTO employees (id, nip, nama, unit_kerja, jabatan, email, telepon, status_aset, created_at) VALUES ('3', '198709122010012003', 'Dewi Sartika, S.E.', 'Biro Kepegawaian & TU', 'Staf Keuangan & Gaji', 'dewi@institusi.ac.id', '0815-7766-5544', '4 Perangkat Komputasi', '2026-11-03 14:21:24');
INSERT INTO employees (id, nip, nama, unit_kerja, jabatan, email, telepon, status_aset, created_at) VALUES ('4', '198807212012011004', 'Joko Supriyanto, A.Md', 'Divisi Operasional & Servis', 'Teknisi Sarpras Utama', 'joko@institusi.ac.id', '0818-9900-4433', '188 Tiket Servis', '2026-11-03 14:21:24');

CREATE TABLE assets (
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

INSERT INTO assets (id, nup, nama, kode, kategori_id, kategori_nama, lokasi, gedung, pic, pic_nip, kondisi, status, tahun, nilai, foto, serial, desc, created_at, updated_at) VALUES ('1', 'SAR/2024/0101', 'Laptop ThinkPad T14 Gen 4 Intel Core i7', 'AST-LPT-001', '1', 'Elektronik & Multimedia', 'Ruang Rapat Dekanat Lt. 3', 'Gedung Rektorat (Pusat)', 'Bambang Irawan, S.Kom', '198403152008121002', 'Baik', 'Tersedia', '2024', '24500000', '../assets/laptop.jpg', 'PF-4J28901', 'Laptop inventaris dinas pimpinan & riset, RAM 32GB SSD 1TB.', '2026-11-03 14:21:24', '2026-11-03 14:21:24');
INSERT INTO assets (id, nup, nama, kode, kategori_id, kategori_nama, lokasi, gedung, pic, pic_nip, kondisi, status, tahun, nilai, foto, serial, desc, created_at, updated_at) VALUES ('2', 'SAR/2023/0440', 'Mikroskop Binokuler Olympus CX23 LED', 'AST-LAB-012', '2', 'Alat Laboratorium & Riset', 'Lab Terpadu Bioteknologi B.302', 'Gedung Laboratorium Terpadu', 'Dr. Ir. Hendro Wicaksono, M.T.', '197804152003121002', 'Baik', 'Tersedia', '2023', '38200000', '../assets/mikroskop.jpg', 'OLY-883921', 'Mikroskop riset laboratorium dengan pembesaran hingga 1000x optik plan achromat.', '2026-11-03 14:21:24', '2026-11-03 14:21:24');
INSERT INTO assets (id, nup, nama, kode, kategori_id, kategori_nama, lokasi, gedung, pic, pic_nip, kondisi, status, tahun, nilai, foto, serial, desc, created_at, updated_at) VALUES ('3', 'SAR/2024/0088', 'AC Split Daikin Inverter 2 PK Flash', 'AST-AC-028', '3', 'Utilitas & Kelistrikan', 'Auditorium Sidang Senat Lt. 2', 'Gedung Rektorat (Pusat)', 'Joko Supriyanto, A.Md', '198807212012011004', 'Rusak Ringan', 'Perawatan', '2024', '14800000', '../assets/ac.jpg', 'DKN-FTKC50-9912', 'Perlu servis modul PCB outdoor dan pembersihan berkala freon R32.', '2026-11-03 14:21:24', '2026-11-03 14:21:24');
INSERT INTO assets (id, nup, nama, kode, kategori_id, kategori_nama, lokasi, gedung, pic, pic_nip, kondisi, status, tahun, nilai, foto, serial, desc, created_at, updated_at) VALUES ('4', 'SAR/2022/0312', 'Meja Rapat Konferensi Kayu Jati Solid 12 Kursi', 'AST-MEB-004', '4', 'Mebel & Furnitur', 'Ruang Rapat Dekanat Lt. 3', 'Gedung Rektorat (Pusat)', 'Dewi Sartika, S.E.', '198709122010012003', 'Baik', 'Tersedia', '2022', '32000000', '../assets/meja-rapat.jpg', 'FUR-JAT-2022-004', 'Meja bundar oval kayu jati Jepara finishing melamin doff dengan socket cable management.', '2026-11-03 14:21:24', '2026-11-03 14:21:24');
INSERT INTO assets (id, nup, nama, kode, kategori_id, kategori_nama, lokasi, gedung, pic, pic_nip, kondisi, status, tahun, nilai, foto, serial, desc, created_at, updated_at) VALUES ('5', 'SAR/2023/0015', 'Genset Cummins Silent 100 kVA Standby Power', 'AST-GEN-001', '3', 'Utilitas & Kelistrikan', 'Rumah Genset & Power House Barat', 'Gedung Pascasarjana & Riset', 'Joko Supriyanto, A.Md', '198807212012011004', 'Baik', 'Tersedia', '2023', '245000000', '../assets/genset_cummins.jpg', 'CUM-6BT5.9-G2', 'Pembangkit daya darurat kampus otomatis ATS saat suplai PLN padam.', '2026-11-03 14:21:24', '2026-11-03 14:21:24');
INSERT INTO assets (id, nup, nama, kode, kategori_id, kategori_nama, lokasi, gedung, pic, pic_nip, kondisi, status, tahun, nilai, foto, serial, desc, created_at, updated_at) VALUES ('6', 'SAR/2024/0219', 'PC Desktop Lenovo ThinkCentre M70s Gen 4', 'AST-PC-019', '1', 'Elektronik & Multimedia', 'Lab Komputasi & Jaringan A.201', 'Gedung Fakultas Teknik', 'Bambang Irawan, S.Kom', '198403152008121002', 'Baik', 'Tersedia', '2024', '18500000', '../assets/pc_thinkcentre.jpg', 'MJ-098K4L1', 'Workstation komputasi praktikum mahasiswa TI, Intel Core i7 16GB SSD 512GB.', '2026-11-03 14:21:24', '2026-11-03 14:21:24');
INSERT INTO assets (id, nup, nama, kode, kategori_id, kategori_nama, lokasi, gedung, pic, pic_nip, kondisi, status, tahun, nilai, foto, serial, desc, created_at, updated_at) VALUES ('7', 'SAR/2023/0891', 'Wireless Microphone Sennheiser EW-D Digital', 'AST-AUD-042', '1', 'Elektronik & Multimedia', 'Studio Podcast & Multimedia B.102', 'Gedung Fakultas Teknik', 'Dewi Sartika, S.E.', '198709122010012003', 'Baik', 'Tersedia', '2023', '12800000', '../assets/mic_sennheiser.jpg', 'SN-MIC-2023-8891', 'Sistem mikrofon nirkabel digital latensi rendah 1.9 ms untuk seminar dan podcast.', '2026-11-03 14:21:24', '2026-11-03 14:21:24');
INSERT INTO assets (id, nup, nama, kode, kategori_id, kategori_nama, lokasi, gedung, pic, pic_nip, kondisi, status, tahun, nilai, foto, serial, desc, created_at, updated_at) VALUES ('8', 'SAR/2024/0520', 'Laser Projector Epson EB-L730U 7000 Lumens', 'AST-PRJ-008', '1', 'Elektronik & Multimedia', 'Auditorium Sidang Senat Lt. 2', 'Gedung Rektorat (Pusat)', 'Bambang Irawan, S.Kom', '198403152008121002', 'Baik', 'Tersedia', '2024', '54000000', '../assets/proyektor.jpg', 'EPS-L730U-00918', 'Proyektor laser Full HD WUXGA 7.000 lumens untuk ruang aula besar berkapasitas 500 orang.', '2026-11-03 14:21:24', '2026-11-03 14:21:24');
INSERT INTO assets (id, nup, nama, kode, kategori_id, kategori_nama, lokasi, gedung, pic, pic_nip, kondisi, status, tahun, nilai, foto, serial, desc, created_at, updated_at) VALUES ('12', 'SAR/2025/0341', 'ROG STRIX ANJAY', 'SAR/2025/0014', '1', 'Elektronik', 'R.101', 'Gedung A, Lt. 1', 'BAMBANG', '198403152008121002', 'Baik', 'Tersedia', '2025', '24000000', '../assets/proyektor.jpg', 'FP/123/123', 'GAMING PARAH', '2026-11-03 15:30:50', '2026-11-03 15:30:50');

CREATE TABLE loans (
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

INSERT INTO loans (id, kode, asset_id, asset_nama, user_id, peminjam_nama, peminjam_nip, keperluan, tgl_pinjam, tgl_kembali, status, catatan, approved_by, approved_at, created_at) VALUES ('1', 'PINJAM-2025-001', '6', 'PC Desktop Lenovo ThinkCentre M70s Gen 4', '4', 'Ahmad Fauzi (Dosen/Mhs)', '2021510045', 'Rescheduled event', '2025-04-01', '2025-04-05', 'Selesai', 'Disetujui untuk riset akreditasi lab', NULL, NULL, '2026-11-03 14:21:24');
INSERT INTO loans (id, kode, asset_id, asset_nama, user_id, peminjam_nama, peminjam_nip, keperluan, tgl_pinjam, tgl_kembali, status, catatan, approved_by, approved_at, created_at) VALUES ('2', 'PINJAM-2025-002', '1', 'Laptop ThinkPad T14 Gen 4 Intel Core i7', '4', 'Ahmad Fauzi (Dosen/Mhs)', '2021510045', 'Presentasi Konferensi Ilmiah Nasional', '2025-03-28', '2025-03-30', 'Menunggu Approval', 'Menunggu persetujuan pimpinan', NULL, NULL, '2026-11-03 14:21:24');
INSERT INTO loans (id, kode, asset_id, asset_nama, user_id, peminjam_nama, peminjam_nip, keperluan, tgl_pinjam, tgl_kembali, status, catatan, approved_by, approved_at, created_at) VALUES ('3', 'PINJAM-2025-003', '7', 'Wireless Microphone Sennheiser EW-D Digital', '2', 'Siti Nurhaliza, S.T', '199008242014042002', 'Kuliah Tamu Industri Kampus Merdeka', '2025-03-20', '2025-03-22', 'Selesai', 'Dikembalikan dalam kondisi baik dan lengkap', NULL, NULL, '2026-11-03 14:21:24');
INSERT INTO loans (id, kode, asset_id, asset_nama, user_id, peminjam_nama, peminjam_nip, keperluan, tgl_pinjam, tgl_kembali, status, catatan, approved_by, approved_at, created_at) VALUES ('4', 'PINJAM-2026-0803', '1', 'Laptop ThinkPad T14 Gen 4 Intel Core i7', '4', 'Ahmad Fauzi', '2021510045', 'Uji Coba Backend API', '2026-11-03', '2026-11-10', 'Selesai', 'Menunggu otorisasi pimpinan / petugas', 'Pimpinan Institusi', '2026-11-03 14:35:58', '2026-11-03 14:35:58');
INSERT INTO loans (id, kode, asset_id, asset_nama, user_id, peminjam_nama, peminjam_nip, keperluan, tgl_pinjam, tgl_kembali, status, catatan, approved_by, approved_at, created_at) VALUES ('5', 'PINJAM-2026-0822', '1', 'Laptop ThinkPad T14 Gen 4 Intel Core i7', '4', 'Ahmad Fauzi', '2021510045', 'Uji Coba Backend API', '2026-11-03', '2026-11-10', 'Selesai', 'Menunggu otorisasi pimpinan / petugas', 'Pimpinan Institusi', '2026-11-03 14:36:40', '2026-11-03 14:36:40');
INSERT INTO loans (id, kode, asset_id, asset_nama, user_id, peminjam_nama, peminjam_nip, keperluan, tgl_pinjam, tgl_kembali, status, catatan, approved_by, approved_at, created_at) VALUES ('6', 'PINJAM-2026-0791', '1', 'Laptop ThinkPad T14 Gen 4 Intel Core i7', '4', 'Ahmad Fauzi', '2021510045', 'Uji Coba Backend API', '2026-11-03', '2026-11-10', 'Selesai', 'Menunggu otorisasi pimpinan / petugas', 'Pimpinan Institusi', '2026-11-03 15:22:47', '2026-11-03 15:22:47');
INSERT INTO loans (id, kode, asset_id, asset_nama, user_id, peminjam_nama, peminjam_nip, keperluan, tgl_pinjam, tgl_kembali, status, catatan, approved_by, approved_at, created_at) VALUES ('7', 'PINJAM-2026-0188', '1', 'Laptop ThinkPad T14 Gen 4 Intel Core i7', '4', 'Ahmad Fauzi', '2021510045', 'Uji Coba Backend API', '2026-11-03', '2026-11-10', 'Selesai', 'Menunggu otorisasi pimpinan / petugas', 'Pimpinan Institusi', '2026-11-03 15:43:11', '2026-11-03 15:43:11');
INSERT INTO loans (id, kode, asset_id, asset_nama, user_id, peminjam_nama, peminjam_nip, keperluan, tgl_pinjam, tgl_kembali, status, catatan, approved_by, approved_at, created_at) VALUES ('8', 'PINJAM-2026-0614', '1', 'Laptop ThinkPad T14 Gen 4 Intel Core i7', '4', 'Ahmad Fauzi', '2021510045', 'Uji Coba Backend API', '2026-11-03', '2026-11-10', 'Selesai', 'Menunggu otorisasi pimpinan / petugas', 'Pimpinan Institusi', '2026-11-03 15:45:58', '2026-11-03 15:45:58');
INSERT INTO loans (id, kode, asset_id, asset_nama, user_id, peminjam_nama, peminjam_nip, keperluan, tgl_pinjam, tgl_kembali, status, catatan, approved_by, approved_at, created_at) VALUES ('9', 'PINJAM-2026-0871', '12', 'ROG STRIX ANJAY', '4', 'Bambang Irawan, S.Kom', 'Bagian Umum & Perlengkapan Sarpras', 'ya', '2026-11-03', '2026-11-04', 'Menunggu Approval', 'Menunggu otorisasi pimpinan / petugas', NULL, NULL, '2026-11-03 16:04:18');
INSERT INTO loans (id, kode, asset_id, asset_nama, user_id, peminjam_nama, peminjam_nip, keperluan, tgl_pinjam, tgl_kembali, status, catatan, approved_by, approved_at, created_at) VALUES ('11', 'PINJAM-2026-0258', '1', 'Laptop ThinkPad T14 Gen 4 Intel Core i7', '4', 'Ahmad Fauzi', '2021510045', 'Uji Coba Backend API', '2026-11-03', '2026-11-10', 'Selesai', 'Menunggu otorisasi pimpinan / petugas', 'Pimpinan Institusi', '2026-11-03 16:59:49', '2026-11-03 16:59:49');
INSERT INTO loans (id, kode, asset_id, asset_nama, user_id, peminjam_nama, peminjam_nip, keperluan, tgl_pinjam, tgl_kembali, status, catatan, approved_by, approved_at, created_at) VALUES ('12', 'PINJAM-2026-0109', '12', 'ROG STRIX ANJAY', '4', 'Jibran', 'Fakultas Teknik / Dosen Informatika', 'Untuk digunakan kegiatan mengajar di malaysia', '2026-11-03', '2026-11-04', 'Selesai', 'Menunggu otorisasi pimpinan / petugas', 'undefined (admin)', '2026-11-03 17:03:33', '2026-11-03 17:02:44');
INSERT INTO loans (id, kode, asset_id, asset_nama, user_id, peminjam_nama, peminjam_nip, keperluan, tgl_pinjam, tgl_kembali, status, catatan, approved_by, approved_at, created_at) VALUES ('13', 'PINJAM-2026-0194', '1', 'Laptop ThinkPad T14 Gen 4 Intel Core i7', '4', 'Ahmad Fauzi', '2021510045', 'Uji Coba Backend API', '2026-11-10', '2026-11-17', 'Selesai', 'Menunggu otorisasi pimpinan / petugas', 'Pimpinan Institusi', '2026-11-10 13:04:14', '2026-11-10 13:04:14');

CREATE TABLE approvals (
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

INSERT INTO approvals (id, kode, tag, is_urgent, title, category, requester_name, requester_nip, requester_phone, requester_email, requester_avatar, doc_number, doc_label, schedule, facility, waiting_for, status, created_at) VALUES ('1', '#APV-2025-0142', 'PEMINJAMAN RUANGAN & ALAT • URGENT', '1', 'Workshop Akreditasi Internasional ABET', 'ruangan', 'Dr. Ir. Hendro Wicaksono, M.T.', '197804152003121002 • Ka. Prodi Teknik Informatika', '0812-3456-7890', 'hendro@institusi.ac.id', '../assets/avatar_hendro.jpg', '412/FT-TI/UND/2025', 'Surat Pengantar Dekan', 'Sabtu, 29 Maret 2025 • 08:00 - 17:00 WIB', 'Auditorium Utama & 4 Mic Sennheiser', 'Menunggu: Ka. Biro Sarpras', 'Disetujui', '2026-11-03 14:21:24');
INSERT INTO approvals (id, kode, tag, is_urgent, title, category, requester_name, requester_nip, requester_phone, requester_email, requester_avatar, doc_number, doc_label, schedule, facility, waiting_for, status, created_at) VALUES ('2', '#APV-2025-0143', 'PERPANJANGAN FASILITAS • NORMAL', '0', 'Riset Laboratorium Biomedika Bersama Mitra Industri', 'ruangan', 'Dewi Sartika, S.E.', '198709122010012003 • Ka. Laboratorium Biologi', '0815-7766-5544', 'dewi@institusi.ac.id', '../assets/avatar_bambang.jpg', '118/LAB-BIO/2025', 'Surat Izin Pemakaian Riset', '31 Maret - 5 April 2025 • 08:00 - 20:00 WIB', 'Lab Terpadu Bioteknologi B.302 & Mikroskop Olympus', 'Menunggu: Wakil Rektor II', 'Sedang Ditinjau', '2026-11-03 14:21:24');

CREATE TABLE tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kode TEXT UNIQUE NOT NULL,
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

INSERT INTO tickets (id, kode, title, location, gedung, priority, category, reporter, tech_name, status, desc, cost, created_at, updated_at) VALUES ('1', 'TKT-0841', 'AC Daikin Tidak Dingin & Menetes Freon', 'Auditorium Sidang Senat Lt. 2', 'Gedung Rektorat (Pusat)', 'TINGGI', 'Utilitas AC', 'Bambang Irawan', 'Joko Supriyanto', 'proses', 'Kondensor outdoor berisik dan pipa evaporator membeku.', '650000', '2026-11-03 14:21:24', '2026-11-03 14:21:24');
INSERT INTO tickets (id, kode, title, location, gedung, priority, category, reporter, tech_name, status, desc, cost, created_at, updated_at) VALUES ('2', 'TKT-0842', 'Proyektor Laser Epson Mati Total (No Power)', 'Ruang Rapat Dekanat Lt. 3', 'Gedung Rektorat (Pusat)', 'URGENT', 'Multimedia', 'Dewi Sartika', 'Joko Supriyanto', 'sparepart', 'Kabel power normal, power supply internal butuh penggantian sekring/modul.', '1200000', '2026-11-03 14:21:24', '2026-11-03 14:21:24');
INSERT INTO tickets (id, kode, title, location, gedung, priority, category, reporter, tech_name, status, desc, cost, created_at, updated_at) VALUES ('3', 'TKT-0843', 'Panel Distribusi Listrik MCB Trip Berkala', 'Lab Komputasi A.201', 'Gedung Fakultas Teknik', 'TINGGI', 'Kelistrikan', 'Hendro Wicaksono', 'Teknisi PLN Vendor', 'baru', 'Beban over saat 30 PC dinyalakan serempak, perlu rebalancing phase.', '450000', '2026-11-03 14:21:24', '2026-11-03 14:21:24');
INSERT INTO tickets (id, kode, title, location, gedung, priority, category, reporter, tech_name, status, desc, cost, created_at, updated_at) VALUES ('4', 'TKT-0839', 'Pintu Kaca Otomatis Lobi Macet Sensor', 'Lobi Utama Rektorat', 'Gedung Rektorat (Pusat)', 'NORMAL', 'Fasilitas Gedung', 'Satpam Rektorat', 'Joko Supriyanto', 'selesai', 'Sensor inframerah kotor dan motor stepper telah diservis serta diberi pelumas.', '150000', '2026-11-03 14:21:24', '2026-11-03 14:21:24');

CREATE TABLE mutations (
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

INSERT INTO mutations (id, bast_no, asset_id, asset_name, nup, unit_count, origin_loc, origin_pic, origin_nip, dest_loc, dest_pic, dest_nip, purpose, doc_status, status, date, created_at) VALUES ('1', 'BAST/MUT/2025/0082', '1', 'Laptop ThinkPad T14 Gen 4 Intel Core i7', 'SAR/2024/0101', '2 Unit', 'Ruang Tata Usaha Rektorat Lt. 1', 'Dewi Sartika, S.E.', '198709122010012003', 'Studio Podcast & Multimedia B.102', 'Bambang Irawan, S.Kom', '198403152008121002', 'Dukungan Produksi Konten Pembelajaran Daring & Podcast Kampus', 'Menunggu TTD', 'Dalam Proses Pemindahan', '28 Maret 2025', '2026-11-03 14:21:24');
INSERT INTO mutations (id, bast_no, asset_id, asset_name, nup, unit_count, origin_loc, origin_pic, origin_nip, dest_loc, dest_pic, dest_nip, purpose, doc_status, status, date, created_at) VALUES ('2', 'BAST/MUT/2026/0061', NULL, 'Proyektor Epson', 'SAR/2025/0000', '1 Unit', 'Lab Komputasi A.201', 'PIC Asal', '', 'Studio Podcast B.102', 'PIC Tujuan', '', 'Uji integrasi mutasi backend', 'Menunggu TTD', 'Dalam Proses Pemindahan', '3 November 2026', '2026-11-03 14:35:58');
INSERT INTO mutations (id, bast_no, asset_id, asset_name, nup, unit_count, origin_loc, origin_pic, origin_nip, dest_loc, dest_pic, dest_nip, purpose, doc_status, status, date, created_at) VALUES ('3', 'BAST/MUT/2026/0074', NULL, 'Proyektor Epson', 'SAR/2025/0000', '1 Unit', 'Lab Komputasi A.201', 'PIC Asal', '', 'Studio Podcast B.102', 'PIC Tujuan', '', 'Uji integrasi mutasi backend', 'Menunggu TTD', 'Dalam Proses Pemindahan', '3 November 2026', '2026-11-03 14:36:40');
INSERT INTO mutations (id, bast_no, asset_id, asset_name, nup, unit_count, origin_loc, origin_pic, origin_nip, dest_loc, dest_pic, dest_nip, purpose, doc_status, status, date, created_at) VALUES ('4', 'BAST/MUT/2026/0019', NULL, 'Proyektor Epson', 'SAR/2025/0000', '1 Unit', 'Lab Komputasi A.201', 'PIC Asal', '', 'Studio Podcast B.102', 'PIC Tujuan', '', 'Uji integrasi mutasi backend', 'Menunggu TTD', 'Dalam Proses Pemindahan', '3 November 2026', '2026-11-03 15:22:47');
INSERT INTO mutations (id, bast_no, asset_id, asset_name, nup, unit_count, origin_loc, origin_pic, origin_nip, dest_loc, dest_pic, dest_nip, purpose, doc_status, status, date, created_at) VALUES ('5', 'BAST/MUT/2026/0070', NULL, 'Proyektor Epson', 'SAR/2025/0000', '1 Unit', 'Lab Komputasi A.201', 'PIC Asal', '', 'Studio Podcast B.102', 'PIC Tujuan', '', 'Uji integrasi mutasi backend', 'Menunggu TTD', 'Dalam Proses Pemindahan', '3 November 2026', '2026-11-03 15:43:11');
INSERT INTO mutations (id, bast_no, asset_id, asset_name, nup, unit_count, origin_loc, origin_pic, origin_nip, dest_loc, dest_pic, dest_nip, purpose, doc_status, status, date, created_at) VALUES ('6', 'BAST/MUT/2026/0037', NULL, 'Proyektor Epson', 'SAR/2025/0000', '1 Unit', 'Lab Komputasi A.201', 'PIC Asal', '', 'Studio Podcast B.102', 'PIC Tujuan', '', 'Uji integrasi mutasi backend', 'Menunggu TTD', 'Dalam Proses Pemindahan', '3 November 2026', '2026-11-03 15:45:58');
INSERT INTO mutations (id, bast_no, asset_id, asset_name, nup, unit_count, origin_loc, origin_pic, origin_nip, dest_loc, dest_pic, dest_nip, purpose, doc_status, status, date, created_at) VALUES ('7', 'BAST/MUT/2026/0034', NULL, 'Proyektor Epson', 'SAR/2025/0000', '1 Unit', 'Lab Komputasi A.201', 'PIC Asal', '', 'Studio Podcast B.102', 'PIC Tujuan', '', 'Uji integrasi mutasi backend', 'Menunggu TTD', 'Dalam Proses Pemindahan', '3 November 2026', '2026-11-03 16:59:50');
INSERT INTO mutations (id, bast_no, asset_id, asset_name, nup, unit_count, origin_loc, origin_pic, origin_nip, dest_loc, dest_pic, dest_nip, purpose, doc_status, status, date, created_at) VALUES ('8', 'BAST/MUT/2026/0087', NULL, 'Proyektor Epson', 'SAR/2025/0000', '1 Unit', 'Lab Komputasi A.201', 'PIC Asal', '', 'Studio Podcast B.102', 'PIC Tujuan', '', 'Uji integrasi mutasi backend', 'Menunggu TTD', 'Dalam Proses Pemindahan', '10 November 2026', '2026-11-10 13:04:15');

CREATE TABLE stock_opname (
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

INSERT INTO stock_opname (id, code, name, category, sn, actual_loc, master_loc, is_loc_diff, audit_status, condition, auditor, scan_time, session_name, created_at) VALUES ('1', 'SAR/2023/0440', 'Mikroskop Binokuler Olympus CX23 LED', 'Alat Laboratorium & Riset', 'OLY-883921', 'Lab Terpadu Bioteknologi B.302', 'Lab Terpadu Bioteknologi B.302', '0', 'Cocok Sesuai Data', 'Baik', 'Dedi Ardiansyah', 'Scan QR - 28 Mar 10:14', 'Audit Semester 1 - 2025', '2026-11-03 14:21:24');
INSERT INTO stock_opname (id, code, name, category, sn, actual_loc, master_loc, is_loc_diff, audit_status, condition, auditor, scan_time, session_name, created_at) VALUES ('2', 'SAR/2024/0101', 'Laptop ThinkPad T14 Gen 4 Intel Core i7', 'Elektronik & Multimedia', 'PF-4J28901', 'Ruang Rapat Dekanat Lt. 3', 'Ruang Rapat Dekanat Lt. 3', '0', 'Cocok Sesuai Data', 'Baik', 'Irfan Kusuma', 'Scan QR - 28 Mar 09:30', 'Audit Semester 1 - 2025', '2026-11-03 14:21:24');
INSERT INTO stock_opname (id, code, name, category, sn, actual_loc, master_loc, is_loc_diff, audit_status, condition, auditor, scan_time, session_name, created_at) VALUES ('3', 'SAR/2024/0088', 'AC Split Daikin Inverter 2 PK Flash', 'Utilitas & Kelistrikan', 'DKN-FTKC50-9912', 'Auditorium Sidang Senat Lt. 2', 'Auditorium Sidang Senat Lt. 2', '0', 'Cocok Sesuai Data', 'Rusak Ringan', 'Joko Supriyanto', 'Scan QR - 28 Mar 11:05', 'Audit Semester 1 - 2025', '2026-11-03 14:21:24');

CREATE TABLE settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

INSERT INTO settings (key, value) VALUES ('nama_institusi', 'Universitas Teknologi & Sains Nusantara (Verified)');
INSERT INTO settings (key, value) VALUES ('durasi_peminjaman_hari', '7');
INSERT INTO settings (key, value) VALUES ('approval_bertingkat', '1');
INSERT INTO settings (key, value) VALUES ('email_notifikasi', 'sarpras@institusi.ac.id');
INSERT INTO settings (key, value) VALUES ('versi_sistem', '2.5.0-Enterprise');

CREATE TABLE activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT,
      action TEXT,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('1', 'System', 'Inisialisasi Database', 'Database SIMAS SQLite berhasil dibuat dan di-seed dengan data awal.', '2026-11-03 14:21:25');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('2', 'Dr. Hendro Purnomo', 'Login', 'Login administrator sarpras terverifikasi.', '2026-11-03 14:21:25');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('3', 'Admin/Petugas', 'Tambah Kategori', 'Menambahkan kategori: Kategori Uji Coba Otomatis', '2026-11-03 14:35:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('4', 'Admin', 'Tambah Pegawai', 'Menambahkan pegawai baru: Auditor Baru, S.Kom (199501012025011999)', '2026-11-03 14:35:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('5', 'Admin/Petugas', 'Tambah Aset', 'Menambahkan aset: Server Rack HP ProLiant DL380 Gen 10 (SAR/2025/0128)', '2026-11-03 14:35:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('6', 'Admin/Petugas', 'Ubah Aset', 'Memperbarui data aset: Server Rack HP ProLiant DL380 Gen 10 (ID 9)', '2026-11-03 14:35:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('7', 'Admin', 'Hapus Aset', 'Menghapus aset: Server Rack HP ProLiant DL380 Gen 10 (SAR/2025/0128)', '2026-11-03 14:35:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('8', 'Ahmad Fauzi', 'Ajukan Pinjaman', 'Mengajukan peminjaman: Laptop ThinkPad T14 Gen 4 Intel Core i7 (PINJAM-2026-0803)', '2026-11-03 14:35:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('9', 'Pimpinan Institusi', 'Setujui Peminjaman', 'Menyetujui peminjaman PINJAM-2026-0803', '2026-11-03 14:35:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('10', 'Ahmad Fauzi', 'Pengembalian Aset', 'Aset Laptop ThinkPad T14 Gen 4 Intel Core i7 (PINJAM-2026-0803) telah dikembalikan.', '2026-11-03 14:35:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('11', 'Petugas', 'Buat Tiket', 'Membuat tiket pemeliharaan: Perbaikan Lampu LED Auditorium (TKT-0426)', '2026-11-03 14:35:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('12', 'Petugas', 'Update Tiket', 'Tiket TKT-0426 status diubah ke: selesai', '2026-11-03 14:35:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('13', 'Admin/Petugas', 'Mutasi Aset', 'Menerbitkan BAST mutasi BAST/MUT/2026/0061 untuk Proyektor Epson', '2026-11-03 14:35:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('14', 'Auditor', 'Sinkronisasi Lokasi', 'Menyesuaikan lokasi aset SAR/2023/0440 ke Lab Terpadu Bioteknologi B.302', '2026-11-03 14:35:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('15', 'Admin', 'Ubah Pengaturan', 'Memperbarui konfigurasi sistem institusi', '2026-11-03 14:35:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('16', 'Admin/Petugas', 'Tambah Kategori', 'Menambahkan kategori: Kategori Uji Coba Otomatis', '2026-11-03 14:36:40');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('17', 'Admin', 'Tambah Pegawai', 'Menambahkan pegawai baru: Auditor Baru, S.Kom (199501012025011999)', '2026-11-03 14:36:40');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('18', 'Admin/Petugas', 'Tambah Aset', 'Menambahkan aset: Server Rack HP ProLiant DL380 Gen 10 (SAR/2025/0178)', '2026-11-03 14:36:40');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('19', 'Admin/Petugas', 'Ubah Aset', 'Memperbarui data aset: Server Rack HP ProLiant DL380 Gen 10 (ID 10)', '2026-11-03 14:36:40');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('20', 'Admin', 'Hapus Aset', 'Menghapus aset: Server Rack HP ProLiant DL380 Gen 10 (SAR/2025/0178)', '2026-11-03 14:36:40');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('21', 'Ahmad Fauzi', 'Ajukan Pinjaman', 'Mengajukan peminjaman: Laptop ThinkPad T14 Gen 4 Intel Core i7 (PINJAM-2026-0822)', '2026-11-03 14:36:40');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('22', 'Pimpinan Institusi', 'Setujui Peminjaman', 'Menyetujui peminjaman PINJAM-2026-0822', '2026-11-03 14:36:40');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('23', 'Ahmad Fauzi', 'Pengembalian Aset', 'Aset Laptop ThinkPad T14 Gen 4 Intel Core i7 (PINJAM-2026-0822) telah dikembalikan.', '2026-11-03 14:36:40');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('24', 'Petugas', 'Buat Tiket', 'Membuat tiket pemeliharaan: Perbaikan Lampu LED Auditorium (TKT-0141)', '2026-11-03 14:36:40');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('25', 'Petugas', 'Update Tiket', 'Tiket TKT-0141 status diubah ke: selesai', '2026-11-03 14:36:40');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('26', 'Admin/Petugas', 'Mutasi Aset', 'Menerbitkan BAST mutasi BAST/MUT/2026/0074 untuk Proyektor Epson', '2026-11-03 14:36:40');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('27', 'Auditor', 'Sinkronisasi Lokasi', 'Menyesuaikan lokasi aset SAR/2023/0440 ke Lab Terpadu Bioteknologi B.302', '2026-11-03 14:36:40');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('28', 'Admin', 'Ubah Pengaturan', 'Memperbarui konfigurasi sistem institusi', '2026-11-03 14:36:40');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('29', 'Admin/Petugas', 'Tambah Kategori', 'Menambahkan kategori: Kategori Uji Coba Otomatis', '2026-11-03 15:22:47');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('30', 'Admin', 'Tambah Pegawai', 'Menambahkan pegawai baru: Auditor Baru, S.Kom (199501012025011999)', '2026-11-03 15:22:47');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('31', 'Admin/Petugas', 'Tambah Aset', 'Menambahkan aset: Server Rack HP ProLiant DL380 Gen 10 (SAR/2025/0582)', '2026-11-03 15:22:47');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('32', 'Admin/Petugas', 'Ubah Aset', 'Memperbarui data aset: Server Rack HP ProLiant DL380 Gen 10 (ID 11)', '2026-11-03 15:22:47');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('33', 'Admin', 'Hapus Aset', 'Menghapus aset: Server Rack HP ProLiant DL380 Gen 10 (SAR/2025/0582)', '2026-11-03 15:22:47');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('34', 'Ahmad Fauzi', 'Ajukan Pinjaman', 'Mengajukan peminjaman: Laptop ThinkPad T14 Gen 4 Intel Core i7 (PINJAM-2026-0791)', '2026-11-03 15:22:47');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('35', 'Pimpinan Institusi', 'Setujui Peminjaman', 'Menyetujui peminjaman PINJAM-2026-0791', '2026-11-03 15:22:47');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('36', 'Ahmad Fauzi', 'Pengembalian Aset', 'Aset Laptop ThinkPad T14 Gen 4 Intel Core i7 (PINJAM-2026-0791) telah dikembalikan.', '2026-11-03 15:22:47');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('37', 'Petugas', 'Buat Tiket', 'Membuat tiket pemeliharaan: Perbaikan Lampu LED Auditorium (TKT-0271)', '2026-11-03 15:22:47');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('38', 'Petugas', 'Update Tiket', 'Tiket TKT-0271 status diubah ke: selesai', '2026-11-03 15:22:47');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('39', 'Admin/Petugas', 'Mutasi Aset', 'Menerbitkan BAST mutasi BAST/MUT/2026/0019 untuk Proyektor Epson', '2026-11-03 15:22:47');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('40', 'Auditor', 'Sinkronisasi Lokasi', 'Menyesuaikan lokasi aset SAR/2023/0440 ke Lab Terpadu Bioteknologi B.302', '2026-11-03 15:22:47');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('41', 'Admin', 'Ubah Pengaturan', 'Memperbarui konfigurasi sistem institusi', '2026-11-03 15:22:47');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('42', 'Admin/Petugas', 'Tambah Aset', 'Menambahkan aset: ROG STRIX ANJAY (SAR/2025/0341)', '2026-11-03 15:30:50');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('43', 'Admin/Petugas', 'Tambah Kategori', 'Menambahkan kategori: Kategori Uji Coba Otomatis', '2026-11-03 15:43:11');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('44', 'Admin', 'Tambah Pegawai', 'Menambahkan pegawai baru: Auditor Baru, S.Kom (199501012025011999)', '2026-11-03 15:43:11');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('45', 'Admin/Petugas', 'Tambah Aset', 'Menambahkan aset: Server Rack HP ProLiant DL380 Gen 10 (SAR/2025/0201)', '2026-11-03 15:43:11');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('46', 'Admin/Petugas', 'Ubah Aset', 'Memperbarui data aset: Server Rack HP ProLiant DL380 Gen 10 (ID 13)', '2026-11-03 15:43:11');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('47', 'Admin', 'Hapus Aset', 'Menghapus aset: Server Rack HP ProLiant DL380 Gen 10 (SAR/2025/0201)', '2026-11-03 15:43:11');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('48', 'Ahmad Fauzi', 'Ajukan Pinjaman', 'Mengajukan peminjaman: Laptop ThinkPad T14 Gen 4 Intel Core i7 (PINJAM-2026-0188)', '2026-11-03 15:43:11');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('49', 'Pimpinan Institusi', 'Setujui Peminjaman', 'Menyetujui peminjaman PINJAM-2026-0188', '2026-11-03 15:43:11');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('50', 'Ahmad Fauzi', 'Pengembalian Aset', 'Aset Laptop ThinkPad T14 Gen 4 Intel Core i7 (PINJAM-2026-0188) telah dikembalikan.', '2026-11-03 15:43:11');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('51', 'Petugas', 'Buat Tiket', 'Membuat tiket pemeliharaan: Perbaikan Lampu LED Auditorium (TKT-0226)', '2026-11-03 15:43:11');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('52', 'Petugas', 'Update Tiket', 'Tiket TKT-0226 status diubah ke: selesai', '2026-11-03 15:43:11');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('53', 'Admin/Petugas', 'Mutasi Aset', 'Menerbitkan BAST mutasi BAST/MUT/2026/0070 untuk Proyektor Epson', '2026-11-03 15:43:11');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('54', 'Auditor', 'Sinkronisasi Lokasi', 'Menyesuaikan lokasi aset SAR/2023/0440 ke Lab Terpadu Bioteknologi B.302', '2026-11-03 15:43:11');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('55', 'Admin', 'Ubah Pengaturan', 'Memperbarui konfigurasi sistem institusi', '2026-11-03 15:43:11');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('56', 'Petugas Sarpras', 'Ubah Jadwal Peminjaman', 'Memperbarui jadwal pinjaman PINJAM-2025-001: 2025-04-01 s/d 2025-04-05', '2026-11-03 15:44:44');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('57', 'Admin/Petugas', 'Tambah Kategori', 'Menambahkan kategori: Kategori Uji Coba Otomatis', '2026-11-03 15:45:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('58', 'Admin', 'Tambah Pegawai', 'Menambahkan pegawai baru: Auditor Baru, S.Kom (199501012025011999)', '2026-11-03 15:45:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('59', 'Admin/Petugas', 'Tambah Aset', 'Menambahkan aset: Server Rack HP ProLiant DL380 Gen 10 (SAR/2025/0720)', '2026-11-03 15:45:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('60', 'Admin/Petugas', 'Ubah Aset', 'Memperbarui data aset: Server Rack HP ProLiant DL380 Gen 10 (ID 14)', '2026-11-03 15:45:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('61', 'Admin', 'Hapus Aset', 'Menghapus aset: Server Rack HP ProLiant DL380 Gen 10 (SAR/2025/0720)', '2026-11-03 15:45:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('62', 'Ahmad Fauzi', 'Ajukan Pinjaman', 'Mengajukan peminjaman: Laptop ThinkPad T14 Gen 4 Intel Core i7 (PINJAM-2026-0614)', '2026-11-03 15:45:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('63', 'Pimpinan Institusi', 'Setujui Peminjaman', 'Menyetujui peminjaman PINJAM-2026-0614', '2026-11-03 15:45:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('64', 'Ahmad Fauzi', 'Pengembalian Aset', 'Aset Laptop ThinkPad T14 Gen 4 Intel Core i7 (PINJAM-2026-0614) telah dikembalikan.', '2026-11-03 15:45:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('65', 'Petugas', 'Buat Tiket', 'Membuat tiket pemeliharaan: Perbaikan Lampu LED Auditorium (TKT-0124)', '2026-11-03 15:45:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('66', 'Petugas', 'Update Tiket', 'Tiket TKT-0124 status diubah ke: selesai', '2026-11-03 15:45:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('67', 'Admin/Petugas', 'Mutasi Aset', 'Menerbitkan BAST mutasi BAST/MUT/2026/0037 untuk Proyektor Epson', '2026-11-03 15:45:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('68', 'Auditor', 'Sinkronisasi Lokasi', 'Menyesuaikan lokasi aset SAR/2023/0440 ke Lab Terpadu Bioteknologi B.302', '2026-11-03 15:45:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('69', 'Admin', 'Ubah Pengaturan', 'Memperbarui konfigurasi sistem institusi', '2026-11-03 15:45:58');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('70', 'Bambang Irawan, S.Kom', 'Ajukan Pinjaman', 'Mengajukan peminjaman: ROG STRIX ANJAY (PINJAM-2026-0871)', '2026-11-03 16:04:18');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('71', 'Pimpinan', 'Setujui Antrean', 'Menyetujui permohonan antrean ID 1', '2026-11-03 16:49:11');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('72', 'Pimpinan', 'Setujui Antrean', 'Menyetujui permohonan antrean ID 1', '2026-11-03 16:49:16');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('73', 'Ahmad Fauzi (Dosen/Mhs)', 'Pengembalian Aset', 'Aset PC Desktop Lenovo ThinkCentre M70s Gen 4 (PINJAM-2025-001) telah dikembalikan.', '2026-11-03 16:51:24');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('74', 'Test User', 'Ajukan Pinjaman', 'Mengajukan peminjaman: Laptop ThinkPad T14 Gen 4 Intel Core i7 (PINJAM-2026-0177)', '2026-11-03 16:58:34');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('75', 'Bambang Irawan (Admin Sarpras)', 'Setujui Peminjaman', 'Menyetujui peminjaman PINJAM-2026-0177', '2026-11-03 16:58:34');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('76', 'Test User', 'Pengembalian Aset', 'Aset Laptop ThinkPad T14 Gen 4 Intel Core i7 (PINJAM-2026-0177) telah dikembalikan.', '2026-11-03 16:58:34');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('77', 'Admin/Petugas', 'Tambah Kategori', 'Menambahkan kategori: Kategori Uji Coba Otomatis', '2026-11-03 16:59:49');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('78', 'Admin', 'Tambah Pegawai', 'Menambahkan pegawai baru: Auditor Baru, S.Kom (199501012025011999)', '2026-11-03 16:59:49');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('79', 'Admin/Petugas', 'Tambah Aset', 'Menambahkan aset: Server Rack HP ProLiant DL380 Gen 10 (SAR/2025/0263)', '2026-11-03 16:59:49');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('80', 'Admin/Petugas', 'Ubah Aset', 'Memperbarui data aset: Server Rack HP ProLiant DL380 Gen 10 (ID 15)', '2026-11-03 16:59:49');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('81', 'Admin', 'Hapus Aset', 'Menghapus aset: Server Rack HP ProLiant DL380 Gen 10 (SAR/2025/0263)', '2026-11-03 16:59:49');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('82', 'Ahmad Fauzi', 'Ajukan Pinjaman', 'Mengajukan peminjaman: Laptop ThinkPad T14 Gen 4 Intel Core i7 (PINJAM-2026-0258)', '2026-11-03 16:59:49');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('83', 'Pimpinan Institusi', 'Setujui Peminjaman', 'Menyetujui peminjaman PINJAM-2026-0258', '2026-11-03 16:59:49');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('84', 'Ahmad Fauzi', 'Pengembalian Aset', 'Aset Laptop ThinkPad T14 Gen 4 Intel Core i7 (PINJAM-2026-0258) telah dikembalikan.', '2026-11-03 16:59:49');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('85', 'Petugas', 'Buat Tiket', 'Membuat tiket pemeliharaan: Perbaikan Lampu LED Auditorium (TKT-0360)', '2026-11-03 16:59:50');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('86', 'Petugas', 'Update Tiket', 'Tiket TKT-0360 status diubah ke: selesai', '2026-11-03 16:59:50');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('87', 'Admin/Petugas', 'Mutasi Aset', 'Menerbitkan BAST mutasi BAST/MUT/2026/0034 untuk Proyektor Epson', '2026-11-03 16:59:50');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('88', 'Auditor', 'Sinkronisasi Lokasi', 'Menyesuaikan lokasi aset SAR/2023/0440 ke Lab Terpadu Bioteknologi B.302', '2026-11-03 16:59:50');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('89', 'Admin', 'Ubah Pengaturan', 'Memperbarui konfigurasi sistem institusi', '2026-11-03 16:59:50');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('90', 'Jibran', 'Ajukan Pinjaman', 'Mengajukan peminjaman: ROG STRIX ANJAY (PINJAM-2026-0109)', '2026-11-03 17:02:44');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('91', 'undefined (admin)', 'Setujui Peminjaman', 'Menyetujui peminjaman PINJAM-2026-0109', '2026-11-03 17:03:33');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('92', 'Jibran', 'Pengembalian Aset', 'Aset ROG STRIX ANJAY (PINJAM-2026-0109) telah dikembalikan.', '2026-11-03 17:04:09');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('93', 'Admin/Petugas', 'Tambah Kategori', 'Menambahkan kategori: Kategori Uji Coba Otomatis', '2026-11-10 13:04:14');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('94', 'Admin', 'Tambah Pegawai', 'Menambahkan pegawai baru: Auditor Baru, S.Kom (199501012025011999)', '2026-11-10 13:04:14');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('95', 'Admin/Petugas', 'Tambah Aset', 'Menambahkan aset: Server Rack HP ProLiant DL380 Gen 10 (SAR/2025/0558)', '2026-11-10 13:04:14');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('96', 'Admin/Petugas', 'Ubah Aset', 'Memperbarui data aset: Server Rack HP ProLiant DL380 Gen 10 (ID 16)', '2026-11-10 13:04:14');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('97', 'Admin', 'Hapus Aset', 'Menghapus aset: Server Rack HP ProLiant DL380 Gen 10 (SAR/2025/0558)', '2026-11-10 13:04:14');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('98', 'Ahmad Fauzi', 'Ajukan Pinjaman', 'Mengajukan peminjaman: Laptop ThinkPad T14 Gen 4 Intel Core i7 (PINJAM-2026-0194)', '2026-11-10 13:04:14');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('99', 'Pimpinan Institusi', 'Setujui Peminjaman', 'Menyetujui peminjaman PINJAM-2026-0194', '2026-11-10 13:04:14');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('100', 'Ahmad Fauzi', 'Pengembalian Aset', 'Aset Laptop ThinkPad T14 Gen 4 Intel Core i7 (PINJAM-2026-0194) telah dikembalikan.', '2026-11-10 13:04:14');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('101', 'Petugas', 'Buat Tiket', 'Membuat tiket pemeliharaan: Perbaikan Lampu LED Auditorium (TKT-0818)', '2026-11-10 13:04:15');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('102', 'Petugas', 'Update Tiket', 'Tiket TKT-0818 status diubah ke: selesai', '2026-11-10 13:04:15');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('103', 'Admin/Petugas', 'Mutasi Aset', 'Menerbitkan BAST mutasi BAST/MUT/2026/0087 untuk Proyektor Epson', '2026-11-10 13:04:15');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('104', 'Auditor', 'Sinkronisasi Lokasi', 'Menyesuaikan lokasi aset SAR/2023/0440 ke Lab Terpadu Bioteknologi B.302', '2026-11-10 13:04:15');
INSERT INTO activity_logs (id, user_name, action, details, timestamp) VALUES ('105', 'Admin', 'Ubah Pengaturan', 'Memperbarui konfigurasi sistem institusi', '2026-11-10 13:04:15');

