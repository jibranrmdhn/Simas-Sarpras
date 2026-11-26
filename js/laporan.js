/**
 * SIMAS - Halaman Laporan & Rangkuman Aktivitas Sistem
 * Data Dinamis Array, Visualisasi Chart.js, Filter Client-Side & Ekspor Cetak
 */

// ===================== 1. DATA MASTER =====================

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-panel-left', href: 'index.html', active: false },
  { id: 'aset', label: 'Manajemen Aset', icon: 'archive', href: 'aset.html', active: false },
  { id: 'gedung', label: 'Gedung & Ruangan', icon: 'building-2', href: 'gedung.html', active: false },
  { id: 'peminjaman', label: 'Peminjaman & Reservasi', icon: 'calendar-clock', href: 'peminjaman.html', active: false },
  { id: 'antrean', label: 'Antrean Persetujuan', icon: 'check-square', href: 'antrean.html', active: false, badge: 4 },
  { id: 'pemeliharaan', label: 'Pemeliharaan & Tiket', icon: 'wrench', href: 'tiket.html', active: false },
  { id: 'mutasi', label: 'Mutasi Aset', icon: 'arrow-left-right', href: 'mutasi.html', active: false },
  { id: 'stock', label: 'Stock Opname', icon: 'scan-barcode', href: 'stock.html', active: false },
  { id: 'laporan', label: 'Laporan & Rangkuman', icon: 'file-text', href: 'laporan.html', active: true },
];

