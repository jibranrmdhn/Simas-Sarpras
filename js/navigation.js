/**
 * SIMAS - Sistem Informasi Sarana & Prasarana
 * js/navigation.js - Navigasi Ringkas 6 Menu Inti (Tanpa Sekat Kategori Berlebihan)
 */

const ALL_NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    subtitle: 'Ringkasan & statistik utama',
    icon: 'layout-panel-left',
    href: 'index.html',
    permission: 'dashboard:view'
  },
  {
    id: 'aset',
    label: 'Inventaris Aset',
    subtitle: 'Daftar barang, tambah, edit & hapus',
    icon: 'archive',
    href: 'aset.html',
    permission: 'assets:view'
  },
  {
    id: 'lokasi',
    label: 'Gedung & Ruangan',
    subtitle: 'Daftar gedung & ruangan kampus',
    icon: 'building-2',
    href: 'gedung.html',
    permission: 'assets:view'
  },
  {
    id: 'peminjaman',
    label: 'Peminjaman Sarana',
    subtitle: 'Pinjam barang/ruangan, setujui & kembalikan',
    icon: 'calendar-clock',
    href: 'peminjaman.html',
    permission: 'loans:view'
  },
  {
    id: 'pemeliharaan',
    label: 'Pemeliharaan',
    subtitle: 'Lapor & pantau perbaikan barang rusak',
    icon: 'wrench',
    href: 'tiket.html',
    permission: ['maintenance:view', 'maintenance:report']
  },
  {
    id: 'laporan',
    label: 'Laporan',
    subtitle: 'Rekap riwayat & unduh Excel/CSV',
    icon: 'file-text',
    href: 'laporan.html',
    permission: 'reports:view'
  },
  {
    id: 'pengguna',
    label: 'Kelola Akun & ACC',
    subtitle: 'Persetujuan pendaftaran & hak akses',
    icon: 'user-check',
    href: 'pengguna.html',
    permission: 'users:manage'
  }
];

const PAGE_GUIDES = {
  'index.html': {
    title: 'Beranda (Dashboard) SIMAS',
    desc: 'Ringkasan seluruh barang kampus, ruangan yang sedang dipakai, dan permohonan peminjaman yang perlu disetujui.',
    terms: 'NUP = Nomor Kode Barang • SLA = Ketepatan Waktu Layanan',
    steps: [
      'Lihat kartu ringkasan di atas untuk memantau total aset, peminjaman aktif, dan tiket perbaikan.',
      'Pada bagian "Antrean Persetujuan", klik tombol "Setujui" atau "Tolak" untuk memproses permohonan dengan cepat.',
      'Gunakan 6 menu inti di sebelah kiri untuk berpindah halaman dengan mudah.'
    ]
  },
  'aset.html': {
    title: 'Inventaris Aset (Daftar Barang)',
    desc: 'Lihat seluruh barang milik kampus (laptop, proyektor, furnitur, AC), cari lokasinya, atau daftarkan aset baru.',
    terms: 'NUP = Nomor Urut Pendaftaran (Kode Unik Barang) • PIC = Penanggung Jawab Barang',
    steps: [
      'Ketik nama atau kode barang pada kotak pencarian untuk menemukan aset dengan cepat.',
      'Klik tombol "+ Tambah Aset Baru" di kanan atas untuk mendaftarkan barang baru ke dalam sistem.',
      'Pada tabel, klik ikon Detail (Mata), Edit (Pensil), atau Hapus (Tempat Sampah) di kolom Aksi.'
    ]
  },
  'gedung.html': {
    title: 'Gedung & Ruangan Kampus',
    desc: 'Daftar ruangan rapat, aula, dan laboratorium beserta kapasitas kursi, fasilitas, dan status ketersediaannya.',
    terms: 'Okupansi = Persentase penggunaan ruangan • PIC = Penanggung Jawab Ruangan',
    steps: [
      'Pilih filter lantai atau status "Tersedia" untuk mencari ruangan yang kosong.',
      'Klik tombol "Booking Cepat" pada kartu ruangan untuk langsung memesan ruangan tersebut.',
      'Klik tombol "+ Tambah Ruangan Baru" di kanan atas untuk menambahkan data ruangan baru.'
    ]
  },
  'peminjaman.html': {
    title: 'Peminjaman & Reservasi Sarana',
    desc: 'Kelola pengajuan peminjaman alat atau ruangan rapat, persetujuan permohonan, serta pencatatan pengembalian barang.',
    terms: 'Overdue / Terlambat = Barang belum dikembalikan melewati batas tanggal pinjam',
    steps: [
      'Klik tombol "+ Ajukan Peminjaman Aset/Ruangan" di kanan atas untuk membuat permohonan pinjam baru.',
      'Klik salah satu baris nama peminjam di tabel kiri untuk melihat rincian lengkapnya di panel sebelah kanan.',
      'Di panel sebelah kanan, gunakan tombol "Setujui Peminjaman" atau "Tandai Sudah Dikembalikan".'
    ]
  },
  'tiket.html': {
    title: 'Pemeliharaan & Tiket Perbaikan',
    desc: 'Laporkan fasilitas kampus yang rusak (seperti AC, proyektor, atau kelistrikan) dan pantau progres perbaikannya.',
    terms: 'Kanban Board = Papan tahapan perbaikan dari Tiket Baru hingga Selesai • Urgent = Prioritas Darurat',
    steps: [
      'Klik tombol "+ Lapor Kerusakan / Tiket" di kanan atas untuk membuat laporan kerusakan baru.',
      'Pantau posisi kartu perbaikan dari kolom "1. Tiket Baru", "2. Ditugaskan", "3. Dalam Pengerjaan", hingga "4. Selesai".',
      'Klik kartu tiket atau tombol aksinya untuk membuka panel rincian dan memperbarui status perbaikan.'
    ]
  },
  'laporan.html': {
    title: 'Pusat Laporan & Riwayat Aktivitas',
    desc: 'Rekapitulasi otomatis seluruh kegiatan peminjaman, pemeliharaan, dan inventaris aset.',
    terms: 'Export CSV = Unduh data tabel agar dapat dibuka di Microsoft Excel',
    steps: [
      'Gunakan filter jenis aktivitas atau kotak pencarian untuk menyaring data laporan.',
      'Klik tombol "Export CSV" di kanan atas untuk mengunduh laporan ke komputer Anda.',
      'Klik tombol "Cetak" pada baris tabel untuk mencetak bukti transaksi tertentu.'
    ]
  }
};

