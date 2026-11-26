<?php
/**
 * SIMAS - REST API Router & Controllers in PHP Native
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

sendCorsHeaders();

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Normalize path: remove trailing slash except root
$path = rtrim($uri, '/');
if (empty($path)) {
    $path = '/';
}

// -------------------------------------------------------------
// 1. AUTH & USERS
// -------------------------------------------------------------
if ($path === '/api/auth/login' && $method === 'POST') {
    $body = getJsonInput();
    $username = trim($body['username'] ?? '');
    $password = trim($body['password'] ?? '');

    if (empty($username) || empty($password)) {
        jsonResponse(['success' => false, 'message' => 'Username dan kata sandi wajib diisi.'], 400);
    }

    $stmt = $pdo->prepare("
        SELECT id, username, nama, nip, email, unit, account_type, role, status, rejection_reason, avatar, created_at 
        FROM users 
        WHERE (LOWER(username) = LOWER(?) OR nip = ? OR LOWER(email) = LOWER(?)) 
          AND password = ?
    ");
    $stmt->execute([$username, $username, $username, $password]);
    $user = $stmt->fetch();

    if (!$user) {
        jsonResponse(['success' => false, 'message' => 'Username/NIP atau kata sandi tidak cocok.'], 401);
    }

    $accountStatus = strtolower($user['status'] ?? 'active');
    if ($accountStatus === 'pending') {
        jsonResponse([
            'success' => false,
            'code' => 'ACCOUNT_PENDING',
            'message' => 'Akun Anda sedang menunggu persetujuan (ACC) dari Admin Sarpras. Silakan tunggu konfirmasi Administrator.'
        ], 403);
    }

    if ($accountStatus === 'rejected') {
        $reasonText = !empty($user['rejection_reason']) ? " Alasan: {$user['rejection_reason']}" : '';
        jsonResponse([
            'success' => false,
            'code' => 'ACCOUNT_REJECTED',
            'message' => "Pendaftaran akun Anda ditolak oleh Admin Sarpras.{$reasonText}"
        ], 403);
    }

    logActivity($pdo, $user['nama'], 'Login', "Pengguna login sebagai {$user['role']}");
    jsonResponse(['success' => true, 'message' => "Selamat datang, {$user['nama']}!", 'user' => $user]);
}

if ($path === '/api/auth/register' && $method === 'POST') {
    $body = getJsonInput();
    $username = trim($body['username'] ?? '');
    $password = trim($body['password'] ?? '');
    $nama = trim($body['nama'] ?? '');
    $nip = trim($body['nip'] ?? '');
    $email = trim($body['email'] ?? '');
    $unit = trim($body['unit'] ?? '');
    $role = strtolower(trim($body['role'] ?? 'peminjam'));
    $accountType = strtolower(trim($body['account_type'] ?? 'mahasiswa'));

    if (empty($username) || empty($password) || empty($nama) || empty($email)) {
        jsonResponse(['success' => false, 'message' => 'Nama lengkap, username, email institusi, dan kata sandi wajib diisi.'], 400);
    }
    if (strlen($password) < 6) {
        jsonResponse(['success' => false, 'message' => 'Kata sandi minimal 6 karakter.'], 400);
    }
    if ($role !== 'peminjam') {
        jsonResponse([
            'success' => false,
            'message' => 'Pendaftaran mandiri hanya tersedia untuk akun Peminjam (Mahasiswa / Dosen). Akun Admin, Petugas, dan Pimpinan hanya dapat dibuat oleh Admin Sarpras.'
        ], 400);
    }
    if (!in_array($accountType, ['mahasiswa', 'dosen'], true)) {
        $accountType = 'mahasiswa';
    }
    if (empty($nip)) {
        jsonResponse([
            'success' => false,
            'message' => $accountType === 'dosen' ? 'NIP / NIDN wajib diisi untuk pendaftaran Dosen.' : 'NIM wajib diisi untuk pendaftaran Mahasiswa.'
        ], 400);
    }

    $check = $pdo->prepare("SELECT id FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)");
    $check->execute([$username, $email]);
    if ($check->fetch()) {
        jsonResponse(['success' => false, 'message' => 'Username atau email institusi sudah terdaftar di sistem.'], 409);
    }

    $defaultAvatar = $accountType === 'dosen' ? '../assets/avatar_hendro.jpg' : '../assets/avatar_bambang.jpg';
    $stmt = $pdo->prepare("
        INSERT INTO users (username, password, nama, nip, email, unit, account_type, role, status, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'peminjam', 'pending', ?)
    ");
    $stmt->execute([$username, $password, $nama, $nip, $email, $unit, $accountType, $defaultAvatar]);

    $newId = (int)$pdo->lastInsertId();
    $fetch = $pdo->prepare("
        SELECT id, username, nama, nip, email, unit, account_type, role, status, avatar, created_at
        FROM users WHERE id = ?
    ");
    $fetch->execute([$newId]);
    $created = $fetch->fetch();

    $typeLabel = $accountType === 'dosen' ? 'Dosen' : 'Mahasiswa';
    logActivity($pdo, $nama, 'Pendaftaran Akun', "Pengajuan akun Peminjam ({$typeLabel} - {$username}) menunggu ACC Admin");
    jsonResponse([
        'success' => true,
        'message' => "Pendaftaran akun Peminjam ({$typeLabel}) berhasil dikirim! Akun Anda menunggu persetujuan (ACC) Admin Sarpras sebelum dapat digunakan untuk login.",
        'data' => $created
    ], 201);
}

if ($path === '/api/users' && $method === 'GET') {
    $status = $_GET['status'] ?? '';
    $query = "SELECT id, username, nama, nip, email, unit, account_type, role, status, rejection_reason, approved_by, approved_at, avatar, created_at FROM users";
    $params = [];
    if (!empty($status)) {
        $query .= " WHERE status = ?";
        $params[] = $status;
    }
    $query .= " ORDER BY CASE WHEN status = 'pending' THEN 0 WHEN status = 'active' THEN 1 ELSE 2 END, id DESC";
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($path === '/api/users' && $method === 'POST') {
    $body = getJsonInput();
    $username = trim($body['username'] ?? '');
    $password = trim($body['password'] ?? '');
    $nama = trim($body['nama'] ?? '');
    $role = trim($body['role'] ?? '');

    if (empty($username) || empty($password) || empty($nama) || empty($role)) {
        jsonResponse(['success' => false, 'message' => 'Semua kolom wajib diisi (username, password, nama, role).'], 400);
    }

    $check = $pdo->prepare("SELECT id FROM users WHERE LOWER(username) = LOWER(?)");
    $check->execute([$username]);
    if ($check->fetch()) {
        jsonResponse(['success' => false, 'message' => 'Username sudah digunakan oleh akun lain.'], 400);
    }

    $defaultAvatar = $body['avatar'] ?? ($role === 'admin' ? '../assets/avatar_hendro.jpg' : '../assets/avatar_bambang.jpg');
    $stmt = $pdo->prepare("
        INSERT INTO users (username, password, nama, nip, email, unit, role, status, approved_by, approved_at, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'active', 'Admin Sarpras', CURRENT_TIMESTAMP, ?)
    ");
    $stmt->execute([
        $username,
        $password,
        $nama,
        $body['nip'] ?? '',
        $body['email'] ?? '',
        $body['unit'] ?? '',
        $role,
        $defaultAvatar
    ]);

    $newId = (int)$pdo->lastInsertId();
    $fetch = $pdo->prepare("SELECT id, username, nama, nip, email, unit, role, status, avatar, created_at FROM users WHERE id = ?");
    $fetch->execute([$newId]);
    $newUser = $fetch->fetch();

    logActivity($pdo, 'Admin', 'Tambah Pengguna', "Menambahkan pengguna baru: {$nama} ({$role})");
    jsonResponse(['success' => true, 'message' => 'Pengguna baru berhasil ditambahkan.', 'data' => $newUser], 201);
}

if ($path === '/api/users/pending' && $method === 'GET') {
    $stmt = $pdo->query("
        SELECT id, username, nama, nip, email, unit, account_type, role, status, avatar, created_at
        FROM users
        WHERE status = 'pending'
        ORDER BY id DESC
    ");
    $pendingUsers = $stmt->fetchAll();
    jsonResponse(['success' => true, 'count' => count($pendingUsers), 'data' => $pendingUsers]);
}

if (preg_match('#^/api/users/(\d+)/approve$#', $path, $matches) && $method === 'PUT') {
    $body = getJsonInput();
    $actorRole = strtolower(trim($_SERVER['HTTP_X_USER_ROLE'] ?? ($body['actor_role'] ?? '')));
    if ($actorRole !== 'admin') {
        jsonResponse([
            'success' => false,
            'message' => 'Akses ditolak: Hanya Admin Sarpras yang berwenang melakukan ACC pendaftaran akun.'
        ], 403);
    }

    $id = (int)$matches[1];
    $userStmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $userStmt->execute([$id]);
    $user = $userStmt->fetch();
    if (!$user) {
        jsonResponse(['success' => false, 'message' => 'Pendaftaran akun tidak ditemukan.'], 404);
    }

    $allowedRoles = ['admin', 'petugas', 'pimpinan', 'peminjam'];
    $finalRole = (!empty($body['role']) && in_array($body['role'], $allowedRoles, true)) ? $body['role'] : $user['role'];
    $approver = !empty($body['approved_by']) ? trim($body['approved_by']) : 'Admin Sarpras';

    $update = $pdo->prepare("
        UPDATE users
        SET status = 'active', role = ?, rejection_reason = '', approved_by = ?, approved_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ");
    $update->execute([$finalRole, $approver, $id]);

    $fetch = $pdo->prepare("
        SELECT id, username, nama, nip, email, unit, role, status, approved_by, approved_at, avatar, created_at
        FROM users WHERE id = ?
    ");
    $fetch->execute([$id]);
    $updated = $fetch->fetch();

    logActivity($pdo, $approver, 'ACC Pendaftaran Akun', "Menyetujui & mengaktifkan akun {$updated['nama']} (@{$updated['username']}) sebagai {$updated['role']}");
    jsonResponse([
        'success' => true,
        'message' => "Akun {$updated['nama']} (@{$updated['username']}) berhasil di-ACC dan sekarang aktif!",
        'data' => $updated
    ]);
}

if (preg_match('#^/api/users/(\d+)/reject$#', $path, $matches) && $method === 'PUT') {
    $body = getJsonInput();
    $actorRole = strtolower(trim($_SERVER['HTTP_X_USER_ROLE'] ?? ($body['actor_role'] ?? '')));
    if ($actorRole !== 'admin') {
        jsonResponse([
            'success' => false,
            'message' => 'Akses ditolak: Hanya Admin Sarpras yang berwenang menolak pendaftaran akun.'
        ], 403);
    }

    $id = (int)$matches[1];
    $userStmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $userStmt->execute([$id]);
    $user = $userStmt->fetch();
    if (!$user) {
        jsonResponse(['success' => false, 'message' => 'Pendaftaran akun tidak ditemukan.'], 404);
    }

    $reason = !empty($body['reason']) ? trim($body['reason']) : 'Data identitas belum terverifikasi oleh Admin Sarpras.';
    $approver = !empty($body['approved_by']) ? trim($body['approved_by']) : 'Admin Sarpras';

    $update = $pdo->prepare("
        UPDATE users
        SET status = 'rejected', rejection_reason = ?, approved_by = ?, approved_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ");
    $update->execute([$reason, $approver, $id]);

    $fetch = $pdo->prepare("
        SELECT id, username, nama, nip, email, unit, role, status, rejection_reason, approved_by, approved_at, avatar, created_at
        FROM users WHERE id = ?
    ");
    $fetch->execute([$id]);
    $updated = $fetch->fetch();

    logActivity($pdo, $approver, 'Tolak Pendaftaran Akun', "Menolak pendaftaran akun {$updated['nama']} (@{$updated['username']}). Alasan: {$reason}");
    jsonResponse([
        'success' => true,
        'message' => "Pendaftaran akun {$updated['nama']} telah ditolak.",
        'data' => $updated
    ]);
}

if (preg_match('#^/api/users/(\d+)$#', $path, $matches)) {
    $id = (int)$matches[1];

    if ($method === 'PUT') {
        $body = getJsonInput();
        $userStmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $userStmt->execute([$id]);
        $user = $userStmt->fetch();
        if (!$user) {
            jsonResponse(['success' => false, 'message' => 'Pengguna tidak ditemukan.'], 404);
        }

        $nama = $body['nama'] ?? $user['nama'];
        $nip = $body['nip'] ?? $user['nip'];
        $email = $body['email'] ?? $user['email'];
        $role = $body['role'] ?? $user['role'];
        $password = !empty($body['password']) ? trim($body['password']) : $user['password'];
        $avatar = $body['avatar'] ?? $user['avatar'];

        $update = $pdo->prepare("
            UPDATE users 
            SET nama = ?, nip = ?, email = ?, role = ?, password = ?, avatar = ?
            WHERE id = ?
        ");
        $update->execute([$nama, $nip, $email, $role, $password, $avatar, $id]);

        $fetch = $pdo->prepare("SELECT id, username, nama, nip, email, role, avatar, created_at FROM users WHERE id = ?");
        $fetch->execute([$id]);
        $updatedUser = $fetch->fetch();

        logActivity($pdo, 'Admin', 'Ubah Pengguna', "Memperbarui akun pengguna ID {$id}: {$nama}");
        jsonResponse(['success' => true, 'message' => 'Data pengguna berhasil diperbarui.', 'data' => $updatedUser]);
    }

    if ($method === 'DELETE') {
        $userStmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $userStmt->execute([$id]);
        $user = $userStmt->fetch();
        if (!$user) {
            jsonResponse(['success' => false, 'message' => 'Pengguna tidak ditemukan.'], 404);
        }

        $del = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $del->execute([$id]);

        logActivity($pdo, 'Admin', 'Hapus Pengguna', "Menghapus akun pengguna ID {$id}: {$user['username']}");
        jsonResponse(['success' => true, 'message' => "Akun {$user['username']} berhasil dihapus."]);
    }
}

// -------------------------------------------------------------
// 2. ASSETS CRUD
// -------------------------------------------------------------
if ($path === '/api/assets' && $method === 'GET') {
    $search = $_GET['search'] ?? '';
    $category = $_GET['category'] ?? '';
    $condition = $_GET['condition'] ?? '';
    $status = $_GET['status'] ?? '';
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;

    $query = "SELECT * FROM assets WHERE 1=1";
    $params = [];

    if (!empty($search)) {
        $query .= " AND (LOWER(nama) LIKE ? OR LOWER(nup) LIKE ? OR LOWER(kode) LIKE ? OR LOWER(lokasi) LIKE ?)";
        $s = '%' . strtolower(trim($search)) . '%';
        $params[] = $s;
        $params[] = $s;
        $params[] = $s;
        $params[] = $s;
    }

    if (!empty($category) && $category !== 'all') {
        $query .= " AND (LOWER(kategori_nama) LIKE ? OR kategori_id = ?)";
        $params[] = '%' . strtolower($category) . '%';
        $params[] = is_numeric($category) ? (int)$category : -1;
    }

    if (!empty($condition) && $condition !== 'all') {
        $query .= " AND LOWER(kondisi) = LOWER(?)";
        $params[] = $condition;
    }

    if (!empty($status) && $status !== 'all') {
        $query .= " AND LOWER(status) = LOWER(?)";
        $params[] = $status;
    }

    $query .= " ORDER BY id DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $allAssets = $stmt->fetchAll();
    $total = count($allAssets);

    $pagedData = $allAssets;
    if ($limit !== null && $limit > 0) {
        $offset = ($page - 1) * $limit;
        $pagedData = array_slice($allAssets, $offset, $limit);
    }

    jsonResponse(['success' => true, 'total' => $total, 'data' => $pagedData]);
}

if ($path === '/api/assets' && $method === 'POST') {
    $body = getJsonInput();
    $nama = trim($body['nama'] ?? '');
    if (empty($nama)) {
        jsonResponse(['success' => false, 'message' => 'Nama aset wajib diisi.'], 400);
    }

    $tahun = $body['tahun'] ?? '2025';
    $generatedNup = $body['nup'] ?? ('SAR/' . $tahun . '/' . mt_rand(1000, 9999));
    $chkNup = $pdo->prepare("SELECT id FROM assets WHERE nup = ?");
    $chkNup->execute([$generatedNup]);
    if ($chkNup->fetch()) {
        $generatedNup = 'SAR/' . $tahun . '/' . substr((string)time(), -4) . mt_rand(10, 99);
    }
    $generatedKode = $body['kode'] ?? ('AST-' . mt_rand(1000, 9999));
    $defaultFoto = $body['foto'] ?? '../assets/laptop.jpg';
    $serial = $body['serial'] ?? ('SN-' . substr((string)time(), -6));

    $stmt = $pdo->prepare("
        INSERT INTO assets (nup, nama, kode, kategori_id, kategori_nama, lokasi, gedung, pic, pic_nip, kondisi, status, tahun, nilai, foto, serial, desc)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $generatedNup,
        $nama,
        $generatedKode,
        $body['kategori_id'] ?? 1,
        $body['kategori_nama'] ?? 'Elektronik & Multimedia',
        $body['lokasi'] ?? 'Gedung Rektorat Lt. 1',
        $body['gedung'] ?? 'Gedung Rektorat (Pusat)',
        $body['pic'] ?? 'Petugas Sarpras',
        $body['pic_nip'] ?? '198403152008121002',
        $body['kondisi'] ?? 'Baik',
        $body['status'] ?? 'Tersedia',
        $tahun,
        (int)($body['nilai'] ?? 0),
        $defaultFoto,
        $serial,
        $body['desc'] ?? ''
    ]);

    $newId = (int)$pdo->lastInsertId();
    $fetch = $pdo->prepare("SELECT * FROM assets WHERE id = ?");
    $fetch->execute([$newId]);
    $newAsset = $fetch->fetch();

    logActivity($pdo, 'Admin/Petugas', 'Tambah Aset', "Menambahkan aset: {$nama} ({$generatedNup})");
    jsonResponse(['success' => true, 'message' => 'Aset berhasil didaftarkan ke inventaris.', 'data' => $newAsset], 201);
}

if (preg_match('#^/api/assets/(\d+)$#', $path, $matches)) {
    $id = (int)$matches[1];

    if ($method === 'GET') {
        $stmt = $pdo->prepare("SELECT * FROM assets WHERE id = ?");
        $stmt->execute([$id]);
        $asset = $stmt->fetch();
        if (!$asset) {
            jsonResponse(['success' => false, 'message' => 'Aset tidak ditemukan.'], 404);
        }
        jsonResponse(['success' => true, 'data' => $asset]);
    }

    if ($method === 'PUT') {
        $body = getJsonInput();
        $stmt = $pdo->prepare("SELECT * FROM assets WHERE id = ?");
        $stmt->execute([$id]);
        $asset = $stmt->fetch();
        if (!$asset) {
            jsonResponse(['success' => false, 'message' => 'Aset tidak ditemukan.'], 404);
        }

        $fields = ['nama', 'kode', 'kategori_id', 'kategori_nama', 'lokasi', 'gedung', 'pic', 'pic_nip', 'kondisi', 'status', 'tahun', 'nilai', 'foto', 'serial', 'desc'];
        $updates = [];
        foreach ($fields as $f) {
            $updates[$f] = array_key_exists($f, $body) ? $body[$f] : $asset[$f];
        }

        $updateStmt = $pdo->prepare("
            UPDATE assets 
            SET nama = ?, kode = ?, kategori_id = ?, kategori_nama = ?, lokasi = ?, gedung = ?, pic = ?, pic_nip = ?, kondisi = ?, status = ?, tahun = ?, nilai = ?, foto = ?, serial = ?, desc = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ");
        $updateStmt->execute([
            $updates['nama'],
            $updates['kode'],
            $updates['kategori_id'],
            $updates['kategori_nama'],
            $updates['lokasi'],
            $updates['gedung'],
            $updates['pic'],
            $updates['pic_nip'],
            $updates['kondisi'],
            $updates['status'],
            $updates['tahun'],
            (int)$updates['nilai'],
            $updates['foto'],
            $updates['serial'],
            $updates['desc'],
            $id
        ]);

        $fetch = $pdo->prepare("SELECT * FROM assets WHERE id = ?");
        $fetch->execute([$id]);
        $updatedAsset = $fetch->fetch();

        logActivity($pdo, 'Admin/Petugas', 'Ubah Aset', "Memperbarui data aset: {$updates['nama']} (ID {$id})");
        jsonResponse(['success' => true, 'message' => 'Data aset berhasil diperbarui.', 'data' => $updatedAsset]);
    }

    if ($method === 'DELETE') {
        $stmt = $pdo->prepare("SELECT * FROM assets WHERE id = ?");
        $stmt->execute([$id]);
        $asset = $stmt->fetch();
        if (!$asset) {
            jsonResponse(['success' => false, 'message' => 'Aset tidak ditemukan.'], 404);
        }

        $del = $pdo->prepare("DELETE FROM assets WHERE id = ?");
        $del->execute([$id]);

        logActivity($pdo, 'Admin', 'Hapus Aset', "Menghapus aset: {$asset['nama']} ({$asset['nup']})");
        jsonResponse(['success' => true, 'message' => "Aset {$asset['nama']} berhasil dihapus dari inventaris."]);
    }
}

// -------------------------------------------------------------
// 3. CATEGORIES CRUD
// -------------------------------------------------------------
if ($path === '/api/categories' && $method === 'GET') {
    $stmt = $pdo->query("
        SELECT c.*, COUNT(a.id) as asset_count 
        FROM categories c 
        LEFT JOIN assets a ON a.kategori_id = c.id OR a.kategori_nama = c.nama
        GROUP BY c.id
        ORDER BY c.id ASC
    ");
    $categories = $stmt->fetchAll();
    foreach ($categories as &$cat) {
        $cat['asset_count'] = (int)$cat['asset_count'];
    }
    jsonResponse(['success' => true, 'data' => $categories]);
}

if ($path === '/api/categories' && $method === 'POST') {
    $body = getJsonInput();
    $kode = trim($body['kode'] ?? '');
    $nama = trim($body['nama'] ?? '');

    if (empty($kode) || empty($nama)) {
        jsonResponse(['success' => false, 'message' => 'Kode dan nama kategori wajib diisi.'], 400);
    }

    $stmt = $pdo->prepare("
        INSERT INTO categories (kode, nama, icon, desc, susut, color)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $kode,
        $nama,
        $body['icon'] ?? 'archive',
        $body['desc'] ?? '',
        $body['susut'] ?? '5 Tahun',
        $body['color'] ?? 'blue'
    ]);

    $newId = (int)$pdo->lastInsertId();
    $fetch = $pdo->prepare("SELECT * FROM categories WHERE id = ?");
    $fetch->execute([$newId]);
    $newCat = $fetch->fetch();

    logActivity($pdo, 'Admin/Petugas', 'Tambah Kategori', "Menambahkan kategori: {$nama}");
    jsonResponse(['success' => true, 'message' => 'Kategori baru berhasil ditambahkan.', 'data' => $newCat], 201);
}

if (preg_match('#^/api/categories/(\d+)$#', $path, $matches)) {
    $id = (int)$matches[1];

    if ($method === 'PUT') {
        $body = getJsonInput();
        $stmt = $pdo->prepare("SELECT * FROM categories WHERE id = ?");
        $stmt->execute([$id]);
        $cat = $stmt->fetch();
        if (!$cat) {
            jsonResponse(['success' => false, 'message' => 'Kategori tidak ditemukan.'], 404);
        }

        $nama = $body['nama'] ?? $cat['nama'];
        $icon = $body['icon'] ?? $cat['icon'];
        $desc = array_key_exists('desc', $body) ? $body['desc'] : $cat['desc'];
        $susut = $body['susut'] ?? $cat['susut'];
        $color = $body['color'] ?? $cat['color'];

        $update = $pdo->prepare("
            UPDATE categories 
            SET nama = ?, icon = ?, desc = ?, susut = ?, color = ?
            WHERE id = ?
        ");
        $update->execute([$nama, $icon, $desc, $susut, $color, $id]);

        $fetch = $pdo->prepare("SELECT * FROM categories WHERE id = ?");
        $fetch->execute([$id]);
        $updatedCat = $fetch->fetch();

        jsonResponse(['success' => true, 'message' => 'Kategori berhasil diperbarui.', 'data' => $updatedCat]);
    }

    if ($method === 'DELETE') {
        $del = $pdo->prepare("DELETE FROM categories WHERE id = ?");
        $del->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Kategori berhasil dihapus.']);
    }
}

// -------------------------------------------------------------
// 4. LOCATIONS & BUILDINGS
// -------------------------------------------------------------
if ($path === '/api/buildings' && $method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM buildings ORDER BY id ASC");
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($path === '/api/buildings' && $method === 'POST') {
    $body = getJsonInput();
    $nama = trim($body['nama'] ?? '');
    if (empty($nama)) {
        jsonResponse(['success' => false, 'message' => 'Nama gedung wajib diisi.'], 400);
    }
    $kode = trim($body['kode'] ?? ('GD-' . mt_rand(100, 999)));
    $chk = $pdo->prepare("SELECT id FROM buildings WHERE LOWER(kode) = LOWER(?)");
    $chk->execute([$kode]);
    if ($chk->fetch()) {
        $kode .= '-' . mt_rand(10, 99);
    }
    $stmt = $pdo->prepare("INSERT INTO buildings (kode, nama, tipe, jumlah_lantai, pic) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$kode, $nama, $body['tipe'] ?? 'Fakultas', (int)($body['jumlah_lantai'] ?? 3), $body['pic'] ?? 'Petugas Sarpras']);
    $newId = (int)$pdo->lastInsertId();
    $fetch = $pdo->prepare("SELECT * FROM buildings WHERE id = ?");
    $fetch->execute([$newId]);
    jsonResponse(['success' => true, 'message' => 'Gedung baru berhasil ditambahkan.', 'data' => $fetch->fetch()], 201);
}

if ($path === '/api/locations' && $method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM locations ORDER BY id ASC");
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($path === '/api/locations' && $method === 'POST') {
    $body = getJsonInput();
    $kode = trim($body['kode'] ?? $body['code'] ?? '');
    $nama = trim($body['nama'] ?? $body['title'] ?? '');
    $gedungKode = $body['gedung_kode'] ?? $body['building'] ?? '';
    $lantai = $body['lantai'] ?? $body['floor'] ?? '';
    $kapasitas = $body['kapasitas'] ?? $body['capacity'] ?? '20 Orang';

    if (empty($kode) || empty($nama)) {
        jsonResponse(['success' => false, 'message' => 'Kode dan nama ruangan wajib diisi.'], 400);
    }

    $chk = $pdo->prepare("SELECT * FROM locations WHERE LOWER(kode) = LOWER(?)");
    $chk->execute([$kode]);
    $existingLoc = $chk->fetch();
    if ($existingLoc) {
        $upd = $pdo->prepare("UPDATE locations SET nama = ?, gedung_kode = ?, lantai = ?, kapasitas = ?, luas = ?, kondisi = ?, status = ? WHERE id = ?");
        $upd->execute([
            $nama,
            !empty($gedungKode) ? $gedungKode : ($existingLoc['gedung_kode'] ?? ''),
            !empty($lantai) ? $lantai : ($existingLoc['lantai'] ?? ''),
            $kapasitas ?: ($existingLoc['kapasitas'] ?? '20 Orang'),
            $body['luas'] ?? $existingLoc['luas'] ?? '50 m²',
            $body['kondisi'] ?? $existingLoc['kondisi'] ?? 'Baik',
            $body['status'] ?? $existingLoc['status'] ?? 'Tersedia',
            $existingLoc['id']
        ]);
        $fetch = $pdo->prepare("SELECT * FROM locations WHERE id = ?");
        $fetch->execute([$existingLoc['id']]);
        jsonResponse(['success' => true, 'message' => 'Data ruangan berhasil diperbarui.', 'data' => $fetch->fetch()], 200);
    }

    $stmt = $pdo->prepare("
        INSERT INTO locations (kode, nama, gedung_kode, lantai, kapasitas, luas, kondisi, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $kode,
        $nama,
        $gedungKode,
        $lantai,
        $kapasitas,
        $body['luas'] ?? '50 m²',
        $body['kondisi'] ?? 'Baik',
        $body['status'] ?? 'Tersedia'
    ]);

    $newId = (int)$pdo->lastInsertId();
    $fetch = $pdo->prepare("SELECT * FROM locations WHERE id = ?");
    $fetch->execute([$newId]);
    $newLoc = $fetch->fetch();

    jsonResponse(['success' => true, 'message' => 'Ruangan baru berhasil didaftarkan.', 'data' => $newLoc], 201);
}

if (preg_match('#^/api/locations/([^/]+)$#', $path, $matches)) {
    $param = $matches[1];
    $locStmt = ctype_digit($param)
        ? $pdo->prepare("SELECT * FROM locations WHERE id = ?")
        : $pdo->prepare("SELECT * FROM locations WHERE LOWER(kode) = LOWER(?)");
    $locStmt->execute([ctype_digit($param) ? (int)$param : $param]);
    $loc = $locStmt->fetch();

    if ($method === 'PUT') {
        if (!$loc) {
            jsonResponse(['success' => false, 'message' => 'Ruangan tidak ditemukan.'], 404);
        }
        $body = getJsonInput();
        $upd = $pdo->prepare("UPDATE locations SET kode = ?, nama = ?, gedung_kode = ?, lantai = ?, kapasitas = ?, luas = ?, kondisi = ?, status = ? WHERE id = ?");
        $upd->execute([
            $body['kode'] ?? $body['code'] ?? $loc['kode'],
            $body['nama'] ?? $body['title'] ?? $loc['nama'],
            $body['gedung_kode'] ?? $body['building'] ?? $loc['gedung_kode'],
            $body['lantai'] ?? $body['floor'] ?? $loc['lantai'],
            $body['kapasitas'] ?? $body['capacity'] ?? $loc['kapasitas'],
            $body['luas'] ?? $loc['luas'],
            $body['kondisi'] ?? $loc['kondisi'],
            $body['status'] ?? $loc['status'],
            $loc['id']
        ]);
        $fetch = $pdo->prepare("SELECT * FROM locations WHERE id = ?");
        $fetch->execute([$loc['id']]);
        jsonResponse(['success' => true, 'message' => 'Data ruangan berhasil diperbarui.', 'data' => $fetch->fetch()]);
    }

    if ($method === 'DELETE') {
        if (!$loc) {
            jsonResponse(['success' => false, 'message' => 'Ruangan tidak ditemukan.'], 404);
        }
        $pdo->prepare("DELETE FROM locations WHERE id = ?")->execute([$loc['id']]);
        jsonResponse(['success' => true, 'message' => 'Ruangan berhasil dihapus.']);
    }
}

// -------------------------------------------------------------
// 5. EMPLOYEES CRUD
// -------------------------------------------------------------
if ($path === '/api/employees' && $method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM employees ORDER BY id ASC");
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($path === '/api/employees' && $method === 'POST') {
    $body = getJsonInput();
    $nip = trim($body['nip'] ?? '');
    $nama = trim($body['nama'] ?? '');

    if (empty($nip) || empty($nama)) {
        jsonResponse(['success' => false, 'message' => 'NIP dan nama pegawai wajib diisi.'], 400);
    }

    $stmt = $pdo->prepare("
        INSERT INTO employees (nip, nama, unit_kerja, jabatan, email, telepon, status_aset)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $nip,
        $nama,
        $body['unit_kerja'] ?? '',
        $body['jabatan'] ?? '',
        $body['email'] ?? '',
        $body['telepon'] ?? '',
        $body['status_aset'] ?? '0 Aset Dikelola'
    ]);

    $newId = (int)$pdo->lastInsertId();
    $fetch = $pdo->prepare("SELECT * FROM employees WHERE id = ?");
    $fetch->execute([$newId]);
    $newEmp = $fetch->fetch();

    logActivity($pdo, 'Admin', 'Tambah Pegawai', "Menambahkan pegawai baru: {$nama} ({$nip})");
    jsonResponse(['success' => true, 'message' => 'Data pegawai berhasil ditambahkan.', 'data' => $newEmp], 201);
}

if (preg_match('#^/api/employees/(\d+)$#', $path, $matches)) {
    $id = (int)$matches[1];

    if ($method === 'PUT') {
        $body = getJsonInput();
        $stmt = $pdo->prepare("SELECT * FROM employees WHERE id = ?");
        $stmt->execute([$id]);
        $emp = $stmt->fetch();
        if (!$emp) {
            jsonResponse(['success' => false, 'message' => 'Pegawai tidak ditemukan.'], 404);
        }

        $nama = $body['nama'] ?? $emp['nama'];
        $unit_kerja = $body['unit_kerja'] ?? $emp['unit_kerja'];
        $jabatan = $body['jabatan'] ?? $emp['jabatan'];
        $email = $body['email'] ?? $emp['email'];
        $telepon = $body['telepon'] ?? $emp['telepon'];
        $status_aset = $body['status_aset'] ?? $emp['status_aset'];

        $update = $pdo->prepare("
            UPDATE employees 
            SET nama = ?, unit_kerja = ?, jabatan = ?, email = ?, telepon = ?, status_aset = ?
            WHERE id = ?
        ");
        $update->execute([$nama, $unit_kerja, $jabatan, $email, $telepon, $status_aset, $id]);

        $fetch = $pdo->prepare("SELECT * FROM employees WHERE id = ?");
        $fetch->execute([$id]);
        $updatedEmp = $fetch->fetch();

        jsonResponse(['success' => true, 'message' => 'Data pegawai berhasil diperbarui.', 'data' => $updatedEmp]);
    }

    if ($method === 'DELETE') {
        $del = $pdo->prepare("DELETE FROM employees WHERE id = ?");
        $del->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Data pegawai berhasil dihapus.']);
    }
}

// -------------------------------------------------------------
// 6. LOANS & RESERVATIONS
// -------------------------------------------------------------
if ($path === '/api/loans' && $method === 'GET') {
    $status = $_GET['status'] ?? '';
    $user_id = $_GET['user_id'] ?? '';

    $q = "SELECT * FROM loans WHERE 1=1";
    $params = [];

    if (!empty($status)) {
        $q .= " AND LOWER(status) = LOWER(?)";
        $params[] = $status;
    }
    if (!empty($user_id)) {
        $q .= " AND user_id = ?";
        $params[] = (int)$user_id;
    }

    $q .= " ORDER BY id DESC";
    $stmt = $pdo->prepare($q);
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($path === '/api/loans' && $method === 'POST') {
    $body = getJsonInput();
    $assetId = $body['asset_id'] ?? null;

    $assetName = $body['asset_nama'] ?? 'Aset Sarpras';
    if ($assetId) {
        $astStmt = $pdo->prepare("SELECT nama FROM assets WHERE id = ?");
        $astStmt->execute([(int)$assetId]);
        $ast = $astStmt->fetch();
        if ($ast) {
            $assetName = $ast['nama'];
        }
    }

    $loanKode = 'PINJAM-' . date('Y') . '-' . mt_rand(1000, 9999);
    $peminjamNama = $body['peminjam_nama'] ?? 'Ahmad Fauzi';
    $peminjamNip = $body['peminjam_nip'] ?? '2021510045';
    $userId = (int)($body['user_id'] ?? 4);
    $keperluan = $body['keperluan'] ?? 'Kegiatan Akademik Institusi';
    $tglPinjam = $body['tgl_pinjam'] ?? date('Y-m-d');
    $tglKembali = $body['tgl_kembali'] ?? date('Y-m-d', strtotime('+7 days'));

    $stmt = $pdo->prepare("
        INSERT INTO loans (kode, asset_id, asset_nama, user_id, peminjam_nama, peminjam_nip, keperluan, tgl_pinjam, tgl_kembali, status, catatan)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $loanKode,
        $assetId ? (int)$assetId : null,
        $assetName,
        $userId,
        $peminjamNama,
        $peminjamNip,
        $keperluan,
        $tglPinjam,
        $tglKembali,
        'Menunggu Approval',
        'Menunggu otorisasi pimpinan / petugas'
    ]);

    $newId = (int)$pdo->lastInsertId();
    logActivity($pdo, $peminjamNama, 'Ajukan Pinjaman', "Mengajukan peminjaman: {$assetName} ({$loanKode})");
    jsonResponse([
        'success' => true,
        'message' => "Permohonan peminjaman {$loanKode} berhasil dikirim!",
        'data' => ['id' => $newId, 'kode' => $loanKode]
    ], 201);
}

if (preg_match('#^/api/loans/(\d+)/approve$#', $path, $matches) && $method === 'PUT') {
    $id = (int)$matches[1];
    $body = getJsonInput();
    $approvedBy = $body['approved_by'] ?? 'Pimpinan / Admin';

    $stmt = $pdo->prepare("SELECT * FROM loans WHERE id = ?");
    $stmt->execute([$id]);
    $loan = $stmt->fetch();
    if (!$loan) {
        jsonResponse(['success' => false, 'message' => 'Data pinjaman tidak ditemukan.'], 404);
    }

    $update = $pdo->prepare("
        UPDATE loans 
        SET status = 'Aktif', approved_by = ?, approved_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ");
    $update->execute([$approvedBy, $id]);

    if (!empty($loan['asset_id'])) {
        $pdo->prepare("UPDATE assets SET status = 'Dipinjam' WHERE id = ?")->execute([(int)$loan['asset_id']]);
    }

    logActivity($pdo, $approvedBy, 'Setujui Peminjaman', "Menyetujui peminjaman {$loan['kode']}");
    jsonResponse(['success' => true, 'message' => "Peminjaman {$loan['kode']} berhasil disetujui!"]);
}

if (preg_match('#^/api/loans/(\d+)/reject$#', $path, $matches) && $method === 'PUT') {
    $id = (int)$matches[1];
    $body = getJsonInput();
    $reason = $body['reason'] ?? 'Pengajuan ditolak oleh pimpinan.';
    $rejectedBy = $body['rejected_by'] ?? 'Pimpinan';

    $stmt = $pdo->prepare("SELECT * FROM loans WHERE id = ?");
    $stmt->execute([$id]);
    $loan = $stmt->fetch();
    if (!$loan) {
        jsonResponse(['success' => false, 'message' => 'Data pinjaman tidak ditemukan.'], 404);
    }

    $update = $pdo->prepare("
        UPDATE loans 
        SET status = 'Ditolak', catatan = ?
        WHERE id = ?
    ");
    $update->execute([$reason, $id]);

    logActivity($pdo, $rejectedBy, 'Tolak Peminjaman', "Menolak peminjaman {$loan['kode']}: {$reason}");
    jsonResponse(['success' => true, 'message' => "Peminjaman {$loan['kode']} telah ditolak."]);
}

if (preg_match('#^/api/loans/(\d+)/return$#', $path, $matches) && $method === 'PUT') {
    $id = (int)$matches[1];
    $stmt = $pdo->prepare("SELECT * FROM loans WHERE id = ?");
    $stmt->execute([$id]);
    $loan = $stmt->fetch();
    if (!$loan) {
        jsonResponse(['success' => false, 'message' => 'Data pinjaman tidak ditemukan.'], 404);
    }

    $pdo->prepare("UPDATE loans SET status = 'Selesai' WHERE id = ?")->execute([$id]);
    if (!empty($loan['asset_id'])) {
        $pdo->prepare("UPDATE assets SET status = 'Tersedia' WHERE id = ?")->execute([(int)$loan['asset_id']]);
    }

    logActivity($pdo, $loan['peminjam_nama'], 'Pengembalian Aset', "Aset {$loan['asset_nama']} ({$loan['kode']}) telah dikembalikan.");
    jsonResponse(['success' => true, 'message' => "Pengembalian aset {$loan['asset_nama']} berhasil dicatat!"]);
}

if (preg_match('#^/api/loans/(\d+)/request-return$#', $path, $matches) && $method === 'PUT') {
    $id = (int)$matches[1];
    $body = getJsonInput();

    $stmt = $pdo->prepare("SELECT * FROM loans WHERE id = ?");
    $stmt->execute([$id]);
    $loan = $stmt->fetch();
    if (!$loan) {
        jsonResponse(['success' => false, 'message' => 'Data pinjaman tidak ditemukan.'], 404);
    }

    $catatan = trim($body['catatan'] ?? '');
    $noteText = $catatan !== ''
        ? "Pengajuan pengembalian: {$catatan}"
        : 'Peminjam mengajukan pengembalian. Menunggu verifikasi fisik Petugas Sarpras.';

    $update = $pdo->prepare("UPDATE loans SET status = 'Verifikasi Kembali', catatan = ? WHERE id = ?");
    $update->execute([$noteText, $id]);

    $requestedBy = !empty($body['requested_by']) ? trim($body['requested_by']) : $loan['peminjam_nama'];
    logActivity($pdo, $requestedBy, 'Ajukan Pengembalian', "Mengajukan pengembalian {$loan['asset_nama']} ({$loan['kode']})");
    jsonResponse([
        'success' => true,
        'message' => "Pengembalian {$loan['asset_nama']} diajukan! Menunggu verifikasi Petugas Sarpras."
    ]);
}

if (preg_match('#^/api/loans/(\d+)$#', $path, $matches) && $method === 'PUT') {
    $id = (int)$matches[1];
    $body = getJsonInput();

    $stmt = $pdo->prepare("SELECT * FROM loans WHERE id = ?");
    $stmt->execute([$id]);
    $loan = $stmt->fetch();
    if (!$loan) {
        jsonResponse(['success' => false, 'message' => 'Data pinjaman tidak ditemukan.'], 404);
    }

    $newTglPinjam = $body['tgl_pinjam'] ?? $loan['tgl_pinjam'];
    $newTglKembali = $body['tgl_kembali'] ?? $loan['tgl_kembali'];
    $newKeperluan = array_key_exists('keperluan', $body) ? $body['keperluan'] : $loan['keperluan'];
    $newStatus = $body['status'] ?? $loan['status'];

    $update = $pdo->prepare("
        UPDATE loans
        SET tgl_pinjam = ?, tgl_kembali = ?, keperluan = ?, status = ?
        WHERE id = ?
    ");
    $update->execute([$newTglPinjam, $newTglKembali, $newKeperluan, $newStatus, $id]);

    logActivity($pdo, 'Petugas Sarpras', 'Ubah Jadwal Peminjaman', "Memperbarui jadwal pinjaman {$loan['kode']}: {$newTglPinjam} s/d {$newTglKembali}");

    $fetch = $pdo->prepare("SELECT * FROM loans WHERE id = ?");
    $fetch->execute([$id]);
    $updatedLoan = $fetch->fetch();

    jsonResponse(['success' => true, 'message' => "Jadwal peminjaman {$loan['kode']} berhasil diperbarui!", 'data' => $updatedLoan]);
}

// -------------------------------------------------------------
// 7. APPROVALS (ANTREAN)
// -------------------------------------------------------------
if ($path === '/api/approvals' && $method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM approvals ORDER BY is_urgent DESC, id DESC");
    $approvals = $stmt->fetchAll();
    foreach ($approvals as &$appv) {
        $appv['is_urgent'] = (int)$appv['is_urgent'];
    }
    jsonResponse(['success' => true, 'data' => $approvals]);
}

if (preg_match('#^/api/approvals/(\d+)/approve$#', $path, $matches) && $method === 'PUT') {
    $id = (int)$matches[1];
    $pdo->prepare("UPDATE approvals SET status = 'Disetujui' WHERE id = ?")->execute([$id]);
    logActivity($pdo, 'Pimpinan', 'Setujui Antrean', "Menyetujui permohonan antrean ID {$id}");
    jsonResponse(['success' => true, 'message' => 'Permohonan berhasil disetujui & izin digital diterbitkan.']);
}

if (preg_match('#^/api/approvals/(\d+)/reject$#', $path, $matches) && $method === 'PUT') {
    $id = (int)$matches[1];
    $pdo->prepare("UPDATE approvals SET status = 'Ditolak' WHERE id = ?")->execute([$id]);
    logActivity($pdo, 'Pimpinan', 'Tolak Antrean', "Menolak permohonan antrean ID {$id}");
    jsonResponse(['success' => true, 'message' => 'Permohonan telah ditolak.']);
}

if (preg_match('#^/api/approvals/(\d+)/revision$#', $path, $matches) && $method === 'PUT') {
    $id = (int)$matches[1];
    $body = getJsonInput();
    $notes = $body['notes'] ?? '';
    $waitingFor = !empty($notes) ? "Revisi: {$notes}" : 'Menunggu Revisi Pemohon';
    $pdo->prepare("UPDATE approvals SET status = 'Revisi Diminta', waiting_for = ? WHERE id = ?")->execute([$waitingFor, $id]);
    logActivity($pdo, 'Pimpinan', 'Minta Revisi Antrean', "Meminta revisi permohonan antrean ID {$id}");
    jsonResponse(['success' => true, 'message' => 'Permintaan revisi berkas telah dikirim ke pemohon.']);
}

// -------------------------------------------------------------
// 8. TICKETS (MAINTENANCE KANBAN)
// -------------------------------------------------------------
if ($path === '/api/tickets' && $method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM tickets ORDER BY id DESC");
    $tickets = $stmt->fetchAll();
    foreach ($tickets as &$t) {
        $t['cost'] = (int)$t['cost'];
    }
    jsonResponse(['success' => true, 'data' => $tickets]);
}

if ($path === '/api/tickets' && $method === 'POST') {
    $body = getJsonInput();
    $title = trim($body['title'] ?? '');
    if (empty($title)) {
        jsonResponse(['success' => false, 'message' => 'Judul tiket pemeliharaan wajib diisi.'], 400);
    }

    $kode = 'TKT-0' . mt_rand(100, 899);
    $cost = (int)($body['cost'] ?? 0);

    $stmt = $pdo->prepare("
        INSERT INTO tickets (kode, title, location, gedung, priority, category, reporter, tech_name, status, desc, cost)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $kode,
        $title,
        $body['location'] ?? 'Ruang Publik',
        $body['gedung'] ?? 'Gedung Rektorat (Pusat)',
        $body['priority'] ?? 'NORMAL',
        $body['category'] ?? 'Umum',
        $body['reporter'] ?? 'Petugas Sarpras',
        $body['tech_name'] ?? 'Joko Supriyanto',
        'baru',
        $body['desc'] ?? '',
        $cost
    ]);

    $newId = (int)$pdo->lastInsertId();
    $fetch = $pdo->prepare("SELECT * FROM tickets WHERE id = ?");
    $fetch->execute([$newId]);
    $newTicket = $fetch->fetch();
    $newTicket['cost'] = (int)$newTicket['cost'];

    logActivity($pdo, 'Petugas', 'Buat Tiket', "Membuat tiket pemeliharaan: {$title} ({$kode})");
    jsonResponse(['success' => true, 'message' => "Tiket perbaikan {$kode} berhasil dibuat!", 'data' => $newTicket], 201);
}

if (preg_match('#^/api/tickets/(\d+)$#', $path, $matches)) {
    $id = (int)$matches[1];

    if ($method === 'PUT') {
        $body = getJsonInput();
        $stmt = $pdo->prepare("SELECT * FROM tickets WHERE id = ?");
        $stmt->execute([$id]);
        $ticket = $stmt->fetch();
        if (!$ticket) {
            jsonResponse(['success' => false, 'message' => 'Tiket tidak ditemukan.'], 404);
        }

        $status = $body['status'] ?? $ticket['status'];
        $tech_name = $body['tech_name'] ?? $ticket['tech_name'];
        $desc = array_key_exists('desc', $body) ? $body['desc'] : $ticket['desc'];
        $cost = array_key_exists('cost', $body) ? (int)$body['cost'] : (int)$ticket['cost'];
        $priority = $body['priority'] ?? $ticket['priority'];

        $update = $pdo->prepare("
            UPDATE tickets 
            SET status = ?, tech_name = ?, desc = ?, cost = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ");
        $update->execute([$status, $tech_name, $desc, $cost, $priority, $id]);

        logActivity($pdo, 'Petugas', 'Update Tiket', "Tiket {$ticket['kode']} status diubah ke: {$status}");
        jsonResponse(['success' => true, 'message' => "Tiket {$ticket['kode']} berhasil diperbarui."]);
    }

    if ($method === 'DELETE') {
        $stmt = $pdo->prepare("SELECT * FROM tickets WHERE id = ?");
        $stmt->execute([$id]);
        $ticket = $stmt->fetch();
        if (!$ticket) {
            jsonResponse(['success' => false, 'message' => 'Tiket tidak ditemukan.'], 404);
        }

        $pdo->prepare("DELETE FROM tickets WHERE id = ?")->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Tiket perbaikan berhasil dihapus.']);
    }
}

// -------------------------------------------------------------
// 9. MUTATIONS
// -------------------------------------------------------------
if ($path === '/api/mutations' && $method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM mutations ORDER BY id DESC");
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($path === '/api/mutations' && $method === 'POST') {
    $body = getJsonInput();
    $bastNo = 'BAST/MUT/' . date('Y') . '/' . mt_rand(1000, 9999);
    $chkBast = $pdo->prepare("SELECT id FROM mutations WHERE bast_no = ?");
    $chkBast->execute([$bastNo]);
    if ($chkBast->fetch()) {
        $bastNo = 'BAST/MUT/' . date('Y') . '/' . substr((string)time(), -5);
    }
    $assetId = $body['asset_id'] ?? null;
    $assetName = $body['asset_name'] ?? 'Aset Inventaris';
    $destLoc = $body['dest_loc'] ?? 'Ruang Tujuan';
    $destPic = $body['dest_pic'] ?? 'PIC Tujuan';

    $months = [1=>'Januari', 2=>'Februari', 3=>'Maret', 4=>'April', 5=>'Mei', 6=>'Juni', 7=>'Juli', 8=>'Agustus', 9=>'September', 10=>'Oktober', 11=>'November', 12=>'Desember'];
    $formattedDate = date('j') . ' ' . $months[(int)date('n')] . ' ' . date('Y');

    $stmt = $pdo->prepare("
        INSERT INTO mutations (bast_no, asset_id, asset_name, nup, unit_count, origin_loc, origin_pic, origin_nip, dest_loc, dest_pic, dest_nip, purpose, status, date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $bastNo,
        $assetId ? (int)$assetId : null,
        $assetName,
        $body['nup'] ?? 'SAR/2025/0000',
        $body['unit_count'] ?? '1 Unit',
        $body['origin_loc'] ?? 'Ruang Asal',
        $body['origin_pic'] ?? 'PIC Asal',
        $body['origin_nip'] ?? '',
        $destLoc,
        $destPic,
        $body['dest_nip'] ?? '',
        $body['purpose'] ?? 'Mutasi operasional institusi',
        'Dalam Proses Pemindahan',
        $formattedDate
    ]);

    $newId = (int)$pdo->lastInsertId();

    if ($assetId && $destLoc) {
        $pdo->prepare("UPDATE assets SET lokasi = ?, pic = ? WHERE id = ?")->execute([$destLoc, $destPic ?: 'PIC Baru', (int)$assetId]);
    }

    logActivity($pdo, 'Admin/Petugas', 'Mutasi Aset', "Menerbitkan BAST mutasi {$bastNo} untuk {$assetName}");
    jsonResponse(['success' => true, 'message' => "Berita Acara Mutasi {$bastNo} berhasil dibuat!", 'data' => ['id' => $newId, 'bast_no' => $bastNo]], 201);
}

if (preg_match('#^/api/mutations/(\d+)/approve$#', $path, $matches) && $method === 'PUT') {
    $id = (int)$matches[1];
    $stmt = $pdo->prepare("SELECT * FROM mutations WHERE id = ?");
    $stmt->execute([$id]);
    $mut = $stmt->fetch();
    if (!$mut) {
        jsonResponse(['success' => false, 'message' => 'Data mutasi tidak ditemukan.'], 404);
    }

    $pdo->prepare("UPDATE mutations SET status = 'Selesai Terverifikasi', doc_status = 'BAST_Signed.pdf' WHERE id = ?")->execute([$id]);
    logActivity($pdo, 'Pimpinan/Admin', 'Validasi BAST Mutasi', "Menandatangani BAST mutasi {$mut['bast_no']}");
    jsonResponse(['success' => true, 'message' => "BAST Mutasi {$mut['bast_no']} telah divalidasi dan diterbitkan!"]);
}

// -------------------------------------------------------------
// 10. STOCK OPNAME
// -------------------------------------------------------------
if ($path === '/api/stock-opname' && $method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM stock_opname ORDER BY id DESC");
    $logs = $stmt->fetchAll();
    foreach ($logs as &$l) {
        $l['is_loc_diff'] = (int)$l['is_loc_diff'];
    }
    jsonResponse(['success' => true, 'data' => $logs]);
}

if ($path === '/api/stock-opname' && $method === 'POST') {
    $body = getJsonInput();
    $code = $body['code'] ?? 'SAR/2025/0000';
    $name = $body['name'] ?? 'Aset Terpindai';
    $actualLoc = $body['actual_loc'] ?? 'Ruang Audit';
    $masterLoc = $body['master_loc'] ?? $actualLoc;
    $isLocDiff = !empty($body['is_loc_diff']) ? 1 : 0;

    $monthsShort = [1=>'Jan', 2=>'Feb', 3=>'Mar', 4=>'Apr', 5=>'Mei', 6=>'Jun', 7=>'Jul', 8=>'Agu', 9=>'Sep', 10=>'Okt', 11=>'Nov', 12=>'Des'];
    $scanTime = 'Scan QR - ' . date('j') . ' ' . $monthsShort[(int)date('n')] . ' ' . date('H:i');

    $stmt = $pdo->prepare("
        INSERT INTO stock_opname (code, name, category, sn, actual_loc, master_loc, is_loc_diff, audit_status, condition, auditor, scan_time, session_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $code,
        $name,
        $body['category'] ?? 'Umum',
        $body['sn'] ?? '-',
        $actualLoc,
        $masterLoc,
        $isLocDiff,
        $body['audit_status'] ?? 'Cocok Sesuai Data',
        $body['condition'] ?? 'Baik',
        $body['auditor'] ?? 'Auditor Sarpras',
        $scanTime,
        $body['session_name'] ?? 'Audit Semester 1 - 2025'
    ]);

    $newId = (int)$pdo->lastInsertId();
    jsonResponse(['success' => true, 'message' => "Scan verifikasi aset {$code} berhasil dicatat!", 'data' => ['id' => $newId]], 201);
}

if (preg_match('#^/api/stock-opname/(\d+)/sync$#', $path, $matches) && $method === 'PUT') {
    $id = (int)$matches[1];
    $stmt = $pdo->prepare("SELECT * FROM stock_opname WHERE id = ?");
    $stmt->execute([$id]);
    $log = $stmt->fetch();
    if (!$log) {
        jsonResponse(['success' => false, 'message' => 'Log stock opname tidak ditemukan.'], 404);
    }

    $pdo->prepare("
        UPDATE stock_opname 
        SET master_loc = actual_loc, is_loc_diff = 0, audit_status = 'Cocok Sesuai Data'
        WHERE id = ?
    ")->execute([$id]);

    $pdo->prepare("UPDATE assets SET lokasi = ? WHERE nup = ? OR kode = ?")->execute([$log['actual_loc'], $log['code'], $log['code']]);

    logActivity($pdo, 'Auditor', 'Sinkronisasi Lokasi', "Menyesuaikan lokasi aset {$log['code']} ke {$log['actual_loc']}");
    jsonResponse(['success' => true, 'message' => "Lokasi master aset {$log['code']} berhasil disinkronkan ke {$log['actual_loc']}!"]);
}

if (preg_match('#^/api/stock-opname/(\d+)$#', $path, $matches) && $method === 'PUT') {
    $id = (int)$matches[1];
    $stmt = $pdo->prepare("SELECT * FROM stock_opname WHERE id = ?");
    $stmt->execute([$id]);
    $log = $stmt->fetch();
    if (!$log) {
        jsonResponse(['success' => false, 'message' => 'Log stock opname tidak ditemukan.'], 404);
    }
    $body = getJsonInput();
    $pdo->prepare("
        UPDATE stock_opname
        SET audit_status = ?, condition = ?, actual_loc = ?, master_loc = ?, is_loc_diff = ?
        WHERE id = ?
    ")->execute([
        $body['audit_status'] ?? $log['audit_status'],
        $body['condition'] ?? $log['condition'],
        $body['actual_loc'] ?? $log['actual_loc'],
        $body['master_loc'] ?? $log['master_loc'],
        array_key_exists('is_loc_diff', $body) ? ($body['is_loc_diff'] ? 1 : 0) : (int)$log['is_loc_diff'],
        $id
    ]);
    jsonResponse(['success' => true, 'message' => "Status audit aset {$log['code']} diperbarui."]);
}

// -------------------------------------------------------------
// 11. DASHBOARD STATS & KPI
// -------------------------------------------------------------
if ($path === '/api/dashboard/stats' && $method === 'GET') {
    $totalAssets = (int)$pdo->query("SELECT COUNT(*) FROM assets")->fetchColumn();
    $readyAssets = (int)$pdo->query("SELECT COUNT(*) FROM assets WHERE LOWER(status) = 'tersedia'")->fetchColumn();
    $loanedAssets = (int)$pdo->query("SELECT COUNT(*) FROM assets WHERE LOWER(status) = 'dipinjam'")->fetchColumn();
    $maintenanceAssets = (int)$pdo->query("SELECT COUNT(*) FROM assets WHERE LOWER(status) = 'perawatan'")->fetchColumn();
    $damagedAssets = (int)$pdo->query("SELECT COUNT(*) FROM assets WHERE LOWER(kondisi) LIKE '%rusak%' OR LOWER(status) = 'afkir'")->fetchColumn();
    $totalValue = (int)$pdo->query("SELECT COALESCE(SUM(nilai), 0) FROM assets")->fetchColumn();

    $pendingApprovals = (int)$pdo->query("SELECT COUNT(*) FROM approvals WHERE status = 'Sedang Ditinjau'")->fetchColumn();
    $activeTickets = (int)$pdo->query("SELECT COUNT(*) FROM tickets WHERE status != 'selesai'")->fetchColumn();

    jsonResponse([
        'success' => true,
        'data' => [
            'totalAssets' => $totalAssets,
            'readyAssets' => $readyAssets,
            'loanedAssets' => $loanedAssets,
            'maintenanceAssets' => $maintenanceAssets,
            'damagedAssets' => $damagedAssets,
            'totalValue' => $totalValue,
            'pendingApprovals' => $pendingApprovals,
            'activeTickets' => $activeTickets
        ]
    ]);
}

// -------------------------------------------------------------
// 12. SETTINGS, BACKUP, RESET & ACTIVITY LOGS
// -------------------------------------------------------------
if ($path === '/api/settings' && $method === 'GET') {
    $rows = $pdo->query("SELECT * FROM settings")->fetchAll();
    $settings = [];
    foreach ($rows as $r) {
        $settings[$r['key']] = $r['value'];
    }
    jsonResponse(['success' => true, 'data' => $settings]);
}

if ($path === '/api/settings' && $method === 'POST') {
    $body = getJsonInput();
    $upsert = $pdo->prepare("
        INSERT INTO settings (key, value) VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
    ");
    foreach ($body as $k => $v) {
        $upsert->execute([$k, (string)$v]);
    }
    logActivity($pdo, 'Admin', 'Ubah Pengaturan', 'Memperbarui konfigurasi sistem institusi');
    jsonResponse(['success' => true, 'message' => 'Pengaturan sistem berhasil disimpan.']);
}

if ($path === '/api/backup' && $method === 'GET') {
    $data = [
        'timestamp' => date('c'),
        'users' => $pdo->query("SELECT * FROM users")->fetchAll(),
        'categories' => $pdo->query("SELECT * FROM categories")->fetchAll(),
        'buildings' => $pdo->query("SELECT * FROM buildings")->fetchAll(),
        'locations' => $pdo->query("SELECT * FROM locations")->fetchAll(),
        'employees' => $pdo->query("SELECT * FROM employees")->fetchAll(),
        'assets' => $pdo->query("SELECT * FROM assets")->fetchAll(),
        'loans' => $pdo->query("SELECT * FROM loans")->fetchAll(),
        'approvals' => $pdo->query("SELECT * FROM approvals")->fetchAll(),
        'tickets' => $pdo->query("SELECT * FROM tickets")->fetchAll(),
        'mutations' => $pdo->query("SELECT * FROM mutations")->fetchAll(),
        'stock_opname' => $pdo->query("SELECT * FROM stock_opname")->fetchAll(),
        'settings' => $pdo->query("SELECT * FROM settings")->fetchAll()
    ];

    header('Content-Type: application/json; charset=utf-8');
    header('Content-Disposition: attachment; filename=SIMAS_DB_Backup_' . time() . '.json');
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($path === '/api/reset-all' && $method === 'POST') {
    $pdo->exec("
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
    ");

    seedData($pdo);
    logActivity($pdo, 'Admin', 'Reset Database', 'Seluruh database direset ke data pabrik.');
    jsonResponse(['success' => true, 'message' => 'Seluruh database berhasil direset ke setelan awal!']);
}

if ($path === '/api/activity-logs' && $method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM activity_logs ORDER BY id DESC LIMIT 100");
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($path === '/api/activity-logs' && $method === 'POST') {
    $body = getJsonInput();
    logActivity($pdo, $body['user_name'] ?? 'Pengguna SIMAS', $body['action'] ?? 'Aktivitas', $body['details'] ?? '');
    jsonResponse(['success' => true, 'message' => 'Log aktivitas tercatat.'], 201);
}

// Fallback for unmatched API routes
jsonResponse(['success' => false, 'message' => 'Endpoint API tidak ditemukan.'], 404);