const reportLogsData = [
  {
    waktu: '28 Mar 2025 • 14:16',
    kodeDokumen: 'MUT-2025-0084',
    nup: 'AST-2023-0182',
    namaSarana: 'Interactive Smartboard 75"',
    jenisTransaksi: 'Mutasi Lokasi',
    pelaksana: 'Bambang Irawan (Admin)',
    unit: 'GKB ke R. Sidang Senat',
    status: 'Tersimpan',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    waktu: '28 Mar 2025 • 13:40',
    kodeDokumen: 'LOAN-2025-0345',
    nup: 'AST-2024-1104',
    namaSarana: 'Laptop Lenovo ThinkPad T14',
    jenisTransaksi: 'Peminjaman',
    pelaksana: 'Dewi Sartika',
    unit: 'Kepegawaian & Tata Usaha',
    status: 'Selesai',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    waktu: '28 Mar 2025 • 11:20',
    kodeDokumen: 'RSV-2025-0041',
    nup: 'RNG-2022-0041',
    namaSarana: 'Auditorium Sasana Graha (Lt. 4)',
    jenisTransaksi: 'Reservasi Ruangan',
    pelaksana: 'Agus Riyadi',
    unit: 'Lembaga Penelitian (LPPM)',
    status: 'Disetujui',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  },
  {
    waktu: '28 Mar 2025 • 09:05',
    kodeDokumen: 'TKT-2025-0084',
    nup: 'AST-2021-0855',
    namaSarana: 'AC Split 2 PK Daikin Inverter',
    jenisTransaksi: 'Tiket Kerusakan',
    pelaksana: 'Rina Hartati',
    unit: 'Lab Komputer 2 (TIK)',
    status: 'Proses',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  {
    waktu: '27 Mar 2025 • 16:30',
    kodeDokumen: 'STK-2025-0012',
    nup: 'SAR/2023/0440',
    namaSarana: 'Mikroskop Binokuler Olympus CX23',
    jenisTransaksi: 'Stock Opname',
    pelaksana: 'Dedi Ardiansyah',
    unit: 'Lab Terpadu (Fak. Sains)',
    status: 'Selesai',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    waktu: '27 Mar 2025 • 10:15',
    kodeDokumen: 'LOAN-2025-0348',
    nup: 'FAC-RNG-004',
    namaSarana: 'Ruang Rapat Paripurna (Lt. 2)',
    jenisTransaksi: 'Peminjaman',
    pelaksana: 'Wahyu Setiawan, M.T.',
    unit: 'Subbag Data & TI (Pusdatin)',
    status: 'Disetujui',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  },
  {
    waktu: '26 Mar 2025 • 15:45',
    kodeDokumen: 'MUT-2025-0083',
    nup: 'SAR/2024/0112',
    namaSarana: 'PC Lenovo ThinkCentre M70s (10 Unit)',
    jenisTransaksi: 'Mutasi Lokasi',
    pelaksana: 'Hendra Setiawan',
    unit: 'Rektorat ke Pelayanan Mhs',
    status: 'Proses',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    waktu: '25 Mar 2025 • 08:30',
    kodeDokumen: 'TKT-2024-1033',
    nup: 'SAR/2022/0319',
    namaSarana: 'Genset Silent 50 kVA Cummins',
    jenisTransaksi: 'Tiket Kerusakan',
    pelaksana: 'Irfan Kusuma (Teknisi)',
    unit: 'Gardu Daya Timur',
    status: 'Selesai',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }
];

let filteredReportData = [...reportLogsData];
let reportChartInstance = null;

// ===================== 2. RENDER FUNCTIONS =====================

function renderSidebar() {
  if (typeof renderNavigation === 'function') {
    renderNavigation('laporan');
    return;
  }
  const container = document.getElementById('sidebar-menu-list');
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
}

function renderReportTable(data = filteredReportData) {
  const tbody = document.getElementById('report-table-body');
  const countBadge = document.getElementById('report-count-badge');
  if (!tbody) return;

  if (countBadge) {
    countBadge.textContent = `Menampilkan ${data.length} dari ${reportLogsData.length} catatan aktivitas`;
  }

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-slate-400 text-xs">
          Tidak ada riwayat transaksi yang sesuai dengan filter atau kata kunci pencarian.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = data.map(item => `
    <tr class="hover:bg-slate-50/70 transition">
      <td class="py-3 px-3 text-slate-500 whitespace-nowrap">${item.waktu}</td>
      <td class="py-3 px-3 font-mono font-bold text-blue-700 whitespace-nowrap">${item.kodeDokumen}</td>
      <td class="py-3 px-3 font-medium text-slate-900">
        <div>${item.namaSarana}</div>
        <div class="text-[10px] text-slate-400 font-mono">NUP: ${item.nup}</div>
      </td>
      <td class="py-3 px-3 text-slate-700 whitespace-nowrap">
        <span class="font-semibold">${item.jenisTransaksi}</span>
      </td>
      <td class="py-3 px-3 text-slate-700">
        <div class="font-medium">${item.pelaksana}</div>
        <div class="text-[10px] text-slate-400">${item.unit}</div>
      </td>
      <td class="py-3 px-3 whitespace-nowrap">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeClass}">${item.status}</span>
      </td>
      <td class="py-3 px-3 text-right whitespace-nowrap no-print">
        <button onclick="printSingleRecord('${item.kodeDokumen}')" class="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition" title="Cetak Riwayat">
          Cetak
        </button>
      </td>
    </tr>
  `).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

// ===================== 3. CHART.JS VISUALISASI =====================

function initReportChart() {
  const canvas = document.getElementById('reportActivityChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const ctx = canvas.getContext('2d');

  if (reportChartInstance) {
    reportChartInstance.destroy();
  }

  reportChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Okt 2024', 'Nov 2024', 'Des 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025'],
      datasets: [
        {
          label: 'Peminjaman & Reservasi',
          data: [120, 145, 95, 160, 185, 210],
          backgroundColor: '#102f86',
          borderRadius: 6
        },
        {
          label: 'Mutasi Lokasi & BAST',
          data: [15, 22, 10, 25, 18, 28],
          backgroundColor: '#0d9488',
          borderRadius: 6
        },
        {
          label: 'Tiket Perbaikan & Servis',
          data: [35, 42, 28, 40, 36, 48],
          backgroundColor: '#f59e0b',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: { family: 'Plus Jakarta Sans', size: 11, weight: 600 },
            boxWidth: 12,
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { family: 'Plus Jakarta Sans', size: 12 },
          bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
          padding: 10,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#64748b' }
        },
        y: {
          grid: { color: '#f1f5f9' },
          ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#64748b' },
          beginAtZero: true
        }
      }
    }
  });
}