/**
 * Suntikkan gaya dasar yang menjaga proporsi tombol & tata letak tetap rapi
 */
function injectReadabilityStyles() {
  if (document.getElementById('simas-readability-styles')) return;

  document.documentElement.classList.remove('simas-large-text');

  const style = document.createElement('style');
  style.id = 'simas-readability-styles';
  style.textContent = `
    header button,
    main > div button,
    main > section button {
      white-space: nowrap;
    }
    #sidebar-menu-list::-webkit-scrollbar,
    #sidebar-menu::-webkit-scrollbar {
      width: 4px;
    }
    #sidebar-menu-list::-webkit-scrollbar-thumb,
    #sidebar-menu::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 9999px;
    }

    /* ================= SIMAS GLOBAL DARK MODE ================= */
    html.dark {
      color-scheme: dark;
    }
    html.dark body {
      background-color: #0b1120 !important;
      color: #e2e8f0 !important;
    }
    html.dark aside,
    html.dark #main-sidebar {
      background-color: #0f172a !important;
      border-color: #1e293b !important;
    }
    html.dark header {
      background-color: rgba(15, 23, 42, 0.96) !important;
      border-color: #1e293b !important;
    }
    html.dark .bg-white,
    html.dark .bg-white\\/95,
    html.dark .bg-white\\/90 {
      background-color: #111c33 !important;
    }
    html.dark .bg-\\[\\#f4f7fb\\],
    html.dark .bg-\\[\\#f8fafd\\],
    html.dark .bg-\\[\\#f8fafc\\],
    html.dark .bg-\\[\\#f1f5fb\\],
    html.dark .bg-\\[\\#fafcff\\],
    html.dark .bg-\\[\\#fffdf7\\],
    html.dark .bg-slate-50,
    html.dark .bg-slate-50\\/40,
    html.dark .bg-slate-50\\/60,
    html.dark .bg-slate-50\\/70 {
      background-color: #0f172a !important;
    }
    html.dark .bg-slate-100,
    html.dark .bg-slate-100\\/90,
    html.dark .bg-slate-100\\/80,
    html.dark .bg-slate-200,
    html.dark .bg-\\[\\#e6edf8\\],
    html.dark .bg-\\[\\#e9f0fd\\],
    html.dark .bg-\\[\\#dbe8fb\\],
    html.dark .bg-\\[\\#eef4ff\\],
    html.dark .bg-\\[\\#dce7f7\\],
    html.dark .bg-\\[\\#f0f5fc\\] {
      background-color: #1e293b !important;
    }
    html.dark .bg-amber-50,
    html.dark .bg-amber-50\\/90,
    html.dark .bg-amber-50\\/80,
    html.dark .bg-amber-50\\/70,
    html.dark .bg-amber-50\\/60,
    html.dark .bg-amber-50\\/50,
    html.dark .bg-amber-50\\/40,
    html.dark .bg-amber-50\\/30,
    html.dark .bg-amber-100,
    html.dark .bg-amber-200,
    html.dark .bg-\\[\\#fffbeb\\] {
      background-color: rgba(180, 83, 9, 0.32) !important;
    }
    html.dark .hover\\:bg-amber-200:hover,
    html.dark .hover\\:bg-amber-100:hover {
      background-color: rgba(180, 83, 9, 0.5) !important;
    }
    html.dark .bg-emerald-50,
    html.dark .bg-emerald-50\\/90,
    html.dark .bg-emerald-50\\/80,
    html.dark .bg-emerald-50\\/70,
    html.dark .bg-emerald-50\\/60,
    html.dark .bg-emerald-50\\/50,
    html.dark .bg-emerald-50\\/40,
    html.dark .bg-emerald-50\\/30,
    html.dark .bg-emerald-100,
    html.dark .bg-\\[\\#ecfdf5\\],
    html.dark .bg-\\[\\#e8f5ee\\] {
      background-color: rgba(6, 78, 59, 0.36) !important;
    }
    html.dark .bg-blue-50,
    html.dark .bg-blue-50\\/90,
    html.dark .bg-blue-50\\/80,
    html.dark .bg-blue-50\\/70,
    html.dark .bg-blue-50\\/60,
    html.dark .bg-blue-50\\/50,
    html.dark .bg-blue-50\\/40,
    html.dark .bg-blue-50\\/30,
    html.dark .bg-blue-50\\/20,
    html.dark .bg-blue-100 {
      background-color: rgba(30, 58, 138, 0.38) !important;
    }
    html.dark .bg-rose-50,
    html.dark .bg-rose-50\\/90,
    html.dark .bg-rose-50\\/80,
    html.dark .bg-rose-50\\/70,
    html.dark .bg-rose-50\\/60,
    html.dark .bg-rose-50\\/50,
    html.dark .bg-rose-50\\/40,
    html.dark .bg-rose-50\\/30,
    html.dark .bg-rose-100,
    html.dark .bg-red-50,
    html.dark .bg-red-50\\/70,
    html.dark .bg-red-100 {
      background-color: rgba(136, 19, 55, 0.36) !important;
    }
    html.dark .hover\\:bg-rose-200:hover,
    html.dark .hover\\:bg-rose-100:hover {
      background-color: rgba(159, 18, 57, 0.52) !important;
    }
    html.dark .bg-purple-50,
    html.dark .bg-purple-50\\/80,
    html.dark .bg-purple-50\\/70,
    html.dark .bg-purple-50\\/60,
    html.dark .bg-purple-50\\/50,
    html.dark .bg-purple-100,
    html.dark .bg-\\[\\#f5f0ff\\],
    html.dark .bg-\\[\\#fdf4ff\\] {
      background-color: rgba(88, 28, 135, 0.34) !important;
    }
    html.dark .bg-teal-50,
    html.dark .bg-teal-50\\/70,
    html.dark .bg-teal-100 {
      background-color: rgba(19, 78, 74, 0.35) !important;
    }
    html.dark .border-slate-100,
    html.dark .border-slate-200,
    html.dark .border-slate-200\\/90,
    html.dark .border-slate-200\\/80,
    html.dark .border-slate-200\\/60,
    html.dark .border-slate-300,
    html.dark .divide-slate-100 > :not([hidden]) ~ :not([hidden]),
    html.dark .divide-slate-200 > :not([hidden]) ~ :not([hidden]) {
      border-color: #243249 !important;
    }
    html.dark .border-blue-200,
    html.dark .border-blue-200\\/90,
    html.dark .border-blue-200\\/80,
    html.dark .border-blue-200\\/70 {
      border-color: rgba(59, 130, 246, 0.42) !important;
    }
    html.dark .border-amber-200,
    html.dark .border-amber-200\\/90,
    html.dark .border-amber-200\\/80,
    html.dark .border-amber-300,
    html.dark .border-amber-300\\/90 {
      border-color: rgba(245, 158, 11, 0.4) !important;
    }
    html.dark .border-emerald-200,
    html.dark .border-emerald-200\\/80 {
      border-color: rgba(16, 185, 129, 0.4) !important;
    }
    html.dark .border-rose-200,
    html.dark .border-rose-200\\/80,
    html.dark .border-rose-200\\/60 {
      border-color: rgba(244, 63, 94, 0.42) !important;
    }
    html.dark .border-purple-200 {
      border-color: rgba(168, 85, 247, 0.38) !important;
    }
    html.dark .text-slate-900,
    html.dark .text-slate-800 {
      color: #f1f5f9 !important;
    }
    html.dark .text-slate-700 {
      color: #cbd5e1 !important;
    }
    html.dark .text-slate-600,
    html.dark .text-slate-500 {
      color: #94a3b8 !important;
    }
    html.dark .text-slate-400 {
      color: #94a3b8 !important;
    }
    html.dark .text-\\[\\#0f2a71\\],
    html.dark .text-\\[\\#1246b5\\],
    html.dark .text-\\[\\#1d4ed8\\],
    html.dark .text-\\[\\#1D4ED8\\],
    html.dark .text-blue-700,
    html.dark .text-blue-800 {
      color: #93c5fd !important;
    }
    html.dark .text-amber-950,
    html.dark .text-amber-900,
    html.dark .text-amber-800,
    html.dark .text-amber-700 {
      color: #fde68a !important;
    }
    html.dark .text-emerald-900,
    html.dark .text-emerald-800,
    html.dark .text-emerald-700,
    html.dark .text-\\[\\#065f46\\],
    html.dark .text-\\[\\#0d7a5f\\] {
      color: #6ee7b7 !important;
    }
    html.dark .text-teal-800,
    html.dark .text-teal-700 {
      color: #2dd4bf !important;
    }
    html.dark .text-purple-900,
    html.dark .text-purple-800,
    html.dark .text-purple-700,
    html.dark .text-\\[\\#4c1d95\\],
    html.dark .text-\\[\\#6d28d9\\] {
      color: #d8b4fe !important;
    }
    html.dark .text-rose-900,
    html.dark .text-rose-800 {
      color: #fecdd3 !important;
    }
    html.dark .text-rose-700,
    html.dark .text-rose-600,
    html.dark .text-red-700,
    html.dark .text-red-600 {
      color: #fda4af !important;
    }
    html.dark input:not([type="checkbox"]):not([type="radio"]),
    html.dark select,
    html.dark textarea {
      background-color: #0f172a !important;
      color: #f1f5f9 !important;
      border-color: #334155 !important;
    }
    html.dark input::placeholder,
    html.dark textarea::placeholder {
      color: #64748b !important;
    }
    html.dark a.bg-\\[\\#1246b5\\],
    html.dark button.bg-\\[\\#1246b5\\],
    html.dark button.bg-\\[\\#1D4ED8\\],
    html.dark button.bg-\\[\\#0f2a71\\],
    html.dark button.bg-emerald-600,
    html.dark button.bg-rose-600 {
      color: #ffffff !important;
    }
    html.dark #sidebar-menu-list a:not(.bg-\\[\\#1246b5\\]):hover {
      background-color: #1e293b !important;
      color: #f8fafc !important;
    }
    html.dark #btn-header-profile:hover {
      background-color: #1e293b !important;
    }
    html.dark .hover\\:bg-slate-50:hover,
    html.dark .hover\\:bg-slate-50\\/70:hover,
    html.dark .hover\\:bg-slate-100:hover,
    html.dark .hover\\:bg-slate-200:hover {
      background-color: #1e293b !important;
    }
    html.dark .card-shadow {
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.35) !important;
    }
    html.dark [data-switch-knob],
    [data-switch-knob] {
      background-color: #ffffff !important;
    }
  `;
  document.head.appendChild(style);
}

