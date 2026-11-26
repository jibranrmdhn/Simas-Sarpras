/**
 * SIMAS - Backend REST API & Static File Server
 * Built with Express.js & SQLite (node:sqlite)
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { db, seedData } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname, '..');

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper log activity
function logActivity(userName, action, details) {
  try {
    db.prepare('INSERT INTO activity_logs (user_name, action, details) VALUES (?, ?, ?)').run(
      userName || 'System',
      action || 'Aksi',
      details || ''
    );
  } catch (e) {
    console.error('Failed to log activity:', e);
  }
}

// ===================== REST API ROUTES ===================== //

// --- 1. AUTH, REGISTRATION & ADMIN-ONLY ACCOUNT APPROVAL (ACC) ---
function isAdminRequest(req) {
  const roleHeader = String(req.headers['x-user-role'] || req.body?.actor_role || '').trim().toLowerCase();
  return roleHeader === 'admin';
}

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan kata sandi wajib diisi.' });
  }

  const cleanUser = String(username).trim();
  const cleanPass = String(password).trim();

  const user = db.prepare(`
    SELECT id, username, nama, nip, email, unit, account_type, role, status, rejection_reason, avatar, created_at
    FROM users
    WHERE (LOWER(username) = LOWER(?) OR nip = ? OR LOWER(email) = LOWER(?))
      AND password = ?
  `).get(cleanUser, cleanUser, cleanUser, cleanPass);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Username/NIP atau kata sandi tidak cocok.' });
  }

  const accountStatus = String(user.status || 'active').toLowerCase();
  if (accountStatus === 'pending') {
    return res.status(403).json({
      success: false,
      code: 'ACCOUNT_PENDING',
      message: 'Akun Anda sedang menunggu persetujuan (ACC) dari Admin Sarpras. Silakan tunggu konfirmasi Administrator.'
    });
  }

  if (accountStatus === 'rejected') {
    const reasonText = user.rejection_reason ? ` Alasan: ${user.rejection_reason}` : '';
    return res.status(403).json({
      success: false,
      code: 'ACCOUNT_REJECTED',
      message: `Pendaftaran akun Anda ditolak oleh Admin Sarpras.${reasonText}`
    });
  }

  logActivity(user.nama, 'Login', `Pengguna login sebagai ${user.role}`);
  res.json({ success: true, message: `Selamat datang, ${user.nama}!`, user });
});

app.post('/api/auth/register', (req, res) => {
  const { username, password, nama, nip, email, unit, role, account_type } = req.body;
  if (!username || !password || !nama || !email) {
    return res.status(400).json({
      success: false,
      message: 'Nama lengkap, username, email institusi, dan kata sandi wajib diisi.'
    });
  }

  const cleanUsername = String(username).trim();
  const cleanPassword = String(password).trim();
  const cleanNama = String(nama).trim();
  const cleanEmail = String(email).trim();
  const cleanNip = String(nip || '').trim();
  const cleanUnit = String(unit || '').trim();

  if (cleanPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Kata sandi minimal 6 karakter.' });
  }

  // Pendaftaran mandiri HANYA diperuntukkan bagi role Peminjam (Dosen / Mahasiswa)
  const rawRole = String(role || 'peminjam').toLowerCase();
  if (rawRole !== 'peminjam') {
    return res.status(400).json({
      success: false,
      message: 'Pendaftaran mandiri hanya tersedia untuk akun Peminjam (Mahasiswa / Dosen). Akun Admin, Petugas, dan Pimpinan hanya dapat dibuat oleh Admin Sarpras.'
    });
  }

  const rawType = String(account_type || 'mahasiswa').toLowerCase();
  const cleanAccountType = ['mahasiswa', 'dosen'].includes(rawType) ? rawType : 'mahasiswa';

  if (!cleanNip) {
    return res.status(400).json({
      success: false,
      message: cleanAccountType === 'dosen' ? 'NIP / NIDN wajib diisi untuk pendaftaran Dosen.' : 'NIM wajib diisi untuk pendaftaran Mahasiswa.'
    });
  }

  const existingUser = db.prepare(`
    SELECT id FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)
  `).get(cleanUsername, cleanEmail);

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Username atau email institusi sudah terdaftar di sistem.'
    });
  }

  const defaultAvatar = cleanAccountType === 'dosen' ? '../assets/avatar_hendro.jpg' : '../assets/avatar_bambang.jpg';
  const result = db.prepare(`
    INSERT INTO users (username, password, nama, nip, email, unit, account_type, role, status, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'peminjam', 'pending', ?)
  `).run(cleanUsername, cleanPassword, cleanNama, cleanNip, cleanEmail, cleanUnit, cleanAccountType, defaultAvatar);

  const created = db.prepare(`
    SELECT id, username, nama, nip, email, unit, account_type, role, status, avatar, created_at
    FROM users WHERE id = ?
  `).get(result.lastInsertRowid);

  const typeLabel = cleanAccountType === 'dosen' ? 'Dosen' : 'Mahasiswa';
  logActivity(cleanNama, 'Pendaftaran Akun', `Pengajuan akun Peminjam (${typeLabel} - ${cleanUsername}) menunggu ACC Admin`);
  res.status(201).json({
    success: true,
    message: `Pendaftaran akun Peminjam (${typeLabel}) berhasil dikirim! Akun Anda menunggu persetujuan (ACC) Admin Sarpras sebelum dapat digunakan untuk login.`,
    data: created
  });
});

app.get('/api/users', (req, res) => {
  const { status } = req.query;
  let sql = 'SELECT id, username, nama, nip, email, unit, account_type, role, status, rejection_reason, approved_by, approved_at, avatar, created_at FROM users';
  const params = [];
  if (status) {
    sql += ' WHERE status = ?';
    params.push(status);
  }
  sql += ' ORDER BY CASE WHEN status = \'pending\' THEN 0 WHEN status = \'active\' THEN 1 ELSE 2 END, id DESC';
  const users = db.prepare(sql).all(...params);
  res.json({ success: true, data: users });
});

app.get('/api/users/pending', (req, res) => {
  const pendingUsers = db.prepare(`
    SELECT id, username, nama, nip, email, unit, account_type, role, status, avatar, created_at
    FROM users
    WHERE status = 'pending'
    ORDER BY id DESC
  `).all();
  res.json({ success: true, count: pendingUsers.length, data: pendingUsers });
});

app.put('/api/users/:id/approve', (req, res) => {
  if (!isAdminRequest(req)) {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak: Hanya Admin Sarpras yang berwenang melakukan ACC pendaftaran akun.'
    });
  }

  const id = parseInt(req.params.id);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Pendaftaran akun tidak ditemukan.' });
  }

  const allowedRoles = ['admin', 'petugas', 'pimpinan', 'peminjam'];
  const finalRole = req.body?.role && allowedRoles.includes(req.body.role) ? req.body.role : user.role;
  const approver = req.body?.approved_by || 'Admin Sarpras';

  db.prepare(`
    UPDATE users
    SET status = 'active', role = ?, rejection_reason = '', approved_by = ?, approved_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(finalRole, approver, id);

  const updated = db.prepare(`
    SELECT id, username, nama, nip, email, unit, role, status, approved_by, approved_at, avatar, created_at
    FROM users WHERE id = ?
  `).get(id);

  logActivity(approver, 'ACC Pendaftaran Akun', `Menyetujui & mengaktifkan akun ${updated.nama} (@${updated.username}) sebagai ${updated.role}`);
  res.json({
    success: true,
    message: `Akun ${updated.nama} (@${updated.username}) berhasil di-ACC dan sekarang aktif!`,
    data: updated
  });
});

app.put('/api/users/:id/reject', (req, res) => {
  if (!isAdminRequest(req)) {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak: Hanya Admin Sarpras yang berwenang menolak pendaftaran akun.'
    });
  }

  const id = parseInt(req.params.id);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Pendaftaran akun tidak ditemukan.' });
  }

  const reason = String(req.body?.reason || 'Data identitas belum terverifikasi oleh Admin Sarpras.').trim();
  const approver = req.body?.approved_by || 'Admin Sarpras';

  db.prepare(`
    UPDATE users
    SET status = 'rejected', rejection_reason = ?, approved_by = ?, approved_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(reason, approver, id);

  const updated = db.prepare(`
    SELECT id, username, nama, nip, email, unit, role, status, rejection_reason, approved_by, approved_at, avatar, created_at
    FROM users WHERE id = ?
  `).get(id);

  logActivity(approver, 'Tolak Pendaftaran Akun', `Menolak pendaftaran akun ${updated.nama} (@${updated.username}). Alasan: ${reason}`);
  res.json({
    success: true,
    message: `Pendaftaran akun ${updated.nama} telah ditolak.`,
    data: updated
  });
});

app.post('/api/users', (req, res) => {
  const { username, password, nama, nip, email, unit, role, avatar } = req.body;
  if (!username || !password || !nama || !role) {
    return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi (username, password, nama, role).' });
  }

  const exists = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?)').get(username.trim());
  if (exists) {
    return res.status(400).json({ success: false, message: 'Username sudah digunakan oleh akun lain.' });
  }

  const defaultAvatar = avatar || (role === 'admin' ? '../assets/avatar_hendro.jpg' : '../assets/avatar_bambang.jpg');
  const result = db.prepare(`
    INSERT INTO users (username, password, nama, nip, email, unit, role, status, approved_by, approved_at, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'active', 'Admin Sarpras', CURRENT_TIMESTAMP, ?)
  `).run(username.trim(), password.trim(), nama.trim(), nip || '', email || '', unit || '', role, defaultAvatar);

  const newUser = db.prepare('SELECT id, username, nama, nip, email, unit, role, status, avatar, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
  logActivity('Admin', 'Tambah Pengguna', `Menambahkan pengguna baru aktif: ${nama} (${role})`);
  res.status(201).json({ success: true, message: 'Pengguna baru berhasil ditambahkan.', data: newUser });
});

app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nama, nip, email, unit, role, status, password, avatar } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
  }

  const updatedNama = nama !== undefined ? nama : user.nama;
  const updatedNip = nip !== undefined ? nip : user.nip;
  const updatedEmail = email !== undefined ? email : user.email;
  const updatedUnit = unit !== undefined ? unit : (user.unit || '');
  const updatedRole = role !== undefined ? role : user.role;
  const updatedStatus = status !== undefined ? status : (user.status || 'active');
  const updatedPass = password ? password.trim() : user.password;
  const updatedAvatar = avatar !== undefined ? avatar : user.avatar;

  db.prepare(`
    UPDATE users
    SET nama = ?, nip = ?, email = ?, unit = ?, role = ?, status = ?, password = ?, avatar = ?
    WHERE id = ?
  `).run(updatedNama, updatedNip, updatedEmail, updatedUnit, updatedRole, updatedStatus, updatedPass, updatedAvatar, id);

  const updatedUser = db.prepare('SELECT id, username, nama, nip, email, unit, role, status, avatar, created_at FROM users WHERE id = ?').get(id);
  logActivity('Admin', 'Ubah Pengguna', `Memperbarui akun pengguna ID ${id}: ${updatedNama}`);
  res.json({ success: true, message: 'Data pengguna berhasil diperbarui.', data: updatedUser });
});

app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  logActivity('Admin', 'Hapus Pengguna', `Menghapus akun pengguna ID ${id}: ${user.username}`);
  res.json({ success: true, message: `Akun ${user.username} berhasil dihapus.` });
});

// --- 2. ASSETS CRUD ---
app.get('/api/assets', (req, res) => {
  const { search, category, condition, status, limit, page } = req.query;

  let query = 'SELECT * FROM assets WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (LOWER(nama) LIKE ? OR LOWER(nup) LIKE ? OR LOWER(kode) LIKE ? OR LOWER(lokasi) LIKE ?)';
    const s = `%${search.toLowerCase().trim()}%`;
    params.push(s, s, s, s);
  }

  if (category && category !== 'all') {
    query += ' AND (LOWER(kategori_nama) LIKE ? OR kategori_id = ?)';
    params.push(`%${category.toLowerCase()}%`, parseInt(category) || -1);
  }

  if (condition && condition !== 'all') {
    query += ' AND LOWER(kondisi) = LOWER(?)';
    params.push(condition);
  }

  if (status && status !== 'all') {
    query += ' AND LOWER(status) = LOWER(?)';
    params.push(status);
  }

  query += ' ORDER BY id DESC';

  const allAssets = db.prepare(query).all(...params);
  const total = allAssets.length;

  let pagedData = allAssets;
  if (limit) {
    const lim = parseInt(limit) || 10;
    const pg = parseInt(page) || 1;
    const offset = (pg - 1) * lim;
    pagedData = allAssets.slice(offset, offset + lim);
  }

  res.json({ success: true, total, data: pagedData });
});

app.get('/api/assets/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const asset = db.prepare('SELECT * FROM assets WHERE id = ?').get(id);
  if (!asset) {
    return res.status(404).json({ success: false, message: 'Aset tidak ditemukan.' });
  }
  res.json({ success: true, data: asset });
});

app.post('/api/assets', (req, res) => {
  const { nama, nup, kode, kategori_id, kategori_nama, lokasi, gedung, pic, pic_nip, kondisi, status, tahun, nilai, foto, serial, desc } = req.body;

  if (!nama) {
    return res.status(400).json({ success: false, message: 'Nama aset wajib diisi.' });
  }

  let generatedNup = nup ? String(nup).trim() : `SAR/${tahun || '2025'}/${String(Math.floor(Math.random() * 8999) + 1000)}`;
  const existingNup = db.prepare('SELECT id FROM assets WHERE nup = ?').get(generatedNup);
  if (existingNup) {
    generatedNup = `SAR/${tahun || '2025'}/${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`;
  }
  const generatedKode = kode || `AST-${String(Math.floor(Math.random() * 8999) + 1000)}`;
  const defaultFoto = foto || '../assets/laptop.jpg';

  const result = db.prepare(`
    INSERT INTO assets (nup, nama, kode, kategori_id, kategori_nama, lokasi, gedung, pic, pic_nip, kondisi, status, tahun, nilai, foto, serial, desc)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    generatedNup,
    nama,
    generatedKode,
    kategori_id || 1,
    kategori_nama || 'Elektronik & Multimedia',
    lokasi || 'Gedung Rektorat Lt. 1',
    gedung || 'Gedung Rektorat (Pusat)',
    pic || 'Petugas Sarpras',
    pic_nip || '198403152008121002',
    kondisi || 'Baik',
    status || 'Tersedia',
    tahun || '2025',
    parseInt(nilai) || 0,
    defaultFoto,
    serial || 'SN-' + Date.now().toString().slice(-6),
    desc || ''
  );

  const newAsset = db.prepare('SELECT * FROM assets WHERE id = ?').get(result.lastInsertRowid);
  logActivity('Admin/Petugas', 'Tambah Aset', `Menambahkan aset: ${nama} (${generatedNup})`);
  res.status(201).json({ success: true, message: 'Aset berhasil didaftarkan ke inventaris.', data: newAsset });
});

app.put('/api/assets/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const asset = db.prepare('SELECT * FROM assets WHERE id = ?').get(id);
  if (!asset) {
    return res.status(404).json({ success: false, message: 'Aset tidak ditemukan.' });
  }

  const fields = ['nama', 'kode', 'kategori_id', 'kategori_nama', 'lokasi', 'gedung', 'pic', 'pic_nip', 'kondisi', 'status', 'tahun', 'nilai', 'foto', 'serial', 'desc'];
  const updates = {};
  for (const f of fields) {
    updates[f] = req.body[f] !== undefined ? req.body[f] : asset[f];
  }

  db.prepare(`
    UPDATE assets 
    SET nama = ?, kode = ?, kategori_id = ?, kategori_nama = ?, lokasi = ?, gedung = ?, pic = ?, pic_nip = ?, kondisi = ?, status = ?, tahun = ?, nilai = ?, foto = ?, serial = ?, desc = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    updates.nama, updates.kode, updates.kategori_id, updates.kategori_nama, updates.lokasi, updates.gedung,
    updates.pic, updates.pic_nip, updates.kondisi, updates.status, updates.tahun, parseInt(updates.nilai) || 0,
    updates.foto, updates.serial, updates.desc, id
  );

  const updatedAsset = db.prepare('SELECT * FROM assets WHERE id = ?').get(id);
  logActivity('Admin/Petugas', 'Ubah Aset', `Memperbarui data aset: ${updates.nama} (ID ${id})`);
  res.json({ success: true, message: 'Data aset berhasil diperbarui.', data: updatedAsset });
});

app.delete('/api/assets/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const asset = db.prepare('SELECT * FROM assets WHERE id = ?').get(id);
  if (!asset) {
    return res.status(404).json({ success: false, message: 'Aset tidak ditemukan.' });
  }

  db.prepare('DELETE FROM assets WHERE id = ?').run(id);
  logActivity('Admin', 'Hapus Aset', `Menghapus aset: ${asset.nama} (${asset.nup})`);
  res.json({ success: true, message: `Aset ${asset.nama} berhasil dihapus dari inventaris.` });
});

// --- 3. CATEGORIES CRUD ---
app.get('/api/categories', (req, res) => {
  const categories = db.prepare(`
    SELECT c.*, COUNT(a.id) as asset_count 
    FROM categories c 
    LEFT JOIN assets a ON a.kategori_id = c.id OR a.kategori_nama = c.nama
    GROUP BY c.id
    ORDER BY c.id ASC
  `).all();
  res.json({ success: true, data: categories });
});

app.post('/api/categories', (req, res) => {
  const { kode, nama, icon, desc, susut, color } = req.body;
  if (!kode || !nama) {
    return res.status(400).json({ success: false, message: 'Kode dan nama kategori wajib diisi.' });
  }

  let finalKode = kode.trim();
  const existingCat = db.prepare('SELECT id FROM categories WHERE LOWER(kode) = LOWER(?)').get(finalKode);
  if (existingCat) {
    finalKode = `${finalKode}-${Math.floor(Math.random() * 90 + 10)}`;
  }

  const result = db.prepare(`
    INSERT INTO categories (kode, nama, icon, desc, susut, color)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(finalKode, nama.trim(), icon || 'archive', desc || '', susut || '5 Tahun', color || 'blue');

  const newCat = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
  logActivity('Admin/Petugas', 'Tambah Kategori', `Menambahkan kategori: ${nama}`);
  res.status(201).json({ success: true, message: 'Kategori baru berhasil ditambahkan.', data: newCat });
});

app.put('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const cat = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  if (!cat) {
    return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
  }

  const { nama, icon, desc, susut, color } = req.body;
  db.prepare(`
    UPDATE categories 
    SET nama = ?, icon = ?, desc = ?, susut = ?, color = ?
    WHERE id = ?
  `).run(nama || cat.nama, icon || cat.icon, desc !== undefined ? desc : cat.desc, susut || cat.susut, color || cat.color, id);

  const updatedCat = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  res.json({ success: true, message: 'Kategori berhasil diperbarui.', data: updatedCat });
});

app.delete('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  res.json({ success: true, message: 'Kategori berhasil dihapus.' });
});

// --- 4. LOCATIONS & BUILDINGS ---
app.get('/api/buildings', (req, res) => {
  const buildings = db.prepare('SELECT * FROM buildings ORDER BY id ASC').all();
  res.json({ success: true, data: buildings });
});

app.post('/api/buildings', (req, res) => {
  const { kode, nama, tipe, jumlah_lantai, pic } = req.body;
  if (!nama) {
    return res.status(400).json({ success: false, message: 'Nama gedung wajib diisi.' });
  }
  let finalKode = (kode || `GD-${Math.floor(Math.random() * 900 + 100)}`).trim();
  const exists = db.prepare('SELECT id FROM buildings WHERE LOWER(kode) = LOWER(?)').get(finalKode);
  if (exists) {
    finalKode = `${finalKode}-${Math.floor(Math.random() * 90 + 10)}`;
  }
  const result = db.prepare(`
    INSERT INTO buildings (kode, nama, tipe, jumlah_lantai, pic)
    VALUES (?, ?, ?, ?, ?)
  `).run(finalKode, nama.trim(), tipe || 'Fakultas', parseInt(jumlah_lantai) || 3, pic || 'Petugas Sarpras');
  const newBld = db.prepare('SELECT * FROM buildings WHERE id = ?').get(result.lastInsertRowid);
  logActivity('Admin/Petugas', 'Tambah Gedung', `Menambahkan gedung: ${nama} (${finalKode})`);
  res.status(201).json({ success: true, message: 'Gedung baru berhasil ditambahkan.', data: newBld });
});

app.get('/api/locations', (req, res) => {
  const locations = db.prepare('SELECT * FROM locations ORDER BY id ASC').all();
  res.json({ success: true, data: locations });
});

app.post('/api/locations', (req, res) => {
  const kode = req.body.kode || req.body.code;
  const nama = req.body.nama || req.body.title;
  const gedung_kode = req.body.gedung_kode || req.body.building;
  const lantai = req.body.lantai || req.body.floor;
  const kapasitas = req.body.kapasitas || req.body.capacity;
  const { luas, kondisi, status } = req.body;
  if (!kode || !nama) {
    return res.status(400).json({ success: false, message: 'Kode dan nama ruangan wajib diisi.' });
  }

  const cleanKode = String(kode).trim();
  const existingLoc = db.prepare('SELECT * FROM locations WHERE LOWER(kode) = LOWER(?)').get(cleanKode);
  if (existingLoc) {
    db.prepare(`
      UPDATE locations
      SET nama = ?, gedung_kode = ?, lantai = ?, kapasitas = ?, luas = ?, kondisi = ?, status = ?
      WHERE id = ?
    `).run(
      nama,
      gedung_kode || existingLoc.gedung_kode || '',
      lantai || existingLoc.lantai || '',
      kapasitas || existingLoc.kapasitas || '20 Orang',
      luas || existingLoc.luas || '50 m²',
      kondisi || existingLoc.kondisi || 'Baik',
      status || existingLoc.status || 'Tersedia',
      existingLoc.id
    );
    const updatedLoc = db.prepare('SELECT * FROM locations WHERE id = ?').get(existingLoc.id);
    logActivity('Admin/Petugas', 'Update Ruangan', `Memperbarui ruangan: ${nama} (${cleanKode})`);
    return res.status(200).json({ success: true, message: 'Data ruangan berhasil diperbarui.', data: updatedLoc });
  }

  const result = db.prepare(`
    INSERT INTO locations (kode, nama, gedung_kode, lantai, kapasitas, luas, kondisi, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(cleanKode, nama, gedung_kode || '', lantai || '', kapasitas || '20 Orang', luas || '50 m²', kondisi || 'Baik', status || 'Tersedia');

  const newLoc = db.prepare('SELECT * FROM locations WHERE id = ?').get(result.lastInsertRowid);
  logActivity('Admin/Petugas', 'Tambah Ruangan', `Menambahkan ruangan baru: ${nama} (${cleanKode})`);
  res.status(201).json({ success: true, message: 'Ruangan baru berhasil didaftarkan.', data: newLoc });
});

app.put('/api/locations/:id', (req, res) => {
  const param = req.params.id;
  const loc = /^\d+$/.test(param)
    ? db.prepare('SELECT * FROM locations WHERE id = ?').get(parseInt(param))
    : db.prepare('SELECT * FROM locations WHERE LOWER(kode) = LOWER(?)').get(param);

  if (!loc) {
    return res.status(404).json({ success: false, message: 'Ruangan tidak ditemukan.' });
  }

  const kode = req.body.kode || req.body.code;
  const nama = req.body.nama || req.body.title;
  const gedung_kode = req.body.gedung_kode !== undefined ? req.body.gedung_kode : req.body.building;
  const lantai = req.body.lantai !== undefined ? req.body.lantai : req.body.floor;
  const kapasitas = req.body.kapasitas !== undefined ? req.body.kapasitas : req.body.capacity;
  const { luas, kondisi, status } = req.body;
  db.prepare(`
    UPDATE locations
    SET kode = ?, nama = ?, gedung_kode = ?, lantai = ?, kapasitas = ?, luas = ?, kondisi = ?, status = ?
    WHERE id = ?
  `).run(
    kode || loc.kode,
    nama || loc.nama,
    gedung_kode !== undefined ? gedung_kode : loc.gedung_kode,
    lantai !== undefined ? lantai : loc.lantai,
    kapasitas !== undefined ? kapasitas : loc.kapasitas,
    luas !== undefined ? luas : loc.luas,
    kondisi || loc.kondisi,
    status || loc.status,
    loc.id
  );

  const updated = db.prepare('SELECT * FROM locations WHERE id = ?').get(loc.id);
  logActivity('Admin/Petugas', 'Ubah Ruangan', `Memperbarui status/data ruangan ${updated.nama} (${updated.kode})`);
  res.json({ success: true, message: 'Data ruangan berhasil diperbarui.', data: updated });
});

app.delete('/api/locations/:id', (req, res) => {
  const param = req.params.id;
  const loc = /^\d+$/.test(param)
    ? db.prepare('SELECT * FROM locations WHERE id = ?').get(parseInt(param))
    : db.prepare('SELECT * FROM locations WHERE LOWER(kode) = LOWER(?)').get(param);

  if (!loc) {
    return res.status(404).json({ success: false, message: 'Ruangan tidak ditemukan.' });
  }
  db.prepare('DELETE FROM locations WHERE id = ?').run(loc.id);
  logActivity('Admin', 'Hapus Ruangan', `Menghapus ruangan ${loc.nama} (${loc.kode})`);
  res.json({ success: true, message: 'Ruangan berhasil dihapus.' });
});

// --- 5. EMPLOYEES CRUD ---
app.get('/api/employees', (req, res) => {
  const employees = db.prepare('SELECT * FROM employees ORDER BY id ASC').all();
  res.json({ success: true, data: employees });
});

app.post('/api/employees', (req, res) => {
  const { nip, nama, unit_kerja, jabatan, email, telepon, status_aset } = req.body;
  if (!nip || !nama) {
    return res.status(400).json({ success: false, message: 'NIP dan nama pegawai wajib diisi.' });
  }

  let finalNip = String(nip).trim();
  const existingEmp = db.prepare('SELECT id FROM employees WHERE nip = ?').get(finalNip);
  if (existingEmp) {
    finalNip = `${finalNip}-${Math.floor(Math.random() * 90 + 10)}`;
  }

  const result = db.prepare(`
    INSERT INTO employees (nip, nama, unit_kerja, jabatan, email, telepon, status_aset)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(finalNip, nama.trim(), unit_kerja || '', jabatan || '', email || '', telepon || '', status_aset || '0 Aset Dikelola');

  const newEmp = db.prepare('SELECT * FROM employees WHERE id = ?').get(result.lastInsertRowid);
  logActivity('Admin', 'Tambah Pegawai', `Menambahkan pegawai baru: ${nama} (${finalNip})`);
  res.status(201).json({ success: true, message: 'Data pegawai berhasil ditambahkan.', data: newEmp });
});

app.put('/api/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const emp = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
  if (!emp) {
    return res.status(404).json({ success: false, message: 'Pegawai tidak ditemukan.' });
  }

  const { nama, unit_kerja, jabatan, email, telepon, status_aset } = req.body;
  db.prepare(`
    UPDATE employees 
    SET nama = ?, unit_kerja = ?, jabatan = ?, email = ?, telepon = ?, status_aset = ?
    WHERE id = ?
  `).run(nama || emp.nama, unit_kerja || emp.unit_kerja, jabatan || emp.jabatan, email || emp.email, telepon || emp.telepon, status_aset || emp.status_aset, id);

  const updatedEmp = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
  res.json({ success: true, message: 'Data pegawai berhasil diperbarui.', data: updatedEmp });
});

app.delete('/api/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.prepare('DELETE FROM employees WHERE id = ?').run(id);
  res.json({ success: true, message: 'Data pegawai berhasil dihapus.' });
});

// --- 6. LOANS & RESERVATIONS ---
app.get('/api/loans', (req, res) => {
  const { status, user_id } = req.query;
  let q = 'SELECT * FROM loans WHERE 1=1';
  const params = [];

  if (status) {
    q += ' AND LOWER(status) = LOWER(?)';
    params.push(status);
  }
  if (user_id) {
    q += ' AND user_id = ?';
    params.push(parseInt(user_id));
  }

  q += ' ORDER BY id DESC';
  const loans = db.prepare(q).all(...params);
  res.json({ success: true, data: loans });
});

app.post('/api/loans', (req, res) => {
  const { asset_id, asset_nama, keperluan, tgl_pinjam, tgl_kembali, peminjam_nama, peminjam_nip, user_id } = req.body;

  const asset = asset_id ? db.prepare('SELECT * FROM assets WHERE id = ?').get(asset_id) : null;
  const assetName = asset ? asset.nama : (asset_nama || 'Aset Sarpras');
  let loanKode = `PINJAM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 8999) + 1000)}`;
  if (db.prepare('SELECT id FROM loans WHERE kode = ?').get(loanKode)) {
    loanKode = `PINJAM-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;
  }

  const result = db.prepare(`
    INSERT INTO loans (kode, asset_id, asset_nama, user_id, peminjam_nama, peminjam_nip, keperluan, tgl_pinjam, tgl_kembali, status, catatan)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    loanKode,
    asset_id || null,
    assetName,
    user_id || 4,
    peminjam_nama || 'Ahmad Fauzi',
    peminjam_nip || '2021510045',
    keperluan || 'Kegiatan Akademik Institusi',
    tgl_pinjam || new Date().toISOString().slice(0, 10),
    tgl_kembali || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    'Menunggu Approval',
    'Menunggu otorisasi pimpinan / petugas'
  );

  logActivity(peminjam_nama || 'Peminjam', 'Ajukan Pinjaman', `Mengajukan peminjaman: ${assetName} (${loanKode})`);
  res.status(201).json({ success: true, message: `Permohonan peminjaman ${loanKode} berhasil dikirim!`, data: { id: result.lastInsertRowid, kode: loanKode } });
});

app.put('/api/loans/:id/approve', (req, res) => {
  const id = parseInt(req.params.id);
  const { approved_by } = req.body;

  const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(id);
  if (!loan) return res.status(404).json({ success: false, message: 'Data pinjaman tidak ditemukan.' });

  db.prepare(`
    UPDATE loans 
    SET status = 'Aktif', approved_by = ?, approved_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(approved_by || 'Pimpinan / Admin', id);

  if (loan.asset_id) {
    db.prepare("UPDATE assets SET status = 'Dipinjam' WHERE id = ?").run(loan.asset_id);
  }

  logActivity(approved_by || 'Pimpinan', 'Setujui Peminjaman', `Menyetujui peminjaman ${loan.kode}`);
  res.json({ success: true, message: `Peminjaman ${loan.kode} berhasil disetujui!` });
});

app.put('/api/loans/:id/reject', (req, res) => {
  const id = parseInt(req.params.id);
  const { reason, rejected_by } = req.body;

  const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(id);
  if (!loan) return res.status(404).json({ success: false, message: 'Data pinjaman tidak ditemukan.' });

  db.prepare(`
    UPDATE loans 
    SET status = 'Ditolak', catatan = ?
    WHERE id = ?
  `).run(reason || 'Pengajuan ditolak oleh pimpinan.', id);

  logActivity(rejected_by || 'Pimpinan', 'Tolak Peminjaman', `Menolak peminjaman ${loan.kode}: ${reason}`);
  res.json({ success: true, message: `Peminjaman ${loan.kode} telah ditolak.` });
});

app.put('/api/loans/:id/request-return', (req, res) => {
  const id = parseInt(req.params.id);
  const { catatan, requested_by } = req.body || {};
  const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(id);
  if (!loan) return res.status(404).json({ success: false, message: 'Data pinjaman tidak ditemukan.' });

  const noteText = (catatan && String(catatan).trim())
    ? `Pengajuan pengembalian: ${String(catatan).trim()}`
    : 'Peminjam mengajukan pengembalian. Menunggu verifikasi fisik Petugas Sarpras.';

  db.prepare("UPDATE loans SET status = 'Verifikasi Kembali', catatan = ? WHERE id = ?").run(noteText, id);
  logActivity(requested_by || loan.peminjam_nama, 'Ajukan Pengembalian', `Mengajukan pengembalian ${loan.asset_nama} (${loan.kode})`);
  res.json({ success: true, message: `Pengembalian ${loan.asset_nama} diajukan! Menunggu verifikasi Petugas Sarpras.` });
});

app.put('/api/loans/:id/return', (req, res) => {
  const id = parseInt(req.params.id);
  const { verified_by, catatan } = req.body || {};
  const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(id);
  if (!loan) return res.status(404).json({ success: false, message: 'Data pinjaman tidak ditemukan.' });

  const noteText = (catatan && String(catatan).trim())
    ? `Dikembalikan & diverifikasi (${verified_by || 'Petugas Sarpras'}): ${String(catatan).trim()}`
    : `Dikembalikan & diverifikasi oleh ${verified_by || 'Petugas Sarpras'}.`;

  db.prepare("UPDATE loans SET status = 'Selesai', catatan = ? WHERE id = ?").run(noteText, id);
  if (loan.asset_id) {
    db.prepare("UPDATE assets SET status = 'Tersedia' WHERE id = ?").run(loan.asset_id);
  }

  logActivity(verified_by || loan.peminjam_nama, 'Pengembalian Aset', `Aset ${loan.asset_nama} (${loan.kode}) telah dikembalikan & diverifikasi.`);
  res.json({ success: true, message: `Pengembalian aset ${loan.asset_nama} berhasil diverifikasi & selesai!` });
});

app.put('/api/loans/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(id);
  if (!loan) return res.status(404).json({ success: false, message: 'Data pinjaman tidak ditemukan.' });

  const { tgl_pinjam, tgl_kembali, keperluan, asset_id, peminjam_nama, peminjam_nip, status } = req.body;
  const newTglPinjam = tgl_pinjam || loan.tgl_pinjam;
  const newTglKembali = tgl_kembali || loan.tgl_kembali;
  const newKeperluan = keperluan !== undefined ? keperluan : loan.keperluan;
  const newStatus = status || loan.status;

  db.prepare(`
    UPDATE loans
    SET tgl_pinjam = ?, tgl_kembali = ?, keperluan = ?, status = ?
    WHERE id = ?
  `).run(newTglPinjam, newTglKembali, newKeperluan, newStatus, id);

  logActivity('Petugas Sarpras', 'Ubah Jadwal Peminjaman', `Memperbarui jadwal pinjaman ${loan.kode}: ${newTglPinjam} s/d ${newTglKembali}`);
  const updatedLoan = db.prepare('SELECT * FROM loans WHERE id = ?').get(id);
  res.json({ success: true, message: `Jadwal peminjaman ${loan.kode} berhasil diperbarui!`, data: updatedLoan });
});

// --- 7. APPROVALS (ANTREAN) ---
app.get('/api/approvals', (req, res) => {
  const approvals = db.prepare('SELECT * FROM approvals ORDER BY is_urgent DESC, id DESC').all();
  res.json({ success: true, data: approvals });
});

app.put('/api/approvals/:id/approve', (req, res) => {
  const id = parseInt(req.params.id);
  db.prepare("UPDATE approvals SET status = 'Disetujui' WHERE id = ?").run(id);
  logActivity('Pimpinan', 'Setujui Antrean', `Menyetujui permohonan antrean ID ${id}`);
  res.json({ success: true, message: 'Permohonan berhasil disetujui & izin digital diterbitkan.' });
});

app.put('/api/approvals/:id/reject', (req, res) => {
  const id = parseInt(req.params.id);
  db.prepare("UPDATE approvals SET status = 'Ditolak' WHERE id = ?").run(id);
  logActivity('Pimpinan', 'Tolak Antrean', `Menolak permohonan antrean ID ${id}`);
  res.json({ success: true, message: 'Permohonan telah ditolak.' });
});

app.put('/api/approvals/:id/revision', (req, res) => {
  const id = parseInt(req.params.id);
  const { notes } = req.body || {};
  db.prepare("UPDATE approvals SET status = 'Revisi Diminta', waiting_for = ? WHERE id = ?").run(
    notes ? `Revisi: ${notes}` : 'Menunggu Revisi Pemohon',
    id
  );
  logActivity('Pimpinan', 'Minta Revisi Antrean', `Meminta revisi permohonan antrean ID ${id}`);
  res.json({ success: true, message: 'Permintaan revisi berkas telah dikirim ke pemohon.' });
});

// --- 8. TICKETS (MAINTENANCE KANBAN) ---
app.get('/api/tickets', (req, res) => {
  const { asset_id, asset_kode } = req.query;
  let q = 'SELECT * FROM tickets WHERE 1=1';
  const params = [];
  if (asset_id) {
    q += ' AND asset_id = ?';
    params.push(parseInt(asset_id));
  }
  if (asset_kode) {
    q += ' AND LOWER(asset_kode) = LOWER(?)';
    params.push(String(asset_kode).trim());
  }
  q += ' ORDER BY id DESC';
  const tickets = db.prepare(q).all(...params);
  res.json({ success: true, data: tickets });
});

app.post('/api/tickets', (req, res) => {
  const {
    title, location, gedung, priority, category, reporter, tech_name, desc, cost,
    asset_id, asset_kode, asset_nama, target_type
  } = req.body;
  if (!title && !asset_nama) {
    return res.status(400).json({ success: false, message: 'Barang/fasilitas dan judul kerusakan wajib diisi.' });
  }

  let resolvedAssetId = asset_id ? parseInt(asset_id) : null;
  let resolvedAssetKode = String(asset_kode || '').trim();
  let resolvedAssetNama = String(asset_nama || '').trim();
  let resolvedLocation = String(location || '').trim();
  let resolvedGedung = String(gedung || '').trim();
  const resolvedTargetType = String(target_type || (resolvedAssetId || resolvedAssetKode ? 'aset' : 'lainnya')).trim();

  if (resolvedAssetId || (resolvedTargetType === 'aset' && resolvedAssetKode)) {
    const foundAsset = resolvedAssetId
      ? db.prepare('SELECT * FROM assets WHERE id = ?').get(resolvedAssetId)
      : db.prepare('SELECT * FROM assets WHERE LOWER(nup) = LOWER(?) OR LOWER(kode) = LOWER(?)').get(resolvedAssetKode, resolvedAssetKode);
    if (foundAsset) {
      resolvedAssetId = foundAsset.id;
      resolvedAssetKode = resolvedAssetKode || foundAsset.nup || foundAsset.kode || '';
      resolvedAssetNama = resolvedAssetNama || foundAsset.nama || '';
      if (!resolvedLocation) resolvedLocation = foundAsset.lokasi || '';
      if (!resolvedGedung) resolvedGedung = foundAsset.gedung || '';
    }
  }

  const finalTitle = String(title || '').trim() || `Kerusakan ${resolvedAssetNama}`;

  let kode = `TKT-${String(Math.floor(Math.random() * 8999) + 1000)}`;
  if (db.prepare('SELECT id FROM tickets WHERE kode = ?').get(kode)) {
    kode = `TKT-${Date.now().toString().slice(-5)}`;
  }
  const cleanReporter = String(reporter || '').trim() || 'Petugas Sarpras';
  const cleanTech = String(tech_name || '').trim() || 'Menunggu Penugasan';
  const result = db.prepare(`
    INSERT INTO tickets (kode, asset_id, asset_kode, asset_nama, target_type, title, location, gedung, priority, category, reporter, tech_name, status, desc, cost)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    kode,
    resolvedAssetId,
    resolvedAssetKode,
    resolvedAssetNama,
    resolvedTargetType,
    finalTitle,
    resolvedLocation || 'Ruang Publik',
    resolvedGedung || 'Gedung Rektorat (Pusat)',
    priority || 'SEDANG',
    category || 'Umum',
    cleanReporter,
    cleanTech,
    'baru',
    desc || '',
    parseInt(cost) || 0
  );

  const newTicket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(result.lastInsertRowid);
  const targetNote = resolvedAssetNama ? ` [${resolvedAssetKode ? resolvedAssetKode + ' - ' : ''}${resolvedAssetNama}]` : '';
  logActivity(cleanReporter, 'Lapor Kerusakan', `Membuat laporan/tiket kerusakan${targetNote}: ${finalTitle} (${kode})`);
  res.status(201).json({ success: true, message: `Laporan kerusakan ${kode} berhasil dikirim ke antrean Petugas Sarpras!`, data: newTicket });
});

app.put('/api/tickets/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
  if (!ticket) return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });

  const { status, tech_name, desc, cost, priority } = req.body;
  db.prepare(`
    UPDATE tickets 
    SET status = ?, tech_name = ?, desc = ?, cost = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    status || ticket.status,
    tech_name || ticket.tech_name,
    desc !== undefined ? desc : ticket.desc,
    cost !== undefined ? parseInt(cost) : ticket.cost,
    priority || ticket.priority,
    id
  );

  const updatedTicket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
  logActivity('Petugas', 'Update Tiket', `Tiket ${ticket.kode} status diubah ke: ${status || ticket.status}`);
  res.json({ success: true, message: `Tiket ${ticket.kode} berhasil diperbarui.`, data: updatedTicket });
});

app.delete('/api/tickets/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.prepare('DELETE FROM tickets WHERE id = ?').run(id);
  res.json({ success: true, message: 'Tiket perbaikan berhasil dihapus.' });
});

// --- 9. MUTATIONS ---
app.get('/api/mutations', (req, res) => {
  const mutations = db.prepare('SELECT * FROM mutations ORDER BY id DESC').all();
  res.json({ success: true, data: mutations });
});

app.post('/api/mutations', (req, res) => {
  const { asset_id, asset_name, nup, unit_count, origin_loc, origin_pic, origin_nip, dest_loc, dest_pic, dest_nip, purpose } = req.body;

  let bastNo = `BAST/MUT/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 8999) + 1000)}`;
  if (db.prepare('SELECT id FROM mutations WHERE bast_no = ?').get(bastNo)) {
    bastNo = `BAST/MUT/${new Date().getFullYear()}/${Date.now().toString().slice(-5)}`;
  }

  const result = db.prepare(`
    INSERT INTO mutations (bast_no, asset_id, asset_name, nup, unit_count, origin_loc, origin_pic, origin_nip, dest_loc, dest_pic, dest_nip, purpose, status, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    bastNo,
    asset_id || null,
    asset_name || 'Aset Inventaris',
    nup || 'SAR/2025/0000',
    unit_count || '1 Unit',
    origin_loc || 'Ruang Asal',
    origin_pic || 'PIC Asal',
    origin_nip || '',
    dest_loc || 'Ruang Tujuan',
    dest_pic || 'PIC Tujuan',
    dest_nip || '',
    purpose || 'Mutasi operasional institusi',
    'Dalam Proses Pemindahan',
    new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  );

  // Jika ada asset_id, mutasikan lokasi di master aset
  if (asset_id && dest_loc) {
    db.prepare('UPDATE assets SET lokasi = ?, pic = ? WHERE id = ?').run(dest_loc, dest_pic || 'PIC Baru', asset_id);
  }

  logActivity('Admin/Petugas', 'Mutasi Aset', `Menerbitkan BAST mutasi ${bastNo} untuk ${asset_name}`);
  res.status(201).json({ success: true, message: `Berita Acara Mutasi ${bastNo} berhasil dibuat!`, data: { id: result.lastInsertRowid, bast_no: bastNo } });
});

app.put('/api/mutations/:id/approve', (req, res) => {
  const id = parseInt(req.params.id);
  const mut = db.prepare('SELECT * FROM mutations WHERE id = ?').get(id);
  if (!mut) return res.status(404).json({ success: false, message: 'Data mutasi tidak ditemukan.' });

  db.prepare(`
    UPDATE mutations
    SET status = 'Selesai Terverifikasi', doc_status = 'BAST_Signed.pdf'
    WHERE id = ?
  `).run(id);

  logActivity('Pimpinan/Admin', 'Validasi BAST Mutasi', `Menandatangani BAST mutasi ${mut.bast_no}`);
  res.json({ success: true, message: `BAST Mutasi ${mut.bast_no} telah divalidasi dan diterbitkan!` });
});

// --- 10. STOCK OPNAME ---
app.get('/api/stock-opname', (req, res) => {
  const logs = db.prepare('SELECT * FROM stock_opname ORDER BY id DESC').all();
  res.json({ success: true, data: logs });
});

app.post('/api/stock-opname', (req, res) => {
  const { code, name, category, sn, actual_loc, master_loc, is_loc_diff, audit_status, condition, auditor, session_name } = req.body;

  const now = new Date();
  const scanTime = `Scan QR - ${now.getDate()} ${now.toLocaleString('id-ID', { month: 'short' })} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const result = db.prepare(`
    INSERT INTO stock_opname (code, name, category, sn, actual_loc, master_loc, is_loc_diff, audit_status, condition, auditor, scan_time, session_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    code || 'SAR/2025/0000',
    name || 'Aset Terpindai',
    category || 'Umum',
    sn || '-',
    actual_loc || 'Ruang Audit',
    master_loc || actual_loc || 'Ruang Audit',
    is_loc_diff ? 1 : 0,
    audit_status || 'Cocok Sesuai Data',
    condition || 'Baik',
    auditor || 'Auditor Sarpras',
    scanTime,
    session_name || 'Audit Semester 1 - 2025'
  );

  res.status(201).json({ success: true, message: `Scan verifikasi aset ${code} berhasil dicatat!`, data: { id: result.lastInsertRowid } });
});

app.put('/api/stock-opname/:id/sync', (req, res) => {
  const id = parseInt(req.params.id);
  const log = db.prepare('SELECT * FROM stock_opname WHERE id = ?').get(id);
  if (!log) return res.status(404).json({ success: false, message: 'Log stock opname tidak ditemukan.' });

  // Update audit log record
  db.prepare(`
    UPDATE stock_opname 
    SET master_loc = actual_loc, is_loc_diff = 0, audit_status = 'Cocok Sesuai Data'
    WHERE id = ?
  `).run(id);

  // Sync back to master assets table
  db.prepare('UPDATE assets SET lokasi = ? WHERE nup = ? OR kode = ?').run(log.actual_loc, log.code, log.code);

  logActivity('Auditor', 'Sinkronisasi Lokasi', `Menyesuaikan lokasi aset ${log.code} ke ${log.actual_loc}`);
  res.json({ success: true, message: `Lokasi master aset ${log.code} berhasil disinkronkan ke ${log.actual_loc}!` });
});

app.put('/api/stock-opname/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const log = db.prepare('SELECT * FROM stock_opname WHERE id = ?').get(id);
  if (!log) return res.status(404).json({ success: false, message: 'Log stock opname tidak ditemukan.' });

  const { audit_status, condition, actual_loc, master_loc, is_loc_diff } = req.body;
  db.prepare(`
    UPDATE stock_opname
    SET audit_status = ?, condition = ?, actual_loc = ?, master_loc = ?, is_loc_diff = ?
    WHERE id = ?
  `).run(
    audit_status || log.audit_status,
    condition || log.condition,
    actual_loc || log.actual_loc,
    master_loc || log.master_loc,
    is_loc_diff !== undefined ? (is_loc_diff ? 1 : 0) : log.is_loc_diff,
    id
  );

  res.json({ success: true, message: `Status audit aset ${log.code} diperbarui.` });
});

// --- 11. DASHBOARD STATS & KPI ---
app.get('/api/dashboard/stats', (req, res) => {
  const totalAssets = db.prepare('SELECT COUNT(*) as count FROM assets').get().count;
  const readyAssets = db.prepare("SELECT COUNT(*) as count FROM assets WHERE LOWER(status) = 'tersedia'").get().count;
  const loanedAssets = db.prepare("SELECT COUNT(*) as count FROM assets WHERE LOWER(status) = 'dipinjam'").get().count;
  const maintenanceAssets = db.prepare("SELECT COUNT(*) as count FROM assets WHERE LOWER(status) = 'perawatan'").get().count;
  const damagedAssets = db.prepare("SELECT COUNT(*) as count FROM assets WHERE LOWER(kondisi) LIKE '%rusak%' OR LOWER(status) = 'afkir'").get().count;
  const totalValue = db.prepare('SELECT SUM(nilai) as sum FROM assets').get().sum || 0;

  const pendingApprovals = db.prepare("SELECT COUNT(*) as count FROM approvals WHERE status = 'Sedang Ditinjau'").get().count;
  const activeTickets = db.prepare("SELECT COUNT(*) as count FROM tickets WHERE status != 'selesai'").get().count;

  res.json({
    success: true,
    data: {
      totalAssets,
      readyAssets,
      loanedAssets,
      maintenanceAssets,
      damagedAssets,
      totalValue,
      pendingApprovals,
      activeTickets
    }
  });
});

// --- 12. SETTINGS, BACKUP & RESTORE ---
app.get('/api/settings', (req, res) => {
  const settingsRows = db.prepare('SELECT * FROM settings').all();
  const settings = {};
  for (const s of settingsRows) {
    settings[s.key] = s.value;
  }
  res.json({ success: true, data: settings });
});

app.post('/api/settings', (req, res) => {
  const entries = Object.entries(req.body);
  const upsert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  for (const [k, v] of entries) {
    upsert.run(k, String(v));
  }
  logActivity('Admin', 'Ubah Pengaturan', 'Memperbarui konfigurasi sistem institusi');
  res.json({ success: true, message: 'Pengaturan sistem berhasil disimpan.' });
});

app.get('/api/backup', (req, res) => {
  const data = {
    timestamp: new Date().toISOString(),
    users: db.prepare('SELECT * FROM users').all(),
    categories: db.prepare('SELECT * FROM categories').all(),
    buildings: db.prepare('SELECT * FROM buildings').all(),
    locations: db.prepare('SELECT * FROM locations').all(),
    employees: db.prepare('SELECT * FROM employees').all(),
    assets: db.prepare('SELECT * FROM assets').all(),
    loans: db.prepare('SELECT * FROM loans').all(),
    approvals: db.prepare('SELECT * FROM approvals').all(),
    tickets: db.prepare('SELECT * FROM tickets').all(),
    mutations: db.prepare('SELECT * FROM mutations').all(),
    stock_opname: db.prepare('SELECT * FROM stock_opname').all(),
    settings: db.prepare('SELECT * FROM settings').all()
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=SIMAS_DB_Backup_${Date.now()}.json`);
  res.send(JSON.stringify(data, null, 2));
});

app.post('/api/reset-all', (req, res) => {
  // Truncate tables and reseed
  db.exec(`
    DELETE FROM activity_logs;
    DELETE FROM stock_opname;
    DELETE FROM mutations;
    DELETE FROM tickets;
    DELETE FROM approvals;
    DELETE FROM loans;
    DELETE FROM assets;
    DELETE FROM employees;
    DELETE FROM locations;
    DELETE FROM buildings;
    DELETE FROM categories;
    DELETE FROM users;
    DELETE FROM settings;
  `);

  seedData();
  logActivity('Admin', 'Reset Database', 'Seluruh database direset ke data pabrik.');
  res.json({ success: true, message: 'Seluruh database berhasil direset ke setelan awal!' });
});

app.get('/api/activity-logs', (req, res) => {
  const logs = db.prepare('SELECT * FROM activity_logs ORDER BY id DESC LIMIT 100').all();
  res.json({ success: true, data: logs });
});

app.post('/api/activity-logs', (req, res) => {
  const { user_name, action, details } = req.body || {};
  logActivity(user_name || 'Pengguna SIMAS', action || 'Aktivitas', details || '');
  res.status(201).json({ success: true, message: 'Log aktivitas tercatat.' });
});

// ===================== STATIC FILES & FALLBACKS ===================== //

// Root redirect ke pages/login.html
app.get('/', (req, res) => {
  res.redirect('/pages/login.html');
});

// Static assets
app.use(express.static(ROOT_DIR));

// Fallback untuk file HTML di root
app.get('/:page.html', (req, res, next) => {
  const target = path.join(ROOT_DIR, 'pages', `${req.params.page}.html`);
  if (fs.existsSync(target)) {
    return res.redirect(`/pages/${req.params.page}.html`);
  }
  next();
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`[SIMAS Backend & Frontend] Berjalan di http://localhost:${PORT}/ (Redirects to /pages/login.html)`);
});

module.exports = { app, server };

