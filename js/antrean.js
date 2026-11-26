/**
 * SIMAS - Antrean Persetujuan & Otorisasi Sarpras
 * Skrip Logika, Data Dinamis Array, Seleksi Kartu, dan Aksi Otorisasi
 */

// ===================== 1. DATA MASTER =====================

const navMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-panel-left', href: 'index.html', active: false },
  { id: 'aset', label: 'Manajemen Aset', icon: 'archive', href: 'aset.html', active: false },
  { id: 'gedung', label: 'Gedung & Ruangan', icon: 'building-2', href: 'gedung.html', active: false },
  { id: 'peminjaman', label: 'Peminjaman & Reservasi', icon: 'calendar-clock', href: 'peminjaman.html', active: false },
  { id: 'antrean', label: 'Antrean Persetujuan', icon: 'check-square', href: 'antrean.html', active: true, badge: 4 },
  { id: 'pemeliharaan', label: 'Pemeliharaan & Tiket', icon: 'wrench', href: 'tiket.html', active: false },
  { id: 'mutasi', label: 'Mutasi Aset', icon: 'arrow-left-right', href: 'mutasi.html', active: false },
  { id: 'stock', label: 'Stock Opname', icon: 'scan-barcode', href: 'stock.html', active: false },
  { id: 'laporan', label: 'Laporan & Rangkuman', icon: 'file-text', href: 'laporan.html', active: false },
];