window.getSimasTheme = function() {
  try {
    return localStorage.getItem('simas_theme') === 'dark' ? 'dark' : 'light';
  } catch (_) {
    return 'light';
  }
};

window.applySimasTheme = function(theme) {
  const isDark = theme === 'dark';
  injectReadabilityStyles();
  document.documentElement.classList.toggle('dark', isDark);
  try {
    localStorage.setItem('simas_theme', isDark ? 'dark' : 'light');
  } catch (_) {}
  window.syncSimasDarkModeSwitches();
  window.dispatchEvent(new CustomEvent('simas:themechange', { detail: { theme: isDark ? 'dark' : 'light' } }));
};

window.toggleSimasDarkMode = function(forceValue = null) {
  const next = typeof forceValue === 'boolean'
    ? (forceValue ? 'dark' : 'light')
    : (window.getSimasTheme() === 'dark' ? 'light' : 'dark');
  window.applySimasTheme(next);
  return next;
};

window.syncSimasDarkModeSwitches = function() {
  const isDark = window.getSimasTheme() === 'dark';
  document.querySelectorAll('[data-simas-theme-switch]').forEach(btn => {
    btn.setAttribute('aria-checked', isDark ? 'true' : 'false');
    const track = btn.querySelector('[data-switch-track]');
    const knob = btn.querySelector('[data-switch-knob]');
    const label = btn.querySelector('[data-switch-label]');
    if (track) {
      track.className = isDark
        ? 'inline-block w-11 h-6 rounded-full bg-[#2563eb] relative transition-colors shrink-0'
        : 'inline-block w-11 h-6 rounded-full bg-slate-300 relative transition-colors shrink-0';
    }
    if (knob) {
      knob.className = isDark
        ? 'block w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 left-0.5 translate-x-5 transition-transform'
        : 'block w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 left-0.5 translate-x-0 transition-transform';
    }
    if (label) {
      label.textContent = isDark ? 'Mode Gelap Aktif' : 'Mode Terang';
    }
  });
  const modalIconWrap = document.getElementById('account-darkmode-icon-wrap');
  if (modalIconWrap) {
    modalIconWrap.innerHTML = `<i data-lucide="${isDark ? 'moon' : 'sun'}" class="w-4 h-4"></i>`;
    if (window.lucide) lucide.createIcons();
  }
};