function updateReportChart(filterValue) {
  if (!reportChartInstance) return;

  if (filterValue === 'peminjaman') {
    reportChartInstance.data.datasets[0].hidden = false;
    reportChartInstance.data.datasets[1].hidden = true;
    reportChartInstance.data.datasets[2].hidden = true;
  } else if (filterValue === 'mutasi') {
    reportChartInstance.data.datasets[0].hidden = true;
    reportChartInstance.data.datasets[1].hidden = false;
    reportChartInstance.data.datasets[2].hidden = true;
  } else if (filterValue === 'tiket') {
    reportChartInstance.data.datasets[0].hidden = true;
    reportChartInstance.data.datasets[1].hidden = true;
    reportChartInstance.data.datasets[2].hidden = false;
  } else {
    reportChartInstance.data.datasets.forEach(ds => ds.hidden = false);
  }

  reportChartInstance.update();
}

// ===================== 4. FILTERING & SEARCH =====================

function applyReportFilters() {
  const search = document.getElementById('report-search-input').value.toLowerCase().trim();
  const typeFilter = document.getElementById('report-type-filter').value;
  const statusFilter = document.getElementById('report-status-filter').value;

  filteredReportData = reportLogsData.filter(item => {
    const matchSearch = !search || [item.kodeDokumen, item.nup, item.namaSarana, item.pelaksana, item.unit, item.jenisTransaksi].some(v => (v || '').toLowerCase().includes(search));
    const jt = (item.jenisTransaksi || '').toLowerCase();
    let matchType = typeFilter === 'all' || item.jenisTransaksi === typeFilter;
    if (!matchType && typeFilter !== 'all') {
      if (typeFilter === 'Peminjaman Sarana' && (jt.includes('pinjam') || jt.includes('reservasi'))) matchType = true;
      else if (typeFilter === 'Mutasi Aset' && jt.includes('mutasi')) matchType = true;
      else if (typeFilter === 'Pemeliharaan & Servis' && (jt.includes('tiket') || jt.includes('pemeliharaan') || jt.includes('servis'))) matchType = true;
      else if (typeFilter === 'Stock Opname' && jt.includes('opname')) matchType = true;
      else if (typeFilter === 'Penghapusan Aset' && jt.includes('hapus')) matchType = true;
    }
    const st = (item.status || '').toLowerCase();
    const matchStatus = statusFilter === 'all' || item.status === statusFilter || (statusFilter === 'Tersimpan' && (st === 'selesai' || st === 'disetujui' || st === 'aktif'));
    return matchSearch && matchType && matchStatus;
  });

  renderReportTable(filteredReportData);
}

function resetReportFilters() {
  document.getElementById('report-search-input').value = '';
  document.getElementById('report-type-filter').value = 'all';
  document.getElementById('report-status-filter').value = 'all';
  filteredReportData = [...reportLogsData];
  renderReportTable(filteredReportData);
  showToast('Filter laporan berhasil direset ke tampilan default.', 'info');
}

// ===================== 5. EKSPOR & PRINT =====================