const approvalQueueData = [
  {
    id: '#APV-2025-0142',
    tag: 'PEMINJAMAN RUANGAN & ALAT • URGENT',
    tagClass: 'bg-rose-100 text-rose-800',
    isUrgent: true,
    title: 'Workshop Akreditasi Internasional ABET',
    category: 'ruangan',
    requester: 'Dr. Ir. Hendro Wicaksono, M.T. • Fakultas Teknik',
    requesterName: 'Dr. Ir. Hendro Wicaksono, M.T.',
    requesterNip: 'NIP. 197804152003121002 • Ka. Prodi Teknik Informatika',
    requesterPhone: '0812-3456-7890',
    requesterEmail: 'hendro@instansi.ac.id',
    requesterAvatar: '../assets/avatar_hendro.jpg',
    docNumber: '412/FT-TI/UND/2025',
    docLabel: 'Surat Pengantar Dekan',
    schedule: '29 Mar 2025 (Besok), 08:00 - 17:00 WIB',
    scheduleBadge: 'Besok (Kurang dari 24 jam)',
    scheduleDate: 'Sabtu, 29 Maret 2025',
    scheduleDuration: '08:00 - 17:00 WIB',
    scheduleDurationSub: 'Total: 9 Jam Penggunaan',
    facility: 'Auditorium Utama & 4 Mic Sennheiser',
    waitingFor: 'Menunggu: Ka. Biro Sarpras',
    statusActionText: 'Sedang Ditinjau →',
    items: [
      {
        title: 'Auditorium Utama Kampus Lt. 2',
        badge: 'Tersedia',
        badgeClass: 'bg-[#ccfbf1] text-[#0f766e]',
        sub: 'Kapasitas: 500 peserta • Gedung Rektorat Sayap Timur',
        code: 'KODE: RUANG-AUD-01',
        condition: 'Kondisi: Bersih & AC Prima',
        conditionClass: 'text-teal-700',
        img: '../assets/sidang_senat.jpg'
      },
      {
        title: 'Wireless Microphone Sennheiser EW-D',
        badge: '4 Unit',
        badgeClass: 'bg-[#dbeafe] text-[#1d4ed8]',
        sub: 'Serial: SN-MIC-2023-8891 s/d 8894',
        code: 'KODE: AST-AUD-042',
        condition: 'Baterai 100% + Cadangan',
        conditionClass: 'text-blue-700',
        img: '../assets/mic_sennheiser.jpg'
      },
      {
        title: 'Proyektor Laser Epson 10.000 Lumens',
        badge: '1 Unit Fixed',
        badgeClass: 'bg-[#dbeafe] text-[#1d4ed8]',
        sub: 'Resolusi WUXGA • Termasuk Kabel HDMI Optical 30m',
        code: 'KODE: AST-PRJ-011',
        condition: 'Lampu Laser: Normal (94%)',
        conditionClass: 'text-teal-700',
        img: '../assets/proyektor.jpg'
      }
    ],
    verifications: [
      { title: 'Nota Permohonan Dekan', desc: 'Terlampir format PDF dengan tanda tangan digital BSrE valid.' },
      { title: 'Bebas Konflik Jadwal Protokoler', desc: 'Tidak bertabrakan dengan agenda Dies Natalis Kampus.' },
      { title: 'Petugas Pendamping Teknis', desc: 'Operator Sound & Visual ditugaskan: Dedi Aryanto.' },
      { title: 'Pernyataan Tanggung Jawab', desc: 'Pakta integritas kerusakan sarana bermaterai telah diverifikasi.' }
    ],
    logText: 'Log: Draf diajukan 28 Mar 08:30 WIB • Diverifikasi Staf Sarpras (Ahmad Fauzi) 28 Mar 09:15 WIB'
  },
  {
    id: '#APV-2025-0139',
    tag: 'MUTASI ASET INTERN',
    tagClass: 'bg-sky-100 text-sky-800',
    isUrgent: false,
    title: 'Relokasi 15 Unit Laptop ThinkPad L14',
    category: 'mutasi',
    requester: 'Siti Rahmawati • Biro Keuangan',
    requesterName: 'Siti Rahmawati, S.E.',
    requesterNip: 'NIP. 198409122008012004 • Kabid Keuangan & Aset',
    requesterPhone: '0813-9876-5432',
    requesterEmail: 'siti.rahma@instansi.ac.id',
    requesterAvatar: '../assets/avatar_bambang.jpg',
    docNumber: '089/KEU-MUT/2025',
    docLabel: 'Nota Dinas Pemindahan',
    schedule: '30 Mar 2025, 09:00 - 14:00 WIB',
    scheduleBadge: 'Jadwal Normal',
    scheduleDate: 'Minggu, 30 Maret 2025',
    scheduleDuration: '09:00 - 14:00 WIB',
    scheduleDurationSub: 'Total: 5 Jam Relokasi',
    facility: 'Lab Komputer 102 → Unit Akuntansi Gedung C',
    waitingFor: 'Diajukan: 28 Mar 2025, 09:12 WIB',
    statusActionText: 'Verifikasi Admin',
    items: [
      {
        title: '15 Unit Laptop Lenovo ThinkPad L14 Gen 3',
        badge: '15 Unit',
        badgeClass: 'bg-blue-100 text-blue-800',
        sub: 'Seri Core i5 Gen 12, RAM 16GB, SSD 512GB',
        code: 'KODE: AST-IT-1400 s/d 1414',
        condition: 'Kondisi: Baik (95%)',
        conditionClass: 'text-teal-700',
        img: '../assets/laptop.jpg'
      }
    ],
    verifications: [
      { title: 'Berita Acara Mutasi Internal', desc: 'Ditandatangani oleh Kepala Unit Keuangan dan Pengelola Lab.' },
      { title: 'Pemeriksaan Nomor Seri & Fisik', desc: '15 unit terverifikasi lengkap beserta adaptor dan tas bawaan.' },
      { title: 'Sinkronisasi Database SIPD', desc: 'Pemetaan kode barcode telah diperbarui ke sistem pusat.' },
      { title: 'Persetujuan Kabag Perlengkapan', desc: 'Menunggu tanda tangan digital verifikator pusat.' }
    ],
    logText: 'Log: Diajukan oleh Siti Rahmawati 28 Mar 09:12 WIB • Berkas fisik lengkap'
  },
  {
    id: '#APV-2025-0118',
    tag: 'PENGHAPUSAN / DISPOSAL',
    tagClass: 'bg-purple-100 text-purple-800',
    isUrgent: false,
    title: 'Afkir 8 Unit Server Rack & 12 UPS Rusak Berat',
    category: 'disposal',
    requester: 'Tim Inventarisasi Kampus',
    requesterName: 'Ir. Agus Pratama (Ketua Tim Penghapusan)',
    requesterNip: 'NIP. 197103141997021001 • Auditor Sarpras',
    requesterPhone: '0821-4567-8901',
    requesterEmail: 'inventaris@instansi.ac.id',
    requesterAvatar: '../assets/avatar_hendro.jpg',
    docNumber: 'SK-REKTOR/029/DISP/2025',
    docLabel: 'SK Rektor & BA Penghapusan',
    schedule: 'Proses Lelang BMN Terjadwal',
    scheduleBadge: 'Tahap 2 KPKNL',
    scheduleDate: 'Bulan April 2025',
    scheduleDuration: 'Pelelangan Terbuka',
    scheduleDurationSub: 'Penyusutan Nilai 100%',
    facility: 'Gudang Logistik Pusat Kampus',
    waitingFor: 'SK Tim No: 88/SAR/2025',
    statusActionText: 'Review SK Tim',
    items: [
      {
        title: 'Server Rack HP ProLiant DL380 (8 Unit)',
        badge: 'Afkir',
        badgeClass: 'bg-rose-100 text-rose-800',
        sub: 'Pengadaan Tahun 2014, Motherboard & PSU Rusak Total',
        code: 'KODE: AST-SRV-0081 s/d 0088',
        condition: 'Nilai Buku: Rp 0',
        conditionClass: 'text-rose-700',
        img: '../assets/pompa_booster.jpg'
      }
    ],
    verifications: [
      { title: 'SK Tim Penghapusan Rektorat', desc: 'Surat Keputusan resmi telah diterbitkan dan bernomor sah.' },
      { title: 'Laporan Kerusakan Ahli TI', desc: 'Dinyatakan tidak ekonomis untuk diperbaiki kembali.' },
      { title: 'Pemeriksaan Fisik KPKNL', desc: 'Penilaian aset negara telah selesai dilaksanakan.' },
      { title: 'Berita Acara Penghapusan', desc: 'Format Berita Acara siap diarsipkan setelah persetujuan akhir.' }
    ],
    logText: 'Log: Diserahkan oleh Tim Inventarisasi 26 Mar 14:00 WIB • Menunggu otorisasi disposal'
  },
  {
    id: '#APV-2025-0145',
    tag: 'PEMINJAMAN KENDARAAN',
    tagClass: 'bg-sky-100 text-sky-800',
    isUrgent: false,
    title: 'Toyota HiAce Premio (B 7102 KPA)',
    category: 'ruangan',
    requester: 'Bagian Humas & Protokoler',
    requesterName: 'Nur Hidayat, S.Sos',
    requesterNip: 'NIP. 198901232015031003 • Kasubbag Protokol',
    requesterPhone: '0812-7890-1234',
    requesterEmail: 'protokol@instansi.ac.id',
    requesterAvatar: '../assets/avatar_bambang.jpg',
    docNumber: '045/HUMAS-OP/2025',
    docLabel: 'Surat Tugas Kedinasan',
    schedule: '30 Mar 2025, 06:30 - 21:00 WIB',
    scheduleBadge: 'Perjalanan Tamu VIP',
    scheduleDate: 'Minggu, 30 Maret 2025',
    scheduleDuration: '06:30 - 21:00 WIB',
    scheduleDurationSub: 'Total: 14.5 Jam Penugasan',
    facility: 'Kunjungan Tamu Asing Kemendikbud - 30 Mar 2025',
    waitingFor: 'Diajukan: 28 Mar 2025, 11:40 WIB',
    statusActionText: 'Cek Ketersediaan Driver',
    items: [
      {
        title: 'Toyota HiAce Premio 2.8 MT (14 Seat)',
        badge: 'Siap Jalan',
        badgeClass: 'bg-emerald-100 text-emerald-800',
        sub: 'Plat Merah B 7102 KPA • Odometer 34.200 km',
        code: 'KODE: AST-VH-009',
        condition: 'Kondisi: Bersih & BBM Penuh',
        conditionClass: 'text-teal-700',
        img: '../assets/studio_podcast.jpg'
      }
    ],
    verifications: [
      { title: 'Surat Tugas Tamu Kemendikbud', desc: 'Rombongan diplomatik dan delegasi kerjasama universitas.' },
      { title: 'Kesiapan Pengemudi Resmi', desc: 'Driver pool resmi telah dialokasikan: Bpk. Supriyadi.' },
      { title: 'Uji Kelayakan Kendaraan', desc: 'Pengecekan rem, ban, dan servis berkala tervalidasi prima.' },
      { title: 'Alokasi BBM & Tol Operasional', desc: 'Kupon bahan bakar dan e-toll telah disiapkan bendahara.' }
    ],
    logText: 'Log: Pengajuan diterima 28 Mar 11:40 WIB • Driver tervalidasi'
  }
];

