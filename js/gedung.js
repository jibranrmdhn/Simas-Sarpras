/**
 * SIMAS – Manajemen Gedung, Fasilitas & Ruangan
 * Data Dinamis & Logika Antarmuka (Array JS & DOM Rendering)
 */

// ================= 1. DATA MASTER ================= //

const navMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-panel-left', href: 'index.html', active: false },
  { id: 'aset', label: 'Manajemen Aset', icon: 'archive', href: 'aset.html', active: false },
  { id: 'gedung', label: 'Gedung & Ruangan', icon: 'building-2', href: 'gedung.html', active: true },
  { id: 'peminjaman', label: 'Peminjaman & Reservasi', icon: 'calendar-clock', href: 'peminjaman.html', active: false },
  { id: 'antrean', label: 'Antrean Persetujuan', icon: 'check-square', href: 'antrean.html', active: false, badge: 4 },
  { id: 'tiket', label: 'Pemeliharaan & Tiket', icon: 'wrench', href: 'tiket.html', active: false },
  { id: 'mutasi', label: 'Mutasi Aset', icon: 'arrow-left-right', href: 'mutasi.html', active: false },
  { id: 'stock', label: 'Stock Opname', icon: 'scan-barcode', href: 'stock.html', active: false },
  { id: 'laporan', label: 'Laporan & Rangkuman', icon: 'file-text', href: 'laporan.html', active: false },
];

const statCardsData = [
  {
    id: 'total-gedung',
    title: 'TOTAL GEDUNG',
    value: '8 Gedung',
    icon: 'building-2',
    iconBoxClass: 'bg-blue-50 text-blue-700',
    subtitle: '3 Gedung Utama, 5 Fakultas & Penunjang',
    bulletColor: 'bg-emerald-500'
  },
  {
    id: 'total-ruangan',
    title: 'TOTAL RUANGAN',
    value: '142 Ruang',
    icon: 'door-closed',
    iconBoxClass: 'bg-cyan-50 text-cyan-700',
    subtitle: 'Kuliah, Lab Terpadu, R. Rapat, Aula',
    bulletColor: 'bg-blue-600'
  },
  {
    id: 'rata-okupansi',
    title: 'RATA-RATA OKUPANSI',
    value: '76.8%',
    icon: 'pie-chart',
    iconBoxClass: 'bg-teal-50 text-teal-700',
    subtitle: '↑ 4.2% vs pekan lalu (Efisiensi tinggi)',
    isTrend: true,
    trendClass: 'text-emerald-600 font-semibold'
  },
  {
    id: 'ruangan-perawatan',
    title: 'RUANGAN PERAWATAN',
    value: '3 Ruangan',
    valueClass: 'text-rose-600',
    icon: 'briefcase',
    iconBoxClass: 'bg-rose-50 text-rose-600',
    subtitle: 'Perbaikan AC & Smart Proyektor',
    bulletColor: 'bg-rose-500'
  }
];

const buildingTreeData = [
  {
    id: 'bld-rektorat',
    name: 'Gedung Rektorat',
    meta: '3 Lantai',
    icon: 'building-2',
    expanded: true,
    floors: [
      { id: 'lt-1', name: 'Lantai 1', badge: '100% Okupansi', badgeClass: 'bg-rose-100 text-rose-700' },
      { id: 'lt-2', name: 'Lantai 2', suffix: '(Terpilih)', badge: '8 Ruang', isSelected: true },
      { id: 'lt-3', name: 'Lantai 3', badge: 'Lounge VIP', badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200/60' }
    ]
  },
  {
    id: 'bld-gkba',
    name: 'GKB A (Kuliah Bersama)',
    meta: '5 Lt • 48 Ruang',
    icon: 'building',
    expanded: false,
    floors: [
      { id: 'gkb-1', name: 'Lantai 1', badge: '12 Ruang', badgeClass: 'bg-slate-100 text-slate-600' },
      { id: 'gkb-2', name: 'Lantai 2', badge: '16 Ruang', badgeClass: 'bg-blue-50 text-blue-700' },
      { id: 'gkb-3', name: 'Lantai 3', badge: '20 Ruang', badgeClass: 'bg-teal-50 text-teal-700' }
    ]
  },
  {
    id: 'bld-lab',
    name: 'Lab Riset Terpadu',
    meta: '4 Lt • 32 Ruang',
    icon: 'flask-conical',
    expanded: false,
    floors: [
      { id: 'lab-1', name: 'Lantai 1', badge: 'Lab Dasar', badgeClass: 'bg-slate-100 text-slate-600' },
      { id: 'lab-2', name: 'Lantai 2', badge: 'Lab Komputasi', badgeClass: 'bg-blue-50 text-blue-700' },
      { id: 'lab-3', name: 'Lantai 3', badge: 'Lab Biotek', badgeClass: 'bg-teal-50 text-teal-700' }
    ]
  },
  {
    id: 'bld-auditorium',
    name: 'Auditorium Sasana Graha',
    meta: '1.200 Org',
    icon: 'users',
    expanded: false,
    floors: [
      { id: 'aud-1', name: 'Lantai 1', badge: 'Hall Utama', badgeClass: 'bg-blue-50 text-blue-700' },
      { id: 'aud-2', name: 'Lantai 2', badge: 'Balkon VIP', badgeClass: 'bg-slate-100 text-slate-600' }
    ]
  }
];

const roomCardsData = [
  {
    code: 'RNG-02-01',
    title: 'Ruang Rapat Paripurna',
    status: 'Sedang Digunakan',
    statusClass: 'bg-rose-500 text-white',
    scheduleLabel: 'Jadwal Aktif Sekarang:',
    scheduleText: 'Rapat Koordinasi BPKP s/d 12:00 WIB',
    condition: 'Sangat Baik',
    conditionClass: 'bg-blue-50 text-blue-700 border border-blue-200/70',
    location: 'Lantai 2, Sayap Timur',
    pic: 'Ir. Bambang S.',
    capacity: '45 Orang',
    area: '120 m²',
    facilityIcon: 'monitor',
    facilityText: 'AC 3 PK, Smartboard 85", Mic Wireless x4',
    image: '../assets/ruang_paripurna.jpg',
    leftAction: 'Lihat Aset Ruangan →',
    rightAction: 'Reservasi Mendatang',
    rightActionType: 'secondary'
  },
  {
    code: 'RNG-02-02',
    title: 'Ruang Sidang Senat',
    status: 'Tersedia',
    statusClass: 'bg-teal-600 text-white',
    scheduleLabel: 'Status Penggunaan:',
    scheduleText: 'Siap Digunakan (Slot kosong s/d 14:00)',
    condition: 'Baik',
    conditionClass: 'bg-blue-50 text-blue-700 border border-blue-200/70',
    location: 'Lantai 2, Sayap Barat',
    pic: 'Siti Nurhaliza, S.T.',
    capacity: '60 Orang',
    area: '150 m²',
    facilityIcon: 'volume-2',
    facilityText: 'Sound System Terpadu, Vicon Logitech Rally Plus',
    image: '../assets/sidang_senat.jpg',
    leftAction: 'Daftar Aset (24)',
    rightAction: 'Booking Cepat',
    rightActionType: 'primary'
  },
  {
    code: 'RNG-02-03',
    title: 'Ruang Rapat Dekanat A',
    status: 'Dalam Perawatan',
    statusIcon: 'wrench',
    statusClass: 'bg-rose-100 text-rose-700 border border-rose-200/60',
    scheduleLabel: 'Catatan Pemeliharaan:',
    scheduleText: 'Perbaikan AC Split & Filter Udara (Tiket #TK-2024-1033)',
    condition: 'Rusak Ringan',
    conditionClass: 'bg-rose-50 text-rose-600 border border-rose-200',
    location: 'Lantai 2, Koridor Tengah',
    pic: 'Teknisi Ruslan',
    capacity: '20 Orang',
    area: '55 m²',
    alertNote: 'AC Daikin Inverter tidak dingin (Sedang diinspeksi)',
    image: '../assets/rapat_dekanat.jpg',
    leftAction: 'Cek Tiket Servis',
    leftActionLink: 'tiket.html',
    leftActionClass: 'text-rose-600 font-bold hover:underline flex items-center gap-1',
    rightAction: 'Histori Perawatan',
    rightActionType: 'secondary'
  },
  {
    code: 'RNG-02-04',
    title: 'Multimedia Studio & Podcast',
    status: 'Tersedia',
    statusClass: 'bg-teal-600 text-white',
    scheduleLabel: 'Fasilitas Khusus:',
    scheduleText: 'Full Acoustic Proofing, 4K Broadcast Ready',
    condition: 'Prima',
    conditionClass: 'bg-cyan-50 text-cyan-700 border border-cyan-200/70',
    location: 'Lantai 1, Ruang Khusus Media',
    pic: 'Dedi Prasetyo, M.Sn.',
    capacity: '10 Orang',
    area: '42 m²',
    facilityIcon: 'mic',
    facilityText: 'Shure SM7B x4, ATEM Mini Pro, Softbox Aputure',
    image: '../assets/studio_podcast.jpg',
    leftAction: 'Detail Aset (18)',
    rightAction: 'Booking Cepat',
    rightActionType: 'primary'
  }
];

const embeddedAssetsData = [
  {
    code: 'AST-ELEK-2023-9881',
    name: 'Samsung Interactive Display Flip Pro 85" 4K',
    category: 'Elektronik & Multimedia',
    year: '2023',
    condition: 'Baik',
    conditionClass: 'bg-teal-50 text-teal-700 border border-teal-200',
    roomCode: 'RNG-02-01'
  },
  {
    code: 'AST-MEB-2022-0419',
    name: 'Meja Rapat Konferensi Kayu Jati Custom (40 Seat)',
    category: 'Mebel & Interior',
    year: '2022',
    condition: 'Baik',
    conditionClass: 'bg-teal-50 text-teal-700 border border-teal-200',
    roomCode: 'RNG-02-01'
  },
  {
    code: 'AST-HVAC-2021-0102',
    name: 'Daikin Cassette Inverter 3 PK (Unit 1 & 2)',
    category: 'Tata Udara & HVAC',
    year: '2021',
    condition: 'Baik',
    conditionClass: 'bg-teal-50 text-teal-700 border border-teal-200',
    roomCode: 'RNG-02-01'
  }
];

// ================= 2. DOM INITIALIZATION ================= //

let currentFloorFilter = 'all';
let currentStatusFilterGedung = 'all';
let currentRoomKeyword = '';
let selectedBuildingName = 'Gedung Rektorat';
let selectedRoomForAssets = { code: 'RNG-02-01', title: 'Ruang Rapat Paripurna' };

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  renderStatCards();
  renderBuildingTree();
  renderRoomCards();
  renderEmbeddedAssetsTable();
  initInteractions();
  applyRbacToGedungPage();
  loadLocationsFromBackend();

  if (window.lucide) {
    lucide.createIcons();
  }
});