function printSingleRecord(kode) {
  const item = reportLogsData.find(r => r.kodeDokumen === kode) || filteredReportData[0];
  if (!item) {
    window.print();
    return;
  }

  let modal = document.getElementById('simas-report-print-modal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'simas-report-print-modal';
  modal.className = 'fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 no-print';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#eef4ff]">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-[#0f2a71] text-white flex items-center justify-center">
            <i data-lucide="printer" class="w-4 h-4"></i>
          </div>
          <div>
            <h3 class="text-sm font-extrabold text-slate-900">Bukti Audit Transaksi SIMAS</h3>
            <p class="text-[11px] text-slate-600 font-mono">${item.kodeDokumen}</p>
          </div>
        </div>
        <button type="button" onclick="document.getElementById('simas-report-print-modal').remove()" class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="p-5 space-y-3 text-xs">
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div class="flex justify-between"><span class="text-slate-500">Nomor Dokumen:</span><span class="font-bold font-mono text-[#0f2a71]">${item.kodeDokumen}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Waktu Tercatat:</span><span class="font-semibold text-slate-800">${item.waktu}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Jenis Transaksi:</span><span class="font-bold text-slate-900">${item.jenisTransaksi}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Kode NUP / Aset:</span><span class="font-mono font-semibold text-slate-700">${item.nup}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Penanggung Jawab:</span><span class="font-semibold text-slate-800">${item.pelaksana} (${item.unit})</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Status Verifikasi:</span><span class="px-2 py-0.5 rounded-md font-bold ${item.badgeClass}">${item.status}</span></div>
        </div>
        <div>
          <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Objek Sarana / Rincian Aktivitas</span>
          <p class="mt-1 p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-slate-800 font-semibold">${item.namaSarana}</p>
        </div>
      </div>
      <div class="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
        <button type="button" onclick="document.getElementById('simas-report-print-modal').remove()" class="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold cursor-pointer">
          Tutup
        </button>
        <button type="button" onclick="window.print()" class="px-4 py-1.5 rounded-xl bg-[#0f2a71] hover:bg-[#0a1e54] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer">
          <i data-lucide="printer" class="w-3.5 h-3.5"></i> Cetak Dokumen Ini
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  if (window.lucide) lucide.createIcons();
  showToast(`Menampilkan pratinjau bukti audit ${kode}.`, 'info');
}

function exportReportCSV() {
  const headers = ['WAKTU', 'NO DOKUMEN', 'KODE NUP', 'NAMA SARANA', 'JENIS TRANSAKSI', 'PENANGGUNG JAWAB', 'UNIT KERJA', 'STATUS'];
  const rows = filteredReportData.map(r => [
    `"${(r.waktu || '').replace(/"/g, '""')}"`,
    `"${(r.kodeDokumen || '').replace(/"/g, '""')}"`,
    `"${(r.nup || '').replace(/"/g, '""')}"`,
    `"${(r.namaSarana || '').replace(/"/g, '""')}"`,
    `"${(r.jenisTransaksi || '').replace(/"/g, '""')}"`,
    `"${(r.pelaksana || '').replace(/"/g, '""')}"`,
    `"${(r.unit || '').replace(/"/g, '""')}"`,
    `"${(r.status || '').replace(/"/g, '""')}"`
  ]);

  const BOM = '\uFEFF';
  const delimiter = ';';
  const csvContent = BOM + [headers.join(delimiter), ...rows.map(e => e.join(delimiter))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SIMAS_Laporan_Aktivitas_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('File CSV Laporan Aktivitas berhasil diunduh.', 'success');
}

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

// ===================== 6. INISIALISASI =====================

async function loadReportDataFromBackend() {
  if (typeof API === 'undefined') return;
  try {
    const existingCodes = new Set(reportLogsData.map(item => item.kodeDokumen));
    const [logsRes, loansRes, ticketsRes] = await Promise.all([
      API.getActivityLogs(),
      API.getLoans(),
      API.getTickets()
    ]);

    const newEntries = [];

    if (loansRes && loansRes.success && Array.isArray(loansRes.data)) {
      loansRes.data.slice(0, 10).forEach(l => {
        if (!existingCodes.has(l.kode)) {
          existingCodes.add(l.kode);
          newEntries.push({
            waktu: `${l.tgl_pinjam || '2025-03-01'}, 09:00 WIB`,
            kodeDokumen: l.kode,
            nup: `AST-LOAN-${l.id}`,
            namaSarana: l.asset_nama || 'Sarana Kampus',
            jenisTransaksi: 'Peminjaman Sarana',
            pelaksana: l.peminjam_nama || 'Civitas Akademika',
            unit: l.peminjam_nip || 'Unit Kampus',
            status: l.status === 'Menunggu Approval' ? 'Menunggu TTD' : 'Tersimpan',
            badgeClass: l.status === 'Menunggu Approval' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          });
        }
      });
    }

    if (ticketsRes && ticketsRes.success && Array.isArray(ticketsRes.data)) {
      ticketsRes.data.slice(0, 10).forEach(t => {
        if (!existingCodes.has(t.kode)) {
          existingCodes.add(t.kode);
          newEntries.push({
            waktu: `${t.created_at || '2025-03-01'}, 10:30 WIB`,
            kodeDokumen: t.kode,
            nup: `MNT-${t.id}`,
            namaSarana: `${t.title} (${t.location || t.gedung || 'Kampus'})`,
            jenisTransaksi: 'Pemeliharaan & Servis',
            pelaksana: t.tech_name || 'Tim Teknisi',
            unit: t.gedung || 'Unit Pemeliharaan',
            status: t.status === 'selesai' ? 'Tersimpan' : 'Dalam Proses',
            badgeClass: t.status === 'selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
          });
        }
      });
    }

    if (logsRes && logsRes.success && Array.isArray(logsRes.data)) {
      logsRes.data.slice(0, 15).forEach(l => {
        const docCode = `LOG-2025-00${l.id}`;
        if (!existingCodes.has(docCode)) {
          existingCodes.add(docCode);
          newEntries.push({
            waktu: l.timestamp || 'Baru Saja',
            kodeDokumen: docCode,
            nup: 'SYS-AUDIT',
            namaSarana: l.details || l.action,
            jenisTransaksi: l.action,
            pelaksana: l.user_name || 'System',
            unit: 'Pusat Sarpras',
            status: 'Tersimpan',
            badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
          });
        }
      });
    }

    if (newEntries.length > 0) {
      reportLogsData.unshift(...newEntries);
    }
    filteredReportData = [...reportLogsData];
    applyReportFilters();

    const summaryTotal = document.getElementById('summary-total');
    if (summaryTotal) {
      summaryTotal.textContent = (1474 + reportLogsData.length).toLocaleString('id-ID');
    }
  } catch (err) {
    console.warn('Laporan backend sync warning:', err);
  }
}

let pdfLaporanPeriod = 'Semua Periode Aktif';
let pdfLaporanCategory = 'Semua Kategori (Aset, Pinjam, Servis)';
let pdfLiveReportState = {
  assets: [],
  loans: [],
  tickets: [],
  loaded: false
};

async function loadPdfLaporanLiveStats() {
  if (typeof API === 'undefined') return;
  try {
    const [assetsRes, loansRes, ticketsRes] = await Promise.all([
      API.getAssets(),
      API.getLoans(),
      API.getTickets()
    ]);
    pdfLiveReportState = {
      assets: (assetsRes && assetsRes.success && Array.isArray(assetsRes.data)) ? assetsRes.data : [],
      loans: (loansRes && loansRes.success && Array.isArray(loansRes.data)) ? loansRes.data : [],
      tickets: (ticketsRes && ticketsRes.success && Array.isArray(ticketsRes.data)) ? ticketsRes.data : [],
      loaded: true
    };
    renderPdfLaporanView();
  } catch (err) {
    console.warn('Live laporan stats warning:', err.message);
  }
}

window.applyPdfLaporanFilter = function() {
  const pEl = document.getElementById('pdf-laporan-period');
  const cEl = document.getElementById('pdf-laporan-category');
  if (pEl) pdfLaporanPeriod = pEl.value;
  if (cEl) pdfLaporanCategory = cEl.value;
  if (typeof applyReportFilters === 'function') applyReportFilters();
  renderPdfLaporanView();
  if (typeof showToast === 'function') {
    showToast(`Filter laporan diterapkan: ${pdfLaporanCategory} (${pdfLaporanPeriod}).`);
  }
};

window.downloadOfficialReportHTML = function() {
  const sheet = document.getElementById('pdf-official-report-sheet');
  const inner = sheet ? sheet.innerHTML : '<p>Laporan Rekapitulasi SIMAS</p>';
  const html = `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>Dokumen Resmi Laporan SIMAS</title>
<style>body{font-family:Arial,Helvetica,sans-serif;color:#0f172a;padding:32px;background:#fff;max-width:960px;margin:0 auto;}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:12px;}
th,td{border:1px solid #cbd5e1;padding:8px 10px;text-align:left;}
th{background:#f1f5f9;font-size:11px;text-transform:uppercase;}
.text-center{text-align:center;}.font-bold,.font-extrabold{font-weight:700;}.uppercase{text-transform:uppercase;}</style>
</head><body>${inner}<p style="font-size:10px;color:#64748b;margin-top:24px;">Diekspor otomatis dari SIMAS pada ${new Date().toLocaleString('id-ID')}</p></body></html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SIMAS_Dokumen_Resmi_Laporan_${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  if (typeof showToast === 'function') {
    showToast('Dokumen Laporan Resmi (HTML siap cetak) berhasil diunduh!');
  }
};

function renderPdfLaporanView() {
  const mainEl = document.querySelector('main');
  if (!mainEl) return;

  Array.from(mainEl.children).forEach(ch => {
    if (ch.id !== 'simas-pdf-laporan-root' && !ch.id?.startsWith('modal-')) {
      ch.classList.add('hidden');
    }
  });

  let root = document.getElementById('simas-pdf-laporan-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'simas-pdf-laporan-root';
    mainEl.prepend(root);
  }

  const assets = pdfLiveReportState.assets || [];
  const loans = pdfLiveReportState.loans || [];
  const tickets = pdfLiveReportState.tickets || [];

  const totalAssets = assets.length;
  const totalValuation = assets.reduce((sum, a) => sum + (Number(a.nilai) || 0), 0);
  const totalMaintenanceCost = tickets.reduce((sum, t) => sum + (Number(t.cost) || 0), 0);
  const totalLoans = loans.length;
  const completedLoans = loans.filter(l => {
    const s = String(l.status || '').toLowerCase();
    return !s.includes('verifikasi') && (s.includes('selesai') || s.includes('dikembalikan'));
  }).length;
  const activeLoans = loans.filter(l => {
    const s = String(l.status || '').toLowerCase();
    return s.includes('dipinjam') || s.includes('setuju') || s.includes('aktif');
  }).length;

  // Build dynamic table rows according to selected category
  let tableHeaderCols = '';
  let tableBodyRows = '';

  if (pdfLaporanCategory.includes('Sirkulasi')) {
    tableHeaderCols = `
      <th class="py-2.5 px-3">KODE</th>
      <th class="py-2.5 px-3">PEMOHON</th>
      <th class="py-2.5 px-3">SARANA / RUANGAN</th>
      <th class="py-2.5 px-3">JADWAL PINJAM</th>
      <th class="py-2.5 px-3">STATUS</th>
    `;
    tableBodyRows = loans.length === 0
      ? `<tr><td colspan="5" class="py-4 px-3 text-center text-slate-400">Belum ada transaksi peminjaman tercatat.</td></tr>`
      : loans.slice(0, 15).map(l => `
        <tr>
          <td class="py-2.5 px-3 font-mono font-bold text-[#1D4ED8]">${l.kode || '-'}</td>
          <td class="py-2.5 px-3 font-medium text-slate-900">${l.peminjam_nama || '-'}</td>
          <td class="py-2.5 px-3">${l.asset_nama || '-'}</td>
          <td class="py-2.5 px-3 text-[11px]">${l.tgl_pinjam || '-'} s/d ${l.tgl_kembali || '-'}</td>
          <td class="py-2.5 px-3 font-semibold">${l.status || '-'}</td>
        </tr>
      `).join('');
  } else if (pdfLaporanCategory.includes('Pemeliharaan')) {
    tableHeaderCols = `
      <th class="py-2.5 px-3">KODE TIKET</th>
      <th class="py-2.5 px-3">PERBAIKAN / KELUHAN</th>
      <th class="py-2.5 px-3">LOKASI</th>
      <th class="py-2.5 px-3">STATUS</th>
      <th class="py-2.5 px-3">BIAYA SERVIS</th>
    `;
    tableBodyRows = tickets.length === 0
      ? `<tr><td colspan="5" class="py-4 px-3 text-center text-slate-400">Belum ada tiket pemeliharaan tercatat.</td></tr>`
      : tickets.slice(0, 15).map(t => `
        <tr>
          <td class="py-2.5 px-3 font-mono font-bold text-[#1D4ED8]">${t.kode || '-'}</td>
          <td class="py-2.5 px-3 font-medium text-slate-900">${t.title || '-'}</td>
          <td class="py-2.5 px-3">${t.location || t.gedung || '-'}</td>
          <td class="py-2.5 px-3 uppercase font-semibold">${t.status || '-'}</td>
          <td class="py-2.5 px-3 font-medium text-slate-900">Rp ${Number(t.cost || 0).toLocaleString('id-ID')}</td>
        </tr>
      `).join('');
  } else {
    // Group real assets by gedung
    const gedungMap = new Map();
    assets.forEach(a => {
      const g = a.gedung || 'Gedung Kampus Terpadu';
      if (!gedungMap.has(g)) {
        gedungMap.set(g, { name: g, total: 0, baik: 0, rusak: 0, nilai: 0 });
      }
      const entry = gedungMap.get(g);
      entry.total += 1;
      entry.nilai += Number(a.nilai) || 0;
      const cond = String(a.kondisi || 'Baik').toLowerCase();
      if (cond.includes('rusak') || String(a.status || '').toLowerCase().includes('rawat')) {
        entry.rusak += 1;
      } else {
        entry.baik += 1;
      }
    });
    const rowsArr = Array.from(gedungMap.values());
    tableHeaderCols = `
      <th class="py-2.5 px-3">NO</th>
      <th class="py-2.5 px-3">KOMPLEKS GEDUNG / UNIT KERJA</th>
      <th class="py-2.5 px-3">TOTAL ASET</th>
      <th class="py-2.5 px-3">KONDISI BAIK</th>
      <th class="py-2.5 px-3">SERVIS / RUSAK</th>
      <th class="py-2.5 px-3">VALUASI ASET</th>
    `;
    tableBodyRows = rowsArr.length === 0
      ? `<tr><td colspan="6" class="py-4 px-3 text-center text-slate-400">Memuat data inventaris dari database...</td></tr>`
      : rowsArr.map((r, i) => {
        const pct = r.total > 0 ? ((r.baik / r.total) * 100).toFixed(1) : '0.0';
        return `
          <tr>
            <td class="py-3 px-3">${i + 1}</td>
            <td class="py-3 px-3 font-medium text-slate-900">${r.name}</td>
            <td class="py-3 px-3">${r.total} Unit</td>
            <td class="py-3 px-3 font-semibold text-emerald-600">${r.baik} Unit (${pct}%)</td>
            <td class="py-3 px-3">${r.rusak} Unit</td>
            <td class="py-3 px-3 font-medium text-slate-900">Rp ${r.nilai.toLocaleString('id-ID')}</td>
          </tr>
        `;
      }).join('');
  }

  root.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
      <!-- Top Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 class="text-base font-bold text-slate-900">Pusat Laporan &amp; Arsip BAST Sarana Prasarana</h2>
        <div class="flex items-center gap-2.5">
          <button type="button" onclick="exportReportCSV()" class="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer">
            Unduh Excel / CSV
          </button>
          <button type="button" onclick="downloadOfficialReportHTML()" class="px-4 py-2 rounded-lg bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition cursor-pointer">
            Unduh Dokumen Resmi
          </button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3 flex flex-wrap items-center justify-between gap-3 mb-5">
        <div class="flex flex-wrap items-center gap-3 flex-1">
          <select id="pdf-laporan-period" class="px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 min-w-[240px] focus:outline-none cursor-pointer">
            <option value="Semua Periode Aktif" ${pdfLaporanPeriod === 'Semua Periode Aktif' ? 'selected' : ''}>Periode Laporan: Semua Periode Aktif</option>
            <option value="Bulan November 2026" ${pdfLaporanPeriod === 'Bulan November 2026' ? 'selected' : ''}>Periode Laporan: Bulan November 2026</option>
            <option value="Semester Ganjil 2026/2027" ${pdfLaporanPeriod === 'Semester Ganjil 2026/2027' ? 'selected' : ''}>Periode Laporan: Semester Ganjil 2026/2027</option>
          </select>
          <select id="pdf-laporan-category" class="px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 min-w-[280px] focus:outline-none cursor-pointer">
            <option value="Semua Kategori (Aset, Pinjam, Servis)" ${pdfLaporanCategory.includes('Semua') ? 'selected' : ''}>Kategori Laporan: Semua Kategori (Aset, Pinjam, Servis)</option>
            <option value="Valuasi Inventaris & Aset" ${pdfLaporanCategory.includes('Valuasi') ? 'selected' : ''}>Kategori Laporan: Valuasi Inventaris &amp; Aset</option>
            <option value="Sirkulasi Peminjaman & SPK" ${pdfLaporanCategory.includes('Sirkulasi') ? 'selected' : ''}>Kategori Laporan: Sirkulasi Peminjaman &amp; SPK</option>
            <option value="Pemeliharaan & Servis Sarpras" ${pdfLaporanCategory.includes('Pemeliharaan') ? 'selected' : ''}>Kategori Laporan: Pemeliharaan &amp; Servis Sarpras</option>
          </select>
        </div>
        <button type="button" onclick="applyPdfLaporanFilter()" class="px-5 py-2 rounded-lg bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold transition cursor-pointer">
          Terapkan Filter
        </button>
      </div>

      <!-- 3 KPI Cards (Tersinkron Real-Time SQLite) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="rounded-xl border border-slate-200/90 bg-white p-4">
          <div class="text-xs font-semibold text-slate-500">Total Biaya Pemeliharaan</div>
          <div class="text-xl font-extrabold text-slate-900 mt-1">Rp ${totalMaintenanceCost.toLocaleString('id-ID')}</div>
          <div class="text-[11px] font-semibold text-emerald-600 mt-1">${tickets.length} Tiket Pemeliharaan Tercatat</div>
        </div>
        <div class="rounded-xl border border-slate-200/90 bg-white p-4">
          <div class="text-xs font-semibold text-slate-500">Sirkulasi Peminjaman</div>
          <div class="text-xl font-extrabold text-slate-900 mt-1">${totalLoans} Transaksi</div>
          <div class="text-[11px] font-semibold text-[#1D4ED8] mt-1">${activeLoans} Aktif Dipinjam • ${completedLoans} Selesai</div>
        </div>
        <div class="rounded-xl border border-slate-200/90 bg-white p-4">
          <div class="text-xs font-semibold text-slate-500">Valuasi Inventaris Aktif</div>
          <div class="text-xl font-extrabold text-slate-900 mt-1">Rp ${totalValuation.toLocaleString('id-ID')}</div>
          <div class="text-[11px] font-semibold text-slate-500 mt-1">${totalAssets} Unit Terverifikasi di Database</div>
        </div>
      </div>

      <!-- Official Document Sheet -->
      <div id="pdf-official-report-sheet" class="rounded-2xl border border-slate-300 bg-white p-6 md:p-8 shadow-2xs">
        <div class="text-center border-b border-slate-300 pb-4 mb-5">
          <div class="text-xs md:text-sm font-extrabold tracking-wide text-slate-900 uppercase">
            SISTEM INFORMASI MANAJEMEN SARANA &amp; PRASARANA (SIMAS)
          </div>
          <div class="text-[11px] text-slate-500 mt-1">
            BIRO SARANA &amp; PRASARANA KAMPUS • Laporan Real-Time Terintegrasi Database Inventaris
          </div>
        </div>

        <h3 class="text-center text-xs md:text-sm font-extrabold text-slate-900 uppercase mb-4">
          ${pdfLaporanCategory.toUpperCase()} — ${pdfLaporanPeriod.toUpperCase()}
        </h3>

        <!-- Table -->
        <div class="overflow-x-auto mb-8">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-100 text-[10px] font-bold uppercase text-slate-600 border-y border-slate-200">
                ${tableHeaderCols}
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-xs text-slate-700">
              ${tableBodyRows}
            </tbody>
          </table>
        </div>

        <!-- Signatures -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-xs text-slate-600">
          <div>
            <div>Disiapkan Oleh: Admin Sarpras</div>
            <div class="font-bold text-slate-900 mt-6">Bambang Irawan, S.Kom (NIP. 198804122015041002)</div>
          </div>
          <div class="sm:text-right">
            <div>Disahkan Oleh: Wakil Rektor II</div>
            <div class="font-bold text-slate-900 mt-6">Dr. Ir. Hendro Wicaksono, M.T. (NIP. 197508212002121001)</div>
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  renderReportTable();
  initReportChart();
  renderPdfLaporanView();
  loadReportDataFromBackend();
  loadPdfLaporanLiveStats();

  const printDateEl = document.getElementById('print-date');
  if (printDateEl) {
    const now = new Date();
    printDateEl.textContent = `Tanggal Cetak: ${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  }

  // Event Listeners for Filters
  const searchInput = document.getElementById('report-search-input');
  const typeFilter = document.getElementById('report-type-filter');
  const statusFilter = document.getElementById('report-status-filter');

  if (searchInput) searchInput.addEventListener('input', applyReportFilters);
  if (typeFilter) typeFilter.addEventListener('change', applyReportFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyReportFilters);

  if (window.lucide) {
    lucide.createIcons();
  }
});

