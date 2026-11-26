 /**
 * SIMAS - Peminjaman & Reservasi Sarana
 * Skrip Logika, Data Dinamis Array & Interaktivitas UI
 */

// ===================== 1. DATA MASTER =====================

const navMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-panel-left', href: 'index.html', active: false },
  { id: 'aset', label: 'Manajemen Aset', icon: 'archive', href: 'aset.html', active: false },
  { id: 'gedung', label: 'Gedung & Ruangan', icon: 'building-2', href: 'gedung.html', active: false },
  { id: 'peminjaman', label: 'Peminjaman & Reservasi', icon: 'calendar-clock', href: 'peminjaman.html', active: true },
  { id: 'antrean', label: 'Antrean Persetujuan', icon: 'check-square', href: 'antrean.html', active: false, badge: 4 },
  { id: 'pemeliharaan', label: 'Pemeliharaan & Tiket', icon: 'wrench', href: 'tiket.html', active: false },
  { id: 'mutasi', label: 'Mutasi Aset', icon: 'arrow-left-right', href: 'mutasi.html', active: false },
  { id: 'stock', label: 'Stock Opname', icon: 'scan-barcode', href: 'stock.html', active: false },
  { id: 'laporan', label: 'Laporan & Rangkuman', icon: 'file-text', href: 'laporan.html', active: false },
];

let loansData = [];

// State Global
let currentSelectedLoanId = null;
let currentTabFilter = 'all';
let currentSearchQuery = '';
let currentCategoryFilter = 'all';
let currentStatusFilter = 'all';
let activeQuickFilter = null;
let currentScheduleFilter = { start: '', end: '', label: 'Semua Jadwal (Aktif)' };
let inventoryAssetsList = [];
let currentLoanPage = 1;
let currentLoanRowsPerPage = 5;

function updateLoanKpiAndBadges() {
  const total = loansData.length;
  const activeCount = loansData.filter(l => {
    const s = (l.status || '').toLowerCase();
    return s === 'disetujui' || s === 'aktif' || s === 'sedang dipinjam' || s === 'terlambat';
  }).length;
  const pendingCount = loansData.filter(l => {
    const s = (l.status || '').toLowerCase();
    return s === 'diajukan' || s.includes('menunggu');
  }).length;
  const overdueCount = loansData.filter(l => {
    const s = (l.status || '').toLowerCase();
    return s === 'terlambat' || l.isOverdue;
  }).length;

  const kpiActive = document.getElementById('kpi-loan-active');
  const kpiPending = document.getElementById('kpi-loan-pending');
  const kpiOverdue = document.getElementById('kpi-loan-overdue');
  const badgeSemua = document.getElementById('badge-tab-semua');
  const badgeAntrean = document.getElementById('badge-tab-antrean');
  const badgeTableTotal = document.getElementById('badge-table-total');

  if (kpiActive) kpiActive.textContent = String(activeCount);
  if (kpiPending) kpiPending.textContent = String(pendingCount);
  if (kpiOverdue) kpiOverdue.textContent = String(overdueCount);
  if (badgeSemua) badgeSemua.textContent = String(total);
  if (badgeAntrean) badgeAntrean.textContent = String(pendingCount);
  if (badgeTableTotal) badgeTableTotal.textContent = `${total} Total`;
}

// ===================== 2. INITIALIZATION =====================

