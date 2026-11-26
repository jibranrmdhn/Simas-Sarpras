const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const commands = [];
let stepCounter = 0;

function addNode(type, name, parentRef, x, y, width, height, props = {}, asName = null) {
  const refName = asName || `step_${stepCounter++}`;
  const step = {
    command: 'node.create',
    as: refName,
    params: {
      type,
      name,
      x,
      y,
      width,
      height,
      props
    }
  };
  if (parentRef) {
    step.params.parent = { '$ref': parentRef };
  }
  commands.push(step);
  return refName;
}

// -------------------------------------------------------------------------
// COLOR PALETTE & TOKENS
// -------------------------------------------------------------------------
const C = {
  sidebarBg: '#F0F5FB',
  sidebarBorder: '#E2E8F0',
  brandBlue: '#1342B8',
  brandText: '#0F2A71',
  subtitleText: '#64748B',
  
  roleCardBg: '#DBE8FB',
  btnGantiRoleBg: '#FFFFFF',
  btnGantiRoleBorder: '#CBD5E1',
  
  navActiveBg: '#1342B8',
  navActiveText: '#FFFFFF',
  navInactiveText: '#334155',
  
  surface: '#F8FAFC',
  surfaceCard: '#FFFFFF',
  surfaceCardBorder: '#E2E8F0',
  primary: '#1342B8',
  onPrimary: '#FFFFFF',
  
  successBg: '#DCFCE7',
  successText: '#15803D',
  warningBg: '#FEF3C7',
  warningText: '#B45309',
  errorBg: '#FEE2E2',
  errorText: '#B91C1C',
  infoBg: '#DBEAFE',
  infoText: '#1D4ED8',
  purpleBg: '#F3E8FF',
  purpleText: '#7E22CE'
};

// -------------------------------------------------------------------------
// COMPONENT: SIDEBAR (250px)
// -------------------------------------------------------------------------
function createFullSidebar(screenRef, roleKey, roleTitle, rolePeranDesc, activeMenuId) {
  const sb = addNode('frame', `Sidebar ${roleKey} ${activeMenuId}`, screenRef, 0, 0, 250, 960, {
    fill: C.sidebarBg,
    stroke: C.sidebarBorder,
    strokeWeight: 1,
    clip: true
  });
  
  // Brand Header
  addNode('rectangle', `Brand Logo Bg ${roleKey} ${activeMenuId}`, sb, 20, 20, 42, 42, {
    fill: C.brandBlue,
    cornerRadius: 12
  });
  addNode('text', `Brand Icon ${roleKey} ${activeMenuId}`, sb, 20, 28, 42, 26, {
    characters: '🥞',
    fontSize: 20,
    textAlign: 'center'
  });
  addNode('text', `Brand Title ${roleKey} ${activeMenuId}`, sb, 70, 22, 160, 20, {
    characters: 'SIMAS',
    fill: C.brandText,
    fontSize: 16,
    fontStyle: 'Bold'
  });
  addNode('text', `Brand Subtitle ${roleKey} ${activeMenuId}`, sb, 70, 42, 160, 16, {
    characters: 'Sistem Sarana & Prasarana',
    fill: C.subtitleText,
    fontSize: 10
  });
  
  // Role Switcher Card
  addNode('rectangle', `Role Card ${roleKey} ${activeMenuId}`, sb, 16, 76, 218, 58, {
    fill: C.roleCardBg,
    cornerRadius: 14
  });
  addNode('text', `Role Shield ${roleKey} ${activeMenuId}`, sb, 24, 94, 24, 24, {
    characters: '🛡️',
    fontSize: 16
  });
  addNode('text', `Role Peran ${roleKey} ${activeMenuId}`, sb, 52, 84, 100, 16, {
    characters: `Peran: ${rolePeranDesc}`,
    fill: '#475569',
    fontSize: 10
  });
  addNode('text', `Role Name ${roleKey} ${activeMenuId}`, sb, 52, 102, 104, 18, {
    characters: roleTitle,
    fill: C.brandText,
    fontSize: 12,
    fontStyle: 'Bold'
  });
  addNode('rectangle', `Btn Ganti Role ${roleKey} ${activeMenuId}`, sb, 158, 92, 68, 26, {
    fill: C.btnGantiRoleBg,
    cornerRadius: 8,
    stroke: C.btnGantiRoleBorder,
    strokeWeight: 1
  });
  addNode('text', `Text Ganti Role ${roleKey} ${activeMenuId}`, sb, 158, 98, 68, 14, {
    characters: 'Ganti Role',
    fill: C.brandText,
    fontSize: 10,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  
  // Navigation Menus
  const fullMenus = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'aset', label: 'Inventaris Aset', icon: '📦' },
    { id: 'gedung', label: 'Gedung & Ruangan', icon: '🏢' },
    { id: 'pinjam', label: 'Peminjaman Sarana', icon: '📅' },
    { id: 'pemeliharaan', label: 'Pemeliharaan', icon: '🔧' },
    { id: 'laporan', label: 'Laporan', icon: '📄' }
  ];
  
  const peminjamMenus = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'aset', label: 'Katalog Aset Tersedia', icon: '📦' },
    { id: 'gedung', label: 'Gedung & Ruangan', icon: '🏢' },
    { id: 'pinjam', label: 'Peminjaman Saya', icon: '📅' }
  ];
  
  const menus = (roleKey === 'peminjam') ? peminjamMenus : fullMenus;
  const startY = 150;
  const itemH = 44;
  const gap = 4;
  
  menus.forEach((m, idx) => {
    const yPos = startY + idx * (itemH + gap);
    const isActive = (m.id === activeMenuId);
    
    if (isActive) {
      addNode('rectangle', `Nav Pill ${roleKey} ${activeMenuId} ${m.id}`, sb, 16, yPos, 218, 44, {
        fill: C.navActiveBg,
        cornerRadius: 12
      });
      addNode('text', `Nav Icon ${roleKey} ${activeMenuId} ${m.id}`, sb, 28, yPos + 12, 24, 20, {
        characters: m.icon,
        fill: C.navActiveText,
        fontSize: 16
      });
      addNode('text', `Nav Label ${roleKey} ${activeMenuId} ${m.id}`, sb, 56, yPos + 14, 160, 20, {
        characters: m.label,
        fill: C.navActiveText,
        fontSize: 13,
        fontStyle: 'Bold'
      });
    } else {
      addNode('text', `Nav Icon ${roleKey} ${activeMenuId} ${m.id}`, sb, 28, yPos + 12, 24, 20, {
        characters: m.icon,
        fill: C.navInactiveText,
        fontSize: 16
      });
      addNode('text', `Nav Label ${roleKey} ${activeMenuId} ${m.id}`, sb, 56, yPos + 14, 160, 20, {
        characters: m.label,
        fill: C.navInactiveText,
        fontSize: 13
      });
    }
  });
  
  return sb;
}