// Terapkan tema tersimpan secepat mungkin saat script dimuat
(function initSavedThemeEarly() {
  if (typeof document !== 'undefined' && document.head) {
    injectReadabilityStyles();
    if (window.getSimasTheme() === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }
})();

/**
 * Render Sidebar Menu Dinamis (6 Menu Inti Tanpa Sekat Kategori)
 */
function renderNavigation(forcedActiveId = null) {
  injectReadabilityStyles();

  const container = document.getElementById('sidebar-menu-list') || document.getElementById('sidebar-menu') || document.getElementById('sidebar-nav');
  if (!container) return;

  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  if (!user) return;

  let currentFile = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) || 'index.html';
  if (currentFile === '' || currentFile === 'index.html') currentFile = 'index.html';

  const allowedItems = ALL_NAVIGATION_ITEMS.filter(item => {
    if (typeof hasPermission === 'function') {
      if (Array.isArray(item.permission)) {
        return item.permission.some(p => hasPermission(p));
      }
      return hasPermission(item.permission);
    }
    return true;
  });

  const htmlParts = allowedItems.map(item => {
    const isActive = forcedActiveId ? (item.id === forcedActiveId) : (item.href === currentFile);
    let displayLabel = item.label;
    let displayIcon = item.icon;
    if (user.role === 'peminjam') {
      if (item.id === 'aset') displayLabel = 'Katalog Aset Tersedia';
      if (item.id === 'peminjaman') displayLabel = 'Peminjaman Saya';
      if (item.id === 'pemeliharaan') {
        displayLabel = 'Lapor Kerusakan';
        displayIcon = 'alert-triangle';
      }
    }

    const pendingBadgeHtml = item.id === 'pengguna'
      ? `<span id="sidebar-pending-users-badge" class="hidden px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isActive ? 'bg-white text-[#1246b5]' : 'bg-amber-500 text-white'}">0</span>`
      : '';

    if (isActive) {
      return `
        <a href="${item.href}" class="flex items-center justify-between px-4 py-3 rounded-xl bg-[#1246b5] text-white font-bold text-[13px] shadow-xs transition">
          <div class="flex items-center gap-3 min-w-0">
            <i data-lucide="${displayIcon}" class="w-4 h-4 text-white shrink-0"></i>
            <span class="truncate">${displayLabel}</span>
          </div>
          ${pendingBadgeHtml}
        </a>
      `;
    }
    return `
      <a href="${item.href}" class="flex items-center justify-between px-4 py-3 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-[#e2edfd]/70 font-medium text-[13px] transition">
        <div class="flex items-center gap-3 min-w-0">
          <i data-lucide="${displayIcon}" class="w-4 h-4 text-slate-600 shrink-0"></i>
          <span class="truncate">${displayLabel}</span>
        </div>
        ${pendingBadgeHtml}
      </a>
    `;
  });

  container.innerHTML = htmlParts.join('');

  const prevSibling = container.previousElementSibling;
  if (prevSibling && prevSibling.textContent && prevSibling.textContent.includes('Menu')) {
    prevSibling.style.display = 'none';
  }

  updateHeaderAndSidebarUserProfiles(user);
  enhanceTopbarHelpControls();

  if (user.role === 'admin' && typeof fetch === 'function') {
    refreshPendingUsersBadge();
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

window.refreshPendingUsersBadge = async function() {
  try {
    const res = await fetch('/api/users/pending');
    if (!res.ok) return;
    const data = await res.json();
    const badge = document.getElementById('sidebar-pending-users-badge');
    if (!badge) return;
    const count = Number(data?.count || (data?.data ? data.data.length : 0));
    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  } catch (_) {
    // Abaikan jika offline
  }
};

/**
 * Fungsi panduan modal tetap tersedia tanpa menyisipkan banner biru tambahan di atas halaman
 */
function renderBeginnerGuideBanner(currentFile) {
  const existing = document.getElementById('simas-beginner-guide-banner');
  if (existing) existing.remove();
}

window.toggleBeginnerGuideBanner = function(collapse) {
  const banner = document.getElementById('simas-beginner-guide-banner');
  if (banner) banner.remove();
};

/**
 * Aktifkan Notifikasi & Pencarian Global serta Sinkronisasi Judul Topbar sesuai PDF
 */
function enhanceTopbarHelpControls() {
  const notifBtn = document.getElementById('btn-header-notif');
  if (notifBtn && !notifBtn.dataset.simasWired) {
    notifBtn.dataset.simasWired = '1';
    notifBtn.title = 'Lihat Pemberitahuan Sistem';
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openSimasNotificationModal();
    });
  }

  // Aktifkan Global Search di Topbar agar terhubung langsung dengan filter tabel halaman aktif
  const topbarSearchInputs = document.querySelectorAll('header input[type="text"]');
  topbarSearchInputs.forEach(topInput => {
    topInput.placeholder = 'Cari data dalam modul ini...';
    if (topInput.dataset.simasSearchWired) return;
    topInput.dataset.simasSearchWired = '1';

    topInput.addEventListener('input', (e) => {
      const val = e.target.value;
      const localTargets = [
        'table-search-input',
        'asset-search',
        'search-loan',
        'search-ticket',
        'report-search',
        'building-tree-search'
      ];
      localTargets.forEach(targetId => {
        const localEl = document.getElementById(targetId);
        if (localEl && localEl !== topInput) {
          localEl.value = val;
          localEl.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });

      if (typeof window.handleGlobalTopbarSearch === 'function') {
        window.handleGlobalTopbarSearch(val);
      }
    });

    topInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const localTargets = [
          'activity-table-body',
          'asset-tbody',
          'room-cards-grid',
          'loan-table-body',
          'kanban-board-container',
          'report-tbody'
        ];
        for (const id of localTargets) {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            break;
          }
        }
      }
    });
  });

  if (!window._simasCtrlKWired) {
    window._simasCtrlKWired = true;
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        const topInput = document.querySelector('header input[type="text"]');
        if (topInput) {
          e.preventDefault();
          topInput.focus();
          topInput.select();
        }
      }
    });
  }

  const helpLinks = document.querySelectorAll('aside a[href="#"]');
  helpLinks.forEach(link => {
    if (!link.dataset.simasHelpWired) {
      link.dataset.simasHelpWired = '1';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openSimasHelpModal();
      });
    }
  });
}

