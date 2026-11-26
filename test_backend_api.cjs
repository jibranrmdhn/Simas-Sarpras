const http = require('http');

function req(method, path, body = null, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
        ...extraHeaders
      }
    };

    const request = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, text: data });
        }
      });
    });

    request.on('error', reject);
    if (postData) request.write(postData);
    request.end();
  });
}

async function runTests() {
  console.log('--- Testing Backend API Suite ---');
  let passed = 0;
  let failed = 0;

  async function assert(name, fn) {
    try {
      const res = await fn();
      if (res) {
        console.log(`[PASS] ${name}`);
        passed++;
      } else {
        console.error(`[FAIL] ${name}`);
        failed++;
      }
    } catch (e) {
      console.error(`[FAIL] ${name}: ${e.message}`);
      failed++;
    }
  }

  // 1. Dashboard Stats
  await assert('GET /api/dashboard/stats returns stats', async () => {
    const res = await req('GET', '/api/dashboard/stats');
    return res.status === 200 && res.data.success && res.data.data.totalAssets >= 8;
  });

  // 2. Categories CRUD
  let newCatId = null;
  await assert('POST /api/categories creates category', async () => {
    const res = await req('POST', '/api/categories', {
      kode: 'KAT-99',
      nama: 'Kategori Uji Coba Otomatis',
      icon: 'archive',
      desc: 'Pengujian integrasi backend',
      susut: '3 Tahun'
    });
    if (res.status === 201 && res.data.success && res.data.data.id) {
      newCatId = res.data.data.id;
      return true;
    }
    return false;
  });

  await assert('PUT /api/categories/:id updates category', async () => {
    const res = await req('PUT', `/api/categories/${newCatId}`, {
      nama: 'Kategori Uji Coba Terupdate'
    });
    return res.status === 200 && res.data.success && res.data.data.nama === 'Kategori Uji Coba Terupdate';
  });

  await assert('DELETE /api/categories/:id deletes category', async () => {
    const res = await req('DELETE', `/api/categories/${newCatId}`);
    return res.status === 200 && res.data.success;
  });

  // 3. Employees CRUD
  let newEmpId = null;
  await assert('POST /api/employees creates employee', async () => {
    const res = await req('POST', '/api/employees', {
      nip: '199501012025011999',
      nama: 'Auditor Baru, S.Kom',
      unit_kerja: 'Bagian Audit Sarpras',
      jabatan: 'Auditor Lapangan'
    });
    if (res.status === 201 && res.data.success && res.data.data.id) {
      newEmpId = res.data.data.id;
      return true;
    }
    return false;
  });

  await assert('DELETE /api/employees/:id deletes employee', async () => {
    const res = await req('DELETE', `/api/employees/${newEmpId}`);
    return res.status === 200 && res.data.success;
  });

  // 4. Asset CRUD
  let newAssetId = null;
  await assert('POST /api/assets creates asset', async () => {
    const res = await req('POST', '/api/assets', {
      nama: 'Server Rack HP ProLiant DL380 Gen 10',
      kode: 'AST-SRV-999',
      nilai: 75000000,
      kategori_nama: 'Elektronik & Multimedia',
      lokasi: 'Data Center Rektorat'
    });
    if (res.status === 201 && res.data.success && res.data.data.id) {
      newAssetId = res.data.data.id;
      return true;
    }
    return false;
  });

  await assert('PUT /api/assets/:id updates asset', async () => {
    const res = await req('PUT', `/api/assets/${newAssetId}`, {
      kondisi: 'Baik'
    });
    return res.status === 200 && res.data.success && res.data.data.kondisi === 'Baik';
  });

  await assert('DELETE /api/assets/:id deletes asset', async () => {
    const res = await req('DELETE', `/api/assets/${newAssetId}`);
    return res.status === 200 && res.data.success;
  });

  // 5. Loans & Return
  let newLoanId = null;
  await assert('POST /api/loans creates loan', async () => {
    const res = await req('POST', '/api/loans', {
      asset_id: 1,
      peminjam_nama: 'Ahmad Fauzi',
      keperluan: 'Uji Coba Backend API'
    });
    if (res.status === 201 && res.data.success && res.data.data.id) {
      newLoanId = res.data.data.id;
      return true;
    }
    return false;
  });

  await assert('PUT /api/loans/:id/approve approves loan', async () => {
    const res = await req('PUT', `/api/loans/${newLoanId}/approve`, { approved_by: 'Pimpinan Institusi' });
    return res.status === 200 && res.data.success;
  });

  await assert('PUT /api/loans/:id/return marks loan returned', async () => {
    const res = await req('PUT', `/api/loans/${newLoanId}/return`);
    return res.status === 200 && res.data.success;
  });

  // 6. Tickets
  let newTicketId = null;
  await assert('POST /api/tickets creates ticket', async () => {
    const res = await req('POST', '/api/tickets', {
      title: 'Perbaikan Lampu LED Auditorium',
      location: 'Auditorium Lt. 2',
      priority: 'SEDANG',
      tech_name: 'Joko Supriyanto'
    });
    if (res.status === 201 && res.data.success && res.data.data.id) {
      newTicketId = res.data.data.id;
      return true;
    }
    return false;
  });

  await assert('PUT /api/tickets/:id changes ticket status', async () => {
    const res = await req('PUT', `/api/tickets/${newTicketId}`, { status: 'selesai' });
    return res.status === 200 && res.data.success;
  });

  await assert('DELETE /api/tickets/:id deletes ticket', async () => {
    const res = await req('DELETE', `/api/tickets/${newTicketId}`);
    return res.status === 200 && res.data.success;
  });

  // 7. Mutations
  await assert('POST /api/mutations creates mutation', async () => {
    const res = await req('POST', '/api/mutations', {
      asset_name: 'Proyektor Epson',
      unit_count: '1 Unit',
      origin_loc: 'Lab Komputasi A.201',
      dest_loc: 'Studio Podcast B.102',
      purpose: 'Uji integrasi mutasi backend'
    });
    return res.status === 201 && res.data.success;
  });

  // 8. Stock Opname Sync
  await assert('PUT /api/stock-opname/1/sync synchronizes location', async () => {
    const res = await req('PUT', '/api/stock-opname/1/sync');
    return res.status === 200 && res.data.success;
  });

  // 9. Settings
  await assert('POST /api/settings saves settings', async () => {
    const res = await req('POST', '/api/settings', {
      nama_institusi: 'Universitas Teknologi & Sains Nusantara (Verified)'
    });
    return res.status === 200 && res.data.success;
  });

  // 10. Buildings & Locations CRUD
  await assert('POST /api/buildings creates building', async () => {
    const res = await req('POST', '/api/buildings', {
      kode: 'GDG-TST',
      nama: 'Gedung Riset Uji Coba',
      floors: 4,
      rooms: 20,
      area: '2.500 m2',
      util: 70
    });
    return (res.status === 201 || res.status === 200) && res.data.success;
  });

  let newLocId = null;
  await assert('POST /api/locations creates room', async () => {
    const res = await req('POST', '/api/locations', {
      code: 'R.TEST-99',
      title: 'Ruang Rapat Uji Integrasi',
      status: 'TERSEDIA',
      building: 'Gedung A — Rektorat',
      floor: 'Lantai 2',
      capacity: '20 Kursi',
      pic: 'Drs. Haryanto'
    });
    if ((res.status === 201 || res.status === 200) && res.data.success && res.data.data.id) {
      newLocId = res.data.data.id;
      return true;
    }
    return false;
  });

  await assert('PUT /api/locations/:id updates room status', async () => {
    const res = await req('PUT', `/api/locations/${newLocId}`, {
      status: 'TERPAKAI'
    });
    return res.status === 200 && res.data.success && res.data.data.status === 'TERPAKAI';
  });

  await assert('DELETE /api/locations/:id deletes room', async () => {
    const res = await req('DELETE', `/api/locations/${newLocId}`);
    return res.status === 200 && res.data.success;
  });

  // 11. Activity Logs
  await assert('POST /api/activity-logs records audit log', async () => {
    const res = await req('POST', '/api/activity-logs', {
      user_name: 'Admin Sarpras',
      action: 'Uji Coba Sistem',
      details: 'Verifikasi seluruh tombol dan endpoint backend SIMAS'
    });
    return res.status === 201 && res.data.success;
  });

  // 12. Self-Registration (Peminjam Only: Mahasiswa/Dosen) & Admin-Only Account ACC Workflow
  const testUsername = `uji.acc.${Date.now()}`;
  let pendingUserId = null;

  await assert('POST /api/auth/register creates pending Peminjam (Dosen) account with NIP', async () => {
    const res = await req('POST', '/api/auth/register', {
      nama: 'Dr. Uji Pendaftaran, M.T.',
      username: testUsername,
      email: `${testUsername}@institusi.ac.id`,
      nip: '199201012026011001',
      unit: 'Fakultas Teknik',
      account_type: 'dosen',
      role: 'peminjam',
      password: 'password123'
    });
    if (res.status === 201 && res.data.success && res.data.data && res.data.data.status === 'pending' && res.data.data.role === 'peminjam' && res.data.data.account_type === 'dosen') {
      pendingUserId = res.data.data.id;
      return true;
    }
    return false;
  });

  await assert('POST /api/auth/register blocks self-registration with non-peminjam role (admin/petugas/pimpinan -> 400)', async () => {
    const r1 = await req('POST', '/api/auth/register', {
      nama: 'Percobaan Admin',
      username: `bad.admin.${Date.now()}`,
      email: `bad.admin.${Date.now()}@institusi.ac.id`,
      nip: '123456',
      role: 'admin',
      password: 'password123'
    });
    const r2 = await req('POST', '/api/auth/register', {
      nama: 'Percobaan Pimpinan',
      username: `bad.pimpinan.${Date.now()}`,
      email: `bad.pimpinan.${Date.now()}@institusi.ac.id`,
      nip: '123457',
      role: 'pimpinan',
      password: 'password123'
    });
    const r3 = await req('POST', '/api/auth/register', {
      nama: 'Percobaan Petugas',
      username: `bad.petugas.${Date.now()}`,
      email: `bad.petugas.${Date.now()}@institusi.ac.id`,
      nip: '123458',
      role: 'petugas',
      password: 'password123'
    });
    return r1.status === 400 && r2.status === 400 && r3.status === 400;
  });

  await assert('POST /api/auth/login blocks pending account before Admin ACC (403 ACCOUNT_PENDING)', async () => {
    const res = await req('POST', '/api/auth/login', {
      username: testUsername,
      password: 'password123'
    });
    return res.status === 403 && res.data.code === 'ACCOUNT_PENDING';
  });

  await assert('GET /api/users/pending includes the newly registered account', async () => {
    const res = await req('GET', '/api/users/pending');
    return res.status === 200 && res.data.success && Array.isArray(res.data.data) && res.data.data.some(u => u.id === pendingUserId);
  });

  await assert('PUT /api/users/:id/approve rejects non-admin role (petugas -> 403)', async () => {
    const res = await req('PUT', `/api/users/${pendingUserId}/approve`, {
      approved_by: 'Joko Supriyanto'
    }, { 'X-User-Role': 'petugas' });
    return res.status === 403 && !res.data.success;
  });

  await assert('PUT /api/users/:id/approve rejects non-admin role (pimpinan -> 403)', async () => {
    const res = await req('PUT', `/api/users/${pendingUserId}/approve`, {
      approved_by: 'Dr. Hendro Wijaya'
    }, { 'X-User-Role': 'pimpinan' });
    return res.status === 403 && !res.data.success;
  });

  await assert('PUT /api/users/:id/approve succeeds for Admin (200 active)', async () => {
    const res = await req('PUT', `/api/users/${pendingUserId}/approve`, {
      approved_by: 'Bambang Kusuma',
      role: 'peminjam'
    }, { 'X-User-Role': 'admin' });
    return res.status === 200 && res.data.success && res.data.data.status === 'active';
  });

  await assert('POST /api/auth/login succeeds after Admin ACC (200) with account_type preserved', async () => {
    const res = await req('POST', '/api/auth/login', {
      username: testUsername,
      password: 'password123'
    });
    return res.status === 200 && res.data.success && res.data.user && res.data.user.username === testUsername && res.data.user.account_type === 'dosen';
  });

  await assert('DELETE /api/users/:id cleans up test registered user', async () => {
    const res = await req('DELETE', `/api/users/${pendingUserId}`, null, { 'X-User-Role': 'admin' });
    return res.status === 200 && res.data.success;
  });

  // 13. Rejection workflow test (Mahasiswa with NIM)
  const rejectUsername = `uji.tolak.${Date.now()}`;
  let rejectUserId = null;

  await assert('POST /api/auth/register creates pending Peminjam (Mahasiswa) account with NIM', async () => {
    const res = await req('POST', '/api/auth/register', {
      nama: 'Mahasiswa Uji Tolak',
      username: rejectUsername,
      email: `${rejectUsername}@mahasiswa.ac.id`,
      nip: '2106123456',
      unit: 'S1 Teknik Informatika',
      account_type: 'mahasiswa',
      role: 'peminjam',
      password: 'password123'
    });
    if (res.status === 201 && res.data.success && res.data.data && res.data.data.account_type === 'mahasiswa') {
      rejectUserId = res.data.data.id;
      return true;
    }
    return false;
  });

  await assert('PUT /api/users/:id/reject rejects non-admin (403)', async () => {
    const res = await req('PUT', `/api/users/${rejectUserId}/reject`, {
      reason: 'Tidak berwenang'
    }, { 'X-User-Role': 'petugas' });
    return res.status === 403 && !res.data.success;
  });

  await assert('PUT /api/users/:id/reject succeeds for Admin (200 rejected)', async () => {
    const res = await req('PUT', `/api/users/${rejectUserId}/reject`, {
      reason: 'NIM tidak terdaftar di akademik',
      rejected_by: 'Bambang Kusuma'
    }, { 'X-User-Role': 'admin' });
    return res.status === 200 && res.data.success && res.data.data.status === 'rejected';
  });

  await assert('POST /api/auth/login blocks rejected account (403 ACCOUNT_REJECTED)', async () => {
    const res = await req('POST', '/api/auth/login', {
      username: rejectUsername,
      password: 'password123'
    });
    return res.status === 403 && res.data.code === 'ACCOUNT_REJECTED';
  });

  await assert('DELETE /api/users/:id cleans up rejected test user', async () => {
    const res = await req('DELETE', `/api/users/${rejectUserId}`, null, { 'X-User-Role': 'admin' });
    return res.status === 200 && res.data.success;
  });

  console.log(`\n========================================`);
  console.log(`API TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================`);
  if (failed > 0) process.exit(1);
}

runTests();

