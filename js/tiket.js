/**
 * SIMAS - Pemeliharaan & Tiket Perbaikan
 * Skrip Logika, Data Dinamis Array, Kanban Rendering, dan Drawer Panel Interaktif
 */

// ===================== 1. DATA MASTER =====================

const navMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-panel-left', href: 'index.html', active: false },
  { id: 'aset', label: 'Manajemen Aset', icon: 'archive', href: 'aset.html', active: false },
  { id: 'gedung', label: 'Gedung & Ruangan', icon: 'building-2', href: 'gedung.html', active: false },
  { id: 'peminjaman', label: 'Peminjaman & Reservasi', icon: 'calendar-clock', href: 'peminjaman.html', active: false },
  { id: 'antrean', label: 'Antrean Persetujuan', icon: 'check-square', href: 'antrean.html', active: false, badge: 4 },
  { id: 'tiket', label: 'Pemeliharaan & Tiket', icon: 'wrench', href: 'tiket.html', active: true },
  { id: 'mutasi', label: 'Mutasi Aset', icon: 'arrow-left-right', href: 'mutasi.html', active: false },
  { id: 'stock', label: 'Stock Opname', icon: 'scan-barcode', href: 'stock.html', active: false },
  { id: 'laporan', label: 'Laporan & Rangkuman', icon: 'file-text', href: 'laporan.html', active: false },
];

const statCardsData = [
  {
    id: 'tiket-baru',
    title: 'TIKET BARU',
    count: '5',
    badge: '+2 Hari Ini',
    badgeClass: 'bg-rose-50 text-rose-600 border border-rose-200/70',
    subtitle: 'Menunggu alokasi teknisi',
    icon: 'inbox',
    iconBg: 'bg-rose-50 text-rose-600'
  },
  {
    id: 'dikerjakan',
    title: 'SEDANG DIKERJAKAN',
    count: '12',
    badge: '6 Teknisi Aktif',
    badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200/70',
    subtitle: 'Penanganan di lapangan',
    icon: 'wrench',
    iconBg: 'bg-blue-50 text-blue-700'
  },
  {
    id: 'tunggu-part',
    title: 'TUNGGU SPAREPART',
    count: '4',
    badge: 'Procurement',
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200/70',
    subtitle: 'Estimasi PO 2–3 hari kerja',
    icon: 'clock',
    iconBg: 'bg-amber-50 text-amber-600'
  },
  {
    id: 'selesai-bulan-ini',
    title: 'SELESAI BULAN INI',
    count: '48',
    badge: '94% SLA Tercapai',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/70',
    subtitle: 'Rata-rata MTTR < 24 jam',
    icon: 'check-circle-2',
    iconBg: 'bg-emerald-50 text-emerald-600'
  },
  {
    id: 'biaya-servis',
    title: 'REALISASI BIAYA',
    count: 'Rp 18,45 Jt',
    fullAmount: 'Rp 18.450.000',
    badge: 'Hemat 12%',
    badgeClass: 'bg-teal-50 text-teal-700 border border-teal-200/70',
    subtitle: 'Rp 18.450.000 (Di bawah plafon)',
    icon: 'wallet',
    iconBg: 'bg-indigo-50 text-indigo-600'
  }
];

const kanbanData = [
  {
    id: 'col-1',
    colNumber: '1',
    title: 'Tiket Baru',
    dotColor: 'bg-rose-500',
    badgeCount: 3,
    badgeBg: 'bg-rose-100 text-rose-700',
    cards: [
      {
        id: 'TK-2024-1048',
        priority: 'URGENT',
        priorityClass: 'bg-rose-50 text-rose-600 border border-rose-200',
        categoryTag: 'Utilitas AC',
        time: '15 mnt lalu',
        title: 'AC Split 2 PK Bocor & Menetes Air Deras',
        location: 'Lab Jaringan Komputer 302',
        gedung: 'Gedung TI',
        image: '../assets/ac_split.jpg',
        imageBadge: '1 Foto Lapangan',
        reporter: 'Dr. Hendro (Fasilkom)',
        actionLabel: 'Tugaskan',
        actionClass: 'bg-[#0f2a71] text-white hover:bg-[#0a1e54]'
      },
      {
        id: 'TK-2024-1047',
        priority: 'SEDANG',
        priorityClass: 'bg-blue-50 text-blue-700 border border-blue-200',
        categoryTag: 'Multimedia',
        time: '1 jam lalu',
        title: 'Proyektor Epson LCD Lampu Redup & Kedip',
        location: 'Ruang Sidang Senat Gd. Rektorat',
        gedung: 'Rektorat',
        reporter: 'Sekretariat Senat',
        actionLabel: 'Tugaskan',
        actionClass: 'bg-[#e0eefc] text-[#0f2a71] hover:bg-[#d0e5fb]'
      },
      {
        id: 'TK-2024-1045',
        priority: 'SEDANG',
        priorityClass: 'bg-blue-50 text-blue-700 border border-blue-200',
        categoryTag: 'Sanitasi',
        time: '3 jam lalu',
        title: 'Kran Wastafel Toilet Pria Patah',
        location: 'Toilet Lt. 2 Gd. Perpustakaan',
        gedung: 'Perpustakaan',
        reporter: 'Koord. Kebersihan',
        actionLabel: 'Tugaskan',
        actionClass: 'bg-[#e0eefc] text-[#0f2a71] hover:bg-[#d0e5fb]'
      }
    ]
  },
  {
    id: 'col-2',
    colNumber: '2',
    title: 'Ditugaskan',
    dotColor: 'bg-blue-600',
    badgeCount: 2,
    badgeBg: 'bg-blue-100 text-blue-700',
    cards: [
      {
        id: 'TK-2024-1042',
        priority: 'TINGGI',
        priorityClass: 'bg-amber-50 text-amber-700 border border-amber-200',
        categoryTag: 'SLA: 4 Jam',
        schedule: 'Jadwal 13:00',
        title: 'Kunci Pintu Smartlock Tidak Merespons RFID',
        location: 'Ruang Server Gedung TI Lt. 1',
        gedung: 'Gedung TI',
        techAvatar: 'DA',
        techAvatarBg: 'bg-blue-900 text-white',
        techName: 'Dedi Aryanto',
        techRole: 'Teknisi Elektronika',
        actionLabel: 'Mulai Kerja',
        actionClass: 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
      },
      {
        id: 'TK-2024-1040',
        priority: 'SEDANG',
        priorityClass: 'bg-blue-50 text-blue-700 border border-blue-200',
        categoryTag: 'SLA: 24 Jam',
        schedule: 'Jadwal 14:30',
        title: 'Plafon Gypsum Koridor Retak & Rawan Jatuh',
        location: 'Koridor Barat Lt. 3 Saintek',
        gedung: 'Saintek',
        techAvatar: 'WS',
        techAvatarBg: 'bg-slate-700 text-white',
        techName: 'Wahyu Santoso',
        techRole: 'Sipil & Bangunan',
        actionLabel: 'Mulai Kerja',
        actionClass: 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
      }
    ]
  },
  {
    id: 'col-3',
    colNumber: '3',
    title: 'Dalam Pengerjaan',
    dotColor: 'bg-teal-500',
    badgeCount: 2,
    badgeBg: 'bg-teal-100 text-teal-800',
    hasRefresh: true,
    cards: [
      {
        id: 'TK-2024-1033',
        priority: 'URGENT',
        priorityClass: 'bg-rose-50 text-rose-600 border border-rose-200',
        categoryTag: 'Progres 70%',
        schedule: 'Est. 1 jam',
        title: 'Rewiring Kabel Genset Utama & ATS Panel',
        location: 'Rumah Daya Gardu Timur',
        gedung: 'Gardu Daya',
        progress: 70,
        techAvatar: 'IK',
        techAvatarBg: 'bg-blue-950 text-white',
        techName: 'Irfan K.',
        techRole: 'Part: Rp 450.000',
        actionLabel: 'Update Log',
        actionClass: 'bg-[#0f2a71] text-white hover:bg-[#0a1e54]'
      },
      {
        id: 'TK-2024-1031',
        priority: 'TINGGI',
        priorityClass: 'bg-amber-50 text-amber-700 border border-amber-200',
        categoryTag: 'Tunggu Part',
        schedule: 'PO-8921',
        scheduleClass: 'text-amber-700 font-bold',
        title: 'Penggantian Kompresor Kulkas Reagen Lab Kimia',
        location: 'Lab Bioteknologi R-204',
        gedung: 'Saintek',
        techAvatar: 'BM',
        techAvatarBg: 'bg-emerald-700 text-white',
        techName: 'Budi Mulyono',
        techRole: 'Suku Cadang Dikirim',
        actionLabel: 'Update Log',
        actionClass: 'bg-[#e0eefc] text-[#0f2a71] hover:bg-[#d0e5fb]'
      }
    ]
  },
  {
    id: 'col-4',
    colNumber: '4',
    title: 'Selesai & Uji Fungsi',
    dotColor: 'bg-emerald-600',
    badgeCount: 2,
    badgeBg: 'bg-emerald-100 text-emerald-800',
    cards: [
      {
        id: 'TK-2024-1028',
        priority: 'SEDANG',
        priorityClass: 'bg-blue-50 text-blue-700 border border-blue-200',
        categoryTag: 'Uji Fungsi OK',
        schedule: 'Siap Verifikasi',
        title: 'Perbaikan Pompa Air Booster Gedung Perpustakaan',
        location: 'Rooftop Perpustakaan Pusat',
        gedung: 'Perpustakaan',
        image: '../assets/pompa_booster.jpg',
        imageBadge: 'Biaya: Rp 820.000',
        techAvatar: 'SK',
        techAvatarBg: 'bg-teal-700 text-white',
        techName: 'Sukardi',
        techRole: 'Teknisi Mekanikal',
        actionLabel: 'Verifikasi',
        actionClass: 'bg-[#0e5c54] text-white hover:bg-[#094741]'
      },
      {
        id: 'TK-2024-1025',
        priority: 'RENDAH',
        priorityClass: 'bg-slate-100 text-slate-600 border border-slate-200',
        categoryTag: 'Closed',
        schedule: 'Kemarin',
        title: 'Penggantian Lampu PJU Koridor Utara',
        location: 'Taman Kampus Terpadu',
        gedung: 'Fasilitas Luar',
        techAvatar: 'BU',
        techAvatarBg: 'bg-slate-600 text-white',
        techName: 'Ka. Bag. Umum',
        techRole: 'Biaya: Rp 340.000',
        isClosed: true
      }
    ]
  }
];

// Variable state untuk tiket yang sedang dibuka di drawer (null secara default agar halaman utama lega)
let currentActiveTicketId = null;

