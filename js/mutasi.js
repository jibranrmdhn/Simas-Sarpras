/**
 * SIMAS - Mutasi & Perpindahan Sarana Aset
 * Skrip Logika, Data Dinamis Array, Pencarian, Filter & BAST Ekspor
 */

// ===================== 1. DATA MASTER =====================

const navMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-panel-left', href: 'index.html', active: false },
  { id: 'aset', label: 'Manajemen Aset', icon: 'archive', href: 'aset.html', active: false },
  { id: 'gedung', label: 'Gedung & Ruangan', icon: 'building-2', href: 'gedung.html', active: false },
  { id: 'peminjaman', label: 'Peminjaman & Reservasi', icon: 'calendar-clock', href: 'peminjaman.html', active: false },
  { id: 'antrean', label: 'Antrean Persetujuan', icon: 'check-square', href: 'antrean.html', active: false, badge: 4 },
  { id: 'pemeliharaan', label: 'Pemeliharaan & Tiket', icon: 'wrench', href: 'tiket.html', active: false },
  { id: 'mutasi', label: 'Mutasi Aset', icon: 'arrow-left-right', href: 'mutasi.html', active: true },
  { id: 'stock', label: 'Stock Opname', icon: 'scan-barcode', href: 'stock.html', active: false },
  { id: 'laporan', label: 'Laporan & Rangkuman', icon: 'file-text', href: 'laporan.html', active: false },
];

let mutasiData = [
  {
    id: 1,
    bastNo: 'BAST/MUT/2025/0084',
    date: '26 Mar 2025 • 09:15 WIB',
    typeTag: '• Rutin Departemen',
    typeColor: 'text-[#0f766e]',
    dotColor: 'bg-emerald-500',
    assetName: 'Mikroskop Binokuler Olympus CX23',
    assetImg: '../assets/mikroskop.jpg',
    nup: 'SAR/2023/0440',
    unitCount: '4 Unit',
    originLoc: 'Lab Biologi Gedung A Lt. 1',
    originPic: 'PIC: Dr. Retno W.',
    originNip: 'NIP. 19780512200212',
    destLoc: 'Lab Terpadu Gedung C Lt. 3',
    destPic: 'PIC: Drs. Ahmad Fauzi, M.Sc.',
    destNip: 'NIP. 19820304200604',
    purpose: 'Konsolidasi Fasilitas...',
    fullPurpose: 'Konsolidasi Fasilitas Pembelajaran & Praktikum Mahasiswa Semester Genap',
    docName: 'BAST-0084.pdf',
    docStatus: 'TTD Digital',
    docVerified: true,
    status: 'Selesai Terverifikasi',
    statusBadge: 'bg-[#ccfbf1] text-[#0f766e]',
    statusIcon: 'check-circle',
    category: 'alat',
    month: '2025-03'
  },
  {
    id: 2,
    bastNo: 'BAST/MUT/2025/0083',
    date: '25 Mar 2025 • 14:00 WIB',
    typeTag: '• Distribusi TI',
    typeColor: 'text-[#0284c7]',
    dotColor: 'bg-sky-500',
    assetName: 'PC Lenovo ThinkCentre M70s',
    assetImg: '../assets/pc_thinkcentre.jpg',
    nup: 'SAR/2024/0112',
    unitCount: '10 Unit',
    originLoc: 'R. Staf Kepegawaian (Gedung Rektorat Lt. 1)',
    originPic: 'PIC: Hendra Setiawan, S.Kom.',
    originNip: 'NIP. 19850619200801',
    destLoc: 'R. Pelayanan Mahasiswa Terpadu (Gedung B Lt. 1)',
    destPic: 'PIC: Siti Aminah, S.Sos.',
    destNip: 'NIP. 19910408201503',
    purpose: 'Upgrade Fasilitas...',
    fullPurpose: 'Upgrade Fasilitas Pelayanan Administrasi & Pendaftaran Mahasiswa Baru',
    docName: 'BAST-Draft.pdf',
    docStatus: 'Menunggu TTD Fisik',
    docVerified: false,
    status: 'Dalam Proses Pemindahan',
    statusBadge: 'bg-[#dbeafe] text-[#1d4ed8]',
    statusIcon: 'truck',
    category: 'it',
    month: '2025-03'
  },
  {
    id: 3,
    bastNo: 'BAST/MUT/2025/0082',
    date: '24 Mar 2025 • 11:30 WIB',
    typeTag: '• Tanggap Darurat',
    typeColor: 'text-slate-600',
    dotColor: 'bg-slate-500',
    assetName: 'Genset Silent 50 kVA Cummins',
    assetImg: '../assets/genset_cummins.jpg',
    nup: 'SAR/2022/0319',
    unitCount: '1 Unit',
    originLoc: 'Rumah Genset Barat',
    originPic: 'PIC: Joko Susilo (Teknisi MEP)',
    originNip: 'NIP. 19800115200902',
    destLoc: 'Gedung Rektorat Backup Sentral',
    destPic: 'PIC: Bagus Kurniawan, S.T.',
    destNip: 'NIP. 19881120201402',
    purpose: 'Relokasi Gardu...',
    fullPurpose: 'Relokasi Gardu Distribusi Daya Darurat Antisipasi Pemadaman Bergilir PLN',
    docName: 'BAST-0082.pdf',
    docStatus: 'TTD Digital',
    docVerified: true,
    status: 'Selesai Terverifikasi',
    statusBadge: 'bg-[#ccfbf1] text-[#0f766e]',
    statusIcon: 'check-circle',
    category: 'mekanikal',
    month: '2025-03'
  },
  {
    id: 4,
    bastNo: 'BAST/MUT/2025/0081',
    date: '22 Mar 2025 • 16:45 WIB',
    typeTag: '• Interior & Tata Ruang',
    typeColor: 'text-slate-600',
    dotColor: 'bg-slate-500',
    assetName: 'Meja Rapat Konferensi Kayu Jati',
    assetImg: '../assets/meja-rapat.jpg',
    nup: 'SAR/2025/0225',
    unitCount: '1 Set',
    originLoc: 'Gudang Sarpras Utama',
    originPic: 'PIC: Supriyadi (Kepala Gudang)',
    originNip: 'NIP. 19750910199803',
    destLoc: 'Ruang Sidang Senat Baru (Lt. 4)',
    destPic: 'PIC: Dr. Ir. M. Hidayat, M.T.',
    destNip: 'NIP. 19690412199403',
    purpose: 'Penataan Interior...',
    fullPurpose: 'Penataan Interior Ruang Rapat Senat Utama Pasca Renovasi Gedung',
    docName: 'BAST-0081.pdf',
    docStatus: 'TTD Digital',
    docVerified: true,
    status: 'Selesai Terverifikasi',
    statusBadge: 'bg-[#ccfbf1] text-[#0f766e]',
    statusIcon: 'check-circle',
    category: 'meubelair',
    month: '2025-03'
  }
];

