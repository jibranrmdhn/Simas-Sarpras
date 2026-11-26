/**
 * SIMAS – Halaman Manajemen Aset
 * Semua konten dinamis disimpan dalam array JavaScript lalu dirender ke DOM.
 */

// ================= 1. DATA ARRAYS ================= //

const menuItems = [
  { label: 'Dashboard', icon: 'layout-panel-left', href: 'index.html', active: false },
  { label: 'Manajemen Aset', icon: 'archive', href: 'aset.html', active: true },
  { label: 'Gedung & Ruangan', icon: 'building-2', href: 'gedung.html', active: false },
  { label: 'Peminjaman & Reservasi', icon: 'calendar-clock', href: 'peminjaman.html', active: false },
  { label: 'Antrean Persetujuan', icon: 'check-square', href: 'antrean.html', active: false, badge: 4 },
  { label: 'Pemeliharaan & Tiket', icon: 'wrench', href: 'tiket.html', active: false },
  { label: 'Mutasi Aset', icon: 'arrow-left-right', href: 'mutasi.html', active: false },
  { label: 'Stock Opname', icon: 'scan-barcode', href: 'stock.html', active: false },
  { label: 'Laporan & Rangkuman', icon: 'file-text', href: 'laporan.html', active: false },
];

const assetStats = [
  {
    label: 'Total Nilai Aset',
    value: 'Rp 4.82 Miliar',
    valueClass: 'text-slate-900',
    note: '2.845 unit tercatat',
    noteIcon: 'trending-up',
    noteClass: 'text-teal-700',
    icon: 'wallet',
    iconBox: 'bg-[#dce6f8] text-[#102f86]',
  },
  {
    label: 'Kondisi Baik',
    value: '2.418',
    valueClass: 'text-slate-900',
    note: '85% dari inventaris',
    noteClass: 'text-slate-600',
    icon: 'circle-check',
    iconBox: 'bg-[#c9f3ea] text-teal-700',
  },
  {
    label: 'Sedang Dipinjam',
    value: '312',
    valueClass: 'text-slate-900',
    note: '11 ruangan aktif',
    noteClass: 'text-[#1d4ed8]',
    icon: 'refresh-ccw',
    iconBox: 'bg-[#dce6f8] text-[#102f86]',
  },
  {
    label: 'Dalam Perawatan',
    value: '42',
    valueClass: 'text-red-600',
    note: '8 tiket prioritas',
    noteClass: 'text-red-600',
    icon: 'wrench',
    iconBox: 'bg-[#fdd9d9] text-red-600',
  },
];

const quickFilters = [
  { id: 'kategori', label: 'Semua Kategori', options: ['Elektronik', 'Alat Lab', 'Utilitas', 'Mebel'] },
  { id: 'lokasi', label: 'Semua Lokasi Gedung', options: ['Gedung A', 'Gedung B', 'GKB', 'Lab Terpadu', 'Gedung Rektorat'] },
  { id: 'kondisi', label: 'Kondisi Fisik: Semua', options: ['Baik', 'Cukup', 'Rusak Ringan'] },
  { id: 'status', label: 'Status: Semua', options: ['Tersedia', 'Dipinjam', 'Perawatan'] },
];

const defaultAssets = [
  {
    kode: 'SAR/2025/0102',
    serial: 'PF3K9820-T14',
    nama: 'Laptop ThinkPad T14 Gen 4',
    spesifikasi: 'Core i7-1365U, 16GB RAM, 512GB SSD',
    foto: '../assets/laptop.jpg',
    kategori: 'Elektronik',
    gedung: 'Gedung A, Lt. 3',
    ruang: 'R. 302 - Staf Keuangan',
    kondisi: 'Baik',
    status: 'Dipinjam',
    pj: 'Dewi Sartika',
    nilai: 24500000
  },
  {
    kode: 'SAR/2024/0891',
    serial: 'EPS-2250U-88X',
    nama: 'LCD Proyektor Epson EB-2250U',
    spesifikasi: '5.000 Lumens Full HD WUXGA 3LCD',
    foto: '../assets/proyektor.jpg',
    kategori: 'Elektronik',
    gedung: 'GKB, Lt. 1',
    ruang: 'R. Multimedia Utama',
    kondisi: 'Cukup',
    status: 'Tersedia',
    pj: 'Agus Riyadi',
    nilai: 18200000
  },
  {
    kode: 'SAR/2023/0440',
    serial: 'OLY-CX23-B712',
    nama: 'Mikroskop Binokuler Olympus CX23',
    spesifikasi: 'LED Illumination, Plan Achromat 4x/10x/40x',
    foto: '../assets/mikroskop.jpg',
    kategori: 'Alat Lab',
    gedung: 'Lab Terpadu',
    ruang: 'R. Biologi Molekuler',
    kondisi: 'Baik',
    status: 'Tersedia',
    pj: 'Rina Hartati',
    nilai: 32000000
  },
  {
    kode: 'SAR/2022/0119',
    serial: 'DKN-FTKC50TV',
    nama: 'AC Daikin Inverter 2 PK',
    spesifikasi: 'Premium Inverter R32, FTKC Series',
    foto: '../assets/ac.jpg',
    kategori: 'Utilitas',
    gedung: 'Gedung B, Lt. 2',
    ruang: 'R. Rapat Utama Dekanat',
    kondisi: 'Rusak Ringan',
    status: 'Perawatan',
    pj: 'Joko Supriyanto',
    nilai: 12500000
  },
  {
    kode: 'SAR/2025/0225',
    serial: 'JTI-CONF-16P',
    nama: 'Set Meja Rapat Konferensi Kayu Jati',
    spesifikasi: 'Kapasitas 16 Kursi Kulit Eksekutif, Port Kabel Tanam',
    foto: '../assets/meja-rapat.jpg',
    kategori: 'Mebel',
    gedung: 'Gedung Rektorat',
    ruang: 'Lt. 4 - Ruang Senat',
    kondisi: 'Baik',
    status: 'Tersedia',
    pj: 'Bambang Irawan',
    nilai: 65000000
  },
];

function getStoredAssets() {
  try {
    const raw = localStorage.getItem('simas_assets_data');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Gagal membaca simas_assets_data:', e);
  }
  return [...defaultAssets];
}

function saveStoredAssets(data) {
  try {
    localStorage.setItem('simas_assets_data', JSON.stringify(data));
  } catch (e) {
    console.warn('Gagal menyimpan simas_assets_data:', e);
  }
}

let assets = getStoredAssets();

const TOTAL_ASET = 2845;
const TOTAL_HALAMAN = 570;

// Pemetaan nilai → class CSS
const kondisiClass = { 'Baik': 'pill-baik', 'Cukup': 'pill-cukup', 'Rusak Ringan': 'pill-rusak', 'Rusak Berat': 'pill-rusak' };
const statusClass = { 'Tersedia': 'pill-tersedia', 'Dipinjam': 'pill-dipinjam', 'Perawatan': 'pill-perawatan', 'Perbaikan': 'pill-perawatan' };

// State aplikasi
const state = {
  keyword: '',
  filters: { kategori: '', lokasi: '', kondisi: '', status: '' },
  advFilters: { kategori: 'all', kondisi: 'all', status: 'all', nilai: 'all' },
  view: 'table',
  page: 1,
  rowsPerPage: 10,
  sortAsc: null,
};


// ================= 2. RENDER FUNCTIONS ================= //

