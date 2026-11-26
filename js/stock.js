/**
 * SIMAS - Stock Opname & Sensus Inventaris Fisik
 * Skrip Logika, Data Dinamis Array, Rekonsiliasi Selisih & Laporan BA
 */

// ===================== 1. DATA MASTER =====================

const navMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-panel-left', href: 'index.html', active: false },
  { id: 'aset', label: 'Manajemen Aset', icon: 'archive', href: 'aset.html', active: false },
  { id: 'gedung', label: 'Gedung & Ruangan', icon: 'building-2', href: 'gedung.html', active: false },
  { id: 'peminjaman', label: 'Peminjaman & Reservasi', icon: 'calendar-clock', href: 'peminjaman.html', active: false },
  { id: 'antrean', label: 'Antrean Persetujuan', icon: 'check-square', href: 'antrean.html', active: false, badge: 4 },
  { id: 'pemeliharaan', label: 'Pemeliharaan & Tiket', icon: 'wrench', href: 'tiket.html', active: false },
  { id: 'mutasi', label: 'Mutasi Aset', icon: 'arrow-left-right', href: 'mutasi.html', active: false },
  { id: 'stock', label: 'Stock Opname', icon: 'scan-barcode', href: 'stock.html', active: true },
  { id: 'laporan', label: 'Laporan & Rangkuman', icon: 'file-text', href: 'laporan.html', active: false },
];

let auditItemsData = [
  {
    id: 1,
    code: 'SAR/2023/0440',
    name: 'Mikroskop Binokuler Olympus CX23',
    category: 'Alat Laboratorium & Riset',
    sn: 'OLY-883921',
    actualLoc: 'Lab Terpadu B. 302',
    masterLoc: 'Lab Biologi R. 101',
    isLocDiff: true,
    auditStatus: 'Ditemukan (Selisih Lokasi)',
    auditStatusBadge: 'bg-[#e0e7ff] text-[#3730a3]',
    auditStatusIcon: 'refresh-cw',
    condition: 'Baik',
    conditionBadge: 'bg-[#ccfbf1] text-[#0f766e]',
    conditionDot: 'bg-emerald-500',
    auditor: 'Dedi Ardiansyah',
    scanTime: 'Scan QR - 28 Mar 10:14',
    hasPhoto: true,
    actionType: 'sync_location',
    actionLabel: 'Sesuaikan Lokasi Otomatis',
    actionClass: 'bg-[#0f2a71] hover:bg-[#0a1e54] text-white',
    actionIcon: 'refresh-cw'
  },
  {
    id: 2,
    code: 'SAR/2025/0102',
    name: 'Laptop ThinkPad T14 Gen 4',
    category: 'TI & Elektronik',
    sn: 'PF-4J28901',
    actualLoc: 'R. 302 Staf Keuangan',
    masterLoc: 'Sesuai Master Sistem',
    isLocDiff: false,
    auditStatus: 'Cocok Sesuai Data',
    auditStatusBadge: 'bg-[#a7f3d0] text-[#065f46]',
    auditStatusIcon: 'check-circle',
    condition: 'Baik',
    conditionBadge: 'bg-[#ccfbf1] text-[#0f766e]',
    conditionDot: 'bg-emerald-500',
    auditor: 'Irfan Kusuma',
    scanTime: 'Scan QR - 28 Mar 09:30',
    hasPhoto: false,
    actionType: 'detail',
    actionLabel: 'Detail Verifikasi',
    actionClass: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200',
    actionIcon: 'eye'
  },
  {
    id: 3,
    code: 'SAR/2022/0119',
    name: 'AC Daikin Inverter 2 PK',
    category: 'Sarana Penyejuk',
    sn: 'DAI-INV-821',
    actualLoc: 'R. Rapat Senat Lt. 4',
    masterLoc: 'Sesuai Master Sistem',
    isLocDiff: false,
    auditStatus: 'Cocok Sesuai Data',
    auditStatusBadge: 'bg-[#a7f3d0] text-[#065f46]',
    auditStatusIcon: 'check-circle',
    condition: 'Rusak Ringan (Bocor)',
    conditionBadge: 'bg-[#e2e8f0] text-slate-700',
    conditionNote: 'Catatan: Perlu maintenance freon',
    conditionDot: 'bg-slate-400',
    auditor: 'Dedi Ardiansyah',
    scanTime: 'Scan QR - 28 Mar 08:45',
    hasPhoto: false,
    actionType: 'ticket',
    actionLabel: 'Buat Tiket Servis Langsung',
    actionClass: 'bg-[#dbeafe] hover:bg-[#bfdbfe] text-[#1d4ed8]',
    actionIcon: 'wrench'
  },
  {
    id: 4,
    code: 'SAR/2021/0080',
    name: 'Proyektor InFocus IN114',
    category: 'Perlengkapan Presentasi',
    sn: 'INF-89B01',
    actualLoc: 'Tidak Ditemukan',
    masterLoc: 'Lokasi Sistem: Lab Komputer 2',
    isMissing: true,
    auditStatus: 'Belum Ditemukan (Hilang)',
    auditStatusBadge: 'bg-[#fee2e2] text-[#991b1b]',
    auditStatusIcon: 'alert-triangle',
    condition: 'Belum dapat dievaluasi',
    isConditionPending: true,
    auditor: 'Pending Investigasi',
    scanTime: 'Batas Lapor: 30 Mar',
    isAuditorPending: true,
    actionType: 'investigate',
    actionLabel: 'Tandai Investigasi Lanjut',
    actionClass: 'bg-[#fee2e2] hover:bg-[#fecaca] text-[#991b1b]',
    actionIcon: 'alert-circle'
  }
];