// State Global
let currentSearchQuery = '';
let currentStatusFilter = 'all';
let currentCategoryFilter = 'all';
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
    renderNavigation('mutasi');
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

function getFilteredMutasi() {
  return mutasiData.filter(item => {
    // Search query
    if (currentSearchQuery.trim() !== '') {
      const q = currentSearchQuery.toLowerCase();
      const match = item.bastNo.toLowerCase().includes(q) ||
                    item.assetName.toLowerCase().includes(q) ||
                    item.nup.toLowerCase().includes(q) ||
                    item.originLoc.toLowerCase().includes(q) ||
                    item.destLoc.toLowerCase().includes(q) ||
                    item.originPic.toLowerCase().includes(q) ||
                    item.destPic.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Status filter
    if (currentStatusFilter !== 'all') {
      if (currentStatusFilter === 'selesai' && !item.status.includes('Selesai')) return false;
      if (currentStatusFilter === 'proses' && !item.status.includes('Proses')) return false;
    }

    // Category filter
    if (currentCategoryFilter !== 'all' && item.category !== currentCategoryFilter) return false;

    return true;
  });
}

function renderTable() {
  const tbody = document.getElementById('mutasi-table-body');
  if (!tbody) return;

  const filtered = getFilteredMutasi();

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="py-12 text-center text-slate-400 text-xs">
          <div class="flex flex-col items-center justify-center gap-1.5">
            <i data-lucide="inbox" class="w-7 h-7 text-slate-300"></i>
            <p>Tidak ada riwayat mutasi aset yang sesuai filter.</p>
          </div>
        </td>
      </tr>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const isChecked = selectedIds.has(item.id);
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

        <!-- No. BAST & Tanggal -->
        <td class="py-3 px-3 whitespace-nowrap">
          <div class="font-black text-blue-900 tracking-tight text-[11px]">${item.bastNo}</div>
          <div class="text-[10px] text-slate-400 mt-0.5">${item.date}</div>
          <div class="text-[10px] font-semibold ${item.typeColor} mt-1 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full ${item.dotColor}"></span>
            <span>${item.typeTag.replace('• ', '')}</span>
          </div>
        </td>

        <!-- Aset & NUP -->
        <td class="py-3 px-3">
          <div class="flex items-start gap-2.5">
            <img src="${item.assetImg}" alt="${item.assetName}" class="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0">
            <div>
              <div class="font-bold text-slate-900 leading-tight">${item.assetName}</div>
              <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-mono font-medium mt-1">
                <span>${item.nup}</span>
                <span class="text-slate-400">•</span>
                <span class="font-sans font-bold text-slate-700">${item.unitCount}</span>
              </div>
            </div>
          </div>
        </td>

        <!-- Lokasi & PIC Asal -->
        <td class="py-3 px-3">
          <div class="text-slate-800 leading-tight">${item.originLoc}</div>
          <div class="font-bold text-slate-900 mt-1">${item.originPic}</div>
          <div class="text-[9px] text-slate-400 font-mono mt-0.5">${item.originNip}</div>
        </td>

        <!-- Lokasi & PIC Tujuan -->
        <td class="py-3 px-3">
          <div class="font-black text-blue-900 leading-tight">${item.destLoc}</div>
          <div class="font-bold text-slate-900 mt-1">${item.destPic}</div>
          <div class="text-[9px] text-slate-400 font-mono mt-0.5">${item.destNip}</div>
        </td>

        <!-- Keperluan Mutasi -->
        <td class="py-3 px-3">
          <div class="text-slate-600 leading-snug cursor-pointer hover:text-slate-900" title="${item.fullPurpose}">
            ${item.purpose}
          </div>
        </td>

        <!-- Dokumen BAST -->
        <td class="py-3 px-3 whitespace-nowrap">
          <button 
            onclick="previewBAST('${item.bastNo}', '${item.assetName}', '${item.destLoc}')" 
            class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[10px] font-semibold transition"
          >
            <i data-lucide="file-text" class="w-3 h-3 text-slate-500"></i>
            <span>${item.docName}</span>
            <i data-lucide="eye" class="w-3 h-3 text-slate-400"></i>
          </button>
          <div class="text-[9px] font-bold mt-1 flex items-center gap-1 ${item.docVerified ? 'text-emerald-700' : 'text-slate-500'}">
            <i data-lucide="${item.docVerified ? 'check' : 'clock'}" class="w-3 h-3"></i>
            <span>${item.docStatus}</span>
          </div>
        </td>

        <!-- Status -->
        <td class="py-3 px-3 whitespace-nowrap text-right">
          <div class="flex flex-col items-end gap-1">
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.statusBadge}">
              <i data-lucide="${item.statusIcon}" class="w-3 h-3"></i>
              <span>${item.status}</span>
            </span>
            ${!item.docVerified ? `
              <button onclick="verifyMutation(${item.id}, '${item.bastNo}')" class="text-[10px] font-bold text-blue-700 hover:underline flex items-center gap-1">
                <i data-lucide="check-square" class="w-3 h-3"></i>
                <span>Verifikasi TTD</span>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ===================== 5. SELECTION & ACTIONS =====================

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
    masterCheckbox.checked = selectedIds.size === mutasiData.length;
  }
}

function printSelectedBAST() {
  if (selectedIds.size === 0) {
    showToast('Pilih setidaknya 1 berkas BAST pada tabel untuk dicetak.', 'error');
    return;
  }
  showToast(`Mempersiapkan pencetakan ${selectedIds.size} dokumen BAST terpilih...`, 'info');
  setTimeout(() => {
    window.print();
  }, 600);
}

function previewBAST(bastNo, assetName, destLoc) {
  const modal = document.getElementById('modal-bast-preview');
  const modalTitle = document.getElementById('modal-bast-title');
  const modalDesc = document.getElementById('modal-bast-desc');

  if (modalTitle) modalTitle.innerText = `Dokumen ${bastNo}`;
  if (modalDesc) modalDesc.innerText = `Berita Acara Serah Terima untuk ${assetName} menuju ${destLoc}. Status keabsahan tanda tangan digital BSrE valid.`;

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeModalBAST() {
  const modal = document.getElementById('modal-bast-preview');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// ===================== 6. MODAL PENGAJUAN MUTASI BARU =====================

function openModalMutasiBaru() {
  const modal = document.getElementById('modal-mutasi-baru');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeModalMutasiBaru() {
  const modal = document.getElementById('modal-mutasi-baru');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

async function handleMutasiSubmit(e) {
  e.preventDefault();
  if (!requirePermission('mutasi:manage', 'Mengajukan Mutasi Aset')) return;

  const namaAset = document.getElementById('form-nama-aset').value;
  const jumlah = document.getElementById('form-jumlah').value;
  const picAsal = document.getElementById('form-pic-asal').value;
  const lokAsal = document.getElementById('form-lok-asal').value;
  const picTujuan = document.getElementById('form-pic-tujuan').value;
  const lokTujuan = document.getElementById('form-lok-tujuan').value;
  const keperluan = document.getElementById('form-keperluan').value;

  const payload = {
    asset_name: namaAset,
    unit_count: `${jumlah} Unit`,
    origin_loc: lokAsal,
    origin_pic: picAsal,
    dest_loc: lokTujuan,
    dest_pic: picTujuan,
    purpose: keperluan
  };

  if (typeof API !== 'undefined') {
    const res = await API.createMutation(payload);
    if (res && res.success) {
      showToast(res.message || 'Pengajuan mutasi berhasil dibuat!', 'success');
      closeModalMutasiBaru();
      e.target.reset();
      await loadMutasiFromBackend();
      return;
    }
  }

  const newBastNo = `BAST/MUT/2025/00${String(Math.floor(Math.random() * 50) + 85)}`;
  const newItem = {
    id: mutasiData.length + 1,
    bastNo: newBastNo,
    date: 'Hari ini • Baru saja',
    typeTag: '• Mutasi Internal',
    typeColor: 'text-[#0284c7]',
    dotColor: 'bg-blue-500',
    assetName: namaAset,
    assetImg: '../assets/laptop.jpg',
    nup: `SAR/2025/0${Math.floor(Math.random() * 800) + 100}`,
    unitCount: `${jumlah} Unit`,
    originLoc: lokAsal,
    originPic: `PIC: ${picAsal}`,
    originNip: 'NIP. 19880101201501',
    destLoc: lokTujuan,
    destPic: `PIC: ${picTujuan}`,
    destNip: 'NIP. 19920202201802',
    purpose: keperluan.length > 20 ? keperluan.substring(0, 20) + '...' : keperluan,
    fullPurpose: keperluan,
    docName: 'BAST-Draft.pdf',
    docStatus: 'Menunggu TTD Fisik',
    docVerified: false,
    status: 'Dalam Proses Pemindahan',
    statusBadge: 'bg-[#dbeafe] text-[#1d4ed8]',
    statusIcon: 'truck',
    category: 'it',
    month: '2025-03'
  };

  mutasiData.unshift(newItem);
  closeModalMutasiBaru();
  renderTable();
  showToast(`Pengajuan mutasi ${newBastNo} berhasil dibuat!`, 'success');
  e.target.reset();
}

window.verifyMutation = async function(id, bastNo) {
  if (typeof requirePermission === 'function') {
    if (!requirePermission('mutasi:manage', 'Memverifikasi BAST Mutasi')) return;
  }
  const item = mutasiData.find(m => m.id === id);
  if (item) {
    item.docVerified = true;
    item.docStatus = 'TTD Digital';
    item.docName = `${bastNo.replace(/\//g, '-')}.pdf`;
    item.status = 'Selesai Terverifikasi';
    item.statusBadge = 'bg-[#ccfbf1] text-[#0f766e]';
    item.statusIcon = 'check-circle';
    renderTable();
  }
  if (typeof API !== 'undefined' && API.approveMutation) {
    try {
      await API.approveMutation(id);
    } catch (e) {
      // ignore fallback
    }
  }
  showToast(`Dokumen ${bastNo} berhasil diverifikasi dan disahkan!`, 'success');
};

async function loadMutasiFromBackend() {
  if (typeof API !== 'undefined') {
    const res = await API.getMutations();
    if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
      mutasiData = res.data.map(m => {
        const isDone = (m.status || '').includes('Selesai') || (m.doc_status || '').includes('Digital');
        return {
          id: m.id,
          bastNo: m.bast_no,
          date: m.date || 'Hari ini',
          typeTag: '• Mutasi Internal',
          typeColor: isDone ? 'text-[#0f766e]' : 'text-[#0284c7]',
          dotColor: isDone ? 'bg-emerald-500' : 'bg-blue-500',
          assetName: m.asset_name,
          assetImg: '../assets/laptop.jpg',
          nup: m.nup || 'SAR/2025/001',
          unitCount: m.unit_count || '1 Unit',
          originLoc: m.origin_loc,
          originPic: (m.origin_pic || '').startsWith('PIC:') ? m.origin_pic : `PIC: ${m.origin_pic}`,
          originNip: m.origin_nip || '',
          destLoc: m.dest_loc,
          destPic: (m.dest_pic || '').startsWith('PIC:') ? m.dest_pic : `PIC: ${m.dest_pic}`,
          destNip: m.dest_nip || '',
          purpose: m.purpose || '',
          fullPurpose: m.purpose || '',
          docName: isDone ? 'BAST-Resmi.pdf' : 'BAST-Draft.pdf',
          docStatus: m.doc_status || (isDone ? 'TTD Digital' : 'Menunggu TTD Fisik'),
          docVerified: isDone,
          status: m.status || 'Dalam Proses Pemindahan',
          statusBadge: isDone ? 'bg-[#ccfbf1] text-[#0f766e]' : 'bg-[#dbeafe] text-[#1d4ed8]',
          statusIcon: isDone ? 'check-circle' : 'truck',
          category: 'it',
          month: '2025-03'
        };
      });
      renderTable();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadMutasiFromBackend();
});

// ===================== 7. EVENT LISTENERS =====================

function setupEventListeners() {
  const searchInput = document.getElementById('search-mutasi-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
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

  const categorySelect = document.getElementById('filter-category');
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      currentCategoryFilter = e.target.value;
      renderTable();
    });
  }

  const resetBtn = document.getElementById('btn-reset-filter');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentSearchQuery = '';
      currentStatusFilter = 'all';
      currentCategoryFilter = 'all';
      if (searchInput) searchInput.value = '';
      if (statusSelect) statusSelect.value = 'all';
      if (categorySelect) categorySelect.value = 'all';
      renderTable();
      showToast('Filter mutasi aset berhasil direset.', 'info');
    });
  }
}