/**
 * Modal Panduan Lengkap & Langkah Pakai Halaman Aktif
 */
window.openSimasHelpModal = function(focusFile = null) {
  const existing = document.getElementById('simas-beginner-help-modal');
  if (existing) existing.remove();

  const currentFile = focusFile || window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) || 'index.html';
  const activeGuide = PAGE_GUIDES[currentFile] || PAGE_GUIDES['index.html'];

  const modal = document.createElement('div');
  modal.id = 'simas-beginner-help-modal';
  modal.className = 'fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#eef4ff]">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-[#0f2a71] text-white flex items-center justify-center font-bold shrink-0">
            <i data-lucide="book-open-check" class="w-4 h-4"></i>
          </div>
          <div>
            <h3 class="text-sm font-extrabold text-slate-900">Panduan Penggunaan SIMAS</h3>
            <p class="text-[11px] text-slate-600">Langkah praktis menggunakan halaman ini & 6 menu utama</p>
          </div>
        </div>
        <button type="button" onclick="closeSimasHelpModal()" class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <div class="p-5 overflow-y-auto space-y-5 text-xs">
        <!-- Langkah Halaman Saat Ini -->
        <div class="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 space-y-3">
          <div>
            <span class="px-2 py-0.5 rounded bg-[#0f2a71] text-white font-bold text-[10px] uppercase tracking-wider">Halaman Aktif</span>
            <h4 class="text-sm font-extrabold text-slate-900 mt-1.5">${activeGuide.title}</h4>
            <p class="text-slate-600 mt-0.5 leading-relaxed">${activeGuide.desc}</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            ${activeGuide.steps.map((step, idx) => `
              <div class="bg-white border border-blue-100 rounded-lg p-3 flex items-start gap-2">
                <span class="w-5 h-5 rounded-full bg-[#1342b8] text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">${idx + 1}</span>
                <p class="text-slate-700 leading-relaxed">${step}</p>
              </div>
            `).join('')}
          </div>
          ${activeGuide.terms ? `
            <div class="pt-2 border-t border-blue-200/60 text-[11px] text-slate-600">
              <strong class="text-[#0f2a71]">Istilah Penting:</strong> ${activeGuide.terms}
            </div>
          ` : ''}
        </div>

        <!-- Pintasan 6 Menu Utama -->
        <div>
          <h4 class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2.5">
            Alur 6 Menu Inti SIMAS:
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a href="aset.html" class="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition flex items-start gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <i data-lucide="archive" class="w-3.5 h-3.5"></i>
              </div>
              <div>
                <div class="font-bold text-slate-900">1. Inventaris Aset</div>
                <p class="text-[11px] text-slate-500 mt-0.5">Kelola daftar barang, tambah, edit, dan hapus aset.</p>
              </div>
            </a>

            <a href="gedung.html" class="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition flex items-start gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                <i data-lucide="building-2" class="w-3.5 h-3.5"></i>
              </div>
              <div>
                <div class="font-bold text-slate-900">2. Gedung & Ruangan</div>
                <p class="text-[11px] text-slate-500 mt-0.5">Cek ketersediaan ruangan rapat, aula, dan lab.</p>
              </div>
            </a>

            <a href="peminjaman.html" class="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition flex items-start gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <i data-lucide="calendar-clock" class="w-3.5 h-3.5"></i>
              </div>
              <div>
                <div class="font-bold text-slate-900">3. Peminjaman Sarana</div>
                <p class="text-[11px] text-slate-500 mt-0.5">Ajukan pinjam, setujui permohonan, & kembalikan.</p>
              </div>
            </a>

            <a href="tiket.html" class="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition flex items-start gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                <i data-lucide="wrench" class="w-3.5 h-3.5"></i>
              </div>
              <div>
                <div class="font-bold text-slate-900">4. Pemeliharaan</div>
                <p class="text-[11px] text-slate-500 mt-0.5">Laporkan fasilitas rusak dan pantau perbaikan.</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div class="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <button type="button" onclick="toggleBeginnerGuideBanner(false); closeSimasHelpModal();" class="text-xs font-semibold text-blue-700 hover:underline cursor-pointer">
          Tampilkan Baris Info di Halaman
        </button>
        <button type="button" onclick="closeSimasHelpModal()" class="px-4 py-1.5 rounded-xl bg-[#0f2a71] hover:bg-blue-900 text-white text-xs font-bold cursor-pointer">
          Tutup Panduan
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  if (window.lucide) lucide.createIcons();
};

window.closeSimasHelpModal = function() {
  const modal = document.getElementById('simas-beginner-help-modal');
  if (modal) modal.remove();
};