// ===================== 2. DOM INITIALIZATION =====================

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  renderStatCards();
  renderKanbanBoard();
  initDrawerInteractions();
  initViewSwitcher();
  initFilters();
  applyRbacToTiketPage();

  if (window.lucide) {
    lucide.createIcons();
  }
});

function applyRbacToTiketPage() {
  if (typeof hasPermission !== 'function') return;
  if (!hasPermission('maintenance:manage')) {
    const btnTambah = document.getElementById('btn-tambah-aksi');
    if (btnTambah) btnTambah.style.display = 'none';
    const submitBtn = document.querySelector('#completion-form button[type="submit"]');
    if (submitBtn) submitBtn.style.display = 'none';
    const pageTitle = document.querySelector('main h1');
    if (pageTitle) pageTitle.textContent = 'Monitoring Pemeliharaan & Biaya Perbaikan';
  }
}

// ===================== 3. RENDERING FUNCTIONS =====================

function renderSidebar() {
  if (typeof renderNavigation === 'function') {
    renderNavigation('pemeliharaan');
    return;
  }
}

/** Render 5 KPI Stat Cards yang Proporsional & Dinamis mengikuti Kanban */
function renderStatCards() {
  const container = document.getElementById('stat-cards-container');
  if (!container) return;

  const col1Count = kanbanData[0] ? kanbanData[0].cards.length : 0;
  const col2Count = kanbanData[1] ? kanbanData[1].cards.length : 0;
  const col3Count = kanbanData[2] ? kanbanData[2].cards.length : 0;
  const col4Count = kanbanData[3] ? kanbanData[3].cards.length : 0;

  if (statCardsData[0]) statCardsData[0].count = String(col1Count + col2Count);
  if (statCardsData[1]) statCardsData[1].count = String(col3Count);
  if (statCardsData[3]) statCardsData[3].count = String(36 + col4Count);

  container.innerHTML = statCardsData.map(stat => {
    return `
      <div class="bg-white rounded-xl p-3.5 soft-shadow border border-slate-200/80 flex flex-col justify-between">
        <div class="flex items-center justify-between gap-2">
          <div class="w-8 h-8 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0">
            <i data-lucide="${stat.icon}" class="w-4 h-4"></i>
          </div>
          ${stat.badge ? `
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${stat.badgeClass}">
              ${stat.badge}
            </span>
          ` : ''}
        </div>
        
        <div class="mt-2.5">
          <div class="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 truncate">${stat.title}</div>
          <div class="text-2xl font-extrabold text-slate-900 leading-tight tracking-tight mt-0.5 whitespace-nowrap" title="${stat.fullAmount || stat.count}">
            ${stat.count}
          </div>
        </div>

        <div class="text-[11px] text-slate-500 font-medium mt-1.5 truncate" title="${stat.subtitle}">
          ${stat.subtitle}
        </div>
      </div>
    `;
  }).join('');
}

/** Render Kanban Columns & Cards */
function renderKanbanBoard(filterQuery = '', filterGedung = 'all', filterPrioritas = 'all') {
  const board = document.getElementById('kanban-board');
  if (!board) return;

  board.innerHTML = kanbanData.map(col => {
    const filteredCards = col.cards.filter(c => {
      const matchText = !filterQuery || 
        c.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
        (c.location && c.location.toLowerCase().includes(filterQuery.toLowerCase()));
      
      const matchGedung = filterGedung === 'all' || (c.gedung && c.gedung.toLowerCase().includes(filterGedung.toLowerCase()));
      const matchPrioritas = filterPrioritas === 'all' || (c.priority && c.priority.toUpperCase() === filterPrioritas.toUpperCase());

      return matchText && matchGedung && matchPrioritas;
    });

    return `
      <div class="kanban-col flex flex-col">
        <!-- Column Header -->
        <div class="flex items-center justify-between mb-2.5 px-1">
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-2.5 h-2.5 rounded-full ${col.dotColor} shrink-0"></span>
            <h3 class="text-xs font-extrabold text-slate-800 truncate">${col.colNumber}. ${col.title}</h3>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[11px] font-extrabold ${col.badgeBg} shrink-0">${filteredCards.length}</span>
        </div>

        <!-- Cards List -->
        <div class="space-y-2.5 flex-1">
          ${filteredCards.length > 0 ? filteredCards.map(card => renderCardHTML(card)).join('') : `
            <div class="p-6 text-center text-xs text-slate-400 bg-white/70 rounded-xl border border-dashed border-slate-300">
              Tidak ada tiket sesuai filter
            </div>
          `}
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

/** Cari data tiket berdasarkan ID dari master kanbanData */
function findTicketById(ticketId) {
  for (const col of kanbanData) {
    const found = col.cards.find(c => c.id === ticketId);
    if (found) {
      return { ...found, colId: col.id, colTitle: col.title };
    }
  }
  return null;
}

/** Render Individual Kanban Card HTML yang Rapi & Tidak Pernah Terpotong */
function renderCardHTML(card) {
  const isSelected = card.id === currentActiveTicketId;
  const priorityBadgeClass = card.priority === 'URGENT'
    ? 'bg-rose-50 text-rose-600 border border-rose-200'
    : card.priority === 'TINGGI'
    ? 'bg-amber-50 text-amber-700 border border-amber-200'
    : card.priority === 'RENDAH'
    ? 'bg-slate-100 text-slate-600 border border-slate-200'
    : (card.priorityClass || 'bg-blue-50 text-blue-700 border border-blue-200');

  const displayTag = card.categoryTag || (card.tag ? card.tag.replace(/^KATEGORI:\s*/i, '') : '');
  const timeOrSchedule = card.time || card.schedule || '';

  // Personil utama (Teknisi atau Pelapor)
  const personName = card.techName || card.reporter || card.verifier || 'Tim Sarpras';
  const personSub = card.techRole || (card.reporter ? 'Pelapor Tiket' : 'Terverifikasi');
  const avatarInitials = card.techAvatar || personName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const avatarBg = card.techAvatarBg || 'bg-slate-700 text-white';

  const btnLabel = card.actionLabel || (card.actionButton && card.actionButton.label) || card.actionVerify || 'Detail';
  const btnClass = card.actionClass || 'bg-[#edf4fe] hover:bg-[#dfeafb] text-[#0f2a71] border border-blue-200/80';

  return `
    <div data-ticket-id="${card.id}" onclick="openCompletionDrawer('${card.id}')" 
         class="bg-white rounded-xl p-3.5 card-elevation border transition-all duration-150 relative group cursor-pointer hover:border-blue-400 ${isSelected ? 'ring-2 ring-blue-600 border-blue-500 bg-blue-50/10' : 'border-slate-200/90'}">
      
      <!-- 1. Top Row: Priority + Short Tag on Left, Time on Right -->
      <div class="flex items-center justify-between gap-1.5 mb-2">
        <div class="flex items-center gap-1.5 min-w-0">
          ${card.priority ? `
            <span class="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase whitespace-nowrap shrink-0 ${priorityBadgeClass}">${card.priority}</span>
          ` : ''}
          ${displayTag ? `
            <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 truncate max-w-[115px]" title="${displayTag}">${displayTag}</span>
          ` : ''}
        </div>
        ${timeOrSchedule ? `
          <span class="${card.scheduleClass || 'text-slate-400'} text-[10px] font-medium whitespace-nowrap shrink-0">${timeOrSchedule}</span>
        ` : ''}
      </div>

      <!-- 2. Ticket ID & Title -->
      <div class="text-[11px] font-extrabold text-blue-700 tracking-tight">#${card.id}</div>
      <h4 class="text-xs font-extrabold text-slate-900 mt-0.5 leading-snug line-clamp-2" title="${card.title}">${card.title}</h4>

      <!-- 3. Location -->
      <p class="text-[11px] text-slate-500 mt-1 flex items-center gap-1 truncate" title="${card.location}">
        <i data-lucide="map-pin" class="w-3 h-3 text-slate-400 shrink-0"></i>
        <span class="truncate">${card.location}</span>
      </p>

      <!-- 4. Optional Image Attachment -->
      ${card.image ? `
        <div class="mt-2.5 relative rounded-lg overflow-hidden border border-slate-200/80 bg-slate-100">
          <img src="${card.image}" alt="${card.title}" class="w-full h-24 object-cover">
          ${card.imageBadge ? `
            <div class="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-medium flex items-center gap-1 backdrop-blur-xs">
              <i data-lucide="camera" class="w-3 h-3"></i>
              <span>${card.imageBadge}</span>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- 5. Optional Progress Bar -->
      ${card.progress !== undefined ? `
        <div class="mt-2.5">
          <div class="flex items-center justify-between text-[10px] font-semibold text-slate-500 mb-1">
            <span>Progres Pengerjaan</span>
            <span class="text-teal-700 font-bold">${card.progress}%</span>
          </div>
          <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-teal-500 rounded-full" style="width: ${card.progress}%;"></div>
          </div>
        </div>
      ` : ''}

      <!-- 6. Single Unified Footer (Person on Left, Action Button on Right) -->
      <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <div class="w-6 h-6 rounded-full ${avatarBg} flex items-center justify-center text-[10px] font-bold shrink-0">
            ${avatarInitials}
          </div>
          <div class="leading-tight min-w-0 truncate">
            <div class="text-[11px] font-bold text-slate-800 truncate" title="${personName}">${personName}</div>
            <div class="text-[10px] text-slate-500 truncate">${personSub}</div>
          </div>
        </div>

        ${card.isClosed ? `
          <span class="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold whitespace-nowrap shrink-0">
            ✓ Selesai
          </span>
        ` : `
          <button type="button" onclick="event.stopPropagation(); openCompletionDrawer('${card.id}')" class="h-7 px-2.5 rounded-lg text-[11px] font-bold ${btnClass} transition inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0">
            <span>${btnLabel}</span>
          </button>
        `}
      </div>

    </div>
  `;
}

// ===================== 4. DRAWER LOGIC & FORM =====================

function initDrawerInteractions() {
  const closeBtn = document.getElementById('close-drawer-btn');
  const cancelBtn = document.getElementById('cancel-drawer-btn');
  const form = document.getElementById('completion-form');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeCompletionDrawer);
  }
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeCompletionDrawer);
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const tindakanVal = document.getElementById('form-tindakan').value.trim();
      const biayaSuku = parseInt(String(document.getElementById('form-biaya-suku').value).replace(/[^0-9]/g, ''), 10) || 0;
      const biayaJasa = parseInt(String(document.getElementById('form-biaya-jasa').value).replace(/[^0-9]/g, ''), 10) || 0;
      const totalBiaya = biayaSuku + biayaJasa;

      const activeId = currentActiveTicketId || 'TK-2024-1033';
      let foundColIdx = -1;
      let foundCardIdx = -1;
      let cardObj = null;

      kanbanData.forEach((col, cIdx) => {
        const idx = col.cards.findIndex(c => c.id === activeId);
        if (idx !== -1) {
          foundColIdx = cIdx;
          foundCardIdx = idx;
          cardObj = col.cards[idx];
        }
      });

      if (cardObj) {
        if (tindakanVal) {
          cardObj.progressNote = tindakanVal;
          cardObj.solutionNote = tindakanVal;
        }
        if (totalBiaya > 0) {
          const formattedRp = 'Rp ' + totalBiaya.toLocaleString('id-ID');
          cardObj.techRole = `Biaya: ${formattedRp}`;
          cardObj.finalCost = formattedRp;
        }

        let newBackendStatus = 'proses';
        if (foundColIdx >= 0 && foundColIdx < 3) {
          kanbanData[foundColIdx].cards.splice(foundCardIdx, 1);
          const nextColIdx = foundColIdx + 1;
          if (nextColIdx === 1) {
            newBackendStatus = 'ditugaskan';
            cardObj.techName = cardObj.techName || 'Joko Supriyanto';
            cardObj.techRole = cardObj.techRole || 'Teknisi Sarpras';
            cardObj.techAvatar = cardObj.techAvatar || 'JS';
            cardObj.actionLabel = 'Mulai Kerja';
            cardObj.actionClass = 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100';
          } else if (nextColIdx === 2) {
            newBackendStatus = 'proses';
            cardObj.progress = 75;
            cardObj.categoryTag = 'Progres 75%';
            cardObj.actionLabel = 'Update Log';
            cardObj.actionClass = 'bg-[#0f2a71] text-white hover:bg-[#0a1e54]';
          } else if (nextColIdx === 3) {
            newBackendStatus = 'selesai';
            cardObj.categoryTag = 'Terverifikasi';
            cardObj.isClosed = true;
          }
          kanbanData[nextColIdx].cards.unshift(cardObj);
        } else if (foundColIdx === 3) {
          newBackendStatus = 'selesai';
          cardObj.categoryTag = 'Terverifikasi';
          cardObj.isClosed = true;
        }

        kanbanData.forEach(col => {
          col.badgeCount = col.cards.length;
        });

        if (typeof API !== 'undefined' && cardObj.dbId) {
          await API.updateTicket(cardObj.dbId, {
            status: newBackendStatus,
            desc: tindakanVal || cardObj.title,
            cost: totalBiaya
          });
        }

        renderStatCards();
        renderKanbanBoard();
        renderTableView();
      }

      showToast(`Data log penyelesaian #${activeId} berhasil disimpan & status tiket diperbarui!`);
      closeCompletionDrawer();
    });
  }
}