// State Global
let currentSelectedApprovalId = '#APV-2025-0142';
let currentTabFilter = 'all';
let currentSearchQuery = '';
let onlyUrgent = false;

// ===================== 2. INITIALIZATION =====================

document.addEventListener('DOMContentLoaded', () => {
  renderSidebarMenu();
  renderApprovalList();
  selectApproval(currentSelectedApprovalId);
  setupEventListeners();
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// ===================== 3. SIDEBAR RENDERING =====================

function renderSidebarMenu() {
  if (typeof renderNavigation === 'function') {
    renderNavigation('antrean');
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

// ===================== 4. RENDER APPROVAL CARDS =====================

function getFilteredApprovals() {
  return approvalQueueData.filter(item => {
    if (onlyUrgent && !item.isUrgent) return false;
    if (currentTabFilter === 'riwayat') {
      const isDone = item.status === 'Disetujui' || item.status === 'Ditolak' || (item.waitingFor && (item.waitingFor.includes('Disetujui') || item.waitingFor.includes('Ditolak')));
      if (!isDone && approvalQueueData.some(a => a.status === 'Disetujui' || a.status === 'Ditolak')) {
        return false;
      }
    } else if (currentTabFilter !== 'all' && item.category !== currentTabFilter) {
      return false;
    }

    if (currentSearchQuery.trim() !== '') {
      const q = currentSearchQuery.toLowerCase();
      const match = item.id.toLowerCase().includes(q) ||
                    item.title.toLowerCase().includes(q) ||
                    item.requester.toLowerCase().includes(q) ||
                    item.facility.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });
}

function renderApprovalList() {
  const container = document.getElementById('approval-cards-list');
  if (!container) return;

  const filtered = getFilteredApprovals();

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-xl p-8 text-center text-slate-400 text-xs border border-slate-200/80">
        <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
        <p>Tidak ada permohonan dalam antrean sesuai filter.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isSelected = item.id === currentSelectedApprovalId;
    const activeClass = isSelected ? 'approval-card-active shadow-sm' : 'bg-white hover:bg-slate-50/70 border-slate-200/80';

    // Different sub-rows per item to match screenshot exactly
    let middleContent = '';
    let bottomAction = '';

    if (item.id === '#APV-2025-0142') {
      middleContent = `
        <div class="space-y-1 mt-2 text-[11px] text-slate-600">
          <div class="flex items-center gap-1.5">
            <i data-lucide="user" class="w-3.5 h-3.5 text-slate-400 shrink-0"></i>
            <span>${item.requester}</span>
          </div>
          <div class="flex items-center gap-1.5 font-semibold text-slate-800">
            <i data-lucide="calendar" class="w-3.5 h-3.5 text-slate-400 shrink-0"></i>
            <span>${item.schedule}</span>
          </div>
          <div class="flex items-center gap-1.5 text-slate-500">
            <i data-lucide="building" class="w-3.5 h-3.5 text-slate-400 shrink-0"></i>
            <span>${item.facility}</span>
          </div>
        </div>
      `;
      bottomAction = `
        <div class="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
          <div class="flex items-center gap-1.5 text-slate-600 font-medium">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>${item.waitingFor}</span>
          </div>
          <span class="font-bold text-blue-700 hover:underline flex items-center gap-0.5">${item.statusActionText}</span>
        </div>
      `;
    } else if (item.id === '#APV-2025-0139') {
      middleContent = `
        <div class="space-y-1.5 mt-2 text-[11px] text-slate-600">
          <div class="flex items-center gap-1.5">
            <i data-lucide="user" class="w-3.5 h-3.5 text-slate-400 shrink-0"></i>
            <span>${item.requester}</span>
          </div>
          <div class="bg-[#f8fafc] border border-slate-200/60 rounded-lg p-2 text-[11px] text-slate-700 flex items-center gap-2">
            <i data-lucide="arrow-left-right" class="w-3.5 h-3.5 text-blue-600 shrink-0"></i>
            <span>${item.facility}</span>
          </div>
        </div>
      `;
      bottomAction = `
        <div class="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
          <span class="text-slate-400">${item.waitingFor}</span>
          <span class="px-2.5 py-0.5 rounded-full font-bold bg-[#ccfbf1] text-[#0f766e]">${item.statusActionText}</span>
        </div>
      `;
    } else if (item.id === '#APV-2025-0118') {
      middleContent = `
        <div class="space-y-1.5 mt-2 text-[11px] text-slate-600">
          <div class="flex items-center gap-1.5">
            <i data-lucide="users" class="w-3.5 h-3.5 text-slate-400 shrink-0"></i>
            <span>${item.requester}</span>
          </div>
          <div class="text-[11px]">
            <span class="text-slate-400">Estimasi Nilai Buku:</span> <span class="font-bold text-slate-800">Rp 0 (Penyusutan Penuh)</span>
          </div>
          <div class="flex items-center gap-1.5 text-teal-700 font-semibold text-[11px]">
            <i data-lucide="file-check" class="w-3.5 h-3.5 text-teal-600 shrink-0"></i>
            <span>Rekomendasi: Pelelangan Umum BMN</span>
          </div>
        </div>
      `;
      bottomAction = `
        <div class="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
          <span class="text-slate-400">${item.waitingFor}</span>
          <button class="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition">${item.statusActionText}</button>
        </div>
      `;
    } else {
      middleContent = `
        <div class="space-y-1.5 mt-2 text-[11px] text-slate-600">
          <div class="flex items-center gap-1.5">
            <i data-lucide="user" class="w-3.5 h-3.5 text-slate-400 shrink-0"></i>
            <span>${item.requester}</span>
          </div>
          <div class="bg-[#f8fafc] border border-slate-200/60 rounded-lg p-2 text-[11px] text-slate-700 flex items-center gap-2">
            <i data-lucide="car" class="w-3.5 h-3.5 text-blue-600 shrink-0"></i>
            <span>${item.facility}</span>
          </div>
        </div>
      `;
      bottomAction = `
        <div class="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
          <span class="text-slate-400">${item.waitingFor}</span>
          <button class="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition">${item.statusActionText}</button>
        </div>
      `;
    }

    return `
      <div 
        class="rounded-xl border p-3.5 cursor-pointer transition ${activeClass}"
        onclick="selectApproval('${item.id}')"
      >
        <!-- Header row -->
        <div class="flex items-center justify-between gap-2">
          <span class="px-2 py-0.5 rounded-full text-[9px] font-bold ${item.tagClass}">
            ${item.tag}
          </span>
          <span class="text-[11px] font-bold text-slate-400">${item.id}</span>
        </div>

        <!-- Title -->
        <h3 class="text-xs font-black text-slate-900 mt-2 leading-tight">
          ${item.title}
        </h3>

        <!-- Middle Content -->
        ${middleContent}

        <!-- Bottom Action Row -->
        ${bottomAction}
      </div>
    `;
  }).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ===================== 5. SELECT APPROVAL DETAILS =====================

function selectApproval(id) {
  currentSelectedApprovalId = id;
  const data = approvalQueueData.find(a => a.id === id);
  if (!data) return;

  renderApprovalList();

  // Populate Right Detail Panel
  const detailTitle = document.getElementById('detail-title');
  const detailId = document.getElementById('detail-id-tag');
  const detailRequesterName = document.getElementById('detail-req-name');
  const detailRequesterNip = document.getElementById('detail-req-nip');
  const detailRequesterPhone = document.getElementById('detail-req-phone');
  const detailRequesterEmail = document.getElementById('detail-req-email');
  const detailRequesterAvatar = document.getElementById('detail-req-avatar');
  const detailDocNumber = document.getElementById('detail-doc-number');
  const detailDocLabel = document.getElementById('detail-doc-label');
  const detailScheduleDate = document.getElementById('detail-sched-date');
  const detailScheduleBadge = document.getElementById('detail-sched-badge');
  const detailScheduleDuration = document.getElementById('detail-sched-dur');
  const detailScheduleDurationSub = document.getElementById('detail-sched-dursub');
  const itemsContainer = document.getElementById('detail-items-container');
  const verificationsContainer = document.getElementById('detail-verifications-container');
  const logBarText = document.getElementById('detail-log-text');

  if (detailTitle) detailTitle.innerText = data.title;
  if (detailId) detailId.innerText = `TINJAUAN BERKAS OTORISASI • ${data.id}`;
  if (detailRequesterName) detailRequesterName.innerText = data.requesterName;
  if (detailRequesterNip) detailRequesterNip.innerText = data.requesterNip;
  if (detailRequesterPhone) detailRequesterPhone.innerText = data.requesterPhone;
  if (detailRequesterEmail) detailRequesterEmail.innerText = data.requesterEmail;
  if (detailRequesterAvatar) detailRequesterAvatar.src = data.requesterAvatar;
  if (detailDocNumber) detailDocNumber.innerText = data.docNumber;
  if (detailDocLabel) detailDocLabel.innerText = data.docLabel;
  if (detailScheduleDate) detailScheduleDate.innerText = data.scheduleDate;
  if (detailScheduleBadge) detailScheduleBadge.innerText = data.scheduleBadge;
  if (detailScheduleDuration) detailScheduleDuration.innerText = data.scheduleDuration;
  if (detailScheduleDurationSub) detailScheduleDurationSub.innerText = data.scheduleDurationSub;
  if (logBarText) logBarText.innerText = data.logText;

  // Render Requested Items List
  if (itemsContainer) {
    itemsContainer.innerHTML = data.items.map(item => `
      <div class="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-200/70 bg-white hover:bg-slate-50/50 transition">
        <div class="flex items-center gap-3">
          <img src="${item.img}" alt="${item.title}" class="w-12 h-11 rounded-lg object-cover border border-slate-200 shrink-0">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-900">${item.title}</span>
              <span class="px-2 py-0.2 rounded-full text-[9px] font-bold ${item.badgeClass}">${item.badge}</span>
            </div>
            <div class="text-[10px] text-slate-400 mt-0.5">${item.sub}</div>
          </div>
        </div>
        <div class="text-right shrink-0">
          <div class="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">${item.code}</div>
          <div class="text-[10px] font-bold ${item.conditionClass} mt-0.5">${item.condition}</div>
        </div>
      </div>
    `).join('');
  }

  // Render 2x2 Verifications
  if (verificationsContainer) {
    verificationsContainer.innerHTML = data.verifications.map(v => `
      <div class="bg-white border border-slate-200/70 rounded-xl p-2.5 flex items-start gap-2 shadow-2xs">
        <div class="w-3.5 h-3.5 rounded bg-[#2563eb] text-white flex items-center justify-center shrink-0 mt-0.5">
          <i data-lucide="check" class="w-2.5 h-2.5 stroke-[3]"></i>
        </div>
        <div>
          <div class="text-[11px] font-bold text-slate-900 leading-tight">${v.title}</div>
          <div class="text-[10px] text-slate-500 mt-0.5 leading-snug">${v.desc}</div>
        </div>
      </div>
    `).join('');
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ===================== 6. EVENT LISTENERS =====================

function setupEventListeners() {
  const searchInput = document.getElementById('search-approval-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderApprovalList();
    });
  }

  // Urgent filter toggle button
  const urgentBtn = document.getElementById('btn-urgent-filter');
  if (urgentBtn) {
    urgentBtn.addEventListener('click', () => {
      onlyUrgent = !onlyUrgent;
      if (onlyUrgent) {
        urgentBtn.classList.add('ring-2', 'ring-rose-500');
        showToast('Memfilter hanya permohonan berstatus Prioritas Mendesak.', 'info');
      } else {
        urgentBtn.classList.remove('ring-2', 'ring-rose-500');
        showToast('Menampilkan semua permohonan antrean.', 'info');
      }
      renderApprovalList();
    });
  }

  // Top Filter Tabs
  setupTabs();

  // Action Buttons
  setupApprovalActions();
}

function setupTabs() {
  const tabs = [
    { id: 'tab-semua', key: 'all' },
    { id: 'tab-peminjaman', key: 'ruangan' },
    { id: 'tab-mutasi', key: 'mutasi' },
    { id: 'tab-disposal', key: 'disposal' },
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
          otherEl.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f2a71] text-white font-bold text-xs shadow-sm transition';
        } else {
          otherEl.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-semibold text-xs transition';
        }
      });
      renderApprovalList();
    });
  });
}

