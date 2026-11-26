/**
 * SIMAS - Sistem Sarana & Prasarana
 * Dashboard Data & Dynamic Rendering via JavaScript Arrays
 */

// ================= 1. DATA ARRAYS ================= //

// Data Menu Navigasi Sidebar
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-panel-left', active: true, href: 'index.html' },
  { id: 'aset', label: 'Manajemen Aset', icon: 'archive', active: false, href: 'aset.html' },
  { id: 'gedung', label: 'Gedung & Ruangan', icon: 'building-2', active: false, href: 'gedung.html' },
  { id: 'peminjaman', label: 'Peminjaman & Reservasi', icon: 'calendar-clock', active: false, href: 'peminjaman.html' },
  { id: 'antrean', label: 'Antrean Persetujuan', icon: 'check-square', active: false, badge: 4, href: 'antrean.html' },
  { id: 'pemeliharaan', label: 'Pemeliharaan & Tiket', icon: 'wrench', active: false, href: 'tiket.html' },
  { id: 'mutasi', label: 'Mutasi Aset', icon: 'arrow-left-right', active: false, href: 'mutasi.html' },
  { id: 'stock', label: 'Stock Opname', icon: 'scan-barcode', active: false, href: 'stock.html' },
  { id: 'laporan', label: 'Laporan & Rangkuman', icon: 'file-text', active: false, href: 'laporan.html' }
];

// Data 5 Kartu Statistik Utama
const statCardsData = [
  {
    title: 'Total Aset Terdaftar',
    value: '2.845',
    unit: 'Unit',
    subtext: 'Rp 14,82 Miliar <span class="text-slate-300 font-normal">total perolehan</span>',
    icon: 'archive',
    iconBoxClass: 'bg-blue-50 text-blue-600',
    hasProgress: false,
    footerLeft: 'Aktif memantau',
    footerRight: '<span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold text-[10px]">+16 bln ini</span>'
  },
  {
    title: 'Aset Tersedia (Ready)',
    value: '2.150',
    badge: '75,5%',
    badgeClass: 'text-teal-600 bg-teal-50',
    subtext: 'Gedung & Ruang Bebas',
    icon: 'check-circle',
    iconBoxClass: 'bg-teal-50 text-teal-600',
    hasProgress: true,
    progressWidth: '75.5%',
    progressBarClass: 'bg-teal-500',
    footerLeft: 'Aktif',
    footerRight: 'Reservasi'
  },
  {
    title: 'Sedang Dipinjam',
    value: '412',
    badge: '14,5%',
    badgeClass: 'text-blue-600 bg-blue-50',
    subtext: '26 Terjadwal kembali hari ini',
    icon: 'handshake',
    iconBoxClass: 'bg-blue-50 text-blue-600',
    hasProgress: true,
    progressWidth: '14.5%',
    progressBarClass: 'bg-blue-600',
    footerLeft: '26 Terjadwal kembali hari ini',
    footerRight: 'Aktif'
  },
  {
    title: 'Dalam Perawatan',
    value: '188',
    badge: '6,6%',
    badgeClass: 'text-blue-600 bg-blue-50',
    subtext: '14 Vendor eksternal',
    icon: 'wrench',
    iconBoxClass: 'bg-blue-50 text-blue-600',
    hasProgress: true,
    progressWidth: '6.6%',
    progressBarClass: 'bg-blue-600',
    footerLeft: '14 Vendor eksternal',
    footerRight: '<span class="text-[11px] font-bold text-amber-600">5 Prioritas</span>'
  },
  {
    title: 'Rusak / Afkir',
    value: '95',
    badge: '3,4%',
    badgeClass: 'text-rose-600 bg-rose-50',
    subtext: 'Proses Berita Acara (BA)',
    icon: 'alert-triangle',
    iconBoxClass: 'bg-rose-50 text-rose-500',
    hasProgress: true,
    progressWidth: '3.4%',
    progressBarClass: 'bg-rose-500',
    footerLeft: 'Proses Berita Acara (BA)',
    footerRight: '<span class="text-[11px] font-bold text-rose-600">22 Unit BA</span>'
  }
];

// Data Metrik Bawah Grafik Tren Peminjaman
const trendMetricsData = [
  { label: 'Total Pinjam Terproses', value: '1.482 Kali', isHighlighted: false },
  { label: 'Rata-rata Durasi', value: '3,4 Hari', isHighlighted: false },
  { label: 'Pengembalian Tepat Waktu', value: '96.8%', isHighlighted: true }
];

// Data Kondisi Fisik Inventaris (Donut Chart Legend)
const inventoryConditionsData = [
  { label: 'Baik (Prima)', count: '2.333', percentage: '82%', dotColor: 'bg-blue-700' },
  { label: 'Cukup (Terawat)', count: '398', percentage: '14%', dotColor: 'bg-teal-600' },
  { label: 'Rusak Ringan', count: '85', percentage: '3%', dotColor: 'bg-amber-500' },
  { label: 'Rusak Berat', count: '29', percentage: '1%', dotColor: 'bg-rose-500' }
];

// Data Okupansi Ruangan & Gedung
const occupancyData = [
  {
    name: 'Gedung Rektorat',
    percentage: 92,
    percentageClass: 'text-blue-700',
    barClass: 'bg-blue-800',
    subLeft: '23 / 25 Ruangan Aktif',
    subRight: 'Kapasitas Penuh'
  },
  {
    name: 'Laboratorium Terpadu',
    percentage: 85,
    percentageClass: 'text-teal-600',
    barClass: 'bg-teal-600',
    subLeft: '17 / 20 Lab Komputer & Riset',
    subRight: 'Praktikum Terjadwal'
  },
  {
    name: 'Gedung Kuliah Bersama',
    percentage: 78,
    percentageClass: 'text-slate-700',
    barClass: 'bg-slate-800',
    subLeft: '39 / 50 Hall & Kelas',
    subRight: 'Tersedia 11 Ruang'
  }
];

// Data Antrean Persetujuan
const approvalQueueData = [
  {
    id: 1,
    title: 'Proyektor 4K & Ruang 101',
    tag: 'Seminar',
    requester: 'Budi Santoso (Fak. Teknik)',
    date: '30 Mar 2025'
  },
  {
    id: 2,
    title: 'Microphone Wireless (4 Set)',
    tag: 'Acara Kampus',
    requester: 'Siti Rahmawati (BEM)',
    date: 'Besok, 08:00'
  },
  {
    id: 3,
    title: 'Auditorium Graha Widya',
    tag: 'Wisuda',
    requester: 'Dr. Haryanto (Biro Akad)',
    date: '02 Apr 2025'
  }
];

// Data Tiket & Garansi Kritis
const criticalTicketsData = [
  {
    code: '#TKT - 2025 - 084',
    codeClass: 'text-rose-600',
    priority: 'Prioritas Tinggi',
    priorityBadgeClass: 'bg-red-600 text-white',
    title: 'AC Split 2 PK Bocor &bull; Lab Komputer 2',
    handler: 'Teknisi: Joko Supriyanto',
    statusTime: 'Lewat 2 Jam',
    statusTimeClass: 'text-rose-600 font-bold'
  },
  {
    code: '#TKT - 2025 - 087',
    codeClass: 'text-blue-600',
    priority: 'Normal',
    priorityBadgeClass: 'bg-slate-100 text-slate-600',
    title: 'Kalibrasi Genset Cadangan 150 kVA',
    handler: 'Vendor: PT Daya Mandiri',
    statusTime: 'Deadline: Besok',
    statusTimeClass: 'text-slate-500 font-medium'
  }
];

// Data Log Aktivitas & Mutasi Terakhir (Tabel Data)
const activityLogsData = [
  {
    waktu: '28 Mar &bull; 14:16',
    kodeAset: 'AST-2023-0182',
    namaSarana: 'Interactive Smartboard 75"',
    jenisTransaksi: 'Mutasi Lokasi',
    iconTransaksi: 'arrow-left-right',
    isAlert: false,
    pelaksanaInisial: 'BI',
    pelaksanaBadgeClass: 'bg-blue-100 text-blue-700',
    pelaksanaNama: 'Bambang Irawan (Admin)',
    status: 'Tersimpan',
    statusBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    waktu: '28 Mar &bull; 13:40',
    kodeAset: 'AST-2024-1104',
    namaSarana: 'Laptop Lenovo ThinkPad T14',
    jenisTransaksi: 'Pengembalian',
    iconTransaksi: 'inbox',
    isAlert: false,
    pelaksanaInisial: 'DS',
    pelaksanaBadgeClass: 'bg-indigo-100 text-indigo-700',
    pelaksanaNama: 'Dewi Sartika (Kepegawaian)',
    status: 'Selesai / Ready',
    statusBadgeClass: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    waktu: '28 Mar &bull; 11:20',
    kodeAset: 'RNG-2022-0041',
    namaSarana: 'Ruang Auditorium Graha 2',
    jenisTransaksi: 'Reservasi Ruangan',
    iconTransaksi: 'calendar',
    isAlert: false,
    pelaksanaInisial: 'AR',
    pelaksanaBadgeClass: 'bg-sky-100 text-sky-700',
    pelaksanaNama: 'Agus Riyadi (LPPM)',
    status: 'Disetujui',
    statusBadgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  },
  {
    waktu: '28 Mar &bull; 09:05',
    kodeAset: 'AST-2021-0855',
    namaSarana: 'Mesin Cetak Canon C3500i',
    jenisTransaksi: 'Tiket Kerusakan',
    iconTransaksi: 'alert-triangle',
    isAlert: true,
    pelaksanaInisial: 'RH',
    pelaksanaBadgeClass: 'bg-blue-100 text-blue-700',
    pelaksanaNama: 'Rina Hartati (Akademik)',
    status: 'Dalam Perbaikan',
    statusBadgeClass: 'bg-rose-50 text-rose-700 border-rose-200'
  }
];


// ================= 2. FUNGSI RENDERING DOM ================= //

/**
 * 1. Render Menu Sidebar
 */