window.toggleDrawerAttachment = function(type) {
  const isFoto = type === 'foto';
  const box = document.getElementById(isFoto ? 'upload-box-foto' : 'upload-box-nota');
  const label = document.getElementById(isFoto ? 'upload-label-foto' : 'upload-label-nota');
  const sub = document.getElementById(isFoto ? 'upload-sub-foto' : 'upload-sub-nota');
  if (!box || !label || !sub) return;

  const attached = box.dataset.attached === 'true';
  if (!attached) {
    box.dataset.attached = 'true';
    box.className = 'bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition';
    label.textContent = isFoto ? '✓ Foto_Perbaikan.jpg' : '✓ Nota_Servis.pdf';
    label.className = 'text-xs font-bold text-emerald-800';
    sub.textContent = 'Terlampir (Klik untuk batal)';
    sub.className = 'text-[10px] text-emerald-600 font-semibold';
    showToast(isFoto ? 'Foto dokumentasi perbaikan berhasil dilampirkan.' : 'Bukti nota biaya servis berhasil dilampirkan.');
  } else {
    box.dataset.attached = 'false';
    box.className = 'bg-[#f8fafc] border border-dashed border-slate-300 hover:border-blue-400 rounded-xl p-3 text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition hover:bg-blue-50/40';
    label.textContent = isFoto ? 'Foto Aset Normal' : 'Unggah Nota Biaya';
    label.className = 'text-xs font-bold text-slate-800';
    sub.textContent = isFoto ? 'Klik untuk lampirkan JPG/PNG' : 'Klik untuk lampirkan PDF/Struk';
    sub.className = 'text-[10px] text-slate-500';
    showToast('Lampiran dibatalkan.');
  }
};