function setupApprovalActions() {
  const btnApprove = document.getElementById('btn-approve');
  const btnReject = document.getElementById('btn-reject');
  const btnRevision = document.getElementById('btn-revision');
  const btnDownload = document.getElementById('btn-download-rekap');
  const btnBulk = document.getElementById('btn-bulk-approve');

  if (btnApprove) {
    btnApprove.addEventListener('click', async () => {
      if (!requirePermission('loans:approve', 'Menyetujui Antrean Sarpras')) return;
      const item = approvalQueueData.find(a => a.id === currentSelectedApprovalId);
      const targetDbId = (item && item.dbId) ? item.dbId : 1;
      if (typeof API !== 'undefined') {
        await API.approveQueue(targetDbId);
      }
      if (item) {
        item.status = 'Disetujui';
        item.waitingFor = 'Status: Disetujui';
        item.statusActionText = 'Selesai Otorisasi ✓';
        item.logText = `Log: Permohonan ${item.id} DISETUJUI dan E-Sign diterbitkan pada ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;
        selectApproval(item.id);
      }
      showToast(`Permohonan ${currentSelectedApprovalId} berhasil disetujui & Surat Izin diterbitkan dengan tanda tangan digital!`, 'success');
    });
  }

  if (btnReject) {
    btnReject.addEventListener('click', async () => {
      if (!requirePermission('loans:approve', 'Menolak Antrean Sarpras')) return;
      const item = approvalQueueData.find(a => a.id === currentSelectedApprovalId);
      const targetDbId = (item && item.dbId) ? item.dbId : 1;
      if (typeof API !== 'undefined') {
        await API.rejectQueue(targetDbId);
      }
      if (item) {
        item.status = 'Ditolak';
        item.waitingFor = 'Status: Ditolak';
        item.statusActionText = 'Ditolak ✗';
        item.logText = `Log: Permohonan ${item.id} DITOLAK oleh pejabat otorisasi pada ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;
        selectApproval(item.id);
      }
      showToast(`Permohonan ${currentSelectedApprovalId} ditolak. Notifikasi telah dikirimkan kepada pemohon.`, 'error');
    });
  }

  if (btnRevision) {
    btnRevision.addEventListener('click', async () => {
      if (!requirePermission('loans:approve', 'Meminta Revisi Berkas Antrean')) return;
      const item = approvalQueueData.find(a => a.id === currentSelectedApprovalId);
      const targetDbId = (item && item.dbId) ? item.dbId : 1;
      if (typeof API !== 'undefined' && API.revisionQueue) {
        await API.revisionQueue(targetDbId, 'Mohon lengkapi lampiran dokumen pendukung');
      }
      if (item) {
        item.status = 'Revisi Diminta';
        item.waitingFor = 'Status: Menunggu Revisi Pemohon';
        item.statusActionText = 'Perlu Revisi ↺';
        item.logText = `Log: Permintaan revisi berkas ${item.id} dikirimkan ke pemohon (${item.requesterEmail})`;
        selectApproval(item.id);
      }
      showToast(`Permintaan revisi berkas ${currentSelectedApprovalId} telah dikirimkan ke email pemohon.`, 'info');
    });
  }

  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      exportApprovalCSV();
    });
  }

  if (btnBulk) {
    btnBulk.addEventListener('click', async () => {
      if (!requirePermission('loans:approve', 'Persetujuan Cepat (Bulk) Antrean')) return;
      let count = 0;
      for (const item of approvalQueueData) {
        if (item.status !== 'Disetujui') {
          item.status = 'Disetujui';
          item.waitingFor = 'Status: Disetujui (Bulk)';
          item.statusActionText = 'Selesai Otorisasi ✓';
          count++;
          if (typeof API !== 'undefined' && item.dbId) {
            await API.approveQueue(item.dbId);
          }
        }
      }
      selectApproval(currentSelectedApprovalId);
      showToast(`Persetujuan Cepat (Bulk): ${count || approvalQueueData.length} permohonan antrean berhasil diverifikasi serentak.`, 'success');
    });
  }
}

