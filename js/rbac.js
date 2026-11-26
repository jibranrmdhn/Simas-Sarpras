/**
 * SIMAS - Sistem Informasi Sarana & Prasarana
 * js/rbac.js - Role-Based Access Control: Daftar Role, Permission, dan Pemeriksaan Hak Akses
 */

// ===================== 1. DEFINISI PERMISSION PER ROLE ===================== //

const ROLE_DEFINITIONS = {
  admin: {
    key: 'admin',
    name: 'Admin Sarpras',
    badgeClass: 'bg-blue-100 text-[#0f2a71] border-blue-200',
    description: 'Akses penuh ke seluruh modul, data master, inventaris, audit, dan manajemen pengguna.',
    permissions: [
      'dashboard:view',
      'assets:view',
      'assets:create',
      'assets:edit',
      'assets:delete',
      'loans:view',
      'loans:create',
      'loans:approve',
      'loans:return',
      'loans:manage',
      'maintenance:view',
      'maintenance:manage',
      'maintenance:report',
      'reports:view',
      'reports:export',
      'categories:manage',
      'locations:manage',
      'employees:manage',
      'users:manage',
      'users:approve',
      'settings:manage',
      'mutasi:manage',
      'stock:manage'
    ]
  },
  petugas: {
    key: 'petugas',
    name: 'Petugas Sarpras',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
    description: 'Mengelola data operasional inventaris, peminjaman, pemeliharaan, kategori & lokasi. Tidak dapat menghapus aset atau mengelola pengguna.',
    permissions: [
      'dashboard:view',
      'assets:view',
      'assets:create',
      'assets:edit',
      // 'assets:delete' TIDAK DIIZINKAN
      'loans:view',
      'loans:create',
      'loans:return',
      'loans:manage',
      'maintenance:view',
      'maintenance:manage',
      'maintenance:report',
      'reports:view',
      'reports:export',
      'categories:manage',
      'locations:manage',
      'mutasi:manage',
      'stock:manage'
      // 'users:manage', 'employees:manage', 'settings:manage' TIDAK DIIZINKAN
    ]
  },
  pimpinan: {
    key: 'pimpinan',
    name: 'Pimpinan Institusi',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Melihat dashboard eksekutif, data inventaris (read-only), persetujuan peminjaman sarana, dan laporan rangkuman aktivitas.',
    permissions: [
      'dashboard:view',
      'assets:view',
      // 'assets:create', 'assets:edit', 'assets:delete' TIDAK DIIZINKAN (Read Only)
      'loans:view',
      'loans:approve', // Berwenang menyetujui / menolak peminjaman
      'maintenance:view', // Hanya melihat tiket & status
      'reports:view',
      'reports:export'
    ]
  },
  peminjam: {
    key: 'peminjam',
    name: 'Peminjam (Dosen / Mahasiswa)',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    description: 'Melihat ketersediaan aset, mengajukan peminjaman sarana, memantau status peminjaman milik sendiri, mengajukan pengembalian, dan melaporkan kerusakan sarana/fasilitas.',
    permissions: [
      'dashboard:view',
      'assets:view', // Hanya melihat katalog & ketersediaan
      'loans:view',  // Melihat status pinjaman
      'loans:create', // Mengajukan peminjaman
      'loans:return', // Mengajukan pengembalian
      'loans:view_own',
      'loans:return_own',
      'maintenance:report' // Dapat mengirim laporan kerusakan ke Petugas Sarpras
    ]
  }
};

// ===================== 2. FUNGSI PEMERIKSAAN PERMISSION & ROLE ===================== //

/**
 * Memeriksa apakah user saat ini memiliki role tertentu
 * @param {string|string[]} roles - Role tunggal atau array role yang diizinkan
 * @returns {boolean}
 */
function hasRole(roles) {
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  if (!user || !user.role) return false;

  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  return user.role === roles;
}

/**
 * Memeriksa apakah user saat ini memiliki permission tertentu
 * Menggunakan pendekatan permission-based agar scalable
 * @param {string} permission - Nama permission (misal: 'assets:delete')
 * @returns {boolean}
 */
function hasPermission(permission) {
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  if (!user || !user.role) return false;

  const roleDef = ROLE_DEFINITIONS[user.role];
  if (!roleDef || !Array.isArray(roleDef.permissions)) return false;

  return roleDef.permissions.includes(permission);
}