function renderSidebar() {
  if (typeof renderNavigation === 'function') {
    renderNavigation('aset');
    return;
  }
  const container = document.getElementById('sidebar-menu-list') || document.getElementById('sidebar-menu');
  if (!container) return;

  container.innerHTML = menuItems.map((m) => {
    if (m.active) {
      return `
        <a href="${m.href}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#1342b8] text-white font-semibold text-xs shadow-sm shadow-blue-800/20 transition">
          <div class="flex items-center gap-3">
            <i data-lucide="${m.icon}" class="w-4 h-4 text-white"></i>
            <span>${m.label}</span>
          </div>
          ${m.badge ? `<span class="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">${m.badge}</span>` : ''}
        </a>
      `;
    }
    return `
      <a href="${m.href}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-[#e2edfd] font-medium text-xs transition">
        <div class="flex items-center gap-3">
          <i data-lucide="${m.icon}" class="w-4 h-4 text-slate-600"></i>
          <span>${m.label}</span>
        </div>
        ${m.badge ? `<span class="w-5 h-5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-bold flex items-center justify-center">${m.badge}</span>` : ''}
      </a>
    `;
  }).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function renderStats() {
  if (Array.isArray(assets) && assets.length > 0) {
    const totalUnits = assets.length;
    const totalNilai = assets.reduce((sum, a) => sum + (Number(a.nilai) || 18000000), 0);
    const baikCount = assets.filter(a => (a.kondisi || '').toLowerCase() === 'baik').length;
    const pinjamCount = assets.filter(a => (a.status || '').toLowerCase() === 'dipinjam').length;
    const rawatCount = assets.filter(a => ['perawatan', 'perbaikan'].includes((a.status || '').toLowerCase()) || (a.kondisi || '').toLowerCase().includes('rusak')).length;

    const nilaiFormatted = totalNilai >= 1000000000
      ? `Rp ${(totalNilai / 1000000000).toFixed(2)} Miliar`
      : `Rp ${Math.round(totalNilai / 1000000).toLocaleString('id-ID')} Juta`;
    const baikPct = Math.round((baikCount / totalUnits) * 100);

    if (typeof hasRole === 'function' && hasRole('peminjam')) {
      assetStats[0].label = 'Total Katalog Sarana';
      assetStats[0].value = `${totalUnits} Unit`;
      assetStats[0].note = 'Terdaftar di katalog kampus';
    } else {
      assetStats[0].label = 'Total Nilai Perolehan';
      assetStats[0].value = nilaiFormatted;
      assetStats[0].note = `${totalUnits} unit tercatat aktif`;
    }
    assetStats[1].value = String(baikCount);
    assetStats[1].note = `${baikPct}% siap digunakan`;
    assetStats[2].value = String(pinjamCount);
    assetStats[2].note = `${pinjamCount} unit sedang dipakai`;
    assetStats[3].value = String(rawatCount);
    assetStats[3].note = `${rawatCount} unit perlu servis`;
  }

  document.getElementById('asset-stats').innerHTML = assetStats.map((s) => `
    <article class="bg-white rounded-2xl px-3.5 py-4 soft-shadow flex items-center justify-between gap-3 hover:-translate-y-0.5 transition">
      <div class="min-w-0">
        <div class="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-600">${s.label}</div>
        <div class="mt-1.5 text-[20px] leading-tight font-extrabold ${s.valueClass}">${s.value}</div>
        <div class="mt-1.5 flex items-center gap-1 text-[10px] font-semibold ${s.noteClass}">
          ${s.noteIcon ? `<i data-lucide="${s.noteIcon}" class="w-3 h-3"></i>` : ''}${s.note}
        </div>
      </div>
      <div class="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${s.iconBox}">
        <i data-lucide="${s.icon}" class="w-[18px] h-[18px]"></i>
      </div>
    </article>
  `).join('');
}

function renderQuickFilters() {
  document.getElementById('quick-filters').innerHTML = quickFilters.map((f) => `
    <select id="filter-${f.id}" data-filter="${f.id}" class="quick-select">
      <option value="">${f.label}</option>
      ${f.options.map((o) => `<option value="${o}">${o}</option>`).join('')}
    </select>
  `).join('');
}

function getFilteredAssets() {
  const kw = state.keyword.toLowerCase();
  let list = assets.filter((a) => {
    const matchKw = !kw || [a.kode, a.nama, a.serial, a.spesifikasi].some((v) => (v || '').toLowerCase().includes(kw));
    const f = state.filters;
    const matchKategori = !f.kategori || a.kategori === f.kategori;
    const matchLokasi = !f.lokasi || (a.gedung || '').startsWith(f.lokasi);
    const matchKondisi = !f.kondisi || a.kondisi === f.kondisi;
    const matchStatus = !f.status || a.status === f.status;

    // Advanced filters
    const adv = state.advFilters || {};
    const matchAdvKat = !adv.kategori || adv.kategori === 'all' || a.kategori === adv.kategori;
    const matchAdvKon = !adv.kondisi || adv.kondisi === 'all' || a.kondisi === adv.kondisi;
    const matchAdvSt = !adv.status || adv.status === 'all' || a.status === adv.status;

    let matchAdvNilai = true;
    const val = Number(a.nilai || (a.kategori === 'Elektronik' ? 24000000 : a.kategori === 'Mebel' ? 65000000 : 15000000));
    if (adv.nilai === 'low') matchAdvNilai = val < 10000000;
    else if (adv.nilai === 'mid') matchAdvNilai = val >= 10000000 && val <= 50000000;
    else if (adv.nilai === 'high') matchAdvNilai = val > 50000000;

    return matchKw && matchKategori && matchLokasi && matchKondisi && matchStatus && matchAdvKat && matchAdvKon && matchAdvSt && matchAdvNilai;
  });
  if (state.sortAsc !== null) {
    list = [...list].sort((x, y) => (state.sortAsc ? 1 : -1) * (x.kode || '').localeCompare(y.kode || ''));
  }
  return list;
}

function renderTable(list) {
  const tbody = document.getElementById('asset-table-body');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="9" class="py-10 text-center text-xs text-slate-500">Tidak ada aset yang cocok dengan pencarian / filter.</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map((a) => `
    <tr class="hover:bg-slate-50/70 transition">
      <td class="pl-3 py-3"><input type="checkbox" class="chk row-check" aria-label="Pilih ${a.kode}"></td>
      <td class="py-3 pr-4 whitespace-nowrap">
        <a href="javascript:void(0)" onclick="openEditModal('${a.kode}')" class="font-mono text-[11px] font-bold text-[#102f86] hover:underline">${a.kode}</a>
        <div class="text-[9.5px] font-semibold text-slate-500">SN: ${a.serial}</div>
      </td>
      <td class="py-3 pr-4">
        <div class="flex items-center gap-2.5">
          <img src="${a.foto || '../assets/laptop.jpg'}" onerror="this.src='https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=80&q=80'" alt="${a.nama}" class="w-9 h-9 rounded-md object-cover shrink-0" loading="lazy">
          <div class="min-w-0">
            <div class="text-[12.5px] font-bold text-slate-900 whitespace-nowrap">${a.nama}</div>
            <div class="text-[10px] font-semibold text-slate-600 whitespace-nowrap">${a.spesifikasi}</div>
          </div>
        </div>
      </td>
      <td class="py-3 pr-4"><span class="chip-kategori">${a.kategori}</span></td>
      <td class="py-3 pr-4 whitespace-nowrap">
        <div class="text-[11px] text-slate-700">${a.gedung}</div>
        <div class="text-[10px] font-bold text-slate-700">${a.ruang}</div>
      </td>
      <td class="py-3 pr-4"><span class="pill ${kondisiClass[a.kondisi] || 'pill-baik'}">${a.kondisi}</span></td>
      <td class="py-3 pr-4"><span class="pill ${statusClass[a.status] || 'pill-tersedia'}">${a.status}</span></td>
      <td class="py-3 pr-4 text-[11px] font-semibold text-slate-700 whitespace-nowrap">${a.pj}</td>
      <td class="py-3 pr-4 text-right whitespace-nowrap">
        <div class="flex items-center justify-end gap-1.5">
          <button onclick="openQrModal('${a.kode}')" class="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition" title="Lihat Label QR">
            <i data-lucide="qr-code" class="w-3.5 h-3.5"></i>
          </button>
          ${(typeof hasPermission === 'function' && hasPermission('assets:edit')) ? `
            <button onclick="openEditModal('${a.kode}')" class="px-2 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/80 text-[11px] font-bold flex items-center gap-1 transition" title="Edit Aset">
              <i data-lucide="edit-2" class="w-3 h-3"></i>
              <span>Edit</span>
            </button>
          ` : ''}
          ${(typeof hasPermission === 'function' && hasPermission('assets:delete')) ? `
            <button onclick="openDeleteModal('${a.kode}')" class="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80 text-[11px] font-bold flex items-center gap-1 transition" title="Hapus Aset">
              <i data-lucide="trash-2" class="w-3 h-3"></i>
              <span>Hapus</span>
            </button>
          ` : ''}
          ${(typeof hasRole === 'function' && hasRole('peminjam') && a.status === 'Tersedia') ? `
            <a href="peminjaman.html?kode=${encodeURIComponent(a.kode)}" class="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-[11px] font-bold flex items-center gap-1 transition" title="Ajukan Peminjaman">
              <i data-lucide="handshake" class="w-3 h-3"></i>
              <span>Pinjam</span>
            </a>
          ` : ''}
          ${(typeof hasRole === 'function' && hasRole('pimpinan')) ? `
            <span class="px-2 py-0.5 rounded text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200">Terpantau</span>
          ` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function renderGrid(list) {
  const grid = document.getElementById('asset-grid');
  grid.innerHTML = list.length ? list.map((a) => `
    <article class="rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition bg-white flex flex-col justify-between">
      <div>
        <img src="${a.foto || '../assets/laptop.jpg'}" onerror="this.src='https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80'" alt="${a.nama}" class="w-full h-28 object-cover">
        <div class="p-3 space-y-1.5">
          <div class="font-mono text-[10px] font-bold text-[#102f86]">${a.kode}</div>
          <div class="text-xs font-bold text-slate-900 leading-snug">${a.nama}</div>
          <div class="text-[10px] text-slate-600">${a.gedung} · ${a.ruang}</div>
          <div class="flex items-center gap-1.5 pt-1">
            <span class="chip-kategori">${a.kategori}</span>
            <span class="pill ${kondisiClass[a.kondisi] || 'pill-baik'}">${a.kondisi}</span>
          </div>
        </div>
      </div>
      <div class="p-3 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
        <button onclick="openQrModal('${a.kode}')" class="p-1 text-slate-500 hover:text-blue-700" title="Label QR">
          <i data-lucide="qr-code" class="w-3.5 h-3.5"></i>
        </button>
        <div class="flex items-center gap-1">
          ${(typeof hasPermission === 'function' && hasPermission('assets:edit')) ? `
            <button onclick="openEditModal('${a.kode}')" class="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold hover:bg-amber-100">
              Edit
            </button>
          ` : ''}
          ${(typeof hasPermission === 'function' && hasPermission('assets:delete')) ? `
            <button onclick="openDeleteModal('${a.kode}')" class="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold hover:bg-rose-100">
              Hapus
            </button>
          ` : ''}
          ${(typeof hasRole === 'function' && hasRole('peminjam') && a.status === 'Tersedia') ? `
            <a href="peminjaman.html?kode=${encodeURIComponent(a.kode)}" class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold hover:bg-blue-100">
              Pinjam
            </a>
          ` : ''}
        </div>
      </div>
    </article>
  `).join('') : `<p class="col-span-full py-10 text-center text-xs text-slate-500">Tidak ada aset yang cocok.</p>`;
}

function renderPagination(totalFilteredCount) {
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / state.rowsPerPage));
  if (state.page > totalPages) state.page = totalPages;
  if (state.page < 1) state.page = 1;

  const startItem = totalFilteredCount === 0 ? 0 : (state.page - 1) * state.rowsPerPage + 1;
  const endItem = Math.min(state.page * state.rowsPerPage, totalFilteredCount);
  const isFiltered = state.keyword || Object.values(state.filters).some(Boolean) || Object.values(state.advFilters || {}).some(v => v && v !== 'all');

  document.getElementById('page-info').innerHTML = isFiltered
    ? `Menampilkan <b class="text-slate-900">${startItem} - ${endItem}</b> dari <b class="text-slate-900">${totalFilteredCount}</b> hasil terfilter (<b class="text-slate-900">${assets.length}</b> total aset)`
    : `Menampilkan <b class="text-slate-900">${startItem} - ${endItem}</b> dari <b class="text-slate-900">${assets.length}</b> total aset`;

  const p = state.page;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  document.getElementById('pagination').innerHTML = `
    <button class="page-btn" data-page="1" ${p <= 1 ? 'disabled' : ''} aria-label="Halaman pertama"><i data-lucide="chevrons-left" class="w-3.5 h-3.5"></i></button>
    <button class="page-btn" data-page="${p - 1}" ${p <= 1 ? 'disabled' : ''} aria-label="Sebelumnya"><i data-lucide="chevron-left" class="w-3.5 h-3.5"></i></button>
    ${pages.map((n) => `<button class="page-btn ${n === p ? 'is-active' : ''}" data-page="${n}">${n}</button>`).join('')}
    <button class="page-btn" data-page="${p + 1}" ${p >= totalPages ? 'disabled' : ''} aria-label="Berikutnya"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i></button>
    <button class="page-btn" data-page="${totalPages}" ${p >= totalPages ? 'disabled' : ''} aria-label="Halaman terakhir"><i data-lucide="chevrons-right" class="w-3.5 h-3.5"></i></button>
  `;
}

function render() {
  renderStats();
  const list = getFilteredAssets();
  const totalPages = Math.max(1, Math.ceil(list.length / state.rowsPerPage));
  if (state.page > totalPages) state.page = totalPages;
  if (state.page < 1) state.page = 1;

  const startIdx = (state.page - 1) * state.rowsPerPage;
  const pagedList = list.slice(startIdx, startIdx + state.rowsPerPage);

  const tableWrap = document.getElementById('asset-table-body').closest('.overflow-x-auto');
  const grid = document.getElementById('asset-grid');

  if (state.view === 'table') {
    tableWrap.classList.remove('hidden');
    grid.classList.add('hidden');
    grid.classList.remove('grid');
    renderTable(pagedList);
  } else {
    tableWrap.classList.add('hidden');
    grid.classList.remove('hidden');
    grid.classList.add('grid');
    renderGrid(pagedList);
  }
  renderPagination(list.length);
  if (window.lucide) {
    lucide.createIcons();
  }
}


// ================= 3. CRUD & MODAL HANDLERS (DOM MANIPULATION) ================= //

// Sidebar Mobile Toggle
function toggleSidebar() {
  const sidebar = document.getElementById('main-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar) return;
  sidebar.classList.toggle('-translate-x-full');
  if (overlay) {
    overlay.classList.toggle('hidden');
  }
}

// Buka Modal Tambah Aset
function openAddModal() {
  if (typeof requirePermission === 'function') {
    if (!requirePermission('assets:create', 'Menambah Aset Baru')) return;
  }
  document.getElementById('modal-asset-title').textContent = 'Tambah Aset Baru';
  document.getElementById('modal-asset-subtitle').textContent = 'Lengkapi informasi inventaris sarana institusi dengan data valid';
  document.getElementById('btn-submit-asset-label').textContent = 'Simpan Data Aset';
  document.getElementById('form-mode').value = 'add';
  document.getElementById('form-orig-kode').value = '';

  // Generate kode aset default otomatis
  const nextNum = String(assets.length + 1).padStart(4, '0');
  const defaultKode = `SAR/2025/${nextNum}`;

  document.getElementById('form-kode').value = defaultKode;
  document.getElementById('form-kode').disabled = false;
  document.getElementById('form-serial').value = '';
  document.getElementById('form-nama').value = '';
  document.getElementById('form-kategori').value = '';
  document.getElementById('form-spesifikasi').value = '';
  document.getElementById('form-gedung').value = '';
  document.getElementById('form-ruang').value = '';
  document.getElementById('form-kondisi').value = 'Baik';
  document.getElementById('form-status').value = 'Tersedia';
  document.getElementById('form-pj').value = '';

  clearValidationErrors();

  const standaloneLink = document.getElementById('link-open-standalone-form');
  if (standaloneLink) standaloneLink.href = 'form.html?mode=add';

  const modal = document.getElementById('modal-asset-form');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  modal.style.display = 'flex';
  if (window.lucide) lucide.createIcons();
}

// Buka Modal Edit Aset
function openEditModal(kode) {
  if (typeof requirePermission === 'function') {
    if (!requirePermission('assets:edit', 'Mengubah Data Aset')) return;
  }
  let item = assets.find(a => a.kode === kode);
  if (!item && typeof getMergedPdfAssets === 'function') {
    const pdfItem = getMergedPdfAssets().find(r => r.code === kode || String(r.editId) === String(kode));
    if (pdfItem) {
      item = {
        kode: pdfItem.code,
        serial: pdfItem.code,
        nama: pdfItem.name,
        kategori: pdfItem.category || 'Elektronik',
        spesifikasi: pdfItem.spec || '-',
        gedung: pdfItem.gedung || 'Gedung TI',
        ruang: pdfItem.location || '-',
        kondisi: pdfItem.status === 'Rusak Berat' ? 'Rusak Ringan' : 'Baik',
        status: pdfItem.status === 'Sedang Dipinjam' ? 'Dipinjam' : (pdfItem.status === 'Dalam Perbaikan' ? 'Perawatan' : 'Tersedia'),
        pj: pdfItem.pic || 'Petugas Sarpras'
      };
    }
  }
  if (!item) return;

  document.getElementById('modal-asset-title').textContent = 'Edit Data Aset';
  document.getElementById('modal-asset-subtitle').textContent = `Memperbarui data inventaris fisik untuk ${item.kode}`;
  document.getElementById('btn-submit-asset-label').textContent = 'Perbarui Data Aset';
  document.getElementById('form-mode').value = 'edit';
  document.getElementById('form-orig-kode').value = item.kode;

  const setSelectSafely = (elId, rawVal) => {
    const sel = document.getElementById(elId);
    if (!sel) return;
    let val = String(rawVal || '').trim();
    if (elId === 'form-kategori') {
      const lc = val.toLowerCase();
      if (lc.includes('elektronik')) val = 'Elektronik';
      else if (lc.includes('lab')) val = 'Alat Lab';
      else if (lc.includes('mebel') || lc.includes('furnitur')) val = 'Mebel';
      else if (lc.includes('utilitas')) val = 'Utilitas';
    }
    if (val && !Array.from(sel.options).some(opt => opt.value === val)) {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = val;
      sel.appendChild(opt);
    }
    sel.value = val || sel.options[1]?.value || '';
  };

  document.getElementById('form-kode').value = item.kode;
  document.getElementById('form-kode').disabled = true; // Kode NUP adalah primary identifier
  document.getElementById('form-serial').value = item.serial || item.kode;
  document.getElementById('form-nama').value = item.nama;
  setSelectSafely('form-kategori', item.kategori);
  document.getElementById('form-spesifikasi').value = item.spesifikasi || '-';
  setSelectSafely('form-gedung', item.gedung);
  document.getElementById('form-ruang').value = item.ruang || '-';
  setSelectSafely('form-kondisi', item.kondisi || 'Baik');
  setSelectSafely('form-status', item.status || 'Tersedia');
  document.getElementById('form-pj').value = item.pj || 'Petugas Sarpras';

  clearValidationErrors();

  const standaloneLink = document.getElementById('link-open-standalone-form');
  if (standaloneLink) standaloneLink.href = `form.html?mode=edit&kode=${encodeURIComponent(item.kode)}`;

  const modal = document.getElementById('modal-asset-form');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  modal.style.display = 'flex';
  if (window.lucide) lucide.createIcons();
}

// Tutup Modal Form
function closeAssetModal() {
  const modal = document.getElementById('modal-asset-form');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  modal.style.display = 'none';
}

// Bersihkan pesan error validasi
function clearValidationErrors() {
  const errFields = ['kode', 'serial', 'nama', 'kategori', 'spesifikasi', 'gedung', 'ruang', 'pj'];
  errFields.forEach(f => {
    const el = document.getElementById(`err-${f}`);
    const input = document.getElementById(`form-${f}`);
    if (el) el.classList.add('hidden');
    if (input) input.classList.remove('border-rose-500', 'bg-rose-50/30');
  });
}

// Tampilkan pesan error validasi
function showFieldError(field, message) {
  const el = document.getElementById(`err-${field}`);
  const input = document.getElementById(`form-${field}`);
  if (el) {
    el.textContent = message;
    el.classList.remove('hidden');
  }
  if (input) {
    input.classList.add('border-rose-500', 'bg-rose-50/30');
  }
}

// Validasi Form Menggunakan JavaScript Murni
function validateAssetForm() {
  clearValidationErrors();
  let isValid = true;
  let firstInvalidInput = null;

  const kode = document.getElementById('form-kode').value.trim();
  const serial = document.getElementById('form-serial').value.trim();
  const nama = document.getElementById('form-nama').value.trim();
  const kategori = document.getElementById('form-kategori').value;
  const spesifikasi = document.getElementById('form-spesifikasi').value.trim();
  const gedung = document.getElementById('form-gedung').value;
  const ruang = document.getElementById('form-ruang').value.trim();
  const pj = document.getElementById('form-pj').value.trim();
  const mode = document.getElementById('form-mode').value;

  // Validasi Kode (mendukung format SAR/YYYY/XXXX maupun AST-XX-YYYY-NNN)
  if (!kode) {
    showFieldError('kode', 'Kode aset (NUP) wajib diisi.');
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = document.getElementById('form-kode');
  } else if (!/^[A-Za-z0-9][A-Za-z0-9\/-]{3,32}$/.test(kode)) {
    showFieldError('kode', 'Kode aset minimal 4 karakter (huruf, angka, / atau -). Contoh: SAR/2025/0105 atau AST-TI-2026-009');
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = document.getElementById('form-kode');
  } else if (mode === 'add' && (assets.some(a => a.kode === kode) || (typeof getMergedPdfAssets === 'function' && getMergedPdfAssets().some(r => r.code === kode)))) {
    showFieldError('kode', 'Kode aset ini sudah terdaftar di sistem. Gunakan kode unik.');
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = document.getElementById('form-kode');
  }

  // Validasi Nomor Seri
  if (!serial) {
    showFieldError('serial', 'Nomor seri barang wajib diisi.');
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = document.getElementById('form-serial');
  } else if (serial.length < 4) {
    showFieldError('serial', 'Nomor seri minimal 4 karakter.');
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = document.getElementById('form-serial');
  }

  // Validasi Nama Barang
  if (!nama) {
    showFieldError('nama', 'Nama sarana / barang wajib diisi.');
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = document.getElementById('form-nama');
  } else if (nama.length < 3) {
    showFieldError('nama', 'Nama barang minimal 3 karakter.');
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = document.getElementById('form-nama');
  }

  // Validasi Kategori
  if (!kategori) {
    showFieldError('kategori', 'Silakan pilih kategori aset.');
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = document.getElementById('form-kategori');
  }

  // Validasi Spesifikasi
  if (!spesifikasi) {
    showFieldError('spesifikasi', 'Spesifikasi teknis wajib diisi.');
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = document.getElementById('form-spesifikasi');
  }

  // Validasi Gedung
  if (!gedung) {
    showFieldError('gedung', 'Silakan pilih gedung lokasi aset.');
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = document.getElementById('form-gedung');
  }

  // Validasi Ruangan
  if (!ruang) {
    showFieldError('ruang', 'Nama ruangan spesifik wajib diisi.');
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = document.getElementById('form-ruang');
  }

  // Validasi Penanggung Jawab
  if (!pj) {
    showFieldError('pj', 'Nama penanggung jawab (PJ) wajib diisi.');
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = document.getElementById('form-pj');
  } else if (pj.length < 3) {
    showFieldError('pj', 'Nama PJ minimal 3 karakter.');
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = document.getElementById('form-pj');
  }

  if (firstInvalidInput) {
    firstInvalidInput.focus();
  }

  return isValid;
}

// Handler Submit Form Tambah & Edit
function handleAssetFormSubmit(e) {
  e.preventDefault();

  if (!validateAssetForm()) {
    showToast('Mohon perbaiki data input yang belum valid.', 'error');
    return;
  }

  const mode = document.getElementById('form-mode').value;
  const kode = document.getElementById('form-kode').value.trim();
  const serial = document.getElementById('form-serial').value.trim();
  const nama = document.getElementById('form-nama').value.trim();
  const kategori = document.getElementById('form-kategori').value;
  const spesifikasi = document.getElementById('form-spesifikasi').value.trim();
  const gedung = document.getElementById('form-gedung').value;
  const ruang = document.getElementById('form-ruang').value.trim();
  const kondisi = document.getElementById('form-kondisi').value;
  const status = document.getElementById('form-status').value;
  const pj = document.getElementById('form-pj').value.trim();

  // Foto aset berdasarkan kategori
  let fotoDefault = '../assets/laptop.jpg';
  if (kategori === 'Alat Lab') fotoDefault = '../assets/mikroskop.jpg';
  else if (kategori === 'Utilitas') fotoDefault = '../assets/ac.jpg';
  else if (kategori === 'Mebel') fotoDefault = '../assets/meja-rapat.jpg';
  else if (kategori === 'Elektronik') fotoDefault = '../assets/proyektor.jpg';

  if (mode === 'add') {
    // TAMBAH DATA (CREATE)
    const newAsset = {
      kode,
      serial,
      nama,
      spesifikasi,
      foto: fotoDefault,
      kategori,
      gedung,
      ruang,
      kondisi,
      status,
      pj,
      nilai: kategori === 'Elektronik' ? 24000000 : kategori === 'Mebel' ? 65000000 : 15000000
    };
    assets.unshift(newAsset);
    saveStoredAssets(assets);
    closeAssetModal();
    render();
    pdfSelectedAssetCode = kode;
    renderPdfAssetView();
    showToast(`Aset baru ${kode} (${nama}) berhasil ditambahkan ke inventaris!`, 'success');

    if (typeof API !== 'undefined') {
      API.createAsset({
        nama,
        kode,
        serial,
        desc: spesifikasi,
        kategori_nama: kategori,
        gedung,
        lokasi: ruang,
        kondisi,
        status,
        pic: pj,
        foto: fotoDefault,
        nilai: newAsset.nilai
      }).then(apiRes => {
        if (apiRes && apiRes.success) {
          loadAssetsFromBackend().then(() => renderPdfAssetView());
        }
      });
    }
  } else {
    // EDIT DATA (UPDATE)
    const origKode = document.getElementById('form-orig-kode').value;
    const index = assets.findIndex(a => a.kode === origKode);
    if (index !== -1) {
      assets[index] = {
        ...assets[index],
        serial,
        nama,
        spesifikasi,
        kategori,
        gedung,
        ruang,
        kondisi,
        status,
        pj
      };
      saveStoredAssets(assets);
    } else {
      // Edit pada item default PDF yang belum ada di array legacy
      const pdfIdx = pdfAssetRowsDefault.findIndex(r => r.code === origKode);
      if (pdfIdx !== -1) {
        const mappedStatus = status === 'Dipinjam' ? 'Sedang Dipinjam' : (status === 'Perawatan' ? 'Dalam Perbaikan' : (kondisi === 'Rusak Berat' ? 'Rusak Berat' : 'Kondisi Baik'));
        const mappedClass = mappedStatus === 'Sedang Dipinjam' ? 'bg-blue-50 text-blue-700' : (mappedStatus === 'Dalam Perbaikan' ? 'bg-amber-50 text-amber-700' : (mappedStatus === 'Rusak Berat' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'));
        pdfAssetRowsDefault[pdfIdx] = {
          ...pdfAssetRowsDefault[pdfIdx],
          name: nama,
          spec: spesifikasi,
          location: ruang,
          gedung,
          category: mapAssetCategoryLabel(kategori),
          status: mappedStatus,
          statusClass: mappedClass,
          lokasiFisik: `${ruang} (${gedung})`,
          pic: pj
        };
      }
    }
    closeAssetModal();
    render();
    pdfSelectedAssetCode = origKode;
    renderPdfAssetView();
    showToast(`Data aset ${origKode} berhasil diperbarui!`, 'success');

    const item = assets.find(a => a.kode === origKode);
    if (typeof API !== 'undefined' && item && item.id) {
      API.updateAsset(item.id, {
        nama,
        serial,
        desc: spesifikasi,
        kategori_nama: kategori,
        gedung,
        lokasi: ruang,
        kondisi,
        status,
        pic: pj
      }).then(apiRes => {
        if (apiRes && apiRes.success) {
          loadAssetsFromBackend().then(() => renderPdfAssetView());
        }
      });
    }
  }
}

// State Penghapusan Aset
let assetToDeleteKode = null;

// Buka Modal Konfirmasi Hapus
function openDeleteModal(kode) {
  if (typeof requirePermission === 'function') {
    if (!requirePermission('assets:delete', 'Menghapus Data Aset')) return;
  }
  let item = assets.find(a => a.kode === kode);
  if (!item && typeof getMergedPdfAssets === 'function') {
    const pdfItem = getMergedPdfAssets().find(r => r.code === kode);
    if (pdfItem) {
      item = { kode: pdfItem.code, nama: pdfItem.name, id: pdfItem.dbId || null };
    }
  }
  if (!item) return;

  assetToDeleteKode = kode;
  document.getElementById('del-asset-name').textContent = item.nama;
  document.getElementById('del-asset-code').textContent = item.kode;

  const modal = document.getElementById('modal-delete-confirm');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  modal.style.display = 'flex';
  if (window.lucide) lucide.createIcons();
}

// Tutup Modal Hapus
function closeDeleteModal() {
  assetToDeleteKode = null;
  const modal = document.getElementById('modal-delete-confirm');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  modal.style.display = 'none';
}

// Konfirmasi Hapus Aset (DELETE)
async function confirmDeleteAsset() {
  if (typeof requirePermission === 'function') {
    if (!requirePermission('assets:delete', 'Menghapus Data Aset')) return;
  }
  if (!assetToDeleteKode) return;

  const targetKode = assetToDeleteKode;
  const item = assets.find(a => a.kode === targetKode);
  const index = assets.findIndex(a => a.kode === targetKode);
  let deletedName = item ? item.nama : targetKode;

  if (index !== -1) {
    const deleted = assets.splice(index, 1)[0];
    deletedName = deleted.nama;
    saveStoredAssets(assets);
  }
  const pdfIdx = pdfAssetRowsDefault.findIndex(r => r.code === targetKode);
  if (pdfIdx !== -1) {
    deletedName = pdfAssetRowsDefault[pdfIdx].name || deletedName;
    pdfAssetRowsDefault.splice(pdfIdx, 1);
  }

  closeDeleteModal();
  render();
  renderPdfAssetView();
  showToast(`Aset ${targetKode} (${deletedName}) berhasil dihapus dari inventaris.`, 'info');

  if (typeof API !== 'undefined' && item && item.id) {
    await API.deleteAsset(item.id);
    await loadAssetsFromBackend();
    renderPdfAssetView();
  }
}

async function loadAssetsFromBackend() {
  if (typeof API !== 'undefined') {
    const res = await API.getAssets();
    if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
      const backendAssets = res.data.map(a => ({
        id: a.id,
        kode: a.kode || a.nup,
        nup: a.nup,
        serial: a.serial || '-',
        nama: a.nama,
        spesifikasi: a.desc || '',
        foto: a.foto || (a.kategori_nama === 'Alat Lab' ? '../assets/mikroskop.jpg' : a.kategori_nama === 'Utilitas' ? '../assets/ac.jpg' : a.kategori_nama === 'Mebel' ? '../assets/meja-rapat.jpg' : '../assets/laptop.jpg'),
        kategori: a.kategori_nama || 'Elektronik',
        gedung: a.gedung || 'Gedung Rektorat (Pusat)',
        ruang: a.lokasi || 'Ruang Rapat',
        kondisi: a.kondisi || 'Baik',
        status: a.status || 'Tersedia',
        pj: a.pic || 'Petugas Sarpras',
        nilai: a.nilai || (a.kategori_nama === 'Elektronik' ? 24000000 : a.kategori_nama === 'Mebel' ? 65000000 : 15000000)
      }));

      // Prioritaskan data inventaris aktual dari database SQLite di urutan teratas
      const existingKodes = new Set(backendAssets.map(b => b.kode));
      const existingNups = new Set(backendAssets.map(b => b.nup).filter(Boolean));
      const localOnly = assets.filter(a => !existingKodes.has(a.kode) && !existingNups.has(a.kode));
      assets = [...backendAssets, ...localOnly];
      saveStoredAssets(assets);
      render();
    }
  }
}

// Modal Preview QR
function openQrModal(kode) {
  let item = assets.find(a => a.kode === kode);
  if (!item && typeof getMergedPdfAssets === 'function') {
    const pdfItem = getMergedPdfAssets().find(r => r.code === kode || String(r.editId) === String(kode));
    if (pdfItem) {
      item = {
        kode: pdfItem.code,
        nama: pdfItem.name,
        gedung: pdfItem.gedung || pdfItem.location,
        pj: pdfItem.pic || 'Sarpras Kampus'
      };
    }
  }
  if (!item) return;

  document.getElementById('qr-modal-code').textContent = item.kode;
  document.getElementById('qr-modal-name').textContent = item.nama;
  document.getElementById('qr-modal-loc').textContent = `${item.gedung} • ${item.pj}`;
  document.getElementById('qr-modal-image').src = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(item.kode + ' - ' + item.nama)}`;

  const modal = document.getElementById('modal-qr-preview');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  modal.style.display = 'flex';
  if (window.lucide) lucide.createIcons();
}

function closeQrModal() {
  const modal = document.getElementById('modal-qr-preview');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  modal.style.display = 'none';
}

window.downloadQrLabelHTML = function() {
  const kode = document.getElementById('qr-modal-code')?.textContent || 'AST-SIMAS';
  const nama = document.getElementById('qr-modal-name')?.textContent || 'Aset Sarpras';
  const loc = document.getElementById('qr-modal-loc')?.textContent || 'Kampus Terpadu';
  const qrSrc = document.getElementById('qr-modal-image')?.src || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(kode)}`;

  const html = `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>Label QR ${kode}</title>
<style>body{font-family:Arial,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f8fafc;margin:0}
.card{width:320px;border:2px dashed #1e3a8a;border-radius:14px;background:#fff;padding:24px;text-align:center}
.hdr{font-size:11px;font-weight:800;letter-spacing:.12em;color:#0f2a71;margin-bottom:12px}
img{width:160px;height:160px;border:1px solid #e2e8f0;border-radius:8px;padding:6px;background:#fff}
.code{font-family:monospace;font-size:15px;font-weight:800;color:#1e3a8a;margin-top:12px}
.name{font-size:14px;font-weight:700;color:#0f172a;margin-top:4px}
.loc{font-size:11px;color:#475569;margin-top:4px}</style></head>
<body><div class="card"><div class="hdr">INSTITUSI SARPRAS RESMI — SIMAS</div>
<img src="${qrSrc}" alt="QR ${kode}"/><div class="code">${kode}</div><div class="name">${nama}</div><div class="loc">${loc}</div></div></body></html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Label_QR_${kode.replace(/[^A-Za-z0-9_-]/g, '_')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast(`Label QR untuk ${kode} berhasil diunduh (siap cetak).`, 'success');
};

function openBatchQrModal() {
  const rows = typeof getMergedPdfAssets === 'function' ? getMergedPdfAssets() : [];
  const cardsHtml = rows.map(r => `
    <div style="border:1.5px dashed #1e3a8a;border-radius:10px;padding:14px;text-align:center;background:#fff;">
      <div style="font-size:9px;font-weight:800;color:#0f2a71;letter-spacing:.1em;margin-bottom:8px;">SIMAS SARPRAS</div>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(r.code + ' - ' + r.name)}" style="width:110px;height:110px;" />
      <div style="font-family:monospace;font-size:12px;font-weight:800;color:#1e3a8a;margin-top:8px;">${r.code}</div>
      <div style="font-size:11px;font-weight:700;color:#0f172a;margin-top:2px;">${r.name}</div>
    </div>`).join('');
  const html = `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>Batch Label QR SIMAS</title></head><body style="font-family:Arial,sans-serif;padding:24px;background:#f8fafc;"><h2 style="color:#0f2a71;">Lembar Label QR Inventaris SIMAS (${rows.length} Unit)</h2><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">${cardsHtml}</div></body></html>`;
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SIMAS_Batch_QR_${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast(`Dokumen batch label QR (${rows.length} aset) berhasil diunduh.`, 'success');
}

// Ekspor Data Aset ke CSV
function exportAssetsCSV() {
  const headers = ['KODE ASET', 'SERIAL NUMBER', 'NAMA BARANG', 'KATEGORI', 'GEDUNG', 'RUANGAN', 'KONDISI', 'STATUS', 'PENANGGUNG JAWAB'];
  const rows = assets.map(a => [
    `"${(a.kode || '').replace(/"/g, '""')}"`,
    `"${(a.serial || '').replace(/"/g, '""')}"`,
    `"${(a.nama || '').replace(/"/g, '""')}"`,
    `"${(a.kategori || '').replace(/"/g, '""')}"`,
    `"${(a.gedung || '').replace(/"/g, '""')}"`,
    `"${(a.ruang || '').replace(/"/g, '""')}"`,
    `"${(a.kondisi || '').replace(/"/g, '""')}"`,
    `"${(a.status || '').replace(/"/g, '""')}"`,
    `"${(a.pj || '').replace(/"/g, '""')}"`
  ]);

  const BOM = '\uFEFF';
  const delimiter = ';';
  const csvContent = BOM + [headers.join(delimiter), ...rows.map(e => e.join(delimiter))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SIMAS_Inventaris_Aset_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('File CSV Inventaris Aset berhasil diunduh.', 'success');
}

// Toast Notifikasi
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-emerald-800 text-white' : type === 'error' ? 'bg-rose-800 text-white' : 'bg-slate-900 text-white';
  const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info';

  toast.className = `flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold ${bgClass} transform transition-all duration-300 translate-y-2 opacity-0 pointer-events-auto`;
  toast.innerHTML = `
    <i data-lucide="${icon}" class="w-4 h-4 shrink-0"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}


// ================= 4. EVENT HANDLERS & INIT ================= //

function bindEvents() {
  document.getElementById('asset-search').addEventListener('input', (e) => {
    state.keyword = e.target.value.trim();
    state.page = 1;
    render();
  });

  const globalSearch = document.getElementById('global-search');
  if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
      state.keyword = e.target.value.trim();
      const assetSearch = document.getElementById('asset-search');
      if (assetSearch && assetSearch.value !== e.target.value) {
        assetSearch.value = e.target.value;
      }
      state.page = 1;
      render();
    });
  }

  const rowsPerPageSelect = document.getElementById('rows-per-page');
  if (rowsPerPageSelect) {
    rowsPerPageSelect.addEventListener('change', (e) => {
      state.rowsPerPage = parseInt(e.target.value) || 10;
      state.page = 1;
      render();
    });
  }

  document.getElementById('quick-filters').addEventListener('change', (e) => {
    const key = e.target.dataset.filter;
    if (key) {
      state.filters[key] = e.target.value;
      state.page = 1;
      render();
    }
  });

  document.getElementById('btn-reset-filter').addEventListener('click', () => {
    state.keyword = '';
    state.page = 1;
    Object.keys(state.filters).forEach((k) => { state.filters[k] = ''; });
    state.advFilters = { kategori: 'all', kondisi: 'all', status: 'all', nilai: 'all' };
    document.getElementById('asset-search').value = '';
    if (document.getElementById('global-search')) document.getElementById('global-search').value = '';
    document.querySelectorAll('.quick-select').forEach((s) => { s.value = ''; });
    if (document.getElementById('adv-filter-kategori')) document.getElementById('adv-filter-kategori').value = 'all';
    if (document.getElementById('adv-filter-kondisi')) document.getElementById('adv-filter-kondisi').value = 'all';
    if (document.getElementById('adv-filter-status')) document.getElementById('adv-filter-status').value = 'all';
    if (document.getElementById('adv-filter-nilai')) document.getElementById('adv-filter-nilai').value = 'all';
    render();
    showToast('Semua filter berhasil direset.', 'info');
  });

  document.querySelectorAll('.view-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.view = btn.dataset.view;
      document.querySelectorAll('.view-btn').forEach((b) => b.classList.toggle('is-active', b === btn));
      render();
    });
  });

  document.getElementById('sort-kode').addEventListener('click', () => {
    state.sortAsc = state.sortAsc === null ? true : !state.sortAsc;
    render();
  });

  document.getElementById('check-all').addEventListener('change', (e) => {
    document.querySelectorAll('.row-check').forEach((c) => { c.checked = e.target.checked; });
  });

  document.getElementById('pagination').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-page]');
    if (!btn || btn.disabled) return;
    state.page = Number(btn.dataset.page);
    render();
  });

  // Advanced Filter Toggle & Actions
  const btnFilterLanjut = document.getElementById('btn-filter-lanjut');
  const advPanel = document.getElementById('advanced-filter-panel');
  if (btnFilterLanjut && advPanel) {
    btnFilterLanjut.addEventListener('click', () => {
      advPanel.classList.toggle('hidden');
    });
  }

  const btnAdvApply = document.getElementById('btn-adv-apply');
  if (btnAdvApply) {
    btnAdvApply.addEventListener('click', () => {
      state.advFilters = {
        kategori: document.getElementById('adv-filter-kategori')?.value || 'all',
        kondisi: document.getElementById('adv-filter-kondisi')?.value || 'all',
        status: document.getElementById('adv-filter-status')?.value || 'all',
        nilai: document.getElementById('adv-filter-nilai')?.value || 'all'
      };
      render();
      showToast('Filter lanjut berhasil diterapkan!', 'success');
    });
  }

  const btnAdvReset = document.getElementById('btn-adv-reset');
  if (btnAdvReset) {
    btnAdvReset.addEventListener('click', () => {
      state.advFilters = { kategori: 'all', kondisi: 'all', status: 'all', nilai: 'all' };
      if (document.getElementById('adv-filter-kategori')) document.getElementById('adv-filter-kategori').value = 'all';
      if (document.getElementById('adv-filter-kondisi')) document.getElementById('adv-filter-kondisi').value = 'all';
      if (document.getElementById('adv-filter-status')) document.getElementById('adv-filter-status').value = 'all';
      if (document.getElementById('adv-filter-nilai')) document.getElementById('adv-filter-nilai').value = 'all';
      render();
      showToast('Filter lanjut direset.', 'info');
    });
  }

  // Explicit Tambah Aset button listeners
  const btnTambahAset = document.getElementById('btn-tambah-aset');
  if (btnTambahAset) btnTambahAset.addEventListener('click', openAddModal);

  const btnTambahAksi = document.getElementById('btn-tambah-aksi');
  if (btnTambahAksi) btnTambahAksi.addEventListener('click', openAddModal);

  const btnExport = document.getElementById('btn-export');
  if (btnExport) btnExport.addEventListener('click', exportAssetsCSV);

  const btnCetakQr = document.getElementById('btn-cetak-qr');
  if (btnCetakQr) btnCetakQr.addEventListener('click', openBatchQrModal);

  // Close modals on backdrop click
  ['modal-asset-form', 'modal-delete-confirm', 'modal-qr-preview'].forEach((modalId) => {
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
      modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) {
          if (modalId === 'modal-asset-form') closeAssetModal();
          else if (modalId === 'modal-delete-confirm') closeDeleteModal();
          else if (modalId === 'modal-qr-preview') closeQrModal();
        }
      });
    }
  });

  // Shortcut: Ctrl/⌘ + K fokus ke pencarian aset, Escape menutup modal
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      document.getElementById('asset-search').focus();
    }
    if (e.key === 'Escape') {
      closeAssetModal();
      closeDeleteModal();
      closeQrModal();
    }
  });
}

function applyRbacToAssetPage() {
  if (typeof hasPermission !== 'function') return;
  if (!hasPermission('assets:create')) {
    const btnAdd1 = document.getElementById('btn-tambah-aksi');
    const btnAdd2 = document.getElementById('btn-tambah-aset');
    const btnImport = document.getElementById('btn-import');
    const linkForm = document.querySelector('a[href="form.html"]');
    if (btnAdd1) btnAdd1.style.display = 'none';
    if (btnAdd2) btnAdd2.style.display = 'none';
    if (btnImport) btnImport.style.display = 'none';
    if (linkForm) linkForm.style.display = 'none';
  }
  if (!hasPermission('reports:export')) {
    const btnExport = document.getElementById('btn-export');
    const btnCetakQr = document.getElementById('btn-cetak-qr');
    if (btnExport) btnExport.style.display = 'none';
    if (btnCetakQr) btnCetakQr.style.display = 'none';
  }
  const pageTitle = document.querySelector('main h1');
  if (pageTitle && typeof getCurrentUser === 'function') {
    const u = getCurrentUser();
    if (u.role === 'peminjam') {
      pageTitle.textContent = 'Katalog Sarana & Peralatan Kampus';
    } else if (u.role === 'pimpinan') {
      pageTitle.textContent = 'Monitoring Inventaris & Valuasi Aset';
    }
  }
}

const pdfAssetRowsDefault = [
  {
    code: 'AST-TI-2024-001',
    name: 'Laptop ASUS ROG Strix G16',
    spec: 'Core i9, RAM 32GB, RTX 4070',
    location: 'Lab Multimedia Lt. 3',
    gedung: 'Gedung TI',
    category: 'Elektronik & IT',
    status: 'Kondisi Baik',
    statusClass: 'bg-emerald-50 text-emerald-700',
    tahun: '2024 (APBN Kampus)',
    harga: 'Rp 28.500.000',
    lokasiFisik: 'Lab Multimedia Lt. 3 (Meja 01)',
    pic: 'Joko Supriyanto, A.Md',
    garansi: 'Aktif s/d Des 2026',
    editId: 1
  },
  {
    code: 'AST-TI-2024-002',
    name: 'Proyektor Epson EB-X500',
    spec: '3600 Lumens, HDMI, XGA',
    location: 'Ruang Seminar 302',
    gedung: 'Gedung Utama',
    category: 'Elektronik & IT',
    status: 'Sedang Dipinjam',
    statusClass: 'bg-blue-50 text-blue-700',
    tahun: '2024 (Hibah Dikti)',
    harga: 'Rp 8.450.000',
    lokasiFisik: 'Ruang Seminar 302 (Gedung Utama)',
    pic: 'Bambang Irawan, S.Kom',
    garansi: 'Aktif s/d Nov 2026',
    editId: 2
  },
  {
    code: 'AST-FT-2023-014',
    name: 'AC Daikin Inverter 2 PK',
    spec: 'R32 Eco-Friendly, Split Wall',
    location: 'Lab Jaringan Lt. 2',
    gedung: 'Gedung Teknik',
    category: 'Elektronik & IT',
    status: 'Dalam Perbaikan',
    statusClass: 'bg-amber-50 text-amber-700',
    tahun: '2023 (Dana Rutin)',
    harga: 'Rp 9.200.000',
    lokasiFisik: 'Lab Jaringan Lt. 2 (Gedung Teknik)',
    pic: 'Joko Supriyanto, A.Md',
    garansi: 'Aktif s/d Agu 2026',
    editId: 3
  },
  {
    code: 'AST-MIPA-2022-088',
    name: 'Mikroskop Olympus CX23',
    spec: 'Binokuler LED, Lensa Objektif 4x-100x',
    location: 'Lab Biologi Dasar',
    gedung: 'Gedung MIPA',
    category: 'Peralatan Lab',
    status: 'Kondisi Baik',
    statusClass: 'bg-emerald-50 text-emerald-700',
    tahun: '2022 (APBN Kampus)',
    harga: 'Rp 16.800.000',
    lokasiFisik: 'Lab Biologi Dasar (Lemari B-04)',
    pic: 'Dr. Rina Kusuma, M.Si',
    garansi: 'Habis Masa Garansi',
    editId: 4
  },
  {
    code: 'AST-UM-2024-045',
    name: 'Sound System Yamaha StagePas',
    spec: '600BT Portable PA System + 2 Mic',
    location: 'Gudang Sarpras Pusat',
    gedung: 'Rektorat Lt. 1',
    category: 'Elektronik & IT',
    status: 'Kondisi Baik',
    statusClass: 'bg-emerald-50 text-emerald-700',
    tahun: '2024 (Dana Kampus)',
    harga: 'Rp 14.500.000',
    lokasiFisik: 'Gudang Sarpras Pusat (Rak A-02)',
    pic: 'Bambang Irawan, S.Kom',
    garansi: 'Aktif s/d Okt 2027',
    editId: 5
  },
  {
    code: 'AST-FT-2021-009',
    name: 'Switch Cisco Catalyst 24-Port',
    spec: 'Gigabit Managed Rackmount Switch',
    location: 'Ruang Server Fakultas',
    gedung: 'Gedung TI Lt. 1',
    category: 'Elektronik & IT',
    status: 'Rusak Berat',
    statusClass: 'bg-red-50 text-red-700',
    tahun: '2021 (APBN Kampus)',
    harga: 'Rp 11.750.000',
    lokasiFisik: 'Ruang Server Fakultas (Rack 01)',
    pic: 'Joko Supriyanto, A.Md',
    garansi: 'Habis Masa Garansi',
    editId: 6
  }
];

let pdfSelectedAssetCode = null;
let pdfActiveCategory = 'Semua';
let pdfSearchQuery = '';
let pdfStatusFilter = 'Semua';
let pdfGedungFilter = 'Semua';

let pdfCustomAddedAssets = [];

function mapAssetCategoryLabel(rawCat) {
  const c = String(rawCat || '').toLowerCase();
  if (c.includes('lab') || c.includes('alat lab')) return 'Peralatan Lab';
  if (c.includes('mebel') || c.includes('furnitur')) return 'Furnitur & Meubeler';
  if (c.includes('kendaraan') || c.includes('bus') || c.includes('mobil')) return 'Kendaraan';
  return 'Elektronik & IT';
}

function getMergedPdfAssets() {
  const seen = new Set();
  const merged = [];

  // 1. Prioritize live SQLite assets loaded into `assets`
  (assets || []).forEach(a => {
    const code = a.kode || a.nup;
    if (!code || seen.has(code)) return;
    seen.add(code);
    const stRaw = String(a.status || 'Tersedia').toLowerCase();
    const condRaw = String(a.kondisi || 'Baik').toLowerCase();
    let statusLabel = 'Kondisi Baik';
    let statusClass = 'bg-emerald-50 text-emerald-700';
    if (stRaw.includes('pinjam')) {
      statusLabel = 'Sedang Dipinjam';
      statusClass = 'bg-blue-50 text-blue-700';
    } else if (stRaw.includes('rawat') || stRaw.includes('servis') || stRaw.includes('perbaik')) {
      statusLabel = 'Dalam Perbaikan';
      statusClass = 'bg-amber-50 text-amber-700';
    } else if (condRaw.includes('rusak berat')) {
      statusLabel = 'Rusak Berat';
      statusClass = 'bg-red-50 text-red-700';
    } else if (condRaw.includes('rusak')) {
      statusLabel = 'Dalam Perbaikan';
      statusClass = 'bg-amber-50 text-amber-700';
    }

    const hargaFmt = a.nilai ? `Rp ${Number(a.nilai).toLocaleString('id-ID')}` : 'Rp 15.000.000';
    merged.push({
      dbId: a.id || null,
      code,
      nup: a.nup || code,
      name: a.nama || 'Aset Sarpras',
      spec: a.spesifikasi || 'Unit Terverifikasi Inventaris SIMAS',
      location: a.ruang || 'Ruang Sarpras',
      gedung: a.gedung || 'Gedung Utama',
      category: mapAssetCategoryLabel(a.kategori),
      status: statusLabel,
      statusClass,
      tahun: '2025 (Inventaris Kampus)',
      harga: hargaFmt,
      lokasiFisik: `${a.ruang || '-'} (${a.gedung || '-'})`,
      pic: a.pj || 'Petugas Sarpras',
      garansi: 'Aktif s/d Des 2026',
      editId: a.id || code
    });
  });

  // 2. Append any default catalog rows not already in backend
  pdfAssetRowsDefault.forEach(r => {
    if (!seen.has(r.code)) {
      seen.add(r.code);
      merged.push(r);
    }
  });

  return merged;
}

window.selectPdfAssetRow = function(code) {
  pdfSelectedAssetCode = code;
  renderPdfAssetView();
};

window.setPdfAssetCategory = function(cat) {
  pdfActiveCategory = cat;
  renderPdfAssetView();
};

window.onPdfAssetSearch = function(val) {
  pdfSearchQuery = val || '';
  renderPdfAssetView(true);
};

window.onPdfAssetStatusChange = function(val) {
  pdfStatusFilter = val;
  renderPdfAssetView();
};

window.onPdfAssetGedungChange = function(val) {
  pdfGedungFilter = val;
  renderPdfAssetView();
};

function renderPdfAssetView(preserveFocus = false) {
  const mainEl = document.querySelector('main');
  if (!mainEl) return;

  Array.from(mainEl.children).forEach(ch => {
    if (ch.id !== 'simas-pdf-aset-root' && !ch.id?.startsWith('modal-')) {
      ch.classList.add('hidden');
    }
  });

  let root = document.getElementById('simas-pdf-aset-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'simas-pdf-aset-root';
    mainEl.prepend(root);
  }

  const u = typeof getCurrentUser === 'function' ? getCurrentUser() : { role: 'admin' };
  const canCreate = typeof hasPermission === 'function' ? hasPermission('assets:create') : (u.role === 'admin' || u.role === 'petugas');
  const canEdit = typeof hasPermission === 'function' ? hasPermission('assets:edit') : (u.role === 'admin' || u.role === 'petugas');
  const canDelete = typeof hasPermission === 'function' ? hasPermission('assets:delete') : (u.role === 'admin');
  const isPeminjam = u.role === 'peminjam';

  const allRows = getMergedPdfAssets();
  const filteredRows = allRows.filter(item => {
    if (pdfActiveCategory !== 'Semua' && item.category !== pdfActiveCategory) return false;
    if (pdfStatusFilter !== 'Semua' && item.status !== pdfStatusFilter) return false;
    if (pdfGedungFilter !== 'Semua' && !item.gedung.toLowerCase().includes(pdfGedungFilter.toLowerCase())) return false;
    if (pdfSearchQuery.trim() !== '') {
      const q = pdfSearchQuery.toLowerCase();
      return (
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.spec.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedAsset = allRows.find(r => r.code === pdfSelectedAssetCode) || filteredRows[0] || allRows[0] || {
    code: '-', name: 'Belum ada aset', spec: '-', location: '-', gedung: '-', status: 'Kondisi Baik',
    tahun: '-', harga: '-', lokasiFisik: '-', pic: '-', garansi: '-'
  };

  const countCat = (cat) => allRows.filter(r => r.category === cat).length;
  const categories = [
    { key: 'Semua', label: `Semua Kategori (${allRows.length})` },
    { key: 'Elektronik & IT', label: `Elektronik & IT (${countCat('Elektronik & IT')})` },
    { key: 'Furnitur & Meubeler', label: `Furnitur & Meubeler (${countCat('Furnitur & Meubeler')})` },
    { key: 'Peralatan Lab', label: `Peralatan Lab (${countCat('Peralatan Lab')})` },
    { key: 'Kendaraan', label: `Kendaraan (${countCat('Kendaraan')})` }
  ];

  root.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
      <h2 class="text-base font-bold text-slate-900 mb-3">${isPeminjam ? 'Katalog Aset & Peralatan Tersedia' : `Katalog Inventaris Sarana (${allRows.length} Aset Tercatat)`}</h2>

      <!-- Category Pills -->
      <div class="flex flex-wrap items-center gap-2 mb-3">
        ${categories.map(c => {
          const active = pdfActiveCategory === c.key;
          return `<button type="button" onclick="setPdfAssetCategory('${c.key}')" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            active
              ? 'bg-[#1D4ED8] text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200/80'
          }">${c.label}</button>`;
        }).join('')}
      </div>

      <!-- Filter Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div class="flex flex-wrap items-center gap-2.5 flex-1">
          <div class="relative min-w-[240px] max-w-xs flex-1">
            <input id="pdf-asset-search-input" type="text" value="${pdfSearchQuery.replace(/"/g, '&quot;')}" oninput="onPdfAssetSearch(this.value)" placeholder="Filter nama atau kode aset..." class="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 bg-white" />
          </div>
          <select onchange="onPdfAssetStatusChange(this.value)" class="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer">
            <option value="Semua" ${pdfStatusFilter === 'Semua' ? 'selected' : ''}>Status: Semua Kondisi ▾</option>
            <option value="Kondisi Baik" ${pdfStatusFilter === 'Kondisi Baik' ? 'selected' : ''}>Kondisi Baik</option>
            <option value="Sedang Dipinjam" ${pdfStatusFilter === 'Sedang Dipinjam' ? 'selected' : ''}>Sedang Dipinjam</option>
            <option value="Dalam Perbaikan" ${pdfStatusFilter === 'Dalam Perbaikan' ? 'selected' : ''}>Dalam Perbaikan</option>
            <option value="Rusak Berat" ${pdfStatusFilter === 'Rusak Berat' ? 'selected' : ''}>Rusak Berat</option>
          </select>
          <select onchange="onPdfAssetGedungChange(this.value)" class="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer">
            <option value="Semua" ${pdfGedungFilter === 'Semua' ? 'selected' : ''}>Gedung: Semua Lokasi ▾</option>
            <option value="Gedung TI" ${pdfGedungFilter === 'Gedung TI' ? 'selected' : ''}>Gedung TI</option>
            <option value="Gedung Utama" ${pdfGedungFilter === 'Gedung Utama' ? 'selected' : ''}>Gedung Utama</option>
            <option value="Gedung Teknik" ${pdfGedungFilter === 'Gedung Teknik' ? 'selected' : ''}>Gedung Teknik</option>
            <option value="Gedung MIPA" ${pdfGedungFilter === 'Gedung MIPA' ? 'selected' : ''}>Gedung MIPA</option>
          </select>
        </div>
        ${canCreate ? `
          <button type="button" onclick="openAddModal()" class="px-4 py-2 rounded-lg bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition cursor-pointer">
            + Tambah Aset Baru
          </button>
        ` : ''}
      </div>

      <!-- Main 12-Col Split -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <!-- Left 8 Cols: Asset List -->
        <div class="lg:col-span-8">
          <div class="grid grid-cols-12 px-4 py-2.5 rounded-lg bg-slate-100/90 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            <div class="col-span-3">KODE ASET</div>
            <div class="col-span-4">NAMA &amp; SPESIFIKASI</div>
            <div class="${canEdit ? 'col-span-2' : 'col-span-3'}">LOKASI RUANG</div>
            <div class="col-span-2 ${canEdit ? '' : 'text-right'}">KONDISI / STATUS</div>
            ${canEdit ? '<div class="col-span-1 text-right">AKSI</div>' : ''}
          </div>

          <div class="space-y-2.5">
            ${filteredRows.length === 0 ? `
              <div class="rounded-xl border border-slate-200/90 bg-white p-8 text-center text-xs text-slate-500">
                Tidak ada aset yang cocok dengan filter yang dipilih.
              </div>
            ` : filteredRows.map(row => {
              const isSelected = selectedAsset && selectedAsset.code === row.code;
              return `
                <div onclick="selectPdfAssetRow('${row.code}')" class="grid grid-cols-12 items-center px-4 py-3.5 rounded-xl border transition cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200/90 bg-white hover:border-slate-300'
                }">
                  <div class="col-span-3 text-xs font-bold text-[#1D4ED8] pr-2">${row.code}</div>
                  <div class="col-span-4 pr-2">
                    <div class="text-xs font-bold text-slate-900">${row.name}</div>
                    <div class="text-[11px] text-slate-400 mt-0.5">${row.spec}</div>
                  </div>
                  <div class="${canEdit ? 'col-span-2' : 'col-span-3'} pr-2">
                    <div class="text-xs font-medium text-slate-700">${row.location}</div>
                    <div class="text-[11px] text-slate-400 mt-0.5">${row.gedung}</div>
                  </div>
                  <div class="col-span-2 ${canEdit ? 'pr-2' : 'text-right'}">
                    <span class="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${row.statusClass}">
                      ${row.status}
                    </span>
                  </div>
                  ${canEdit ? `
                    <div class="col-span-1 text-right">
                      <button type="button" onclick="event.stopPropagation(); openEditModal('${row.code}')" class="text-xs font-semibold text-[#1D4ED8] hover:underline cursor-pointer">
                        Edit ⋮
                      </button>
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right 4 Cols: Detail & Label Barcode Aset -->
        <div class="lg:col-span-4">
          <div class="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <h3 class="text-sm font-bold text-slate-900 mb-3">Detail &amp; Label Barcode Aset</h3>

            <div class="rounded-xl border border-slate-200 bg-slate-100/80 h-32 flex flex-col items-center justify-center text-center p-4 mb-4">
              <div class="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 mb-1.5 shadow-2xs">
                <i data-lucide="qr-code" class="w-5 h-5 text-blue-700"></i>
              </div>
              <span class="text-[11px] font-medium text-slate-500">Foto Fisik Unit • Update 12 Nov 2026</span>
            </div>

            <div class="text-sm font-bold text-slate-900">${selectedAsset.name}</div>
            <div class="text-xs font-bold text-[#1D4ED8] mt-0.5 mb-4">Kode Inventaris: ${selectedAsset.code}</div>

            <div class="space-y-2 text-xs text-slate-600 mb-5">
              <div>• Tahun Pengadaan: ${selectedAsset.tahun}</div>
              <div>• Harga Beli: ${selectedAsset.harga}</div>
              <div>• Lokasi Fisik: ${selectedAsset.lokasiFisik}</div>
              <div>• Penanggung Jawab: ${selectedAsset.pic}</div>
              <div>• Garansi Resmi: ${selectedAsset.garansi}</div>
            </div>

            <div class="space-y-2.5">
              <div class="${canEdit ? 'grid grid-cols-2 gap-2.5' : (isPeminjam && selectedAsset.status === 'Kondisi Baik' ? 'grid grid-cols-2 gap-2.5' : '')}">
                <button type="button" onclick="openQrModal('${selectedAsset.code}')" class="${!canEdit && !(isPeminjam && selectedAsset.status === 'Kondisi Baik') ? 'w-full' : ''} py-2.5 px-3 rounded-lg bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold transition text-center cursor-pointer">
                  Label QR Tag
                </button>
                ${canEdit ? `
                  <button type="button" onclick="openEditModal('${selectedAsset.code}')" class="py-2.5 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition text-center cursor-pointer">
                    Edit Data Aset
                  </button>
                ` : (isPeminjam && selectedAsset.status === 'Kondisi Baik' ? `
                  <a href="peminjaman.html?kode=${encodeURIComponent(selectedAsset.code)}&nama=${encodeURIComponent(selectedAsset.name)}&lokasi=${encodeURIComponent((selectedAsset.location || '') + (selectedAsset.gedung ? ' - ' + selectedAsset.gedung : ''))}" class="py-2.5 px-3 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#1D4ED8] text-xs font-bold transition text-center cursor-pointer">
                    Ajukan Pinjam
                  </a>
                ` : '')}
              </div>
              ${(typeof hasPermission === 'function' ? hasPermission('maintenance:report') : (isPeminjam || canEdit)) && selectedAsset.code !== '-' ? `
                <a href="tiket.html?lapor=1&asset_kode=${encodeURIComponent(selectedAsset.nup || selectedAsset.code)}&asset_nama=${encodeURIComponent(selectedAsset.name || '')}&asset_lokasi=${encodeURIComponent(selectedAsset.location || '')}&asset_gedung=${encodeURIComponent(selectedAsset.gedung || '')}" class="w-full py-2 px-3 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition text-center flex items-center justify-center gap-1.5">
                  <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i>
                  <span>Laporkan Kerusakan Unit Ini</span>
                </a>
              ` : ''}
              ${canDelete && selectedAsset.code !== '-' ? `
                <button type="button" onclick="openDeleteModal('${selectedAsset.code}')" class="w-full py-2 px-3 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition text-center cursor-pointer">
                  Hapus Aset (Khusus Admin)
                </button>
              ` : ''}
            </div>

            <!-- Riwayat Kerusakan & Perbaikan Aset -->
            ${renderAssetDamageHistorySection(selectedAsset)}
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }
  if (preserveFocus) {
    const input = document.getElementById('pdf-asset-search-input');
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }
}

let assetDamageHistoryTickets = [];

async function loadTicketHistoryForAssets() {
  try {
    const res = (typeof API !== 'undefined' && API.getTickets)
      ? await API.getTickets()
      : await fetch('/api/tickets').then(r => r.json());
    if (res && res.success && Array.isArray(res.data)) {
      assetDamageHistoryTickets = res.data;
    }
  } catch (_) {}
}

function escapeAssetHistHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getAssetDamageHistory(selectedAsset) {
  if (!selectedAsset || !selectedAsset.code || selectedAsset.code === '-') return [];
  const normCode = String(selectedAsset.code).trim().toLowerCase();
  const normNup = String(selectedAsset.nup || '').trim().toLowerCase();
  const normName = String(selectedAsset.name || '').trim().toLowerCase();
  const nameTokens = normName.split(/\s+/).filter(w => w.length >= 4).slice(0, 2);

  return (assetDamageHistoryTickets || []).filter(t => {
    if (selectedAsset.dbId && t.asset_id && Number(t.asset_id) === Number(selectedAsset.dbId)) return true;
    const tk = String(t.asset_kode || '').trim().toLowerCase();
    if (tk && (tk === normCode || (normNup && tk === normNup))) return true;
    // Fallback matching for legacy seeded tickets without asset_id/asset_kode
    if (!t.asset_id && !t.asset_kode && nameTokens.length >= 2) {
      const hay = `${t.title || ''} ${t.desc || ''}`.toLowerCase();
      return nameTokens.every(tok => hay.includes(tok));
    }
    return false;
  });
}

function renderAssetDamageHistorySection(selectedAsset) {
  const history = getAssetDamageHistory(selectedAsset);
  const statusBadge = (rawStatus) => {
    const st = String(rawStatus || 'baru').toLowerCase();
    if (st === 'selesai' || st === 'closed' || st === 'done') {
      return { label: 'Selesai', cls: 'bg-emerald-100 text-emerald-900' };
    }
    if (st === 'qc' || st === 'uji' || st === 'sparepart') {
      return { label: 'QC', cls: 'bg-amber-100 text-amber-900' };
    }
    if (st === 'proses' || st === 'pengerjaan' || st === 'ditugaskan' || st === 'assigned') {
      return { label: 'Dikerjakan', cls: 'bg-blue-100 text-blue-800' };
    }
    return { label: 'Antrean', cls: 'bg-slate-200 text-slate-800' };
  };

  return `
    <div id="asset-damage-history-section" class="mt-5 pt-4 border-t border-slate-200/80">
      <div class="flex items-center justify-between gap-2 mb-3">
        <div class="flex items-center gap-1.5">
          <i data-lucide="history" class="w-3.5 h-3.5 text-[#1D4ED8]"></i>
          <h4 class="text-xs font-extrabold text-slate-900">Riwayat Kerusakan &amp; Perbaikan</h4>
        </div>
        <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${history.length > 0 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}">
          ${history.length > 0 ? `${history.length} Catatan` : 'Belum Pernah Rusak'}
        </span>
      </div>

      ${history.length === 0 ? `
        <div class="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-500 text-center">
          Belum ada catatan kerusakan yang dilaporkan untuk unit ini.
        </div>
      ` : `
        <div class="space-y-2.5 max-h-60 overflow-y-auto pr-0.5">
          ${history.map(t => {
            const sb = statusBadge(t.status);
            const dateStr = t.created_at ? String(t.created_at).slice(0, 10) : '';
            const costNum = Number(t.cost || 0);
            return `
              <div class="rounded-xl border border-slate-200/90 bg-slate-50 p-3 space-y-1">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-[10px] font-extrabold text-[#1D4ED8] font-mono">${escapeAssetHistHtml(t.kode || ('TKT-' + t.id))}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${sb.cls}">${sb.label}</span>
                </div>
                <div class="text-xs font-bold text-slate-900 leading-snug">${escapeAssetHistHtml(t.title)}</div>
                ${t.desc ? `<p class="text-[11px] text-slate-600 leading-relaxed">${escapeAssetHistHtml(t.desc)}</p>` : ''}
                <div class="text-[10px] text-slate-500 pt-1 flex flex-wrap items-center justify-between gap-1">
                  <span>Pelapor: <strong>${escapeAssetHistHtml(t.reporter || 'Staf')}</strong></span>
                  <span>${dateStr}${costNum > 0 ? ` • Rp ${costNum.toLocaleString('id-ID')}` : ''}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  renderStats();
  renderQuickFilters();
  bindEvents();
  render();
  applyRbacToAssetPage();
  renderPdfAssetView();
  Promise.all([loadAssetsFromBackend(), loadTicketHistoryForAssets()]).then(() => {
    renderPdfAssetView();
  });
});