function applyRbacToGedungPage() {
  if (typeof hasPermission !== 'function') return;
  if (!hasPermission('locations:manage')) {
    const restrictedBtns = document.querySelectorAll(
      'button[onclick="openModalTambahRuangan()"], button[onclick="openModalTambahAsetRuang()"], button[onclick="openModalTambahGedung()"]'
    );
    restrictedBtns.forEach(btn => {
      btn.style.display = 'none';
    });
  }
  const pageTitle = document.querySelector('main h1');
  if (pageTitle && typeof getCurrentUser === 'function') {
    const u = getCurrentUser();
    if (u.role === 'peminjam') {
      pageTitle.textContent = 'Informasi Gedung & Ketersediaan Ruangan';
    } else if (u.role === 'pimpinan') {
      pageTitle.textContent = 'Monitoring Okupansi Gedung & Ruangan';
    }
  }
}

// ================= 3. RENDERING FUNCTIONS ================= //

function renderSidebar() {
  if (typeof renderNavigation === 'function') {
    renderNavigation('lokasi');
    return;
  }
  const container = document.getElementById('sidebar-menu-list');
  if (!container) return;

  container.innerHTML = navMenuItems.map(item => {
    if (item.active) {
      return `
        <a href="${item.href}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#1342b8] text-white font-semibold text-xs shadow-sm shadow-blue-800/20 transition">
          <div class="flex items-center gap-3">
            <i data-lucide="${item.icon}" class="w-4 h-4 text-white"></i>
            <span>${item.label}</span>
          </div>
          ${item.badge ? `<span class="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">${item.badge}</span>` : ''}
        </a>
      `;
    }
    return `
      <a href="${item.href}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-[#e2edfd] font-medium text-xs transition">
        <div class="flex items-center gap-3">
          <i data-lucide="${item.icon}" class="w-4 h-4 text-slate-600"></i>
          <span>${item.label}</span>
        </div>
        ${item.badge ? `<span class="w-5 h-5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-bold flex items-center justify-center">${item.badge}</span>` : ''}
      </a>
    `;
  }).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function renderStatCards() {
  const container = document.getElementById('stat-cards-container');
  if (!container) return;

  if (roomCardsData.length > 0) {
    const totalRooms = roomCardsData.length;
    const maintenanceRooms = roomCardsData.filter(r => r.status === 'Dalam Perawatan').length;
    statCardsData[1].value = `${totalRooms} Ruang`;
    statCardsData[3].value = `${maintenanceRooms} Ruangan`;
  }

  container.innerHTML = statCardsData.map(stat => `
    <div class="bg-white rounded-2xl p-4 soft-shadow border border-slate-200/80 flex flex-col justify-between">
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-bold tracking-wider uppercase text-slate-400">${stat.title}</span>
        <div class="w-7 h-7 rounded-lg ${stat.iconBoxClass} flex items-center justify-center">
          <i data-lucide="${stat.icon}" class="w-4 h-4"></i>
        </div>
      </div>

      <div class="my-3">
        <div class="text-2xl xl:text-3xl font-black ${stat.valueClass || 'text-slate-900'} leading-none tracking-tight">
          ${stat.value}
        </div>
      </div>

      <div class="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
        ${stat.bulletColor ? `<span class="w-2 h-2 rounded-full ${stat.bulletColor} shrink-0"></span>` : ''}
        <span class="${stat.trendClass || 'text-slate-500 text-[11px]'}">${stat.subtitle}</span>
      </div>
    </div>
  `).join('');
}

function renderBuildingTree() {
  const container = document.getElementById('building-tree-list');
  if (!container) return;

  const kw = currentRoomKeyword.toLowerCase();
  const visibleBuildings = buildingTreeData.filter(bld => {
    if (!kw) return true;
    const matchBld = bld.name.toLowerCase().includes(kw);
    const matchFloor = (bld.floors || []).some(fl => fl.name.toLowerCase().includes(kw));
    return matchBld || matchFloor || true;
  });

  container.innerHTML = visibleBuildings.map(bld => {
    if (bld.expanded) {
      return `
        <div class="space-y-1.5">
          <div onclick="selectBuildingInTree('${bld.id}')" class="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 transition cursor-pointer font-bold text-xs text-slate-800">
            <div class="flex items-center gap-2">
              <i data-lucide="chevron-down" class="w-4 h-4 text-slate-500"></i>
              <i data-lucide="${bld.icon}" class="w-4 h-4 text-blue-700"></i>
              <span>${bld.name}</span>
            </div>
            <span class="text-[10px] font-semibold text-slate-400">${bld.meta}</span>
          </div>

          <!-- Floors Nested List -->
          <div class="pl-6 space-y-1">
            ${(bld.floors || []).map(fl => {
              if (fl.isSelected) {
                return `
                  <div onclick="selectFloorInTree('${bld.id}', '${fl.name}')" class="p-2.5 rounded-xl bg-[#1a44c2] text-white flex items-center justify-between shadow-sm cursor-pointer">
                    <div class="flex items-center gap-2">
                      <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span class="text-xs font-bold">${fl.name} <span class="font-normal text-[11px] opacity-90">${fl.suffix || '(Terpilih)'}</span></span>
                    </div>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#102f86] text-white">${fl.badge}</span>
                  </div>
                `;
              }
              return `
                <div onclick="selectFloorInTree('${bld.id}', '${fl.name}')" class="py-1.5 px-2 rounded-lg hover:bg-slate-100/70 flex items-center justify-between text-xs text-slate-600 cursor-pointer transition">
                  <div class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>${fl.name}</span>
                  </div>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${fl.badgeClass || 'bg-slate-100 text-slate-600'}">${fl.badge}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    return `
      <div onclick="selectBuildingInTree('${bld.id}')" class="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-slate-50 transition cursor-pointer text-xs text-slate-700 font-semibold">
        <div class="flex items-center gap-2">
          <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
          <i data-lucide="${bld.icon}" class="w-4 h-4 text-slate-500"></i>
          <span class="truncate max-w-[150px]">${bld.name}</span>
        </div>
        <span class="text-[10px] font-semibold text-slate-400 shrink-0">${bld.meta}</span>
      </div>
    `;
  }).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

window.selectBuildingInTree = function(bldId) {
  buildingTreeData.forEach(b => {
    if (b.id === bldId) {
      b.expanded = !b.expanded;
      selectedBuildingName = b.name;
    } else {
      b.expanded = false;
    }
  });
  currentFloorFilter = 'all';
  updateSelectedBuildingHeader();
  renderBuildingTree();
  filterByFloor('all');
};

window.selectFloorInTree = function(bldId, floorName) {
  buildingTreeData.forEach(b => {
    if (b.id === bldId) {
      selectedBuildingName = b.name;
      (b.floors || []).forEach(fl => {
        fl.isSelected = (fl.name === floorName);
        fl.suffix = fl.isSelected ? '(Terpilih)' : '';
      });
    } else {
      (b.floors || []).forEach(fl => {
        fl.isSelected = false;
        fl.suffix = '';
      });
    }
  });
  renderBuildingTree();
  filterByFloor(floorName);
};

function updateSelectedBuildingHeader() {
  const hdr = document.getElementById('selected-building-header');
  if (hdr) {
    const flLabel = currentFloorFilter === 'all' ? 'Semua Lantai' : currentFloorFilter;
    hdr.textContent = `${selectedBuildingName} — ${flLabel}`;
  }
}

function renderRoomCards(filterStatus = currentStatusFilterGedung) {
  currentStatusFilterGedung = filterStatus;
  const container = document.getElementById('room-cards-grid');
  if (!container) return;

  const kw = currentRoomKeyword.toLowerCase();
  const filtered = roomCardsData.filter(r => {
    if (currentFloorFilter !== 'all' && !r.location.toLowerCase().includes(currentFloorFilter.toLowerCase())) {
      return false;
    }
    if (kw) {
      const hay = `${r.code} ${r.title} ${r.location} ${r.pic} ${r.facilityText || ''}`.toLowerCase();
      if (!hay.includes(kw)) return false;
    }
    if (filterStatus === 'all') return true;
    if (filterStatus === 'tersedia') return r.status === 'Tersedia';
    if (filterStatus === 'digunakan') return r.status === 'Sedang Digunakan';
    if (filterStatus === 'perawatan') return r.status === 'Dalam Perawatan';
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
        <div class="text-xs font-bold text-slate-700">Tidak ada ruangan yang sesuai dengan filter saat ini</div>
        <p class="text-[11px] text-slate-400">Coba pilih tab "Semua Lantai" atau ubah kata kunci pencarian.</p>
        <button type="button" onclick="filterByFloor('all'); document.getElementById('status-filter-select').value='all'; currentRoomKeyword=''; renderRoomCards('all');" class="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 cursor-pointer">
          Reset Filter Ruangan
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(room => `
    <div class="bg-white rounded-2xl overflow-hidden card-elevation border border-slate-200/90 flex flex-col justify-between">
      
      <!-- Top Image with Badges & Bottom Overlay Text -->
      <div class="relative h-44 overflow-hidden bg-slate-100 group">
        <img src="${room.image}" onerror="this.src='../assets/sidang_senat.jpg'" alt="${room.title}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105">
        
        <!-- Top Overlay Badges -->
        <div class="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span class="px-2 py-0.5 rounded-md bg-slate-900/80 text-white font-mono font-bold text-[10px] backdrop-blur-sm">
            ${room.code}
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${room.statusClass} flex items-center gap-1 shadow-sm">
            ${room.statusIcon ? `<i data-lucide="${room.statusIcon}" class="w-3 h-3"></i>` : '●'}
            <span>${room.status}</span>
          </span>
        </div>

        <!-- Bottom Overlay Gradient Info Text -->
        <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent p-3 pt-6 text-white leading-tight">
          <div class="text-[10px] text-slate-300 font-medium">${room.scheduleLabel}</div>
          <div class="text-xs font-bold truncate mt-0.5">${room.scheduleText}</div>
        </div>
      </div>

      <!-- Card Body Content -->
      <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <!-- Title & Condition Badge -->
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-sm font-black text-slate-900 leading-snug">${room.title}</h3>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${room.conditionClass} shrink-0">
              ${room.condition}
            </span>
          </div>

          <!-- Location & PIC -->
          <div class="text-[11px] text-slate-500 mt-1">
            ${room.location} • PIC: <span class="font-semibold text-slate-700">${room.pic}</span>
          </div>

          <!-- Capacity & Area Pills -->
          <div class="flex items-center gap-2 mt-2.5">
            <span class="px-2 py-1 rounded-lg bg-[#edf4fe] text-blue-900 text-[11px] font-bold flex items-center gap-1">
              <i data-lucide="users" class="w-3.5 h-3.5 text-blue-700"></i>
              Kapasitas: ${room.capacity}
            </span>
            <span class="px-2 py-1 rounded-lg bg-[#edf4fe] text-blue-900 text-[11px] font-bold flex items-center gap-1">
              <i data-lucide="maximize" class="w-3.5 h-3.5 text-blue-700"></i>
              Luas: ${room.area}
            </span>
          </div>

          <!-- Facility Description or Alert -->
          <div class="mt-2.5 text-[11px]">
            ${room.alertNote ? `
              <div class="p-2 rounded-lg bg-rose-50 text-rose-600 font-semibold flex items-center gap-1.5 border border-rose-200/60">
                <i data-lucide="alert-triangle" class="w-3.5 h-3.5 text-rose-500 shrink-0"></i>
                <span class="truncate">${room.alertNote}</span>
              </div>
            ` : `
              <div class="text-slate-600 flex items-center gap-1.5 truncate">
                <i data-lucide="${room.facilityIcon || 'sparkles'}" class="w-3.5 h-3.5 text-blue-700 shrink-0"></i>
                <span class="truncate">${room.facilityText}</span>
              </div>
            `}
          </div>
        </div>

        <!-- Card Footer Actions -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          ${room.leftActionLink ? `
            <a href="${room.leftActionLink}" class="${room.leftActionClass || 'text-xs text-blue-700 font-bold hover:underline'}">
              <i data-lucide="wrench" class="w-3.5 h-3.5"></i>
              <span>${room.leftAction}</span>
            </a>
          ` : `
            <button type="button" onclick="selectRoomForAssets('${room.code}', '${room.title.replace(/'/g, "\\'")}')" class="text-xs font-bold text-blue-700 hover:underline cursor-pointer">
              ${room.leftAction}
            </button>
          `}

          ${room.rightActionType === 'primary' ? `
            <button type="button" onclick="handleBooking('${room.code}', '${room.title.replace(/'/g, "\\'")}')" class="px-3.5 py-1.5 rounded-xl bg-[#102f86] hover:bg-blue-900 text-white text-xs font-bold shadow-sm transition cursor-pointer">
              ${room.rightAction}
            </button>
          ` : `
            <button type="button" onclick="handleBooking('${room.code}', '${room.title.replace(/'/g, "\\'")}')" class="px-3 py-1.5 rounded-xl bg-[#edf4fe] hover:bg-blue-100 text-blue-900 text-xs font-bold transition cursor-pointer">
              ${room.rightAction}
            </button>
          `}
        </div>

      </div>

    </div>
  `).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

function renderEmbeddedAssetsTable() {
  const tbody = document.getElementById('embedded-assets-tbody');
  if (!tbody) return;

  const titleEl = document.getElementById('selected-room-assets-title');
  if (titleEl) {
    titleEl.textContent = `Daftar Aset Tertanam di Ruang Terpilih: ${selectedRoomForAssets.title} (${selectedRoomForAssets.code})`;
  }
  const subEl = document.getElementById('selected-room-assets-subtitle');
  if (subEl) {
    subEl.textContent = `${embeddedAssetsData.length} Aset Terdaftar & Terkalibrasi Aktif di Ruangan Ini`;
  }

  tbody.innerHTML = embeddedAssetsData.map(asset => `
    <tr class="hover:bg-blue-50/40 transition">
      <td class="py-3 px-4 font-mono font-bold text-xs text-blue-950">${asset.code}</td>
      <td class="py-3 px-4 text-xs font-bold text-slate-900">${asset.name}</td>
      <td class="py-3 px-4 text-xs text-slate-600">${asset.category}</td>
      <td class="py-3 px-4 text-xs text-slate-600">${asset.year}</td>
      <td class="py-3 px-4">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${asset.conditionClass}">
          ${asset.condition}
        </span>
      </td>
      <td class="py-3 px-4 text-right">
        <a href="aset.html" class="text-xs font-bold text-blue-700 hover:underline">
          Detail
        </a>
      </td>
    </tr>
  `).join('');
}

// ================= 4. INTERACTIONS ================= //

function initInteractions() {
  const statusFilterSelect = document.getElementById('status-filter-select');
  if (statusFilterSelect) {
    statusFilterSelect.addEventListener('change', (e) => {
      renderRoomCards(e.target.value);
    });
  }

  const treeSearchInput = document.getElementById('building-tree-search');
  if (treeSearchInput) {
    treeSearchInput.addEventListener('input', (e) => {
      currentRoomKeyword = e.target.value.trim();
      renderBuildingTree();
      renderRoomCards(currentStatusFilterGedung);
    });
  }

  const globalSearchInput = document.getElementById('global-search-input');
  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      currentRoomKeyword = e.target.value.trim();
      if (treeSearchInput && treeSearchInput.value !== e.target.value) {
        treeSearchInput.value = e.target.value;
      }
      renderBuildingTree();
      renderRoomCards(currentStatusFilterGedung);
    });
  }
}

window.scanSelectedRoomQr = function() {
  showToast(`Memindai QR Ruangan ${selectedRoomForAssets.code} (${selectedRoomForAssets.title}): ${embeddedAssetsData.length} aset terverifikasi aktif`);
};

window.handleBooking = function(code, title) {
  if (typeof requirePermission === 'function') {
    if (!requirePermission('loans:create', 'Mengajukan Booking / Reservasi Ruangan')) return;
  }
  const existing = document.getElementById('modal-booking-ruangan');
  if (existing) existing.remove();

  const toLocalDateStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const now = new Date();
  const today = toLocalDateStr(now);
  const tomorrow = toLocalDateStr(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const defaultPeminjam = (user && user.nama) ? user.nama : 'Dr. Hendro Purnomo, M.Kom';

  const modal = document.createElement('div');
  modal.id = 'modal-booking-ruangan';
  modal.className = 'fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-[#eef4ff]">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-[#0f2a71] text-white flex items-center justify-center font-bold">
            <i data-lucide="calendar-check" class="w-4 h-4"></i>
          </div>
          <div>
            <h3 class="text-xs font-extrabold text-slate-900">Booking / Reservasi Ruangan</h3>
            <p class="text-[10px] text-slate-600">${title} (${code})</p>
          </div>
        </div>
        <button type="button" onclick="document.getElementById('modal-booking-ruangan')?.remove()" class="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <form onsubmit="submitRoomBooking(event, '${code}', '${title.replace(/'/g, "\\'")}')" class="p-4 space-y-3 text-xs">
        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1">Nama Pemohon / Penanggung Jawab *</label>
          <input type="text" id="booking-peminjam" required value="${defaultPeminjam}" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:border-blue-600 outline-none">
        </div>
        <div class="grid grid-cols-2 gap-2.5">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Tanggal Mulai *</label>
            <input type="date" id="booking-tgl-mulai" required value="${today}" class="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:border-blue-600 outline-none">
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Jam Mulai *</label>
            <input type="time" id="booking-jam-mulai" required value="08:00" class="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:border-blue-600 outline-none">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2.5">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Tanggal Selesai *</label>
            <input type="date" id="booking-tgl-selesai" required value="${tomorrow}" class="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:border-blue-600 outline-none">
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Jam Selesai *</label>
            <input type="time" id="booking-jam-selesai" required value="17:00" class="w-full border border-slate-200 rounded-lg px-2.5 py-2 text-xs focus:border-blue-600 outline-none">
          </div>
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1">Agenda / Keperluan Penggunaan Ruangan *</label>
          <input type="text" id="booking-keperluan" required placeholder="cth: Rapat Koordinasi Akreditasi & Seminar Fakultas" value="Rapat Koordinasi & Evaluasi Akademik" class="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:border-blue-600 outline-none">
        </div>
        <div class="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          <button type="button" onclick="document.getElementById('modal-booking-ruangan')?.remove()" class="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer">Batal</button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-[#102f86] hover:bg-blue-900 text-white font-bold shadow-sm cursor-pointer">Konfirmasi Booking</button>
        </div>
      </form>
    </div>
  `;
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
  if (window.lucide) lucide.createIcons();
};

window.submitRoomBooking = async function(e, code, title) {
  e.preventDefault();
  const peminjam = document.getElementById('booking-peminjam')?.value?.trim() || 'Pemohon Sarpras';
  const tglMulai = document.getElementById('booking-tgl-mulai')?.value;
  const jamMulai = document.getElementById('booking-jam-mulai')?.value || '08:00';
  const tglSelesai = document.getElementById('booking-tgl-selesai')?.value;
  const jamSelesai = document.getElementById('booking-jam-selesai')?.value || '17:00';
  const keperluan = document.getElementById('booking-keperluan')?.value?.trim() || 'Reservasi Ruangan Kampus';
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

  const tglPinjamFull = tglMulai ? `${tglMulai} ${jamMulai}` : '';
  const tglKembaliFull = tglSelesai ? `${tglSelesai} ${jamSelesai}` : '';

  document.getElementById('modal-booking-ruangan')?.remove();

  // Update legacy card status locally
  const room = roomCardsData.find(r => r.code === code);
  if (room) {
    room.status = 'Sedang Digunakan';
    room.statusClass = 'bg-rose-500 text-white';
    room.scheduleLabel = 'Jadwal Aktif / Terjadwal:';
    room.scheduleText = `${keperluan} (${peminjam})`;
    renderRoomCards(currentStatusFilterGedung);
  }

  let loanCode = '';
  if (typeof API !== 'undefined') {
    const res = await API.createLoan({
      asset_nama: `${title} (${code})`,
      peminjam_nama: peminjam,
      peminjam_nip: (user && (user.nip || user.unit)) ? (user.nip || user.unit) : 'Civitas Akademika',
      keperluan,
      tgl_pinjam: tglPinjamFull,
      tgl_kembali: tglKembaliFull
    });
    if (res && res.success && res.data && res.data.kode) {
      loanCode = res.data.kode;
    }
    if (/^\d+$/.test(String(code))) {
      try {
        await API.updateLocation(code, { status: 'Menunggu Approval' });
      } catch (_) {}
    }
  }

  // Update active PDF room card so user sees immediate booking state
  const pdfRoom = pdfRoomsDataDefault.find(r => r.code === code);
  if (pdfRoom) {
    pdfRoom.status = 'MENUNGGU APPROVAL';
    pdfRoom.statusClass = 'bg-amber-50 text-amber-700';
    pdfRoom.scheduleInfo = `Diajukan oleh ${peminjam} (${tglPinjamFull} s/d ${tglKembaliFull}) — ${keperluan}`;
    pdfRoom.actionLabel = 'Lihat di Peminjaman Saya →';
    pdfRoom.actionType = 'goto_loans';
    renderPdfGedungView();
  }

  showToast(`Booking ${title} (${code})${loanCode ? ' #' + loanCode : ''} masuk ke Peminjaman Saya!`);
};

window.openModalTambahAsetRuang = function() {
  const existing = document.getElementById('modal-tambah-aset-ruang');
  if (existing) existing.remove();

  const nextCode = `AST-RNG-2025-${Math.floor(Math.random() * 899 + 100)}`;
  const modal = document.createElement('div');
  modal.id = 'modal-tambah-aset-ruang';
  modal.className = 'fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div>
          <h3 class="text-xs font-extrabold text-slate-900">Tambah Aset Tertanam di Ruangan</h3>
          <p class="text-[10px] text-slate-500">${selectedRoomForAssets.title} (${selectedRoomForAssets.code})</p>
        </div>
        <button type="button" onclick="document.getElementById('modal-tambah-aset-ruang')?.remove()" class="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <form onsubmit="submitTambahAsetRuang(event)" class="p-4 space-y-3 text-xs">
        <div class="grid grid-cols-2 gap-2.5">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Kode Aset *</label>
            <input type="text" id="emb-asset-code" required value="${nextCode}" class="w-full font-mono border border-slate-200 rounded-lg px-2.5 py-1.5">
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Tahun Perolehan</label>
            <input type="text" id="emb-asset-year" value="2025" class="w-full border border-slate-200 rounded-lg px-2.5 py-1.5">
          </div>
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1">Nama Aset / Fasilitas Ruangan *</label>
          <input type="text" id="emb-asset-name" required placeholder="cth: Smart TV Conference 75 Inch" class="w-full border border-slate-200 rounded-lg px-3 py-1.5">
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1">Kategori</label>
          <select id="emb-asset-cat" class="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold">
            <option value="Elektronik & Multimedia">Elektronik & Multimedia</option>
            <option value="Mebel & Interior">Mebel & Interior</option>
            <option value="Tata Udara & HVAC">Tata Udara & HVAC</option>
            <option value="Alat Laboratorium">Alat Laboratorium</option>
          </select>
        </div>
        <div class="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          <button type="button" onclick="document.getElementById('modal-tambah-aset-ruang')?.remove()" class="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold cursor-pointer">Batal</button>
          <button type="submit" class="px-4 py-1.5 rounded-xl bg-[#102f86] hover:bg-blue-900 text-white font-bold cursor-pointer">Simpan ke Ruangan</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  if (window.lucide) lucide.createIcons();
};

window.submitTambahAsetRuang = async function(e) {
  e.preventDefault();
  const code = document.getElementById('emb-asset-code')?.value.trim();
  const name = document.getElementById('emb-asset-name')?.value.trim();
  const category = document.getElementById('emb-asset-cat')?.value || 'Elektronik & Multimedia';
  const year = document.getElementById('emb-asset-year')?.value || '2025';
  if (!name) return;

  embeddedAssetsData.unshift({
    code,
    name,
    category,
    year,
    condition: 'Baik',
    conditionClass: 'bg-teal-50 text-teal-700 border border-teal-200',
    roomCode: selectedRoomForAssets.code
  });
  document.getElementById('modal-tambah-aset-ruang')?.remove();
  renderEmbeddedAssetsTable();

  if (typeof API !== 'undefined') {
    await API.createAsset({
      kode: code,
      nama: name,
      kategori_nama: category,
      lokasi: selectedRoomForAssets.title,
      gedung: selectedBuildingName,
      tahun: year,
      kondisi: 'Baik',
      status: 'Tersedia',
      nilai: 15000000
    });
  }

  showToast(`Aset "${name}" berhasil ditambahkan ke ${selectedRoomForAssets.title}!`);
};

window.openModalTambahRuangan = function() {
  if (typeof requirePermission === 'function') {
    if (!requirePermission('locations:manage', 'Menambah Ruangan')) return;
  }
  const modal = document.getElementById('modal-tambah-ruangan');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  }
};

window.closeModalTambahRuangan = function() {
  const modal = document.getElementById('modal-tambah-ruangan');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.filterByFloor = function(floor) {
  currentFloorFilter = floor;
  updateSelectedBuildingHeader();
  const container = document.getElementById('floor-tabs-container');
  if (container) {
    container.querySelectorAll('button').forEach(btn => {
      if (btn.getAttribute('data-floor') === floor) {
        btn.className = 'px-3 py-1.5 rounded-lg bg-white shadow-sm border border-slate-200 font-bold text-blue-900 transition cursor-pointer';
      } else {
        btn.className = 'px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-semibold transition cursor-pointer';
      }
    });
  }
  renderRoomCards(currentStatusFilterGedung);
};

window.selectRoomForAssets = function(code, title) {
  selectedRoomForAssets = { code, title };
  renderEmbeddedAssetsTable();
  const sec = document.getElementById('embedded-assets-section');
  if (sec) {
    sec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  showToast(`Menampilkan daftar aset tertanam untuk ${title} (${code})`);
};

async function loadLocationsFromBackend() {
  if (typeof API !== 'undefined') {
    try {
      const res = await API.getLocations();
      const rooms = Array.isArray(res?.data) ? res.data : (res?.data?.rooms || []);
      if (res && res.success && rooms.length > 0) {
        rooms.forEach(r => {
          const exists = roomCardsData.some(rc => rc.code === r.kode);
          if (!exists) {
            roomCardsData.push({
              code: r.kode,
              title: r.nama,
              status: r.status || 'Tersedia',
              statusClass: (r.status === 'Sedang Digunakan') ? 'bg-rose-500 text-white' : (r.status === 'Dalam Perawatan') ? 'bg-rose-100 text-rose-700 border border-rose-200/60' : 'bg-teal-600 text-white',
              scheduleLabel: 'Status Penggunaan:',
              scheduleText: r.fasilitas || 'Siap Digunakan',
              condition: r.kondisi || 'Baik',
              conditionClass: 'bg-blue-50 text-blue-700 border border-blue-200/70',
              location: `${r.lantai || 'Lantai 2'}, ${r.gedung_kode || 'Gedung Utama'}`,
              pic: r.pic || 'Staf Sarpras',
              capacity: r.kapasitas || '30 Orang',
              area: r.luas || '80 m²',
              facilityIcon: 'monitor',
              facilityText: r.fasilitas || 'AC Central, Proyektor, Sound System',
              image: r.image || '../assets/sidang_senat.jpg',
              leftAction: 'Daftar Aset',
              rightAction: 'Booking Cepat',
              rightActionType: 'primary'
            });
          }
          // Sync custom rooms from SQLite into active PDF rooms view
          const existsPdf = pdfRoomsDataDefault.some(pr => pr.code === r.kode);
          if (!existsPdf && r.kode && !String(r.kode).startsWith('RNG-02-')) {
            const gCode = String(r.gedung_kode || '').toUpperCase();
            const mappedBuildingCode = (gCode.includes('FT') || gCode.includes('TI')) ? 'TI' : (gCode.includes('LAB') || gCode.includes('MIPA') ? 'MIPA' : 'UTAMA');
            const mappedBuildingName = mappedBuildingCode === 'TI' ? 'Gedung TI' : (mappedBuildingCode === 'MIPA' ? 'Gedung MIPA' : 'Gedung Utama');
            const isMaint = String(r.status || '').toLowerCase().includes('rawat') || String(r.status || '').toLowerCase().includes('baik') === false && String(r.status || '').toLowerCase().includes('perbaik');
            const isBusy = String(r.status || '').toLowerCase().includes('digunakan') || String(r.status || '').toLowerCase().includes('pakai');
            pdfRoomsDataDefault.push({
              code: r.kode,
              buildingCode: mappedBuildingCode,
              status: isMaint ? 'PERBAIKAN' : (isBusy ? 'SEDANG DIPAKAI' : 'TERSEDIA (KOSONG)'),
              statusClass: isMaint ? 'bg-rose-50 text-rose-700' : (isBusy ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'),
              name: r.nama,
              meta: `${mappedBuildingName} ${r.lantai || 'Lt. 1'} • Kapasitas: ${r.kapasitas || '30 Orang'} • PIC: ${r.pic || 'Staf Sarpras'}`,
              equip1: `• ${r.fasilitas || 'Fasilitas Standar Ruangan Terpadu'}`,
              equip2: `• Luas Ruang: ${r.luas || '80 m²'}`,
              equip3: `• Kondisi Fisik: ${r.kondisi || 'Baik'}`,
              scheduleInfo: r.status === 'Tersedia' ? 'Ruangan tersedia untuk pengajuan reservasi.' : `Status ruangan: ${r.status}`,
              actionLabel: (isMaint || isBusy) ? 'Detail Jadwal' : '+ Booking Ruang',
              actionType: (isMaint || isBusy) ? 'outline' : 'primary'
            });
          }
        });
        renderStatCards();
        renderRoomCards(currentStatusFilterGedung);
        renderPdfGedungView();
      }
    } catch (err) {
      console.log('Locations sync fallback:', err.message);
    }
  }
}

window.handleRuanganSubmit = async function(e) {
  e.preventDefault();
  if (typeof requirePermission === 'function') {
    if (!requirePermission('locations:manage', 'Menambah Ruangan')) return;
  }

  const kode = document.getElementById('ruang-kode').value;
  const nama = document.getElementById('ruang-nama').value;
  const gedung = document.getElementById('ruang-gedung').value;
  const lantai = document.getElementById('ruang-lantai').value || 'Lantai 2';
  const kapasitas = document.getElementById('ruang-kapasitas').value || '30 Orang';
  const luas = document.getElementById('ruang-luas').value || '80 m²';

  const newRoomCard = {
    code: kode,
    title: nama,
    status: 'Tersedia',
    statusClass: 'bg-teal-600 text-white',
    scheduleLabel: 'Status Penggunaan:',
    scheduleText: 'Siap Digunakan (Baru Terdaftar)',
    condition: 'Sangat Baik',
    conditionClass: 'bg-blue-50 text-blue-700 border border-blue-200/70',
    location: `${lantai}, ${gedung}`,
    pic: 'Bambang Irawan, S.Kom',
    capacity: kapasitas,
    area: luas,
    facilityIcon: 'sparkles',
    facilityText: 'Fasilitas Standar Ruangan Terpadu',
    image: '../assets/sidang_senat.jpg',
    leftAction: 'Daftar Aset',
    rightAction: 'Booking Cepat',
    rightActionType: 'primary'
  };

  roomCardsData.unshift(newRoomCard);

  const mappedBuildingCode = gedung === 'GD-FT' ? 'TI' : (gedung === 'GD-LAB' ? 'MIPA' : 'UTAMA');
  const mappedBuildingName = mappedBuildingCode === 'TI' ? 'Gedung TI' : (mappedBuildingCode === 'MIPA' ? 'Gedung MIPA' : 'Gedung Utama');
  pdfRoomsDataDefault.unshift({
    code: kode,
    buildingCode: mappedBuildingCode,
    status: 'TERSEDIA (KOSONG)',
    statusClass: 'bg-emerald-50 text-emerald-700',
    name: nama,
    meta: `${mappedBuildingName} ${lantai} • Kapasitas: ${kapasitas} • PIC: Staf Sarpras`,
    equip1: '• Fasilitas Standar Ruangan Terpadu',
    equip2: `• Luas Ruang: ${luas}`,
    equip3: '• Terdaftar pada Master Gedung SIMAS',
    scheduleInfo: 'Belum ada jadwal terisi hari ini. Ruangan siap dipinjam.',
    actionLabel: '+ Booking Ruang',
    actionType: 'primary'
  });
  pdfSelectedBuildingCode = mappedBuildingCode;

  renderStatCards();
  renderRoomCards(currentStatusFilterGedung);
  renderPdfGedungView();

  if (typeof API !== 'undefined') {
    const res = await API.createLocation({
      kode,
      nama,
      gedung_kode: gedung,
      lantai,
      kapasitas,
      luas
    });
    if (res && res.success) {
      showToast(`Ruangan baru ${nama} (${kode}) berhasil didaftarkan ke database!`, 'success');
      closeModalTambahRuangan();
      e.target.reset();
      return;
    }
  }

  showToast(`Ruangan baru ${nama} berhasil didaftarkan!`, 'success');
  closeModalTambahRuangan();
  e.target.reset();
};

const pdfBuildingsData = [
  {
    code: 'TI',
    name: 'Gedung TI (Teknik)',
    floorsLabel: '4 Lantai',
    assetsLabel: '412 Aset',
    statusNote: '1 Perbaikan AC'
  },
  {
    code: 'UTAMA',
    name: 'Gedung Utama Aula',
    floorsLabel: '3 Lantai',
    assetsLabel: '280 Aset',
    statusNote: 'Normal'
  },
  {
    code: 'MIPA',
    name: 'Gedung Laboratorium MIPA',
    floorsLabel: '4 Lantai',
    assetsLabel: '556 Aset',
    statusNote: '1 Praktikum Aktif'
  }
];

const pdfRoomsDataDefault = [
  // === GEDUNG TI (TEKNIK) ===
  {
    code: 'LAB-TI-301',
    buildingCode: 'TI',
    status: 'SEDANG DIPAKAI KULIAH',
    statusClass: 'bg-blue-50 text-blue-700',
    name: 'Lab Multimedia & Virtual Reality',
    meta: 'Gedung TI Lt. 3 • Kapasitas: 40 Kursi • PIC: Joko S.',
    equip1: '• 40 PC Workstation Core i9',
    equip2: '• 2 Unit AC Split Daikin 2 PK',
    equip3: '• 1 Proyektor Epson EB-X500',
    scheduleInfo: 'Sedang dipakai Praktikum Grafika Komputer (08:00 - 11:30 WIB). Tersedia kembali pukul 13:00 WIB.',
    actionLabel: 'Detail Jadwal',
    actionType: 'outline'
  },
  {
    code: 'LAB-TI-202',
    buildingCode: 'TI',
    status: 'TERSEDIA (KOSONG)',
    statusClass: 'bg-emerald-50 text-emerald-700',
    name: 'Lab Jaringan & Keamanan Siber',
    meta: 'Gedung TI Lt. 2 • Kapasitas: 36 Kursi • PIC: Joko S.',
    equip1: '• 36 PC Dual-NIC + Rack Router Cisco',
    equip2: '• Smart TV 75" + Papan Tulis Kaca',
    equip3: '• 2 Unit AC Inverter 2 PK',
    scheduleInfo: 'Kosong sepanjang hari ini (08:00 - 17:00 WIB). Siap dibooking untuk praktikum atau workshop.',
    actionLabel: '+ Booking Ruang',
    actionType: 'primary'
  },
  {
    code: 'RKL-TI-104',
    buildingCode: 'TI',
    status: 'TERSEDIA (KOSONG)',
    statusClass: 'bg-emerald-50 text-emerald-700',
    name: 'Ruang Kuliah Terpadu TI-104',
    meta: 'Gedung TI Lt. 1 • Kapasitas: 60 Kursi • PIC: Bambang I.',
    equip1: '• Proyektor Laser Epson 5000 Lumens',
    equip2: '• Sound System Wall-Mount + 2 Mic',
    equip3: '• 2 Unit AC Standing 3 PK',
    scheduleInfo: 'Kosong s/d pukul 16:00 WIB. Dapat langsung diajukan peminjaman oleh Dosen/Mahasiswa.',
    actionLabel: '+ Booking Ruang',
    actionType: 'primary'
  },
  {
    code: 'LAB-TI-305',
    buildingCode: 'TI',
    status: 'PERBAIKAN AC',
    statusClass: 'bg-rose-50 text-rose-700',
    name: 'Lab Rekayasa Perangkat Lunak',
    meta: 'Gedung TI Lt. 3 • Kapasitas: 35 Kursi • PIC: Joko S.',
    equip1: '• 35 PC Workstation Core i7',
    equip2: '• Server Lokal Git & Docker',
    equip3: '• 2 Unit AC Split (1 Unit Servis)',
    scheduleInfo: 'Dalam jadwal pemeliharaan AC oleh Teknisi Sarpras (Tiket #TKT-012). Estimasi selesai besok.',
    actionLabel: 'Detail Jadwal',
    actionType: 'outline'
  },

  // === GEDUNG UTAMA AULA ===
  {
    code: 'SEM-UTM-302',
    buildingCode: 'UTAMA',
    status: 'TERSEDIA (KOSONG)',
    statusClass: 'bg-emerald-50 text-emerald-700',
    name: 'Ruang Seminar Utama Kampus',
    meta: 'Gedung Utama Lt. 3 • Kapasitas: 120 Kursi • PIC: Bambang I.',
    equip1: '• Sound System Yamaha StagePas',
    equip2: '• 4 Unit AC Central 5 PK',
    equip3: '• Podium Digital + Smart TV 85"',
    scheduleInfo: 'Slot kosong tersedia sepanjang hari. Cocok untuk seminar prodi, kuliah tamu, & sidang terbuka.',
    actionLabel: '+ Booking Ruang',
    actionType: 'primary'
  },
  {
    code: 'AULA-001',
    buildingCode: 'UTAMA',
    status: 'PERSIAPAN EVENT BEM',
    statusClass: 'bg-amber-50 text-amber-700',
    name: 'Gedung Aula Utama Graha Mahasiswa',
    meta: 'Gedung Utama Lt. 1 • Kapasitas: 500 Orang • PIC: Hendra K.',
    equip1: '• Videotron LED P2.5 Indoor',
    equip2: '• Genset Backup 100 kVA',
    equip3: '• 8 Unit AC Standing Floor 5 PK',
    scheduleInfo: 'Persiapan Seminar Nasional Kewirausahaan Muda BEM Univ (18 Nov 2026, 07:00 - 18:00 WIB).',
    actionLabel: 'Detail Jadwal',
    actionType: 'outline'
  },
  {
    code: 'RPT-UTM-201',
    buildingCode: 'UTAMA',
    status: 'TERSEDIA (KOSONG)',
    statusClass: 'bg-emerald-50 text-emerald-700',
    name: 'Ruang Rapat Senat & Pimpinan',
    meta: 'Gedung Utama Lt. 2 • Kapasitas: 45 Orang • PIC: Ir. Bambang S.',
    equip1: '• Meja Konferensi U-Shape + 45 Kursi',
    equip2: '• Vicon Logitech Rally Plus 4K',
    equip3: '• Smartboard Interactive 85"',
    scheduleInfo: 'Kosong hari ini s/d 15:00 WIB. Tersedia untuk rapat koordinasi fakultas atau organisasi.',
    actionLabel: '+ Booking Ruang',
    actionType: 'primary'
  },

  // === GEDUNG LABORATORIUM MIPA ===
  {
    code: 'LAB-BIO-204',
    buildingCode: 'MIPA',
    status: 'TERSEDIA (KOSONG)',
    statusClass: 'bg-emerald-50 text-emerald-700',
    name: 'Laboratorium Biologi Molekuler',
    meta: 'Gedung MIPA Lt. 2 • Kapasitas: 35 Praktikan • PIC: Rina M.',
    equip1: '• 30 Mikroskop Olympus CX23',
    equip2: '• Lemari Asam & Autoclave Steril',
    equip3: '• 2 Unit AC Inverter 2 PK',
    scheduleInfo: 'Tersedia untuk praktikum mandiri, riset skripsi, dan pengujian sampel laboratorium.',
    actionLabel: '+ Booking Ruang',
    actionType: 'primary'
  },
  {
    code: 'LAB-KIM-101',
    buildingCode: 'MIPA',
    status: 'SEDANG DIPAKAI PRAKTIKUM',
    statusClass: 'bg-blue-50 text-blue-700',
    name: 'Laboratorium Kimia Analitik',
    meta: 'Gedung MIPA Lt. 1 • Kapasitas: 32 Praktikan • PIC: Dr. Rina K.',
    equip1: '• Spektrofotometer UV-Vis & Timbangan',
    equip2: '• 4 Unit Fume Hood & Eye Washer',
    equip3: '• Exhaust Industri + 2 AC 2 PK',
    scheduleInfo: 'Sedang digunakan Praktikum Kimia Dasar Semester 3 (09:00 - 12:00 WIB).',
    actionLabel: 'Detail Jadwal',
    actionType: 'outline'
  },
  {
    code: 'LAB-FIS-302',
    buildingCode: 'MIPA',
    status: 'TERSEDIA (KOSONG)',
    statusClass: 'bg-emerald-50 text-emerald-700',
    name: 'Laboratorium Fisika Terapan & Optik',
    meta: 'Gedung MIPA Lt. 3 • Kapasitas: 30 Praktikan • PIC: Hendra K.',
    equip1: '• Meja Optik Anti-Vibrasi + Laser Kit',
    equip2: '• Osiloskop Digital 4-Channel x15',
    equip3: '• Proyektor HD + AC Split 2 PK',
    scheduleInfo: 'Slot kosong tersedia hari ini dan besok. Siap dibooking untuk riset dan praktikum.',
    actionLabel: '+ Booking Ruang',
    actionType: 'primary'
  }
];

let pdfSelectedBuildingCode = 'TI';
let pdfBuildingSearch = '';

window.selectPdfBuilding = function(code) {
  pdfSelectedBuildingCode = code;
  renderPdfGedungView();
};

window.onPdfBuildingSearch = function(val) {
  pdfBuildingSearch = val || '';
  renderPdfGedungView(true);
};

window.openPdfRoomScheduleModal = function(code) {
  const existing = document.getElementById('modal-room-schedule-detail');
  if (existing) existing.remove();
  const room = pdfRoomsDataDefault.find(r => r.code === code);
  if (!room) return;

  const modal = document.createElement('div');
  modal.id = 'modal-room-schedule-detail';
  modal.className = 'fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-[#eef4ff]">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8]">${room.code}</span>
          <h3 class="text-sm font-extrabold text-slate-900 mt-0.5">${room.name}</h3>
        </div>
        <button type="button" onclick="document.getElementById('modal-room-schedule-detail')?.remove()" class="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="p-5 space-y-4 text-xs">
        <div class="flex items-center justify-between gap-2">
          <span class="text-slate-500 font-semibold">Status Ruangan</span>
          <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${room.statusClass}">${room.status}</span>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <div class="text-[11px] font-bold text-slate-800">Keterangan Jadwal &amp; Aktivitas</div>
          <p class="text-xs text-slate-600 leading-relaxed">${room.scheduleInfo || 'Ruangan terjadwal dalam agenda kegiatan kampus.'}</p>
        </div>
        <div class="space-y-1 text-slate-600">
          <div class="text-[11px] font-bold text-slate-800 mb-1">Lokasi &amp; Fasilitas Terpasang</div>
          <div class="text-[11px] text-slate-500 mb-1.5">${room.meta}</div>
          <div>${room.equip1}</div>
          <div>${room.equip2}</div>
          <div>${room.equip3}</div>
        </div>
        <div class="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          <button type="button" onclick="document.getElementById('modal-room-schedule-detail')?.remove()" class="px-4 py-2 rounded-xl bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold cursor-pointer">Tutup</button>
        </div>
      </div>
    </div>
  `;
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
  if (window.lucide) lucide.createIcons();
};

window.handlePdfRoomAction = function(code, name, type) {
  if (type === 'primary') {
    handleBooking(code, name);
  } else if (type === 'goto_loans') {
    window.location.href = 'peminjaman.html';
  } else {
    openPdfRoomScheduleModal(code);
  }
};

async function syncBookedRoomsFromBackend() {
  if (typeof API === 'undefined') return;
  try {
    const res = await API.getLoans();
    if (!res || !res.success || !Array.isArray(res.data)) return;
    res.data.forEach(loan => {
      const statusNorm = (loan.status || '').toLowerCase();
      if (statusNorm === 'selesai' || statusNorm === 'dikembalikan' || statusNorm === 'ditolak') return;
      const assetText = (loan.asset_nama || '').toUpperCase();
      const matched = pdfRoomsDataDefault.find(r => assetText.includes(r.code.toUpperCase()));
      if (matched && matched.actionType === 'primary') {
        const isPending = statusNorm.includes('menunggu') || statusNorm.includes('diajukan');
        matched.status = isPending ? 'MENUNGGU APPROVAL' : 'SEDANG DIPINJAM';
        matched.statusClass = isPending ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700';
        matched.scheduleInfo = `Dibooking oleh ${loan.peminjam_nama} (${loan.tgl_pinjam || '-'} s/d ${loan.tgl_kembali || '-'}) — ${loan.keperluan || 'Reservasi Ruangan'}`;
        matched.actionLabel = 'Lihat di Peminjaman Saya →';
        matched.actionType = 'goto_loans';
      }
    });
    renderPdfGedungView();
  } catch (err) {
    console.warn('Sync room bookings fallback:', err.message);
  }
}

function renderPdfGedungView(preserveFocus = false) {
  const mainEl = document.querySelector('main');
  if (!mainEl) return;

  Array.from(mainEl.children).forEach(ch => {
    if (ch.id !== 'simas-pdf-gedung-root' && !ch.id?.startsWith('modal-')) {
      ch.classList.add('hidden');
    }
  });

  let root = document.getElementById('simas-pdf-gedung-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'simas-pdf-gedung-root';
    mainEl.prepend(root);
  }

  const u = typeof getCurrentUser === 'function' ? getCurrentUser() : { role: 'admin' };
  const canCreate = typeof hasPermission === 'function' ? hasPermission('locations:manage') : (u.role === 'admin');

  const q = pdfBuildingSearch.trim().toLowerCase();
  const filteredBuildings = pdfBuildingsData.filter(b => {
    if (!q) return true;
    const matchBld = b.name.toLowerCase().includes(q) || b.floorsLabel.toLowerCase().includes(q);
    const matchAnyRoom = pdfRoomsDataDefault.some(r =>
      r.buildingCode === b.code &&
      (r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q))
    );
    return matchBld || matchAnyRoom;
  });

  const allRooms = [...pdfRoomsDataDefault];
  const visibleRooms = allRooms.filter(rm => {
    if (pdfSelectedBuildingCode !== 'ALL' && rm.buildingCode !== pdfSelectedBuildingCode) {
      return false;
    }
    if (q) {
      const bldObj = pdfBuildingsData.find(b => b.code === rm.buildingCode);
      const bldMatches = bldObj && bldObj.name.toLowerCase().includes(q);
      const roomMatches = rm.name.toLowerCase().includes(q) || rm.code.toLowerCase().includes(q) || rm.meta.toLowerCase().includes(q);
      if (!bldMatches && !roomMatches) return false;
    }
    return true;
  });

  const activeBuilding = pdfBuildingsData.find(b => b.code === pdfSelectedBuildingCode);
  const rightHeading = pdfSelectedBuildingCode === 'ALL'
    ? 'Daftar Ruangan: Semua Gedung Kampus'
    : `Daftar Ruangan: ${activeBuilding ? activeBuilding.name : 'Gedung Terpilih'}`;

  const totalRoomsCount = allRooms.length;
  const availableRoomsCount = allRooms.filter(r => r.actionType === 'primary').length;
  const occupiedRoomsCount = totalRoomsCount - availableRoomsCount;
  const maintenanceRoomsCount = allRooms.filter(r => r.status.includes('PERBAIKAN')).length;
  const visibleAvailableCount = visibleRooms.filter(r => r.actionType === 'primary').length;

  root.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
      <!-- Top Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 class="text-base font-bold text-slate-900">Pemetaan Denah Gedung &amp; Ketersediaan Ruang</h2>
        ${canCreate ? `
          <div class="flex items-center gap-2.5">
            <button type="button" onclick="openModalTambahRuangan()" class="px-4 py-2 rounded-lg bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition cursor-pointer">
              + Tambah Ruangan Baru
            </button>
          </div>
        ` : ''}
      </div>

      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="rounded-xl border border-slate-200/90 bg-slate-50/40 p-4">
          <div class="text-xs font-semibold text-slate-500">Total Kompleks</div>
          <div class="text-xl font-extrabold text-slate-900 mt-1">${pdfBuildingsData.length} Gedung</div>
          <div class="text-[11px] font-semibold text-[#1D4ED8] mt-1">Area Kampus Terpadu</div>
        </div>
        <div class="rounded-xl border border-slate-200/90 bg-slate-50/40 p-4">
          <div class="text-xs font-semibold text-slate-500">Total Ruangan</div>
          <div class="text-xl font-extrabold text-slate-900 mt-1">${totalRoomsCount} Ruang</div>
          <div class="text-[11px] font-semibold text-emerald-600 mt-1">${availableRoomsCount} Tersedia untuk Booking</div>
        </div>
        <div class="rounded-xl border border-slate-200/90 bg-slate-50/40 p-4">
          <div class="text-xs font-semibold text-slate-500">Ruang Terpakai / Terjadwal</div>
          <div class="text-xl font-extrabold text-slate-900 mt-1">${occupiedRoomsCount} Ruangan</div>
          <div class="text-[11px] font-semibold text-amber-600 mt-1">Aktif Kuliah / Event / Booking</div>
        </div>
        <div class="rounded-xl border border-slate-200/90 bg-slate-50/40 p-4">
          <div class="text-xs font-semibold text-slate-500">Fasilitas Perbaikan</div>
          <div class="text-xl font-extrabold text-slate-900 mt-1">${maintenanceRoomsCount} Ruang</div>
          <div class="text-[11px] font-semibold text-red-600 mt-1">AC / Proyektor Servis</div>
        </div>
      </div>

      <!-- 12-Col Split -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <!-- Left 4 Cols: Hierarki Struktur Gedung -->
        <div class="lg:col-span-4 rounded-2xl border border-slate-200/90 bg-slate-50/40 p-4">
          <div class="flex items-center justify-between gap-2 mb-3">
            <h3 class="text-xs font-bold text-slate-900">Hierarki Struktur Gedung</h3>
            <button type="button" onclick="selectPdfBuilding('ALL')" class="text-[11px] font-bold transition cursor-pointer ${
              pdfSelectedBuildingCode === 'ALL' ? 'text-[#1D4ED8] underline' : 'text-slate-500 hover:text-[#1D4ED8]'
            }">
              Semua (${totalRoomsCount})
            </button>
          </div>
          <input id="pdf-gedung-search-input" type="text" value="${pdfBuildingSearch.replace(/"/g, '&quot;')}" oninput="onPdfBuildingSearch(this.value)" placeholder="Filter gedung atau ruangan..." class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 mb-3" />

          <div class="space-y-2.5">
            ${filteredBuildings.map(b => {
              const active = pdfSelectedBuildingCode === b.code;
              const bldRooms = allRooms.filter(r => r.buildingCode === b.code);
              const bldAvail = bldRooms.filter(r => r.actionType === 'primary').length;
              return `
                <button type="button" onclick="selectPdfBuilding('${b.code}')" data-building-code="${b.code}" class="w-full text-left p-3.5 rounded-xl border transition cursor-pointer ${
                  active
                    ? 'border-blue-500 bg-blue-50/50 shadow-2xs ring-1 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }">
                  <div class="flex items-center justify-between gap-2">
                    <div class="text-xs font-bold ${active ? 'text-[#1D4ED8]' : 'text-slate-900'}">${b.name}</div>
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${active ? 'bg-[#1D4ED8] text-white' : 'bg-slate-100 text-slate-600'}">${bldRooms.length} Ruang</span>
                  </div>
                  <div class="text-[11px] text-slate-500 mt-0.5">${b.floorsLabel} • ${bldRooms.length} Ruangan • ${b.assetsLabel}</div>
                  <div class="text-[11px] font-semibold ${bldAvail > 0 ? 'text-emerald-600' : 'text-slate-500'} mt-1">${bldAvail} Ruang Tersedia • ${b.statusNote}</div>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right 8 Cols: Daftar Ruangan (Terhubung ke Gedung Terpilih) -->
        <div class="lg:col-span-8">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h3 id="pdf-selected-building-title" class="text-xs font-bold text-slate-900">${rightHeading}</h3>
            <span class="px-2.5 py-1 rounded-md bg-blue-50 text-[#1D4ED8] text-[11px] font-bold">
              ${visibleRooms.length} Ruangan (${visibleAvailableCount} Siap Booking)
            </span>
          </div>
          <div id="pdf-rooms-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${visibleRooms.length === 0 ? `
              <div class="col-span-full rounded-xl border border-slate-200/90 bg-white p-8 text-center text-xs text-slate-500">
                Tidak ada ruangan yang cocok di gedung ini.
              </div>
            ` : visibleRooms.map(rm => {
              const canBookRoom = typeof hasPermission === 'function' ? hasPermission('loans:create') : true;
              const effectiveActionType = (rm.actionType === 'primary' && !canBookRoom) ? 'outline' : rm.actionType;
              const effectiveActionLabel = (rm.actionType === 'primary' && !canBookRoom) ? 'Detail Jadwal & Fasilitas' : rm.actionLabel;
              return `
              <div class="rounded-xl border border-slate-200/90 bg-white p-4 flex flex-col justify-between shadow-2xs">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="text-xs font-bold text-[#1D4ED8]">${rm.code}</span>
                    <span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${rm.statusClass}">${rm.status}</span>
                  </div>
                  <h4 class="text-sm font-bold text-slate-900">${rm.name}</h4>
                  <p class="text-[11px] text-slate-400 mt-0.5 mb-3">${rm.meta}</p>
                  <div class="space-y-1 text-xs text-slate-600 mb-4">
                    <div>${rm.equip1}</div>
                    <div>${rm.equip2}</div>
                    <div>${rm.equip3}</div>
                  </div>
                </div>
                <button type="button" onclick="handlePdfRoomAction('${rm.code}', '${rm.name.replace(/'/g, "\\'")}', '${effectiveActionType}')" class="w-full py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  effectiveActionType === 'primary'
                    ? 'bg-[#1D4ED8] hover:bg-blue-800 text-white shadow-2xs'
                    : (effectiveActionType === 'goto_loans'
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                      : 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700')
                }">
                  ${effectiveActionLabel}
                </button>
              </div>
            `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
  if (preserveFocus) {
    const input = document.getElementById('pdf-gedung-search-input');
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btnTambah = document.getElementById('btn-tambah-aksi');
  if (btnTambah) {
    btnTambah.addEventListener('click', openModalTambahRuangan);
  }
  renderPdfGedungView();
  syncBookedRoomsFromBackend();
});

function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-medium z-50 flex items-center gap-2';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>
    <span>${message}</span>
  `;
  if (window.lucide) lucide.createIcons();

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