window.openCompletionDrawer = function(ticketId = 'TK-2024-1033') {
  const drawer = document.getElementById('completion-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (!drawer) return;

  const ticket = findTicketById(ticketId);
  if (!ticket) {
    console.warn('Tiket tidak ditemukan:', ticketId);
    return;
  }

  currentActiveTicketId = ticket.id;

  // 1. Update Header
  const subtitleEl = document.getElementById('drawer-subtitle');
  const ticketIdEl = document.getElementById('drawer-ticket-id');
  if (subtitleEl) {
    subtitleEl.textContent = ticket.colTitle ? `LOG SERVIS: ${ticket.colTitle.toUpperCase()}` : 'LOG PENYELESAIAN SERVIS';
  }
  if (ticketIdEl) {
    ticketIdEl.textContent = `#${ticket.id}`;
  }

  // 2. Update Deskripsi Kerusakan, Lokasi, dan Personil
  const titleEl = document.getElementById('drawer-ticket-title');
  const locEl = document.getElementById('drawer-ticket-location');
  const personEl = document.getElementById('drawer-ticket-person');

  if (titleEl) titleEl.textContent = ticket.title;
  if (locEl) locEl.textContent = ticket.location || ticket.gedung || 'Kampus Terpadu';
  if (personEl) {
    personEl.textContent = ticket.techName || ticket.reporter || ticket.verifier || 'Teknisi Sarpras';
  }

  // 3. Update Lampiran Foto jika ada
  const imgContainer = document.getElementById('drawer-image-container');
  const imgEl = document.getElementById('drawer-ticket-image');
  if (imgContainer && imgEl) {
    if (ticket.image) {
      imgEl.src = ticket.image;
      imgEl.alt = ticket.title;
      imgContainer.classList.remove('hidden');
    } else {
      imgContainer.classList.add('hidden');
    }
  }

  // 4. Update Form Inputs sesuai konteks tiket
  const tindakanEl = document.getElementById('form-tindakan');
  const sukuEl = document.getElementById('form-biaya-suku');
  const jasaEl = document.getElementById('form-biaya-jasa');
  const submitLabel = document.getElementById('drawer-submit-label');

  if (ticket.id === 'TK-2024-1048') {
    if (tindakanEl) tindakanEl.value = 'Pembersihan saluran pembuangan drainase indoor unit yang tersumbat lumut, pembersihan filter evaporator, dan pengetesan debit kondensat air.';
    if (sukuEl) sukuEl.value = '150000';
    if (jasaEl) jasaEl.value = '75000';
  } else if (ticket.id === 'TK-2024-1033') {
    if (tindakanEl) tindakanEl.value = 'Penggantian kabel power 3-phase penghubung ATS panel ke starter genset utama, crimping skun kabel 50mm, dan penataan ulang jalur kabel tray.';
    if (sukuEl) sukuEl.value = '450000';
    if (jasaEl) jasaEl.value = '0';
  } else if (ticket.id === 'TK-2024-1028') {
    if (tindakanEl) tindakanEl.value = 'Penggantian seal impeller pompa booster 2 HP, penggantian pressure switch otomatis, dan balancing motor.';
    if (sukuEl) sukuEl.value = '650000';
    if (jasaEl) jasaEl.value = '170000';
  } else if (ticket.id === 'TK-2024-1042') {
    if (tindakanEl) tindakanEl.value = 'Pengecekan modul RFID reader, penggantian baterai backup lithium, dan re-sinkronisasi firmware database kartu akses.';
    if (sukuEl) sukuEl.value = '220000';
    if (jasaEl) jasaEl.value = '50000';
  } else if (ticket.id === 'TK-2024-1047') {
    if (tindakanEl) tindakanEl.value = 'Pembersihan filter optic prisma LCD dari debu tebal, penggantian ballast lampu proyektor OEM, dan re-kalibrasi fokus.';
    if (sukuEl) sukuEl.value = '380000';
    if (jasaEl) jasaEl.value = '60000';
  } else {
    if (tindakanEl) tindakanEl.value = ticket.solutionNote || `Penanganan teknis untuk ${ticket.title} di ${ticket.location || ticket.gedung}.`;
    if (sukuEl) sukuEl.value = '0';
    if (jasaEl) jasaEl.value = '0';
  }

  if (submitLabel) {
    if (ticket.colId === 'col-1') {
      submitLabel.textContent = 'Tugaskan & Proses Servis';
    } else if (ticket.colId === 'col-4') {
      submitLabel.textContent = 'Verifikasi & Selesaikan Tiket';
    } else {
      submitLabel.textContent = 'Simpan & Ajukan Uji Fungsi';
    }
  }

  document.querySelectorAll('[data-ticket-id]').forEach(el => {
    if (el.getAttribute('data-ticket-id') === ticket.id) {
      el.classList.add('ring-2', 'ring-blue-600', 'border-blue-500', 'bg-blue-50/10');
      el.classList.remove('border-slate-200/90');
    } else {
      el.classList.remove('ring-2', 'ring-blue-600', 'border-blue-500', 'bg-blue-50/10');
      el.classList.add('border-slate-200/90');
    }
  });

  drawer.classList.remove('is-hidden');
  if (backdrop) backdrop.classList.remove('hidden');

  const scrollableBody = drawer.querySelector('.overflow-y-auto');
  if (scrollableBody) {
    scrollableBody.scrollTop = 0;
  }

  if (window.lucide) {
    lucide.createIcons();
  }
};

window.closeCompletionDrawer = function() {
  const drawer = document.getElementById('completion-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (!drawer) return;
  drawer.classList.add('is-hidden');
  if (backdrop) backdrop.classList.add('hidden');

  currentActiveTicketId = null;
  document.querySelectorAll('[data-ticket-id]').forEach(el => {
    el.classList.remove('ring-2', 'ring-blue-600', 'border-blue-500', 'bg-blue-50/10');
    el.classList.add('border-slate-200/90');
  });
};

// ===================== 5. VIEW SWITCHER (KANBAN VS TABEL) =====================

function initViewSwitcher() {
  const btnKanban = document.getElementById('btn-view-kanban');
  const btnTable = document.getElementById('btn-view-table');
  const kanbanSection = document.getElementById('kanban-board-container');
  const tableSection = document.getElementById('table-view-container');

  if (!btnKanban || !btnTable || !kanbanSection || !tableSection) return;

  btnKanban.addEventListener('click', () => {
    btnKanban.classList.add('bg-white', 'text-slate-900', 'shadow-2xs', 'font-bold');
    btnKanban.classList.remove('text-slate-600', 'font-medium');
    btnTable.classList.remove('bg-white', 'text-slate-900', 'shadow-2xs', 'font-bold');
    btnTable.classList.add('text-slate-600', 'font-medium');

    kanbanSection.classList.remove('hidden');
    tableSection.classList.add('hidden');
  });

  btnTable.addEventListener('click', () => {
    btnTable.classList.add('bg-white', 'text-slate-900', 'shadow-2xs', 'font-bold');
    btnTable.classList.remove('text-slate-600', 'font-medium');
    btnKanban.classList.remove('bg-white', 'text-slate-900', 'shadow-2xs', 'font-bold');
    btnKanban.classList.add('text-slate-600', 'font-medium');

    kanbanSection.classList.add('hidden');
    tableSection.classList.remove('hidden');
    renderTableView();
  });
}

function renderTableView() {
  const tbody = document.getElementById('table-body-tickets');
  if (!tbody) return;

  const allCards = [];
  kanbanData.forEach(col => {
    col.cards.forEach(card => {
      allCards.push({
        ...card,
        colName: col.title,
        colDot: col.dotColor
      });
    });
  });

  tbody.innerHTML = allCards.map(c => `
    <tr onclick="openCompletionDrawer('${c.id}')" class="hover:bg-blue-50/40 transition cursor-pointer ${c.id === currentActiveTicketId ? 'bg-blue-50/60 font-semibold' : ''}">
      <td class="py-3 px-4 text-xs font-bold text-blue-700 whitespace-nowrap">#${c.id}</td>
      <td class="py-3 px-4">
        <div class="text-xs font-bold text-slate-900">${c.title}</div>
        <div class="text-[11px] text-slate-500">${c.location}</div>
      </td>
      <td class="py-3 px-4 text-xs text-slate-700 font-medium whitespace-nowrap">${c.gedung || '-'}</td>
      <td class="py-3 px-4 whitespace-nowrap">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${c.priorityClass || 'bg-slate-100 text-slate-600'}">${c.priority || 'SEDANG'}</span>
      </td>
      <td class="py-3 px-4 whitespace-nowrap">
        <div class="flex items-center gap-1.5 text-xs text-slate-800 font-medium">
          <span class="w-2 h-2 rounded-full ${c.colDot}"></span>
          <span>${c.colName}</span>
        </div>
      </td>
      <td class="py-3 px-4 text-xs text-slate-600 whitespace-nowrap">${c.techName || c.reporter || c.verifier || '-'}</td>
      <td class="py-3 px-4 text-right whitespace-nowrap">
        <button onclick="event.stopPropagation(); openCompletionDrawer('${c.id}')" class="h-7 px-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold cursor-pointer">
          Update / Detail
        </button>
      </td>
    </tr>
  `).join('');
}

// ===================== 6. FILTERS & SEARCH =====================

function initFilters() {
  const searchInput = document.getElementById('global-search-input');
  const gedungSelect = document.getElementById('filter-gedung-select');
  const prioritasSelect = document.getElementById('filter-prioritas-select');

  function triggerFilters() {
    const q = searchInput ? searchInput.value : '';
    const g = gedungSelect ? gedungSelect.value : 'all';
    const p = prioritasSelect ? prioritasSelect.value : 'all';
    renderKanbanBoard(q, g, p);
  }

  if (searchInput) {
    searchInput.addEventListener('input', triggerFilters);
  }
  if (gedungSelect) {
    gedungSelect.addEventListener('change', triggerFilters);
  }
  if (prioritasSelect) {
    prioritasSelect.addEventListener('change', triggerFilters);
  }
}

window.resetTicketFilters = function() {
  const searchInput = document.getElementById('global-search-input');
  const gedungSelect = document.getElementById('filter-gedung-select');
  const prioritasSelect = document.getElementById('filter-prioritas-select');
  if (searchInput) searchInput.value = '';
  if (gedungSelect) gedungSelect.value = 'all';
  if (prioritasSelect) prioritasSelect.value = 'all';
  renderKanbanBoard('', 'all', 'all');
  showToast('Filter tampilan tiket telah direset.');
};

window.createTicketFromPreventive = function(title, location, gedung, tech) {
  const prevModal = document.getElementById('simas-preventive-modal');
  if (prevModal) {
    prevModal.classList.add('hidden');
    prevModal.classList.remove('flex');
  }
  openModalBuatTiket();
  const titleEl = document.getElementById('tiket-title');
  const locEl = document.getElementById('tiket-location');
  const gedungEl = document.getElementById('tiket-gedung');
  const techEl = document.getElementById('tiket-tech');
  const descEl = document.getElementById('tiket-desc');
  if (titleEl) titleEl.value = title;
  if (locEl) locEl.value = location;
  if (gedungEl) gedungEl.value = gedung;
  if (techEl) techEl.value = tech;
  if (descEl) descEl.value = `Inspeksi & pemeliharaan preventif berkala: ${title} (${location}).`;
};

window.openPreventiveModal = function() {
  let modal = document.getElementById('simas-preventive-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    return;
  }

  modal = document.createElement('div');
  modal.id = 'simas-preventive-modal';
  modal.className = 'fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#eef4ff]">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-[#0f2a71] text-white flex items-center justify-center">
            <i data-lucide="calendar-check-2" class="w-4 h-4"></i>
          </div>
          <div>
            <h3 class="text-sm font-extrabold text-slate-900">Jadwal Pemeliharaan Preventif Berkala</h3>
            <p class="text-[11px] text-slate-600">Agenda inspeksi rutin utilitas gedung & fasilitas kampus</p>
          </div>
        </div>
        <button type="button" onclick="document.getElementById('simas-preventive-modal').classList.add('hidden'); document.getElementById('simas-preventive-modal').classList.remove('flex');" class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="p-5 divide-y divide-slate-100 text-xs">
        <div class="py-3 first:pt-0 flex items-center justify-between gap-3">
          <div>
            <div class="font-bold text-slate-900">Servis Cuci AC Split & Chiller Sentral (42 Unit)</div>
            <div class="text-slate-500 mt-0.5">Gedung Rektorat & Dekanat • Teknisi: Joko Supriyanto</div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span class="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px] whitespace-nowrap">Setiap Jumat</span>
            <button type="button" onclick="createTicketFromPreventive('Servis Cuci AC Split & Chiller Sentral', 'Gedung Rektorat Lt. 1-4', 'Gedung Rektorat', 'Joko Supriyanto')" class="px-2.5 py-1 rounded-lg bg-[#0f2a71] hover:bg-[#0a1e54] text-white font-bold text-[11px] cursor-pointer transition">+ Buat Tiket</button>
          </div>
        </div>
        <div class="py-3 flex items-center justify-between gap-3">
          <div>
            <div class="font-bold text-slate-900">Pemanasan & Uji Beban Genset 250 kVA + Panel ATS</div>
            <div class="text-slate-500 mt-0.5">Rumah Daya Gardu Timur • Teknisi: Irfan K.</div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] whitespace-nowrap">Senin, 08:00 WIB</span>
            <button type="button" onclick="createTicketFromPreventive('Pemanasan & Uji Beban Genset 250 kVA', 'Rumah Daya Gardu Timur', 'Gedung Teknik', 'Irfan K.')" class="px-2.5 py-1 rounded-lg bg-[#0f2a71] hover:bg-[#0a1e54] text-white font-bold text-[11px] cursor-pointer transition">+ Buat Tiket</button>
          </div>
        </div>
        <div class="py-3 last:pb-0 flex items-center justify-between gap-3">
          <div>
            <div class="font-bold text-slate-900">Kalibrasi Proyektor & Audio Ruang Sidang / Kelas</div>
            <div class="text-slate-500 mt-0.5">Gedung Kuliah Bersama • Teknisi: Dedi Aryanto</div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span class="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-[11px] whitespace-nowrap">Tanggal 1 & 15</span>
            <button type="button" onclick="createTicketFromPreventive('Kalibrasi Proyektor & Audio Ruang Sidang', 'GKB Ruang 101-305', 'Gedung Kuliah Bersama', 'Dedi Aryanto')" class="px-2.5 py-1 rounded-lg bg-[#0f2a71] hover:bg-[#0a1e54] text-white font-bold text-[11px] cursor-pointer transition">+ Buat Tiket</button>
          </div>
        </div>
      </div>
      <div class="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
        <button type="button" onclick="document.getElementById('simas-preventive-modal').classList.add('hidden'); document.getElementById('simas-preventive-modal').classList.remove('flex');" class="px-4 py-1.5 rounded-xl bg-[#0f2a71] text-white text-xs font-bold cursor-pointer">
          Tutup Jadwal
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  if (window.lucide) lucide.createIcons();
};

// ===================== 7. TOAST NOTIFICATION =====================

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

// ===================== 8. BACKEND INTEGRATION & MODAL ACTIONS =====================

let ticketAssetOptions = [];
let ticketLocationOptions = [];

async function loadTicketReferenceData() {
  try {
    const [assetsRes, locsRes] = await Promise.all([
      typeof API !== 'undefined' && API.getAssets ? API.getAssets() : fetch('/api/assets').then(r => r.json()),
      typeof API !== 'undefined' && API.getLocations ? API.getLocations() : fetch('/api/locations').then(r => r.json())
    ]);
    if (assetsRes && assetsRes.success && Array.isArray(assetsRes.data)) {
      ticketAssetOptions = assetsRes.data;
    }
    if (locsRes && locsRes.success && Array.isArray(locsRes.data)) {
      ticketLocationOptions = locsRes.data;
    }
  } catch (err) {
    console.log('Reference data load fallback:', err.message);
  }
}

function mapAssetCatToTicketCategory(rawCat) {
  const c = String(rawCat || '').toLowerCase();
  if (c.includes('ac') || c.includes('utilitas')) return 'Utilitas AC';
  if (c.includes('proyektor') || c.includes('multimedia') || c.includes('audio')) return 'Multimedia';
  if (c.includes('listrik') || c.includes('genset')) return 'Kelistrikan';
  if (c.includes('lab') || c.includes('mikroskop')) return 'Laboratorium';
  if (c.includes('elektronik') || c.includes('laptop') || c.includes('komputer')) return 'Perangkat IT';
  return 'Fasilitas Gedung';
}

function buildTicketTargetOptionsHtml(preselectCode = '', preselectMeta = null) {
  const normPre = String(preselectCode || '').trim().toLowerCase();
  let html = '<option value="">-- Pilih Barang / Fasilitas yang Bermasalah --</option>';
  let matchedPreselect = false;

  if (ticketAssetOptions.length > 0 || (normPre && preselectMeta?.nama)) {
    html += '<optgroup label="Inventaris Barang / Sarana Kampus">';
    ticketAssetOptions.forEach(a => {
      const code = a.nup || a.kode || `AST-${a.id}`;
      const altCode = String(a.kode || '').trim().toLowerCase();
      const val = `aset::${a.id}::${code}`;
      const isMatch = normPre && (code.toLowerCase() === normPre || (altCode && altCode === normPre) || String(a.id) === normPre);
      if (isMatch) matchedPreselect = true;
      const locInfo = [a.lokasi, a.gedung].filter(Boolean).join(' • ');
      html += `<option value="${escapeTicketHtml(val)}" ${isMatch ? 'selected' : ''}
        data-type="aset"
        data-id="${a.id}"
        data-kode="${escapeTicketHtml(code)}"
        data-nama="${escapeTicketHtml(a.nama)}"
        data-lokasi="${escapeTicketHtml(a.lokasi || '')}"
        data-gedung="${escapeTicketHtml(a.gedung || '')}"
        data-kategori="${escapeTicketHtml(a.kategori_nama || '')}">${escapeTicketHtml(code)} — ${escapeTicketHtml(a.nama)}${locInfo ? ` (${escapeTicketHtml(locInfo)})` : ''}</option>`;
    });
    if (normPre && !matchedPreselect && preselectMeta?.nama) {
      matchedPreselect = true;
      const locInfo = [preselectMeta.lokasi, preselectMeta.gedung].filter(Boolean).join(' • ');
      html += `<option value="aset::::${escapeTicketHtml(preselectCode)}" selected
        data-type="aset"
        data-id=""
        data-kode="${escapeTicketHtml(preselectCode)}"
        data-nama="${escapeTicketHtml(preselectMeta.nama)}"
        data-lokasi="${escapeTicketHtml(preselectMeta.lokasi || '')}"
        data-gedung="${escapeTicketHtml(preselectMeta.gedung || '')}"
        data-kategori="Elektronik">${escapeTicketHtml(preselectCode)} — ${escapeTicketHtml(preselectMeta.nama)}${locInfo ? ` (${escapeTicketHtml(locInfo)})` : ''}</option>`;
    }
    html += '</optgroup>';
  }

  if (ticketLocationOptions.length > 0) {
    html += '<optgroup label="Fasilitas Ruangan / Gedung">';
    ticketLocationOptions.forEach(loc => {
      const code = loc.kode || `RUANG-${loc.id}`;
      const val = `ruangan::${loc.id}::${code}`;
      const selected = normPre && !matchedPreselect && code.toLowerCase() === normPre ? 'selected' : '';
      html += `<option value="${escapeTicketHtml(val)}" ${selected}
        data-type="ruangan"
        data-id=""
        data-kode="${escapeTicketHtml(code)}"
        data-nama="${escapeTicketHtml(loc.nama)}"
        data-lokasi="${escapeTicketHtml(loc.nama)}"
        data-gedung="${escapeTicketHtml(loc.gedung_kode || '')}"
        data-kategori="Fasilitas Gedung">${escapeTicketHtml(code)} — ${escapeTicketHtml(loc.nama)}${loc.gedung_kode ? ` (${escapeTicketHtml(loc.gedung_kode)})` : ''}</option>`;
    });
    html += '</optgroup>';
  }

  html += '<optgroup label="Lainnya"><option value="lainnya::::" data-type="lainnya" data-id="" data-kode="" data-nama="" data-lokasi="" data-gedung="" data-kategori="Fasilitas Gedung">Lainnya (Fasilitas Umum Belum Terdaftar)</option></optgroup>';
  return html;
}

function setSelectOptionSafely(selectEl, value) {
  if (!selectEl || !value) return;
  const v = String(value).trim();
  const exact = Array.from(selectEl.options).find(o => o.value.toLowerCase() === v.toLowerCase() || o.textContent.toLowerCase().includes(v.toLowerCase()));
  if (exact) {
    selectEl.value = exact.value;
  } else {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = v;
    selectEl.appendChild(opt);
    selectEl.value = v;
  }
}

window.onAdminTicketTargetChange = function(sel) {
  if (!sel) return;
  const opt = sel.options[sel.selectedIndex];
  if (!opt || !opt.value) return;
  const lokasi = opt.dataset.lokasi || '';
  const gedung = opt.dataset.gedung || '';
  const kat = opt.dataset.kategori || '';
  const nama = opt.dataset.nama || '';

  const locInput = document.getElementById('tiket-location');
  const gedungSel = document.getElementById('tiket-gedung');
  const catSel = document.getElementById('tiket-category');
  if (locInput && lokasi) locInput.value = lokasi;
  if (gedungSel && gedung) setSelectOptionSafely(gedungSel, gedung);
  if (catSel && (kat || nama)) {
    const mapped = mapAssetCatToTicketCategory(kat || nama);
    setSelectOptionSafely(catSel, mapped);
  }
};

function openModalBuatTiket(preselectCode = '', preselectMeta = null) {
  if (!requirePermission('maintenance:manage', 'Membuat Tiket Perbaikan')) return;
  const modal = document.getElementById('modal-buat-tiket');
  if (modal) {
    const targetSel = document.getElementById('tiket-target-select');
    if (targetSel) {
      targetSel.innerHTML = buildTicketTargetOptionsHtml(preselectCode, preselectMeta);
      if (preselectCode) {
        onAdminTicketTargetChange(targetSel);
      }
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  }
}

function closeModalBuatTiket() {
  const modal = document.getElementById('modal-buat-tiket');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

async function handleCreateTicketSubmit(e) {
  e.preventDefault();
  if (!requirePermission('maintenance:manage', 'Membuat Tiket Perbaikan')) return;

  const currUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const targetSel = document.getElementById('tiket-target-select');
  const opt = targetSel && targetSel.selectedIndex >= 0 ? targetSel.options[targetSel.selectedIndex] : null;
  const assetId = opt?.dataset?.id ? parseInt(opt.dataset.id) : null;
  const assetKode = opt?.dataset?.kode || '';
  const assetNama = opt?.dataset?.nama || '';
  const targetType = opt?.dataset?.type || 'lainnya';

  const rawTitle = document.getElementById('tiket-title').value.trim();
  const finalTitle = (assetNama && !rawTitle.toLowerCase().includes(assetNama.toLowerCase().slice(0, 10)))
    ? `${assetNama} — ${rawTitle}`
    : rawTitle;

  const data = {
    asset_id: assetId,
    asset_kode: assetKode,
    asset_nama: assetNama,
    target_type: targetType,
    title: finalTitle,
    location: document.getElementById('tiket-location').value,
    gedung: document.getElementById('tiket-gedung').value,
    priority: document.getElementById('tiket-priority').value,
    category: document.getElementById('tiket-category').value,
    reporter: currUser ? (currUser.nama || currUser.username) : 'Petugas Sarpras',
    tech_name: document.getElementById('tiket-tech').value,
    cost: document.getElementById('tiket-cost').value,
    desc: document.getElementById('tiket-desc').value
  };

  const res = await API.createTicket(data);
  if (res && res.success) {
    showToast(res.message || 'Tiket perbaikan berhasil dibuat!');
    closeModalBuatTiket();
    e.target.reset();
    await loadTicketsFromBackend();
  } else {
    showToast(res.message || 'Gagal membuat tiket.', 'error');
  }
}

async function handleUpdateTicketStatus(id, newStatus) {
  if (!requirePermission('maintenance:manage', 'Mengubah Status Tiket')) return;

  const res = await API.updateTicket(id, { status: newStatus });
  if (res && res.success) {
    showToast(`Status tiket berhasil diubah ke: ${newStatus.toUpperCase()}`);
    await loadTicketsFromBackend();
  } else {
    showToast('Gagal mengubah status tiket.', 'error');
  }
}

let backendRawTickets = [];

async function loadTicketsFromBackend() {
  if (typeof API !== 'undefined') {
    try {
      const res = await API.getTickets();
      if (res && res.success && Array.isArray(res.data)) {
        backendRawTickets = res.data;
        res.data.forEach(t => {
          const formatted = formatCardData(t);
          let targetColIdx = 0;
          if (t.status === 'ditugaskan' || t.status === 'assigned') targetColIdx = 1;
          else if (t.status === 'proses' || t.status === 'pengerjaan') targetColIdx = 2;
          else if (t.status === 'sparepart' || t.status === 'selesai') targetColIdx = 3;

          const exists = kanbanData.some(col => col.cards.some(c => c.id === formatted.id));
          if (!exists) {
            kanbanData[targetColIdx].cards.unshift(formatted);
          }
        });

        kanbanData.forEach(col => {
          col.badgeCount = col.cards.length;
        });

        renderStatCards();
        renderKanbanBoard();
        renderTableView();
        renderPdfTiketView();
      }
    } catch (err) {
      console.log('Backend sync offline/fallback mode:', err.message);
    }
  }
}

function formatCardData(t) {
  const priorityClass = t.priority === 'URGENT' 
    ? 'bg-rose-50 text-rose-700 border border-rose-200' 
    : t.priority === 'TINGGI' 
    ? 'bg-amber-50 text-amber-800 border border-amber-200' 
    : 'bg-blue-50 text-blue-700 border border-blue-200';

  const statusNorm = (t.status || '').toLowerCase();
  let actionLabel = 'Tugaskan';
  let actionClass = 'bg-[#e0eefc] text-[#0f2a71] hover:bg-[#d0e5fb]';
  if (statusNorm === 'ditugaskan' || statusNorm === 'assigned') {
    actionLabel = 'Mulai Kerja';
  } else if (statusNorm === 'proses' || statusNorm === 'pengerjaan') {
    actionLabel = 'Update Log';
    actionClass = 'bg-[#0f2a71] text-white hover:bg-[#0a1e54]';
  } else if (statusNorm === 'selesai' || statusNorm === 'sparepart') {
    actionLabel = 'Verifikasi';
    actionClass = 'bg-[#0e5c54] text-white hover:bg-[#094741]';
  }

  return {
    id: t.kode,
    dbId: t.id,
    categoryTag: t.category || 'Umum',
    tag: `KATEGORI: ${t.category || 'Umum'}`,
    priorityClass,
    schedule: 'Terjadwal',
    title: t.title,
    location: t.location,
    gedung: t.gedung,
    priority: t.priority || 'SEDANG',
    techName: t.tech_name || 'Joko Supriyanto',
    techRole: t.reporter ? `Pelapor: ${t.reporter}` : 'Teknisi Sarpras',
    techAvatar: (t.tech_name || 'JS').slice(0, 2).toUpperCase(),
    techAvatarBg: 'bg-blue-900 text-white',
    reporter: t.reporter || 'Staf',
    actionLabel,
    actionClass
  };
}

function buildSyncedPdfKanbanColumns() {
  const cols = [
    { key: 'antrean', baseTitle: 'Antrean Tiket', headerClass: 'bg-slate-200 text-slate-800 border border-slate-300/70', cards: [] },
    { key: 'proses', baseTitle: 'Sedang Dikerjakan', headerClass: 'bg-blue-100 text-blue-800 border border-blue-200/80', cards: [] },
    { key: 'qc', baseTitle: 'Pengujian Kualitas', headerClass: 'bg-amber-100 text-amber-900 border border-amber-200/80', cards: [] },
    { key: 'selesai', baseTitle: 'Selesai Diperbaiki', headerClass: 'bg-emerald-100 text-emerald-900 border border-emerald-200/80', cards: [] }
  ];

  const seenIds = new Set();

  // 1. Live tickets from SQLite backend
  (backendRawTickets || []).forEach(t => {
    const id = t.kode || `TKT-${t.id}`;
    if (seenIds.has(id)) return;
    seenIds.add(id);

    const st = String(t.status || 'baru').toLowerCase();
    let colIdx = 0;
    if (st === 'selesai' || st === 'closed' || st === 'done') colIdx = 3;
    else if (st === 'qc' || st === 'uji' || st === 'sparepart') colIdx = 2;
    else if (st === 'proses' || st === 'pengerjaan' || st === 'ditugaskan' || st === 'assigned') colIdx = 1;

    const prio = String(t.priority || 'SEDANG').toUpperCase();
    const prioClass = (prio === 'URGENT' || prio === 'TINGGI')
      ? 'bg-red-50 text-red-600'
      : (colIdx === 3 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700');

    const costNum = Number(t.cost || 0);
    const costLabel = costNum > 0 ? `Biaya: Rp ${costNum.toLocaleString('id-ID')}` : (colIdx === 3 ? 'Selesai & Terverifikasi' : 'Menunggu Estimasi / Proses');

    const reporterLabel = t.reporter || 'Staf Sarpras';
    const assetBadge = t.asset_nama
      ? `${t.asset_kode ? t.asset_kode + ' • ' : ''}${t.asset_nama}`
      : '';
    cols[colIdx].cards.push({
      id,
      dbId: t.id,
      assetId: t.asset_id || null,
      assetKode: t.asset_kode || '',
      assetNama: t.asset_nama || '',
      assetBadge,
      rawStatus: st,
      colKey: cols[colIdx].key,
      priority: colIdx === 3 ? 'SELESAI' : prio,
      priorityClass: prioClass,
      title: t.title || 'Perbaikan Sarana',
      location: t.location || '-',
      gedung: t.gedung || '-',
      techName: t.tech_name || 'Menunggu Penugasan',
      reporter: reporterLabel,
      desc: t.desc || t.title || '-',
      cost: costNum,
      meta: `${t.location || t.gedung || 'Kampus'} • Pelapor: ${reporterLabel} • Teknisi: ${t.tech_name || 'Menunggu Penugasan'}`,
      footer: t.desc ? String(t.desc).slice(0, 68) : costLabel,
      footerColor: colIdx === 3 ? 'text-emerald-600' : (colIdx === 1 ? 'text-[#1D4ED8]' : 'text-slate-600')
    });
  });

  // 2. Fallback defaults if backend returned no tickets
  if (seenIds.size === 0) {
    pdfKanbanColumnsDefault.forEach((defCol, idx) => {
      defCol.cards.forEach(c => {
        cols[idx].cards.push({
          ...c,
          dbId: null,
          colKey: cols[idx].key,
          rawStatus: idx === 0 ? 'baru' : (idx === 1 ? 'proses' : (idx === 2 ? 'qc' : 'selesai')),
          location: c.meta.split('•')[0]?.trim() || 'Kampus',
          techName: 'Joko Supriyanto',
          desc: c.footer,
          cost: 0
        });
      });
    });
  }

  cols.forEach(col => {
    col.title = `${col.baseTitle} (${col.cards.length})`;
  });
  return cols;
}

function exportTicketsCSV() {
  const cols = buildSyncedPdfKanbanColumns();
  const allCards = cols.flatMap(col =>
    col.cards.map(card => ({
      ...card,
      colTitle: col.baseTitle
    }))
  );
  const headers = ['ID TIKET', 'JUDUL PERBAIKAN', 'LOKASI', 'PRIORITAS', 'TEKNISI PIC', 'ESTIMASI BIAYA (RP)', 'TAHAPAN STATUS'];
  const rows = allCards.map(c => [
    `"${String(c.id || '').replace(/"/g, '""')}"`,
    `"${String(c.title || '').replace(/"/g, '""')}"`,
    `"${String(c.location || c.meta || '').replace(/"/g, '""')}"`,
    `"${String(c.priority || '').replace(/"/g, '""')}"`,
    `"${String(c.techName || '').replace(/"/g, '""')}"`,
    `"${Number(c.cost || 0)}"`,
    `"${String(c.colTitle || '').replace(/"/g, '""')}"`
  ]);

  const BOM = '\uFEFF';
  const delimiter = ';';
  const csvContent = BOM + [headers.join(delimiter), ...rows.map(r => r.join(delimiter))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SIMAS_Rekap_Tiket_Pemeliharaan_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('Rekap Tiket Pemeliharaan berhasil diekspor ke CSV!');
}
window.exportTicketsCSV = exportTicketsCSV;

const pdfKanbanColumnsDefault = [
  {
    key: 'antrean',
    title: 'Antrean Tiket (3)',
    headerClass: 'bg-slate-200 text-slate-800 border border-slate-300/70',
    cards: [
      {
        id: 'TKT-021',
        priority: 'PRIORITAS TINGGI',
        priorityClass: 'bg-red-50 text-red-600',
        title: 'Lampu Proyektor Epson EB-X500 Redup & Berkedip',
        meta: 'Ruang Seminar 302 • Pelapor: Budi S.',
        footer: 'Menunggu Penugasan Teknisi',
        footerColor: 'text-slate-600'
      }
    ]
  },
  {
    key: 'proses',
    title: 'Sedang Dikerjakan (1)',
    headerClass: 'bg-blue-100 text-blue-800 border border-blue-200/80',
    cards: [
      {
        id: 'TKT-012',
        priority: 'URGENT',
        priorityClass: 'bg-red-50 text-red-600',
        title: 'AC Daikin 2 PK Bocor Air & Kurang Dingin',
        meta: 'Lab Jaringan Lt. 2 • Teknisi: Joko S.',
        footer: 'Sedang Cuci Evaporator & Isi Freon',
        footerColor: 'text-[#1D4ED8]'
      }
    ]
  },
  {
    key: 'qc',
    title: 'Pengujian Kualitas (1)',
    headerClass: 'bg-amber-100 text-amber-900 border border-amber-200/80',
    cards: [
      {
        id: 'TKT-009',
        priority: 'QC PASS',
        priorityClass: 'bg-emerald-50 text-emerald-700',
        title: 'Kalibrasi Lensa Mikroskop Olympus CX23',
        meta: 'Lab Biologi Dasar • Teknisi: Joko S.',
        footer: 'Menunggu Tanda Tangan Kepala Lab',
        footerColor: 'text-slate-600'
      }
    ]
  },
  {
    key: 'selesai',
    title: 'Selesai Diperbaiki (1)',
    headerClass: 'bg-emerald-100 text-emerald-900 border border-emerald-200/80',
    cards: [
      {
        id: 'TKT-005',
        priority: 'SELESAI',
        priorityClass: 'bg-emerald-50 text-emerald-700',
        title: 'Penggantian Baterai UPS Server Akademik',
        meta: 'Ruang Server TI • Biaya: Rp 1.200.000',
        footer: 'Kondisi Aset Kembali Normal',
        footerColor: 'text-emerald-600'
      }
    ]
  }
];

function escapeTicketHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

window.handlePdfTicketClick = function(ticketId) {
  const cols = buildSyncedPdfKanbanColumns();
  let ticket = null;
  cols.forEach(col => {
    const found = col.cards.find(c => c.id === ticketId);
    if (found) ticket = { ...found, colTitle: col.baseTitle };
  });
  if (!ticket) return;

  const existing = document.getElementById('modal-pdf-ticket-detail');
  if (existing) existing.remove();

  const canManage = typeof hasPermission === 'function' ? hasPermission('maintenance:manage') : true;

  const modal = document.createElement('div');
  modal.id = 'modal-pdf-ticket-detail';
  modal.className = 'fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-[#eef4ff]">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8]">${escapeTicketHtml(ticket.id)} • ${escapeTicketHtml(ticket.colTitle)}</span>
          <h3 class="text-sm font-extrabold text-slate-900 mt-0.5">${escapeTicketHtml(ticket.title)}</h3>
        </div>
        <button type="button" onclick="document.getElementById('modal-pdf-ticket-detail')?.remove()" class="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <form onsubmit="submitPdfTicketUpdate(event, '${escapeTicketHtml(ticket.id)}', ${ticket.dbId ? Number(ticket.dbId) : 'null'})" class="p-5 space-y-3.5 text-xs">
        ${ticket.assetBadge ? `
          <div class="px-3 py-2 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-between gap-2">
            <div>
              <div class="text-[10px] font-bold text-[#1D4ED8] uppercase">Aset / Fasilitas Terhubung</div>
              <div class="font-extrabold text-slate-900 mt-0.5">${escapeTicketHtml(ticket.assetBadge)}</div>
            </div>
            <span class="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-[#1D4ED8] border border-blue-200">Tercatat di Riwayat Aset</span>
          </div>
        ` : ''}
        <div class="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <div class="text-[10px] font-bold text-slate-500 uppercase">Lokasi / Ruang</div>
            <div class="font-bold text-slate-900 mt-0.5">${escapeTicketHtml(ticket.location)}</div>
          </div>
          <div>
            <div class="text-[10px] font-bold text-slate-500 uppercase">Pelapor</div>
            <div class="font-bold text-slate-900 mt-0.5">${escapeTicketHtml(ticket.reporter || 'Staf Sarpras')}</div>
          </div>
          <div>
            <div class="text-[10px] font-bold text-slate-500 uppercase">Prioritas</div>
            <span class="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${ticket.priorityClass}">${escapeTicketHtml(ticket.priority)}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Tahapan Status Kanban</label>
            <select id="pdf-tkt-status" ${canManage ? '' : 'disabled'} class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600">
              <option value="baru" ${ticket.colKey === 'antrean' ? 'selected' : ''}>Antrean Tiket</option>
              <option value="proses" ${ticket.colKey === 'proses' ? 'selected' : ''}>Sedang Dikerjakan</option>
              <option value="qc" ${ticket.colKey === 'qc' ? 'selected' : ''}>Pengujian Kualitas (QC)</option>
              <option value="selesai" ${ticket.colKey === 'selesai' ? 'selected' : ''}>Selesai Diperbaiki</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Estimasi / Realisasi Biaya (Rp)</label>
            <input type="number" min="0" step="10000" id="pdf-tkt-cost" value="${Number(ticket.cost || 0)}" ${canManage ? '' : 'disabled'} class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1">Teknisi Penanggung Jawab</label>
          <input type="text" id="pdf-tkt-tech" value="${escapeTicketHtml(ticket.techName)}" ${canManage ? '' : 'disabled'} class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-600" />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1">Catatan Tindakan / Progres Perbaikan</label>
          <textarea id="pdf-tkt-desc" rows="3" ${canManage ? '' : 'disabled'} class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-600">${escapeTicketHtml(ticket.desc)}</textarea>
        </div>

        <div class="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          <button type="button" onclick="document.getElementById('modal-pdf-ticket-detail')?.remove()" class="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold cursor-pointer">Tutup</button>
          ${canManage ? `
            <button type="submit" class="px-4 py-2 rounded-xl bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold shadow-sm cursor-pointer">Simpan Pembaruan Tiket ✓</button>
          ` : `
            <span class="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold">Mode Monitoring (Read-Only)</span>
          `}
        </div>
      </form>
    </div>
  `;
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
  if (window.lucide) lucide.createIcons();
};

window.submitPdfTicketUpdate = async function(e, ticketKode, dbId) {
  e.preventDefault();
  if (typeof requirePermission === 'function') {
    if (!requirePermission('maintenance:manage', 'Memperbarui Status Tiket')) return;
  }
  const status = document.getElementById('pdf-tkt-status')?.value || 'proses';
  const cost = parseInt(document.getElementById('pdf-tkt-cost')?.value || '0', 10) || 0;
  const tech_name = document.getElementById('pdf-tkt-tech')?.value?.trim() || 'Teknisi Sarpras';
  const desc = document.getElementById('pdf-tkt-desc')?.value?.trim() || '';

  if (typeof API !== 'undefined' && dbId) {
    const res = await API.updateTicket(dbId, { status, cost, tech_name, desc });
    if (res && res.success) {
      document.getElementById('modal-pdf-ticket-detail')?.remove();
      showToast(`Tiket #${ticketKode} berhasil diperbarui ke tahapan "${status.toUpperCase()}"!`);
      await loadTicketsFromBackend();
      return;
    }
  }
  document.getElementById('modal-pdf-ticket-detail')?.remove();
  showToast(`Perubahan tiket #${ticketKode} tersimpan.`);
  renderPdfTiketView();
};

window.onLaporTargetChange = function(sel) {
  if (!sel) return;
  const opt = sel.options[sel.selectedIndex];
  const customWrap = document.getElementById('lapor-custom-target-wrap');
  const customInput = document.getElementById('lapor-custom-target');
  const isLainnya = opt && opt.dataset.type === 'lainnya';
  if (customWrap) customWrap.classList.toggle('hidden', !isLainnya);
  if (customInput) customInput.required = !!isLainnya;

  if (!opt || !opt.value || isLainnya) return;
  const lokasi = opt.dataset.lokasi || '';
  const gedung = opt.dataset.gedung || '';
  const kat = opt.dataset.kategori || '';
  const nama = opt.dataset.nama || '';

  const locEl = document.getElementById('lapor-location');
  const gedungEl = document.getElementById('lapor-gedung');
  const catEl = document.getElementById('lapor-category');
  if (locEl && lokasi) locEl.value = lokasi;
  if (gedungEl && gedung) setSelectOptionSafely(gedungEl, gedung);
  if (catEl && (kat || nama)) {
    const mapped = mapAssetCatToTicketCategory(kat || nama);
    setSelectOptionSafely(catEl, mapped);
  }
};

window.openModalLaporPeminjam = function(preselectCode = '', preselectMeta = null) {
  const existing = document.getElementById('modal-peminjam-lapor-kerusakan');
  if (existing) existing.remove();

  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : { nama: 'Peminjam' };
  const targetOptionsHtml = buildTicketTargetOptionsHtml(preselectCode, preselectMeta);

  const modal = document.createElement('div');
  modal.id = 'modal-peminjam-lapor-kerusakan';
  modal.className = 'fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4';
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
      <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#eef4ff] shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <i data-lucide="alert-triangle" class="w-4 h-4"></i>
          </div>
          <div>
            <h3 class="text-sm font-extrabold text-slate-900">Laporkan Kerusakan Sarana / Fasilitas</h3>
            <p class="text-[11px] text-slate-500">Pelapor: ${escapeTicketHtml(user.nama || user.username || 'Peminjam')} • Otomatis masuk riwayat barang</p>
          </div>
        </div>
        <button type="button" onclick="document.getElementById('modal-peminjam-lapor-kerusakan')?.remove()" class="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <form onsubmit="submitPeminjamDamageReport(event)" class="p-5 space-y-3.5 text-xs overflow-y-auto">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Pilih Barang / Fasilitas yang Bermasalah *</label>
          <select id="lapor-target-select" required onchange="onLaporTargetChange(this)" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold focus:outline-none focus:border-blue-600">
            ${targetOptionsHtml}
          </select>
          <p class="text-[10px] text-slate-500 mt-1">Pilih barang atau ruangan dari daftar agar lokasi otomatis terisi &amp; tercatat pada riwayat kerusakan aset tersebut.</p>
        </div>
        <div id="lapor-custom-target-wrap" class="hidden">
          <label class="block font-bold text-slate-700 mb-1">Sebutkan Nama Fasilitas Lainnya *</label>
          <input type="text" id="lapor-custom-target" placeholder="Contoh: Lampu Koridor Lantai 2 / Keran Toilet Gedung B" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-600" />
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Ringkasan Masalah / Jenis Kerusakan *</label>
          <input type="text" id="lapor-title" required placeholder="Contoh: AC bocor menetes air / Layar proyektor buram / Tidak menyala" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-600" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Lokasi / Ruangan *</label>
            <input type="text" id="lapor-location" required placeholder="Otomatis terisi saat pilih barang" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-600" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Gedung *</label>
            <select id="lapor-gedung" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-600">
              <option value="Gedung TI">Gedung TI</option>
              <option value="Gedung Utama">Gedung Utama (Aula &amp; Seminar)</option>
              <option value="Gedung Rektorat (Pusat)">Gedung Rektorat (Pusat)</option>
              <option value="Gedung MIPA">Gedung MIPA &amp; Lab</option>
              <option value="Gedung Perpustakaan">Gedung Perpustakaan</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Kategori Kerusakan</label>
            <select id="lapor-category" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-600">
              <option value="Multimedia">Multimedia &amp; Proyektor</option>
              <option value="Utilitas AC">AC &amp; Pendingin Ruangan</option>
              <option value="Kelistrikan">Kelistrikan / Stopkontak / Lampu</option>
              <option value="Perangkat IT">Laptop / Komputer / Jaringan</option>
              <option value="Fasilitas Gedung">Pintu / Kursi / Meja / Gedung</option>
              <option value="Laboratorium">Peralatan Laboratorium</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Tingkat Urgensi</label>
            <select id="lapor-priority" class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none focus:border-blue-600">
              <option value="SEDANG">SEDANG (Mengganggu sebagian)</option>
              <option value="TINGGI">TINGGI (Menghambat perkuliahan)</option>
              <option value="URGENT">URGENT (Darurat / Membahayakan)</option>
              <option value="RENDAH">RENDAH (Kerusakan ringan)</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block font-bold text-slate-700 mb-1">Kronologi / Detail Kerusakan *</label>
          <textarea id="lapor-desc" rows="3" required placeholder="Ceritakan kronologi kerusakannya (contoh: AC dinyalakan 15 menit lalu langsung menetes air deras dan berbunyi keras)..." class="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-600"></textarea>
        </div>
        <div class="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          <button type="button" onclick="document.getElementById('modal-peminjam-lapor-kerusakan')?.remove()" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer transition">
            Batal
          </button>
          <button type="submit" id="btn-submit-lapor-peminjam" class="px-4 py-2 rounded-xl bg-[#1246b5] hover:bg-blue-800 text-white font-bold shadow-sm cursor-pointer transition">
            Kirim Laporan ke Petugas
          </button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  if (preselectCode) {
    const sel = document.getElementById('lapor-target-select');
    if (sel) onLaporTargetChange(sel);
  }
  if (window.lucide) lucide.createIcons();
};

window.submitPeminjamDamageReport = async function(e) {
  e.preventDefault();
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : { nama: 'Peminjam', username: 'peminjam' };
  const btn = document.getElementById('btn-submit-lapor-peminjam');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Mengirim...';
  }

  const targetSel = document.getElementById('lapor-target-select');
  const opt = targetSel && targetSel.selectedIndex >= 0 ? targetSel.options[targetSel.selectedIndex] : null;
  const targetType = opt?.dataset?.type || 'lainnya';
  const assetId = opt?.dataset?.id ? parseInt(opt.dataset.id) : null;
  const assetKode = opt?.dataset?.kode || '';
  const customNama = document.getElementById('lapor-custom-target')?.value?.trim() || '';
  const assetNama = targetType === 'lainnya' ? customNama : (opt?.dataset?.nama || '');

  const rawTitle = document.getElementById('lapor-title')?.value?.trim() || '';
  const finalTitle = (assetNama && !rawTitle.toLowerCase().includes(assetNama.toLowerCase().slice(0, 10)))
    ? `${assetNama} — ${rawTitle}`
    : (rawTitle || `Kerusakan ${assetNama}`);

  const payload = {
    asset_id: assetId,
    asset_kode: assetKode,
    asset_nama: assetNama,
    target_type: targetType,
    title: finalTitle,
    location: document.getElementById('lapor-location')?.value?.trim() || '',
    gedung: document.getElementById('lapor-gedung')?.value || 'Gedung TI',
    category: document.getElementById('lapor-category')?.value || 'Umum',
    priority: document.getElementById('lapor-priority')?.value || 'SEDANG',
    desc: document.getElementById('lapor-desc')?.value?.trim() || '',
    reporter: user.nama || user.username || 'Peminjam',
    tech_name: 'Menunggu Penugasan',
    cost: 0
  };

  try {
    const res = await API.createTicket(payload);
    if (res && res.success) {
      document.getElementById('modal-peminjam-lapor-kerusakan')?.remove();
      showToast(res.message || 'Laporan kerusakan berhasil dikirim ke Petugas Sarpras!');
      await loadTicketsFromBackend();
    } else {
      showToast(res?.message || 'Gagal mengirim laporan kerusakan.');
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Kirim Laporan ke Petugas';
      }
    }
  } catch (err) {
    showToast('Terjadi kesalahan koneksi saat mengirim laporan.');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Kirim Laporan ke Petugas';
    }
  }
};