/**
 * Pemeriksaan hak akses sebelum menjalankan aksi.
 * Jika tidak berhak, memunculkan modal & pesan "Akses Ditolak" serta mengembalikan false.
 * @param {string} permission - Permission yang dibutuhkan
 * @param {string} actionName - Nama aksi untuk ditampilkan di modal jika ditolak
 * @returns {boolean}
 */
function requirePermission(permission, actionName = 'Aksi ini') {
  if (!hasPermission(permission)) {
    showAccessDeniedModal(actionName, permission);
    return false;
  }
  return true;
}

/**
 * Proteksi autentikasi: Memastikan pengguna sudah login.
 * Jika belum login, dialihkan ke halaman login.
 */
function requireAuth() {
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  if (!user) {
    const isInsidePages = window.location.pathname.includes('/pages/');
    const loginTarget = isInsidePages ? 'login.html' : 'pages/login.html';
    window.location.replace(loginTarget);
    return false;
  }
  return true;
}

// ===================== 3. PEMETAAN PROTEKSI HALAMAN (PAGE ACCESS GUARD) ===================== //

const PAGE_PERMISSIONS_MAP = {
  'index.html': 'dashboard:view',
  'aset.html': 'assets:view',
  'form.html': 'assets:create', // Admin & Petugas
  'peminjaman.html': 'loans:view',
  'antrean.html': 'loans:approve', // Admin & Pimpinan
  'persetujuan.html': 'loans:approve',
  'reservasi.html': 'loans:view',
  'tiket.html': ['maintenance:view', 'maintenance:report'], // Admin, Petugas, Pimpinan (Kanban) & Peminjam (Lapor Kerusakan)
  'gedung.html': 'assets:view', // Semua role dapat melihat ketersediaan gedung & ruangan
  'mutasi.html': 'mutasi:manage', // Admin & Petugas
  'stock.html': 'stock:manage', // Admin & Petugas
  'laporan.html': 'reports:view', // Admin, Petugas, Pimpinan (Peminjam Ditolak)
  'pengguna.html': 'users:manage', // Khusus Admin
  'kategori.html': 'categories:manage', // Admin & Petugas
  'pegawai.html': 'employees:manage', // Khusus Admin
  'pengaturan.html': 'settings:manage' // Khusus Admin
};

/**
 * Memeriksa izin akses halaman saat ini secara otomatis saat dimuat.
 * Jika user tidak memiliki hak akses halaman, konten diganti dengan halaman "Akses Ditolak".
 */
function protectCurrentPage() {
  if (typeof window === 'undefined' || !window.location) return;
  // 1. Cek Autentikasi
  const currentPath = window.location.pathname || '';
  if (currentPath.endsWith('login.html')) {
    // Di halaman login, jika sudah login bisa tetap di sana atau alihkan
    return;
  }

  if (!requireAuth()) {
    return;
  }

  // 2. Cek Hak Akses Halaman
  const pageFilename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  const requiredPerm = PAGE_PERMISSIONS_MAP[pageFilename];

  const hasRequired = Array.isArray(requiredPerm)
    ? requiredPerm.some(p => hasPermission(p))
    : (!requiredPerm || hasPermission(requiredPerm));

  if (requiredPerm && !hasRequired) {
    renderAccessDeniedPage(pageFilename, Array.isArray(requiredPerm) ? requiredPerm.join(' / ') : requiredPerm);
  }
}

// ===================== 4. TAMPILAN FEEDBACK "AKSES DITOLAK" ===================== //

/**
 * Tampilkan pesan modal ketika user memanggil aksi yang tidak diizinkan
 */