// State Global
let currentSearchQuery = '';
let currentTabFilter = 'anomali';
let currentLocationFilter = 'all';
let currentConditionFilter = 'all';
let currentStatusFilter = 'all';
let selectedIds = new Set();

// ===================== 2. INITIALIZATION =====================

document.addEventListener('DOMContentLoaded', () => {
  renderSidebarMenu();
  renderTable();
  setupEventListeners();
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// ===================== 3. SIDEBAR RENDERING =====================

function renderSidebarMenu() {
  if (typeof renderNavigation === 'function') {
    renderNavigation('stock');
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

function getFilteredAuditItems() {
  return auditItemsData.filter(item => {
    // Tab filter
    if (currentTabFilter === 'anomali') {
      // Show all items in default view or prioritize anomalies
    } else if (currentTabFilter === 'belum') {
      if (!item.isMissing && !item.isAuditorPending) return false;
    }

    // Search query
    if (currentSearchQuery.trim() !== '') {
      const q = currentSearchQuery.toLowerCase();
      const match = item.code.toLowerCase().includes(q) ||
                    item.name.toLowerCase().includes(q) ||
                    item.category.toLowerCase().includes(q) ||
                    item.actualLoc.toLowerCase().includes(q) ||
                    item.auditor.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Location filter
    if (currentLocationFilter !== 'all') {
      const locText = `${item.actualLoc} ${item.masterLoc}`.toLowerCase();
      if (currentLocationFilter === 'lab_terpadu' && !locText.includes('lab')) return false;
      if (currentLocationFilter === 'rektorat' && !locText.includes('senat') && !locText.includes('rektorat') && !locText.includes('keuangan')) return false;
      if (currentLocationFilter === 'teknik' && !locText.includes('komputer') && !locText.includes('teknik')) return false;
    }

    // Status filter
    if (currentStatusFilter !== 'all') {
      if (currentStatusFilter === 'selisih' && !item.isLocDiff) return false;
      if (currentStatusFilter === 'cocok' && (item.isLocDiff || item.isMissing)) return false;
      if (currentStatusFilter === 'hilang' && !item.isMissing) return false;
    }

    // Condition filter
    if (currentConditionFilter !== 'all') {
      if (currentConditionFilter === 'baik' && !item.condition.includes('Baik')) return false;
      if (currentConditionFilter === 'rusak' && !item.condition.includes('Rusak')) return false;
    }

    return true;
  });
}

function renderTable() {
  const tbody = document.getElementById('audit-table-body');
  if (!tbody) return;

  const filtered = getFilteredAuditItems();

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="py-12 text-center text-slate-400 text-xs">
          <div class="flex flex-col items-center justify-center gap-1.5">
            <i data-lucide="inbox" class="w-7 h-7 text-slate-300"></i>
            <p>Tidak ada data temuan audit yang sesuai dengan filter.</p>
          </div>
        </td>
      </tr>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const isChecked = selectedIds.has(item.id);

    // Location cell content
    let locCellContent = '';
    if (item.isLocDiff) {
      locCellContent = `
        <div class="flex items-center gap-1.5">
          <i data-lucide="map-pin" class="w-3.5 h-3.5 text-blue-600 shrink-0"></i>
          <span class="font-bold text-slate-900">${item.actualLoc}</span>
          <span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-700">Aktual</span>
        </div>
        <div class="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
          <i data-lucide="building" class="w-3 h-3 text-slate-400 shrink-0"></i>
          <span>${item.masterLoc}</span>
        </div>
      `;
    } else if (item.isMissing) {
      locCellContent = `
        <div class="flex items-center gap-1.5 font-bold text-rose-600">
          <i data-lucide="help-circle" class="w-3.5 h-3.5 text-rose-600 shrink-0"></i>
          <span>${item.actualLoc}</span>
        </div>
        <div class="text-[10px] text-slate-500 mt-0.5">${item.masterLoc}</div>
      `;
    } else {
      locCellContent = `
        <div class="flex items-center gap-1.5 font-bold text-slate-800">
          <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0"></i>
          <span>${item.actualLoc}</span>
        </div>
        <div class="text-[10px] text-slate-400 mt-0.5">${item.masterLoc}</div>
      `;
    }

    // Condition cell content
    let condCellContent = '';
    if (item.isConditionPending) {
      condCellContent = `<span class="italic text-slate-400 text-[10px]">${item.condition}</span>`;
    } else if (item.conditionNote) {
      condCellContent = `
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${item.conditionBadge}">
          <i data-lucide="alert-triangle" class="w-3 h-3"></i>
          <span>${item.condition}</span>
        </span>
        <div class="text-[9px] text-slate-500 italic mt-1">${item.conditionNote}</div>
      `;
    } else {
      condCellContent = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.conditionBadge}">
          <span class="w-1.5 h-1.5 rounded-full ${item.conditionDot}"></span>
          <span>${item.condition}</span>
        </span>
      `;
    }

    // Auditor cell content
    let auditorCellContent = '';
    if (item.isAuditorPending) {
      auditorCellContent = `
        <div class="font-bold text-rose-600 text-[11px]">${item.auditor}</div>
        <div class="text-[10px] text-slate-500 mt-0.5">${item.scanTime}</div>
      `;
    } else {
      auditorCellContent = `
        <div class="font-bold text-slate-900 text-[11px]">${item.auditor}</div>
        <div class="text-[10px] text-slate-400 mt-0.5">${item.scanTime}</div>
        ${item.hasPhoto ? `
          <button onclick="previewEvidencePhoto('${item.code}', '${item.name}')" class="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 hover:underline mt-1">
            <i data-lucide="image" class="w-3 h-3"></i>
            <span>Lihat Bukti Foto</span>
          </button>
        ` : ''}
      `;
    }

    return `
      <tr class="border-b border-slate-100 table-hover-row transition text-[11px] align-top">
        <!-- Checkbox -->
        <td class="py-3 px-3 text-center">
          <input 
            type="checkbox" 
            class="row-checkbox rounded text-blue-900 focus:ring-0" 
            data-id="${item.id}"
            ${isChecked ? 'checked' : ''}
            onchange="toggleRowSelection(${item.id}, this.checked)"
          >
        </td>

        <!-- Kode Register & Spesifikasi Aset -->
        <td class="py-3 px-3">
          <div class="font-black text-blue-900 tracking-tight text-[11px]">${item.code}</div>
          <div class="font-bold text-slate-900 leading-snug mt-0.5">${item.name}</div>
          <div class="text-[10px] text-slate-400 mt-0.5">Kategori: ${item.category} • SN: ${item.sn}</div>
        </td>

        <!-- Lokasi Temuan Fisik vs Master Data -->
        <td class="py-3 px-3">
          ${locCellContent}
        </td>

        <!-- Status Fisik Audit -->
        <td class="py-3 px-3 whitespace-nowrap">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.auditStatusBadge}">
            <i data-lucide="${item.auditStatusIcon}" class="w-3 h-3"></i>
            <span>${item.auditStatus}</span>
          </span>
        </td>

        <!-- Kondisi Aktual -->
        <td class="py-3 px-3 whitespace-nowrap">
          ${condCellContent}
        </td>

        <!-- Auditor & Bukti Pindai -->
        <td class="py-3 px-3 whitespace-nowrap">
          ${auditorCellContent}
        </td>

        <!-- Tindakan Rekonsiliasi -->
        <td class="py-3 px-3 whitespace-nowrap">
          <div class="flex items-center gap-1.5">
            <button 
              onclick="handleRowAction(${item.id}, '${item.actionType}', '${item.code}')" 
              class="px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-2xs ${item.actionClass}"
            >
              <i data-lucide="${item.actionIcon}" class="w-3.5 h-3.5"></i>
              <span>${item.actionLabel}</span>
            </button>
            <button class="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition">
              <i data-lucide="more-vertical" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ===================== 5. SELECTION & ROW ACTIONS =====================

function toggleSelectAll(checked) {
  const checkboxes = document.querySelectorAll('.row-checkbox');
  checkboxes.forEach(cb => {
    cb.checked = checked;
    const id = parseInt(cb.dataset.id);
    if (checked) {
      selectedIds.add(id);
    } else {
      selectedIds.delete(id);
    }
  });
}

function toggleRowSelection(id, checked) {
  if (checked) {
    selectedIds.add(id);
  } else {
    selectedIds.delete(id);
  }

  const masterCheckbox = document.getElementById('master-checkbox');
  if (masterCheckbox) {
    masterCheckbox.checked = selectedIds.size === auditItemsData.length;
  }
}

async function handleRowAction(id, actionType, code) {
  const item = auditItemsData.find(i => i.id === id);
  if (actionType === 'sync_location') {
    if (item) {
      item.masterLoc = item.actualLoc;
      item.isLocDiff = false;
      item.auditStatus = 'Cocok Sesuai Data';
      item.auditStatusBadge = 'bg-[#a7f3d0] text-[#065f46]';
      item.auditStatusIcon = 'check-circle';
      item.actionType = 'detail';
      item.actionLabel = 'Detail Verifikasi';
      item.actionClass = 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200';
      item.actionIcon = 'eye';
      renderTable();
    }
    if (typeof API !== 'undefined') {
      const res = await API.syncStockLocation(id);
      if (res && res.success) {
        showToast(res.message || `Lokasi master aset ${code} berhasil disinkronkan ke database!`, 'success');
        return;
      }
    }
    showToast(`Lokasi master aset ${code} berhasil diperbarui ke ${item ? item.actualLoc : 'lokasi aktual'}!`, 'success');
  } else if (actionType === 'ticket') {
    if (item) {
      item.actionType = 'detail';
      item.actionLabel = 'Tiket Servis Aktif';
      item.actionClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      item.actionIcon = 'check-circle';
      renderTable();
    }
    if (typeof API !== 'undefined' && API.createTicket) {
      await API.createTicket({
        title: `Perbaikan Temuan Audit: ${item ? item.name : code}`,
        location: item ? item.actualLoc : 'Ruang Rapat Senat',
        gedung: 'Gedung Rektorat',
        priority: 'TINGGI',
        category: 'Temuan Stock Opname',
        tech_name: 'Joko Supriyanto',
        cost: 'Rp 350.000',
        desc: item ? item.conditionNote || item.condition : 'Perbaikan dari temuan stock opname'
      });
    }
    showToast(`Tiket pemeliharaan darurat untuk ${item ? item.name : code} (${code}) berhasil dibuat ke modul Tiket!`, 'success');
  } else if (actionType === 'investigate') {
    if (item) {
      item.auditor = 'Tim Satpam & Auditor';
      item.isAuditorPending = false;
      item.actionType = 'detail';
      item.actionLabel = 'Dalam Investigasi';
      item.actionClass = 'bg-amber-50 text-amber-800 border border-amber-200';
      item.actionIcon = 'clock';
      renderTable();
    }
    if (typeof API !== 'undefined' && API.updateStockOpname) {
      await API.updateStockOpname(id, { audit_status: 'Dalam Investigasi Khusus', auditor: 'Tim Satpam & Auditor' });
    }
    showToast(`Status investigasi aset ${code} telah dicatat dan didelegasikan ke Satpam & Auditor!`, 'info');
  } else {
    showToast(`Menampilkan berkas log verifikasi lengkap untuk aset ${code}.`, 'info');
  }
}

async function batchReconcile() {
  const diffItems = auditItemsData.filter(i => i.isLocDiff);
  for (const item of diffItems) {
    item.masterLoc = item.actualLoc;
    item.isLocDiff = false;
    item.auditStatus = 'Cocok Sesuai Data';
    item.auditStatusBadge = 'bg-[#a7f3d0] text-[#065f46]';
    item.auditStatusIcon = 'check-circle';
    item.actionType = 'detail';
    item.actionLabel = 'Detail Verifikasi';
    item.actionClass = 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200';
    item.actionIcon = 'eye';
    if (typeof API !== 'undefined' && API.syncStockLocation) {
      try {
        await API.syncStockLocation(item.id);
      } catch (e) {
        // ignore fallback
      }
    }
  }
  renderTable();
  showToast(`Sinkronisasi massal (${diffItems.length || 1} aset selisih lokasi) berhasil diselesaikan ke master inventaris!`, 'success');
}

function previewEvidencePhoto(code, name) {
  const modal = document.getElementById('modal-photo-preview');
  const modalTitle = document.getElementById('modal-photo-title');
  const modalDesc = document.getElementById('modal-photo-desc');

  if (modalTitle) modalTitle.innerText = `Bukti Pindai ${code}`;
  if (modalDesc) modalDesc.innerText = `Foto fisik ${name} terverifikasi oleh auditor Dedi Ardiansyah di Lab Terpadu B. 302 dengan barcode utuh.`;

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeModalPhoto() {
  const modal = document.getElementById('modal-photo-preview');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// ===================== 6. MODAL & DIALOGS =====================

function openModalNewSession() {
  const modal = document.getElementById('modal-new-session');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) window.lucide.createIcons();
  }
}
const openModalSesiBaru = openModalNewSession;

function closeModalNewSession() {
  const modal = document.getElementById('modal-new-session');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function handleSessionSubmit(e) {
  e.preventDefault();
  const sessionName = document.getElementById('form-session-name').value;
  closeModalNewSession();
  showToast(`Sesi audit "${sessionName}" berhasil diinisialisasi!`, 'success');
  e.target.reset();
}

function openMobileScanner() {
  const modal = document.getElementById('modal-barcode-scanner');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeBarcodeScanner() {
  const modal = document.getElementById('modal-barcode-scanner');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function autoFillScannedAsset(val) {
  if (!val) return;
  const select = document.getElementById('scan-asset-select');
  const text = select.options[select.selectedIndex].text;
  const parts = text.split(' - ');
  const assetName = parts[1] || 'Aset Terpindai';
  document.getElementById('scan-actual-loc').value = 'Lab Terpadu B. 302';
}

async function handleScanAssetSubmit(e) {
  e.preventDefault();
  const select = document.getElementById('scan-asset-select');
  const code = select.value || 'SAR/2025/0999';
  const name = select.options[select.selectedIndex]?.text.split(' - ')[1] || 'Aset Terpindai';
  const actualLoc = document.getElementById('scan-actual-loc').value;
  const condition = document.getElementById('scan-condition').value;
  const auditor = document.getElementById('scan-auditor').value;

  const payload = {
    code,
    name,
    category: 'Inventaris Lapangan',
    sn: 'SN-SCAN-' + Date.now().toString().slice(-5),
    actual_loc: actualLoc,
    master_loc: 'Lab Biologi Dasar R. 101',
    is_loc_diff: 1,
    audit_status: 'Ditemukan (Selisih Lokasi)',
    condition,
    auditor
  };

  if (typeof API !== 'undefined') {
    const res = await API.createStockOpname(payload);
    if (res && res.success) {
      showToast(`Scan aset ${code} (${name}) berhasil disimpan ke database!`, 'success');
      closeBarcodeScanner();
      await loadStockFromBackend();
      return;
    }
  }

  showToast(`Scan QR untuk ${name} berhasil diverifikasi!`, 'success');
  closeBarcodeScanner();
}

async function loadStockFromBackend() {
  if (typeof API !== 'undefined') {
    const res = await API.getStockOpname();
    if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
      auditItemsData = res.data.map(item => ({
        id: item.id,
        code: item.code,
        name: item.name,
        category: item.category || 'Alat Laboratorium',
        sn: item.sn || 'SN-000',
        actualLoc: item.actual_loc,
        masterLoc: item.master_loc,
        isLocDiff: Boolean(item.is_loc_diff),
        auditStatus: item.audit_status,
        auditStatusBadge: item.is_loc_diff ? 'bg-[#e0e7ff] text-[#3730a3]' : 'bg-[#a7f3d0] text-[#065f46]',
        auditStatusIcon: item.is_loc_diff ? 'refresh-cw' : 'check-circle',
        condition: item.condition,
        conditionBadge: item.condition === 'Baik' ? 'bg-[#ccfbf1] text-[#0f766e]' : 'bg-rose-50 text-rose-700',
        conditionDot: item.condition === 'Baik' ? 'bg-emerald-500' : 'bg-rose-500',
        auditor: item.auditor || 'Auditor',
        scanTime: item.scan_time || 'Baru Saja',
        hasPhoto: true,
        actionType: item.is_loc_diff ? 'sync_location' : 'detail',
        actionLabel: item.is_loc_diff ? 'Sesuaikan Lokasi Otomatis' : 'Detail Verifikasi',
        actionClass: item.is_loc_diff ? 'bg-[#0f2a71] hover:bg-[#0a1e54] text-white' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200',
        actionIcon: item.is_loc_diff ? 'refresh-cw' : 'eye'
      }));
      renderTable();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadStockFromBackend();
});

// ===================== 7. EVENT LISTENERS =====================

function setupEventListeners() {
  const searchInput = document.getElementById('search-audit-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderTable();
    });
  }

  const statusSelect = document.getElementById('filter-status-anomali');
  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      currentStatusFilter = e.target.value;
      renderTable();
    });
  }

  const conditionSelect = document.getElementById('filter-kondisi');
  if (conditionSelect) {
    conditionSelect.addEventListener('change', (e) => {
      currentConditionFilter = e.target.value;
      renderTable();
    });
  }

  const locSelect = document.getElementById('filter-lokasi');
  if (locSelect) {
    locSelect.addEventListener('change', (e) => {
      currentLocationFilter = e.target.value;
      renderTable();
    });
  }

  const resetBtn = document.getElementById('btn-reset-filter');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentSearchQuery = '';
      currentStatusFilter = 'all';
      currentConditionFilter = 'all';
      currentLocationFilter = 'all';
      if (searchInput) searchInput.value = '';
      if (statusSelect) statusSelect.value = 'all';
      if (conditionSelect) conditionSelect.value = 'all';
      if (locSelect) locSelect.value = 'all';
      renderTable();
      showToast('Filter temuan stock opname berhasil direset.', 'info');
    });
  }

  setupTabs();
}