window.openSimasNotificationModal = async function() {
  let modal = document.getElementById('simas-notif-modal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'simas-notif-modal';
  modal.className = 'fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[82vh]">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div class="flex items-center gap-2">
          <i data-lucide="bell-ring" class="w-4 h-4 text-blue-700"></i>
          <h3 class="text-sm font-extrabold text-slate-900">Pemberitahuan & Aktivitas Terbaru</h3>
        </div>
        <button type="button" onclick="document.getElementById('simas-notif-modal')?.remove();" class="p-1 rounded-lg text-slate-500 hover:bg-slate-200 cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="divide-y divide-slate-100 text-xs overflow-y-auto">
        <a href="peminjaman.html" class="block p-3.5 hover:bg-blue-50/50 transition">
          <div class="font-bold text-slate-900">Permohonan Peminjaman Menunggu Persetujuan</div>
          <p class="text-slate-600 mt-0.5">Klik untuk membuka halaman Peminjaman Sarana dan memvalidasi pengajuan.</p>
        </a>
        <a href="tiket.html" class="block p-3.5 hover:bg-blue-50/50 transition">
          <div class="font-bold text-rose-700">Tiket Perbaikan Prioritas Tinggi</div>
          <p class="text-slate-600 mt-0.5">Pantau pengerjaan servis AC, Proyektor, dan Kelistrikan di papan Kanban.</p>
        </a>
        <div id="simas-notif-live-logs" class="p-3.5 bg-slate-50/60 space-y-2">
          <div class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Riwayat Aktivitas Server Terkini</div>
          <div class="text-[11px] text-slate-500">Memuat log aktivitas...</div>
        </div>
      </div>
      <div class="px-4 py-2.5 border-t border-slate-100 bg-white flex items-center justify-between text-xs">
        <a href="laporan.html" class="font-bold text-blue-700 hover:underline">Buka Semua Log di Laporan &rarr;</a>
        <button type="button" onclick="document.getElementById('simas-notif-modal')?.remove();" class="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer">Tutup</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  if (window.lucide) lucide.createIcons();

  if (typeof API !== 'undefined' && typeof API.getActivityLogs === 'function') {
    const res = await API.getActivityLogs();
    const logContainer = document.getElementById('simas-notif-live-logs');
    if (logContainer && res && res.success && Array.isArray(res.data) && res.data.length > 0) {
      logContainer.innerHTML = `
        <div class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Riwayat Aktivitas Server (${res.data.length} Terbaru)</div>
        <div class="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          ${res.data.slice(0, 6).map(l => `
            <div class="p-2 rounded-lg bg-white border border-slate-200/80 text-[11px]">
              <div class="flex items-center justify-between font-bold text-slate-800">
                <span>${l.action}</span>
                <span class="text-[10px] font-normal text-slate-400">${l.user_name || 'Sistem'}</span>
              </div>
              <div class="text-slate-600 mt-0.5">${l.details || '-'}</div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }
};

/**
 * Perbarui UI Profil Pengguna di Topbar & Sidebar
 */
function updateHeaderAndSidebarUserProfiles(user) {
  if (!user && typeof getCurrentUser === 'function') {
    user = getCurrentUser();
  }
  if (!user) {
    user = {
      nama: 'Bambang Irawan',
      role: 'admin',
      roleLabel: 'Admin Sarpras',
      avatar: '../assets/avatar_bambang.jpg'
    };
  }

  const roleMetaMap = {
    admin: {
      peranTag: 'Full Access',
      sidebarRole: 'Admin Sarpras',
      shortName: 'Bambang Irawan',
      headerRoleIndex: 'Admin Sarpras (Full Control)',
      headerRoleOther: 'Admin Sarpras',
      initials: 'BI',
      dashTitle: 'Dashboard Eksekutif Admin Sarpras',
      dashSub: 'Kontrol Penuh 6 Menu • Master Aset, Ruangan, Approval, Kanban, Laporan',
      footerSub: 'Akses terautentikasi resmi'
    },
    petugas: {
      peranTag: 'Teknisi',
      sidebarRole: 'Petugas Sarpras',
      shortName: 'Joko Supriyanto',
      headerRoleIndex: 'Petugas Sarpras',
      headerRoleOther: 'Petugas Sarpras',
      initials: 'JS',
      dashTitle: 'Dashboard Operasional Petugas & Teknisi',
      dashSub: 'Inspeksi Sarana • Verifikasi Pengembalian Fisik • Eksekusi Servis Kanban',
      footerSub: 'Akses terautentikasi resmi'
    },
    pimpinan: {
      peranTag: 'Eksekutif',
      sidebarRole: 'Pimpinan Institusi',
      shortName: 'Dr. Ir. Hendro Wicaksono',
      headerRoleIndex: 'Pimpinan Institusi',
      headerRoleOther: 'Pimpinan Institusi',
      initials: 'DI',
      dashTitle: 'Dashboard Eksekutif & Otorisasi Pimpinan',
      dashSub: 'Valuasi Aset • Persetujuan Fasilitas Strategis • Pengesahan Laporan',
      footerSub: 'Akses terautentikasi resmi'
    },
    peminjam: {
      peranTag: 'Mandiri',
      sidebarRole: 'Peminjam Sarana',
      shortName: 'Budi Santoso',
      headerRoleIndex: 'Peminjam (Dosen TI)',
      headerRoleOther: 'Peminjam (Dosen TI)',
      initials: 'BS',
      dashTitle: 'Portal Layanan Mandiri Peminjaman Sarpras',
      dashSub: 'Peminjaman Mandiri • Cek Ruang Kosong • Lapor Kerusakan Fasilitas',
      footerSub: 'Portal Mandiri & Lapor Kerusakan'
    }
  };

  const rMeta = roleMetaMap[user.role] || roleMetaMap.admin;
  let currentFile = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) || 'index.html';
  if (currentFile === '') currentFile = 'index.html';

  const roleLabelEls = document.querySelectorAll('#sidebar-role-label, [data-role-label]');
  roleLabelEls.forEach(el => {
    el.textContent = rMeta.sidebarRole;
  });

  const sidebarBadges = document.querySelectorAll('#role-badge, [data-role-badge], #role-switcher, aside #role-badge, aside #role-switcher');
  sidebarBadges.forEach(badge => {
    badge.className = 'mt-3.5 w-full px-3.5 py-2.5 bg-[#e9f0fd] border border-blue-200/80 rounded-2xl flex items-center gap-2.5 text-left select-none';
    badge.innerHTML = `
      <div class="w-7 h-7 rounded-xl bg-white/90 text-[#1246b5] flex items-center justify-center shrink-0 shadow-2xs">
        <i data-lucide="shield-check" class="w-4 h-4"></i>
      </div>
      <div class="leading-tight min-w-0">
        <span class="text-[10px] text-slate-500 font-medium block whitespace-nowrap">Peran Aktif (${rMeta.peranTag})</span>
        <span id="sidebar-role-label" class="text-xs font-extrabold text-[#0f2a71] truncate block">${rMeta.sidebarRole}</span>
      </div>
    `;
    badge.removeAttribute('title');
    badge.onclick = null;
  });

  // Update Sidebar Footer Box (Logout + System Info)
  const sidebarEl = document.getElementById('main-sidebar') || document.querySelector('aside');
  if (sidebarEl) {
    let footerBox = sidebarEl.querySelector('#simas-sidebar-rbac-footer');
    if (!footerBox) {
      const bottomDiv = sidebarEl.lastElementChild;
      if (bottomDiv && bottomDiv !== sidebarEl.firstElementChild) {
        bottomDiv.id = 'simas-sidebar-rbac-footer';
        footerBox = bottomDiv;
      }
    }
    if (footerBox) {
      footerBox.className = 'p-3.5 border-t border-slate-200/60 space-y-2';
      footerBox.innerHTML = `
        <button type="button" onclick="if(typeof logout==='function'){logout();}else{localStorage.removeItem('simas_current_user');window.location.href='login.html';}" class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer">
          <i data-lucide="log-out" class="w-4 h-4 text-rose-500"></i>
          <span>Keluar dari Sistem</span>
        </button>
        <div class="px-3.5 py-2.5 rounded-xl bg-[#e6edf8]">
          <div class="text-[11px] font-extrabold text-[#0f2a71]">SIMAS v2.4 • PHP Native</div>
          <div class="text-[10px] text-slate-500 mt-0.5">${rMeta.footerSub}</div>
        </div>
      `;
    }
  }

  // Update Topbar Left Title & Subtitle to match PDF Pages 1-9
  const pageHeaderMap = {
    'index.html': { title: rMeta.dashTitle, sub: rMeta.dashSub },
    'aset.html': {
      title: 'Master Inventaris Sarana & Aset Kampus',
      sub: 'Database Aset • Lokasi Ruang • Label QR & Riwayat Perawatan'
    },
    'gedung.html': {
      title: 'Manajemen Gedung, Fasilitas & Ruangan',
      sub: 'Pemetaan Hierarki Fisik, Kapasitas Okupansi & Ketersediaan Real-Time'
    },
    'peminjaman.html': {
      title: 'Manajemen Peminjaman Sarana & Serah Terima',
      sub: 'Pengajuan Online, Otorisasi Surat Tugas, & Verifikasi Pengembalian'
    },
    'tiket.html': user.role === 'peminjam'
      ? {
          title: 'Lapor Kerusakan Sarana & Fasilitas Kampus',
          sub: 'Laporkan Kerusakan Barang atau Ruangan langsung ke Antrean Petugas Sarpras'
        }
      : {
          title: 'Papan Kanban Pemeliharaan & Tiket Servis',
          sub: 'Tracking Kerusakan Fasilitas, Penugasan Teknisi & Realisasi Biaya'
        },
    'laporan.html': {
      title: 'Pusat Laporan, Rekapitulasi & Audit Trail Sarpras',
      sub: 'Kompilasi BAST Transaksi, Utilisasi Ruangan, Serapan Anggaran & Log'
    },
    'pengguna.html': {
      title: 'Kelola Akun & ACC Pendaftaran Pengguna',
      sub: 'Otorisasi Khusus Admin Sarpras • Verifikasi Akun Baru & Manajemen Role RBAC'
    },
    'pengaturan.html': {
      title: 'Pengaturan Sistem & Tampilan SIMAS',
      sub: 'Konfigurasi Institusi, Kebijakan Peminjaman, Mode Gelap & Database SQLite'
    }
  };

  const headerEl = document.querySelector('header');
  if (headerEl && pageHeaderMap[currentFile]) {
    const leftContainer = headerEl.firstElementChild;
    if (leftContainer) {
      const hInfo = pageHeaderMap[currentFile];
      leftContainer.innerHTML = `
        <div class="flex items-center gap-3">
          <button type="button" onclick="toggleSidebar()" class="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
            <i data-lucide="menu" class="w-5 h-5"></i>
          </button>
          <div>
            <h2 id="topbar-page-title" class="text-base sm:text-[19px] font-extrabold text-slate-900 tracking-tight leading-tight">${hInfo.title}</h2>
            <p id="topbar-page-subtitle" class="text-[11px] text-slate-500 font-medium mt-0.5 hidden sm:block">${hInfo.sub}</p>
          </div>
        </div>
      `;
    }
  }

  const headerRoleDisplay = currentFile === 'index.html' ? rMeta.headerRoleIndex : rMeta.headerRoleOther;

  if (headerEl && pageHeaderMap[currentFile]) {
    headerEl.className = 'h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-6 flex items-center justify-between gap-4';
    const rightContainer = headerEl.lastElementChild;
    if (rightContainer && rightContainer !== headerEl.firstElementChild) {
      Array.from(rightContainer.children).forEach(ch => {
        if (ch.id !== 'btn-header-profile') {
          ch.style.display = 'none';
        }
      });
      if (!rightContainer.querySelector('#btn-header-profile')) {
        const profBtn = document.createElement('button');
        profBtn.id = 'btn-header-profile';
        profBtn.type = 'button';
        rightContainer.appendChild(profBtn);
      }
    }
  }

  const dynamicInitials = (user.nama || user.username || rMeta.shortName || 'US')
    .replace(/^(Dr\.|Ir\.|Prof\.|H\.|Hj\.)\s*/gi, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('') || rMeta.initials;

  const topbarProfiles = document.querySelectorAll('#btn-header-profile');
  topbarProfiles.forEach(topbarProfile => {
    topbarProfile.style.display = 'flex';
    topbarProfile.className = 'flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full bg-[#f4f7fb] hover:bg-[#e9f0fd] border border-slate-200/90 transition cursor-pointer';
    topbarProfile.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-[#1246b5] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
        ${dynamicInitials}
      </div>
      <div class="text-left leading-tight">
        <div id="header-user-name" class="text-xs font-extrabold text-slate-900 whitespace-nowrap">${user.nama ? user.nama.split(',')[0] : rMeta.shortName}</div>
        <div id="header-user-role" class="text-[10px] font-semibold text-[#1246b5] whitespace-nowrap">${headerRoleDisplay}</div>
      </div>
    `;
    topbarProfile.onclick = () => openAccountProfileModal();
    topbarProfile.title = 'Profil Akun, Dark Mode & Keluar';
  });

  if (window.lucide) {
    lucide.createIcons();
  }
}

window.openAccountProfileModal = function() {
  const existing = document.getElementById('simas-account-profile-modal');
  if (existing) existing.remove();

  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  const initials = (currentUser.nama || currentUser.username || 'US')
    .replace(/^(Dr\.|Ir\.|Prof\.|H\.|Hj\.)\s*/gi, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

  const roleDef = (typeof ROLE_DEFINITIONS !== 'undefined' && ROLE_DEFINITIONS[currentUser.role])
    ? ROLE_DEFINITIONS[currentUser.role]
    : null;

  const accType = String(currentUser.account_type || '').toLowerCase();
  const idFieldLabel = accType === 'mahasiswa'
    ? 'NIM (Mahasiswa)'
    : (accType === 'dosen' ? 'NIP / NIDN (Dosen)' : 'NIP / ID Pegawai');
  const statusPeminjamLabel = accType === 'mahasiswa'
    ? 'Mahasiswa'
    : (accType === 'dosen' ? 'Dosen' : '');
  const isDark = typeof window.getSimasTheme === 'function' && window.getSimasTheme() === 'dark';

  const modal = document.createElement('div');
  modal.id = 'simas-account-profile-modal';
  modal.className = 'fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4';
  modal.onclick = (e) => { if (e.target === modal) closeAccountProfileModal(); };
  modal.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#eef4ff]">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-full bg-[#1246b5] text-white flex items-center justify-center font-extrabold text-sm shrink-0">
            ${initials}
          </div>
          <div class="min-w-0">
            <h3 class="text-sm font-extrabold text-slate-900 truncate">${currentUser.nama || currentUser.username}</h3>
            <p class="text-[11px] font-semibold text-[#1246b5]">${currentUser.roleLabel || currentUser.role}${statusPeminjamLabel ? ` • ${statusPeminjamLabel}` : ''}</p>
          </div>
        </div>
        <button type="button" onclick="closeAccountProfileModal()" aria-label="Tutup modal profil" class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>

      <div class="p-5 space-y-3 text-xs">
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div class="flex justify-between gap-2">
            <span class="text-slate-500">Username</span>
            <span class="font-bold text-slate-800 font-mono">${currentUser.username || '-'}</span>
          </div>
          ${statusPeminjamLabel ? `
            <div class="flex justify-between gap-2">
              <span class="text-slate-500">Kategori Peminjam</span>
              <span class="font-bold text-slate-800">${statusPeminjamLabel}</span>
            </div>
          ` : ''}
          <div class="flex justify-between gap-2">
            <span class="text-slate-500">${idFieldLabel}</span>
            <span class="font-bold text-slate-800 font-mono">${currentUser.nip || '-'}</span>
          </div>
          <div class="flex justify-between gap-2">
            <span class="text-slate-500">Email Institusi</span>
            <span class="font-bold text-slate-800 truncate">${currentUser.email || '-'}</span>
          </div>
          <div class="flex justify-between gap-2">
            <span class="text-slate-500">${accType === 'mahasiswa' ? 'Program Studi / Fakultas' : 'Unit Kerja'}</span>
            <span class="font-bold text-slate-800 text-right">${currentUser.unit || 'Biro Sarana & Prasarana'}</span>
          </div>
        </div>

        <!-- Toggle Dark Mode -->
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5 min-w-0">
            <div id="account-darkmode-icon-wrap" class="w-8 h-8 rounded-lg bg-blue-50 text-[#1246b5] flex items-center justify-center shrink-0">
              <i data-lucide="${isDark ? 'moon' : 'sun'}" class="w-4 h-4"></i>
            </div>
            <div class="min-w-0">
              <div class="text-xs font-extrabold text-slate-900">Mode Gelap (Dark Mode)</div>
              <div class="text-[10px] text-slate-500">Ubah tema tampilan seluruh halaman SIMAS</div>
            </div>
          </div>
          <button
            type="button"
            id="account-darkmode-toggle"
            role="switch"
            aria-checked="${isDark ? 'true' : 'false'}"
            aria-label="Aktifkan Mode Gelap"
            data-simas-theme-switch="1"
            onclick="toggleSimasDarkMode()"
            class="flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span data-switch-label class="text-[10px] font-bold text-slate-600 hidden sm:inline">${isDark ? 'Mode Gelap Aktif' : 'Mode Terang'}</span>
            <span data-switch-track class="inline-block w-11 h-6 rounded-full ${isDark ? 'bg-[#2563eb]' : 'bg-slate-300'} relative transition-colors shrink-0">
              <span data-switch-knob class="block w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 left-0.5 ${isDark ? 'translate-x-5' : 'translate-x-0'} transition-transform"></span>
            </span>
          </button>
        </div>

        ${roleDef ? `
          <div class="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/70">
            <div class="text-[11px] font-extrabold text-[#0f2a71] mb-1">Cakupan Wewenang Akun</div>
            <p class="text-[11px] text-slate-600 leading-relaxed">${roleDef.description}</p>
          </div>
        ` : ''}
      </div>

      <div class="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
        <button type="button" onclick="closeAccountProfileModal()" class="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer transition">
          Tutup
        </button>
        <button type="button" onclick="if(typeof logout==='function'){logout();}else{localStorage.removeItem('simas_current_user');window.location.href='login.html';}" class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm">
          <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  if (window.lucide) lucide.createIcons();
  window.syncSimasDarkModeSwitches();
};

function closeAccountProfileModal() {
  const modal = document.getElementById('simas-account-profile-modal');
  if (modal) modal.remove();
}

function toggleSidebar() {
  const sidebar = document.getElementById('main-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar) return;
  sidebar.classList.toggle('-translate-x-full');
  if (overlay) overlay.classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavigation();
  updateHeaderAndSidebarUserProfiles();
  if (typeof window.syncSimasDarkModeSwitches === 'function') {
    window.syncSimasDarkModeSwitches();
  }
});