function renderSidebarMenu() {
  if (typeof renderNavigation === 'function') {
    renderNavigation('dashboard');
    return;
  }
  const container = document.getElementById('sidebar-menu-list') || document.getElementById('sidebar-menu');
  if (!container) return;

  container.innerHTML = menuItems.map(item => {
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

/**
 * 2. Render 5 Kartu Statistik Utama
 */
function renderStatCards() {
  const container = document.getElementById('stat-cards-container');
  if (!container) return;

  container.innerHTML = statCardsData.map(card => `
    <div class="bg-white p-4 rounded-xl border border-slate-200/90 card-shadow flex flex-col justify-between hover:border-slate-300 transition">
      <div>
        <div class="flex items-start justify-between">
          <span class="text-xs font-medium text-slate-500">${card.title}</span>
          <div class="w-7 h-7 rounded-lg ${card.iconBoxClass} flex items-center justify-center">
            <i data-lucide="${card.icon}" class="w-4 h-4"></i>
          </div>
        </div>
        <div class="mt-2 flex items-baseline">
          <span class="text-2xl font-extrabold text-slate-900 tracking-tight">${card.value}</span>
          ${card.unit ? `<span class="text-xs text-slate-400 font-medium ml-1.5">${card.unit}</span>` : ''}
          ${card.badge ? `<span class="ml-2 text-[10px] font-bold ${card.badgeClass} px-1.5 py-0.5 rounded">${card.badge}</span>` : ''}
        </div>
        ${card.hasProgress ? `
          <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div class="${card.progressBarClass} h-full rounded-full" style="width: ${card.progressWidth}"></div>
          </div>
        ` : ''}
        <div class="text-[11px] text-slate-400 font-medium mt-1.5">
          ${card.subtext}
        </div>
      </div>
      <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <span class="text-slate-500 font-medium">${card.footerLeft}</span>
        <span class="text-slate-500 font-medium">${card.footerRight}</span>
      </div>
    </div>
  `).join('');
}

/**
 * 3. Render Metrik Bawah Grafik Tren
 */
function renderTrendMetrics() {
  const container = document.getElementById('trend-metrics-container');
  if (!container) return;

  container.innerHTML = trendMetricsData.map(metric => `
    <div>
      <div class="text-[11px] text-slate-400 font-medium">${metric.label}</div>
      <div class="text-sm font-extrabold ${metric.isHighlighted ? 'text-blue-600' : 'text-slate-900'} mt-0.5">${metric.value}</div>
    </div>
  `).join('');
}

/**
 * 4. Render Legenda Kondisi Fisik Inventaris
 */
function renderInventoryConditions() {
  const container = document.getElementById('inventory-legend-container');
  if (!container) return;

  container.innerHTML = inventoryConditionsData.map(item => `
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-sm ${item.dotColor}"></span>
        <span class="text-slate-600 text-[11px]">${item.label}</span>
      </div>
      <span class="font-bold text-slate-800 text-[11px]">${item.count} <span class="font-normal text-slate-400">(${item.percentage})</span></span>
    </div>
  `).join('');
}

/**
 * 5. Render Okupansi Ruangan & Gedung
 */
function renderOccupancy() {
  const container = document.getElementById('occupancy-list');
  if (!container) return;

  container.innerHTML = occupancyData.map(item => `
    <div>
      <div class="flex items-center justify-between text-xs mb-1.5">
        <span class="font-bold text-slate-800">${item.name}</span>
        <span class="font-bold ${item.percentageClass}">${item.percentage}%</span>
      </div>
      <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div class="${item.barClass} h-full rounded-full" style="width: ${item.percentage}%"></div>
      </div>
      <div class="flex items-center justify-between text-[11px] text-slate-400 mt-1">
        <span>${item.subLeft}</span>
        <span>${item.subRight}</span>
      </div>
    </div>
  `).join('');
}

/**
 * 6. Render Antrean Persetujuan
 */
function renderApprovalQueue() {
  const container = document.getElementById('approval-list');
  if (!container) return;

  container.innerHTML = approvalQueueData.map(item => {
    const isApproved = item.status === 'Disetujui';
    const isRejected = item.status === 'Ditolak';
    return `
    <div class="p-3 bg-slate-50/80 rounded-xl border border-slate-100 hover:border-slate-200 transition">
      <div class="flex items-start justify-between gap-2">
        <div class="font-bold text-xs text-slate-800">${item.title}</div>
        <span class="px-2 py-0.5 rounded bg-blue-100/70 text-blue-700 text-[10px] font-semibold shrink-0">${item.tag}</span>
      </div>
      <div class="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
        <i data-lucide="user" class="w-3 h-3"></i>
        <span>${item.requester} &bull; ${item.date}</span>
      </div>
      <div class="flex items-center justify-end gap-2 mt-2.5">
        ${isApproved ? `
          <span class="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
            <i data-lucide="check-circle-2" class="w-3 h-3"></i> Disetujui
          </span>
        ` : isRejected ? `
          <span class="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold flex items-center gap-1">
            <i data-lucide="x-circle" class="w-3 h-3"></i> Ditolak
          </span>
        ` : (typeof hasPermission === 'function' && hasPermission('loans:approve')) ? `
          <button onclick="handleReject(${item.id})" class="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 text-[11px] font-semibold hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition">Tolak</button>
          <button onclick="handleApprove(${item.id})" class="px-2.5 py-1 rounded-md bg-blue-700 text-white text-[11px] font-semibold hover:bg-blue-800 shadow-sm transition">Setujui</button>
        ` : `
          <span class="text-[10px] text-slate-500 font-medium italic">Memerlukan Persetujuan Pimpinan</span>
        `}
      </div>
    </div>
  `;
  }).join('');
}

/**
 * 7. Render Tiket & Garansi Kritis
 */
function renderCriticalTickets() {
  const container = document.getElementById('tickets-list');
  if (!container) return;

  container.innerHTML = criticalTicketsData.map((ticket, index) => `
    <div class="space-y-1 ${index > 0 ? 'pt-2.5 border-t border-slate-100' : ''}">
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-bold ${ticket.codeClass}">${ticket.code}</span>
        <span class="px-2 py-0.5 rounded-full ${ticket.priorityBadgeClass} text-[9px] font-extrabold uppercase">${ticket.priority}</span>
      </div>
      <div class="text-xs font-bold text-slate-900">${ticket.title}</div>
      <div class="flex items-center justify-between text-[11px] pt-0.5">
        <span class="text-slate-400 font-medium">${ticket.handler}</span>
        <span class="${ticket.statusTimeClass}">${ticket.statusTime}</span>
      </div>
    </div>
  `).join('');
}

/**
 * 8. Render Tabel Log Aktivitas & Mutasi Terakhir + Paginasi Interaktif
 */
let currentActivityPage = 1;
const activityPerPage = 4;
let currentFilteredActivityLogs = null;

function renderActivityLogs(dataToRender = null) {
  if (dataToRender !== null) {
    currentFilteredActivityLogs = dataToRender;
  }
  const sourceList = currentFilteredActivityLogs || activityLogsData;
  const container = document.getElementById('activity-table-body');
  if (!container) return;

  const totalItems = sourceList.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / activityPerPage));
  if (currentActivityPage > totalPages) currentActivityPage = totalPages;
  if (currentActivityPage < 1) currentActivityPage = 1;

  const startIndex = (currentActivityPage - 1) * activityPerPage;
  const pageItems = sourceList.slice(startIndex, startIndex + activityPerPage);

  if (pageItems.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="7" class="py-6 text-center text-slate-400 text-xs">
          Tidak ada data aktivitas yang sesuai dengan pencarian.
        </td>
      </tr>
    `;
  } else {
    container.innerHTML = pageItems.map((row, idx) => {
      const globalIdx = startIndex + idx;
      return `
      <tr class="hover:bg-slate-50/70 transition">
        <td class="py-3 px-3 text-slate-500 whitespace-nowrap">
          ${row.waktu}
        </td>
        <td onclick="openDashboardLogDetail(${globalIdx})" class="py-3 px-3 font-bold text-blue-700 whitespace-nowrap cursor-pointer hover:underline" title="Klik untuk melihat rincian transaksi">
          ${row.kodeAset}
        </td>
        <td class="py-3 px-3 font-medium text-slate-800">
          ${row.namaSarana}
        </td>
        <td class="py-3 px-3 text-slate-700 whitespace-nowrap">
          <div class="flex items-center gap-2 ${row.isAlert ? 'text-rose-600' : ''}">
            <i data-lucide="${row.iconTransaksi}" class="w-3.5 h-3.5 ${row.isAlert ? 'text-rose-500' : 'text-slate-500'}"></i>
            <span>${row.jenisTransaksi}</span>
          </div>
        </td>
        <td class="py-3 px-3 whitespace-nowrap">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full ${row.pelaksanaBadgeClass} font-bold text-[10px] flex items-center justify-center">${row.pelaksanaInisial}</span>
            <span class="text-slate-700 font-medium">${row.pelaksanaNama}</span>
          </div>
        </td>
        <td class="py-3 px-3 whitespace-nowrap">
          <span class="px-2.5 py-0.5 rounded-full ${row.statusBadgeClass} text-[11px] font-semibold border">${row.status}</span>
        </td>
        <td class="py-3 px-2 text-right">
          <button type="button" onclick="openDashboardLogDetail(${globalIdx})" class="p-1.5 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition cursor-pointer" title="Lihat Rincian & Cetak Bukti">
            <i data-lucide="more-vertical" class="w-4 h-4 ml-auto"></i>
          </button>
        </td>
      </tr>
    `;
    }).join('');
  }

  const infoEl = document.getElementById('activity-pagination-info');
  if (infoEl) {
    if (totalItems === 0) {
      infoEl.textContent = 'Menampilkan 0 transaksi sistem';
    } else {
      const endItem = Math.min(startIndex + activityPerPage, totalItems);
      infoEl.textContent = `Menampilkan ${startIndex + 1} - ${endItem} dari ${totalItems} transaksi sistem terverifikasi`;
    }
  }

  const btnContainer = document.getElementById('activity-pagination-buttons');
  if (btnContainer) {
    let btnsHtml = `
      <button type="button" onclick="changeActivityPage(${currentActivityPage - 1})" ${currentActivityPage <= 1 ? 'disabled' : ''} class="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer">
        <i data-lucide="chevron-left" class="w-3.5 h-3.5"></i>
      </button>
    `;
    for (let p = 1; p <= totalPages; p++) {
      if (p === currentActivityPage) {
        btnsHtml += `<button type="button" onclick="changeActivityPage(${p})" class="w-7 h-7 rounded-lg bg-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-sm cursor-pointer">${p}</button>`;
      } else {
        btnsHtml += `<button type="button" onclick="changeActivityPage(${p})" class="w-7 h-7 rounded-lg border border-transparent text-slate-600 hover:bg-slate-100 text-xs font-medium flex items-center justify-center cursor-pointer">${p}</button>`;
      }
    }
    btnsHtml += `
      <button type="button" onclick="changeActivityPage(${currentActivityPage + 1})" ${currentActivityPage >= totalPages ? 'disabled' : ''} class="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer">
        <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
      </button>
    `;
    btnContainer.innerHTML = btnsHtml;
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

window.changeActivityPage = function(page) {
  currentActivityPage = page;
  renderActivityLogs();
};

window.openDashboardLogDetail = function(idx) {
  const sourceList = currentFilteredActivityLogs || activityLogsData;
  const row = sourceList[idx];
  if (!row) return;

  const existing = document.getElementById('dashboard-log-detail-modal');
  if (existing) existing.remove();

  let targetPage = 'laporan.html';
  if (row.jenisTransaksi.toLowerCase().includes('pinjam') || row.jenisTransaksi.toLowerCase().includes('reservasi') || row.jenisTransaksi.toLowerCase().includes('kembali') || row.jenisTransaksi.toLowerCase().includes('persetujuan')) {
    targetPage = 'peminjaman.html';
  } else if (row.jenisTransaksi.toLowerCase().includes('tiket') || row.jenisTransaksi.toLowerCase().includes('rusak') || row.jenisTransaksi.toLowerCase().includes('servis')) {
    targetPage = 'tiket.html';
  } else if (row.jenisTransaksi.toLowerCase().includes('aset') || row.jenisTransaksi.toLowerCase().includes('mutasi')) {
    targetPage = 'aset.html';
  }

  const modal = document.createElement('div');
  modal.id = 'dashboard-log-detail-modal';
  modal.className = 'fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div>
          <span class="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">${row.jenisTransaksi}</span>
          <h3 class="text-sm font-extrabold text-slate-900 mt-0.5">Rincian Transaksi ${row.kodeAset}</h3>
        </div>
        <button type="button" onclick="document.getElementById('dashboard-log-detail-modal')?.remove()" class="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="p-5 space-y-3 text-xs">
        <div class="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <div class="text-[10px] font-bold text-slate-400 uppercase">Kode Transaksi / NUP</div>
            <div class="font-bold text-slate-900 mt-0.5">${row.kodeAset}</div>
          </div>
          <div>
            <div class="text-[10px] font-bold text-slate-400 uppercase">Waktu Tercatat</div>
            <div class="font-semibold text-slate-700 mt-0.5">${row.waktu}</div>
          </div>
          <div class="col-span-2">
            <div class="text-[10px] font-bold text-slate-400 uppercase">Sarana / Prasarana</div>
            <div class="font-bold text-slate-900 mt-0.5">${row.namaSarana}</div>
          </div>
          <div>
            <div class="text-[10px] font-bold text-slate-400 uppercase">Pelaksana / PIC</div>
            <div class="font-semibold text-slate-700 mt-0.5">${row.pelaksanaNama}</div>
          </div>
          <div>
            <div class="text-[10px] font-bold text-slate-400 uppercase">Status Sistem</div>
            <div class="mt-1"><span class="px-2 py-0.5 rounded-full ${row.statusBadgeClass} text-[10px] font-bold border">${row.status}</span></div>
          </div>
        </div>
      </div>
      <div class="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
        <a href="${targetPage}" class="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition">
          <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
          <span>Buka Modul Terkait</span>
        </a>
        <div class="flex items-center gap-2">
          <button type="button" onclick="window.print()" class="px-3.5 py-2 rounded-xl bg-[#0f2a71] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <i data-lucide="printer" class="w-3.5 h-3.5"></i>
            <span>Cetak Bukti</span>
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  if (window.lucide) window.lucide.createIcons();
};


// ================= 3. INTERACTIVE ACTIONS ================= //

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

// Handler Buka Pusat Laporan (pengganti window.print yang diblokir di iframe)
function handlePrintReport() {
  window.location.href = 'laporan.html';
}

// Inisialisasi Chart.js: Tren Peminjaman & Reservasi
let trendChartInstance = null;
function initTrendChart() {
  const canvas = document.getElementById('trendChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const ctx = canvas.getContext('2d');
  const gradientBlue = ctx.createLinearGradient(0, 0, 0, 240);
  gradientBlue.addColorStop(0, 'rgba(16, 47, 134, 0.35)');
  gradientBlue.addColorStop(1, 'rgba(16, 47, 134, 0.0)');

  const gradientTeal = ctx.createLinearGradient(0, 0, 0, 240);
  gradientTeal.addColorStop(0, 'rgba(13, 148, 136, 0.25)');
  gradientTeal.addColorStop(1, 'rgba(13, 148, 136, 0.0)');

  if (trendChartInstance) {
    trendChartInstance.destroy();
  }

  trendChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels: ['01 Jan', '15 Jan', '01 Feb', '15 Feb', '01 Mar', '15 Mar', '28 Mar (Hari Ini)'],
      datasets: [
        {
          label: 'Aset Bergerak',
          data: [42, 65, 80, 115, 138, 172, 198],
          borderColor: '#102f86',
          borderWidth: 2.5,
          backgroundColor: gradientBlue,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#102f86',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Ruangan',
          data: [28, 38, 48, 62, 75, 88, 104],
          borderColor: '#0d9488',
          borderWidth: 2,
          backgroundColor: gradientTeal,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#0d9488',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { family: 'Plus Jakarta Sans', size: 12 },
          bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
          padding: 10,
          cornerRadius: 8,
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Plus Jakarta Sans', size: 10 }, color: '#94a3b8' }
        },
        y: {
          grid: { color: '#f1f5f9' },
          ticks: { font: { family: 'Plus Jakarta Sans', size: 10 }, color: '#94a3b8' },
          beginAtZero: true
        }
      }
    }
  });
}

// Inisialisasi Chart.js: Donut Chart Kondisi Fisik Inventaris
let conditionChartInstance = null;
function initConditionChart() {
  const canvas = document.getElementById('conditionChart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (conditionChartInstance) {
    conditionChartInstance.destroy();
  }

  conditionChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Baik (Prima)', 'Cukup (Terawat)', 'Rusak Ringan', 'Rusak Berat'],
      datasets: [{
        data: [2333, 398, 85, 29],
        backgroundColor: ['#1d4ed8', '#0d9488', '#f59e0b', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { family: 'Plus Jakarta Sans', size: 11 },
          bodyFont: { family: 'Plus Jakarta Sans', size: 11 },
          padding: 8,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((context.raw / total) * 100);
              return ` ${context.label}: ${context.raw} Unit (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

function showDashboardToast(message, type = 'success') {
  let toastContainer = document.getElementById('dashboard-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'dashboard-toast-container';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }
  const bg = type === 'danger' ? 'bg-rose-700 border-rose-600' : type === 'info' ? 'bg-slate-900 border-slate-700' : 'bg-[#0f2a71] border-blue-800';
  const toast = document.createElement('div');
  toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl text-white text-xs font-bold shadow-xl border ${bg} transition-all duration-300`;
  toast.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-300 shrink-0"></i><span>${message}</span>`;
  toastContainer.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Handler Aksi Persetujuan (Dilindungi RBAC)
async function handleApprove(id) {
  if (typeof requirePermission === 'function') {
    if (!requirePermission('loans:approve', 'Menyetujui Permohonan Peminjaman')) return;
  }
  const item = approvalQueueData.find(a => a.id === id);
  if (item) {
    item.status = 'Disetujui';
    if (typeof API !== 'undefined') {
      await API.approveQueue(item.dbId || item.id);
    }
    activityLogsData.unshift({
      waktu: 'Baru saja',
      kodeAset: `APV-2025-0${item.id}`,
      namaSarana: item.title,
      jenisTransaksi: 'Persetujuan Pimpinan',
      iconTransaksi: 'check-circle-2',
      isAlert: false,
      pelaksanaInisial: 'PM',
      pelaksanaNama: item.requester,
      pelaksanaBadgeClass: 'bg-emerald-100 text-emerald-700',
      status: 'Disetujui',
      statusBadgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    });
    currentActivityPage = 1;
    renderApprovalQueue();
    renderActivityLogs(null);
    if (window.lucide) lucide.createIcons();
    showDashboardToast(`Permohonan "${item.title}" berhasil disetujui!`, 'success');
  }
}

async function handleReject(id) {
  if (typeof requirePermission === 'function') {
    if (!requirePermission('loans:approve', 'Menolak Permohonan Peminjaman')) return;
  }
  const item = approvalQueueData.find(a => a.id === id);
  if (item) {
    item.status = 'Ditolak';
    if (typeof API !== 'undefined') {
      await API.rejectQueue(item.dbId || item.id);
    }
    activityLogsData.unshift({
      waktu: 'Baru saja',
      kodeAset: `APV-2025-0${item.id}`,
      namaSarana: item.title,
      jenisTransaksi: 'Penolakan Antrean',
      iconTransaksi: 'x-circle',
      isAlert: true,
      pelaksanaInisial: 'PM',
      pelaksanaNama: item.requester,
      pelaksanaBadgeClass: 'bg-rose-100 text-rose-700',
      status: 'Ditolak',
      statusBadgeClass: 'bg-rose-50 text-rose-600 border-rose-200'
    });
    currentActivityPage = 1;
    renderApprovalQueue();
    renderActivityLogs(null);
    if (window.lucide) lucide.createIcons();
    showDashboardToast(`Permohonan "${item.title}" telah ditolak.`, 'danger');
  }
}

// Inisialisasi Fitur Filter Pencarian pada Tabel
function setupTableFilter() {
  const searchInput = document.getElementById('table-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    currentActivityPage = 1;
    if (!keyword) {
      currentFilteredActivityLogs = null;
      renderActivityLogs(null);
      return;
    }
    const filtered = activityLogsData.filter(item => 
      item.kodeAset.toLowerCase().includes(keyword) ||
      item.namaSarana.toLowerCase().includes(keyword) ||
      item.pelaksanaNama.toLowerCase().includes(keyword) ||
      item.jenisTransaksi.toLowerCase().includes(keyword) ||
      item.status.toLowerCase().includes(keyword)
    );
    renderActivityLogs(filtered);
  });
}


// ================= 4. BACKEND INTEGRATION & INISIALISASI UTAMA ================= //

async function loadDashboardStatsFromBackend() {
  if (typeof API !== 'undefined') {
    const res = await API.getDashboardStats();
    if (res && res.success && res.data) {
      const d = res.data;
      if (statCardsData[0]) {
        statCardsData[0].value = String(d.totalAssets);
        const milyar = (d.totalValue / 1000000000).toFixed(2).replace('.', ',');
        statCardsData[0].subtext = `Rp ${milyar} Miliar <span class="text-slate-300 font-normal">total perolehan</span>`;
      }
      if (statCardsData[1]) {
        statCardsData[1].value = String(d.readyAssets);
        const pct = d.totalAssets > 0 ? ((d.readyAssets / d.totalAssets) * 100).toFixed(1) : '0';
        statCardsData[1].badge = `${pct}%`;
        statCardsData[1].progressWidth = `${pct}%`;
      }
      if (statCardsData[2]) {
        statCardsData[2].value = String(d.loanedAssets);
      }
      if (statCardsData[3]) {
        statCardsData[3].value = String(d.maintenanceAssets);
      }
      if (statCardsData[4]) {
        statCardsData[4].value = String(d.damagedAssets);
      }
      renderStatCards();
    }

    const appvRes = await API.getApprovals();
    if (appvRes && appvRes.success && Array.isArray(appvRes.data) && appvRes.data.length > 0) {
      appvRes.data.forEach((dbAppv, idx) => {
        if (approvalQueueData[idx]) {
          approvalQueueData[idx].dbId = dbAppv.id;
          if (dbAppv.status === 'Disetujui' || dbAppv.status === 'Ditolak') {
            approvalQueueData[idx].status = dbAppv.status;
          }
        }
      });
      renderApprovalQueue();
    }

    // Sinkronisasi Tiket Kritis dari Backend
    const ticketRes = await API.getTickets();
    if (ticketRes && ticketRes.success && Array.isArray(ticketRes.data) && ticketRes.data.length > 0) {
      const openTickets = ticketRes.data.filter(t => t.status !== 'selesai').slice(0, 3);
      if (openTickets.length > 0) {
        criticalTicketsData.length = 0;
        openTickets.forEach(t => {
          const isHigh = t.priority === 'URGENT' || t.priority === 'TINGGI';
          criticalTicketsData.push({
            code: `#${t.kode}`,
            codeClass: isHigh ? 'text-rose-600' : 'text-blue-600',
            priority: t.priority || 'NORMAL',
            priorityBadgeClass: isHigh ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600',
            title: `${t.title} &bull; ${t.location || 'Kampus'}`,
            handler: `Teknisi: ${t.tech_name || 'Tim Sarpras'}`,
            statusTime: t.status === 'sparepart' ? 'Tunggu Sparepart' : t.status === 'proses' ? 'Dalam Pengerjaan' : 'Tiket Baru',
            statusTimeClass: isHigh ? 'text-rose-600 font-bold' : 'text-slate-500 font-medium'
          });
        });
        renderCriticalTickets();
      }
    }

    // Sinkronisasi Log Aktivitas dari Backend
    const logRes = await API.getActivityLogs();
    if (logRes && logRes.success && Array.isArray(logRes.data) && logRes.data.length > 0) {
      const existingCodes = new Set(activityLogsData.map(a => a.namaSarana));
      logRes.data.slice(0, 12).reverse().forEach(dbLog => {
        if (dbLog.action === 'Inisialisasi Database' || dbLog.action === 'Login') return;
        const detailsText = dbLog.details || dbLog.action;
        if (existingCodes.has(detailsText)) return;
        const initials = (dbLog.user_name || 'SM').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        const isAlert = dbLog.action.toLowerCase().includes('tolak') || dbLog.action.toLowerCase().includes('hapus') || dbLog.action.toLowerCase().includes('tiket');
        activityLogsData.unshift({
          waktu: (dbLog.timestamp || 'Baru saja').slice(5, 16).replace(' ', ' • '),
          kodeAset: `LOG-2025-0${dbLog.id}`,
          namaSarana: detailsText,
          jenisTransaksi: dbLog.action || 'Aktivitas Sistem',
          iconTransaksi: isAlert ? 'alert-triangle' : 'check-circle-2',
          isAlert,
          pelaksanaInisial: initials || 'SM',
          pelaksanaBadgeClass: isAlert ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700',
          pelaksanaNama: dbLog.user_name || 'Admin Sarpras',
          status: 'Tercatat',
          statusBadgeClass: isAlert ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
        });
      });
      renderActivityLogs();
    }

    applyRoleSpecificDashboard();
    if (window.lucide) lucide.createIcons();
  }
}

/**
 * Menyesuaikan tampilan Dashboard (index.html) secara spesifik untuk setiap Role:
 * - Admin: Kontrol Sistem Penuh & Valuasi Master Aset
 * - Petugas: Operasional Fisik, Sirkulasi Pinjaman & Tiket Servis (Tanpa Valuasi Keuangan & Tanpa Approval)
 * - Pimpinan: Monitoring Eksekutif & Otorisasi Persetujuan (Read-Only Master Data)
 * - Peminjam: Portal Layanan Mandiri Civitas Akademika (Katalog Siap Pinjam & Pinjaman Saya, tanpa grafik/audit internal)
 */
window.handleLiveLoanApproval = async function(loanId, decision, title) {
  if (typeof requirePermission === 'function') {
    if (!requirePermission('loans:approve', decision === 'approve' ? 'Menyetujui Peminjaman' : 'Menolak Peminjaman')) return;
  }
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const actor = user ? (user.nama || user.username) : 'Admin Sarpras';
  try {
    const endpoint = decision === 'approve' ? `/api/loans/${loanId}/approve` : `/api/loans/${loanId}/reject`;
    const body = decision === 'approve'
      ? { approved_by: actor }
      : { rejected_by: actor, catatan: `Ditolak dari Dashboard oleh ${actor}` };
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    if (res.ok && json.success) {
      showDashboardToast(
        decision === 'approve'
          ? `Permohonan "${title}" berhasil disetujui & SPK diterbitkan!`
          : `Permohonan "${title}" telah ditolak.`,
        decision === 'approve' ? 'success' : 'danger'
      );
      if (user && user.role === 'pimpinan') {
        loadPimpinanDashboardLiveData();
      } else {
        loadAdminDashboardLiveData();
      }
    } else {
      showDashboardToast((json && json.message) || 'Gagal memproses persetujuan.', 'error');
    }
  } catch (err) {
    showDashboardToast('Gagal terhubung ke server untuk memproses persetujuan.', 'error');
  }
};

window.handleLivePetugasCheckin = async function(loanId, itemName, mode) {
  if (typeof requirePermission === 'function') {
    if (!requirePermission('loans:return', 'Memverifikasi Pengembalian Sarana')) return;
  }
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const officer = user ? (user.nama || user.username) : 'Petugas Sarpras';
  const catatan = mode === 'missing'
    ? `Diverifikasi ${officer}: Ada catatan kelengkapan/inspeksi fisik tambahan.`
    : `Diverifikasi ${officer}: Unit lengkap, fisik baik, stok kembali Tersedia.`;
  try {
    const res = await fetch(`/api/loans/${loanId}/return`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ catatan, verified_by: officer })
    });
    const json = await res.json();
    if (res.ok && json.success) {
      showDashboardToast(`Pengembalian "${itemName}" telah diverifikasi & stok aset kembali Tersedia!`, 'success');
      loadPetugasDashboardLiveData();
    } else {
      showDashboardToast((json && json.message) || 'Gagal memverifikasi pengembalian.', 'error');
    }
  } catch (err) {
    showDashboardToast('Gagal terhubung ke server untuk verifikasi pengembalian.', 'error');
  }
};

window.handlePdfApprovalCard = function(btnEl, decision, title) {
  const card = btnEl.closest('.pdf-approval-card');
  if (!card) return;
  const actionsWrap = card.querySelector('.pdf-approval-actions');
  if (actionsWrap) {
    if (decision === 'approve') {
      actionsWrap.innerHTML = `<span class="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold">✓ Telah Disetujui</span>`;
      showDashboardToast(`Permohonan "${title}" berhasil disetujui & SPK diterbitkan!`, 'success');
    } else {
      actionsWrap.innerHTML = `<span class="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold">✕ Telah Ditolak</span>`;
      showDashboardToast(`Permohonan "${title}" telah ditolak.`, 'danger');
    }
  }
};

window.handlePdfCheckinAction = function(btnEl, statusType, itemName) {
  if (statusType === 'ok') {
    btnEl.outerHTML = `<span class="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold">✓ Terverifikasi Kembali</span>`;
    showDashboardToast(`Pengembalian "${itemName}" telah diverifikasi layak!`, 'success');
  } else {
    btnEl.outerHTML = `<span class="px-4 py-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold">! Berita Acara Tercatat</span>`;
    showDashboardToast(`Catatan kelengkapan hilang untuk "${itemName}" berhasil disimpan.`, 'info');
  }
};

window.handlePdfSignDocument = function(btnEl) {
  btnEl.className = 'w-full py-3 rounded-xl bg-emerald-600 text-white text-xs font-extrabold cursor-default';
  btnEl.textContent = '✓ Dokumen Audit Telah Disahkan (BSrE BSSN)';
  showDashboardToast('Dokumen Laporan Audit Fisik Sarpras berhasil disahkan dengan Tanda Tangan Digital!', 'success');
};

async function applyRoleSpecificDashboard() {
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : { role: 'admin', nama: 'Bambang Irawan, S.Kom' };
  const mainEl = document.querySelector('main');
  if (!mainEl) return;

  // Hide legacy children inside <main> while keeping their DOM IDs intact for tests
  Array.from(mainEl.children).forEach(child => {
    if (child.id !== 'simas-pdf-dashboard-root' && child.id !== 'simas-peminjam-portal') {
      child.classList.add('hidden');
    }
  });

  const oldPortal = document.getElementById('simas-peminjam-portal');
  if (oldPortal) oldPortal.remove();

  let root = document.getElementById('simas-pdf-dashboard-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'simas-pdf-dashboard-root';
    root.className = 'space-y-5';
    mainEl.insertBefore(root, mainEl.firstChild);
  }

  const role = user ? user.role : 'admin';

  if (role === 'admin') {
    // ================= PDF PAGE 1: DASHBOARD EKSEKUTIF ADMIN SARPRAS =================
    root.innerHTML = `
      <!-- Welcome Banner -->
      <div class="bg-[#eef4ff] border border-blue-200/90 rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-lg font-extrabold text-[#0f2a71]">Selamat Datang, ${user.nama || 'Admin Sarpras'}! (Admin Sarpras)</h1>
          <p class="text-xs text-[#1d4ed8] font-medium mt-1">Wewenang Penuh: Tambah/Edit/Hapus Aset, ACC Pendaftaran Akun, Setujui Pinjaman, Kelola Tiket Kanban, &amp; Rekap Cetak Laporan.</p>
        </div>
        <div class="flex items-center gap-3">
          <a href="aset.html" class="px-5 py-2.5 rounded-xl bg-[#1246b5] hover:bg-blue-800 text-white text-xs font-extrabold transition shadow-xs">+ Tambah Aset Baru</a>
          <a href="laporan.html" class="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-extrabold transition">Buka Pusat Laporan</a>
        </div>
      </div>

      <!-- Live Antrean ACC Pendaftaran Akun Baru (Khusus Admin) -->
      <div id="admin-pending-acc-container" class="hidden"></div>

      <!-- 4 KPI Cards -->
      <div id="kpi-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <article class="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between shadow-2xs">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs text-slate-500 font-medium">Total Master Aset</span>
              <h2 id="admin-kpi-assets" class="text-2xl font-extrabold text-slate-900 mt-1">...</h2>
            </div>
            <div class="w-9 h-9 rounded-xl bg-blue-50 text-[#1246b5] flex items-center justify-center">
              <i data-lucide="archive" class="w-4 h-4"></i>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between text-[11px]">
            <span id="admin-kpi-assets-sub" class="text-slate-500 font-medium">Memuat valuasi...</span>
            <span id="admin-kpi-assets-badge" class="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#1246b5] font-bold">Inventaris</span>
          </div>
        </article>

        <article class="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between shadow-2xs">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs text-slate-500 font-medium">Ketersediaan Aset</span>
              <h2 id="admin-kpi-ready" class="text-2xl font-extrabold text-slate-900 mt-1">...</h2>
            </div>
            <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <i data-lucide="building-2" class="w-4 h-4"></i>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between text-[11px]">
            <span id="admin-kpi-ready-sub" class="text-slate-500 font-medium">Memuat kondisi...</span>
            <span class="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">Siap Pakai</span>
          </div>
        </article>

        <article class="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between shadow-2xs">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs text-slate-500 font-medium">Antrean Pinjaman</span>
              <h2 id="admin-kpi-loans" class="text-2xl font-extrabold text-slate-900 mt-1">...</h2>
            </div>
            <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <i data-lucide="clipboard-list" class="w-4 h-4"></i>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between text-[11px]">
            <span id="admin-kpi-loans-sub" class="text-slate-500 font-medium">Memuat antrean...</span>
            <span class="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold">Tindakan Cepat</span>
          </div>
        </article>

        <article class="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between shadow-2xs">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs text-slate-500 font-medium">Tiket Perbaikan</span>
              <h2 id="admin-kpi-tickets" class="text-2xl font-extrabold text-slate-900 mt-1">...</h2>
            </div>
            <div class="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <i data-lucide="wrench" class="w-4 h-4"></i>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between text-[11px]">
            <span id="admin-kpi-tickets-sub" class="text-slate-500 font-medium">Memuat biaya...</span>
            <span id="admin-kpi-tickets-badge" class="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold">Kanban Aktif</span>
          </div>
        </article>
      </div>

      <!-- Middle Row: Tren Sirkulasi + Okupansi Gedung -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 class="text-sm font-extrabold text-slate-900">Tren Sirkulasi Peminjaman (7 Hari)</h3>
              <p class="text-[11px] text-slate-500 mt-0.5">Perbandingan peminjaman aktif vs selesai per hari</p>
            </div>
            <div class="flex items-center gap-4 text-[11px]">
              <span class="flex items-center gap-1.5 text-slate-600 font-medium"><span class="w-2.5 h-2.5 rounded-xs bg-[#1246b5]"></span>Peminjaman</span>
              <span class="flex items-center gap-1.5 text-slate-600 font-medium"><span class="w-2.5 h-2.5 rounded-xs bg-[#10b981]"></span>Servis Selesai</span>
              <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">↗ +18.4% Aktivitas</span>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-100 grid grid-cols-7 gap-3 items-end h-44 px-2">
            ${[
              { day: 'Sen 10', b: 65, g: 35 },
              { day: 'Sel 11', b: 82, g: 45 },
              { day: 'Rab 12', b: 74, g: 30 },
              { day: 'Kam 13', b: 96, g: 58 },
              { day: 'Jum 14', b: 88, g: 50 },
              { day: 'Sab 15', b: 42, g: 18 },
              { day: 'Min 16', b: 68, g: 32 }
            ].map(d => `
              <div class="flex flex-col items-center gap-2 h-full justify-end">
                <div class="flex items-end gap-1.5 w-full justify-center h-36">
                  <div class="w-4 rounded-t-md bg-[#1246b5]" style="height:${d.b}%"></div>
                  <div class="w-3.5 rounded-t-md bg-[#10b981]" style="height:${d.g}%"></div>
                </div>
                <span class="text-[10px] font-semibold text-slate-500">${d.day}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <h3 class="text-sm font-extrabold text-slate-900">Okupansi Ruang per Kompleks Gedung</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">42 dari 56 ruangan sedang digunakan aktif</p>
          </div>
          <div class="space-y-4 my-auto pt-4">
            <div>
              <div class="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>Gedung TI (Lab &amp; R. Dosen)</span>
                <span class="text-slate-500 font-semibold">17 / 20 (85%)</span>
              </div>
              <div class="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden"><div class="h-full rounded-full bg-[#1246b5]" style="width:85%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>Gedung Utama (Aula &amp; Seminar)</span>
                <span class="text-slate-500 font-semibold">14 / 20 (70%)</span>
              </div>
              <div class="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden"><div class="h-full rounded-full bg-[#10b981]" style="width:70%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>Gedung MIPA (Laboratorium)</span>
                <span class="text-slate-500 font-semibold">6 / 10 (60%)</span>
              </div>
              <div class="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden"><div class="h-full rounded-full bg-[#8b5cf6]" style="width:60%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>Gedung Rektorat (Senat &amp; Rapat)</span>
                <span class="text-slate-500 font-semibold">5 / 6 (83%)</span>
              </div>
              <div class="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden"><div class="h-full rounded-full bg-[#f59e0b]" style="width:83%"></div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Permohonan Approval Admin (Live SQLite) + Kanban & Live Audit Log -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3.5 shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-sm font-extrabold text-slate-900">Permohonan Peminjaman Menunggu Approval Admin</h3>
            <a href="peminjaman.html" class="text-[11px] font-bold text-[#1246b5] hover:underline">Kelola Semua &rarr;</a>
          </div>
          <div id="admin-live-approval-queue" class="space-y-3">
            <div class="p-4 rounded-xl bg-[#f8fafd] border border-slate-200/80 text-xs text-slate-500">Memuat antrean peminjaman dari database...</div>
          </div>
        </div>

        <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3.5 shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-sm font-extrabold text-slate-900">Kanban Pemeliharaan &amp; Audit Trail</h3>
            <a href="tiket.html" class="text-[11px] font-bold text-[#1246b5] hover:underline">Buka Kanban &rarr;</a>
          </div>

          <div id="admin-live-tickets" class="space-y-2.5">
            <div class="p-3.5 rounded-xl bg-[#f8fafd] border border-slate-200/80 text-xs text-slate-500">Memuat tiket perbaikan...</div>
          </div>

          <div class="pt-2 border-t border-slate-100 space-y-1.5">
            <div class="text-xs font-extrabold text-slate-800">Live Audit Log (Sistem Keamanan):</div>
            <ul id="admin-live-audit-log" class="text-[11px] text-slate-500 space-y-1 leading-relaxed">
              <li>&bull; Memuat log aktivitas terkini...</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  } else if (role === 'petugas') {
    // ================= PDF PAGE 2: DASHBOARD OPERASIONAL PETUGAS & TEKNISI =================
    root.innerHTML = `
      <!-- Welcome Banner -->
      <div class="bg-[#ecfdf5] border border-emerald-200 rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-lg font-extrabold text-[#065f46]">Halo, ${user.nama || 'Petugas Sarpras'}! (Teknisi Sarpras)</h1>
          <p class="text-xs text-emerald-700 font-medium mt-1">Wewenang Petugas: Cek fisik aset, verifikasi barang kembali, update Kanban &amp; nota perbaikan. (Dilarang menghapus aset).</p>
        </div>
        <a href="tiket.html" class="px-5 py-2.5 rounded-xl bg-[#0d7a5f] hover:bg-emerald-800 text-white text-xs font-extrabold transition shadow-xs">+ Catat Kerusakan Baru</a>
      </div>

      <!-- 4 KPI Cards -->
      <div id="kpi-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <article class="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between shadow-2xs">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs text-slate-500 font-medium">Tugas Servis Aktif</span>
              <h2 id="petugas-kpi-tickets" class="text-2xl font-extrabold text-slate-900 mt-1">...</h2>
            </div>
            <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center"><i data-lucide="wrench" class="w-4 h-4"></i></div>
          </div>
          <div class="mt-4 flex items-center justify-between text-[11px]">
            <span id="petugas-kpi-tickets-sub" class="text-slate-500 font-medium">Memuat tiket...</span>
            <span class="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold">Kerjakan Segera</span>
          </div>
        </article>

        <article class="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between shadow-2xs">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs text-slate-500 font-medium">Cek Barang Kembali</span>
              <h2 id="petugas-kpi-checkin" class="text-2xl font-extrabold text-slate-900 mt-1">...</h2>
            </div>
            <div class="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center"><i data-lucide="clipboard-check" class="w-4 h-4"></i></div>
          </div>
          <div class="mt-4 flex items-center justify-between text-[11px]">
            <span id="petugas-kpi-checkin-sub" class="text-slate-500 font-medium">Cek Fisik Sarana</span>
            <span class="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold">Check-In Desk</span>
          </div>
        </article>

        <article class="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between shadow-2xs">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs text-slate-500 font-medium">Aset Dalam Perawatan</span>
              <h2 id="petugas-kpi-maint" class="text-2xl font-extrabold text-slate-900 mt-1">...</h2>
            </div>
            <div class="w-9 h-9 rounded-xl bg-blue-50 text-[#1246b5] flex items-center justify-center"><i data-lucide="archive" class="w-4 h-4"></i></div>
          </div>
          <div class="mt-4 flex items-center justify-between text-[11px]">
            <span class="text-slate-500 font-medium">AC, Proyektor &amp; Lab</span>
            <span class="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#1246b5] font-bold">Antrean Bengkel</span>
          </div>
        </article>

        <article class="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between shadow-2xs">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs text-slate-500 font-medium">Total Biaya Servis</span>
              <h2 id="petugas-kpi-cost" class="text-2xl font-extrabold text-slate-900 mt-1">...</h2>
            </div>
            <div class="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center"><i data-lucide="dollar-sign" class="w-4 h-4"></i></div>
          </div>
          <div class="mt-4 flex items-center justify-between text-[11px]">
            <span class="text-slate-500 font-medium">Tercatat di Tiket</span>
            <span class="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold">Klaim APBN</span>
          </div>
        </article>
      </div>

      <!-- Middle Row -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 class="text-sm font-extrabold text-slate-900">Penyelesaian Tiket Servis (7 Hari)</h3>
              <p class="text-[11px] text-slate-500 mt-0.5">Target kerja vs realisasi selesai (Joko Supriyanto)</p>
            </div>
            <div class="flex items-center gap-4 text-[11px]">
              <span class="flex items-center gap-1.5 text-slate-600 font-medium"><span class="w-2.5 h-2.5 rounded-xs bg-slate-300"></span>Target Kerja</span>
              <span class="flex items-center gap-1.5 text-slate-600 font-medium"><span class="w-2.5 h-2.5 rounded-xs bg-[#0d7a5f]"></span>Selesai Servis</span>
              <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">91.6% Tepat Waktu</span>
            </div>
          </div>
          <div class="mt-6 pt-4 border-t border-slate-100 grid grid-cols-7 gap-3 items-end h-44 px-2">
            ${[
              { day: 'Sen', t: 62, s: 62 },
              { day: 'Sel', t: 75, s: 75 },
              { day: 'Rab', t: 50, s: 50 },
              { day: 'Kam', t: 88, s: 75 },
              { day: 'Jum', t: 62, s: 62 },
              { day: 'Sab', t: 32, s: 32 },
              { day: 'Min', t: 20, s: 20 }
            ].map(d => `
              <div class="flex flex-col items-center gap-2 h-full justify-end">
                <div class="flex items-end gap-1.5 w-full justify-center h-36">
                  <div class="w-4 rounded-t-md bg-slate-300" style="height:${d.t}%"></div>
                  <div class="w-4 rounded-t-md bg-[#0d7a5f]" style="height:${d.s}%"></div>
                </div>
                <span class="text-[10px] font-semibold text-slate-500">${d.day}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <h3 class="text-sm font-extrabold text-slate-900">Rasio Kondisi Fisik 1.248 Sarana Kampus</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Hasil inspeksi berkala sarpras semester ganjil</p>
          </div>
          <div class="space-y-5 my-auto pt-4">
            <div>
              <div class="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>Kondisi Baik (Siap Pakai)</span>
                <span class="text-slate-500 font-semibold">1.176 Unit (94.2%)</span>
              </div>
              <div class="h-3 w-full rounded-full bg-slate-100 overflow-hidden"><div class="h-full rounded-full bg-[#10b981]" style="width:94.2%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>Rusak Ringan (Antrean Servis)</span>
                <span class="text-slate-500 font-semibold">56 Unit (4.5%)</span>
              </div>
              <div class="h-3 w-full rounded-full bg-slate-100 overflow-hidden"><div class="h-full rounded-full bg-[#f59e0b]" style="width:22%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>Rusak Berat (Usul Hapus)</span>
                <span class="text-slate-500 font-semibold">16 Unit (1.3%)</span>
              </div>
              <div class="h-3 w-full rounded-full bg-slate-100 overflow-hidden"><div class="h-full rounded-full bg-rose-600" style="width:8%"></div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Check-In Desk (Live SQLite) + Tiket Ditugaskan -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3.5 shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-sm font-extrabold text-slate-900">Meja Verifikasi Pengembalian Sarana (Check-In Desk)</h3>
            <a href="peminjaman.html" class="text-[11px] font-bold text-[#0d7a5f] hover:underline">Buka Sirkulasi &rarr;</a>
          </div>
          <div id="petugas-live-checkin-desk" class="space-y-3">
            <div class="p-4 rounded-xl bg-[#f8fafd] border border-slate-200/80 text-xs text-slate-500">Memuat antrean verifikasi pengembalian sarana...</div>
          </div>
        </div>

        <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3.5 shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-sm font-extrabold text-slate-900">Tiket Perbaikan Ditugaskan Ke Anda</h3>
            <a href="tiket.html" class="text-[11px] font-bold text-[#1246b5] hover:underline">Papan Kanban &rarr;</a>
          </div>

          <div id="petugas-live-tickets" class="space-y-2.5">
            <div class="p-3.5 rounded-xl bg-[#f8fafd] border border-slate-200/80 text-xs text-slate-500">Memuat daftar tiket perbaikan...</div>
          </div>

          <div class="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-[11px] text-rose-900 space-y-1">
            <div class="font-extrabold text-rose-800">Batasan Wewenang (RBAC Petugas):</div>
            <ul class="space-y-1 leading-relaxed text-rose-700">
              <li>&bull; Petugas TIDAK DIIZINKAN menghapus master aset dari database sistem.</li>
              <li>&bull; Petugas TIDAK MEMILIKI tombol Approve pinjaman sarana (wewenang Pimpinan/Admin).</li>
              <li>&bull; Hasil verifikasi kondisi fisik barang otomatis tersimpan ke kartu mutasi dan log peminjaman.</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  } else if (role === 'pimpinan') {
    // ================= PDF PAGE 3: DASHBOARD EKSEKUTIF & OTORISASI PIMPINAN =================
    root.innerHTML = `
      <!-- Welcome Banner -->
      <div class="bg-[#f5f0ff] border border-purple-200 rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-lg font-extrabold text-[#4c1d95]">Selamat Pagi, ${user.nama || 'Pimpinan Institusi'} (Pimpinan Institusi)</h1>
          <p class="text-xs text-purple-700 font-medium mt-1">Otorisasi Eksekutif: Memantau nilai &amp; okupansi sarpras, menyetujui peminjaman strategis, &amp; mengesahkan laporan audit.</p>
        </div>
        <a href="laporan.html" class="px-5 py-2.5 rounded-xl bg-[#6d28d9] hover:bg-purple-800 text-white text-xs font-extrabold transition shadow-xs">Pengesahan Dokumen (2)</a>
      </div>

      <!-- 4 KPI Cards -->
      <div id="kpi-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <article class="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between shadow-2xs">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs text-slate-500 font-medium">Total Valuasi Aset</span>
              <h2 id="pimpinan-kpi-val" class="text-2xl font-extrabold text-slate-900 mt-1">...</h2>
            </div>
            <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center"><i data-lucide="building-2" class="w-4 h-4"></i></div>
          </div>
          <div class="mt-4 flex items-center justify-between text-[11px]">
            <span id="pimpinan-kpi-val-sub" class="text-slate-500 font-medium">Memuat inventaris...</span>
            <span class="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">Audit BPK Clean</span>
          </div>
        </article>

        <article class="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between shadow-2xs">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs text-slate-500 font-medium">Kesiapan Inventaris</span>
              <h2 id="pimpinan-kpi-ready" class="text-2xl font-extrabold text-slate-900 mt-1">...</h2>
            </div>
            <div class="w-9 h-9 rounded-xl bg-blue-50 text-[#1246b5] flex items-center justify-center"><i data-lucide="star" class="w-4 h-4"></i></div>
          </div>
          <div class="mt-4 flex items-center justify-between text-[11px]">
            <span class="text-slate-500 font-medium">Aset Siap Pakai</span>
            <span class="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#1246b5] font-bold">Efisiensi Tinggi</span>
          </div>
        </article>

        <article class="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between shadow-2xs">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs text-slate-500 font-medium">Otorisasi Pinjam</span>
              <h2 id="pimpinan-kpi-pending" class="text-2xl font-extrabold text-slate-900 mt-1">...</h2>
            </div>
            <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center"><i data-lucide="clipboard-list" class="w-4 h-4"></i></div>
          </div>
          <div class="mt-4 flex items-center justify-between text-[11px]">
            <span class="text-slate-500 font-medium">Menunggu SK Pimpinan</span>
            <span class="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold">Perlu Otorisasi</span>
          </div>
        </article>

        <article class="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between shadow-2xs">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs text-slate-500 font-medium">Serapan Biaya Servis</span>
              <h2 id="pimpinan-kpi-cost" class="text-2xl font-extrabold text-slate-900 mt-1">...</h2>
            </div>
            <div class="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center"><i data-lucide="dollar-sign" class="w-4 h-4"></i></div>
          </div>
          <div class="mt-4 flex items-center justify-between text-[11px]">
            <span id="pimpinan-kpi-cost-sub" class="text-slate-500 font-medium">Memuat tiket...</span>
            <span class="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold">Realisasi Servis</span>
          </div>
        </article>
      </div>

      <!-- Middle Row -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 class="text-sm font-extrabold text-slate-900">Grafik Serapan Anggaran Pemeliharaan Sarpras (2026)</h3>
              <p class="text-[11px] text-slate-500 mt-0.5">Perbandingan Pagu Anggaran vs Realisasi Pengeluaran per Kuartal</p>
            </div>
            <div class="flex items-center gap-4 text-[11px]">
              <span class="flex items-center gap-1.5 text-slate-600 font-medium"><span class="w-2.5 h-2.5 rounded-xs bg-slate-300"></span>Pagu Alokasi</span>
              <span class="flex items-center gap-1.5 text-slate-600 font-medium"><span class="w-2.5 h-2.5 rounded-xs bg-[#6d28d9]"></span>Realisasi Terserap</span>
            </div>
          </div>
          <div class="mt-6 pt-4 border-t border-slate-100 grid grid-cols-4 gap-6 items-end h-44 px-6">
            ${[
              { q: 'Q1 (Jan-Mar)', p: 88, r: 80, label: '91%' },
              { q: 'Q2 (Apr-Jun)', p: 88, r: 84, label: '95%' },
              { q: 'Q3 (Jul-Sep)', p: 96, r: 89, label: '93%' },
              { q: 'Q4 (Okt-Des)', p: 96, r: 27, label: '27%' }
            ].map(d => `
              <div class="flex flex-col items-center gap-2 h-full justify-end">
                <div class="flex items-end gap-2 w-full justify-center h-36">
                  <div class="w-6 rounded-t-md bg-slate-200" style="height:${d.p}%"></div>
                  <div class="w-6 rounded-t-md bg-[#6d28d9] relative flex justify-center" style="height:${d.r}%">
                    <span class="absolute -top-4 text-[10px] font-extrabold text-[#6d28d9]">${d.label}</span>
                  </div>
                </div>
                <span class="text-[10px] font-extrabold text-slate-700">${d.q}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <h3 class="text-sm font-extrabold text-slate-900">Distribusi Nilai Aset per Fakultas</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Total Aset Tercatat: Rp 4.850.000.000</p>
          </div>
          <div class="space-y-4 my-auto pt-4">
            <div>
              <div class="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>Fakultas Teknik</span>
                <span class="text-slate-500 font-semibold">42% (Rp 2,03 M)</span>
              </div>
              <div class="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden"><div class="h-full rounded-full bg-[#1246b5]" style="width:72%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>Fakultas MIPA &amp; Kedokteran</span>
                <span class="text-slate-500 font-semibold">28% (Rp 1,35 M)</span>
              </div>
              <div class="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden"><div class="h-full rounded-full bg-[#10b981]" style="width:52%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>Fakultas Ilmu Komputer</span>
                <span class="text-slate-500 font-semibold">18% (Rp 873 Jt)</span>
              </div>
              <div class="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden"><div class="h-full rounded-full bg-[#6d28d9]" style="width:36%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>Gedung Rektorat &amp; Umum</span>
                <span class="text-slate-500 font-semibold">12% (Rp 582 Jt)</span>
              </div>
              <div class="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden"><div class="h-full rounded-full bg-[#f59e0b]" style="width:24%"></div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Otorisasi Strategis (Live SQLite) + Pengesahan Dokumen -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3.5 shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-sm font-extrabold text-slate-900">Otorisasi Peminjaman Fasilitas Strategis Kampus</h3>
            <a href="peminjaman.html" class="text-[11px] font-bold text-[#6d28d9] hover:underline">Lihat Semua &rarr;</a>
          </div>
          <div id="pimpinan-live-approval-queue" class="space-y-3">
            <div class="p-4 rounded-xl bg-[#f8fafd] border border-slate-200/80 text-xs text-slate-500">Memuat antrean otorisasi peminjaman...</div>
          </div>
        </div>

        <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
          <h3 class="text-sm font-extrabold text-slate-900">Pengesahan Dokumen Audit Sarpras</h3>

          <div class="p-4 rounded-xl bg-[#fdf4ff] border border-purple-200 space-y-3">
            <div>
              <div class="text-xs font-extrabold text-[#6d28d9]">Dokumen Menunggu Pengesahan:</div>
              <div class="text-xs text-slate-800 font-semibold mt-1">Laporan Rekapitulasi Audit Fisik Sarpras Q3-2026.pdf (Terverifikasi BPK &amp; SPI)</div>
            </div>
            <button type="button" onclick="handlePdfSignDocument(this)" class="w-full py-3 rounded-xl bg-[#6d28d9] hover:bg-purple-800 text-white text-xs font-extrabold cursor-pointer transition">Sahkan Dokumen (Tanda Tangan Digital)</button>
          </div>

          <div class="p-4 rounded-xl bg-[#f8fafd] border border-slate-200/80 space-y-2">
            <div class="text-xs font-extrabold text-slate-900">Arsip Dokumen Tersahkan Bulan Ini:</div>
            <ul class="text-[11px] text-emerald-700 font-medium space-y-1.5">
              <li>&#10003; STTA-2026-088: Serah Terima Bus Kampus (16 Nov)</li>
              <li>&#10003; BAST-Q2-2026: Rekapitulasi Fisik MIPA (12 Nov)</li>
              <li>&#10003; SK-AULA-041: Izin Graha Mahasiswa Dies Natalis</li>
              <li>&#10003; BAST-TI-019: Hibah 40 Unit PC VR Asus Lab TI</li>
            </ul>
          </div>
          <div class="text-[11px] text-slate-400">Tervalidasi Tanda Tangan Digital BSrE BSSN &bull; Keaslian dokumen terjamin.</div>
        </div>
      </div>
    `;
  } else {
    // ================= PDF PAGE 4: PORTAL LAYANAN MANDIRI PEMINJAMAN SARPRAS (PEMINJAM) =================
    const marker = document.createElement('div');
    marker.id = 'simas-peminjam-portal';
    marker.className = 'hidden';
    mainEl.appendChild(marker);

    root.innerHTML = `
      <!-- Welcome Banner -->
      <div class="bg-[#eef4ff] border border-blue-200/90 rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-lg font-extrabold text-[#0f2a71]">Selamat Datang di Portal Mandiri, ${user.nama ? user.nama.split(',')[0] : 'Pengguna'}!</h1>
          <p class="text-xs text-[#1d4ed8] font-medium mt-1">Layanan Mandiri: Ajukan pinjaman sarana perkuliahan &amp; booking ruangan kosong tanpa birokrasi rumit.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2.5">
          <a href="tiket.html?lapor=1" class="px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 border border-amber-300 text-amber-800 text-xs font-extrabold transition shadow-2xs inline-flex items-center gap-1.5">
            <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i>
            <span>Lapor Kerusakan</span>
          </a>
          <a href="peminjaman.html" class="px-5 py-2.5 rounded-xl bg-[#1246b5] hover:bg-blue-800 text-white text-xs font-extrabold transition shadow-xs">+ Ajukan Peminjaman Baru</a>
        </div>
      </div>

      <!-- 4 KPI Cards -->
      <div id="kpi-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <article class="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between shadow-2xs">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs text-slate-500 font-medium">Sarana Aktif Dipinjam</span>
              <h2 id="peminjam-kpi-active" class="text-2xl font-extrabold text-slate-900 mt-1">...</h2>
            </div>
            <div class="w-9 h-9 rounded-xl bg-blue-50 text-[#1246b5] flex items-center justify-center"><i data-lucide="archive" class="w-4 h-4"></i></div>
          </div>
          <div class="mt-4 flex items-center justify-between text-[11px]">
            <span id="peminjam-kpi-active-sub" class="text-slate-500 font-medium truncate max-w-[140px]">Memuat data...</span>
            <span class="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#1246b5] font-bold shrink-0">Sedang Digunakan</span>
          </div>
        </article>

        <article class="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between shadow-2xs">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs text-slate-500 font-medium">Dalam Proses Review</span>
              <h2 id="peminjam-kpi-review" class="text-2xl font-extrabold text-slate-900 mt-1">...</h2>
            </div>
            <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center"><i data-lucide="clock" class="w-4 h-4"></i></div>
          </div>
          <div class="mt-4 flex items-center justify-between text-[11px]">
            <span id="peminjam-kpi-review-sub" class="text-slate-500 font-medium truncate max-w-[140px]">Memuat antrean...</span>
            <span class="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold shrink-0">Menunggu Review</span>
          </div>
        </article>

        <article class="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between shadow-2xs">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs text-slate-500 font-medium">Tenggat Kembali</span>
              <h2 id="peminjam-kpi-due" class="text-2xl font-extrabold text-slate-900 mt-1">...</h2>
            </div>
            <div class="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center"><i data-lucide="calendar-clock" class="w-4 h-4"></i></div>
          </div>
          <div class="mt-4 flex items-center justify-between text-[11px] gap-2">
            <span id="peminjam-kpi-due-sub" class="text-slate-500 font-medium truncate max-w-[140px]">Memuat tenggat...</span>
            <span id="peminjam-kpi-due-badge" class="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold shrink-0">Cek Jadwal</span>
          </div>
        </article>

        <article class="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col justify-between shadow-2xs">
          <div class="flex items-start justify-between">
            <div>
              <span class="text-xs text-slate-500 font-medium">Skor Kepatuhan Saya</span>
              <h2 class="text-2xl font-extrabold text-slate-900 mt-1">100% Sempurna</h2>
            </div>
            <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center"><i data-lucide="star" class="w-4 h-4"></i></div>
          </div>
          <div class="mt-4 flex items-center justify-between text-[11px] gap-2">
            <span id="peminjam-kpi-score-sub" class="text-slate-500 font-medium">Memuat riwayat...</span>
            <span class="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold shrink-0">Pemohon Terpercaya</span>
          </div>
        </article>
      </div>

      <!-- Middle Row: Grafik Frekuensi + Live Tracking -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 class="text-sm font-extrabold text-slate-900">Grafik Frekuensi Peminjaman Mandiri Saya (6 Bulan Terakhir)</h3>
              <p class="text-[11px] text-slate-500 mt-0.5">Aktivitas pengajuan sarana untuk perkuliahan &amp; riset laboratorium</p>
            </div>
            <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">Skor Tertib: 100%</span>
          </div>
          <div class="mt-6 pt-4 border-t border-slate-100 grid grid-cols-6 gap-4 items-end h-44 px-4">
            ${[
              { m: 'Juni', h: 52, label: '3 Pinjam', active: false },
              { m: 'Juli', h: 36, label: '2 Pinjam', active: false },
              { m: 'Agustus', h: 72, label: '4 Pinjam', active: false },
              { m: 'September', h: 52, label: '3 Pinjam', active: false },
              { m: 'Oktober', h: 90, label: '5 Pinjam', active: false },
              { m: 'November', h: 40, label: '2 Aktif', active: true }
            ].map(d => `
              <div class="flex flex-col items-center gap-2 h-full justify-end">
                <div class="flex items-end w-full justify-center h-36">
                  <div class="w-10 rounded-t-md ${d.active ? 'bg-[#1246b5]' : 'bg-blue-400'} relative flex justify-center" style="height:${d.h}%">
                    <span class="absolute -top-4 text-[10px] font-extrabold text-[#1246b5] whitespace-nowrap">${d.label}</span>
                  </div>
                </div>
                <span class="text-[10px] font-extrabold text-slate-700">${d.m}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div id="peminjam-live-tracking-card" class="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <div>
              <h3 class="text-sm font-extrabold text-slate-900">Live Tracking Pengajuan Saya</h3>
              <p class="text-[11px] text-slate-500 mt-0.5">Memuat daftar pengajuan peminjaman Anda...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Sarana Sedang Dipinjam + Katalog Siap Pakai -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3.5 shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-sm font-extrabold text-slate-900">Sarana yang Sedang Saya Pinjam Saat Ini</h3>
            <a href="peminjaman.html" class="text-[11px] font-bold text-[#1246b5] hover:underline">Kelola di Peminjaman Saya &rarr;</a>
          </div>

          <div id="peminjam-active-loans-list" class="space-y-3">
            <div class="p-4 rounded-xl bg-[#f8fafd] border border-slate-200/80 text-xs text-slate-500">
              Memuat daftar sarana yang sedang Anda pinjam...
            </div>
          </div>

          <div id="peminjam-quota-banner" class="p-4 rounded-xl bg-[#ecfdf5] border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
            <div class="font-extrabold text-emerald-800">Status Kuota Peminjaman Aktif: 0 dari 5 Sarana Terpakai</div>
            <ul class="space-y-1 text-emerald-700">
              <li>&bull; Hak Akses Peminjam: Maksimal 5 unit inventaris sarana pendidikan dalam 1 kurun waktu peminjaman.</li>
              <li>&bull; Alur Pengembalian: Klik tombol <strong>Kembalikan Barang</strong> saat selesai digunakan, lalu Petugas Sarpras akan memverifikasi fisik unit.</li>
              <li>&bull; Layanan Bantuan: Hubungi loket Sarpras jika memerlukan perpanjangan waktu atau bantuan angkut barang berat.</li>
            </ul>
          </div>
        </div>

        <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3 shadow-2xs">
          <h3 class="text-sm font-extrabold text-slate-900">Katalog Sarpras Siap Pakai Hari Ini</h3>

          ${[
            { name: 'Ruang Seminar 1 (Gedung TI)', sub: 'Kapasitas 60 Org • AC & Audio', st: '✓ Tersedia Sekarang', code: 'SEM-TI-001', lokasi: 'Gedung TI Lt. 1' },
            { name: 'Sound Portable Yamaha 680W', sub: '2 Mic Wireless + Mixer 10-Ch', st: '✓ Ready di Sarpras', code: 'AST-UM-2024-045', lokasi: 'Gudang Sarpras Pusat - Rektorat Lt. 1' },
            { name: 'Laptop ASUS ROG Strix G16', sub: 'Core i9, 32GB RAM, RTX 4070', st: '✓ Ready di Lab 1', code: 'AST-TI-2024-001', lokasi: 'Lab Multimedia Lt. 3 - Gedung TI' },
            { name: 'Kamera Sony A6400 Kit 4K', sub: 'Lensa 16-50mm + Tripod', st: '✓ Ready di Sarpras', code: 'AST-TI-2024-012', lokasi: 'Gudang Sarpras Pusat' }
          ].map(item => `
            <div class="p-3.5 rounded-xl bg-[#f8fafd] border border-slate-200/80 flex items-center justify-between gap-3">
              <div>
                <div class="text-xs font-extrabold text-slate-900">${item.name}</div>
                <div class="text-[11px] text-slate-500 mt-0.5">${item.sub}</div>
                <div class="text-[10px] font-bold text-emerald-700 mt-0.5">${item.st}</div>
              </div>
              <a href="peminjaman.html?kode=${encodeURIComponent(item.code)}&nama=${encodeURIComponent(item.name)}&lokasi=${encodeURIComponent(item.lokasi)}" class="px-4 py-2 rounded-xl bg-[#1246b5] hover:bg-blue-800 text-white text-xs font-extrabold shrink-0 transition">+ Pinjam</a>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (window.lucide) {
    lucide.createIcons();
  }

  if (role === 'admin') {
    loadAdminPendingRegistrations();
    loadAdminDashboardLiveData();
  }
  if (role === 'petugas') {
    loadPetugasDashboardLiveData();
  }
  if (role === 'pimpinan') {
    loadPimpinanDashboardLiveData();
  }
  if (role === 'peminjam') {
    loadPeminjamDashboardLiveTracking(user);
  }
}

async function loadAdminDashboardLiveData() {
  try {
    const [statsRes, loansRes, ticketsRes, logsRes] = await Promise.all([
      fetch('/api/dashboard/stats', { headers: { Accept: 'application/json' } }).then(r => r.json()).catch(() => null),
      fetch('/api/loans', { headers: { Accept: 'application/json' } }).then(r => r.json()).catch(() => null),
      fetch('/api/tickets', { headers: { Accept: 'application/json' } }).then(r => r.json()).catch(() => null),
      fetch('/api/activity-logs', { headers: { Accept: 'application/json' } }).then(r => r.json()).catch(() => null)
    ]);

    const stats = statsRes && statsRes.success ? statsRes.data : null;
    const loans = (loansRes && loansRes.success && Array.isArray(loansRes.data)) ? loansRes.data : [];
    const tickets = (ticketsRes && ticketsRes.success && Array.isArray(ticketsRes.data)) ? ticketsRes.data : [];
    const logs = (logsRes && logsRes.success && Array.isArray(logsRes.data)) ? logsRes.data : [];

    const pendingLoans = loans.filter(l => {
      const s = String(l.status || '').toLowerCase();
      return s.includes('menunggu') || s.includes('diajukan');
    });
    const activeTickets = tickets.filter(t => String(t.status || '').toLowerCase() !== 'selesai');
    const totalTicketCost = tickets.reduce((s, t) => s + (Number(t.cost) || 0), 0);

    if (stats) {
      const elA = document.getElementById('admin-kpi-assets');
      const elASub = document.getElementById('admin-kpi-assets-sub');
      const elR = document.getElementById('admin-kpi-ready');
      const elRSub = document.getElementById('admin-kpi-ready-sub');
      if (elA) elA.textContent = `${stats.totalAssets} Unit`;
      if (elASub) elASub.textContent = `Valuasi Rp ${Number(stats.totalValue || 0).toLocaleString('id-ID')}`;
      if (elR) elR.textContent = `${stats.readyAssets} / ${stats.totalAssets}`;
      if (elRSub) {
        const pct = stats.totalAssets > 0 ? Math.round((stats.readyAssets / stats.totalAssets) * 100) : 0;
        elRSub.textContent = `${pct}% Tersedia • ${stats.loanedAssets || 0} Dipinjam`;
      }
    }

    const elL = document.getElementById('admin-kpi-loans');
    const elLSub = document.getElementById('admin-kpi-loans-sub');
    if (elL) elL.textContent = `${loans.length} Transaksi`;
    if (elLSub) elLSub.textContent = `${pendingLoans.length} Butuh Approval`;

    const elT = document.getElementById('admin-kpi-tickets');
    const elTSub = document.getElementById('admin-kpi-tickets-sub');
    if (elT) elT.textContent = `${activeTickets.length} Aktif`;
    if (elTSub) elTSub.textContent = `Total Biaya Rp ${totalTicketCost.toLocaleString('id-ID')}`;

    const approvalContainer = document.getElementById('admin-live-approval-queue');
    if (approvalContainer) {
      if (pendingLoans.length === 0) {
        approvalContainer.innerHTML = `
          <div class="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center text-xs font-semibold text-emerald-800">
            ✓ Semua pengajuan peminjaman telah diproses. Tidak ada antrean menunggu persetujuan.
          </div>
        `;
      } else {
        approvalContainer.innerHTML = pendingLoans.slice(0, 5).map(l => {
          const safeTitle = escapeTrackingHtml(l.asset_nama || 'Sarana Kampus').replace(/'/g, "\\'");
          return `
            <div class="pdf-approval-card p-4 rounded-xl bg-[#f8fafd] border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div class="text-xs font-extrabold text-slate-900">${escapeTrackingHtml(l.peminjam_nama || 'Pemohon')} <span class="font-normal text-slate-500">(${escapeTrackingHtml(l.peminjam_nip || 'Civitas')})</span></div>
                <div class="text-xs font-bold text-[#1246b5] mt-0.5">Sarana: ${escapeTrackingHtml(l.asset_nama || '-')}</div>
                <div class="text-[11px] text-slate-500 mt-0.5">Jadwal: ${escapeTrackingHtml(l.tgl_pinjam || '-')} s/d ${escapeTrackingHtml(l.tgl_kembali || '-')} &bull; ${escapeTrackingHtml(l.keperluan || '-')}</div>
              </div>
              <div class="pdf-approval-actions flex items-center gap-2">
                <button type="button" onclick="handleLiveLoanApproval(${Number(l.id)}, 'reject', '${safeTitle}')" class="px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-extrabold cursor-pointer transition">Tolak</button>
                <button type="button" onclick="handleLiveLoanApproval(${Number(l.id)}, 'approve', '${safeTitle}')" class="px-4 py-2 rounded-xl bg-[#1246b5] hover:bg-blue-800 text-white text-xs font-extrabold cursor-pointer transition">Setujui (SPK)</button>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    const ticketsContainer = document.getElementById('admin-live-tickets');
    if (ticketsContainer) {
      const showT = activeTickets.length > 0 ? activeTickets.slice(0, 2) : tickets.slice(0, 2);
      ticketsContainer.innerHTML = showT.length === 0
        ? `<div class="p-3.5 rounded-xl bg-[#f8fafd] border border-slate-200/80 text-xs text-slate-500">Belum ada tiket perbaikan tercatat.</div>`
        : showT.map(t => `
          <a href="tiket.html" class="block p-3.5 rounded-xl bg-[#f8fafd] border border-slate-200/80 hover:border-blue-300 transition">
            <div class="flex items-center justify-between text-[11px] font-extrabold">
              <span class="text-[#1246b5]">${escapeTrackingHtml(t.kode || 'TKT')}</span>
              <span class="text-amber-700 uppercase">${escapeTrackingHtml(t.status || 'baru')}</span>
            </div>
            <div class="text-xs font-extrabold text-slate-900 mt-1">${escapeTrackingHtml(t.title || '-')}</div>
            <div class="flex items-center justify-between text-[11px] mt-1">
              <span class="text-slate-500">Teknisi: ${escapeTrackingHtml(t.tech_name || 'Tim Sarpras')}</span>
              <span class="font-extrabold text-slate-900">Rp ${Number(t.cost || 0).toLocaleString('id-ID')}</span>
            </div>
          </a>
        `).join('');
    }

    const logsEl = document.getElementById('admin-live-audit-log');
    if (logsEl) {
      const filteredLogs = logs.filter(lg => lg.action !== 'Inisialisasi Database').slice(0, 5);
      logsEl.innerHTML = filteredLogs.length === 0
        ? '<li>&bull; Belum ada catatan audit aktivitas terbaru.</li>'
        : filteredLogs.map(lg => `<li>&bull; <strong>${escapeTrackingHtml(lg.user_name || 'Sistem')}</strong>: ${escapeTrackingHtml(lg.details || lg.action || '-')}</li>`).join('');
    }
  } catch (err) {
    console.warn('Admin live dashboard error:', err.message);
  }
}

async function loadPetugasDashboardLiveData() {
  try {
    const [statsRes, loansRes, ticketsRes] = await Promise.all([
      fetch('/api/dashboard/stats', { headers: { Accept: 'application/json' } }).then(r => r.json()).catch(() => null),
      fetch('/api/loans', { headers: { Accept: 'application/json' } }).then(r => r.json()).catch(() => null),
      fetch('/api/tickets', { headers: { Accept: 'application/json' } }).then(r => r.json()).catch(() => null)
    ]);

    const stats = statsRes && statsRes.success ? statsRes.data : null;
    const loans = (loansRes && loansRes.success && Array.isArray(loansRes.data)) ? loansRes.data : [];
    const tickets = (ticketsRes && ticketsRes.success && Array.isArray(ticketsRes.data)) ? ticketsRes.data : [];

    const activeTickets = tickets.filter(t => String(t.status || '').toLowerCase() !== 'selesai');
    const urgentCount = activeTickets.filter(t => ['URGENT', 'TINGGI'].includes(String(t.priority || '').toUpperCase())).length;
    const totalCost = tickets.reduce((s, t) => s + (Number(t.cost) || 0), 0);

    const checkinLoans = loans.filter(l => {
      const s = String(l.status || '').toLowerCase();
      return s.includes('verifikasi') || s.includes('dipinjam') || s.includes('setuju') || s.includes('aktif');
    }).sort((a, b) => {
      const aV = String(a.status || '').toLowerCase().includes('verifikasi') ? 0 : 1;
      const bV = String(b.status || '').toLowerCase().includes('verifikasi') ? 0 : 1;
      return aV - bV || (b.id - a.id);
    });

    const elT = document.getElementById('petugas-kpi-tickets');
    const elTSub = document.getElementById('petugas-kpi-tickets-sub');
    if (elT) elT.textContent = `${activeTickets.length} Tiket`;
    if (elTSub) elTSub.textContent = `${urgentCount} Prioritas Mendesak`;

    const elC = document.getElementById('petugas-kpi-checkin');
    const elCSub = document.getElementById('petugas-kpi-checkin-sub');
    const verifyOnly = checkinLoans.filter(l => String(l.status || '').toLowerCase().includes('verifikasi')).length;
    if (elC) elC.textContent = `${checkinLoans.length} Item`;
    if (elCSub) elCSub.textContent = `${verifyOnly} Siap Verifikasi Kembali`;

    const elM = document.getElementById('petugas-kpi-maint');
    if (elM) elM.textContent = `${stats ? (stats.maintenanceAssets || 0) : activeTickets.length} Unit`;

    const elCost = document.getElementById('petugas-kpi-cost');
    if (elCost) elCost.textContent = `Rp ${totalCost.toLocaleString('id-ID')}`;

    const deskEl = document.getElementById('petugas-live-checkin-desk');
    if (deskEl) {
      if (checkinLoans.length === 0) {
        deskEl.innerHTML = `
          <div class="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center text-xs font-semibold text-emerald-800">
            ✓ Tidak ada barang sedang dipinjam atau menunggu verifikasi pengembalian saat ini.
          </div>
        `;
      } else {
        deskEl.innerHTML = checkinLoans.slice(0, 5).map(l => {
          const isVerify = String(l.status || '').toLowerCase().includes('verifikasi');
          const safeName = escapeTrackingHtml(l.asset_nama || 'Sarana Kampus').replace(/'/g, "\\'");
          return `
            <div class="p-4 rounded-xl bg-[#f8fafd] border ${isVerify ? 'border-purple-300' : 'border-slate-200/80'} flex flex-wrap items-center justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-extrabold text-slate-900">${escapeTrackingHtml(l.peminjam_nama || 'Pemohon')}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isVerify ? 'bg-purple-100 text-purple-800' : 'bg-blue-50 text-blue-700'}">${isVerify ? 'MENUNGGU CEK KEMBALI' : 'SEDANG DIPINJAM'}</span>
                </div>
                <div class="text-xs font-bold text-[#0d7a5f] mt-0.5">Barang: ${escapeTrackingHtml(l.asset_nama || '-')} (${escapeTrackingHtml(l.kode || '-')})</div>
                <div class="text-[11px] text-slate-500 mt-0.5">Tenggat: ${escapeTrackingHtml(l.tgl_kembali || '-')} ${l.catatan ? `• Catatan: ${escapeTrackingHtml(l.catatan)}` : ''}</div>
              </div>
              <button type="button" onclick="handleLivePetugasCheckin(${Number(l.id)}, '${safeName}', 'ok')" class="px-4 py-2 rounded-xl bg-[#0d7a5f] hover:bg-emerald-800 text-white text-xs font-extrabold cursor-pointer transition">Verifikasi Kembali ✓</button>
            </div>
          `;
        }).join('');
      }
    }

    const tEl = document.getElementById('petugas-live-tickets');
    if (tEl) {
      tEl.innerHTML = activeTickets.length === 0
        ? `<div class="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs font-semibold text-emerald-800">✓ Semua tiket perbaikan telah diselesaikan.</div>`
        : activeTickets.slice(0, 3).map(t => `
          <div class="p-3.5 rounded-xl bg-[#f8fafd] border border-slate-200/80 flex items-center justify-between gap-3">
            <div>
              <div class="text-[11px] font-extrabold text-[#0d7a5f]">${escapeTrackingHtml(t.kode || 'TKT')}</div>
              <div class="text-xs font-extrabold text-slate-900 mt-0.5">${escapeTrackingHtml(t.title || '-')}</div>
              <div class="text-[11px] text-slate-500 mt-0.5">${escapeTrackingHtml(t.location || t.gedung || '-')}</div>
            </div>
            <div class="text-right shrink-0">
              <div class="text-[10px] font-extrabold text-slate-700 uppercase mb-1">${escapeTrackingHtml(t.status || 'baru')}</div>
              <a href="tiket.html" class="inline-block px-3.5 py-1.5 rounded-lg bg-[#1246b5] text-white text-[11px] font-bold">Update</a>
            </div>
          </div>
        `).join('');
    }
  } catch (err) {
    console.warn('Petugas live dashboard error:', err.message);
  }
}

async function loadPimpinanDashboardLiveData() {
  try {
    const [statsRes, loansRes, ticketsRes] = await Promise.all([
      fetch('/api/dashboard/stats', { headers: { Accept: 'application/json' } }).then(r => r.json()).catch(() => null),
      fetch('/api/loans', { headers: { Accept: 'application/json' } }).then(r => r.json()).catch(() => null),
      fetch('/api/tickets', { headers: { Accept: 'application/json' } }).then(r => r.json()).catch(() => null)
    ]);

    const stats = statsRes && statsRes.success ? statsRes.data : null;
    const loans = (loansRes && loansRes.success && Array.isArray(loansRes.data)) ? loansRes.data : [];
    const tickets = (ticketsRes && ticketsRes.success && Array.isArray(ticketsRes.data)) ? ticketsRes.data : [];

    const pendingLoans = loans.filter(l => {
      const s = String(l.status || '').toLowerCase();
      return s.includes('menunggu') || s.includes('diajukan');
    });
    const totalCost = tickets.reduce((s, t) => s + (Number(t.cost) || 0), 0);

    if (stats) {
      const elVal = document.getElementById('pimpinan-kpi-val');
      const elValSub = document.getElementById('pimpinan-kpi-val-sub');
      const elReady = document.getElementById('pimpinan-kpi-ready');
      if (elVal) elVal.textContent = `Rp ${Number(stats.totalValue || 0).toLocaleString('id-ID')}`;
      if (elValSub) elValSub.textContent = `${stats.totalAssets || 0} Unit Tercatat`;
      if (elReady) {
        const pct = stats.totalAssets > 0 ? ((stats.readyAssets / stats.totalAssets) * 100).toFixed(1) : '0';
        elReady.textContent = `${pct}%`;
      }
    }

    const elPend = document.getElementById('pimpinan-kpi-pending');
    if (elPend) elPend.textContent = `${pendingLoans.length} Permohonan`;

    const elCost = document.getElementById('pimpinan-kpi-cost');
    const elCostSub = document.getElementById('pimpinan-kpi-cost-sub');
    if (elCost) elCost.textContent = `Rp ${totalCost.toLocaleString('id-ID')}`;
    if (elCostSub) elCostSub.textContent = `${tickets.length} Tiket Pemeliharaan`;

    const queueEl = document.getElementById('pimpinan-live-approval-queue');
    if (queueEl) {
      if (pendingLoans.length === 0) {
        queueEl.innerHTML = `
          <div class="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center text-xs font-semibold text-emerald-800">
            ✓ Tidak ada permohonan peminjaman strategis yang menunggu persetujuan saat ini.
          </div>
        `;
      } else {
        queueEl.innerHTML = pendingLoans.slice(0, 5).map(l => {
          const safeTitle = escapeTrackingHtml(l.asset_nama || 'Sarana Kampus').replace(/'/g, "\\'");
          return `
            <div class="pdf-approval-card p-4 rounded-xl bg-[#f8fafd] border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div class="text-xs font-extrabold text-[#4c1d95]">${escapeTrackingHtml(l.peminjam_nama || 'Pemohon')} (${escapeTrackingHtml(l.peminjam_nip || 'Civitas')})</div>
                <div class="text-xs font-bold text-slate-900 mt-0.5">Sarana: ${escapeTrackingHtml(l.asset_nama || '-')}</div>
                <div class="text-[11px] text-slate-500 mt-0.5">Keperluan: ${escapeTrackingHtml(l.keperluan || '-')} &bull; ${escapeTrackingHtml(l.tgl_pinjam || '-')} s/d ${escapeTrackingHtml(l.tgl_kembali || '-')}</div>
              </div>
              <div class="pdf-approval-actions flex items-center gap-2">
                <button type="button" onclick="handleLiveLoanApproval(${Number(l.id)}, 'reject', '${safeTitle}')" class="px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-extrabold cursor-pointer transition">Tolak</button>
                <button type="button" onclick="handleLiveLoanApproval(${Number(l.id)}, 'approve', '${safeTitle}')" class="px-4 py-2 rounded-xl bg-[#6d28d9] hover:bg-purple-800 text-white text-xs font-extrabold cursor-pointer transition">Setujui (SK)</button>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  } catch (err) {
    console.warn('Pimpinan live dashboard error:', err.message);
  }
}

async function loadAdminPendingRegistrations() {
  const container = document.getElementById('admin-pending-acc-container');
  if (!container) return;

  const currentUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  if (!currentUser || currentUser.role !== 'admin') {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  try {
    const res = await fetch('/api/users/pending', {
      headers: { 'Accept': 'application/json', 'X-User-Role': 'admin' }
    });
    const json = await res.json();
    const pendingList = (json && json.success && Array.isArray(json.data)) ? json.data : [];

    if (pendingList.length === 0) {
      container.classList.add('hidden');
      container.innerHTML = '';
      if (typeof window.refreshPendingUsersBadge === 'function') {
        window.refreshPendingUsersBadge();
      }
      return;
    }

    const previewItems = pendingList.slice(0, 3);
    container.classList.remove('hidden');
    container.innerHTML = `
      <div class="bg-amber-50/90 border border-amber-300/90 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <i data-lucide="user-check" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-sm font-extrabold text-amber-950">Antrean ACC Pendaftaran Akun Baru</h2>
                <span class="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-extrabold">${pendingList.length} Menunggu ACC</span>
              </div>
              <p class="text-[11px] text-amber-800 font-medium mt-0.5">Hanya Admin Sarpras yang berwenang menyetujui atau menolak aktivasi akun pengguna baru.</p>
            </div>
          </div>
          <a href="pengguna.html" class="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100/70 border border-amber-300 text-amber-900 text-xs font-extrabold transition shrink-0">
            Kelola Semua (${pendingList.length}) &rarr;
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          ${previewItems.map(u => {
            const safeNama = String(u.nama || '').replace(/'/g, "\\'");
            const accType = String(u.account_type || '').toLowerCase();
            const badgeText = accType === 'dosen' ? 'Dosen (Peminjam)' : (accType === 'mahasiswa' ? 'Mahasiswa (Peminjam)' : 'Peminjam');
            const idPrefix = accType === 'dosen' ? 'NIP' : (accType === 'mahasiswa' ? 'NIM' : 'ID');
            return `
              <div class="bg-white rounded-xl border border-amber-200/80 p-3.5 flex flex-col justify-between gap-3">
                <div>
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-xs font-extrabold text-slate-900 truncate">${u.nama || '-'}</span>
                    <span class="px-2 py-0.5 rounded-md bg-blue-50 text-[#0f2a71] text-[10px] font-bold shrink-0">${badgeText}</span>
                  </div>
                  <div class="text-[11px] text-slate-500 mt-1 truncate">
                    <span class="font-mono font-bold text-slate-700">@${u.username}</span> &bull; ${idPrefix}: ${u.nip || '-'}
                  </div>
                  <div class="text-[10px] text-slate-400 truncate mt-0.5">${u.unit || 'Unit belum diisi'} &bull; ${u.email || '-'}</div>
                </div>
                <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button type="button" onclick="handleDashboardApproveUser(${u.id}, '${safeNama}')" class="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold transition cursor-pointer">
                    ACC &amp; Aktifkan
                  </button>
                  <a href="pengguna.html" class="py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition">
                    Detail
                  </a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
    if (typeof window.refreshPendingUsersBadge === 'function') {
      window.refreshPendingUsersBadge();
    }
  } catch (err) {
    console.warn('Gagal memuat antrean ACC akun:', err.message);
  }
}

async function handleDashboardApproveUser(userId, userName) {
  const currentUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  if (!currentUser || currentUser.role !== 'admin') {
    showDashboardToast('Akses ditolak: Hanya Admin Sarpras yang dapat melakukan ACC pendaftaran akun.', 'error');
    return;
  }

  try {
    const res = await fetch(`/api/users/${userId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-User-Role': 'admin'
      },
      body: JSON.stringify({
        approved_by: currentUser.nama || 'Admin Sarpras'
      })
    });
    const json = await res.json();
    if (res.ok && json.success) {
      showDashboardToast(`Akun "${userName}" berhasil di-ACC dan sekarang aktif untuk login.`, 'success');
      loadAdminPendingRegistrations();
    } else {
      showDashboardToast(json.message || 'Gagal menyetujui akun.', 'error');
    }
  } catch (err) {
    showDashboardToast('Gagal terhubung ke server untuk ACC akun.', 'error');
  }
}

// Live Tracking Pengajuan untuk Dashboard Peminjam (hanya pengajuan aktif / belum selesai)
window.__peminjamTrackingLoans = [];
window.__peminjamTrackingSelectedKey = null;

function isFinishedLoanStatus(statusRaw) {
  const s = (statusRaw || '').toLowerCase().trim();
  if (s.includes('verifikasi')) return false;
  return s === 'selesai' || s === 'dikembalikan' || s.includes('selesai') || s.includes('tolak');
}

function getLoanTrackingStage(statusRaw) {
  const st = (statusRaw || '').toLowerCase();
  if (st.includes('verifikasi')) {
    return {
      key: 'verify',
      badge: 'Verifikasi Kembali',
      badgeClass: 'bg-purple-50 text-purple-700',
      barWidth: '100%',
      barColor: 'bg-purple-500',
      steps: [
        { label: 'Diajukan', state: 'done', icon: '&#10003;' },
        { label: 'Cek Stok', state: 'done', icon: '&#10003;' },
        { label: 'Disetujui', state: 'done', icon: '&#10003;' },
        { label: 'Cek Kembali', state: 'pending', icon: '&bull;&bull;' }
      ],
      noteClass: 'bg-purple-50 border-purple-200 text-purple-900',
      note: 'Status Terkini: Pengembalian Anda sudah diajukan dan sedang menunggu pengecekan fisik oleh Petugas Sarpras.'
    };
  }
  if (st.includes('setuju') || st.includes('aktif') || st.includes('dipinjam') || st.includes('berjalan')) {
    return {
      key: 'active',
      badge: 'Sedang Dipinjam',
      badgeClass: 'bg-blue-50 text-[#1246b5]',
      barWidth: '100%',
      barColor: 'bg-emerald-500',
      steps: [
        { label: 'Diajukan', state: 'done', icon: '&#10003;' },
        { label: 'Cek Stok', state: 'done', icon: '&#10003;' },
        { label: 'Disetujui', state: 'done', icon: '&#10003;' },
        { label: 'Dipinjam', state: 'active', icon: '&#10003;' }
      ],
      noteClass: 'bg-blue-50 border-blue-200 text-[#0f2a71]',
      note: 'Status Terkini: Permohonan telah DISETUJUI & sedang aktif dipinjam. Klik tombol Kembalikan Barang jika sudah selesai digunakan.'
    };
  }
  return {
    key: 'pending',
    badge: 'Menunggu Approval',
    badgeClass: 'bg-amber-50 text-amber-700',
    barWidth: '58%',
    barColor: 'bg-emerald-500',
    steps: [
      { label: 'Diajukan', state: 'done', icon: '&#10003;' },
      { label: 'Cek Stok', state: 'done', icon: '&#10003;' },
      { label: 'Review SK', state: 'pending', icon: '&bull;&bull;' },
      { label: 'Dipinjam', state: 'idle', icon: '4' }
    ],
    noteClass: 'bg-[#f5f0ff] border-purple-200 text-purple-900',
    note: 'Status Terkini: Permohonan telah lolos verifikasi stok awal dan saat ini sedang menunggu persetujuan Admin / Pimpinan.'
  };
}

function escapeTrackingHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseLocalDateTime(dateTimeStr) {
  if (!dateTimeStr || dateTimeStr === '-') return null;
  const raw = String(dateTimeStr).trim();
  // Match YYYY-MM-DD with optional HH:mm(:ss)
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    const hasTime = match[4] !== undefined && match[5] !== undefined;
    const hour = hasTime ? parseInt(match[4], 10) : 23;
    const minute = hasTime ? parseInt(match[5], 10) : 59;
    const second = match[6] !== undefined ? parseInt(match[6], 10) : (hasTime ? 0 : 59);
    return new Date(year, month, day, hour, minute, second, 0);
  }
  const fallback = new Date(raw);
  return isNaN(fallback.getTime()) ? null : fallback;
}
window.parseLocalDateTime = parseLocalDateTime;

function formatDurationDHM(absMs) {
  const totalMinutes = Math.floor(absMs / 60000);
  if (totalMinutes < 1) return '< 1 mnt';
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  const parts = [];
  if (days > 0) parts.push(`${days} hari`);
  if (hours > 0 || days > 0) parts.push(`${hours} jam`);
  parts.push(`${minutes} mnt`);
  return parts.join(' ');
}

function formatDueDateDisplay(dateStr, nowOverride = null) {
  if (!dateStr || dateStr === '-') {
    return { main: 'Terjadwal', badge: 'Aktif', badgeClass: 'bg-blue-50 text-[#1246b5]', isOverdue: false, countdownText: 'Terjadwal' };
  }
  const parsed = parseLocalDateTime(dateStr);
  if (!parsed) {
    return { main: String(dateStr), badge: 'Terjadwal', badgeClass: 'bg-blue-50 text-[#1246b5]', isOverdue: false, countdownText: String(dateStr) };
  }

  const now = nowOverride instanceof Date ? nowOverride : new Date();
  const diffMs = parsed.getTime() - now.getTime();
  const durationText = formatDurationDHM(Math.abs(diffMs));

  if (diffMs <= 0) {
    return {
      main: `Lewat ${durationText}`,
      badge: 'Terlambat',
      badgeClass: 'bg-rose-50 text-rose-700',
      isOverdue: true,
      countdownText: `Lewat ${durationText}`
    };
  }

  if (diffMs <= 3 * 3600000) {
    return {
      main: durationText,
      badge: 'Segera Kembali',
      badgeClass: 'bg-rose-50 text-rose-700',
      isOverdue: false,
      countdownText: `Sisa ${durationText}`
    };
  }

  if (diffMs <= 24 * 3600000) {
    return {
      main: durationText,
      badge: 'Hari Ini',
      badgeClass: 'bg-amber-50 text-amber-700',
      isOverdue: false,
      countdownText: `Sisa ${durationText}`
    };
  }

  return {
    main: durationText,
    badge: 'Aktif',
    badgeClass: 'bg-blue-50 text-[#1246b5]',
    isOverdue: false,
    countdownText: `Sisa ${durationText}`
  };
}
window.formatDueDateDisplay = formatDueDateDisplay;

function renderPeminjamLiveTrackingCard() {
  const card = document.getElementById('peminjam-live-tracking-card');
  if (!card) return;

  const list = window.__peminjamTrackingLoans || [];
  if (list.length === 0) {
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-sm font-extrabold text-slate-900">Live Tracking Pengajuan Aktif</h3>
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">0 Aktif</span>
        </div>
        <p class="text-[11px] text-slate-500 mt-1">Tidak ada pengajuan yang sedang berjalan atau menunggu persetujuan saat ini.</p>
      </div>
      <div class="my-6 p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2.5">
        <p class="text-xs font-semibold text-slate-600">Pengajuan yang sudah selesai otomatis dipindahkan ke Riwayat. Ajukan pinjaman baru untuk memantau progresnya di sini.</p>
        <div class="flex items-center justify-center gap-2">
          <a href="peminjaman.html" class="inline-block px-4 py-2 rounded-lg bg-[#1246b5] hover:bg-blue-800 text-white text-xs font-bold transition">+ Ajukan Peminjaman</a>
        </div>
      </div>
      <div class="flex items-center justify-between text-[11px]">
        <span class="text-slate-500">Riwayat peminjaman selesai tersimpan rapi.</span>
        <a href="peminjaman.html" class="font-bold text-[#1246b5] hover:underline">Lihat Riwayat &rarr;</a>
      </div>
    `;
    return;
  }

  let selected = list.find(l => l.trackingKey === window.__peminjamTrackingSelectedKey) || list[0];
  window.__peminjamTrackingSelectedKey = selected.trackingKey;

  const stage = getLoanTrackingStage(selected.status);
  const selectedIndex = list.indexOf(selected);

  const stepCircleClass = (state) => {
    if (state === 'done') return 'bg-emerald-500 text-white';
    if (state === 'active') return 'bg-[#1246b5] text-white';
    if (state === 'pending') return 'bg-amber-500 text-white';
    return 'bg-slate-200 text-slate-500';
  };
  const stepLabelClass = (state) => {
    if (state === 'done') return 'font-extrabold text-emerald-700';
    if (state === 'active') return 'font-extrabold text-[#1246b5]';
    if (state === 'pending') return 'font-extrabold text-amber-700';
    return 'font-semibold text-slate-400';
  };

  card.innerHTML = `
    <div class="space-y-2.5">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-extrabold text-slate-900">Live Tracking: #${escapeTrackingHtml(selected.kode)}</h3>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${stage.badgeClass}">${stage.badge}</span>
        </div>
        <span class="text-[10px] font-bold text-slate-500">${selectedIndex + 1} / ${list.length} Berjalan</span>
      </div>

      ${list.length > 1 ? `
        <div>
          <label for="peminjam-tracking-select" class="sr-only">Pilih pengajuan aktif untuk dilacak</label>
          <select id="peminjam-tracking-select" onchange="selectPeminjamTrackingLoan(this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer">
            ${list.map(item => `
              <option value="${escapeTrackingHtml(item.trackingKey)}" ${item.trackingKey === selected.trackingKey ? 'selected' : ''}>
                #${escapeTrackingHtml(item.kode)} — ${escapeTrackingHtml(item.assetNama)} (${escapeTrackingHtml(item.status)})
              </option>
            `).join('')}
          </select>
        </div>
      ` : ''}

      <p class="text-[11px] text-slate-500 leading-snug">
        <strong class="text-slate-700">${escapeTrackingHtml(selected.assetNama)}</strong> &bull; ${escapeTrackingHtml(selected.keperluan)} &bull; ${escapeTrackingHtml(selected.tglPinjam)} s/d ${escapeTrackingHtml(selected.tglKembali)}
      </p>
    </div>

    <div class="my-5 flex items-center justify-between relative px-3">
      <div class="absolute left-8 right-8 top-4 h-1 bg-slate-200 z-0"></div>
      <div class="absolute left-8 top-4 h-1 ${stage.barColor} z-0 transition-all duration-300" style="width: calc(${stage.barWidth} - 2rem); max-width: calc(100% - 4rem);"></div>
      ${stage.steps.map(s => `
        <div class="relative z-10 flex flex-col items-center gap-1.5">
          <div class="w-9 h-9 rounded-full ${stepCircleClass(s.state)} font-bold text-xs flex items-center justify-center shadow-2xs">${s.icon}</div>
          <span class="text-[11px] ${stepLabelClass(s.state)}">${s.label}</span>
        </div>
      `).join('')}
    </div>

    <div class="space-y-2.5">
      <div class="p-3 rounded-xl border ${stage.noteClass} text-[11px] font-semibold leading-relaxed">
        ${stage.note}
      </div>
      <div class="flex items-center justify-between text-[11px]">
        <span class="text-slate-500">Hanya menampilkan pengajuan yang masih aktif / diproses.</span>
        <a href="peminjaman.html" class="font-bold text-[#1246b5] hover:underline shrink-0 ml-2">Riwayat &rarr;</a>
      </div>
    </div>
  `;
}

window.selectPeminjamTrackingLoan = function(trackingKey) {
  window.__peminjamTrackingSelectedKey = trackingKey;
  renderPeminjamLiveTrackingCard();
};

window.openDashboardReturnModal = function(loanId, loanKode, assetNama) {
  const existing = document.getElementById('modal-dashboard-return');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'modal-dashboard-return';
  modal.className = 'fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700">${escapeTrackingHtml(loanKode)}</span>
          <h3 class="text-sm font-extrabold text-slate-900 mt-0.5">Ajukan Pengembalian Barang</h3>
        </div>
        <button type="button" onclick="document.getElementById('modal-dashboard-return')?.remove()" class="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer">&times;</button>
      </div>
      <div class="p-5 space-y-3.5 text-xs">
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div class="text-[11px] text-slate-500">Sarana / Ruangan yang Dikembalikan:</div>
          <div class="text-xs font-extrabold text-slate-900 mt-0.5">${escapeTrackingHtml(assetNama)}</div>
        </div>
        <div>
          <label for="dash-return-note" class="block text-[11px] font-bold text-slate-700 mb-1">Catatan Kondisi Barang (Opsional)</label>
          <textarea id="dash-return-note" rows="2" placeholder="Contoh: Barang lengkap, kondisi baik, siap dicek petugas di loket Sarpras." class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"></textarea>
        </div>
        <div class="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          <button type="button" onclick="document.getElementById('modal-dashboard-return')?.remove()" class="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold cursor-pointer">Batal</button>
          <button type="button" onclick="submitDashboardReturn(${Number(loanId)})" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer">Konfirmasi Pengembalian ✓</button>
        </div>
      </div>
    </div>
  `;
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
};

window.submitDashboardReturn = async function(loanId) {
  const noteEl = document.getElementById('dash-return-note');
  const catatan = (noteEl && noteEl.value.trim()) || 'Unit lengkap dan kondisi baik, diserahkan ke loket Sarpras.';
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  try {
    const res = await fetch(`/api/loans/${loanId}/request-return`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ catatan, requested_by: user ? (user.nama || user.username) : 'Peminjam' })
    });
    const json = await res.json();
    document.getElementById('modal-dashboard-return')?.remove();
    if (res.ok && json.success) {
      showDashboardToast(json.message || 'Pengembalian berhasil diajukan! Menunggu verifikasi Petugas Sarpras.', 'success');
      loadPeminjamDashboardLiveTracking(user);
    } else {
      showDashboardToast(json.message || 'Gagal mengajukan pengembalian.', 'error');
    }
  } catch (err) {
    showDashboardToast('Gagal terhubung ke server untuk pengembalian.', 'error');
  }
};

function renderPeminjamActiveLoansList(activeLoans, verifyLoans) {
  const container = document.getElementById('peminjam-active-loans-list');
  const quotaBanner = document.getElementById('peminjam-quota-banner');
  if (quotaBanner) {
    const titleEl = quotaBanner.querySelector('.font-extrabold');
    if (titleEl) {
      titleEl.textContent = `Status Kuota Peminjaman Aktif: ${activeLoans.length} dari 5 Sarana Terpakai`;
    }
  }
  if (!container) return;

  const combined = [
    ...activeLoans.map(l => ({ ...l, _mode: 'active' })),
    ...verifyLoans.map(l => ({ ...l, _mode: 'verify' }))
  ];

  if (combined.length === 0) {
    container.innerHTML = `
      <div class="p-5 rounded-xl bg-[#f8fafd] border border-dashed border-slate-200 text-center space-y-2.5">
        <p class="text-xs font-semibold text-slate-600">Saat ini Anda tidak sedang meminjam sarana atau ruangan apa pun.</p>
        <div class="flex items-center justify-center gap-2">
          <a href="aset.html" class="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold">Lihat Katalog Aset</a>
          <a href="peminjaman.html" class="px-3.5 py-1.5 rounded-lg bg-[#1246b5] hover:bg-blue-800 text-white text-[11px] font-bold">+ Ajukan Peminjaman</a>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = combined.map(l => {
    const kode = l.kode || l.kode_peminjaman || `PINJ-${l.id}`;
    const dueInfo = formatDueDateDisplay(l.tgl_kembali);
    const isVerify = l._mode === 'verify';
    return `
      <div class="p-4 rounded-xl bg-[#f8fafd] border ${isVerify ? 'border-purple-200' : 'border-slate-200/80'} flex flex-wrap items-center justify-between gap-3">
        <div>
          <div class="text-xs font-extrabold text-slate-900">${escapeTrackingHtml(l.asset_nama || 'Sarana Kampus')}</div>
          <div class="text-[11px] font-bold text-[#1246b5] mt-0.5">Kode Transaksi: ${escapeTrackingHtml(kode)}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">${escapeTrackingHtml(l.keperluan || 'Kegiatan Akademik')}</div>
          <div class="text-[11px] font-bold ${isVerify ? 'text-purple-700' : (dueInfo.isOverdue ? 'text-rose-600' : 'text-amber-700')} mt-1">
            ${isVerify ? 'Status: Menunggu Verifikasi Fisik Petugas Sarpras' : `Tenggat Kembali: ${escapeTrackingHtml(l.tgl_kembali || '-')} (${dueInfo.countdownText})`}
          </div>
        </div>
        <div class="flex flex-col gap-2">
          ${isVerify ? `
            <span class="px-3.5 py-1.5 rounded-lg bg-purple-100 text-purple-800 text-[11px] font-extrabold text-center">Verifikasi Petugas</span>
          ` : `
            <button type="button" onclick="openDashboardReturnModal(${Number(l.id)}, '${escapeTrackingHtml(kode).replace(/'/g, "\\'")}', '${escapeTrackingHtml(l.asset_nama || 'Sarana Kampus').replace(/'/g, "\\'")}')" class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold cursor-pointer transition">Kembalikan Barang</button>
          `}
          <a href="peminjaman.html" class="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold text-center">Detail di Peminjaman</a>
        </div>
      </div>
    `;
  }).join('');
}

window.__peminjamActiveLoansCache = [];
window.__peminjamVerifyLoansCache = [];

function refreshPeminjamDueCountdownUI() {
  const activeLoans = window.__peminjamActiveLoansCache || [];
  const verifyLoans = window.__peminjamVerifyLoansCache || [];
  const kpiDue = document.getElementById('peminjam-kpi-due');
  const kpiDueSub = document.getElementById('peminjam-kpi-due-sub');
  const kpiDueBadge = document.getElementById('peminjam-kpi-due-badge');
  if (!kpiDue) return;

  if (activeLoans.length === 0) {
    kpiDue.textContent = 'Tidak Ada';
    kpiDue.className = 'text-2xl font-extrabold text-slate-900 mt-1';
    if (kpiDueSub) kpiDueSub.textContent = 'Tidak ada pinjaman aktif';
    if (kpiDueBadge) {
      kpiDueBadge.textContent = 'Aman';
      kpiDueBadge.className = 'px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold shrink-0';
    }
  } else {
    const sortedByDue = [...activeLoans].sort((a, b) => {
      const da = parseLocalDateTime(a.tgl_kembali);
      const db = parseLocalDateTime(b.tgl_kembali);
      const ta = da ? da.getTime() : Number.MAX_SAFE_INTEGER;
      const tb = db ? db.getTime() : Number.MAX_SAFE_INTEGER;
      return ta - tb;
    });
    const nearest = sortedByDue[0];
    const dueInfo = formatDueDateDisplay(nearest.tgl_kembali);
    kpiDue.textContent = dueInfo.main;
    kpiDue.className = `text-xl font-extrabold ${dueInfo.isOverdue ? 'text-rose-600' : 'text-slate-900'} mt-1 leading-tight`;
    if (kpiDueSub) kpiDueSub.textContent = `${nearest.asset_nama || 'Sarana'} (${nearest.tgl_kembali || '-'})`;
    if (kpiDueBadge) {
      kpiDueBadge.textContent = dueInfo.badge;
      kpiDueBadge.className = `px-2.5 py-0.5 rounded-md font-bold shrink-0 ${dueInfo.badgeClass}`;
    }
  }
  renderPeminjamActiveLoansList(activeLoans, verifyLoans);
}

async function loadPeminjamDashboardLiveTracking(user) {
  try {
    const res = await fetch('/api/loans', { headers: { 'Accept': 'application/json' } });
    const json = await res.json();
    const allLoans = (json && json.success && Array.isArray(json.data)) ? json.data : [];

    const userName = (user && (user.nama || user.name || '') || '').toLowerCase().trim();
    const userNip = (user && (user.nip || '') || '').toLowerCase().trim();
    const firstWord = userName.split(' ')[0] || '';

    const mine = allLoans.filter(l => {
      const pName = (l.peminjam_nama || '').toLowerCase().trim();
      const pNip = (l.peminjam_nip || '').toLowerCase().trim();
      if (userName && (pName === userName || pName.includes(userName) || userName.includes(pName))) return true;
      if (firstWord && firstWord.length >= 4 && pName.includes(firstWord)) return true;
      if (userNip && pNip && pNip === userNip) return true;
      return false;
    });

    // Exclude finished loans (Selesai / Dikembalikan / Ditolak) from Live Tracking
    const ongoing = mine.filter(l => !isFinishedLoanStatus(l.status));

    // Prioritize pending -> active -> verify, then newest ID
    const priorityScore = (st) => {
      const s = (st || '').toLowerCase();
      if (s.includes('menunggu') || s.includes('diajukan')) return 0;
      if (s.includes('setuju') || s.includes('aktif') || s.includes('dipinjam')) return 1;
      if (s.includes('verifikasi')) return 2;
      return 3;
    };

    ongoing.sort((a, b) => {
      const pa = priorityScore(a.status);
      const pb = priorityScore(b.status);
      if (pa !== pb) return pa - pb;
      return (b.id || 0) - (a.id || 0);
    });

    window.__peminjamTrackingLoans = ongoing.map(l => ({
      trackingKey: String(l.kode || l.kode_peminjaman || l.kode_pinjam || l.id),
      kode: l.kode || l.kode_peminjaman || l.kode_pinjam || `PINJ-${l.id}`,
      assetNama: l.asset_nama || 'Sarana Kampus',
      keperluan: l.keperluan || 'Kegiatan Akademik',
      tglPinjam: l.tgl_pinjam || '-',
      tglKembali: l.tgl_kembali || '-',
      status: l.status || 'Menunggu Approval'
    }));

    // Real KPI counts from database
    const activeLoans = mine.filter(l => {
      const s = (l.status || '').toLowerCase();
      return !s.includes('verifikasi') && (s.includes('setuju') || s.includes('aktif') || s.includes('dipinjam'));
    });
    const verifyLoans = mine.filter(l => (l.status || '').toLowerCase().includes('verifikasi'));
    const pendingLoans = mine.filter(l => {
      const s = (l.status || '').toLowerCase();
      return s.includes('menunggu') || s.includes('diajukan');
    });
    const completedLoans = mine.filter(l => {
      const s = (l.status || '').toLowerCase();
      return !s.includes('verifikasi') && (s.includes('selesai') || s.includes('dikembalikan'));
    });

    const kpiActive = document.getElementById('peminjam-kpi-active');
    const kpiActiveSub = document.getElementById('peminjam-kpi-active-sub');
    if (kpiActive) kpiActive.textContent = `${activeLoans.length} Sarana`;
    if (kpiActiveSub) {
      kpiActiveSub.textContent = activeLoans.length > 0
        ? activeLoans.map(l => l.asset_nama).slice(0, 2).join(', ')
        : 'Belum ada pinjaman aktif';
    }

    const reviewTotal = pendingLoans.length + verifyLoans.length;
    const kpiReview = document.getElementById('peminjam-kpi-review');
    const kpiReviewSub = document.getElementById('peminjam-kpi-review-sub');
    if (kpiReview) kpiReview.textContent = `${reviewTotal} Pengajuan`;
    if (kpiReviewSub) {
      if (pendingLoans.length > 0) {
        kpiReviewSub.textContent = pendingLoans[0].asset_nama;
      } else if (verifyLoans.length > 0) {
        kpiReviewSub.textContent = `Verifikasi: ${verifyLoans[0].asset_nama}`;
      } else {
        kpiReviewSub.textContent = 'Semua pengajuan selesai diproses';
      }
    }

    window.__peminjamActiveLoansCache = activeLoans;
    window.__peminjamVerifyLoansCache = verifyLoans;

    const kpiScoreSub = document.getElementById('peminjam-kpi-score-sub');
    if (kpiScoreSub) {
      kpiScoreSub.textContent = completedLoans.length > 0
        ? `${completedLoans.length}x Pinjam Selesai Tertib`
        : 'Belum ada keterlambatan';
    }

    renderPeminjamLiveTrackingCard();
    refreshPeminjamDueCountdownUI();

    if (window.__peminjamDueTimer) {
      clearInterval(window.__peminjamDueTimer);
    }
    window.__peminjamDueTimer = setInterval(refreshPeminjamDueCountdownUI, 30000);
  } catch (err) {
    console.warn('Gagal memuat Live Tracking Peminjam:', err.message);
    window.__peminjamTrackingLoans = [];
    window.__peminjamActiveLoansCache = [];
    window.__peminjamVerifyLoansCache = [];
    renderPeminjamLiveTrackingCard();
    refreshPeminjamDueCountdownUI();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Render seluruh komponen dari array JavaScript
  renderSidebarMenu();
  renderStatCards();
  renderTrendMetrics();
  renderInventoryConditions();
  renderOccupancy();
  renderApprovalQueue();
  renderCriticalTickets();
  renderActivityLogs();
  applyRoleSpecificDashboard();

  // Inisialisasi grafik interaktif Chart.js
  initTrendChart();
  initConditionChart();

  // Inisialisasi ikon Lucide
  if (window.lucide) {
    lucide.createIcons();
  }

  // Setup interaksi filter tabel
  setupTableFilter();

  // Load live data from backend
  loadDashboardStatsFromBackend();
});