// -------------------------------------------------------------------------
// COMPONENT: TOP APP BAR
// -------------------------------------------------------------------------
function createTopBar(screenRef, roleKey, title, subtitle, userName, userRole) {
  const tb = addNode('frame', `TopBar ${roleKey} ${title.slice(0, 10)}`, screenRef, 250, 0, 1190, 72, {
    fill: '#FFFFFF',
    stroke: C.sidebarBorder,
    strokeWeight: 1,
    clip: true
  });
  
  addNode('text', `TB Title ${roleKey} ${title.slice(0, 10)}`, tb, 28, 14, 450, 24, {
    characters: title,
    fill: '#0F172A',
    fontSize: 18,
    fontStyle: 'Bold'
  });
  addNode('text', `TB Sub ${roleKey} ${title.slice(0, 10)}`, tb, 28, 40, 450, 18, {
    characters: subtitle,
    fill: '#64748B',
    fontSize: 11
  });
  
  // Search
  addNode('rectangle', `TB Search ${roleKey} ${title.slice(0, 10)}`, tb, 510, 14, 340, 44, {
    fill: '#F1F5F9',
    cornerRadius: 22
  });
  addNode('text', `TB Search Text ${roleKey} ${title.slice(0, 10)}`, tb, 532, 26, 300, 20, {
    characters: '🔍 Cari data dalam modul ini...',
    fill: '#94A3B8',
    fontSize: 12
  });
  
  // Bell
  addNode('rectangle', `TB Notif ${roleKey} ${title.slice(0, 10)}`, tb, 870, 16, 40, 40, {
    fill: '#F8FAFC',
    cornerRadius: 20,
    stroke: '#E2E8F0',
    strokeWeight: 1
  });
  addNode('text', `TB Bell ${roleKey} ${title.slice(0, 10)}`, tb, 870, 26, 40, 20, {
    characters: '🔔',
    fontSize: 16,
    textAlign: 'center'
  });
  addNode('ellipse', `TB Dot ${roleKey} ${title.slice(0, 10)}`, tb, 896, 20, 8, 8, {
    fill: '#EF4444'
  });
  
  // Profile
  addNode('rectangle', `TB Profile ${roleKey} ${title.slice(0, 10)}`, tb, 930, 14, 230, 44, {
    fill: '#EFF6FF',
    cornerRadius: 22,
    stroke: '#BFDBFE',
    strokeWeight: 1
  });
  addNode('ellipse', `TB Avatar ${roleKey} ${title.slice(0, 10)}`, tb, 936, 20, 32, 32, {
    fill: C.brandBlue
  });
  addNode('text', `TB Initials ${roleKey} ${title.slice(0, 10)}`, tb, 936, 28, 32, 16, {
    characters: userName.split(' ').map(n => n[0]).slice(0, 2).join(''),
    fill: '#FFFFFF',
    fontSize: 11,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  addNode('text', `TB Name ${roleKey} ${title.slice(0, 10)}`, tb, 976, 20, 140, 16, {
    characters: userName,
    fill: '#0F172A',
    fontSize: 12,
    fontStyle: 'Bold'
  });
  addNode('text', `TB Role ${roleKey} ${title.slice(0, 10)}`, tb, 976, 36, 140, 14, {
    characters: userRole,
    fill: C.brandBlue,
    fontSize: 10
  });
  
  return tb;
}

// =========================================================================
// 1. DASHBOARD ADMIN SARPRAS (x: 0, y: 0) WITH CHARTS & RICH STATS
// =========================================================================
function buildDashboardAdmin() {
  const f1 = addNode('frame', '[M3] SIMAS - Dashboard Admin Sarpras', null, 0, 0, 1440, 960, { fill: C.surface, clip: true });
  createFullSidebar(f1, 'admin', 'Admin Sarpras', 'Full Access', 'dashboard');
  createTopBar(f1, 'admin', 'Dashboard Eksekutif Admin Sarpras', 'Kontrol Penuh 6 Menu • Master Aset, Ruangan, Approval, Kanban, Laporan', 'Bambang Irawan', 'Admin Sarpras (Full Control)');
  
  // Banner Welcome
  addNode('rectangle', 'Banner Admin', f1, 274, 86, 1142, 68, { fill: '#EEF2FF', cornerRadius: 14, stroke: '#C7D2FE', strokeWeight: 1 });
  addNode('text', 'Banner Admin Title', f1, 296, 98, 700, 22, { characters: 'Selamat Datang, Bambang Irawan, S.Kom! (Admin Sarpras) 👑', fill: '#1E1B4B', fontSize: 16, fontStyle: 'Bold' });
  addNode('text', 'Banner Admin Sub', f1, 296, 122, 700, 18, { characters: 'Wewenang Penuh: Tambah/Edit/Hapus Aset, Setujui Pinjaman, Kelola Tiket Kanban, & Rekap Cetak Laporan.', fill: '#4338CA', fontSize: 11 });
  addNode('rectangle', 'Btn Action 1 Admin', f1, 1080, 98, 150, 42, { fill: C.brandBlue, cornerRadius: 10 });
  addNode('text', 'Btn Action 1 Text Admin', f1, 1080, 110, 150, 20, { characters: '+ Tambah Aset Baru', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });
  addNode('rectangle', 'Btn Action 2 Admin', f1, 1242, 98, 150, 42, { fill: '#FFFFFF', cornerRadius: 10, stroke: '#CBD5E1', strokeWeight: 1 });
  addNode('text', 'Btn Action 2 Text Admin', f1, 1242, 110, 150, 20, { characters: '🖨️ Cetak Laporan', fill: '#0F172A', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });

  // 4 KPI Cards
  const kpisAdmin = [
    { title: 'Total Master Aset', val: '1.248 Unit', sub: 'Valuasi: Rp 4,85 Miliar', badge: '94% Kondisi Baik', bg: C.successBg, tc: C.successText, icon: '📦' },
    { title: 'Okupansi Ruangan', val: '42 / 56', sub: '75% Kapasitas Terisi', badge: '14 Ruang Kosong', bg: C.infoBg, tc: C.infoText, icon: '🏢' },
    { title: 'Antrean Pinjaman', val: '8 Pengajuan', sub: '4 Butuh Approval Admin', badge: 'Tindakan Cepat', bg: C.warningBg, tc: C.warningText, icon: '📋' },
    { title: 'Tiket Perbaikan', val: '5 Pengerjaan', sub: 'Biaya: Rp 4.250.000', badge: '2 Selesai Hari Ini', bg: C.purpleBg, tc: C.purpleText, icon: '🔧' }
  ];
  kpisAdmin.forEach((k, i) => {
    const x = 274 + i * (272 + 18);
    addNode('rectangle', `KPI Admin ${i}`, f1, x, 166, 272, 104, { fill: '#FFFFFF', cornerRadius: 14, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `KPI Icon Admin ${i}`, f1, x + 14, 184, 30, 30, { characters: k.icon, fontSize: 20 });
    addNode('text', `KPI Title Admin ${i}`, f1, x + 50, 178, 200, 16, { characters: k.title, fill: '#64748B', fontSize: 11 });
    addNode('text', `KPI Val Admin ${i}`, f1, x + 50, 194, 200, 22, { characters: k.val, fill: '#0F172A', fontSize: 16, fontStyle: 'Bold' });
    addNode('text', `KPI Sub Admin ${i}`, f1, x + 14, 238, 160, 16, { characters: k.sub, fill: '#64748B', fontSize: 10 });
    addNode('rectangle', `KPI Badge Bg Admin ${i}`, f1, x + 160, 236, 100, 20, { fill: k.bg, cornerRadius: 4 });
    addNode('text', `KPI Badge Text Admin ${i}`, f1, x + 160, 238, 100, 14, { characters: k.badge, fill: k.tc, fontSize: 9, fontStyle: 'Bold', textAlign: 'center' });
  });

  // MIDDLE SECTION: GRAFIK TREN SIRKULASI & OKUPANSI RUANG
  // Left: Tren Bar Chart 7 Hari
  addNode('rectangle', 'Chart Box Admin', f1, 274, 282, 680, 240, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Chart Title Admin', f1, 296, 298, 380, 20, { characters: 'Tren Sirkulasi Peminjaman Sarana (7 Hari Terakhir)', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  addNode('text', 'Chart Sub Admin', f1, 296, 318, 380, 16, { characters: 'Perbandingan peminjaman aktif vs selesai per hari', fill: '#64748B', fontSize: 10 });
  addNode('rectangle', 'Chart Badge Admin', f1, 800, 298, 134, 24, { fill: C.successBg, cornerRadius: 6 });
  addNode('text', 'Chart Badge Text Admin', f1, 800, 302, 134, 16, { characters: '↗ +18.4% Aktivitas', fill: C.successText, fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });

  // 7 Bars in Chart
  const adminDays = [
    { day: 'Sen 10', pinjam: 12, servis: 3, hP: 84, hS: 24, x: 320 },
    { day: 'Sel 11', pinjam: 18, servis: 5, hP: 110, hS: 36, x: 374 },
    { day: 'Rab 12', pinjam: 15, servis: 4, hP: 98, hS: 30, x: 428 },
    { day: 'Kam 13', pinjam: 22, servis: 6, hP: 130, hS: 42, x: 482 },
    { day: 'Jum 14', pinjam: 19, servis: 8, hP: 116, hS: 54, x: 536 },
    { day: 'Sab 15', pinjam: 8, servis: 2, hP: 50, hS: 16, x: 590 },
    { day: 'Min 16', pinjam: 14, servis: 5, hP: 90, hS: 34, x: 644 }
  ];
  
  // Grid Lines
  [360, 410, 460].forEach(gy => {
    addNode('rectangle', `Chart Grid Line Admin ${gy}`, f1, 310, gy, 620, 1, { fill: '#F1F5F9' });
  });

  adminDays.forEach((d, i) => {
    // Bar Pinjam (Biru)
    addNode('rectangle', `Bar P Admin ${i}`, f1, d.x, 480 - d.hP, 20, d.hP, { fill: C.brandBlue, cornerRadius: 4 });
    // Bar Servis (Hijau)
    addNode('rectangle', `Bar S Admin ${i}`, f1, d.x + 22, 480 - d.hS, 14, d.hS, { fill: '#10B981', cornerRadius: 4 });
    // Day Label
    addNode('text', `Day Label Admin ${i}`, f1, d.x - 4, 488, 48, 16, { characters: d.day, fill: '#64748B', fontSize: 9, textAlign: 'center' });
  });

  // Chart Legend
  addNode('rectangle', 'Leg Dot 1 Admin', f1, 740, 488, 12, 12, { fill: C.brandBlue, cornerRadius: 3 });
  addNode('text', 'Leg Text 1 Admin', f1, 756, 486, 70, 16, { characters: 'Peminjaman', fill: '#0F172A', fontSize: 10 });
  addNode('rectangle', 'Leg Dot 2 Admin', f1, 836, 488, 12, 12, { fill: '#10B981', cornerRadius: 3 });
  addNode('text', 'Leg Text 2 Admin', f1, 852, 486, 80, 16, { characters: 'Servis Selesai', fill: '#0F172A', fontSize: 10 });

  // Right: Okupansi Ruangan per Kompleks Gedung
  addNode('rectangle', 'Occupancy Box Admin', f1, 974, 282, 442, 240, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Occupancy Title Admin', f1, 994, 298, 300, 20, { characters: 'Okupansi Ruang per Kompleks Gedung', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  addNode('text', 'Occupancy Sub Admin', f1, 994, 318, 300, 16, { characters: '42 dari 56 ruangan sedang digunakan aktif', fill: '#64748B', fontSize: 10 });

  const complexes = [
    { name: 'Gedung TI (Lab & R. Dosen)', val: '17 / 20 Ruang (85%)', w: 320, color: C.brandBlue, y: 346 },
    { name: 'Gedung Utama (Aula & Seminar)', val: '14 / 20 Ruang (70%)', w: 260, color: '#10B981', y: 390 },
    { name: 'Gedung MIPA (Laboratorium)', val: '6 / 10 Ruang (60%)', w: 220, color: '#8B5CF6', y: 434 },
    { name: 'Gedung Rektorat (Senat & Rapat)', val: '5 / 6 Ruang (83%)', w: 310, color: '#F59E0B', y: 478 }
  ];
  complexes.forEach((c, i) => {
    addNode('text', `C Name ${i}`, f1, 994, c.y, 220, 16, { characters: c.name, fill: '#0F172A', fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `C Val ${i}`, f1, 1240, c.y, 150, 16, { characters: c.val, fill: '#64748B', fontSize: 10, textAlign: 'right' });
    addNode('rectangle', `C Bar Bg ${i}`, f1, 994, c.y + 18, 400, 8, { fill: '#F1F5F9', cornerRadius: 4 });
    addNode('rectangle', `C Bar Fill ${i}`, f1, 994, c.y + 18, c.w, 8, { fill: c.color, cornerRadius: 4 });
  });

  // BOTTOM SECTION: PERMOHONAN PINJAM & KANBAN MONITORING
  addNode('rectangle', 'Loan Card Admin', f1, 274, 534, 680, 406, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Loan Card Header Admin', f1, 296, 550, 400, 20, { characters: 'Permohonan Peminjaman Menunggu Approval Admin', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });

  const adminLoans = [
    { name: 'Budi Santoso, M.Kom (Dosen TI)', item: '2x Proyektor Epson & Laser Pointer', time: '17 Nov 2026 (08:00 - 14:00)', y: 580 },
    { name: 'Siti Rahmawati (Ketua BEM Univ)', item: 'Gedung Aula Utama & Sound System Yamaha', time: '19-20 Nov 2026 (2 Hari Penuh)', y: 686 },
    { name: 'Dimas Arya (Himpunan Elektro)', item: '5x Solder Station & 2x Multimeter Fluke', time: '18 Nov 2026 (09:00 - 16:00)', y: 792 }
  ];
  adminLoans.forEach((l, i) => {
    addNode('rectangle', `Loan Row Box Admin ${i}`, f1, 296, l.y, 636, 92, { fill: '#F8FAFC', cornerRadius: 12, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `Loan Name Admin ${i}`, f1, 312, l.y + 12, 340, 18, { characters: l.name, fill: '#0F172A', fontSize: 12, fontStyle: 'Bold' });
    addNode('text', `Loan Item Admin ${i}`, f1, 312, l.y + 32, 340, 16, { characters: `Sarana: ${l.item}`, fill: C.brandBlue, fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `Loan Time Admin ${i}`, f1, 312, l.y + 52, 340, 16, { characters: `Jadwal: ${l.time}`, fill: '#64748B', fontSize: 10 });
    // Action Buttons
    addNode('rectangle', `Btn Tolak Admin ${i}`, f1, 720, l.y + 28, 86, 36, { fill: C.errorBg, cornerRadius: 8 });
    addNode('text', `Text Tolak Admin ${i}`, f1, 720, l.y + 38, 86, 16, { characters: '✕ Tolak', fill: C.errorText, fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });
    addNode('rectangle', `Btn Setuju Admin ${i}`, f1, 814, l.y + 28, 104, 36, { fill: C.brandBlue, cornerRadius: 8 });
    addNode('text', `Text Setuju Admin ${i}`, f1, 814, l.y + 38, 104, 16, { characters: '✓ Setujui (SPK)', fill: '#FFFFFF', fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });
  });

  // Right: Kanban Snapshot & Live Audit
  addNode('rectangle', 'Kanban Card Admin', f1, 974, 534, 442, 406, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Kanban Card Header Admin', f1, 994, 550, 300, 20, { characters: 'Kanban Pemeliharaan & Audit Trail', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });

  const adminKanban = [
    { code: 'TKT-012', name: 'AC Daikin R. Seminar', tech: 'Teknisi: Joko S.', status: 'Pengerjaan (75%)', cost: 'Rp 850.000', y: 580 },
    { code: 'TKT-014', name: 'PC Lab Multimedia 04', tech: 'Teknisi: Vendor Asus', status: 'Tunggu Sparepart', cost: 'Garansi Rp 0', y: 664 }
  ];
  adminKanban.forEach((t, i) => {
    addNode('rectangle', `KB Box Admin ${i}`, f1, 994, t.y, 402, 72, { fill: '#F8FAFC', cornerRadius: 10, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `KB Code Admin ${i}`, f1, 1008, t.y + 10, 100, 16, { characters: t.code, fill: C.brandBlue, fontSize: 10, fontStyle: 'Bold' });
    addNode('text', `KB Status Admin ${i}`, f1, 1260, t.y + 10, 120, 16, { characters: t.status, fill: '#B45309', fontSize: 10, fontStyle: 'Bold', textAlign: 'right' });
    addNode('text', `KB Name Admin ${i}`, f1, 1008, t.y + 26, 260, 18, { characters: t.name, fill: '#0F172A', fontSize: 12, fontStyle: 'Bold' });
    addNode('text', `KB Tech Admin ${i}`, f1, 1008, t.y + 46, 200, 16, { characters: t.tech, fill: '#64748B', fontSize: 10 });
    addNode('text', `KB Cost Admin ${i}`, f1, 1260, t.y + 46, 120, 16, { characters: t.cost, fill: '#0F172A', fontSize: 11, fontStyle: 'Bold', textAlign: 'right' });
  });

  // Live Audit
  addNode('text', 'Audit Title Admin', f1, 994, 750, 200, 18, { characters: 'Live Audit Log (Sistem Keamanan):', fill: '#0F172A', fontSize: 11, fontStyle: 'Bold' });
  const auditLogs = [
    '• 10:45: Bambang (Admin) menyetujui pinjaman #PINJ-088',
    '• 09:20: Joko (Petugas) verifikasi pengembalian proyektor',
    '• 08:15: Dr. Hendro (Pimpinan) mengesahkan laporan Q3',
    '• 07:50: Budi (Peminjam) mengajukan izin Ruang Seminar 2'
  ];
  auditLogs.forEach((a, i) => {
    addNode('text', `Audit Row Admin ${i}`, f1, 994, 772 + i * 22, 402, 20, { characters: a, fill: '#475569', fontSize: 10 });
  });
}

// =========================================================================
// 2. DASHBOARD PETUGAS SARPRAS (x: 1540, y: 0) WITH CHARTS & OPERATIONS
// =========================================================================
function buildDashboardPetugas() {
  const f2 = addNode('frame', '[M3] SIMAS - Dashboard Petugas Sarpras', null, 1540, 0, 1440, 960, { fill: C.surface, clip: true });
  createFullSidebar(f2, 'petugas', 'Petugas Sarpras', 'Teknisi Lapangan', 'dashboard');
  createTopBar(f2, 'petugas', 'Dashboard Operasional Petugas & Teknisi', 'Inspeksi Sarana • Verifikasi Pengembalian Fisik • Eksekusi Servis Kanban', 'Joko Supriyanto', 'Petugas Sarpras (Teknisi Lapangan)');
  
  // Banner
  addNode('rectangle', 'Banner Petugas', f2, 274, 86, 1142, 68, { fill: '#ECFDF5', cornerRadius: 14, stroke: '#A7F3D0', strokeWeight: 1 });
  addNode('text', 'Banner Petugas Title', f2, 296, 98, 700, 22, { characters: 'Halo, Joko Supriyanto, A.Md! (Teknisi Sarpras) 🛠️', fill: '#064E3B', fontSize: 16, fontStyle: 'Bold' });
  addNode('text', 'Banner Petugas Sub', f2, 296, 122, 800, 18, { characters: 'Wewenang Petugas: Cek fisik aset, verifikasi barang kembali, update Kanban & nota perbaikan. (Dilarang menghapus aset).', fill: '#047857', fontSize: 11 });
  addNode('rectangle', 'Btn Action Petugas', f2, 1180, 98, 212, 42, { fill: '#059669', cornerRadius: 10 });
  addNode('text', 'Btn Action Text Petugas', f2, 1180, 110, 212, 20, { characters: '+ Catat Kerusakan Baru', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });

  // 4 KPI Cards
  const kpisPetugas = [
    { title: 'Tugas Servis Saya', val: '4 Tiket', sub: '2 Prioritas Mendesak Hari Ini', badge: 'Kerjakan Sekarang', bg: C.warningBg, tc: C.warningText, icon: '🔧' },
    { title: 'Cek Barang Kembali', val: '3 Item', sub: 'Menunggu Pemeriksaan Fisik', badge: 'Perlu Verifikasi', bg: C.errorBg, tc: C.errorText, icon: '📥' },
    { title: 'Aset Butuh Servis', val: '8 Unit', sub: 'AC, Proyektor & Kabel Lab', badge: 'Antrean Bengkel', bg: C.infoBg, tc: C.infoText, icon: '⚙️' },
    { title: 'Suku Cadang Terpakai', val: 'Rp 1.450.000', sub: 'Nota Pembelian Terverifikasi', badge: 'Klaim APBN', bg: C.purpleBg, tc: C.purpleText, icon: '🧾' }
  ];
  kpisPetugas.forEach((k, i) => {
    const x = 274 + i * (272 + 18);
    addNode('rectangle', `KPI Petugas ${i}`, f2, x, 166, 272, 104, { fill: '#FFFFFF', cornerRadius: 14, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `KPI Icon Petugas ${i}`, f2, x + 14, 184, 30, 30, { characters: k.icon, fontSize: 20 });
    addNode('text', `KPI Title Petugas ${i}`, f2, x + 50, 178, 200, 16, { characters: k.title, fill: '#64748B', fontSize: 11 });
    addNode('text', `KPI Val Petugas ${i}`, f2, x + 50, 194, 200, 22, { characters: k.val, fill: '#0F172A', fontSize: 16, fontStyle: 'Bold' });
    addNode('text', `KPI Sub Petugas ${i}`, f2, x + 14, 238, 160, 16, { characters: k.sub, fill: '#64748B', fontSize: 10 });
    addNode('rectangle', `KPI Badge Bg Petugas ${i}`, f2, x + 160, 236, 100, 20, { fill: k.bg, cornerRadius: 4 });
    addNode('text', `KPI Badge Text Petugas ${i}`, f2, x + 160, 238, 100, 14, { characters: k.badge, fill: k.tc, fontSize: 9, fontStyle: 'Bold', textAlign: 'center' });
  });

  // MIDDLE SECTION: GRAFIK PENYELESAIAN SERVIS & RASIO KONDISI FISIK ASET
  // Left: Tren Penyelesaian Servis Mingguan
  addNode('rectangle', 'Chart Box Petugas', f2, 274, 282, 680, 240, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Chart Title Petugas', f2, 296, 298, 380, 20, { characters: 'Grafik Penyelesaian Tiket Servis Teknisi (Minggu Ini)', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  addNode('text', 'Chart Sub Petugas', f2, 296, 318, 380, 16, { characters: 'Perbandingan target perbaikan vs realisasi selesai (Joko Supriyanto)', fill: '#64748B', fontSize: 10 });
  addNode('rectangle', 'Chart Badge Petugas', f2, 790, 298, 144, 24, { fill: C.successBg, cornerRadius: 6 });
  addNode('text', 'Chart Badge Text Petugas', f2, 790, 302, 144, 16, { characters: '✓ 91.6% Tepat Waktu', fill: C.successText, fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });

  const techDays = [
    { day: 'Sen', target: 4, selesai: 4, hT: 90, hS: 90, x: 320 },
    { day: 'Sel', target: 5, selesai: 5, hT: 110, hS: 110, x: 374 },
    { day: 'Rab', target: 3, selesai: 3, hT: 70, hS: 70, x: 428 },
    { day: 'Kam', target: 6, selesai: 5, hT: 130, hS: 110, x: 482 },
    { day: 'Jum', target: 4, selesai: 4, hT: 90, hS: 90, x: 536 },
    { day: 'Sab', target: 2, selesai: 2, hT: 45, hS: 45, x: 590 },
    { day: 'Min', target: 1, selesai: 1, hT: 25, hS: 25, x: 644 }
  ];
  [360, 410, 460].forEach(gy => {
    addNode('rectangle', `Grid Line Petugas ${gy}`, f2, 310, gy, 620, 1, { fill: '#F1F5F9' });
  });
  techDays.forEach((d, i) => {
    addNode('rectangle', `Bar T Petugas ${i}`, f2, d.x, 480 - d.hT, 18, d.hT, { fill: '#CBD5E1', cornerRadius: 4 });
    addNode('rectangle', `Bar S Petugas ${i}`, f2, d.x + 20, 480 - d.hS, 18, d.hS, { fill: '#059669', cornerRadius: 4 });
    addNode('text', `Day Petugas ${i}`, f2, d.x - 2, 488, 42, 16, { characters: d.day, fill: '#64748B', fontSize: 10, textAlign: 'center' });
  });
  addNode('rectangle', 'Leg T Dot Petugas', f2, 740, 488, 12, 12, { fill: '#CBD5E1', cornerRadius: 3 });
  addNode('text', 'Leg T Text Petugas', f2, 756, 486, 70, 16, { characters: 'Target Kerja', fill: '#64748B', fontSize: 10 });
  addNode('rectangle', 'Leg S Dot Petugas', f2, 836, 488, 12, 12, { fill: '#059669', cornerRadius: 3 });
  addNode('text', 'Leg S Text Petugas', f2, 852, 486, 80, 16, { characters: 'Selesai Servis', fill: '#059669', fontSize: 10, fontStyle: 'Bold' });

  // Right: Rasio Kondisi Fisik Sarana
  addNode('rectangle', 'Health Box Petugas', f2, 974, 282, 442, 240, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Health Title Petugas', f2, 994, 298, 300, 20, { characters: 'Rasio Kondisi Fisik 1.248 Sarana Kampus', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  addNode('text', 'Health Sub Petugas', f2, 994, 318, 300, 16, { characters: 'Hasil inspeksi berkala sarpras semester ganjil', fill: '#64748B', fontSize: 10 });

  const healthData = [
    { name: 'Kondisi Baik (Siap Pakai)', val: '1.176 Unit (94.2%)', w: 380, color: '#059669', y: 346 },
    { name: 'Rusak Ringan (Dalam Antrean Servis)', val: '56 Unit (4.5%)', w: 90, color: '#D97706', y: 400 },
    { name: 'Rusak Berat (Usul Pemutihan/Ganti)', val: '16 Unit (1.3%)', w: 30, color: '#DC2626', y: 454 }
  ];
  healthData.forEach((h, i) => {
    addNode('text', `H Name ${i}`, f2, 994, h.y, 240, 16, { characters: h.name, fill: '#0F172A', fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `H Val ${i}`, f2, 1240, h.y, 150, 16, { characters: h.val, fill: '#64748B', fontSize: 10, textAlign: 'right' });
    addNode('rectangle', `H Bar Bg ${i}`, f2, 994, h.y + 18, 400, 10, { fill: '#F1F5F9', cornerRadius: 5 });
    addNode('rectangle', `H Bar Fill ${i}`, f2, 994, h.y + 18, h.w, 10, { fill: h.color, cornerRadius: 5 });
  });

  // BOTTOM SECTION: MEJA VERIFIKASI PENGEMBALIAN & TUGAS JOKO
  addNode('rectangle', 'Return Desk Petugas', f2, 274, 534, 680, 406, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Return Title Petugas', f2, 296, 550, 400, 20, { characters: 'Meja Verifikasi Pengembalian Sarana (Check-In Desk)', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });

  const returnItems = [
    { peminjam: 'Budi Santoso (Dosen TI)', item: 'Proyektor Epson EB-X500', cond: 'Kabel lengkap, lensa bersih', y: 580, status: 'Siap Verifikasi' },
    { peminjam: 'Siti Rahma (Ketua BEM)', item: '2x Mic Wireless Shure & Kabel XLR', cond: 'Baterai habis, fisik utuh', y: 686, status: 'Siap Verifikasi' },
    { peminjam: 'Dimas Arya (Mhs Elektro)', item: 'Kamera Sony A6400 Kit & Tripod', cond: 'Tutup lensa tertinggal di Lab', y: 792, status: 'Perlu Catatan' }
  ];
  returnItems.forEach((r, i) => {
    addNode('rectangle', `Return Row Petugas ${i}`, f2, 296, r.y, 636, 92, { fill: '#F8FAFC', cornerRadius: 12, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `Return Name Petugas ${i}`, f2, 312, r.y + 12, 320, 18, { characters: r.peminjam, fill: '#0F172A', fontSize: 12, fontStyle: 'Bold' });
    addNode('text', `Return Item Petugas ${i}`, f2, 312, r.y + 32, 320, 16, { characters: `Barang: ${r.item}`, fill: '#059669', fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `Return Cond Petugas ${i}`, f2, 312, r.y + 52, 320, 16, { characters: `Catatan Fisik: ${r.cond}`, fill: '#64748B', fontSize: 10 });
    
    if (r.status === 'Siap Verifikasi') {
      addNode('rectangle', `Btn Ret Petugas ${i}`, f2, 700, r.y + 28, 218, 36, { fill: '#059669', cornerRadius: 8 });
      addNode('text', `Text Ret Petugas ${i}`, f2, 700, r.y + 38, 218, 16, { characters: '✓ Konfirmasi Kembali (Layak)', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });
    } else {
      addNode('rectangle', `Btn Note Petugas ${i}`, f2, 700, r.y + 28, 218, 36, { fill: C.warningBg, cornerRadius: 8 });
      addNode('text', `Text Note Petugas ${i}`, f2, 700, r.y + 38, 218, 16, { characters: '⚠️ Catat Kelengkapan Hilang', fill: C.warningText, fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });
    }
  });

  // Right: Tiket Ditugaskan & Notice RBAC
  addNode('rectangle', 'Tech Tickets Petugas', f2, 974, 534, 442, 406, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Tech Title Petugas', f2, 994, 550, 300, 20, { characters: 'Tiket Perbaikan Ditugaskan Ke Anda', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });

  const myTasks = [
    { code: 'TKT-012', title: 'AC Daikin Ruang Seminar', prog: '75%', desc: 'Ganti kapasitor blower & freon R32', btn: '+ Update Selesai 100%', y: 580 },
    { code: 'TKT-017', title: 'Proyektor BenQ Lab TI 02', prog: '20%', desc: 'Lampu mati saat kuliah umum', btn: 'Input Nota Part', y: 674 }
  ];
  myTasks.forEach((m, i) => {
    addNode('rectangle', `Task Box Petugas ${i}`, f2, 994, m.y, 402, 82, { fill: '#F8FAFC', cornerRadius: 10, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `Task Code Petugas ${i}`, f2, 1008, m.y + 8, 120, 16, { characters: m.code, fill: '#059669', fontSize: 10, fontStyle: 'Bold' });
    addNode('text', `Task Prog Petugas ${i}`, f2, 1270, m.y + 8, 110, 16, { characters: `Progres: ${m.prog}`, fill: '#0F172A', fontSize: 10, fontStyle: 'Bold', textAlign: 'right' });
    addNode('text', `Task Title Petugas ${i}`, f2, 1008, m.y + 26, 260, 18, { characters: m.title, fill: '#0F172A', fontSize: 12, fontStyle: 'Bold' });
    addNode('text', `Task Desc Petugas ${i}`, f2, 1008, m.y + 44, 260, 16, { characters: m.desc, fill: '#64748B', fontSize: 10 });
    addNode('rectangle', `Btn Task Petugas ${i}`, f2, 1270, m.y + 36, 114, 28, { fill: C.brandBlue, cornerRadius: 6 });
    addNode('text', `Text Task Petugas ${i}`, f2, 1270, m.y + 42, 114, 16, { characters: m.btn, fill: '#FFFFFF', fontSize: 9, fontStyle: 'Bold', textAlign: 'center' });
  });

  // Notice RBAC Petugas
  addNode('rectangle', 'Notice Petugas', f2, 994, 770, 402, 150, { fill: '#FEF2F2', cornerRadius: 12, stroke: '#FCA5A5', strokeWeight: 1 });
  addNode('text', 'Notice Petugas Title', f2, 1010, 784, 370, 18, { characters: '🔒 Batasan Wewenang (RBAC Petugas):', fill: '#991B1B', fontSize: 11, fontStyle: 'Bold' });
  addNode('text', 'Notice Petugas Content', f2, 1010, 808, 370, 100, {
    characters: '• Petugas TIDAK DIIZINKAN menghapus master aset dari database sistem.\n• Petugas TIDAK MEMILIKI tombol Approve pinjaman sarana (wewenang Pimpinan/Admin).\n• Hasil verifikasi kondisi fisik barang otomatis tersimpan ke kartu mutasi dan log peminjaman.',
    fill: '#B91C1C',
    fontSize: 10
  });
}

// =========================================================================
// 3. DASHBOARD PIMPINAN INSTITUSI (x: 3080, y: 0) WITH CHARTS & APPROVALS
// =========================================================================
function buildDashboardPimpinan() {
  const f3 = addNode('frame', '[M3] SIMAS - Dashboard Pimpinan Institusi', null, 3080, 0, 1440, 960, { fill: C.surface, clip: true });
  createFullSidebar(f3, 'pimpinan', 'Pimpinan Institusi', 'Eksekutif & Approval', 'dashboard');
  createTopBar(f3, 'pimpinan', 'Dashboard Eksekutif & Otorisasi Pimpinan', 'Valuasi Aset • Persetujuan Fasilitas Strategis • Pengesahan Laporan', 'Dr. Ir. Hendro Wicaksono', 'Pimpinan Institusi (Eksekutif)');

  // Banner
  addNode('rectangle', 'Banner Pimpinan', f3, 274, 86, 1142, 68, { fill: '#FAF5FF', cornerRadius: 14, stroke: '#E9D5FF', strokeWeight: 1 });
  addNode('text', 'Banner Pimpinan Title', f3, 296, 98, 700, 22, { characters: 'Selamat Pagi, Dr. Ir. Hendro Wicaksono, M.T. (Wakil Rektor II) 🏛️', fill: '#581C87', fontSize: 16, fontStyle: 'Bold' });
  addNode('text', 'Banner Pimpinan Sub', f3, 296, 122, 700, 18, { characters: 'Otorisasi Eksekutif: Memantau nilai & okupansi sarpras, menyetujui peminjaman strategis, & mengesahkan laporan audit.', fill: '#7E22CE', fontSize: 11 });
  addNode('rectangle', 'Btn Action Pimpinan', f3, 1180, 98, 212, 42, { fill: '#7E22CE', cornerRadius: 10 });
  addNode('text', 'Btn Action Text Pimpinan', f3, 1180, 110, 212, 20, { characters: '🖋️ Pengesahan Dokumen (2)', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });

  // 4 KPI Cards
  const kpisPimpinan = [
    { title: 'Total Valuasi Aset', val: 'Rp 4,85 Miliar', sub: 'Inventaris Tercatat 1.248 Unit', badge: 'Audit BPK Clean', bg: C.successBg, tc: C.successText, icon: '🏛️' },
    { title: 'Rasio Keterpakaian', val: '78.5%', sub: 'Pemanfaatan Ruang Rapat & Aula', badge: 'Efisiensi Tinggi', bg: C.infoBg, tc: C.infoText, icon: '📊' },
    { title: 'Otorisasi Pinjam', val: '3 Permohonan', sub: 'Aula Utama & Bus Kampus', badge: 'Perlu SK Pimpinan', bg: C.warningBg, tc: C.warningText, icon: '📜' },
    { title: 'Serapan Biaya Servis', val: 'Rp 18.450.000', sub: 'Pagu Anggaran: Rp 35.000.000', badge: 'Serapan 52.7%', bg: C.purpleBg, tc: C.purpleText, icon: '💰' }
  ];
  kpisPimpinan.forEach((k, i) => {
    const x = 274 + i * (272 + 18);
    addNode('rectangle', `KPI Pimpinan ${i}`, f3, x, 166, 272, 104, { fill: '#FFFFFF', cornerRadius: 14, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `KPI Icon Pimpinan ${i}`, f3, x + 14, 184, 30, 30, { characters: k.icon, fontSize: 20 });
    addNode('text', `KPI Title Pimpinan ${i}`, f3, x + 50, 178, 200, 16, { characters: k.title, fill: '#64748B', fontSize: 11 });
    addNode('text', `KPI Val Pimpinan ${i}`, f3, x + 50, 194, 200, 22, { characters: k.val, fill: '#0F172A', fontSize: 16, fontStyle: 'Bold' });
    addNode('text', `KPI Sub Pimpinan ${i}`, f3, x + 14, 238, 160, 16, { characters: k.sub, fill: '#64748B', fontSize: 10 });
    addNode('rectangle', `KPI Badge Bg Pimpinan ${i}`, f3, x + 160, 236, 100, 20, { fill: k.bg, cornerRadius: 4 });
    addNode('text', `KPI Badge Text Pimpinan ${i}`, f3, x + 160, 238, 100, 14, { characters: k.badge, fill: k.tc, fontSize: 9, fontStyle: 'Bold', textAlign: 'center' });
  });

  // MIDDLE SECTION: GRAFIK SERAPAN ANGGARAN & DISTRIBUSI NILAI ASET
  // Left: Tren Serapan Anggaran Triwulan
  addNode('rectangle', 'Chart Box Pimpinan', f3, 274, 282, 680, 240, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Chart Title Pimpinan', f3, 296, 298, 420, 20, { characters: 'Grafik Serapan Anggaran Pemeliharaan Sarpras (2026)', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  addNode('text', 'Chart Sub Pimpinan', f3, 296, 318, 420, 16, { characters: 'Perbandingan Pagu Anggaran vs Realisasi Pengeluaran per Kuartal', fill: '#64748B', fontSize: 10 });

  const quarters = [
    { q: 'Q1 (Jan-Mar)', pagu: 'Rp 8,5 Jt', real: 'Rp 7,8 Jt', hP: 120, hR: 110, pct: '91%', x: 340 },
    { q: 'Q2 (Apr-Jun)', pagu: 'Rp 8,5 Jt', real: 'Rp 8,1 Jt', hP: 120, hR: 114, pct: '95%', x: 480 },
    { q: 'Q3 (Jul-Sep)', pagu: 'Rp 9,0 Jt', real: 'Rp 8,4 Jt', hP: 130, hR: 121, pct: '93%', x: 620 },
    { q: 'Q4 (Okt-Des)', pagu: 'Rp 9,0 Jt', real: 'Rp 2,5 Jt', hP: 130, hR: 36, pct: '27%', x: 760 }
  ];
  [360, 410, 460].forEach(gy => {
    addNode('rectangle', `Grid Line Pimpinan ${gy}`, f3, 310, gy, 620, 1, { fill: '#F1F5F9' });
  });
  quarters.forEach((q, i) => {
    addNode('rectangle', `Bar P Pimpinan ${i}`, f3, q.x, 480 - q.hP, 32, q.hP, { fill: '#CBD5E1', cornerRadius: 4 });
    addNode('rectangle', `Bar R Pimpinan ${i}`, f3, q.x + 36, 480 - q.hR, 32, q.hR, { fill: '#7E22CE', cornerRadius: 4 });
    addNode('text', `Q Label Pimpinan ${i}`, f3, q.x, 488, 70, 16, { characters: q.q, fill: '#0F172A', fontSize: 9, fontStyle: 'Bold', textAlign: 'center' });
    addNode('text', `Q Pct Pimpinan ${i}`, f3, q.x + 36, 480 - q.hR - 16, 32, 14, { characters: q.pct, fill: '#7E22CE', fontSize: 9, fontStyle: 'Bold', textAlign: 'center' });
  });
  addNode('rectangle', 'Leg Pagu Dot Pimpinan', f3, 720, 302, 12, 12, { fill: '#CBD5E1', cornerRadius: 3 });
  addNode('text', 'Leg Pagu Text Pimpinan', f3, 736, 300, 60, 16, { characters: 'Pagu Alokasi', fill: '#64748B', fontSize: 10 });
  addNode('rectangle', 'Leg Real Dot Pimpinan', f3, 810, 302, 12, 12, { fill: '#7E22CE', cornerRadius: 3 });
  addNode('text', 'Leg Real Text Pimpinan', f3, 826, 300, 90, 16, { characters: 'Realisasi Terserap', fill: '#7E22CE', fontSize: 10, fontStyle: 'Bold' });

  // Right: Distribusi Nilai Aset per Fakultas
  addNode('rectangle', 'Stat Desk Pimpinan', f3, 974, 282, 442, 240, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Stat Title Pimpinan', f3, 994, 298, 300, 20, { characters: 'Distribusi Nilai Aset per Fakultas', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  addNode('text', 'Stat Sub Pimpinan', f3, 994, 318, 300, 16, { characters: 'Total Aset Tercatat: Rp 4.850.000.000', fill: '#64748B', fontSize: 10 });

  const faculties = [
    { name: 'Fakultas Teknik', pct: '42%', val: 'Rp 2,03 M', barW: 280, color: '#1342B8', y: 346 },
    { name: 'Fakultas MIPA & Kedokteran', pct: '28%', val: 'Rp 1,35 M', barW: 190, color: '#059669', y: 390 },
    { name: 'Fakultas Ilmu Komputer', pct: '18%', val: 'Rp 873 Jt', barW: 120, color: '#7E22CE', y: 434 },
    { name: 'Gedung Rektorat & Umum', pct: '12%', val: 'Rp 582 Jt', barW: 80, color: '#D97706', y: 478 }
  ];
  faculties.forEach((f, i) => {
    addNode('text', `Fac Name Pimpinan ${i}`, f3, 994, f.y, 220, 16, { characters: f.name, fill: '#0F172A', fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `Fac Val Pimpinan ${i}`, f3, 1260, f.y, 140, 16, { characters: `${f.pct} (${f.val})`, fill: '#64748B', fontSize: 10, textAlign: 'right' });
    addNode('rectangle', `Bar Bg Pimpinan ${i}`, f3, 994, f.y + 18, 400, 8, { fill: '#E2E8F0', cornerRadius: 4 });
    addNode('rectangle', `Bar Fill Pimpinan ${i}`, f3, 994, f.y + 18, f.barW, 8, { fill: f.color, cornerRadius: 4 });
  });

  // BOTTOM SECTION: MEJA OTORISASI STRATEGIS & PENGESAHAN DOKUMEN
  addNode('rectangle', 'Approval Desk Pimpinan', f3, 274, 534, 680, 406, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Approval Title Pimpinan', f3, 296, 550, 420, 20, { characters: 'Otorisasi Peminjaman Fasilitas Strategis Kampus', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });

  const leaderApprovals = [
    { org: 'Badan Eksekutif Mahasiswa (BEM Univ)', event: 'Seminar Nasional Kebangsaan 2026', facility: 'Aula Utama & Sound (800 Org)', date: '19 - 20 Nov 2026', y: 580 },
    { org: 'Himpunan Mahasiswa Mesin', event: 'Kunjungan Studi Industri Karawang', facility: 'Bus Kampus Isuzu Elf 28-Seat', date: '24 Nov 2026', y: 686 },
    { org: 'Lembaga Penelitian (LPPM)', event: 'Lokakarya Publikasi Riset Scopus', facility: 'Ruang Senat Lt. 3 & Smart Display', date: '22 Nov 2026', y: 792 }
  ];
  leaderApprovals.forEach((a, i) => {
    addNode('rectangle', `Appr Box Pimpinan ${i}`, f3, 296, a.y, 636, 92, { fill: '#F8FAFC', cornerRadius: 12, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `Appr Org Pimpinan ${i}`, f3, 312, a.y + 12, 360, 18, { characters: a.org, fill: '#581C87', fontSize: 12, fontStyle: 'Bold' });
    addNode('text', `Appr Event Pimpinan ${i}`, f3, 312, a.y + 32, 360, 16, { characters: `Acara: ${a.event}`, fill: '#0F172A', fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `Appr Facil Pimpinan ${i}`, f3, 312, a.y + 52, 360, 16, { characters: `Fasilitas: ${a.facility} • ${a.date}`, fill: '#64748B', fontSize: 10 });
    // Buttons
    addNode('rectangle', `Btn Tolak Pimpinan ${i}`, f3, 720, a.y + 28, 86, 36, { fill: C.errorBg, cornerRadius: 8 });
    addNode('text', `Text Tolak Pimpinan ${i}`, f3, 720, a.y + 38, 86, 16, { characters: '✕ Tolak', fill: C.errorText, fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });
    addNode('rectangle', `Btn Setuju Pimpinan ${i}`, f3, 814, a.y + 28, 104, 36, { fill: '#7E22CE', cornerRadius: 8 });
    addNode('text', `Text Setuju Pimpinan ${i}`, f3, 814, a.y + 38, 104, 16, { characters: '✓ Setujui (SK)', fill: '#FFFFFF', fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });
  });

  // Right: Pengesahan Laporan Resmi
  addNode('rectangle', 'Sign Desk Pimpinan', f3, 974, 534, 442, 406, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Sign Title Pimpinan', f3, 994, 550, 300, 20, { characters: 'Pengesahan Dokumen Audit Sarpras', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });

  addNode('rectangle', 'Sign Doc Box Pimpinan', f3, 994, 584, 402, 160, { fill: '#FAF5FF', cornerRadius: 12, stroke: '#E9D5FF', strokeWeight: 1 });
  addNode('text', 'Sign Doc Title Pimpinan', f3, 1012, 600, 360, 20, { characters: 'Dokumen Menunggu Pengesahan:', fill: '#581C87', fontSize: 12, fontStyle: 'Bold' });
  addNode('text', 'Sign Doc Name Pimpinan', f3, 1012, 626, 360, 40, { characters: '📄 Laporan Rekapitulasi Audit Fisik Sarpras Q3-2026.pdf (Terverifikasi Tim BPK & Satuan Pengawas Internal)', fill: '#0F172A', fontSize: 11 });
  addNode('rectangle', 'Btn Sign Pimpinan', f3, 1012, 680, 366, 44, { fill: '#7E22CE', cornerRadius: 10 });
  addNode('text', 'Text Sign Pimpinan', f3, 1012, 692, 366, 20, { characters: '🖋️ Sahkan Dokumen (Tanda Tangan Digital)', fill: '#FFFFFF', fontSize: 12, fontStyle: 'Bold', textAlign: 'center' });

  addNode('text', 'Sign Note Pimpinan', f3, 994, 760, 402, 36, { characters: '🔒 Pengesahan terenkripsi dengan Sertifikat BSrE Nasional & otomatis menerbitkan Surat Tanda Terima Aset (STTA).', fill: '#64748B', fontSize: 10, textAlign: 'center' });
}

// =========================================================================
// 4. DASHBOARD PEMINJAM MANDIRI (x: 4620, y: 0) WITH CHARTS & SELF-SERVICE
// =========================================================================
function buildDashboardPeminjam() {
  const f4 = addNode('frame', '[M3] SIMAS - Dashboard Peminjam Mandiri', null, 4620, 0, 1440, 960, { fill: C.surface, clip: true });
  createFullSidebar(f4, 'peminjam', 'Peminjam (Dosen/Mhs)', 'Layanan Mandiri', 'dashboard');
  createTopBar(f4, 'peminjam', 'Portal Layanan Mandiri Peminjaman Sarpras', 'Peminjaman Mandiri • Cek Ruang Kosong • Katalog Alat Tersedia', 'Budi Santoso', 'Peminjam (Dosen Teknik)');

  // Banner
  addNode('rectangle', 'Banner Peminjam', f4, 274, 86, 1142, 68, { fill: '#EFF6FF', cornerRadius: 14, stroke: '#BFDBFE', strokeWeight: 1 });
  addNode('text', 'Banner Peminjam Title', f4, 296, 98, 700, 22, { characters: 'Selamat Datang di Portal Mandiri, Pak Budi Santoso! 🎓', fill: '#1E3A8A', fontSize: 16, fontStyle: 'Bold' });
  addNode('text', 'Banner Peminjam Sub', f4, 296, 122, 700, 18, { characters: 'Layanan Mandiri: Ajukan pinjaman sarana perkuliahan & booking ruangan kosong tanpa birokrasi rumit.', fill: '#2563EB', fontSize: 11 });
  addNode('rectangle', 'Btn Action Peminjam', f4, 1180, 98, 212, 42, { fill: C.brandBlue, cornerRadius: 10 });
  addNode('text', 'Btn Action Text Peminjam', f4, 1180, 110, 212, 20, { characters: '+ Ajukan Peminjaman Baru', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });

  // 4 KPI Cards
  const kpisPeminjam = [
    { title: 'Sarana Aktif Dipinjam', val: '2 Sarana', sub: 'Proyektor & Kabel Roll', badge: 'Sedang Digunakan', bg: C.infoBg, tc: C.infoText, icon: '📦' },
    { title: 'Dalam Proses Review', val: '1 Pengajuan', sub: 'Surat Izin Lab Komputer', badge: 'Menunggu Review', bg: C.warningBg, tc: C.warningText, icon: '⏳' },
    { title: 'Tenggat Kembali', val: 'Besok 17:00', sub: 'Ruang Sarpras Gedung Rektorat', badge: 'Jangan Terlambat', bg: C.errorBg, tc: C.errorText, icon: '⏰' },
    { title: 'Skor Kepatuhan Saya', val: '100% Sempurna', sub: '18x Pinjam Tepat Waktu', badge: 'Pemohon Terpercaya', bg: C.successBg, tc: C.successText, icon: '⭐' }
  ];
  kpisPeminjam.forEach((k, i) => {
    const x = 274 + i * (272 + 18);
    addNode('rectangle', `KPI Peminjam ${i}`, f4, x, 166, 272, 104, { fill: '#FFFFFF', cornerRadius: 14, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `KPI Icon Peminjam ${i}`, f4, x + 14, 184, 30, 30, { characters: k.icon, fontSize: 20 });
    addNode('text', `KPI Title Peminjam ${i}`, f4, x + 50, 178, 200, 16, { characters: k.title, fill: '#64748B', fontSize: 11 });
    addNode('text', `KPI Val Peminjam ${i}`, f4, x + 50, 194, 200, 22, { characters: k.val, fill: '#0F172A', fontSize: 16, fontStyle: 'Bold' });
    addNode('text', `KPI Sub Peminjam ${i}`, f4, x + 14, 238, 160, 16, { characters: k.sub, fill: '#64748B', fontSize: 10 });
    addNode('rectangle', `KPI Badge Bg Peminjam ${i}`, f4, x + 160, 236, 100, 20, { fill: k.bg, cornerRadius: 4 });
    addNode('text', `KPI Badge Text Peminjam ${i}`, f4, x + 160, 238, 100, 14, { characters: k.badge, fill: k.tc, fontSize: 9, fontStyle: 'Bold', textAlign: 'center' });
  });

  // MIDDLE SECTION: GRAFIK HISTORI PEMINJAMAN SAYA & LIVE TRACKING
  // Left: Tren Peminjaman Saya (6 Bulan Terakhir)
  addNode('rectangle', 'Chart Box Peminjam', f4, 274, 282, 680, 240, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Chart Title Peminjam', f4, 296, 298, 420, 20, { characters: 'Grafik Frekuensi Peminjaman Mandiri Saya (6 Bulan Terakhir)', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  addNode('text', 'Chart Sub Peminjam', f4, 296, 318, 420, 16, { characters: 'Aktivitas pengajuan sarana untuk perkuliahan & riset laboratorium', fill: '#64748B', fontSize: 10 });
  addNode('rectangle', 'Chart Badge Peminjam', f4, 790, 298, 144, 24, { fill: C.successBg, cornerRadius: 6 });
  addNode('text', 'Chart Badge Text Peminjam', f4, 790, 302, 144, 16, { characters: '⭐ Skor Tertib: 100%', fill: C.successText, fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });

  const months = [
    { m: 'Juni', count: '3 Pinjam', h: 60, x: 330 },
    { m: 'Juli', count: '2 Pinjam', h: 40, x: 400 },
    { m: 'Agustus', count: '4 Pinjam', h: 80, x: 470 },
    { m: 'September', count: '3 Pinjam', h: 60, x: 540 },
    { m: 'Oktober', count: '5 Pinjam', h: 100, x: 610 },
    { m: 'November', count: '2 Aktif', h: 45, x: 680 }
  ];
  [360, 410, 460].forEach(gy => {
    addNode('rectangle', `Grid Line Peminjam ${gy}`, f4, 310, gy, 620, 1, { fill: '#F1F5F9' });
  });
  months.forEach((mn, i) => {
    addNode('rectangle', `Bar Month Peminjam ${i}`, f4, mn.x, 480 - mn.h, 38, mn.h, { fill: (i === 5) ? C.brandBlue : '#93C5FD', cornerRadius: 6 });
    addNode('text', `Month Label ${i}`, f4, mn.x - 6, 488, 50, 16, { characters: mn.m, fill: '#0F172A', fontSize: 9, fontStyle: 'Bold', textAlign: 'center' });
    addNode('text', `Month Val ${i}`, f4, mn.x - 6, 480 - mn.h - 16, 50, 14, { characters: mn.count, fill: C.brandBlue, fontSize: 8, textAlign: 'center' });
  });

  // Right: Live Tracking Pengajuan
  addNode('rectangle', 'Tracking Desk Peminjam', f4, 974, 282, 442, 240, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Tracking Title Peminjam', f4, 994, 298, 400, 20, { characters: 'Live Tracking: Pengajuan #PINJ-2026-089', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  addNode('text', 'Tracking Sub Peminjam', f4, 994, 318, 400, 16, { characters: 'Workshop AI • Ruang Seminar Utama • 17-18 Nov 2026', fill: '#64748B', fontSize: 10 });

  const pSteps = [
    { no: '1', label: 'Diajukan', state: 'done', x: 1010 },
    { no: '2', label: 'Cek Stok', state: 'done', x: 1100 },
    { no: '3', label: 'Review SK', state: 'active', x: 1190 },
    { no: '4', label: 'Ambil', state: 'pending', x: 1280 }
  ];
  pSteps.forEach(s => {
    addNode('ellipse', `PS Ellipse ${s.no}`, f4, s.x, 356, 32, 32, { fill: (s.state === 'done') ? '#059669' : (s.state === 'active' ? '#D97706' : '#CBD5E1') });
    addNode('text', `PS Mark ${s.no}`, f4, s.x, 364, 32, 16, { characters: (s.state === 'done') ? '✓' : (s.state === 'active' ? '⏳' : s.no), fill: '#FFFFFF', fontSize: 12, fontStyle: 'Bold', textAlign: 'center' });
    addNode('text', `PS Label ${s.no}`, f4, s.x - 16, 396, 64, 16, { characters: s.label, fill: (s.state === 'active') ? '#B45309' : '#0F172A', fontSize: 9, fontStyle: 'Bold', textAlign: 'center' });
  });

  addNode('rectangle', 'Tracking Alert Peminjam', f4, 994, 436, 402, 70, { fill: '#FAF5FF', cornerRadius: 10, stroke: '#E9D5FF', strokeWeight: 1 });
  addNode('text', 'Tracking Alert Text Peminjam', f4, 1008, 448, 374, 50, {
    characters: 'Status Terkini: Permohonan telah lolos verifikasi stok dan saat ini sedang menunggu persetujuan Dekan / Pimpinan Institusi.',
    fill: '#7E22CE',
    fontSize: 10
  });

  // BOTTOM SECTION: BARANG DIPINJAM & KATALOG CEPAT
  addNode('rectangle', 'My Loan Desk Peminjam', f4, 274, 534, 680, 406, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'My Loan Title Peminjam', f4, 296, 550, 400, 20, { characters: 'Sarana yang Sedang Saya Pinjam Saat Ini', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });

  const activeBorrowed = [
    { name: 'Proyektor Epson EB-X500 (3600 Lumens)', code: 'AST-TI-2024-002', loc: 'Ruang Seminar 2 • Kuliah Kecerdasan Buatan', due: 'Tenggat: 17 Nov 2026, 17:00 WIB (Sisa 24 Jam)', y: 580 },
    { name: '1x Wireless Pointer Logitech R400 + Baterai', code: 'AST-TI-2024-009', loc: 'Paket bersama Proyektor Epson', due: 'Tenggat: 17 Nov 2026, 17:00 WIB', y: 700 }
  ];
  activeBorrowed.forEach((b, i) => {
    addNode('rectangle', `Borrow Box Peminjam ${i}`, f4, 296, b.y, 636, 102, { fill: '#F8FAFC', cornerRadius: 12, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `Borrow Name Peminjam ${i}`, f4, 312, b.y + 12, 360, 18, { characters: b.name, fill: '#0F172A', fontSize: 12, fontStyle: 'Bold' });
    addNode('text', `Borrow Code Peminjam ${i}`, f4, 312, b.y + 32, 360, 16, { characters: `Kode Aset: ${b.code}`, fill: C.brandBlue, fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `Borrow Loc Peminjam ${i}`, f4, 312, b.y + 52, 360, 16, { characters: b.loc, fill: '#64748B', fontSize: 10 });
    addNode('text', `Borrow Due Peminjam ${i}`, f4, 312, b.y + 72, 360, 16, { characters: `⏰ ${b.due}`, fill: '#B45309', fontSize: 10, fontStyle: 'Bold' });
    // Action
    addNode('rectangle', `Btn Ext Peminjam ${i}`, f4, 740, b.y + 24, 172, 30, { fill: '#EFF6FF', cornerRadius: 6, stroke: '#BFDBFE', strokeWeight: 1 });
    addNode('text', `Text Ext Peminjam ${i}`, f4, 740, b.y + 30, 172, 16, { characters: '⏱️ Ajukan Perpanjangan', fill: C.brandBlue, fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });
    addNode('rectangle', `Btn Guide Peminjam ${i}`, f4, 740, b.y + 60, 172, 30, { fill: '#F1F5F9', cornerRadius: 6 });
    addNode('text', `Text Guide Peminjam ${i}`, f4, 740, b.y + 66, 172, 16, { characters: 'Petunjuk Pengembalian', fill: '#475569', fontSize: 10, textAlign: 'center' });
  });

  // Right: Katalog Siap Pakai
  addNode('rectangle', 'Catalog Desk Peminjam', f4, 974, 534, 442, 406, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Catalog Title Peminjam', f4, 994, 550, 300, 20, { characters: 'Katalog Sarpras Siap Pakai Hari Ini', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });

  const quickAvailable = [
    { icon: '🏢', name: 'Ruang Seminar 1 (Gedung TI)', cap: 'Kapasitas 60 Org • AC & Audio', avail: 'Tersedia Sekarang', y: 580 },
    { icon: '🎤', name: 'Sound Portable Yamaha 680W', cap: '2 Mic Wireless + Mixer 10-Ch', avail: 'Ready di Sarpras', y: 668 },
    { icon: '💻', name: 'Laptop ASUS ROG Lab VR', cap: 'Core i9, 32GB RAM, RTX 4070', avail: 'Ready di Lab 1', y: 756 },
    { icon: '📷', name: 'Kamera Sony A6400 Kit 4K', cap: 'Lensa 16-50mm + Tripod', avail: 'Ready di Sarpras', y: 844 }
  ];
  quickAvailable.forEach((q, i) => {
    addNode('rectangle', `Quick Box Peminjam ${i}`, f4, 994, q.y, 402, 76, { fill: '#F8FAFC', cornerRadius: 10, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `Quick Icon Peminjam ${i}`, f4, 1008, q.y + 14, 30, 30, { characters: q.icon, fontSize: 18 });
    addNode('text', `Quick Name Peminjam ${i}`, f4, 1046, q.y + 10, 240, 18, { characters: q.name, fill: '#0F172A', fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `Quick Cap Peminjam ${i}`, f4, 1046, q.y + 28, 240, 16, { characters: q.cap, fill: '#64748B', fontSize: 9 });
    addNode('text', `Quick Avail Peminjam ${i}`, f4, 1046, q.y + 46, 160, 16, { characters: `✓ ${q.avail}`, fill: '#15803D', fontSize: 9, fontStyle: 'Bold' });
    // Book button
    addNode('rectangle', `Quick Book Peminjam ${i}`, f4, 1300, q.y + 24, 82, 30, { fill: C.brandBlue, cornerRadius: 6 });
    addNode('text', `Quick Book Text Peminjam ${i}`, f4, 1300, q.y + 30, 82, 16, { characters: '+ Pinjam', fill: '#FFFFFF', fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });
  });
}

// =========================================================================
// CALL BUILDERS FOR ROW 1, ROW 2, ROW 3
// =========================================================================
console.log('Building Row 1: All 4 Dashboards with full UI & Charts...');
buildDashboardAdmin();
buildDashboardPetugas();
buildDashboardPimpinan();
buildDashboardPeminjam();

// Import and run Row 2 & Row 3 from build_simas_all_screens logic
console.log('Building Row 2 & Row 3: Modules, Reports & Login...');
const allScr = require('./build_simas_all_screens.cjs'); // We will append row 2 & 3 directly here