document.addEventListener('DOMContentLoaded', () => {
  renderSidebarMenu();
  renderTable();
  if (loansData.length > 0) {
    selectLoan(currentSelectedLoanId || loansData[0].id);
  } else {
    renderEmptyDetail();
  }
  setupEventListeners();
  applyRbacToPeminjamanPage();
  loadLoansFromBackend();
  // Handle URL param ?kode=...&nama=...&lokasi=... (e.g. from asset catalog or dashboard "+ Pinjam")
  const urlParams = new URLSearchParams(window.location.search);
  const kodeParam = urlParams.get('kode');
  const namaParam = urlParams.get('nama');
  const lokasiParam = urlParams.get('lokasi');
  if (kodeParam || namaParam) {
    openModalAjukan(kodeParam, namaParam, lokasiParam);
    try {
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (e) {}
  } else {
    populateAssetDropdown();
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
});

function applyRbacToPeminjamanPage() {
  if (typeof getCurrentUser !== 'function') return;
  const u = getCurrentUser();
  const pageTitle = document.querySelector('main h1');

  if (u.role === 'peminjam') {
    if (pageTitle) pageTitle.textContent = 'Layanan Peminjaman Sarana & Booking Ruangan';
    const exportBtn = document.querySelector('button[onclick="exportLoansCSV()"]');
    if (exportBtn) exportBtn.style.display = 'none';
    const tabAntrean = document.getElementById('tab-antrean');
    if (tabAntrean) tabAntrean.style.display = 'none';
  } else if (u.role === 'pimpinan') {
    if (pageTitle) pageTitle.textContent = 'Otorisasi & Persetujuan Peminjaman Sarana';
    const ajukanBtns = document.querySelectorAll('button[onclick="openModalAjukan()"]');
    ajukanBtns.forEach(btn => {
      btn.style.display = 'none';
    });
  }
}

// ===================== 3. SIDEBAR RENDERING =====================

function renderSidebarMenu() {
  if (typeof renderNavigation === 'function') {
    renderNavigation('peminjaman');
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

// ===================== 4. TABLE RENDERING =====================

function parseScheduleDate(item) {
  if (item.tgl_pinjam) return item.tgl_pinjam;
  if (!item.schedule) return null;
  const m = item.schedule.match(/(\d{1,2})\s+([A-Za-z]{3})/);
  if (m) {
    const day = m[1].padStart(2, '0');
    const monthMap = { 'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'Mei': '05', 'May': '05', 'Jun': '06', 'Jul': '07', 'Agu': '08', 'Aug': '08', 'Sep': '09', 'Okt': '10', 'Oct': '10', 'Nov': '11', 'Des': '12', 'Dec': '12' };
    const month = monthMap[m[2]] || '03';
    return `2025-${month}-${day}`;
  }
  return null;
}

function getFilteredLoans() {
  return loansData.filter(item => {
    const statusNorm = (item.status || '').toLowerCase().trim();
    const isPending = statusNorm === 'diajukan' || statusNorm === 'menunggu approval' || statusNorm.includes('menunggu');
    const isActive = statusNorm === 'disetujui' || statusNorm === 'aktif' || statusNorm === 'sedang dipinjam';
    const isOverdue = statusNorm === 'terlambat' || item.isOverdue;
    const isReturned = statusNorm === 'dikembalikan' || statusNorm === 'selesai';

    // Tab filter
    if (currentTabFilter === 'antrean' && !isPending) return false;
    if (currentTabFilter === 'kalender' && !isActive && !isPending) return false;
    if (currentTabFilter === 'pinjaman_saya') {
      const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
      const userName = user && (user.nama || user.name) ? (user.nama || user.name).toLowerCase() : '';
      const reqName = (item.requesterName || '').toLowerCase();
      const firstWord = userName.replace(/^(dr\.|prof\.|ir\.|\s)+/gi, '').split(' ')[0];
      if (firstWord && !reqName.includes(firstWord)) {
        if (!reqName.includes('wahyu') && !reqName.includes('ahmad') && !reqName.includes('bambang')) return false;
      }
    }

    // Search input
    if (currentSearchQuery.trim() !== '') {
      const q = currentSearchQuery.toLowerCase();
      const match = item.id.toLowerCase().includes(q) ||
        item.requesterName.toLowerCase().includes(q) ||
        item.assetName.toLowerCase().includes(q) ||
        item.assetCode.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Category dropdown
    if (currentCategoryFilter !== 'all' && item.category !== currentCategoryFilter) return false;

    // Status dropdown
    if (currentStatusFilter !== 'all') {
      if (currentStatusFilter === 'terlambat' && !isOverdue) return false;
      if (currentStatusFilter === 'diajukan' && !isPending) return false;
      if (currentStatusFilter === 'dipinjam' && !isActive) return false;
      if (currentStatusFilter === 'disetujui' && statusNorm !== 'disetujui' && statusNorm !== 'aktif') return false;
      if (currentStatusFilter === 'dikembalikan' && !isReturned) return false;
    }

    // Quick filter chips
    if (activeQuickFilter === 'overdue' && !isOverdue) return false;
    if (activeQuickFilter === 'ruang' && item.category !== 'ruangan') return false;
    if (activeQuickFilter === 'kamera' && !item.assetName.toLowerCase().includes('sony') && !item.assetName.toLowerCase().includes('proyektor') && !item.assetName.toLowerCase().includes('microphone')) return false;
    if (activeQuickFilter === 'bpkp' && !(item.purpose || '').toLowerCase().includes('audit') && !(item.fullPurpose || '').toLowerCase().includes('bpkp') && !(item.requesterDept || '').toLowerCase().includes('spi') && !isPending) return false;

    // Rentang Jadwal date filter
    if (currentScheduleFilter && (currentScheduleFilter.start || currentScheduleFilter.end)) {
      const itemDate = parseScheduleDate(item);
      if (itemDate) {
        if (currentScheduleFilter.start && itemDate < currentScheduleFilter.start) return false;
        if (currentScheduleFilter.end && itemDate > currentScheduleFilter.end) return false;
      }
    }

    return true;
  });
}

function changeLoanPage(newPage) {
  const filtered = getFilteredLoans();
  const totalPages = Math.max(1, Math.ceil(filtered.length / currentLoanRowsPerPage));
  if (newPage < 1 || newPage > totalPages) return;
  currentLoanPage = newPage;
  renderTable();
}
window.changeLoanPage = changeLoanPage;

function renderLoanPagination(totalItems) {
  const totalLabel = document.getElementById('loan-pagination-total');
  const btnContainer = document.getElementById('loan-pagination-buttons');
  const totalPages = Math.max(1, Math.ceil(totalItems / currentLoanRowsPerPage));
  if (currentLoanPage > totalPages) currentLoanPage = totalPages;

  if (totalLabel) {
    totalLabel.textContent = `dari ${totalItems} data peminjaman`;
  }
  if (!btnContainer) return;

  let buttonsHtml = `
    <button type="button" onclick="changeLoanPage(1)" ${currentLoanPage <= 1 ? 'disabled' : ''} class="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition text-[10px] cursor-pointer">|&lt;</button>
    <button type="button" onclick="changeLoanPage(${currentLoanPage - 1})" ${currentLoanPage <= 1 ? 'disabled' : ''} class="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition text-[10px] cursor-pointer">&lt;</button>
  `;
  for (let p = 1; p <= totalPages; p++) {
    if (p === currentLoanPage) {
      buttonsHtml += `<button type="button" onclick="changeLoanPage(${p})" class="w-6 h-6 rounded bg-[#163b84] text-white font-bold flex items-center justify-center text-[11px] shadow-2xs cursor-pointer">${p}</button>`;
    } else {
      buttonsHtml += `<button type="button" onclick="changeLoanPage(${p})" class="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 font-semibold text-[11px] transition cursor-pointer">${p}</button>`;
    }
  }
  buttonsHtml += `
    <button type="button" onclick="changeLoanPage(${currentLoanPage + 1})" ${currentLoanPage >= totalPages ? 'disabled' : ''} class="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition text-[10px] cursor-pointer">&gt;</button>
    <button type="button" onclick="changeLoanPage(${totalPages})" ${currentLoanPage >= totalPages ? 'disabled' : ''} class="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition text-[10px] cursor-pointer">&gt;|</button>
  `;
  btnContainer.innerHTML = buttonsHtml;
}

function renderTable() {
  updateLoanKpiAndBadges();
  const tbody = document.getElementById('loans-table-body');
  if (!tbody) return;

  const filtered = getFilteredLoans();
  renderLoanPagination(filtered.length);

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="py-8 text-center text-slate-400 text-xs">
          <div class="flex flex-col items-center justify-center gap-1.5">
            <i data-lucide="inbox" class="w-6 h-6 text-slate-300"></i>
            <p>Tidak ada permohonan yang sesuai dengan filter.</p>
          </div>
        </td>
      </tr>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const startIdx = (currentLoanPage - 1) * currentLoanRowsPerPage;
  const pageItems = filtered.slice(startIdx, startIdx + currentLoanRowsPerPage);

  tbody.innerHTML = pageItems.map(item => {
    const isSelected = item.id === currentSelectedLoanId;
    const selectedClass = isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/60';
    const idColor = item.isOverdue ? 'text-[#991b1b]' : 'text-[#0f2a71]';
    const subIdColor = item.isOverdue ? 'text-[#b91c1c] font-semibold' : 'text-slate-400 font-normal';

    return `
      <tr 
        class="border-b border-slate-100/90 cursor-pointer transition ${selectedClass}"
        onclick="selectLoan('${item.id}')"
      >
        <!-- ID PINJAM -->
        <td class="py-2.5 px-3 align-top whitespace-nowrap">
          <div class="text-[11px] font-black ${idColor} tracking-tight">${item.id}</div>
          <div class="text-[10px] ${subIdColor} mt-0.5">${item.subId}</div>
        </td>

        <!-- PEMOHON & UNIT KERJA -->
        <td class="py-2.5 px-3 align-top">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full ${item.requesterColor} text-[10px] font-black flex items-center justify-center shrink-0">
              ${item.requesterInitials}
            </div>
            <div>
              <div class="text-[11px] font-bold text-slate-800 leading-snug">${item.requesterName}</div>
              <div class="text-[10px] text-slate-400 leading-tight mt-0.5">${item.requesterDept}</div>
            </div>
          </div>
        </td>

        <!-- ASET / FASILITAS -->
        <td class="py-2.5 px-3 align-top">
          <div class="flex items-start gap-1.5">
            <div class="mt-0.5 text-slate-500 shrink-0">
              <i data-lucide="${item.assetIcon}" class="w-3.5 h-3.5"></i>
            </div>
            <div>
              <div class="text-[11px] font-bold text-slate-800 leading-snug">${item.assetName}</div>
              <div class="text-[9px] text-slate-400 font-medium tracking-wide mt-0.5">${item.assetCode}</div>
            </div>
          </div>
        </td>

        <!-- JADWAL & KEPERLUAN -->
        <td class="py-2.5 px-3 align-top">
          <div class="text-[11px] font-medium text-slate-700 leading-snug">${item.schedule}</div>
          <div class="text-[10px] text-slate-400 italic mt-0.5">${item.purpose}</div>
        </td>

        <!-- STATUS -->
        <td class="py-2.5 px-3 align-top whitespace-nowrap text-right">
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.statusBadgeClass}">
            <i data-lucide="${item.statusIcon}" class="w-3 h-3"></i>
            <span>${item.status}</span>
          </span>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ===================== 5. SELECT LOAN DETAIL =====================

function renderEmptyDetail() {
  currentSelectedLoanId = null;
  const detailTitle = document.getElementById('detail-title');
  const detailSub = document.getElementById('detail-subtitle');
  const detailStatus = document.getElementById('detail-status-badge');
  const detailRequester = document.getElementById('detail-requester');
  const detailDept = document.getElementById('detail-dept');
  const detailTime = document.getElementById('detail-time');
  const detailAttendees = document.getElementById('detail-attendees');
  const detailPurpose = document.getElementById('detail-purpose');
  const detailAntiConflict = document.getElementById('detail-anticonflict');
  const detailAvailability = document.getElementById('detail-availability-badge');
  const slotsContainer = document.getElementById('detail-slots-container');
  const checklistsContainer = document.getElementById('detail-checklists-container');
  const actionsContainer = document.getElementById('detail-actions-container');

  if (detailTitle) detailTitle.innerText = 'Belum Ada Permohonan Peminjaman';
  if (detailSub) detailSub.innerText = 'Daftar peminjaman masih kosong';
  if (detailStatus) {
    detailStatus.className = 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600';
    detailStatus.innerText = 'Status: Kosong';
  }
  if (detailRequester) detailRequester.innerText = '-';
  if (detailDept) detailDept.innerText = '-';
  if (detailTime) detailTime.innerText = '-';
  if (detailAttendees) detailAttendees.innerText = '-';
  if (detailPurpose) detailPurpose.innerText = 'Belum ada data permohonan. Silakan klik tombol "+ Ajukan Peminjaman Aset/Ruangan" untuk membuat permohonan baru.';
  if (detailAntiConflict) detailAntiConflict.innerText = '-';
  if (detailAvailability) detailAvailability.innerText = 'MENUNGGU DATA';
  if (slotsContainer) slotsContainer.innerHTML = '';
  if (checklistsContainer) checklistsContainer.innerHTML = '';
  if (actionsContainer) actionsContainer.innerHTML = '';
  if (window.lucide) window.lucide.createIcons();
}

function selectLoan(loanId) {
  currentSelectedLoanId = loanId;
  const loan = loansData.find(l => l.id === loanId);
  if (!loan) return;

  // Re-render table to reflect selected highlight
  renderTable();

  // Populate Right Detail Panel
  const detailTitle = document.getElementById('detail-title');
  const detailSub = document.getElementById('detail-subtitle');
  const detailStatus = document.getElementById('detail-status-badge');
  const detailRequester = document.getElementById('detail-requester');
  const detailDept = document.getElementById('detail-dept');
  const detailTime = document.getElementById('detail-time');
  const detailAttendees = document.getElementById('detail-attendees');
  const detailPurpose = document.getElementById('detail-purpose');
  const detailAntiConflict = document.getElementById('detail-anticonflict');
  const detailAvailability = document.getElementById('detail-availability-badge');
  const slotsContainer = document.getElementById('detail-slots-container');
  const checklistsContainer = document.getElementById('detail-checklists-container');

  if (detailTitle) detailTitle.innerText = 'Detail Permohonan Peminjaman';
  if (detailSub) {
    const shortAsset = loan.assetName.split('(')[0].trim();
    detailSub.innerText = `${loan.id} (${shortAsset})`;
  }
  if (detailStatus) {
    detailStatus.className = `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${loan.statusBadgeClass}`;
    detailStatus.innerText = `Status: ${loan.status}`;
  }
  if (detailRequester) detailRequester.innerText = loan.requesterName;
  if (detailDept) detailDept.innerText = loan.requesterDivisi || loan.requesterDept;
  if (detailTime) detailTime.innerText = loan.schedule;
  if (detailAttendees) detailAttendees.innerText = loan.attendees;
  if (detailPurpose) detailPurpose.innerText = loan.fullPurpose;
  if (detailAntiConflict) detailAntiConflict.innerText = loan.antiConflictText;
  if (detailAvailability) detailAvailability.innerText = loan.availabilityBadge;

  // Render Slots
  if (slotsContainer) {
    slotsContainer.innerHTML = loan.slots.map(slot => `
      <div class="px-1.5 py-1 rounded text-[9px] font-semibold text-center whitespace-nowrap ${slot.chipClass}">
        <div>${slot.time}</div>
        <div class="text-[8px] font-normal leading-tight">${slot.label}</div>
      </div>
    `).join('');
  }

  // Render Checklists
  if (checklistsContainer) {
    checklistsContainer.innerHTML = loan.checklists.map(c => `
      <div class="flex items-start gap-2">
        <div class="w-3.5 h-3.5 rounded bg-[#2563eb] text-white flex items-center justify-center shrink-0 mt-0.5">
          <i data-lucide="check" class="w-2.5 h-2.5 stroke-[3]"></i>
        </div>
        <div>
          <div class="text-[11px] font-bold text-slate-800 leading-tight">${c.title}</div>
          <div class="text-[10px] text-slate-500 mt-0.5 leading-snug">${c.desc}</div>
        </div>
      </div>
    `).join('');
  }

  // Render RBAC Actions
  const actionsContainer = document.getElementById('detail-actions-container');
  if (actionsContainer) {
    let actionButtonsHtml = '';
    const canApprove = typeof hasPermission === 'function' && hasPermission('loans:approve');
    const isPeminjam = typeof hasRole === 'function' && hasRole('peminjam');

    const statusNorm = (loan.status || '').toLowerCase().trim();
    const isPending = statusNorm === 'diajukan' || statusNorm === 'menunggu approval' || statusNorm.includes('menunggu');
    const isActive = statusNorm === 'disetujui' || statusNorm === 'aktif' || statusNorm === 'sedang dipinjam' || statusNorm === 'terlambat';
    const isRejected = statusNorm === 'ditolak';

    if (isPending) {
      if (canApprove) {
        actionButtonsHtml = `
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Otorisasi Persetujuan</span>
              <span class="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                <i data-lucide="clock" class="w-3 h-3 text-amber-600"></i>
                <span>Menunggu Approval</span>
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button onclick="rejectSelectedLoan()" class="px-3 py-2 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer">
                <i data-lucide="x" class="w-3.5 h-3.5"></i>
                <span>Tolak</span>
              </button>
              <button onclick="approveSelectedLoan()" class="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                <i data-lucide="check" class="w-3.5 h-3.5"></i>
                <span>Setujui</span>
              </button>
            </div>
          </div>
        `;
      } else {
        actionButtonsHtml = `
          <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold flex items-center gap-2">
            <i data-lucide="clock" class="w-4 h-4 text-amber-600 shrink-0"></i>
            <span>Menunggu verifikasi &amp; persetujuan Pimpinan Institusi / Admin Sarpras.</span>
          </div>
        `;
      }
    } else if (isActive) {
      actionButtonsHtml = `
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tindakan Pengembalian</span>
            <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <i data-lucide="check-circle" class="w-3 h-3 text-emerald-600"></i>
              <span>Pinjaman Aktif</span>
            </span>
          </div>
          <button onclick="returnSelectedLoan()" class="w-full px-3 py-2 rounded-xl bg-[#0f2a71] hover:bg-[#0a1e54] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
            <i data-lucide="arrow-down-left" class="w-3.5 h-3.5"></i>
            <span>${isPeminjam ? 'Ajukan Pengembalian Aset' : 'Konfirmasi Pengembalian Selesai'}</span>
          </button>
        </div>
      `;
    } else if (isRejected) {
      actionButtonsHtml = `
        <div class="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold flex items-center gap-2">
          <i data-lucide="x-circle" class="w-4 h-4 text-rose-600 shrink-0"></i>
          <span>Pengajuan Ditolak oleh Pimpinan / Admin Sarpras.</span>
        </div>
      `;
    } else {
      actionButtonsHtml = `
        <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] font-semibold text-center">
          Peminjaman Selesai / Arsip Tertutup
        </div>
      `;
    }

    actionsContainer.innerHTML = actionButtonsHtml;
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ===================== 6. EVENT LISTENERS & FILTERS =====================

function setupEventListeners() {
  const searchInput = document.getElementById('search-loan-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderTable();
    });
  }

  const categorySelect = document.getElementById('filter-category');
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      currentCategoryFilter = e.target.value;
      renderTable();
    });
  }

  const statusSelect = document.getElementById('filter-status');
  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      currentStatusFilter = e.target.value;
      renderTable();
    });
  }

  const resetBtn = document.getElementById('btn-reset-filter');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentSearchQuery = '';
      currentCategoryFilter = 'all';
      currentStatusFilter = 'all';
      activeQuickFilter = null;
      currentLoanPage = 1;
      if (searchInput) searchInput.value = '';
      if (categorySelect) categorySelect.value = 'all';
      if (statusSelect) statusSelect.value = 'all';
      updateQuickFilterStyles();
      renderTable();
      showToast('Filter berhasil direset ke kondisi awal.', 'info');
    });
  }

  const rowsPerPageSelect = document.getElementById('loan-rows-per-page');
  if (rowsPerPageSelect) {
    rowsPerPageSelect.addEventListener('change', (e) => {
      currentLoanRowsPerPage = parseInt(e.target.value, 10) || 5;
      currentLoanPage = 1;
      renderTable();
    });
  }

  setupQuickFilters();
  setupTabs();
}

function setupQuickFilters() {
  const chipAudit = document.getElementById('chip-bpkp');
  const chipRuang = document.getElementById('chip-ruang-lt3');
  const chipKamera = document.getElementById('chip-kamera');
  const chipBatas = document.getElementById('chip-batas-waktu');

  if (chipBatas) {
    chipBatas.addEventListener('click', () => {
      activeQuickFilter = activeQuickFilter === 'overdue' ? null : 'overdue';
      currentLoanPage = 1;
      updateQuickFilterStyles();
      renderTable();
    });
  }

  if (chipRuang) {
    chipRuang.addEventListener('click', () => {
      activeQuickFilter = activeQuickFilter === 'ruang' ? null : 'ruang';
      currentLoanPage = 1;
      updateQuickFilterStyles();
      renderTable();
    });
  }

  if (chipKamera) {
    chipKamera.addEventListener('click', () => {
      activeQuickFilter = activeQuickFilter === 'kamera' ? null : 'kamera';
      currentLoanPage = 1;
      updateQuickFilterStyles();
      renderTable();
    });
  }

  if (chipAudit) {
    chipAudit.addEventListener('click', () => {
      activeQuickFilter = activeQuickFilter === 'bpkp' ? null : 'bpkp';
      currentLoanPage = 1;
      updateQuickFilterStyles();
      renderTable();
      showToast(activeQuickFilter === 'bpkp' ? 'Filter Audit Internal BPKP diaktifkan.' : 'Filter Audit Internal BPKP dinonaktifkan.', 'info');
    });
  }
}

function updateQuickFilterStyles() {
  const chipAudit = document.getElementById('chip-bpkp');
  const chipBatas = document.getElementById('chip-batas-waktu');
  const chipRuang = document.getElementById('chip-ruang-lt3');
  const chipKamera = document.getElementById('chip-kamera');

  if (chipAudit) {
    if (activeQuickFilter === 'bpkp') {
      chipAudit.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
    } else {
      chipAudit.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
    }
  }

  if (chipBatas) {
    if (activeQuickFilter === 'overdue') {
      chipBatas.classList.add('ring-2', 'ring-rose-500', 'bg-rose-100');
    } else {
      chipBatas.classList.remove('ring-2', 'ring-rose-500', 'bg-rose-100');
    }
  }

  if (chipRuang) {
    if (activeQuickFilter === 'ruang') {
      chipRuang.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
    } else {
      chipRuang.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
    }
  }

  if (chipKamera) {
    if (activeQuickFilter === 'kamera') {
      chipKamera.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
    } else {
      chipKamera.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
    }
  }
}

function setupTabs() {
  const tabs = [
    { id: 'tab-semua', key: 'all' },
    { id: 'tab-antrean', key: 'antrean' },
    { id: 'tab-kalender', key: 'kalender' },
    { id: 'tab-saya', key: 'pinjaman_saya' }
  ];

  tabs.forEach(t => {
    const el = document.getElementById(t.id);
    if (!el) return;
    el.addEventListener('click', () => {
      currentTabFilter = t.key;
      tabs.forEach(other => {
        const otherEl = document.getElementById(other.id);
        if (!otherEl) return;
        if (other.key === t.key) {
          otherEl.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#163b84] text-white font-bold text-xs shadow-sm transition';
        } else {
          otherEl.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-semibold text-xs transition';
        }
      });
      renderTable();
      if (t.key === 'kalender') {
        showToast('Menampilkan jadwal reservasi aktif & pemeriksaan slot anti-bentrok.', 'info');
      }
    });
  });
}

// ===================== 7. MODAL TAMBAH PEMINJAMAN & DROPDOWN ASET =====================

function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// 7.1 Filter Rentang Jadwal Modal Controls
function handleBtnUbahJadwal(e) {
  if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
  openModalRentangJadwal();
}

function openModalRentangJadwal() {
  const modal = document.getElementById('modal-rentang-jadwal');
  if (modal) {
    if (currentScheduleFilter.start) document.getElementById('filter-jadwal-start').value = currentScheduleFilter.start;
    if (currentScheduleFilter.end) document.getElementById('filter-jadwal-end').value = currentScheduleFilter.end;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeModalRentangJadwal() {
  const modal = document.getElementById('modal-rentang-jadwal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function setJadwalPreset(type) {
  const today = new Date();
  const formatYMD = d => d.toISOString().slice(0, 10);
  const startInput = document.getElementById('filter-jadwal-start');
  const endInput = document.getElementById('filter-jadwal-end');

  if (type === 'hari_ini') {
    startInput.value = formatYMD(today);
    endInput.value = formatYMD(today);
  } else if (type === 'minggu_ini') {
    const day = today.getDay() || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - day + 1);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    startInput.value = formatYMD(monday);
    endInput.value = formatYMD(sunday);
  } else if (type === 'bulan_ini') {
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    startInput.value = formatYMD(firstDay);
    endInput.value = formatYMD(lastDay);
  }
}

function applyJadwalFilter() {
  const start = document.getElementById('filter-jadwal-start').value;
  const end = document.getElementById('filter-jadwal-end').value;

  currentScheduleFilter.start = start;
  currentScheduleFilter.end = end;

  const labelEl = document.getElementById('label-rentang-jadwal');
  if (start && end) {
    currentScheduleFilter.label = `${formatDateShort(start)} - ${formatDateShort(end)}`;
  } else if (start) {
    currentScheduleFilter.label = `Mulai ${formatDateShort(start)}`;
  } else if (end) {
    currentScheduleFilter.label = `Hingga ${formatDateShort(end)}`;
  } else {
    currentScheduleFilter.label = 'Semua Jadwal (Aktif)';
  }

  if (labelEl) labelEl.textContent = currentScheduleFilter.label;
  closeModalRentangJadwal();
  renderTable();
  showToast(`Rentang jadwal disaring: ${currentScheduleFilter.label}`, 'info');
}

function resetJadwalFilter() {
  currentScheduleFilter = { start: '', end: '', label: 'Semua Jadwal (Aktif)' };
  const startInput = document.getElementById('filter-jadwal-start');
  const endInput = document.getElementById('filter-jadwal-end');
  if (startInput) startInput.value = '';
  if (endInput) endInput.value = '';

  const labelEl = document.getElementById('label-rentang-jadwal');
  if (labelEl) labelEl.textContent = 'Semua Jadwal (Aktif)';
  closeModalRentangJadwal();
  renderTable();
  showToast('Filter rentang jadwal direset ke semua data.', 'info');
}

// 7.2 Reschedule Existing Loan
function openModalRescheduleLoan() {
  const loan = loansData.find(l => l.id === currentSelectedLoanId);
  if (!loan) {
    showToast('Pilih permohonan peminjaman terlebih dahulu dari tabel.', 'error');
    return;
  }

  const modal = document.getElementById('modal-reschedule');
  if (modal) {
    document.getElementById('reschedule-loan-code').textContent = `${loan.id} • Status: ${loan.status}`;
    document.getElementById('reschedule-asset-name').textContent = `${loan.assetName} (${loan.assetCode || '-'})`;

    const todayStr = new Date().toISOString().slice(0, 10);
    const parsedStart = parseScheduleDate(loan) || todayStr;
    document.getElementById('reschedule-tgl-mulai').value = parsedStart;
    document.getElementById('reschedule-tgl-selesai').value = loan.tgl_kembali || parsedStart;
    document.getElementById('reschedule-reason').value = '';

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeModalReschedule() {
  const modal = document.getElementById('modal-reschedule');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

async function handleRescheduleSubmit(e) {
  e.preventDefault();
  const loan = loansData.find(l => l.id === currentSelectedLoanId);
  if (!loan) return;

  const tglMulai = document.getElementById('reschedule-tgl-mulai').value;
  const jamMulai = document.getElementById('reschedule-jam-mulai').value || '08:00';
  const tglSelesai = document.getElementById('reschedule-tgl-selesai').value;
  const jamSelesai = document.getElementById('reschedule-jam-selesai').value || '16:00';
  const reason = document.getElementById('reschedule-reason').value.trim();

  const formattedMulai = formatDateShort(tglMulai);
  const formattedSelesai = formatDateShort(tglSelesai);
  const newSchedule = formattedMulai === formattedSelesai
    ? `${formattedMulai} (${jamMulai} - ${jamSelesai})`
    : `${formattedMulai} s/d ${formattedSelesai} (${jamMulai} - ${jamSelesai})`;

  loan.tgl_pinjam = tglMulai;
  loan.tgl_kembali = tglSelesai;
  loan.schedule = newSchedule;
  loan.slots = [
    { time: 'Mulai', label: `${formattedMulai} ${jamMulai}`, chipClass: 'bg-[#e0f2fe] text-[#0369a1]' },
    { time: 'Target Kembali', label: `${formattedSelesai} ${jamSelesai}`, chipClass: 'bg-[#2563eb] text-white' }
  ];

  if (typeof API !== 'undefined' && loan.dbId) {
    try {
      await API.updateLoan(loan.dbId, {
        tgl_pinjam: tglMulai,
        tgl_kembali: tglSelesai,
        keperluan: reason ? `${loan.purpose} (Rescheduled: ${reason})` : loan.purpose
      });
    } catch (err) {
      console.warn('Backend update loan warning:', err);
    }
  }

  closeModalReschedule();
  selectLoan(loan.id);
  renderTable();
  showToast(`Jadwal untuk ${loan.id} berhasil diperbarui menjadi ${newSchedule}!`, 'success');
}

// 7.3 Inventory Asset Dropdown Population
function escapeHtmlAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function populateAssetDropdown(preselectKode = null, preselectNama = null, preselectLokasi = null) {
  const sarprasSelect = document.getElementById('form-sarpras');
  if (!sarprasSelect) return;

  let assets = [];
  if (typeof API !== 'undefined') {
    try {
      const res = await API.getAssets();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        assets = res.data.map(a => ({
          id: a.id,
          kode: a.kode || a.nup,
          nama: a.nama,
          kategori: a.kategori_nama || 'Elektronik',
          lokasi: a.lokasi ? `${a.gedung || ''} - ${a.lokasi}` : (a.gedung || 'Gedung Pusat'),
          status: a.status || 'Tersedia'
        }));
      }
    } catch (e) {
      console.warn('Backend getAssets error:', e);
    }
  }

  if (assets.length === 0) {
    try {
      const raw = localStorage.getItem('simas_assets_data');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          assets = parsed.map(a => ({
            id: a.id || null,
            kode: a.kode,
            nama: a.nama,
            kategori: a.kategori || 'Elektronik',
            lokasi: `${a.gedung || ''} - ${a.ruang || ''}`,
            status: a.status || 'Tersedia'
          }));
        }
      }
    } catch (e) {
      console.warn('localStorage read error:', e);
    }
  }

  if (assets.length === 0) {
    assets = [
      { id: 1, kode: 'AST-LPT-001', nama: 'Laptop ThinkPad T14 Gen 4 Intel Core i7', kategori: 'Elektronik', lokasi: 'Gedung A, Lt. 3', status: 'Tersedia' },
      { id: 8, kode: 'AST-PRJ-008', nama: 'Laser Projector Epson EB-L730U 7000 Lumens', kategori: 'Elektronik', lokasi: 'GKB, Lt. 1', status: 'Tersedia' },
      { id: 7, kode: 'AST-AUD-042', nama: 'Wireless Microphone Sennheiser EW-D Digital', kategori: 'Elektronik', lokasi: 'Auditorium Sasana', status: 'Tersedia' },
      { id: 2, kode: 'AST-LAB-012', nama: 'Mikroskop Binokuler Olympus CX23 LED', kategori: 'Alat Lab', lokasi: 'Lab Terpadu B.302', status: 'Tersedia' }
    ];
  }

  inventoryAssetsList = assets;

  const campusRooms = [
    { kode: 'FAC-RNG-004', nama: 'Auditorium Sasana Graha (Lt. 4)', kategori: 'Ruangan', lokasi: 'Gedung Rektorat Lt. 4', status: 'Tersedia', kapasitas: '350 Orang' },
    { kode: 'FAC-RNG-002', nama: 'Ruang Rapat Utama Dekanat (Lt. 2)', kategori: 'Ruangan', lokasi: 'Gedung B Lt. 2', status: 'Tersedia', kapasitas: '25 Orang' },
    { kode: 'FAC-RNG-001', nama: 'Ruang Multimedia & Teleconference (Lt. 1)', kategori: 'Ruangan', lokasi: 'Gedung A Lt. 1', status: 'Tersedia', kapasitas: '40 Orang' },
    { kode: 'FAC-LAB-003', nama: 'Laboratorium Komputasi & Jaringan A.201', kategori: 'Ruangan', lokasi: 'Gedung FT Lt. 2', status: 'Tersedia', kapasitas: '40 Orang' }
  ];

  // Known catalog quick-lookup fallback when only ?kode=... is provided
  const catalogQuickMap = {
    'AST-TI-2024-001': { nama: 'Laptop ASUS ROG Strix G16', lokasi: 'Lab Multimedia Lt. 3 - Gedung TI', kategori: 'elektronik' },
    'AST-TI-2024-002': { nama: 'Proyektor Epson EB-X500', lokasi: 'Ruang Seminar 302 - Gedung Utama', kategori: 'elektronik' },
    'AST-FT-2023-014': { nama: 'AC Daikin Inverter 2 PK', lokasi: 'Lab Jaringan Lt. 2 - Gedung Teknik', kategori: 'elektronik' },
    'AST-MIPA-2022-088': { nama: 'Mikroskop Olympus CX23', lokasi: 'Lab Biologi Dasar - Gedung MIPA', kategori: 'elektronik' },
    'AST-UM-2024-045': { nama: 'Sound System Yamaha StagePas', lokasi: 'Gudang Sarpras Pusat - Rektorat Lt. 1', kategori: 'elektronik' },
    'AST-TI-2024-012': { nama: 'Kamera Sony A6400 Kit 4K', lokasi: 'Gudang Sarpras Pusat', kategori: 'elektronik' },
    'SEM-TI-001': { nama: 'Ruang Seminar 1 (Gedung TI)', lokasi: 'Gedung TI Lt. 1', kategori: 'ruangan' }
  };

  let html = '<option value="" disabled selected>-- Pilih Sarana atau Ruangan dari Inventaris --</option>';

  html += '<optgroup label="Peralatan &amp; Aset Inventaris Terdaftar">';
  assets.forEach(a => {
    const isAvail = a.status === 'Tersedia';
    const statusTag = isAvail ? 'Tersedia' : a.status;
    html += `<option value="${escapeHtmlAttr(a.nama)}" data-id="${a.id || ''}" data-kode="${escapeHtmlAttr(a.kode)}" data-kategori="elektronik" data-status="${escapeHtmlAttr(a.status)}" data-lokasi="${escapeHtmlAttr(a.lokasi)}">${isAvail ? '✓' : '•'} [${escapeHtmlAttr(statusTag)}] ${escapeHtmlAttr(a.nama)} (${escapeHtmlAttr(a.kode)})</option>`;
  });
  html += '</optgroup>';

  html += '<optgroup label="Ruangan &amp; Fasilitas Gedung Kampus">';
  campusRooms.forEach(r => {
    html += `<option value="${escapeHtmlAttr(r.nama)}" data-id="" data-kode="${escapeHtmlAttr(r.kode)}" data-kategori="ruangan" data-status="${escapeHtmlAttr(r.status)}" data-lokasi="${escapeHtmlAttr(r.lokasi)}">✓ [${escapeHtmlAttr(r.status)}] ${escapeHtmlAttr(r.nama)} - Kapasitas ${escapeHtmlAttr(r.kapasitas)}</option>`;
  });
  html += '</optgroup>';

  sarprasSelect.innerHTML = html;

  if (preselectKode || preselectNama) {
    const kodeNeedle = (preselectKode || '').trim().toLowerCase();
    const namaNeedle = (preselectNama || '').trim().toLowerCase();

    let matched = Array.from(sarprasSelect.options).find(opt => {
      const optKode = (opt.dataset.kode || '').trim().toLowerCase();
      const optVal = (opt.value || '').trim().toLowerCase();
      if (kodeNeedle && optKode === kodeNeedle) return true;
      if (namaNeedle && optVal === namaNeedle) return true;
      if (kodeNeedle && optVal.includes(kodeNeedle)) return true;
      return false;
    });

    if (!matched) {
      const fallback = preselectKode ? catalogQuickMap[preselectKode] : null;
      const resolvedNama = (preselectNama && preselectNama.trim()) || (fallback && fallback.nama) || preselectKode;
      const resolvedKode = (preselectKode && preselectKode.trim()) || 'KATALOG-ASET';
      const resolvedLokasi = (preselectLokasi && preselectLokasi.trim()) || (fallback && fallback.lokasi) || 'Inventaris Kampus';
      const isRoomItem = (fallback && fallback.kategori === 'ruangan') || /ruang|aula|lab|seminar|auditorium/i.test(resolvedNama);

      const selectedGroup = document.createElement('optgroup');
      selectedGroup.label = 'Sarana Terpilih dari Katalog';
      const opt = document.createElement('option');
      opt.value = resolvedNama;
      opt.dataset.id = '';
      opt.dataset.kode = resolvedKode;
      opt.dataset.kategori = isRoomItem ? 'ruangan' : 'elektronik';
      opt.dataset.status = 'Tersedia';
      opt.dataset.lokasi = resolvedLokasi;
      opt.textContent = `✓ [Terpilih] ${resolvedNama} (${resolvedKode})`;
      selectedGroup.appendChild(opt);

      // Insert right after the placeholder option
      if (sarprasSelect.children.length > 1) {
        sarprasSelect.insertBefore(selectedGroup, sarprasSelect.children[1]);
      } else {
        sarprasSelect.appendChild(selectedGroup);
      }
      matched = opt;
    }

    if (matched) {
      matched.selected = true;
      sarprasSelect.value = matched.value;
      handleAssetSelectChange();
    }
  }
}

function handleAssetSelectChange() {
  const select = document.getElementById('form-sarpras');
  const infoBox = document.getElementById('form-sarpras-info');
  const descEl = document.getElementById('form-sarpras-desc');
  const badgeEl = document.getElementById('form-sarpras-badge');

  if (!select || !infoBox || select.selectedIndex < 0) return;
  const opt = select.options[select.selectedIndex];
  if (!opt || !opt.value) {
    infoBox.classList.add('hidden');
    return;
  }

  const kode = opt.dataset.kode || '-';
  const lokasi = opt.dataset.lokasi || '-';
  const status = opt.dataset.status || 'Tersedia';
  const isAvail = status === 'Tersedia';

  descEl.textContent = `Kode: ${kode} • Lokasi: ${lokasi}`;
  badgeEl.textContent = status;
  badgeEl.className = isAvail
    ? 'px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800'
    : 'px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800';

  infoBox.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

// 7.4 Form Pengajuan Peminjaman Modal
async function openModalAjukan(preselectKode = null, preselectNama = null, preselectLokasi = null) {
  if (typeof requirePermission === 'function') {
    if (!requirePermission('loans:create', 'Mengajukan Peminjaman Sarana')) return;
  }
  const modal = document.getElementById('modal-ajukan');
  if (modal) {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (user) {
      const inputPemohon = document.getElementById('form-pemohon');
      const inputUnit = document.getElementById('form-unit');
      if (inputPemohon && !inputPemohon.value) inputPemohon.value = user.nama || user.name || '';
      if (inputUnit && !inputUnit.value) inputUnit.value = user.unit || user.unit_kerja || user.divisi || user.jabatan || '';
    }

    // Set default dates (local timezone, no UTC shift)
    const toLocalDateStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const today = new Date();
    const todayStr = toLocalDateStr(today);
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const tomorrowStr = toLocalDateStr(tomorrow);

    const tglMulaiInput = document.getElementById('form-tgl-mulai');
    const tglSelesaiInput = document.getElementById('form-tgl-selesai');
    const jamMulaiInput = document.getElementById('form-jam-mulai');
    const jamSelesaiInput = document.getElementById('form-jam-selesai');
    if (tglMulaiInput && !tglMulaiInput.value) tglMulaiInput.value = todayStr;
    if (tglSelesaiInput && !tglSelesaiInput.value) tglSelesaiInput.value = tomorrowStr;
    if (jamMulaiInput && !jamMulaiInput.value) jamMulaiInput.value = '08:00';
    if (jamSelesaiInput && !jamSelesaiInput.value) jamSelesaiInput.value = '17:00';

    await populateAssetDropdown(preselectKode, preselectNama, preselectLokasi);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) window.lucide.createIcons();

    // If pre-selected from catalog, focus directly on date/agenda so user can finish fast
    if (preselectKode || preselectNama) {
      const agendaEl = document.getElementById('form-agenda');
      if (agendaEl) setTimeout(() => agendaEl.focus(), 60);
    }
  }
}

function closeModalAjukan() {
  const modal = document.getElementById('modal-ajukan');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();
  if (typeof requirePermission === 'function') {
    if (!requirePermission('loans:create', 'Mengajukan Peminjaman Sarana')) return;
  }

  const pemohon = document.getElementById('form-pemohon').value.trim();
  const unit = document.getElementById('form-unit').value.trim();
  const sarprasSelect = document.getElementById('form-sarpras');
  const selectedOpt = sarprasSelect.options[sarprasSelect.selectedIndex];

  if (!selectedOpt || !selectedOpt.value) {
    showToast('Silakan pilih sarana atau ruangan dari inventaris terlebih dahulu.', 'error');
    return;
  }

  const sarpras = selectedOpt.value;
  const assetId = selectedOpt.dataset.id ? parseInt(selectedOpt.dataset.id) : null;
  const assetCode = selectedOpt.dataset.kode || `AST-${String(Math.floor(Math.random() * 800) + 100)}`;
  const assetCategory = selectedOpt.dataset.kategori || 'elektronik';
  const assetStatus = selectedOpt.dataset.status || 'Tersedia';

  const tglMulai = document.getElementById('form-tgl-mulai').value;
  const jamMulai = document.getElementById('form-jam-mulai').value || '08:00';
  const tglSelesai = document.getElementById('form-tgl-selesai').value;
  const jamSelesai = document.getElementById('form-jam-selesai').value || '17:00';
  const peserta = document.getElementById('form-peserta').value || '1';
  const agenda = document.getElementById('form-agenda').value.trim();

  const tglPinjamFull = tglMulai ? `${tglMulai} ${jamMulai}` : '';
  const tglKembaliFull = tglSelesai ? `${tglSelesai} ${jamSelesai}` : '';

  const formattedMulai = formatDateShort(tglMulai);
  const formattedSelesai = formatDateShort(tglSelesai);
  const jadwal = formattedMulai === formattedSelesai
    ? `${formattedMulai} (${jamMulai} - ${jamSelesai})`
    : `${formattedMulai} s/d ${formattedSelesai} (${jamMulai} - ${jamSelesai})`;

  if (typeof API !== 'undefined') {
    const res = await API.createLoan({
      asset_id: assetId,
      asset_nama: sarpras,
      peminjam_nama: pemohon,
      peminjam_nip: unit,
      keperluan: agenda,
      tgl_pinjam: tglPinjamFull,
      tgl_kembali: tglKembaliFull
    });
    if (res && res.success) {
      showToast(res.message || 'Permohonan peminjaman berhasil diajukan!', 'success');
      closeModalAjukan();
      e.target.reset();
      await loadLoansFromBackend();
      return;
    }
  }

  const newId = `LOAN - 2025 - 0${String(Math.floor(Math.random() * 800) + 100)}`;
  const initials = pemohon.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const isRoom = sarpras.toLowerCase().includes('ruang') || sarpras.toLowerCase().includes('auditorium') || assetCategory === 'ruangan';

  const newLoan = {
    id: newId,
    subId: 'Baru saja',
    isOverdue: false,
    requesterInitials: initials || 'US',
    requesterColor: 'bg-[#1e3a8a] text-white',
    requesterName: pemohon,
    requesterDept: unit,
    requesterDivisi: unit,
    assetIcon: isRoom ? 'building-2' : 'laptop',
    assetName: sarpras,
    assetCode: assetCode,
    schedule: jadwal,
    tgl_pinjam: tglMulai,
    tgl_kembali: tglSelesai,
    purpose: agenda.length > 25 ? agenda.substring(0, 25) + '...' : agenda,
    fullPurpose: `“${agenda}”`,
    status: 'Diajukan',
    statusBadgeClass: 'bg-[#5eead4] text-[#0f766e]',
    statusIcon: 'clock',
    attendees: `${peserta} Orang`,
    category: isRoom ? 'ruangan' : 'elektronik',
    antiConflictText: `Permohonan baru untuk ${sarpras} berhasil tercatat pada sistem reservasi. Bebas bentrok.`,
    availabilityBadge: assetStatus.toUpperCase(),
    slots: [
      { time: 'Mulai', label: `${formattedMulai} ${jamMulai}`, chipClass: 'bg-[#e0f2fe] text-[#0369a1]' },
      { time: 'Target Kembali', label: `${formattedSelesai} ${jamSelesai}`, chipClass: 'bg-[#2563eb] text-white' }
    ],
    checklists: [
      { title: 'Verifikasi Ketersediaan Unit', desc: 'Petugas sarpras telah menandai pemesanan ke sistem kalender terpusat.' },
      { title: 'Pengecekan Fungsi & Kelayakan', desc: 'Pengecekan fisik akan dilakukan H-1 sebelum penyerahan aset.' }
    ]
  };

  loansData.unshift(newLoan);
  closeModalAjukan();
  selectLoan(newId);
  renderTable();
  showToast(`Permohonan ${newId} berhasil diajukan!`, 'success');
  e.target.reset();
}

async function approveSelectedLoan() {
  if (typeof requirePermission === 'function') {
    if (!requirePermission('loans:approve', 'Menyetujui Permohonan Peminjaman')) return;
  }
  const loan = loansData.find(l => l.id === currentSelectedLoanId);
  if (loan) {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const approverName = user ? `${user.nama || user.name || user.username} (${user.role})` : 'Admin Sarpras';
    loan.status = 'Aktif';
    loan.statusBadgeClass = 'bg-[#ccfbf1] text-[#0f766e]';
    loan.statusIcon = 'check-circle';
    if (typeof API !== 'undefined' && loan.dbId) {
      await API.approveLoan(loan.dbId, approverName);
    }
    selectLoan(loan.id);
    renderTable();
    showToast(`Permohonan ${loan.id} berhasil disetujui oleh ${approverName}!`, 'success');
  }
}

async function rejectSelectedLoan() {
  if (typeof requirePermission === 'function') {
    if (!requirePermission('loans:approve', 'Menolak Permohonan Peminjaman')) return;
  }
  const loan = loansData.find(l => l.id === currentSelectedLoanId);
  if (loan) {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const rejecterName = user ? `${user.nama || user.name || user.username} (${user.role})` : 'Pimpinan';
    loan.status = 'Ditolak';
    loan.statusBadgeClass = 'bg-[#fee2e2] text-[#991b1b]';
    loan.statusIcon = 'x-circle';
    if (typeof API !== 'undefined' && loan.dbId) {
      await API.rejectLoan(loan.dbId, 'Pengajuan ditolak oleh pimpinan/admin', rejecterName);
    }
    selectLoan(loan.id);
    renderTable();
    showToast(`Permohonan ${loan.id} telah ditolak.`, 'info');
  }
}

async function returnSelectedLoan() {
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const isPeminjam = user && user.role === 'peminjam';
  const required = isPeminjam ? 'loans:return_own' : 'loans:return';
  if (typeof requirePermission === 'function') {
    if (!requirePermission(required, 'Mengajukan / Memproses Pengembalian Aset')) return;
  }
  const loan = loansData.find(l => l.id === currentSelectedLoanId);
  if (loan) {
    if (typeof API !== 'undefined' && loan.dbId) {
      const res = await API.returnLoan(loan.dbId);
      if (res && res.success) {
        showToast(res.message || `Aset peminjaman ${loan.id} berhasil dikembalikan!`, 'success');
        await loadLoansFromBackend();
        return;
      }
    }
    loan.status = 'Selesai';
    loan.statusBadgeClass = 'bg-slate-100 text-slate-700';
    loan.statusIcon = 'check';
    selectLoan(loan.id);
    renderTable();
    showToast(`Aset peminjaman ${loan.id} berhasil dikembalikan ke sarpras!`, 'success');
  }
}

async function loadLoansFromBackend() {
  if (typeof API !== 'undefined') {
    const res = await API.getLoans();
    if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
      loansData = res.data.map(l => {
        const s = l.status || 'Menunggu Approval';
        const sNorm = s.toLowerCase();
        let badgeClass = 'bg-[#5eead4] text-[#0f766e]';
        let icon = 'clock';

        if (sNorm === 'aktif' || sNorm === 'disetujui' || sNorm === 'sedang dipinjam') {
          badgeClass = 'bg-[#ccfbf1] text-[#0f766e]';
          icon = 'check-circle';
        } else if (sNorm === 'selesai' || sNorm === 'dikembalikan') {
          badgeClass = 'bg-slate-100 text-slate-700';
          icon = 'check';
        } else if (sNorm === 'ditolak') {
          badgeClass = 'bg-[#fee2e2] text-[#991b1b]';
          icon = 'x-circle';
        } else if (sNorm === 'terlambat') {
          badgeClass = 'bg-[#991b1b] text-white';
          icon = 'alert-triangle';
        }

        return {
          id: l.kode,
          dbId: l.id,
          subId: l.tgl_pinjam || 'Terjadwal',
          isOverdue: sNorm === 'terlambat',
          requesterInitials: (l.peminjam_nama || 'US').slice(0, 2).toUpperCase(),
          requesterColor: 'bg-[#1e3a8a] text-white',
          requesterName: l.peminjam_nama,
          requesterDept: l.peminjam_nip || 'Civitas Akademika',
          requesterDivisi: l.peminjam_nip || 'Peminjam',
          assetIcon: (l.asset_nama || '').toLowerCase().includes('ruang') || (l.asset_nama || '').toLowerCase().includes('auditorium') ? 'building-2' : 'laptop',
          assetName: l.asset_nama,
          assetCode: `AST-${l.asset_id || '01'}`,
          schedule: `${l.tgl_pinjam} s/d ${l.tgl_kembali}`,
          purpose: l.keperluan || 'Kegiatan Institusi',
          fullPurpose: `“${l.keperluan || '-'}”`,
          status: s,
          statusBadgeClass: badgeClass,
          statusIcon: icon,
          attendees: '1 Kegiatan',
          category: (l.asset_nama || '').toLowerCase().includes('ruang') || (l.asset_nama || '').toLowerCase().includes('auditorium') ? 'ruangan' : 'elektronik',
          antiConflictText: 'Telah terverifikasi pada sistem backend SIMAS SQLite.',
          availabilityBadge: 'TERCATAT',
          slots: [
            { time: 'Mulai', label: l.tgl_pinjam, chipClass: 'bg-[#e0f2fe] text-[#0369a1]' },
            { time: 'Target Kembali', label: l.tgl_kembali, chipClass: 'bg-[#2563eb] text-white' }
          ],
          checklists: [
            { title: 'Status Otorisasi', desc: `Persetujuan: ${l.approved_by || 'Menunggu verifikasi'}` }
          ]
        };
      });

      if (loansData.length > 0) {
        const stillSelected = loansData.find(l => l.id === currentSelectedLoanId);
        if (!stillSelected) {
          currentSelectedLoanId = loansData[0].id;
        }
        selectLoan(currentSelectedLoanId);
      }
      renderTable();
      if (typeof syncPdfLoansFromRaw === 'function') {
        syncPdfLoansFromRaw(res.data);
      }
    } else if (res && res.success && Array.isArray(res.data) && res.data.length === 0) {
      // Backend aktif tetapi tabel loans masih kosong
      loansData = [];
      pdfBackendLoans = [];
      renderTable();
      renderEmptyDetail();
      renderPdfPeminjamanView();
    }
  }
}

// ===================== 8. EKSPOR LOG (CSV DOWNLOAD) =====================

function exportLoansCSV() {
  const headers = ['ID PINJAM', 'STATUS', 'PEMOHON', 'UNIT KERJA', 'ASET/FASILITAS', 'KODE ASET', 'JADWAL', 'AGENDA'];
  const rows = loansData.map(l => [
    `"${(l.id || '').replace(/"/g, '""')}"`,
    `"${(l.status || '').replace(/"/g, '""')}"`,
    `"${(l.requesterName || '').replace(/"/g, '""')}"`,
    `"${(l.requesterDept || '').replace(/"/g, '""')}"`,
    `"${(l.assetName || '').replace(/"/g, '""')}"`,
    `"${(l.assetCode || '').replace(/"/g, '""')}"`,
    `"${(l.schedule || '').replace(/"/g, '""')}"`,
    `"${(l.fullPurpose || '').replace(/"/g, '""')}"`
  ]);

  const BOM = '\uFEFF';
  const delimiter = ';';
  const csvContent = BOM + [headers.join(delimiter), ...rows.map(e => e.join(delimiter))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SIMAS_Log_Peminjaman_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('File CSV Log Peminjaman berhasil diunduh.', 'success');
}

// ===================== 9. TOAST NOTIFICATION =====================

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-emerald-800 text-white' : type === 'error' ? 'bg-rose-800 text-white' : 'bg-slate-900 text-white';
  const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-triangle' : 'info';

  toast.className = `toast-item flex items-center gap-2 px-3.5 py-2 rounded-xl shadow-lg text-xs font-semibold ${bgClass} transform transition-all duration-300 translate-y-2 opacity-0`;
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

// ===================== 10. PDF PAGE 7 UI RENDERER =====================

const pdfLoansCardsDefault = [];

let pdfLoanTabFilter = 'all';
let pdfBackendLoans = [];

function mapBackendLoanToPdfCard(l) {
  const s = l.status || 'Menunggu Approval';
  const sNorm = s.toLowerCase();
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const role = user ? user.role : 'admin';
  const isPeminjam = role === 'peminjam';
  const canApprove = typeof hasPermission === 'function' ? hasPermission('loans:approve') : (role === 'admin' || role === 'pimpinan');
  const canVerifyReturn = role === 'admin' || role === 'petugas';

  const isMine = !!(user && (
    (l.peminjam_nama && user.nama && l.peminjam_nama.toLowerCase().includes(user.nama.split(',')[0].toLowerCase())) ||
    (l.peminjam_nip && user.nip && String(l.peminjam_nip) === String(user.nip)) ||
    (l.peminjam_nama && user.username && l.peminjam_nama.toLowerCase().includes(user.username.toLowerCase()))
  ));

  let statusKey = 'pending';
  let statusText = 'MENUNGGU APPROVAL';
  let statusClass = 'bg-amber-50 text-amber-700';
  let actionLabel = canApprove ? 'Review Approval →' : 'Detail Pengajuan';
  let actionPrimary = canApprove;
  let actionType = canApprove ? 'review' : 'detail';
  let actionStyle = 'primary';

  if (sNorm.includes('verifikasi')) {
    statusKey = 'verify';
    statusText = 'VERIFIKASI KEMBALI';
    statusClass = 'bg-purple-50 text-purple-700';
    if (canVerifyReturn) {
      actionLabel = 'Verifikasi Kembali ✓';
      actionPrimary = true;
      actionType = 'verify-return';
      actionStyle = 'emerald';
    } else {
      actionLabel = 'Menunggu Cek Petugas';
      actionPrimary = false;
      actionType = 'detail';
    }
  } else if (sNorm === 'aktif' || sNorm === 'disetujui' || sNorm === 'sedang dipinjam') {
    statusKey = 'active';
    statusText = 'SEDANG DIPINJAM';
    statusClass = 'bg-blue-50 text-blue-700';
    if (isPeminjam && isMine) {
      actionLabel = 'Kembalikan Barang';
      actionPrimary = true;
      actionType = 'request-return';
      actionStyle = 'emerald';
    } else if (canVerifyReturn) {
      actionLabel = 'Terima Kembali ✓';
      actionPrimary = true;
      actionType = 'verify-return';
      actionStyle = 'emerald';
    } else {
      actionLabel = 'Detail SPK';
      actionPrimary = false;
      actionType = 'detail';
    }
  } else if (sNorm === 'selesai' || sNorm === 'dikembalikan') {
    statusKey = 'completed';
    statusText = 'SELESAI & KEMBALI';
    statusClass = 'bg-emerald-50 text-emerald-700';
    actionLabel = 'Detail SPK';
    actionPrimary = false;
    actionType = 'detail';
  } else if (sNorm === 'ditolak') {
    statusKey = 'completed';
    statusText = 'DITOLAK';
    statusClass = 'bg-rose-50 text-rose-700';
    actionLabel = 'Detail Pengajuan';
    actionPrimary = false;
    actionType = 'detail';
  }

  return {
    code: l.kode || `LOAN-${l.id}`,
    dbId: l.id,
    borrower: l.peminjam_nama || 'Pemohon Sarpras',
    items: l.asset_nama || 'Sarana Kampus',
    purpose: `Keperluan: ${l.keperluan || 'Kegiatan Akademik / Reservasi'}`,
    rawPurpose: l.keperluan || 'Kegiatan Akademik / Reservasi',
    catatan: l.catatan || '',
    startDate: l.tgl_pinjam || '-',
    endDate: l.tgl_kembali || '-',
    status: statusText,
    statusKey,
    statusClass,
    actionLabel,
    actionPrimary,
    actionType,
    actionStyle,
    isMine,
    fromDb: true
  };
}

function syncPdfLoansFromRaw(rawLoans) {
  if (!Array.isArray(rawLoans)) return;
  pdfBackendLoans = rawLoans.map(mapBackendLoanToPdfCard);
  renderPdfPeminjamanView();
}

function getMergedPdfLoanCards() {
  const seen = new Set(pdfBackendLoans.map(l => l.code));
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const role = user ? user.role : 'admin';
  const canApprove = typeof hasPermission === 'function' ? hasPermission('loans:approve') : (role === 'admin' || role === 'pimpinan');
  const canVerifyReturn = role === 'admin' || role === 'petugas';

  const defaults = pdfLoansCardsDefault
    .filter(d => !seen.has(d.code))
    .map(d => {
      let actionLabel = d.actionLabel;
      let actionPrimary = d.actionPrimary;
      let actionType = 'detail';
      let actionStyle = 'primary';

      if (d.statusKey === 'pending') {
        actionLabel = canApprove ? 'Review Approval →' : 'Detail Pengajuan';
        actionPrimary = canApprove;
        actionType = canApprove ? 'review' : 'detail';
      } else if (d.statusKey === 'active' && canVerifyReturn) {
        actionLabel = 'Terima Kembali ✓';
        actionPrimary = true;
        actionType = 'verify-return';
        actionStyle = 'emerald';
      } else if (d.statusKey === 'verify' && canVerifyReturn) {
        actionLabel = 'Verifikasi Kembali ✓';
        actionPrimary = true;
        actionType = 'verify-return';
        actionStyle = 'emerald';
      }

      return {
        ...d,
        rawPurpose: (d.purpose || '').replace(/^Keperluan:\s*/i, ''),
        catatan: '',
        actionLabel,
        actionPrimary,
        actionType,
        actionStyle,
        isMine: false,
        fromDb: false
      };
    });

  const combined = [...pdfBackendLoans, ...defaults];
  if (user && user.role === 'peminjam') {
    const mine = combined.filter(c => c.isMine);
    const others = combined.filter(c => !c.isMine);
    return [...mine, ...others];
  }
  return combined;
}

window.setPdfLoanTab = function(tab) {
  pdfLoanTabFilter = tab;
  renderPdfPeminjamanView();
};

function closePdfLoanActionModal() {
  const el = document.getElementById('modal-pdf-loan-action');
  if (el) el.remove();
}
window.closePdfLoanActionModal = closePdfLoanActionModal;

function openPdfLoanActionModal(item, mode) {
  closePdfLoanActionModal();
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

  let title = `Detail Peminjaman #${escapeHtmlAttr(item.code)}`;
  let headerBg = 'bg-[#eef4ff]';
  let bodyExtra = '';
  let footerButtons = `
    <button type="button" onclick="closePdfLoanActionModal()" class="px-4 py-2 rounded-xl bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold cursor-pointer">Tutup</button>
  `;

  if (mode === 'review') {
    title = `Review Approval #${escapeHtmlAttr(item.code)}`;
    bodyExtra = `
      <div>
        <label for="modal-loan-note" class="block text-[11px] font-bold text-slate-700 mb-1">Catatan Otorisasi / Alasan Penolakan (Opsional)</label>
        <textarea id="modal-loan-note" rows="2" placeholder="Contoh: Disetujui untuk kegiatan akademik, atau tulis alasan jika ditolak..." class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"></textarea>
      </div>
    `;
    footerButtons = `
      <button type="button" onclick="closePdfLoanActionModal()" class="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold cursor-pointer">Batal</button>
      <button type="button" onclick="executePdfLoanReject('${escapeHtmlAttr(item.code)}')" class="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer">Tolak</button>
      <button type="button" onclick="executePdfLoanApprove('${escapeHtmlAttr(item.code)}')" class="px-4 py-2 rounded-xl bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold cursor-pointer">Setujui &amp; Terbitkan SPK</button>
    `;
  } else if (mode === 'request-return') {
    title = `Pengembalian Barang #${escapeHtmlAttr(item.code)}`;
    headerBg = 'bg-emerald-50';
    bodyExtra = `
      <div class="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-900 leading-relaxed">
        Setelah Anda mengajukan pengembalian, status pinjaman akan masuk ke tahap <strong>Verifikasi Kembali</strong> agar Petugas Sarpras dapat mengecek kelengkapan fisik dan menyelesaikan SPK Anda.
      </div>
      <div>
        <label for="modal-loan-note" class="block text-[11px] font-bold text-slate-700 mb-1">Catatan Kondisi Barang saat Dikembalikan</label>
        <textarea id="modal-loan-note" rows="2" placeholder="Contoh: Unit lengkap (charger, tas, kabel), kondisi fisik baik dan sudah diserahkan di loket Sarpras." class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"></textarea>
      </div>
    `;
    footerButtons = `
      <button type="button" onclick="closePdfLoanActionModal()" class="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold cursor-pointer">Batal</button>
      <button type="button" onclick="executePdfLoanRequestReturn('${escapeHtmlAttr(item.code)}')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer">Ajukan Pengembalian ✓</button>
    `;
  } else if (mode === 'verify-return') {
    title = `Verifikasi Pengembalian #${escapeHtmlAttr(item.code)}`;
    headerBg = 'bg-emerald-50';
    bodyExtra = `
      <div class="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-[#0f2a71] leading-relaxed">
        Konfirmasi bahwa unit/ruangan telah dikembalikan secara fisik. Status transaksi akan menjadi <strong>SELESAI &amp; KEMBALI</strong> dan stok aset otomatis kembali <strong>Tersedia</strong>.
      </div>
      <div>
        <label for="modal-loan-note" class="block text-[11px] font-bold text-slate-700 mb-1">Hasil Cek Fisik Petugas</label>
        <textarea id="modal-loan-note" rows="2" placeholder="Contoh: Cek fisik lengkap, berfungsi normal, tidak ada kerusakan." class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"></textarea>
      </div>
    `;
    footerButtons = `
      <button type="button" onclick="closePdfLoanActionModal()" class="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold cursor-pointer">Batal</button>
      <button type="button" onclick="executePdfLoanVerifyReturn('${escapeHtmlAttr(item.code)}')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer">Verifikasi &amp; Selesaikan ✓</button>
    `;
  }

  const modal = document.createElement('div');
  modal.id = 'modal-pdf-loan-action';
  modal.className = 'fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between ${headerBg}">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8]">${escapeHtmlAttr(item.code)}</span>
          <h3 class="text-sm font-extrabold text-slate-900 mt-0.5">${title}</h3>
        </div>
        <button type="button" onclick="closePdfLoanActionModal()" class="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="p-5 space-y-3.5 text-xs">
        <div class="flex items-center justify-between gap-2">
          <span class="text-slate-500 font-semibold">Status Saat Ini</span>
          <span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${item.statusClass}">${escapeHtmlAttr(item.status)}</span>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div><span class="text-slate-500">Pemohon:</span> <strong class="text-slate-900">${escapeHtmlAttr(item.borrower)}</strong></div>
          <div><span class="text-slate-500">Sarana / Ruang:</span> <strong class="text-slate-900">${escapeHtmlAttr(item.items)}</strong></div>
          <div><span class="text-slate-500">Jadwal:</span> <strong class="text-slate-800">${escapeHtmlAttr(item.startDate)} s/d ${escapeHtmlAttr(item.endDate)}</strong></div>
          <div><span class="text-slate-500">Keperluan:</span> <span class="text-slate-700">${escapeHtmlAttr(item.rawPurpose || item.purpose)}</span></div>
          ${item.catatan ? `<div class="pt-1 border-t border-slate-200/70"><span class="text-slate-500">Catatan:</span> <span class="text-slate-700">${escapeHtmlAttr(item.catatan)}</span></div>` : ''}
        </div>
        ${bodyExtra}
        <div class="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          ${footerButtons}
        </div>
      </div>
    </div>
  `;
  modal.addEventListener('click', (e) => { if (e.target === modal) closePdfLoanActionModal(); });
  document.body.appendChild(modal);
  if (window.lucide) lucide.createIcons();
}

window.executePdfLoanApprove = async function(code) {
  const allCards = getMergedPdfLoanCards();
  const item = allCards.find(l => l.code === code);
  if (!item) return;
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const approverName = user ? `${user.nama || user.username} (${user.role})` : 'Admin Sarpras';

  if (item.fromDb && item.dbId && typeof API !== 'undefined') {
    const res = await API.approveLoan(item.dbId, approverName);
    if (res && res.success) {
      closePdfLoanActionModal();
      showToast(`Permohonan ${code} (${item.borrower}) berhasil disetujui & SPK diterbitkan!`, 'success');
      await loadLoansFromBackend();
      return;
    }
  }
  const localDefault = pdfLoansCardsDefault.find(l => l.code === code);
  if (localDefault) {
    localDefault.status = 'SEDANG DIPINJAM';
    localDefault.statusKey = 'active';
    localDefault.statusClass = 'bg-blue-50 text-blue-700';
    localDefault.actionLabel = 'Detail SPK';
    localDefault.actionPrimary = false;
  }
  closePdfLoanActionModal();
  showToast(`Permohonan ${code} (${item.borrower}) berhasil disetujui & SPK diterbitkan!`, 'success');
  renderPdfPeminjamanView();
};

window.executePdfLoanReject = async function(code) {
  const allCards = getMergedPdfLoanCards();
  const item = allCards.find(l => l.code === code);
  if (!item) return;
  const noteEl = document.getElementById('modal-loan-note');
  const reason = (noteEl && noteEl.value.trim()) || 'Pengajuan tidak disetujui oleh pimpinan/admin.';
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const rejecterName = user ? `${user.nama || user.username} (${user.role})` : 'Admin Sarpras';

  if (item.fromDb && item.dbId && typeof API !== 'undefined') {
    const res = await API.rejectLoan(item.dbId, reason, rejecterName);
    if (res && res.success) {
      closePdfLoanActionModal();
      showToast(`Permohonan ${code} telah ditolak.`, 'info');
      await loadLoansFromBackend();
      return;
    }
  }
  const localDefault = pdfLoansCardsDefault.find(l => l.code === code);
  if (localDefault) {
    localDefault.status = 'DITOLAK';
    localDefault.statusKey = 'completed';
    localDefault.statusClass = 'bg-rose-50 text-rose-700';
    localDefault.actionLabel = 'Detail Pengajuan';
    localDefault.actionPrimary = false;
  }
  closePdfLoanActionModal();
  showToast(`Permohonan ${code} telah ditolak.`, 'info');
  renderPdfPeminjamanView();
};

window.executePdfLoanRequestReturn = async function(code) {
  const allCards = getMergedPdfLoanCards();
  const item = allCards.find(l => l.code === code);
  if (!item) return;
  const noteEl = document.getElementById('modal-loan-note');
  const catatan = (noteEl && noteEl.value.trim()) || 'Unit lengkap dan kondisi baik, diserahkan ke loket Sarpras.';
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const requesterName = user ? (user.nama || user.username) : item.borrower;

  if (item.fromDb && item.dbId && typeof API !== 'undefined') {
    const res = await API.requestReturnLoan(item.dbId, catatan, requesterName);
    if (res && res.success) {
      closePdfLoanActionModal();
      showToast(res.message || `Pengembalian ${code} berhasil diajukan! Menunggu verifikasi Petugas.`, 'success');
      await loadLoansFromBackend();
      return;
    }
  }
  const localDefault = pdfLoansCardsDefault.find(l => l.code === code);
  if (localDefault) {
    localDefault.status = 'VERIFIKASI KEMBALI';
    localDefault.statusKey = 'verify';
    localDefault.statusClass = 'bg-purple-50 text-purple-700';
  }
  closePdfLoanActionModal();
  showToast(`Pengembalian ${code} diajukan! Menunggu verifikasi Petugas Sarpras.`, 'success');
  renderPdfPeminjamanView();
};

window.executePdfLoanVerifyReturn = async function(code) {
  const allCards = getMergedPdfLoanCards();
  const item = allCards.find(l => l.code === code);
  if (!item) return;
  const noteEl = document.getElementById('modal-loan-note');
  const catatan = (noteEl && noteEl.value.trim()) || 'Kondisi fisik lengkap & berfungsi baik.';
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const verifierName = user ? `${user.nama || user.username} (${user.role})` : 'Petugas Sarpras';

  if (item.fromDb && item.dbId && typeof API !== 'undefined') {
    const res = await API.returnLoan(item.dbId, verifierName, catatan);
    if (res && res.success) {
      closePdfLoanActionModal();
      showToast(res.message || `Pengembalian ${code} berhasil diverifikasi & selesai!`, 'success');
      await loadLoansFromBackend();
      return;
    }
  }
  const localDefault = pdfLoansCardsDefault.find(l => l.code === code);
  if (localDefault) {
    localDefault.status = 'SELESAI & KEMBALI';
    localDefault.statusKey = 'completed';
    localDefault.statusClass = 'bg-emerald-50 text-emerald-700';
    localDefault.actionLabel = 'Detail SPK';
    localDefault.actionPrimary = false;
  }
  closePdfLoanActionModal();
  showToast(`Pengembalian ${code} berhasil diverifikasi & selesai!`, 'success');
  renderPdfPeminjamanView();
};

window.handlePdfLoanCardAction = async function(code) {
  const allCards = getMergedPdfLoanCards();
  const item = allCards.find(l => l.code === code);
  if (!item) return;
  openPdfLoanActionModal(item, item.actionType || 'detail');
};

function renderPdfPeminjamanView() {
  const mainEl = document.querySelector('main');
  if (!mainEl) return;

  Array.from(mainEl.children).forEach(ch => {
    if (ch.id !== 'simas-pdf-peminjaman-root' && !ch.id?.startsWith('modal-')) {
      ch.classList.add('hidden');
    }
  });

  let root = document.getElementById('simas-pdf-peminjaman-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'simas-pdf-peminjaman-root';
    mainEl.prepend(root);
  }

  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const role = user ? user.role : 'admin';
  const isPeminjam = role === 'peminjam';
  const canCreateLoan = typeof hasPermission === 'function' ? hasPermission('loans:create') : (role !== 'pimpinan');
  const allCards = getMergedPdfLoanCards();

  const pendingCount = allCards.filter(c => c.statusKey === 'pending').length;
  const activeCount = allCards.filter(c => c.statusKey === 'active').length;
  const verifyCount = allCards.filter(c => c.statusKey === 'verify').length;
  const completedCount = allCards.filter(c => c.statusKey === 'completed').length;

  const filteredCards = allCards.filter(c => {
    if (pdfLoanTabFilter === 'all') return true;
    return c.statusKey === pdfLoanTabFilter;
  });

  const tabs = [
    { key: 'all', label: `Semua (${allCards.length})` },
    { key: 'pending', label: `Menunggu Approval (${pendingCount})` },
    { key: 'active', label: `Sedang Berjalan (${activeCount})` },
    { key: 'verify', label: `Verifikasi Kembali (${verifyCount})` },
    { key: 'completed', label: `Selesai (${completedCount})` }
  ];

  root.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
      <!-- Top Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 class="text-base font-bold text-slate-900">${isPeminjam ? 'Peminjaman Saya &amp; Riwayat Booking Ruangan' : 'Sirkulasi Peminjaman Sarana &amp; Prasarana'}</h2>
        <div class="flex items-center gap-2.5">
          ${!isPeminjam ? `
            <button type="button" onclick="exportLoansCSV()" class="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer">
              Unduh Rekap SPK (CSV)
            </button>
          ` : ''}
          ${canCreateLoan ? `
            <button type="button" onclick="openModalAjukan()" class="px-4 py-2 rounded-lg bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition cursor-pointer">
              ${isPeminjam ? '+ Buat Peminjaman Baru' : '+ Catat Peminjaman (Loket)'}
            </button>
          ` : ''}
        </div>
      </div>

      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div class="rounded-xl border border-slate-200/90 bg-slate-50/40 p-4">
          <div class="text-xs font-semibold text-slate-500">Permohonan Baru</div>
          <div class="text-xl font-extrabold text-slate-900 mt-1">${pendingCount} Antrean</div>
          <div class="text-[11px] font-semibold text-amber-600 mt-1">Menunggu Otorisasi Admin</div>
        </div>
        <div class="rounded-xl border border-slate-200/90 bg-slate-50/40 p-4">
          <div class="text-xs font-semibold text-slate-500">Pinjaman Berjalan</div>
          <div class="text-xl font-extrabold text-slate-900 mt-1">${activeCount} Sarana</div>
          <div class="text-[11px] font-semibold text-[#1D4ED8] mt-1">Aktif Digunakan</div>
        </div>
        <div class="rounded-xl border border-slate-200/90 bg-slate-50/40 p-4">
          <div class="text-xs font-semibold text-slate-500">Verifikasi Kembali</div>
          <div class="text-xl font-extrabold text-slate-900 mt-1">${verifyCount} Barang</div>
          <div class="text-[11px] font-semibold text-purple-600 mt-1">Dicek Petugas Sarpras</div>
        </div>
        <div class="rounded-xl border border-slate-200/90 bg-slate-50/40 p-4">
          <div class="text-xs font-semibold text-slate-500">Selesai</div>
          <div class="text-xl font-extrabold text-slate-900 mt-1">${completedCount} Transaksi</div>
          <div class="text-[11px] font-semibold text-slate-500 mt-1">Tertib Administrasi</div>
        </div>
      </div>

      <!-- Filter Pills -->
      <div class="flex flex-wrap items-center gap-2 mb-5">
        ${tabs.map(t => {
          const active = pdfLoanTabFilter === t.key;
          return `
            <button type="button" onclick="setPdfLoanTab('${t.key}')" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              active
                ? 'bg-[#1D4ED8] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200/80'
            }">
              ${t.label}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Loan Rows -->
      <div id="pdf-loans-list" class="space-y-3">
        ${filteredCards.length === 0 ? `
          <div class="rounded-xl border border-slate-200/90 bg-white p-8 text-center text-xs text-slate-500">
            Belum ada data peminjaman pada kategori ini.
          </div>
        ` : filteredCards.map(card => {
          const btnClass = card.actionPrimary
            ? (card.actionStyle === 'emerald'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
              : 'bg-[#1D4ED8] hover:bg-blue-800 text-white shadow-2xs')
            : 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700';
          return `
          <div class="grid grid-cols-1 lg:grid-cols-12 items-center gap-4 p-4 rounded-xl border ${card.isMine ? 'border-blue-300 bg-blue-50/20' : 'border-slate-200/90 bg-white'} hover:border-slate-300 transition">
            <div class="lg:col-span-2">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-xs font-bold text-[#1D4ED8]">${card.code}</span>
                ${card.isMine ? '<span class="px-1.5 py-0.5 rounded bg-blue-100 text-[#1D4ED8] text-[9px] font-extrabold uppercase">Milik Anda</span>' : ''}
              </div>
              <div class="text-xs font-bold text-slate-900 mt-1">${card.borrower}</div>
            </div>
            <div class="lg:col-span-4">
              <div class="text-xs font-bold text-slate-900">${card.items}</div>
              <div class="text-[11px] text-slate-400 mt-1">${card.purpose}</div>
            </div>
            <div class="lg:col-span-3 text-xs text-slate-600 space-y-0.5">
              <div>Pinjam: ${card.startDate}</div>
              <div>Kembali: ${card.endDate}</div>
            </div>
            <div class="lg:col-span-3 flex items-center justify-between lg:justify-end gap-3">
              <span class="px-3 py-1 rounded-md text-[10px] font-bold uppercase whitespace-nowrap ${card.statusClass}">
                ${card.status}
              </span>
              <button type="button" onclick="handlePdfLoanCardAction('${card.code}')" class="px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${btnClass}">
                ${card.actionLabel}
              </button>
            </div>
          </div>
        `;
        }).join('')}
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
  renderPdfPeminjamanView();
  loadLoansFromBackend();
});