function renderPeminjamDamageReportView(root, user) {
  const myName = String(user?.nama || '').toLowerCase();
  const myShort = myName.split(',')[0].trim();
  const myUsername = String(user?.username || '').toLowerCase();

  const myTickets = (backendRawTickets || []).filter(t => {
    const rep = String(t.reporter || '').toLowerCase();
    return (myName && rep === myName) || (myShort && rep.includes(myShort)) || (myUsername && rep.includes(myUsername));
  });

  const statusMeta = (rawStatus) => {
    const st = String(rawStatus || 'baru').toLowerCase();
    if (st === 'selesai' || st === 'closed' || st === 'done') {
      return { label: 'Selesai Diperbaiki', cls: 'bg-emerald-100 text-emerald-900 border border-emerald-200/80' };
    }
    if (st === 'qc' || st === 'uji' || st === 'sparepart') {
      return { label: 'Pengujian Kualitas (QC)', cls: 'bg-amber-100 text-amber-900 border border-amber-200/80' };
    }
    if (st === 'proses' || st === 'pengerjaan' || st === 'ditugaskan' || st === 'assigned') {
      return { label: 'Sedang Dikerjakan Teknisi', cls: 'bg-blue-100 text-blue-800 border border-blue-200/80' };
    }
    return { label: 'Antrean Petugas', cls: 'bg-slate-200 text-slate-800 border border-slate-300/70' };
  };

  const totalCount = myTickets.length;
  const doneCount = myTickets.filter(t => ['selesai', 'closed', 'done'].includes(String(t.status || '').toLowerCase())).length;
  const activeCount = totalCount - doneCount;

  root.innerHTML = `
    <div class="space-y-5">
      <!-- Banner Info & CTA -->
      <div class="bg-[#eef4ff] border border-blue-200/90 rounded-2xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <div class="max-w-2xl">
          <h2 class="text-base font-extrabold text-[#0f2a71]">Layanan Pelaporan Kerusakan Fasilitas &amp; Sarana Kampus</h2>
          <p class="text-xs text-[#1d4ed8] font-medium mt-1 leading-relaxed">
            Pilih barang atau ruangan dari daftar, lalu ceritakan kronologi kerusakannya — laporan langsung masuk ke <strong>Antrean Papan Kanban Petugas</strong> dan otomatis tersimpan ke <strong>Riwayat Kerusakan Aset</strong>.
          </p>
        </div>
        <button type="button" onclick="openModalLaporPeminjam()" class="px-5 py-2.5 rounded-xl bg-[#1246b5] hover:bg-blue-800 text-white text-xs font-extrabold shadow-sm transition cursor-pointer inline-flex items-center gap-2">
          <i data-lucide="plus-circle" class="w-4 h-4"></i>
          <span>+ Laporkan Kerusakan Baru</span>
        </button>
      </div>

      <!-- 3 Mini KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
          <div class="text-xs text-slate-500 font-medium">Total Laporan Saya</div>
          <div class="text-2xl font-extrabold text-slate-900 mt-1">${totalCount} Laporan</div>
        </div>
        <div class="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
          <div class="text-xs text-slate-500 font-medium">Dalam Antrean / Penanganan</div>
          <div class="text-2xl font-extrabold text-[#1246b5] mt-1">${activeCount} Aktif</div>
        </div>
        <div class="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
          <div class="text-xs text-slate-500 font-medium">Selesai Diperbaiki</div>
          <div class="text-2xl font-extrabold text-emerald-700 mt-1">${doneCount} Selesai</div>
        </div>
      </div>

      <!-- Riwayat Laporan Saya -->
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 class="text-sm font-extrabold text-slate-900">Riwayat Laporan Kerusakan Saya</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Pantau progres perbaikan secara real-time saat Petugas Sarpras memproses laporan Anda.</p>
          </div>
          <span class="text-[11px] font-bold text-slate-500">Pelapor: ${escapeTicketHtml(user?.nama || user?.username || 'Peminjam')}</span>
        </div>

        ${myTickets.length === 0 ? `
          <div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center space-y-3">
            <div class="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <i data-lucide="wrench" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="text-sm font-bold text-slate-900">Belum Ada Laporan Kerusakan</div>
              <p class="text-xs text-slate-500 mt-1 max-w-md mx-auto">Jika Anda menemukan sarana perkuliahan atau fasilitas ruangan yang bermasalah, klik tombol di bawah untuk langsung melaporkannya ke Petugas Sarpras.</p>
            </div>
            <button type="button" onclick="openModalLaporPeminjam()" class="px-4 py-2 rounded-xl bg-[#1246b5] hover:bg-blue-800 text-white text-xs font-bold cursor-pointer transition">
              + Buat Laporan Kerusakan Pertama
            </button>
          </div>
        ` : `
          <div class="space-y-3">
            ${myTickets.map(t => {
              const sm = statusMeta(t.status);
              const prio = String(t.priority || 'SEDANG').toUpperCase();
              const prioCls = (prio === 'URGENT' || prio === 'TINGGI')
                ? 'bg-red-50 text-red-600'
                : 'bg-amber-50 text-amber-700';
              const targetChip = t.asset_nama
                ? `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-[#1D4ED8] border border-blue-200/70">${escapeTicketHtml(t.asset_kode ? t.asset_kode + ' • ' : '')}${escapeTicketHtml(t.asset_nama)}</span>`
                : '';
              return `
                <div class="rounded-xl border border-slate-200/90 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div class="space-y-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-xs font-extrabold text-[#1D4ED8] font-mono">${escapeTicketHtml(t.kode || ('TKT-' + t.id))}</span>
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${prioCls}">${escapeTicketHtml(prio)}</span>
                      <span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold ${sm.cls}">${sm.label}</span>
                      ${targetChip}
                    </div>
                    <div class="text-sm font-bold text-slate-900">${escapeTicketHtml(t.title)}</div>
                    <div class="text-[11px] text-slate-500">
                      ${escapeTicketHtml(t.location || '-')} (${escapeTicketHtml(t.gedung || '-')}) • Kategori: ${escapeTicketHtml(t.category || 'Umum')} • Teknisi: <strong class="text-slate-700">${escapeTicketHtml(t.tech_name || 'Menunggu Penugasan')}</strong>
                    </div>
                    ${t.desc ? `<p class="text-xs text-slate-600 pt-1">${escapeTicketHtml(t.desc)}</p>` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

function renderPdfTiketView() {
  const mainEl = document.querySelector('main');
  if (!mainEl) return;

  Array.from(mainEl.children).forEach(ch => {
    if (
      ch.id !== 'simas-pdf-tiket-root' &&
      !ch.id?.startsWith('modal-') &&
      ch.id !== 'completion-drawer' &&
      ch.id !== 'drawer-backdrop'
    ) {
      ch.classList.add('hidden');
    }
  });

  let root = document.getElementById('simas-pdf-tiket-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'simas-pdf-tiket-root';
    mainEl.prepend(root);
  }

  const currUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  if (currUser && currUser.role === 'peminjam') {
    renderPeminjamDamageReportView(root, currUser);
    return;
  }

  const canManage = typeof hasPermission === 'function' ? hasPermission('maintenance:manage') : true;
  const columns = buildSyncedPdfKanbanColumns();

  root.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
      <!-- Top Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 class="text-base font-bold text-slate-900">Papan Kerja Kanban Servis &amp; Pemeliharaan</h2>
          <p class="text-[11px] text-slate-500 mt-0.5">${canManage ? 'Menampung laporan kerusakan dari Peminjam (Dosen/Mahasiswa) maupun inspeksi Petugas. Klik kartu untuk kelola progres & biaya.' : 'Mode Monitoring Eksekutif: Klik kartu tiket untuk memeriksa progres & biaya perbaikan.'}</p>
        </div>
        <div class="flex items-center gap-2.5">
          <button type="button" onclick="exportTicketsCSV()" class="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer">
            Unduh Rekap Biaya (CSV)
          </button>
          ${canManage ? `
            <button type="button" onclick="openModalBuatTiket()" class="px-4 py-2 rounded-lg bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition cursor-pointer">
              + Buat Tiket Kerusakan
            </button>
          ` : ''}
        </div>
      </div>

      <!-- 4 Kanban Columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        ${columns.map(col => `
          <div class="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-3.5 flex flex-col">
            <div class="px-3.5 py-2.5 rounded-xl text-xs font-bold ${col.headerClass} mb-3">
              ${col.title}
            </div>
            <div class="space-y-3 flex-1">
              ${col.cards.length === 0 ? `
                <div class="rounded-xl border border-dashed border-slate-200 bg-white/60 p-4 text-center text-[11px] text-slate-400">
                  Belum ada tiket pada tahap ini
                </div>
              ` : col.cards.map(c => `
                <div onclick="handlePdfTicketClick('${escapeTicketHtml(c.id)}')" class="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:border-blue-400 transition cursor-pointer">
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="text-xs font-bold text-[#1D4ED8]">${escapeTicketHtml(c.id)}</span>
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${c.priorityClass}">${escapeTicketHtml(c.priority)}</span>
                  </div>
                  ${c.assetBadge ? `<div class="inline-block px-2 py-0.5 rounded bg-blue-50 text-[#1D4ED8] text-[10px] font-bold mb-1.5">${escapeTicketHtml(c.assetBadge)}</div>` : ''}
                  <h4 class="text-xs font-bold text-slate-900 leading-snug">${escapeTicketHtml(c.title)}</h4>
                  <p class="text-[11px] text-slate-400 mt-1.5">${escapeTicketHtml(c.meta)}</p>
                  <div class="text-[11px] font-semibold ${c.footerColor} mt-2.5">${escapeTicketHtml(c.footer)}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
  const btnTambah = document.getElementById('btn-tambah-aksi');
  if (btnTambah) {
    btnTambah.addEventListener('click', () => openModalBuatTiket());
  }
  renderPdfTiketView();
  Promise.all([loadTicketReferenceData(), loadTicketsFromBackend()]).then(() => {
    const currUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const params = new URLSearchParams(window.location.search);
    const preAsset = params.get('asset_kode') || '';
    const preMeta = {
      nama: params.get('asset_nama') || '',
      lokasi: params.get('asset_lokasi') || '',
      gedung: params.get('asset_gedung') || ''
    };
    if (params.get('lapor') === '1') {
      if (currUser && currUser.role === 'peminjam') {
        openModalLaporPeminjam(preAsset, preMeta);
      } else if (typeof hasPermission === 'function' && hasPermission('maintenance:manage')) {
        openModalBuatTiket(preAsset, preMeta);
      }
    }
  });
});