function showAccessDeniedModal(actionName, permissionCode) {
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : { roleLabel: 'Tamu' };
  
  // Hapus modal lama jika ada
  const existing = document.getElementById('simas-rbac-denied-modal');
  if (existing) existing.remove();

  const modalHtml = `
    <div id="simas-rbac-denied-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div class="bg-white rounded-2xl border border-rose-200 shadow-2xl max-w-md w-full p-6 text-center space-y-4">
        <div class="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-inner">
          <i data-lucide="shield-alert" class="w-7 h-7"></i>
        </div>
        
        <div>
          <span class="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider mb-1">
            403 Akses Ditolak
          </span>
          <h3 class="text-base font-extrabold text-slate-900">Aksi Tidak Diizinkan</h3>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed">
            Peran akun Anda (<strong class="text-slate-900">${user.roleLabel}</strong>) tidak memiliki izin untuk:
            <br><span class="font-bold text-rose-700 text-[13px] mt-1 inline-block bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">"${actionName}"</span>
          </p>
          <p class="text-[11px] text-slate-400 mt-2">
            Kode Permission: <code class="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-600">${permissionCode || 'restricted:action'}</code>
          </p>
        </div>

        <div class="pt-2 border-t border-slate-100 flex items-center justify-center gap-2.5">
          <button onclick="closeAccessDeniedModal()" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition">
            Tutup Dialog
          </button>
          <a href="index.html" class="px-4 py-2 rounded-xl bg-[#0f2a71] hover:bg-[#0a1e54] text-white text-xs font-bold transition shadow-sm">
            Kembali ke Dashboard
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  if (window.lucide) lucide.createIcons();

  // Tampilkan toast error juga jika fungsi showToast tersedia
  if (typeof showToast === 'function') {
    showToast(`Akses Ditolak: Peran ${user.roleLabel} tidak memiliki hak akses untuk ${actionName}`, 'error');
  }
}

function closeAccessDeniedModal() {
  const modal = document.getElementById('simas-rbac-denied-modal');
  if (modal) modal.remove();
}

/**
 * Jika user mengakses URL halaman yang dilarang langsung dari address bar browser,
 * ganti konten halaman dengan halaman informatif "Akses Ditolak (403 Forbidden)".
 */
function renderAccessDeniedPage(pageFilename, requiredPerm) {
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : { roleLabel: 'Pengguna', role: 'unknown' };

  window.addEventListener('DOMContentLoaded', () => {
    // Cari elemen main utama
    const mainEl = document.querySelector('main');
    if (!mainEl) return;

    mainEl.innerHTML = `
      <div class="py-16 px-4 max-w-xl mx-auto text-center space-y-6">
        <div class="w-20 h-20 mx-auto rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-sm">
          <i data-lucide="shield-x" class="w-10 h-10"></i>
        </div>

        <div class="space-y-2">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
            <i data-lucide="lock" class="w-3.5 h-3.5"></i>
            <span>403 FORBIDDEN - AKSES TERBATAS</span>
          </div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Halaman Tidak Dapat Diakses</h1>
          <p class="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            Halaman <code class="font-mono font-bold text-rose-700">${pageFilename}</code> memerlukan hak akses khusus. Akun Anda yang masuk sebagai <strong class="text-slate-900">${user.roleLabel}</strong> (${user.nama}) tidak memiliki permission untuk mengakses fitur ini.
          </p>
        </div>

        <div class="bg-white p-4 rounded-xl border border-slate-200/90 text-left text-xs space-y-2 shadow-xs">
          <div class="flex items-center justify-between font-semibold text-slate-700">
            <span>Peran Anda Saat Ini:</span>
            <span class="px-2 py-0.5 rounded-full bg-slate-100 font-bold">${user.roleLabel}</span>
          </div>
          <div class="flex items-center justify-between font-semibold text-slate-700">
            <span>Permission yang Dibutuhkan:</span>
            <span class="font-mono text-rose-600 font-bold">${requiredPerm}</span>
          </div>
          <div class="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-100 text-[11px]">
            <span>Hubungi Administrator Sarpras jika Anda memerlukan peningkatan izin.</span>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a href="index.html" class="px-5 py-2.5 rounded-xl bg-[#0f2a71] hover:bg-[#0a1e54] text-white text-xs font-bold shadow-sm transition flex items-center gap-2">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
            <span>Kembali ke Dashboard Utama</span>
          </a>
          <button onclick="logout()" class="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5">
            <i data-lucide="log-out" class="w-4 h-4 text-slate-500"></i>
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  });
}

/**
 * Memeriksa apakah role tertentu memiliki permission tertentu
 * @param {string} roleKey - Role ('admin', 'petugas', 'pimpinan', 'peminjam')
 * @param {string} permission - Nama permission
 * @returns {boolean}
 */
function hasRolePermission(roleKey, permission) {
  const roleDef = ROLE_DEFINITIONS[roleKey];
  if (!roleDef || !Array.isArray(roleDef.permissions)) return false;
  return roleDef.permissions.includes(permission);
}

// Jalankan proteksi halaman otomatis
protectCurrentPage();

// Expose object ke window / global scope untuk kemudahan akses & testing
if (typeof window !== 'undefined') {
  window.RBAC = {
    ROLE_DEFINITIONS,
    PAGE_PERMISSIONS_MAP,
    hasRole,
    hasPermission,
    hasRolePermission,
    requirePermission,
    requireAuth,
    protectCurrentPage,
    showAccessDeniedModal,
    renderAccessDeniedPage
  };
}