async function loadApprovalsFromBackend() {
  if (typeof API === 'undefined') return;
  const res = await API.getApprovals();
  if (res && res.success && Array.isArray(res.data)) {
    res.data.forEach(dbItem => {
      const match = approvalQueueData.find(a => a.id === dbItem.kode);
      if (match) {
        match.dbId = dbItem.id;
        if (dbItem.status && dbItem.status !== 'Sedang Ditinjau') {
          match.status = dbItem.status;
          match.waitingFor = `Status: ${dbItem.status}`;
          match.statusActionText = dbItem.status === 'Disetujui' ? 'Selesai Otorisasi ✓' : dbItem.status === 'Ditolak' ? 'Ditolak ✗' : 'Perlu Revisi ↺';
        }
      }
    });
    renderApprovalList();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadApprovalsFromBackend();
});

// ===================== 7. EXPORT REKAP CSV =====================

function exportApprovalCSV() {
  const headers = ['NO PERMOHONAN', 'KATEGORI', 'JUDUL PERMOHONAN', 'PEMOHON', 'JADWAL / SASARAN', 'STATUS'];
  const rows = approvalQueueData.map(a => [
    `"${(a.id || '').replace(/"/g, '""')}"`,
    `"${(a.tag || '').replace(/"/g, '""')}"`,
    `"${(a.title || '').replace(/"/g, '""')}"`,
    `"${(a.requesterName || '').replace(/"/g, '""')}"`,
    `"${(a.schedule || '').replace(/"/g, '""')}"`,
    `"${(a.waitingFor || '').replace(/"/g, '""')}"`
  ]);

  const BOM = '\uFEFF';
  const delimiter = ';';
  const csvContent = BOM + [headers.join(delimiter), ...rows.map(e => e.join(delimiter))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SIMAS_Rekap_Antrean_Persetujuan_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('File CSV Rekap Antrean Persetujuan berhasil diunduh.', 'success');
}

// ===================== 8. TOAST NOTIFICATION =====================

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