function setupTabs() {
  const tabs = [
    { id: 'tab-semua-aset', key: 'all' },
    { id: 'tab-anomali', key: 'anomali' },
    { id: 'tab-belum', key: 'belum' },
    { id: 'tab-riwayat', key: 'riwayat' }
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
          otherEl.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-900 font-bold text-xs shadow-2xs transition';
        } else {
          otherEl.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-semibold text-xs transition';
        }
      });
      renderTable();
    });
  });
}

// ===================== 8. EKSPOR LAPORAN BA CSV =====================

function exportAuditCSV() {
  const headers = ['KODE ASET', 'NAMA BARANG', 'KATEGORI', 'NO SERI', 'LOKASI AKTUAL', 'LOKASI MASTER', 'STATUS AUDIT', 'KONDISI', 'AUDITOR', 'WAKTU PINDAI'];
  const rows = auditItemsData.map(a => [
    `"${(a.code || '').replace(/"/g, '""')}"`,
    `"${(a.name || '').replace(/"/g, '""')}"`,
    `"${(a.category || '').replace(/"/g, '""')}"`,
    `"${(a.sn || '').replace(/"/g, '""')}"`,
    `"${(a.actualLoc || '').replace(/"/g, '""')}"`,
    `"${(a.masterLoc || '').replace(/"/g, '""')}"`,
    `"${(a.auditStatus || '').replace(/"/g, '""')}"`,
    `"${(a.condition || '').replace(/"/g, '""')}"`,
    `"${(a.auditor || '').replace(/"/g, '""')}"`,
    `"${(a.scanTime || '').replace(/"/g, '""')}"`
  ]);

  const BOM = '\uFEFF';
  const delimiter = ';';
  const csvContent = BOM + [headers.join(delimiter), ...rows.map(e => e.join(delimiter))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SIMAS_Laporan_BA_Stock_Opname_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('File CSV Laporan BA Stock Opname berhasil diunduh.', 'success');
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

  toast.className = `toast-item flex items-center gap-2 px-3.5 py-2.5 rounded-xl shadow-lg text-xs font-semibold ${bgClass} transform transition-all duration-300 translate-y-2 opacity-0`;
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