// ===================== 8. EKSPOR REKAP CSV =====================

function exportMutasiCSV() {
  const headers = ['NO BAST', 'TANGGAL', 'NAMA ASET', 'NUP', 'JUMLAH', 'LOKASI ASAL', 'PIC ASAL', 'LOKASI TUJUAN', 'PIC TUJUAN', 'KEPERLUAN', 'STATUS'];
  const rows = mutasiData.map(m => [
    `"${(m.bastNo || '').replace(/"/g, '""')}"`,
    `"${(m.date || '').replace(/"/g, '""')}"`,
    `"${(m.assetName || '').replace(/"/g, '""')}"`,
    `"${(m.nup || '').replace(/"/g, '""')}"`,
    `"${(m.unitCount || '').replace(/"/g, '""')}"`,
    `"${(m.originLoc || '').replace(/"/g, '""')}"`,
    `"${(m.originPic || '').replace(/"/g, '""')}"`,
    `"${(m.destLoc || '').replace(/"/g, '""')}"`,
    `"${(m.destPic || '').replace(/"/g, '""')}"`,
    `"${(m.fullPurpose || '').replace(/"/g, '""')}"`,
    `"${(m.status || '').replace(/"/g, '""')}"`
  ]);

  const BOM = '\uFEFF';
  const delimiter = ';';
  const csvContent = BOM + [headers.join(delimiter), ...rows.map(e => e.join(delimiter))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SIMAS_Riwayat_Mutasi_Aset_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('File CSV Riwayat Mutasi Aset berhasil diunduh.', 'success');
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
