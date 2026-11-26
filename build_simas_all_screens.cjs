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

function addVector(name, parentRef, x, y, width, height, path, strokeColor, strokeWeight = 1.8, fillColor = 'none') {
  const refName = `step_${stepCounter++}`;
  const step = {
    command: 'node.create',
    as: refName,
    params: {
      type: 'vector',
      name,
      x,
      y,
      width,
      height,
      path,
      props: {
        fill: fillColor,
        stroke: strokeColor,
        strokeWeight,
        strokeCap: 'round',
        strokeJoin: 'round'
      }
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

// Common vector paths
const VP = {
  layers: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
  dashboard: 'M4 3h5a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M15 3h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M15 14h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1z',
  package: 'M21 8v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8 M3 4h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z M10 12h4',
  building: 'M6 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16 M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2 M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2 M10 22v-3a2 2 0 0 1 4 0v3 M10 9h4 M10 13h4',
  calendar: 'M8 2v4 M16 2v4 M3 10h18 M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7 M17.5 13.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z M17.5 15.5v2.2l1.3.8',
  wrench: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  document: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35',
  bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  clipboard: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z',
  money: 'M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 6v6l4 2'
};

// -------------------------------------------------------------------------
// COMPONENT: SIDEBAR (260px - WIDENED, SPACIOUS & NO TEXT OVERLAPPING)
// -------------------------------------------------------------------------
function createFullSidebar(screenRef, roleKey, roleTitle, rolePeranDesc, activeMenuId) {
  const sb = addNode('frame', `Sidebar ${roleKey} ${activeMenuId}`, screenRef, 0, 0, 260, 960, {
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
  addVector(`Brand Icon ${roleKey} ${activeMenuId}`, sb, 31, 31, 20, 20,
    VP.layers, '#FFFFFF', 2
  );
  addNode('text', `Brand Title ${roleKey} ${activeMenuId}`, sb, 70, 22, 170, 20, {
    characters: 'SIMAS',
    fill: C.brandText,
    fontSize: 16,
    fontStyle: 'Bold'
  });
  addNode('text', `Brand Subtitle ${roleKey} ${activeMenuId}`, sb, 70, 42, 170, 16, {
    characters: 'Sistem Sarana & Prasarana',
    fill: C.subtitleText,
    fontSize: 10
  });
  
  // Role Switcher Card - 232px width, perfectly symmetrical
  addNode('rectangle', `Role Card ${roleKey} ${activeMenuId}`, sb, 14, 76, 232, 64, {
    fill: C.roleCardBg,
    cornerRadius: 14
  });
  addVector(`Role Shield ${roleKey} ${activeMenuId}`, sb, 24, 91, 18, 18,
    VP.shield, C.brandBlue, 1.8
  );
  addNode('text', `Role Peran ${roleKey} ${activeMenuId}`, sb, 48, 85, 116, 15, {
    characters: `Peran: ${rolePeranDesc}`,
    fill: '#475569',
    fontSize: 10
  });
  addNode('text', `Role Name ${roleKey} ${activeMenuId}`, sb, 48, 102, 116, 18, {
    characters: roleTitle,
    fill: C.brandText,
    fontSize: 12,
    fontStyle: 'Bold'
  });
  addNode('rectangle', `Btn Ganti Role ${roleKey} ${activeMenuId}`, sb, 166, 88, 70, 28, {
    fill: C.btnGantiRoleBg,
    cornerRadius: 8,
    stroke: C.btnGantiRoleBorder,
    strokeWeight: 1
  });
  addNode('text', `Text Ganti Role ${roleKey} ${activeMenuId}`, sb, 166, 95, 70, 14, {
    characters: 'Ganti Role',
    fill: C.brandText,
    fontSize: 10,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  
  // Navigation Menus
  const fullMenus = [
    { id: 'dashboard', label: 'Dashboard', icon: VP.dashboard },
    { id: 'aset', label: 'Inventaris Aset', icon: VP.package },
    { id: 'gedung', label: 'Gedung & Ruangan', icon: VP.building },
    { id: 'pinjam', label: 'Peminjaman Sarana', icon: VP.calendar },
    { id: 'pemeliharaan', label: 'Pemeliharaan', icon: VP.wrench },
    { id: 'laporan', label: 'Laporan', icon: VP.document }
  ];
  
  const peminjamMenus = [
    { id: 'dashboard', label: 'Dashboard', icon: VP.dashboard },
    { id: 'aset', label: 'Katalog Aset Tersedia', icon: VP.package },
    { id: 'gedung', label: 'Gedung & Ruangan', icon: VP.building },
    { id: 'pinjam', label: 'Peminjaman Saya', icon: VP.calendar }
  ];
  
  const menus = (roleKey === 'peminjam') ? peminjamMenus : fullMenus;
  const startY = 150;
  const itemH = 44;
  const gap = 4;
  
  menus.forEach((m, idx) => {
    const yPos = startY + idx * (itemH + gap);
    const isActive = (m.id === activeMenuId);
    
    if (isActive) {
      addNode('rectangle', `Nav Pill ${roleKey} ${activeMenuId} ${m.id}`, sb, 14, yPos, 232, 44, {
        fill: C.navActiveBg,
        cornerRadius: 12
      });
      addVector(`Nav Icon ${roleKey} ${activeMenuId} ${m.id}`, sb, 28, yPos + 12, 20, 20,
        m.icon, '#FFFFFF', 2
      );
      addNode('text', `Nav Label ${roleKey} ${activeMenuId} ${m.id}`, sb, 58, yPos + 13, 170, 20, {
        characters: m.label,
        fill: C.navActiveText,
        fontSize: 13,
        fontStyle: 'Bold'
      });
    } else {
      addVector(`Nav Icon ${roleKey} ${activeMenuId} ${m.id}`, sb, 28, yPos + 12, 20, 20,
        m.icon, '#475569', 1.8
      );
      addNode('text', `Nav Label ${roleKey} ${activeMenuId} ${m.id}`, sb, 58, yPos + 13, 170, 20, {
        characters: m.label,
        fill: C.navInactiveText,
        fontSize: 13
      });
    }
  });
  
  return sb;
}

// -------------------------------------------------------------------------
// COMPONENT: TOP APP BAR (W: 1180px, starts at x: 260)
// -------------------------------------------------------------------------
function createTopBar(screenRef, roleKey, title, subtitle, userName, userRole) {
  const tb = addNode('frame', `TopBar ${roleKey} ${title.slice(0, 10)}`, screenRef, 260, 0, 1180, 72, {
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
  
  // Search Box
  addNode('rectangle', `TB Search ${roleKey} ${title.slice(0, 10)}`, tb, 500, 14, 340, 44, {
    fill: '#F1F5F9',
    cornerRadius: 22
  });
  addVector(`TB Search Icon ${roleKey} ${title.slice(0, 10)}`, tb, 516, 27, 18, 18,
    VP.search, '#94A3B8', 1.8
  );
  addNode('text', `TB Search Text ${roleKey} ${title.slice(0, 10)}`, tb, 544, 26, 280, 20, {
    characters: 'Cari data dalam modul ini...',
    fill: '#94A3B8',
    fontSize: 12
  });
  
  // Bell Box
  addNode('rectangle', `TB Notif ${roleKey} ${title.slice(0, 10)}`, tb, 860, 16, 40, 40, {
    fill: '#F8FAFC',
    cornerRadius: 20,
    stroke: '#E2E8F0',
    strokeWeight: 1
  });
  addVector(`TB Bell Icon ${roleKey} ${title.slice(0, 10)}`, tb, 871, 27, 18, 18,
    VP.bell, '#475569', 1.8
  );
  addNode('ellipse', `TB Dot ${roleKey} ${title.slice(0, 10)}`, tb, 886, 20, 8, 8, {
    fill: '#EF4444'
  });
  
  // Profile Box (250px width, plenty of room for long titles)
  addNode('rectangle', `TB Profile ${roleKey} ${title.slice(0, 10)}`, tb, 915, 14, 250, 44, {
    fill: '#EFF6FF',
    cornerRadius: 22,
    stroke: '#BFDBFE',
    strokeWeight: 1
  });
  addNode('ellipse', `TB Avatar ${roleKey} ${title.slice(0, 10)}`, tb, 922, 20, 32, 32, {
    fill: C.brandBlue
  });
  addNode('text', `TB Initials ${roleKey} ${title.slice(0, 10)}`, tb, 922, 28, 32, 16, {
    characters: userName.split(' ').map(n => n[0]).slice(0, 2).join(''),
    fill: '#FFFFFF',
    fontSize: 11,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  addNode('text', `TB Name ${roleKey} ${title.slice(0, 10)}`, tb, 962, 18, 195, 18, {
    characters: userName,
    fill: '#0F172A',
    fontSize: 12,
    fontStyle: 'Bold'
  });
  addNode('text', `TB Role ${roleKey} ${title.slice(0, 10)}`, tb, 962, 36, 195, 14, {
    characters: userRole,
    fill: C.brandBlue,
    fontSize: 10
  });
  
  return tb;
}

// Helper to build 4 symmetrical premium KPI cards
function renderKpiCards(frameRef, kpiList) {
  kpiList.forEach((k, i) => {
    const x = 280 + i * 290;
    // Card background
    addNode('rectangle', `KPI Box ${i}`, frameRef, x, 166, 270, 104, { fill: '#FFFFFF', cornerRadius: 14, stroke: '#E2E8F0', strokeWeight: 1 });
    
    // Top Row: Title & Top-Right Icon Badge
    addNode('text', `KPI Title ${i}`, frameRef, x + 18, 178, 190, 16, { characters: k.title, fill: '#64748B', fontSize: 11 });
    addNode('rectangle', `KPI Icon Box ${i}`, frameRef, x + 222, 174, 32, 32, { fill: k.bg, cornerRadius: 8 });
    addVector(`KPI Icon Vec ${i}`, frameRef, x + 229, 181, 18, 18, k.icon, k.tc, 1.8);
    
    // Middle Row: Big bold value
    addNode('text', `KPI Val ${i}`, frameRef, x + 18, 198, 195, 24, { characters: k.val, fill: '#0F172A', fontSize: 18, fontStyle: 'Bold' });
    
    // Bottom Row: Subtitle & Status Badge
    addNode('text', `KPI Sub ${i}`, frameRef, x + 18, 238, 145, 16, { characters: k.sub, fill: '#64748B', fontSize: 10 });
    addNode('rectangle', `KPI Badge Bg ${i}`, frameRef, x + 164, 236, 94, 20, { fill: k.bg, cornerRadius: 5 });
    addNode('text', `KPI Badge Text ${i}`, frameRef, x + 164, 239, 94, 14, { characters: k.badge, fill: k.tc, fontSize: 9, fontStyle: 'Bold', textAlign: 'center' });
  });
}

// =========================================================================
// ROW 1: 4 ROLE DASHBOARDS (x: 0, 1540, 3080, 4620; y: 0)
// =========================================================================

// 1. ADMIN DASHBOARD
function buildDashboardAdmin() {
  const f1 = addNode('frame', '[M3] SIMAS - Dashboard Admin Sarpras', null, 0, 0, 1440, 960, { fill: C.surface, clip: true });
  createFullSidebar(f1, 'admin', 'Admin Sarpras', 'Full Access', 'dashboard');
  createTopBar(f1, 'admin', 'Dashboard Eksekutif Admin Sarpras', 'Kontrol Penuh 6 Menu • Master Aset, Ruangan, Approval, Kanban, Laporan', 'Bambang Irawan', 'Admin Sarpras (Full Control)');
  
  // Banner
  addNode('rectangle', 'Banner Admin', f1, 280, 86, 1140, 68, { fill: '#EEF2FF', cornerRadius: 14, stroke: '#C7D2FE', strokeWeight: 1 });
  addNode('text', 'Banner Admin Title', f1, 302, 98, 740, 22, { characters: 'Selamat Datang, Bambang Irawan, S.Kom! (Admin Sarpras)', fill: '#1E1B4B', fontSize: 16, fontStyle: 'Bold' });
  addNode('text', 'Banner Admin Sub', f1, 302, 122, 740, 18, { characters: 'Wewenang Penuh: Tambah/Edit/Hapus Aset, Setujui Pinjaman, Kelola Tiket Kanban, & Rekap Cetak Laporan.', fill: '#4338CA', fontSize: 11 });
  addNode('rectangle', 'Btn Action 1 Admin', f1, 1070, 98, 160, 42, { fill: C.brandBlue, cornerRadius: 10 });
  addNode('text', 'Btn Action 1 Text Admin', f1, 1070, 110, 160, 20, { characters: '+ Tambah Aset Baru', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });
  addNode('rectangle', 'Btn Action 2 Admin', f1, 1245, 98, 160, 42, { fill: '#FFFFFF', cornerRadius: 10, stroke: '#CBD5E1', strokeWeight: 1 });
  addNode('text', 'Btn Action 2 Text Admin', f1, 1245, 110, 160, 20, { characters: 'Cetak Laporan', fill: '#0F172A', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });

  // 4 Symmetrical KPI Cards
  const kpisAdmin = [
    { title: 'Total Master Aset', val: '1.248 Unit', sub: 'Valuasi Rp 4,85 Miliar', badge: '94% Baik', bg: C.infoBg, tc: C.infoText, icon: VP.package },
    { title: 'Okupansi Ruangan', val: '42 / 56', sub: '75% Kapasitas Terisi', badge: '14 Kosong', bg: C.successBg, tc: C.successText, icon: VP.building },
    { title: 'Antrean Pinjaman', val: '8 Pengajuan', sub: '4 Butuh Approval', badge: 'Tindakan Cepat', bg: C.warningBg, tc: C.warningText, icon: VP.clipboard },
    { title: 'Tiket Perbaikan', val: '5 Pengerjaan', sub: 'Biaya Rp 4.250.000', badge: '2 Selesai Hari Ini', bg: C.purpleBg, tc: C.purpleText, icon: VP.wrench }
  ];
  renderKpiCards(f1, kpisAdmin);

  // Middle Section: Tren Bar Chart 7 Hari (w: 700) & Okupansi Ruang (w: 420)
  addNode('rectangle', 'Chart Box Admin', f1, 280, 282, 700, 240, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Chart Title Admin', f1, 304, 298, 280, 20, { characters: 'Tren Sirkulasi Peminjaman (7 Hari)', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  addNode('text', 'Chart Sub Admin', f1, 304, 318, 280, 16, { characters: 'Perbandingan peminjaman aktif vs selesai per hari', fill: '#64748B', fontSize: 10 });
  
  // Header Legend & Badge in Chart
  addNode('rectangle', 'Leg Dot 1 Admin', f1, 600, 304, 10, 10, { fill: C.brandBlue, cornerRadius: 3 });
  addNode('text', 'Leg Text 1 Admin', f1, 614, 301, 75, 16, { characters: 'Peminjaman', fill: '#0F172A', fontSize: 10 });
  addNode('rectangle', 'Leg Dot 2 Admin', f1, 695, 304, 10, 10, { fill: '#10B981', cornerRadius: 3 });
  addNode('text', 'Leg Text 2 Admin', f1, 709, 301, 80, 16, { characters: 'Servis Selesai', fill: '#0F172A', fontSize: 10 });
  addNode('rectangle', 'Chart Badge Admin', f1, 805, 296, 155, 24, { fill: C.successBg, cornerRadius: 6 });
  addNode('text', 'Chart Badge Text Admin', f1, 805, 300, 155, 16, { characters: '↗ +18.4% Aktivitas', fill: C.successText, fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });

  // Symmetrical 7-Day Bars across full 630px
  const adminDays = [
    { day: 'Sen 10', hP: 84, hS: 24 },
    { day: 'Sel 11', hP: 110, hS: 36 },
    { day: 'Rab 12', hP: 98, hS: 30 },
    { day: 'Kam 13', hP: 130, hS: 42 },
    { day: 'Jum 14', hP: 116, hS: 54 },
    { day: 'Sab 15', hP: 50, hS: 16 },
    { day: 'Min 16', hP: 90, hS: 34 }
  ];
  [360, 400, 440, 480].forEach(gy => {
    addNode('rectangle', `Chart Grid Line Admin ${gy}`, f1, 304, gy, 650, 1, { fill: '#F1F5F9' });
  });
  const startPlotX = 315;
  const colW = 88;
  adminDays.forEach((d, i) => {
    const cx = startPlotX + i * colW;
    addNode('rectangle', `Bar P Admin ${i}`, f1, cx + 18, 480 - d.hP, 22, d.hP, { fill: C.brandBlue, cornerRadius: 4 });
    addNode('rectangle', `Bar S Admin ${i}`, f1, cx + 44, 480 - d.hS, 16, d.hS, { fill: '#10B981', cornerRadius: 4 });
    addNode('text', `Day Label Admin ${i}`, f1, cx, 488, 80, 16, { characters: d.day, fill: '#64748B', fontSize: 10, textAlign: 'center' });
  });

  // Right: Okupansi Ruang (w: 420)
  addNode('rectangle', 'Occupancy Box Admin', f1, 1000, 282, 420, 240, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Occupancy Title Admin', f1, 1020, 298, 380, 20, { characters: 'Okupansi Ruang per Kompleks Gedung', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  addNode('text', 'Occupancy Sub Admin', f1, 1020, 318, 380, 16, { characters: '42 dari 56 ruangan sedang digunakan aktif', fill: '#64748B', fontSize: 10 });

  const complexes = [
    { name: 'Gedung TI (Lab & R. Dosen)', val: '17 / 20 (85%)', w: 310, color: C.brandBlue, y: 346 },
    { name: 'Gedung Utama (Aula & Seminar)', val: '14 / 20 (70%)', w: 255, color: '#10B981', y: 390 },
    { name: 'Gedung MIPA (Laboratorium)', val: '6 / 10 (60%)', w: 220, color: '#8B5CF6', y: 434 },
    { name: 'Gedung Rektorat (Senat & Rapat)', val: '5 / 6 (83%)', w: 300, color: '#F59E0B', y: 478 }
  ];
  complexes.forEach((c, i) => {
    addNode('text', `C Name ${i}`, f1, 1020, c.y, 220, 16, { characters: c.name, fill: '#0F172A', fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `C Val ${i}`, f1, 1260, c.y, 140, 16, { characters: c.val, fill: '#64748B', fontSize: 10, textAlign: 'right' });
    addNode('rectangle', `C Bar Bg ${i}`, f1, 1020, c.y + 18, 380, 8, { fill: '#F1F5F9', cornerRadius: 4 });
    addNode('rectangle', `C Bar Fill ${i}`, f1, 1020, c.y + 18, c.w, 8, { fill: c.color, cornerRadius: 4 });
  });

  // Bottom Section: Loans & Kanban (w: 700 & 420)
  addNode('rectangle', 'Loan Card Admin', f1, 280, 534, 700, 406, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Loan Card Header Admin', f1, 304, 550, 420, 20, { characters: 'Permohonan Peminjaman Menunggu Approval Admin', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });

  const adminLoans = [
    { name: 'Budi Santoso, M.Kom (Dosen TI)', item: '2x Proyektor Epson & Laser Pointer', time: '17 Nov 2026 (08:00 - 14:00)', y: 580 },
    { name: 'Siti Rahmawati (Ketua BEM Univ)', item: 'Gedung Aula Utama & Sound System Yamaha', time: '19-20 Nov 2026 (2 Hari Penuh)', y: 686 },
    { name: 'Dimas Arya (Himpunan Elektro)', item: '5x Solder Station & 2x Multimeter Fluke', time: '18 Nov 2026 (09:00 - 16:00)', y: 792 }
  ];
  adminLoans.forEach((l, i) => {
    addNode('rectangle', `Loan Row Box Admin ${i}`, f1, 304, l.y, 652, 92, { fill: '#F8FAFC', cornerRadius: 12, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `Loan Name Admin ${i}`, f1, 320, l.y + 12, 360, 18, { characters: l.name, fill: '#0F172A', fontSize: 12, fontStyle: 'Bold' });
    addNode('text', `Loan Item Admin ${i}`, f1, 320, l.y + 32, 360, 16, { characters: `Sarana: ${l.item}`, fill: C.brandBlue, fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `Loan Time Admin ${i}`, f1, 320, l.y + 52, 360, 16, { characters: `Jadwal: ${l.time}`, fill: '#64748B', fontSize: 10 });
    addNode('rectangle', `Btn Tolak Admin ${i}`, f1, 736, l.y + 28, 86, 36, { fill: C.errorBg, cornerRadius: 8 });
    addNode('text', `Text Tolak Admin ${i}`, f1, 736, l.y + 38, 86, 16, { characters: 'Tolak', fill: C.errorText, fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });
    addNode('rectangle', `Btn Setuju Admin ${i}`, f1, 830, l.y + 28, 110, 36, { fill: C.brandBlue, cornerRadius: 8 });
    addNode('text', `Text Setuju Admin ${i}`, f1, 830, l.y + 38, 110, 16, { characters: 'Setujui (SPK)', fill: '#FFFFFF', fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });
  });

  addNode('rectangle', 'Kanban Card Admin', f1, 1000, 534, 420, 406, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Kanban Card Header Admin', f1, 1020, 550, 380, 20, { characters: 'Kanban Pemeliharaan & Audit Trail', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });

  const adminKanban = [
    { code: 'TKT-012', name: 'AC Daikin R. Seminar', tech: 'Teknisi: Joko S.', status: 'Pengerjaan (75%)', cost: 'Rp 850.000', y: 580 },
    { code: 'TKT-014', name: 'PC Lab Multimedia 04', tech: 'Teknisi: Vendor Asus', status: 'Tunggu Sparepart', cost: 'Garansi Rp 0', y: 664 }
  ];
  adminKanban.forEach((t, i) => {
    addNode('rectangle', `KB Box Admin ${i}`, f1, 1020, t.y, 380, 72, { fill: '#F8FAFC', cornerRadius: 10, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `KB Code Admin ${i}`, f1, 1034, t.y + 10, 100, 16, { characters: t.code, fill: C.brandBlue, fontSize: 10, fontStyle: 'Bold' });
    addNode('text', `KB Status Admin ${i}`, f1, 1260, t.y + 10, 126, 16, { characters: t.status, fill: '#B45309', fontSize: 10, fontStyle: 'Bold', textAlign: 'right' });
    addNode('text', `KB Name Admin ${i}`, f1, 1034, t.y + 26, 260, 18, { characters: t.name, fill: '#0F172A', fontSize: 12, fontStyle: 'Bold' });
    addNode('text', `KB Tech Admin ${i}`, f1, 1034, t.y + 46, 200, 16, { characters: t.tech, fill: '#64748B', fontSize: 10 });
    addNode('text', `KB Cost Admin ${i}`, f1, 1260, t.y + 46, 126, 16, { characters: t.cost, fill: '#0F172A', fontSize: 11, fontStyle: 'Bold', textAlign: 'right' });
  });

  addNode('text', 'Audit Title Admin', f1, 1020, 750, 300, 18, { characters: 'Live Audit Log (Sistem Keamanan):', fill: '#0F172A', fontSize: 11, fontStyle: 'Bold' });
  const auditLogs = [
    '• 10:45: Bambang (Admin) menyetujui pinjaman #PINJ-088',
    '• 09:20: Joko (Petugas) verifikasi pengembalian proyektor',
    '• 08:15: Dr. Hendro (Pimpinan) mengesahkan laporan Q3',
    '• 07:50: Budi (Peminjam) mengajukan izin Ruang Seminar 2',
    '• 07:30: Sistem sinkronisasi BAST mutasi sarana selesai'
  ];
  auditLogs.forEach((a, i) => {
    addNode('text', `Audit Row Admin ${i}`, f1, 1020, 772 + i * 22, 380, 20, { characters: a, fill: '#475569', fontSize: 10 });
  });
}

// 2. PETUGAS SARPRAS DASHBOARD
function buildDashboardPetugas() {
  const f2 = addNode('frame', '[M3] SIMAS - Dashboard Petugas Sarpras', null, 1540, 0, 1440, 960, { fill: C.surface, clip: true });
  createFullSidebar(f2, 'petugas', 'Petugas Sarpras', 'Teknisi', 'dashboard');
  createTopBar(f2, 'petugas', 'Dashboard Operasional Petugas & Teknisi', 'Inspeksi Sarana • Verifikasi Pengembalian Fisik • Eksekusi Servis Kanban', 'Joko Supriyanto', 'Petugas Sarpras');
  
  // Banner
  addNode('rectangle', 'Banner Petugas', f2, 280, 86, 1140, 68, { fill: '#ECFDF5', cornerRadius: 14, stroke: '#A7F3D0', strokeWeight: 1 });
  addNode('text', 'Banner Petugas Title', f2, 302, 98, 740, 22, { characters: 'Halo, Joko Supriyanto, A.Md! (Teknisi Sarpras)', fill: '#064E3B', fontSize: 16, fontStyle: 'Bold' });
  addNode('text', 'Banner Petugas Sub', f2, 302, 122, 740, 18, { characters: 'Wewenang Petugas: Cek fisik aset, verifikasi barang kembali, update Kanban & nota perbaikan. (Dilarang menghapus aset).', fill: '#047857', fontSize: 11 });
  addNode('rectangle', 'Btn Action Petugas', f2, 1190, 98, 212, 42, { fill: '#059669', cornerRadius: 10 });
  addNode('text', 'Btn Action Text Petugas', f2, 1190, 110, 212, 20, { characters: '+ Catat Kerusakan Baru', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });

  // 4 Symmetrical KPI Cards
  const kpisPetugas = [
    { title: 'Tugas Servis Saya', val: '4 Tiket', sub: '2 Prioritas Mendesak', badge: 'Kerjakan Segera', bg: C.warningBg, tc: C.warningText, icon: VP.wrench },
    { title: 'Cek Barang Kembali', val: '3 Item', sub: 'Cek Fisik Sarana', badge: 'Perlu Verifikasi', bg: C.errorBg, tc: C.errorText, icon: VP.clipboard },
    { title: 'Aset Butuh Servis', val: '8 Unit', sub: 'AC, Proyektor & Lab', badge: 'Antrean Bengkel', bg: C.infoBg, tc: C.infoText, icon: VP.package },
    { title: 'Suku Cadang Terpakai', val: 'Rp 1.450.000', sub: 'Nota Terverifikasi', badge: 'Klaim APBN', bg: C.purpleBg, tc: C.purpleText, icon: VP.money }
  ];
  renderKpiCards(f2, kpisPetugas);

  // Middle Section: Chart Servis Mingguan & Rasio Fisik
  addNode('rectangle', 'Chart Box Petugas', f2, 280, 282, 700, 240, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Chart Title Petugas', f2, 304, 298, 280, 20, { characters: 'Penyelesaian Tiket Servis (7 Hari)', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  addNode('text', 'Chart Sub Petugas', f2, 304, 318, 280, 16, { characters: 'Target kerja vs realisasi selesai (Joko Supriyanto)', fill: '#64748B', fontSize: 10 });
  
  // Header Legend & Badge
  addNode('rectangle', 'Leg T Dot Petugas', f2, 600, 304, 10, 10, { fill: '#CBD5E1', cornerRadius: 3 });
  addNode('text', 'Leg T Text Petugas', f2, 614, 301, 75, 16, { characters: 'Target Kerja', fill: '#64748B', fontSize: 10 });
  addNode('rectangle', 'Leg S Dot Petugas', f2, 695, 304, 10, 10, { fill: '#059669', cornerRadius: 3 });
  addNode('text', 'Leg S Text Petugas', f2, 709, 301, 80, 16, { characters: 'Selesai Servis', fill: '#059669', fontSize: 10, fontStyle: 'Bold' });
  addNode('rectangle', 'Chart Badge Petugas', f2, 805, 296, 155, 24, { fill: C.successBg, cornerRadius: 6 });
  addNode('text', 'Chart Badge Text Petugas', f2, 805, 300, 155, 16, { characters: '91.6% Tepat Waktu', fill: C.successText, fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });

  // Symmetrical Bars
  const techDays = [
    { day: 'Sen', hT: 90, hS: 90 },
    { day: 'Sel', hT: 110, hS: 110 },
    { day: 'Rab', hT: 70, hS: 70 },
    { day: 'Kam', hT: 130, hS: 110 },
    { day: 'Jum', hT: 90, hS: 90 },
    { day: 'Sab', hT: 45, hS: 45 },
    { day: 'Min', hT: 25, hS: 25 }
  ];
  [360, 400, 440, 480].forEach(gy => {
    addNode('rectangle', `Grid Line Petugas ${gy}`, f2, 304, gy, 650, 1, { fill: '#F1F5F9' });
  });
  const startPlotX = 315;
  const colW = 88;
  techDays.forEach((d, i) => {
    const cx = startPlotX + i * colW;
    addNode('rectangle', `Bar T Petugas ${i}`, f2, cx + 20, 480 - d.hT, 18, d.hT, { fill: '#CBD5E1', cornerRadius: 4 });
    addNode('rectangle', `Bar S Petugas ${i}`, f2, cx + 42, 480 - d.hS, 18, d.hS, { fill: '#059669', cornerRadius: 4 });
    addNode('text', `Day Petugas ${i}`, f2, cx, 488, 80, 16, { characters: d.day, fill: '#64748B', fontSize: 10, textAlign: 'center' });
  });

  // Right: Rasio Fisik (w: 420)
  addNode('rectangle', 'Health Box Petugas', f2, 1000, 282, 420, 240, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Health Title Petugas', f2, 1020, 298, 380, 20, { characters: 'Rasio Kondisi Fisik 1.248 Sarana Kampus', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  addNode('text', 'Health Sub Petugas', f2, 1020, 318, 380, 16, { characters: 'Hasil inspeksi berkala sarpras semester ganjil', fill: '#64748B', fontSize: 10 });

  const healthData = [
    { name: 'Kondisi Baik (Siap Pakai)', val: '1.176 Unit (94.2%)', w: 360, color: '#059669', y: 346 },
    { name: 'Rusak Ringan (Antrean Servis)', val: '56 Unit (4.5%)', w: 90, color: '#D97706', y: 400 },
    { name: 'Rusak Berat (Usul Hapus)', val: '16 Unit (1.3%)', w: 30, color: '#DC2626', y: 454 }
  ];
  healthData.forEach((h, i) => {
    addNode('text', `H Name ${i}`, f2, 1020, h.y, 220, 16, { characters: h.name, fill: '#0F172A', fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `H Val ${i}`, f2, 1250, h.y, 150, 16, { characters: h.val, fill: '#64748B', fontSize: 10, textAlign: 'right' });
    addNode('rectangle', `H Bar Bg ${i}`, f2, 1020, h.y + 18, 380, 10, { fill: '#F1F5F9', cornerRadius: 5 });
    addNode('rectangle', `H Bar Fill ${i}`, f2, 1020, h.y + 18, h.w, 10, { fill: h.color, cornerRadius: 5 });
  });

  // Bottom: Meja Return & Tugas Joko (w: 700 & 420)
  addNode('rectangle', 'Return Desk Petugas', f2, 280, 534, 700, 406, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Return Title Petugas', f2, 304, 550, 420, 20, { characters: 'Meja Verifikasi Pengembalian Sarana (Check-In Desk)', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });

  const returnItems = [
    { peminjam: 'Budi Santoso (Dosen TI)', item: 'Proyektor Epson EB-X500', cond: 'Kabel lengkap, lensa bersih', y: 580, status: 'Siap Verifikasi' },
    { peminjam: 'Siti Rahma (Ketua BEM)', item: '2x Mic Wireless Shure & Kabel XLR', cond: 'Baterai habis, fisik utuh', y: 686, status: 'Siap Verifikasi' },
    { peminjam: 'Dimas Arya (Mhs Elektro)', item: 'Kamera Sony A6400 Kit & Tripod', cond: 'Tutup lensa tertinggal di Lab', y: 792, status: 'Perlu Catatan' }
  ];
  returnItems.forEach((r, i) => {
    addNode('rectangle', `Return Row Petugas ${i}`, f2, 304, r.y, 652, 92, { fill: '#F8FAFC', cornerRadius: 12, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `Return Name Petugas ${i}`, f2, 320, r.y + 12, 340, 18, { characters: r.peminjam, fill: '#0F172A', fontSize: 12, fontStyle: 'Bold' });
    addNode('text', `Return Item Petugas ${i}`, f2, 320, r.y + 32, 340, 16, { characters: `Barang: ${r.item}`, fill: '#059669', fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `Return Cond Petugas ${i}`, f2, 320, r.y + 52, 340, 16, { characters: `Catatan Fisik: ${r.cond}`, fill: '#64748B', fontSize: 10 });
    
    if (r.status === 'Siap Verifikasi') {
      addNode('rectangle', `Btn Ret Petugas ${i}`, f2, 720, r.y + 28, 220, 36, { fill: '#059669', cornerRadius: 8 });
      addNode('text', `Text Ret Petugas ${i}`, f2, 720, r.y + 38, 220, 16, { characters: 'Konfirmasi Kembali (Layak)', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });
    } else {
      addNode('rectangle', `Btn Note Petugas ${i}`, f2, 720, r.y + 28, 220, 36, { fill: C.warningBg, cornerRadius: 8 });
      addNode('text', `Text Note Petugas ${i}`, f2, 720, r.y + 38, 220, 16, { characters: 'Catat Kelengkapan Hilang', fill: C.warningText, fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });
    }
  });

  addNode('rectangle', 'Tech Tickets Petugas', f2, 1000, 534, 420, 406, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Tech Title Petugas', f2, 1020, 550, 380, 20, { characters: 'Tiket Perbaikan Ditugaskan Ke Anda', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });

  const myTasks = [
    { code: 'TKT-012', title: 'AC Daikin Ruang Seminar', prog: '75%', desc: 'Ganti kapasitor blower & freon R32', btn: 'Update 100%', y: 580 },
    { code: 'TKT-017', title: 'Proyektor BenQ Lab TI 02', prog: '20%', desc: 'Lampu mati saat kuliah umum', btn: 'Nota Part', y: 674 }
  ];
  myTasks.forEach((m, i) => {
    addNode('rectangle', `Task Box Petugas ${i}`, f2, 1020, m.y, 380, 82, { fill: '#F8FAFC', cornerRadius: 10, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `Task Code Petugas ${i}`, f2, 1034, m.y + 8, 120, 16, { characters: m.code, fill: '#059669', fontSize: 10, fontStyle: 'Bold' });
    addNode('text', `Task Prog Petugas ${i}`, f2, 1270, m.y + 8, 116, 16, { characters: `Progres: ${m.prog}`, fill: '#0F172A', fontSize: 10, fontStyle: 'Bold', textAlign: 'right' });
    addNode('text', `Task Title Petugas ${i}`, f2, 1034, m.y + 26, 250, 18, { characters: m.title, fill: '#0F172A', fontSize: 12, fontStyle: 'Bold' });
    addNode('text', `Task Desc Petugas ${i}`, f2, 1034, m.y + 44, 250, 16, { characters: m.desc, fill: '#64748B', fontSize: 10 });
    addNode('rectangle', `Btn Task Petugas ${i}`, f2, 1286, m.y + 36, 100, 28, { fill: C.brandBlue, cornerRadius: 6 });
    addNode('text', `Text Task Petugas ${i}`, f2, 1286, m.y + 42, 100, 16, { characters: m.btn, fill: '#FFFFFF', fontSize: 9, fontStyle: 'Bold', textAlign: 'center' });
  });

  addNode('rectangle', 'Notice Petugas', f2, 1020, 770, 380, 150, { fill: '#FEF2F2', cornerRadius: 12, stroke: '#FCA5A5', strokeWeight: 1 });
  addNode('text', 'Notice Petugas Title', f2, 1036, 784, 350, 18, { characters: 'Batasan Wewenang (RBAC Petugas):', fill: '#991B1B', fontSize: 11, fontStyle: 'Bold' });
  addNode('text', 'Notice Petugas Content', f2, 1036, 808, 350, 100, {
    characters: '• Petugas TIDAK DIIZINKAN menghapus master aset dari database sistem.\n• Petugas TIDAK MEMILIKI tombol Approve pinjaman sarana (wewenang Pimpinan/Admin).\n• Hasil verifikasi kondisi fisik barang otomatis tersimpan ke kartu mutasi dan log peminjaman.',
    fill: '#B91C1C',
    fontSize: 10
  });
}

// 3. PIMPINAN INSTITUSI DASHBOARD
function buildDashboardPimpinan() {
  const f3 = addNode('frame', '[M3] SIMAS - Dashboard Pimpinan Institusi', null, 3080, 0, 1440, 960, { fill: C.surface, clip: true });
  createFullSidebar(f3, 'pimpinan', 'Pimpinan Institusi', 'Eksekutif', 'dashboard');
  createTopBar(f3, 'pimpinan', 'Dashboard Eksekutif & Otorisasi Pimpinan', 'Valuasi Aset • Persetujuan Fasilitas Strategis • Pengesahan Laporan', 'Dr. Ir. Hendro Wicaksono', 'Pimpinan Institusi');

  // Banner
  addNode('rectangle', 'Banner Pimpinan', f3, 280, 86, 1140, 68, { fill: '#FAF5FF', cornerRadius: 14, stroke: '#E9D5FF', strokeWeight: 1 });
  addNode('text', 'Banner Pimpinan Title', f3, 302, 98, 740, 22, { characters: 'Selamat Pagi, Dr. Ir. Hendro Wicaksono, M.T. (Wakil Rektor II)', fill: '#581C87', fontSize: 16, fontStyle: 'Bold' });
  addNode('text', 'Banner Pimpinan Sub', f3, 302, 122, 740, 18, { characters: 'Otorisasi Eksekutif: Memantau nilai & okupansi sarpras, menyetujui peminjaman strategis, & mengesahkan laporan audit.', fill: '#7E22CE', fontSize: 11 });
  addNode('rectangle', 'Btn Action Pimpinan', f3, 1190, 98, 212, 42, { fill: '#7E22CE', cornerRadius: 10 });
  addNode('text', 'Btn Action Text Pimpinan', f3, 1190, 110, 212, 20, { characters: 'Pengesahan Dokumen (2)', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });

  // 4 Symmetrical KPI Cards
  const kpisPimpinan = [
    { title: 'Total Valuasi Aset', val: 'Rp 4,85 Miliar', sub: '1.248 Unit Tercatat', badge: 'Audit BPK Clean', bg: C.successBg, tc: C.successText, icon: VP.building },
    { title: 'Rasio Keterpakaian', val: '78.5%', sub: 'Pemanfaatan Ruang', badge: 'Efisiensi Tinggi', bg: C.infoBg, tc: C.infoText, icon: VP.star },
    { title: 'Otorisasi Pinjam', val: '3 Permohonan', sub: 'Aula & Bus Kampus', badge: 'Perlu SK Pimpinan', bg: C.warningBg, tc: C.warningText, icon: VP.clipboard },
    { title: 'Serapan Biaya Servis', val: 'Rp 18.450.000', sub: 'Pagu Rp 35.000.000', badge: 'Serapan 52.7%', bg: C.purpleBg, tc: C.purpleText, icon: VP.money }
  ];
  renderKpiCards(f3, kpisPimpinan);

  // Middle Section: Grafik Serapan Anggaran & Distribusi Nilai Aset
  addNode('rectangle', 'Chart Box Pimpinan', f3, 280, 282, 700, 240, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Chart Title Pimpinan', f3, 304, 298, 420, 20, { characters: 'Grafik Serapan Anggaran Pemeliharaan Sarpras (2026)', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  addNode('text', 'Chart Sub Pimpinan', f3, 304, 318, 420, 16, { characters: 'Perbandingan Pagu Anggaran vs Realisasi Pengeluaran per Kuartal', fill: '#64748B', fontSize: 10 });

  // Header Legend in Chart
  addNode('rectangle', 'Leg Pagu Dot Pimpinan', f3, 750, 304, 10, 10, { fill: '#CBD5E1', cornerRadius: 3 });
  addNode('text', 'Leg Pagu Text Pimpinan', f3, 764, 301, 70, 16, { characters: 'Pagu Alokasi', fill: '#64748B', fontSize: 10 });
  addNode('rectangle', 'Leg Real Dot Pimpinan', f3, 846, 304, 10, 10, { fill: '#7E22CE', cornerRadius: 3 });
  addNode('text', 'Leg Real Text Pimpinan', f3, 860, 301, 100, 16, { characters: 'Realisasi Terserap', fill: '#7E22CE', fontSize: 10, fontStyle: 'Bold' });

  // 4 Symmetrical Quarters across 620px
  const quarters = [
    { q: 'Q1 (Jan-Mar)', hP: 120, hR: 110, pct: '91%' },
    { q: 'Q2 (Apr-Jun)', hP: 120, hR: 114, pct: '95%' },
    { q: 'Q3 (Jul-Sep)', hP: 130, hR: 121, pct: '93%' },
    { q: 'Q4 (Okt-Des)', hP: 130, hR: 36, pct: '27%' }
  ];
  [360, 400, 440, 480].forEach(gy => {
    addNode('rectangle', `Grid Line Pimpinan ${gy}`, f3, 304, gy, 650, 1, { fill: '#F1F5F9' });
  });
  const qStart = 330;
  const qGap = 155;
  quarters.forEach((q, i) => {
    const qx = qStart + i * qGap;
    addNode('rectangle', `Bar P Pimpinan ${i}`, f3, qx + 10, 480 - q.hP, 34, q.hP, { fill: '#CBD5E1', cornerRadius: 4 });
    addNode('rectangle', `Bar R Pimpinan ${i}`, f3, qx + 48, 480 - q.hR, 34, q.hR, { fill: '#7E22CE', cornerRadius: 4 });
    addNode('text', `Q Label Pimpinan ${i}`, f3, qx, 488, 92, 16, { characters: q.q, fill: '#0F172A', fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });
    addNode('text', `Q Pct Pimpinan ${i}`, f3, qx + 48, 480 - q.hR - 16, 34, 14, { characters: q.pct, fill: '#7E22CE', fontSize: 9, fontStyle: 'Bold', textAlign: 'center' });
  });

  // Right: Distribusi Nilai Aset (w: 420)
  addNode('rectangle', 'Stat Desk Pimpinan', f3, 1000, 282, 420, 240, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Stat Title Pimpinan', f3, 1020, 298, 380, 20, { characters: 'Distribusi Nilai Aset per Fakultas', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  addNode('text', 'Stat Sub Pimpinan', f3, 1020, 318, 380, 16, { characters: 'Total Aset Tercatat: Rp 4.850.000.000', fill: '#64748B', fontSize: 10 });

  const faculties = [
    { name: 'Fakultas Teknik', pct: '42%', val: 'Rp 2,03 M', barW: 260, color: '#1342B8', y: 346 },
    { name: 'Fakultas MIPA & Kedokteran', pct: '28%', val: 'Rp 1,35 M', barW: 180, color: '#059669', y: 390 },
    { name: 'Fakultas Ilmu Komputer', pct: '18%', val: 'Rp 873 Jt', barW: 115, color: '#7E22CE', y: 434 },
    { name: 'Gedung Rektorat & Umum', pct: '12%', val: 'Rp 582 Jt', barW: 75, color: '#D97706', y: 478 }
  ];
  faculties.forEach((f, i) => {
    addNode('text', `Fac Name Pimpinan ${i}`, f3, 1020, f.y, 220, 16, { characters: f.name, fill: '#0F172A', fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `Fac Val Pimpinan ${i}`, f3, 1260, f.y, 140, 16, { characters: `${f.pct} (${f.val})`, fill: '#64748B', fontSize: 10, textAlign: 'right' });
    addNode('rectangle', `Bar Bg Pimpinan ${i}`, f3, 1020, f.y + 18, 380, 8, { fill: '#E2E8F0', cornerRadius: 4 });
    addNode('rectangle', `Bar Fill Pimpinan ${i}`, f3, 1020, f.y + 18, f.barW, 8, { fill: f.color, cornerRadius: 4 });
  });

  // Bottom: Meja Otorisasi & Sign (w: 700 & 420)
  addNode('rectangle', 'Approval Desk Pimpinan', f3, 280, 534, 700, 406, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Approval Title Pimpinan', f3, 304, 550, 420, 20, { characters: 'Otorisasi Peminjaman Fasilitas Strategis Kampus', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });

  const leaderApprovals = [
    { org: 'Badan Eksekutif Mahasiswa (BEM Univ)', event: 'Seminar Nasional Kebangsaan 2026', facility: 'Aula Utama & Sound (800 Org)', date: '19 - 20 Nov 2026', y: 580 },
    { org: 'Himpunan Mahasiswa Mesin', event: 'Kunjungan Studi Industri Karawang', facility: 'Bus Kampus Isuzu Elf 28-Seat', date: '24 Nov 2026', y: 686 },
    { org: 'Lembaga Penelitian (LPPM)', event: 'Lokakarya Publikasi Riset Scopus', facility: 'Ruang Senat Lt. 3 & Smart Display', date: '22 Nov 2026', y: 792 }
  ];
  leaderApprovals.forEach((a, i) => {
    addNode('rectangle', `Appr Box Pimpinan ${i}`, f3, 304, a.y, 652, 92, { fill: '#F8FAFC', cornerRadius: 12, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `Appr Org Pimpinan ${i}`, f3, 320, a.y + 12, 380, 18, { characters: a.org, fill: '#581C87', fontSize: 12, fontStyle: 'Bold' });
    addNode('text', `Appr Event Pimpinan ${i}`, f3, 320, a.y + 32, 380, 16, { characters: `Acara: ${a.event}`, fill: '#0F172A', fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `Appr Facil Pimpinan ${i}`, f3, 320, a.y + 52, 380, 16, { characters: `Fasilitas: ${a.facility} • ${a.date}`, fill: '#64748B', fontSize: 10 });
    addNode('rectangle', `Btn Tolak Pimpinan ${i}`, f3, 736, a.y + 28, 86, 36, { fill: C.errorBg, cornerRadius: 8 });
    addNode('text', `Text Tolak Pimpinan ${i}`, f3, 736, a.y + 38, 86, 16, { characters: 'Tolak', fill: C.errorText, fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });
    addNode('rectangle', `Btn Setuju Pimpinan ${i}`, f3, 830, a.y + 28, 110, 36, { fill: '#7E22CE', cornerRadius: 8 });
    addNode('text', `Text Setuju Pimpinan ${i}`, f3, 830, a.y + 38, 110, 16, { characters: 'Setujui (SK)', fill: '#FFFFFF', fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });
  });

  // Right: Symmetrical Document Signing Desk (w: 420, h: 406)
  addNode('rectangle', 'Sign Desk Pimpinan', f3, 1000, 534, 420, 406, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Sign Title Pimpinan', f3, 1020, 550, 380, 20, { characters: 'Pengesahan Dokumen Audit Sarpras', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  
  // Pending Document Card
  addNode('rectangle', 'Sign Doc Box Pimpinan', f3, 1020, 580, 380, 140, { fill: '#FAF5FF', cornerRadius: 12, stroke: '#E9D5FF', strokeWeight: 1 });
  addNode('text', 'Sign Doc Title Pimpinan', f3, 1036, 594, 348, 18, { characters: 'Dokumen Menunggu Pengesahan:', fill: '#581C87', fontSize: 11, fontStyle: 'Bold' });
  addNode('text', 'Sign Doc Name Pimpinan', f3, 1036, 616, 348, 36, { characters: 'Laporan Rekapitulasi Audit Fisik Sarpras Q3-2026.pdf (Terverifikasi BPK & SPI)', fill: '#0F172A', fontSize: 11 });
  addNode('rectangle', 'Btn Sign Pimpinan', f3, 1036, 664, 348, 42, { fill: '#7E22CE', cornerRadius: 8 });
  addNode('text', 'Text Sign Pimpinan', f3, 1036, 676, 348, 18, { characters: 'Sahkan Dokumen (Tanda Tangan Digital)', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });
  
  // Recently Approved Archive Card (fills the previous 140px void!)
  addNode('rectangle', 'Sign Arch Box Pimpinan', f3, 1020, 734, 380, 134, { fill: '#F8FAFC', cornerRadius: 12, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Sign Arch Title Pimpinan', f3, 1036, 746, 348, 18, { characters: 'Arsip Dokumen Tersahkan Bulan Ini:', fill: '#0F172A', fontSize: 11, fontStyle: 'Bold' });
  addNode('text', 'Sign Arch 1', f3, 1036, 770, 348, 16, { characters: '✓ STTA-2026-088: Serah Terima Bus Kampus (16 Nov)', fill: '#15803D', fontSize: 10 });
  addNode('text', 'Sign Arch 2', f3, 1036, 792, 348, 16, { characters: '✓ BAST-Q2-2026: Rekapitulasi Fisik MIPA (12 Nov)', fill: '#15803D', fontSize: 10 });
  addNode('text', 'Sign Arch 3', f3, 1036, 814, 348, 16, { characters: '✓ SK-AULA-041: Izin Graha Mahasiswa Dies Natalis', fill: '#15803D', fontSize: 10 });
  addNode('text', 'Sign Arch 4', f3, 1036, 836, 348, 16, { characters: '✓ BAST-TI-019: Hibah 40 Unit PC VR Asus Lab TI', fill: '#15803D', fontSize: 10 });

  addNode('text', 'Sign Note Pimpinan', f3, 1020, 882, 380, 36, { characters: 'Tervalidasi Tanda Tangan Digital BSrE BSSN • Keaslian dokumen terjamin.', fill: '#64748B', fontSize: 10, textAlign: 'center' });
}

// 4. PEMINJAM MANDIRI DASHBOARD
function buildDashboardPeminjam() {
  const f4 = addNode('frame', '[M3] SIMAS - Dashboard Peminjam Mandiri', null, 4620, 0, 1440, 960, { fill: C.surface, clip: true });
  createFullSidebar(f4, 'peminjam', 'Peminjam Sarana', 'Mandiri', 'dashboard');
  createTopBar(f4, 'peminjam', 'Portal Layanan Mandiri Peminjaman Sarpras', 'Peminjaman Mandiri • Cek Ruang Kosong • Katalog Alat Tersedia', 'Budi Santoso', 'Peminjam (Dosen TI)');

  // Banner
  addNode('rectangle', 'Banner Peminjam', f4, 280, 86, 1140, 68, { fill: '#EFF6FF', cornerRadius: 14, stroke: '#BFDBFE', strokeWeight: 1 });
  addNode('text', 'Banner Peminjam Title', f4, 302, 98, 740, 22, { characters: 'Selamat Datang di Portal Mandiri, Pak Budi Santoso!', fill: '#1E3A8A', fontSize: 16, fontStyle: 'Bold' });
  addNode('text', 'Banner Peminjam Sub', f4, 302, 122, 740, 18, { characters: 'Layanan Mandiri: Ajukan pinjaman sarana perkuliahan & booking ruangan kosong tanpa birokrasi rumit.', fill: '#2563EB', fontSize: 11 });
  addNode('rectangle', 'Btn Action Peminjam', f4, 1190, 98, 212, 42, { fill: C.brandBlue, cornerRadius: 10 });
  addNode('text', 'Btn Action Text Peminjam', f4, 1190, 110, 212, 20, { characters: '+ Ajukan Peminjaman Baru', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });

  // 4 Symmetrical KPI Cards
  const kpisPeminjam = [
    { title: 'Sarana Aktif Dipinjam', val: '2 Sarana', sub: 'Proyektor & Kabel Roll', badge: 'Sedang Digunakan', bg: C.infoBg, tc: C.infoText, icon: VP.package },
    { title: 'Dalam Proses Review', val: '1 Pengajuan', sub: 'Surat Izin Lab', badge: 'Menunggu Review', bg: C.warningBg, tc: C.warningText, icon: VP.clock },
    { title: 'Tenggat Kembali', val: 'Besok 17:00', sub: 'Gedung Rektorat Lt. 1', badge: 'Jangan Terlambat', bg: C.errorBg, tc: C.errorText, icon: VP.calendar },
    { title: 'Skor Kepatuhan Saya', val: '100% Sempurna', sub: '18x Pinjam Tertib', badge: 'Pemohon Terpercaya', bg: C.successBg, tc: C.successText, icon: VP.star }
  ];
  renderKpiCards(f4, kpisPeminjam);

  // Middle Section: Grafik Histori Peminjaman & Live Tracking
  addNode('rectangle', 'Chart Box Peminjam', f4, 280, 282, 700, 240, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Chart Title Peminjam', f4, 304, 298, 420, 20, { characters: 'Grafik Frekuensi Peminjaman Mandiri Saya (6 Bulan Terakhir)', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  addNode('text', 'Chart Sub Peminjam', f4, 304, 318, 420, 16, { characters: 'Aktivitas pengajuan sarana untuk perkuliahan & riset laboratorium', fill: '#64748B', fontSize: 10 });
  addNode('rectangle', 'Chart Badge Peminjam', f4, 850, 296, 110, 24, { fill: C.successBg, cornerRadius: 6 });
  addNode('text', 'Chart Badge Text Peminjam', f4, 850, 300, 110, 16, { characters: 'Skor Tertib: 100%', fill: C.successText, fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });

  // Symmetrical 6 Months across 600px
  const months = [
    { m: 'Juni', count: '3 Pinjam', h: 60 },
    { m: 'Juli', count: '2 Pinjam', h: 40 },
    { m: 'Agustus', count: '4 Pinjam', h: 80 },
    { m: 'September', count: '3 Pinjam', h: 60 },
    { m: 'Oktober', count: '5 Pinjam', h: 100 },
    { m: 'November', count: '2 Aktif', h: 45 }
  ];
  [360, 400, 440, 480].forEach(gy => {
    addNode('rectangle', `Grid Line Peminjam ${gy}`, f4, 304, gy, 650, 1, { fill: '#F1F5F9' });
  });
  const mStart = 330;
  const mGap = 98;
  months.forEach((mn, i) => {
    const mx = mStart + i * mGap;
    addNode('rectangle', `Bar Month Peminjam ${i}`, f4, mx + 16, 480 - mn.h, 44, mn.h, { fill: (i === 5) ? C.brandBlue : '#93C5FD', cornerRadius: 6 });
    addNode('text', `Month Label ${i}`, f4, mx, 488, 76, 16, { characters: mn.m, fill: '#0F172A', fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });
    addNode('text', `Month Val ${i}`, f4, mx, 480 - mn.h - 16, 76, 14, { characters: mn.count, fill: C.brandBlue, fontSize: 9, fontStyle: 'Bold', textAlign: 'center' });
  });

  // Right: Live Tracking with Connecting Stepper Track (w: 420)
  addNode('rectangle', 'Tracking Desk Peminjam', f4, 1000, 282, 420, 240, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Tracking Title Peminjam', f4, 1020, 298, 380, 20, { characters: 'Live Tracking: Pengajuan #PINJ-2026-089', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  addNode('text', 'Tracking Sub Peminjam', f4, 1020, 318, 380, 16, { characters: 'Workshop AI • Ruang Seminar Utama • 17-18 Nov 2026', fill: '#64748B', fontSize: 10 });

  // Symmetrical Connecting Line for Stepper
  addNode('rectangle', 'Stepper Line Track', f4, 1045, 371, 230, 4, { fill: '#E2E8F0', cornerRadius: 2 });
  addNode('rectangle', 'Stepper Line Active', f4, 1045, 371, 150, 4, { fill: '#059669', cornerRadius: 2 });

  const pSteps = [
    { no: '1', label: 'Diajukan', state: 'done', x: 1030 },
    { no: '2', label: 'Cek Stok', state: 'done', x: 1107 },
    { no: '3', label: 'Review SK', state: 'active', x: 1184 },
    { no: '4', label: 'Ambil', state: 'pending', x: 1261 }
  ];
  pSteps.forEach(s => {
    addNode('ellipse', `PS Ellipse ${s.no}`, f4, s.x, 356, 32, 32, { fill: (s.state === 'done') ? '#059669' : (s.state === 'active' ? '#D97706' : '#CBD5E1') });
    addNode('text', `PS Mark ${s.no}`, f4, s.x, 364, 32, 16, { characters: (s.state === 'done') ? '✓' : (s.state === 'active' ? '••' : s.no), fill: '#FFFFFF', fontSize: 12, fontStyle: 'Bold', textAlign: 'center' });
    addNode('text', `PS Label ${s.no}`, f4, s.x - 16, 396, 64, 16, { characters: s.label, fill: (s.state === 'active') ? '#B45309' : '#0F172A', fontSize: 9, fontStyle: 'Bold', textAlign: 'center' });
  });

  addNode('rectangle', 'Tracking Alert Peminjam', f4, 1020, 436, 380, 70, { fill: '#FAF5FF', cornerRadius: 10, stroke: '#E9D5FF', strokeWeight: 1 });
  addNode('text', 'Tracking Alert Text Peminjam', f4, 1034, 448, 352, 50, {
    characters: 'Status Terkini: Permohonan telah lolos verifikasi stok dan saat ini sedang menunggu persetujuan Dekan / Pimpinan Institusi.',
    fill: '#7E22CE',
    fontSize: 10
  });

  // Bottom: Barang Dipinjam (Left) & Katalog Cepat (Right)
  addNode('rectangle', 'My Loan Desk Peminjam', f4, 280, 534, 700, 406, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'My Loan Title Peminjam', f4, 304, 550, 420, 20, { characters: 'Sarana yang Sedang Saya Pinjam Saat Ini', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });

  const activeBorrowed = [
    { name: 'Proyektor Epson EB-X500 (3600 Lumens)', code: 'AST-TI-2024-002', loc: 'Ruang Seminar 2 • Kuliah Kecerdasan Buatan', due: 'Tenggat: 17 Nov 2026, 17:00 WIB (Sisa 24 Jam)', y: 580 },
    { name: '1x Wireless Pointer Logitech R400 + Baterai', code: 'AST-TI-2024-009', loc: 'Paket bersama Proyektor Epson', due: 'Tenggat: 17 Nov 2026, 17:00 WIB', y: 694 }
  ];
  activeBorrowed.forEach((b, i) => {
    addNode('rectangle', `Borrow Box Peminjam ${i}`, f4, 304, b.y, 652, 102, { fill: '#F8FAFC', cornerRadius: 12, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `Borrow Name Peminjam ${i}`, f4, 320, b.y + 12, 380, 18, { characters: b.name, fill: '#0F172A', fontSize: 12, fontStyle: 'Bold' });
    addNode('text', `Borrow Code Peminjam ${i}`, f4, 320, b.y + 32, 380, 16, { characters: `Kode Aset: ${b.code}`, fill: C.brandBlue, fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `Borrow Loc Peminjam ${i}`, f4, 320, b.y + 52, 380, 16, { characters: b.loc, fill: '#64748B', fontSize: 10 });
    addNode('text', `Borrow Due Peminjam ${i}`, f4, 320, b.y + 72, 380, 16, { characters: b.due, fill: '#B45309', fontSize: 10, fontStyle: 'Bold' });
    addNode('rectangle', `Btn Ext Peminjam ${i}`, f4, 760, b.y + 24, 180, 30, { fill: '#EFF6FF', cornerRadius: 6, stroke: '#BFDBFE', strokeWeight: 1 });
    addNode('text', `Text Ext Peminjam ${i}`, f4, 760, b.y + 30, 180, 16, { characters: 'Ajukan Perpanjangan', fill: C.brandBlue, fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });
    addNode('rectangle', `Btn Guide Peminjam ${i}`, f4, 760, b.y + 60, 180, 30, { fill: '#F1F5F9', cornerRadius: 6 });
    addNode('text', `Text Guide Peminjam ${i}`, f4, 760, b.y + 66, 180, 16, { characters: 'Petunjuk Pengembalian', fill: '#475569', fontSize: 10, textAlign: 'center' });
  });

  // Third card to fill bottom gap and make left/right cards equal in height!
  addNode('rectangle', 'Quota Box Peminjam', f4, 304, 808, 652, 108, { fill: '#F0FDF4', cornerRadius: 12, stroke: '#BBF7D0', strokeWeight: 1 });
  addNode('text', 'Quota Title Peminjam', f4, 320, 820, 400, 18, { characters: 'Status Kuota Peminjaman Aktif: 2 dari 5 Sarana Terpakai', fill: '#166534', fontSize: 12, fontStyle: 'Bold' });
  addNode('text', 'Quota Sub 1 Peminjam', f4, 320, 842, 620, 16, { characters: '• Hak Akses Dosen: Maksimal 5 unit inventaris sarana pendidikan dalam 1 kurun waktu peminjaman.', fill: '#15803D', fontSize: 10 });
  addNode('text', 'Quota Sub 2 Peminjam', f4, 320, 862, 620, 16, { characters: '• Skor Disiplin: 100% Pengembalian Tepat Waktu (Prioritas persetujuan instan tanpa survei ulang).', fill: '#15803D', fontSize: 10 });
  addNode('text', 'Quota Sub 3 Peminjam', f4, 320, 882, 620, 16, { characters: '• Fasilitas Darurat: Layanan pick-up teknisi tersedia untuk sarana berbobot berat di atas 20 kg.', fill: '#15803D', fontSize: 10 });

  // Right: Katalog Sarpras Siap Pakai (4 items)
  addNode('rectangle', 'Catalog Desk Peminjam', f4, 1000, 534, 420, 406, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Catalog Title Peminjam', f4, 1020, 550, 380, 20, { characters: 'Katalog Sarpras Siap Pakai Hari Ini', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });

  const quickAvailable = [
    { name: 'Ruang Seminar 1 (Gedung TI)', cap: 'Kapasitas 60 Org • AC & Audio', avail: 'Tersedia Sekarang', y: 580 },
    { name: 'Sound Portable Yamaha 680W', cap: '2 Mic Wireless + Mixer 10-Ch', avail: 'Ready di Sarpras', y: 664 },
    { name: 'Laptop ASUS ROG Lab VR', cap: 'Core i9, 32GB RAM, RTX 4070', avail: 'Ready di Lab 1', y: 748 },
    { name: 'Kamera Sony A6400 Kit 4K', cap: 'Lensa 16-50mm + Tripod', avail: 'Ready di Sarpras', y: 832 }
  ];
  quickAvailable.forEach((q, i) => {
    addNode('rectangle', `Quick Box Peminjam ${i}`, f4, 1020, q.y, 380, 72, { fill: '#F8FAFC', cornerRadius: 10, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `Quick Name Peminjam ${i}`, f4, 1036, q.y + 10, 250, 18, { characters: q.name, fill: '#0F172A', fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `Quick Cap Peminjam ${i}`, f4, 1036, q.y + 28, 250, 16, { characters: q.cap, fill: '#64748B', fontSize: 9 });
    addNode('text', `Quick Avail Peminjam ${i}`, f4, 1036, q.y + 46, 160, 16, { characters: `✓ ${q.avail}`, fill: '#15803D', fontSize: 9, fontStyle: 'Bold' });
    addNode('rectangle', `Quick Book Peminjam ${i}`, f4, 1300, q.y + 22, 88, 30, { fill: C.brandBlue, cornerRadius: 6 });
    addNode('text', `Quick Book Text Peminjam ${i}`, f4, 1300, q.y + 28, 88, 16, { characters: '+ Pinjam', fill: '#FFFFFF', fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });
  });
}

// =========================================================================
// ROW 2: 4 CORE MODULE SCREENS (x: 0, 1540, 3080, 4620; y: 1100)
// =========================================================================
function buildRow2Modules() {
  const yRow2 = 1100;
  
  // 5. INVENTARIS ASET
  const f5 = addNode('frame', '[M3] SIMAS - Inventaris Aset', null, 0, yRow2, 1440, 960, { fill: C.surface, clip: true });
  createFullSidebar(f5, 'admin', 'Admin Sarpras', 'Full Access', 'aset');
  createTopBar(f5, 'admin', 'Master Inventaris Sarana & Aset Kampus', 'Database Aset • Lokasi Ruang • Label QR & Riwayat Perawatan', 'Bambang Irawan', 'Admin Sarpras');

  addNode('text', 'Aset Header Title', f5, 280, 90, 420, 26, { characters: 'Katalog Inventaris Sarana (1.248 Aset Aktif)', fill: '#0F172A', fontSize: 18, fontStyle: 'Bold' });
  const catChips = [
    { label: 'Semua Kategori (1.248)', active: true, x: 280, w: 170 },
    { label: 'Elektronik & IT (542)', active: false, x: 462, w: 160 },
    { label: 'Furnitur & Meubeler (410)', active: false, x: 634, w: 180 },
    { label: 'Peralatan Lab (278)', active: false, x: 826, w: 155 },
    { label: 'Kendaraan (18)', active: false, x: 993, w: 120 }
  ];
  catChips.forEach(c => {
    addNode('rectangle', `Aset Chip ${c.label}`, f5, c.x, 126, c.w, 36, { fill: c.active ? C.brandBlue : '#FFFFFF', cornerRadius: 8, stroke: '#CBD5E1', strokeWeight: 1 });
    addNode('text', `Aset Chip Text ${c.label}`, f5, c.x, 136, c.w, 16, { characters: c.label, fill: c.active ? '#FFFFFF' : '#475569', fontSize: 11, fontStyle: c.active ? 'Bold' : 'Regular', textAlign: 'center' });
  });

  addNode('rectangle', 'Search Asset Box', f5, 280, 174, 300, 42, { fill: '#F1F5F9', cornerRadius: 10 });
  addNode('text', 'Search Asset Text', f5, 298, 186, 260, 20, { characters: 'Filter nama atau kode aset...', fill: '#94A3B8', fontSize: 12 });
  addNode('rectangle', 'Status Dropdown', f5, 592, 174, 160, 42, { fill: '#FFFFFF', cornerRadius: 10, stroke: '#CBD5E1', strokeWeight: 1 });
  addNode('text', 'Status Dropdown Text', f5, 592, 186, 160, 20, { characters: 'Status: Semua Kondisi ▾', fill: '#0F172A', fontSize: 11, textAlign: 'center' });
  addNode('rectangle', 'Gedung Dropdown', f5, 764, 174, 160, 42, { fill: '#FFFFFF', cornerRadius: 10, stroke: '#CBD5E1', strokeWeight: 1 });
  addNode('text', 'Gedung Dropdown Text', f5, 764, 186, 160, 20, { characters: 'Gedung: Semua Lokasi ▾', fill: '#0F172A', fontSize: 11, textAlign: 'center' });
  addNode('rectangle', 'Btn Add Asset', f5, 1230, 174, 190, 42, { fill: C.brandBlue, cornerRadius: 10 });
  addNode('text', 'Btn Add Asset Text', f5, 1230, 186, 190, 20, { characters: '+ Tambah Aset Baru', fill: '#FFFFFF', fontSize: 12, fontStyle: 'Bold', textAlign: 'center' });

  addNode('rectangle', 'Table Asset Bg', f5, 280, 230, 780, 700, { fill: '#FFFFFF', cornerRadius: 18, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('rectangle', 'TH Bg', f5, 280, 230, 780, 44, { fill: '#F8FAFC', cornerRadius: 18 });
  addNode('text', 'TH Kode', f5, 302, 244, 120, 16, { characters: 'KODE ASET', fill: '#64748B', fontSize: 10, fontStyle: 'Bold' });
  addNode('text', 'TH Nama', f5, 432, 244, 220, 16, { characters: 'NAMA & SPESIFIKASI', fill: '#64748B', fontSize: 10, fontStyle: 'Bold' });
  addNode('text', 'TH Lokasi', f5, 662, 244, 140, 16, { characters: 'LOKASI RUANG', fill: '#64748B', fontSize: 10, fontStyle: 'Bold' });
  addNode('text', 'TH Kondisi', f5, 812, 244, 120, 16, { characters: 'KONDISI / STATUS', fill: '#64748B', fontSize: 10, fontStyle: 'Bold' });
  addNode('text', 'TH Aksi', f5, 972, 244, 70, 16, { characters: 'AKSI', fill: '#64748B', fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });

  const assetList = [
    { code: 'AST-TI-2024-001', name: 'Laptop ASUS ROG Strix G16', spec: 'Core i9, 32GB RAM, RTX 4070 (Lab VR)', loc: 'Lab Komputer 1', cond: 'Baik', avail: 'Tersedia', y: 284, selected: true },
    { code: 'AST-TI-2024-002', name: 'Proyektor Epson EB-X500', spec: '3600 ANSI Lumens, HDMI & Wireless', loc: 'Ruang Dosen TI', cond: 'Baik', avail: 'Dipinjam', y: 380, selected: false },
    { code: 'AST-FT-2023-014', name: 'AC Daikin Inverter 2 PK', spec: 'R32 Eco, High Power', loc: 'Ruang Seminar', cond: 'Rusak Ringan', avail: 'Dalam Servis', y: 476, selected: false },
    { code: 'AST-MIPA-2022-088', name: 'Mikroskop Olympus CX23', spec: 'LED Illumination 4x-100x', loc: 'Lab Biologi', cond: 'Baik', avail: 'Tersedia', y: 572, selected: false },
    { code: 'AST-UM-2024-045', name: 'Sound System Yamaha StagePas', spec: '680W 10-Channel Mixer + Dual Mic', loc: 'Ruang Aula', cond: 'Baik', avail: 'Tersedia', y: 668, selected: false },
    { code: 'AST-FT-2021-009', name: 'Switch Cisco Catalyst 24-Port', spec: 'Gigabit Managed PoE Switch', loc: 'Server Room TI', cond: 'Baik', avail: 'Terpasang', y: 764, selected: false }
  ];
  assetList.forEach((a, i) => {
    addNode('rectangle', `Asset Row ${i}`, f5, 292, a.y, 756, 84, { fill: a.selected ? '#EEF2FF' : '#F8FAFC', cornerRadius: 12, stroke: a.selected ? C.brandBlue : '#E2E8F0', strokeWeight: 1 });
    addNode('text', `A Code ${i}`, f5, 302, a.y + 18, 120, 16, { characters: a.code, fill: C.brandBlue, fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `A Name ${i}`, f5, 432, a.y + 14, 220, 20, { characters: a.name, fill: '#0F172A', fontSize: 12, fontStyle: 'Bold' });
    addNode('text', `A Spec ${i}`, f5, 432, a.y + 36, 220, 16, { characters: a.spec, fill: '#64748B', fontSize: 10 });
    addNode('text', `A Loc ${i}`, f5, 662, a.y + 24, 140, 16, { characters: a.loc, fill: '#0F172A', fontSize: 11 });
    addNode('rectangle', `A Cond Bg ${i}`, f5, 812, a.y + 14, 76, 22, { fill: (a.cond === 'Baik') ? C.successBg : C.errorBg, cornerRadius: 6 });
    addNode('text', `A Cond Text ${i}`, f5, 812, a.y + 18, 76, 14, { characters: a.cond, fill: (a.cond === 'Baik') ? C.successText : C.errorText, fontSize: 9, fontStyle: 'Bold', textAlign: 'center' });
    addNode('rectangle', `A Avail Bg ${i}`, f5, 812, a.y + 42, 76, 22, { fill: (a.avail === 'Tersedia') ? C.infoBg : C.warningBg, cornerRadius: 6 });
    addNode('text', `A Avail Text ${i}`, f5, 812, a.y + 46, 76, 14, { characters: a.avail, fill: (a.avail === 'Tersedia') ? C.infoText : C.warningText, fontSize: 9, fontStyle: 'Bold', textAlign: 'center' });
    addNode('text', `A Action ${i}`, f5, 972, a.y + 26, 70, 20, { characters: 'Edit  ⋮', fontSize: 12, textAlign: 'center', fill: C.brandBlue });
  });

  // Right Side Sheet (w: 340)
  addNode('rectangle', 'Sheet Bg', f5, 1080, 230, 340, 700, { fill: '#FFFFFF', cornerRadius: 18, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Sheet Title', f5, 1100, 252, 300, 22, { characters: 'Detail & Label Barcode Aset', fill: '#0F172A', fontSize: 15, fontStyle: 'Bold' });
  addNode('rectangle', 'Sheet Photo', f5, 1100, 288, 300, 130, { fill: '#F1F5F9', cornerRadius: 14 });
  addVector('Sheet Photo Icon', f5, 1234, 335, 32, 32,
    'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zm-2 13h20v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z',
    '#94A3B8', 2
  );
  addNode('text', 'Sheet Photo Label', f5, 1100, 375, 300, 16, { characters: 'Foto Fisik Unit • Update 12 Nov 2026', fill: '#64748B', fontSize: 10, textAlign: 'center' });
  addNode('text', 'Sheet Name', f5, 1100, 434, 300, 20, { characters: 'Laptop ASUS ROG Strix G16', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  addNode('text', 'Sheet Reg', f5, 1100, 456, 300, 16, { characters: 'No Registrasi: AST-TI-2024-001', fill: C.brandBlue, fontSize: 11, fontStyle: 'Bold' });
  
  addNode('rectangle', 'Sheet Spec Box', f5, 1100, 480, 300, 170, { fill: '#F8FAFC', cornerRadius: 12 });
  const specs = [
    'Tahun Pengadaan: 2024 (APBN)',
    'Harga Beli: Rp 28.500.000',
    'Lokasi Fisik: Lab Komputer 1 TI',
    'Penanggung Jawab: Bambang Irawan',
    'Garansi Resmi ASUS s/d 2026'
  ];
  specs.forEach((s, idx) => {
    addNode('text', `Spec ${idx}`, f5, 1114, 494 + idx * 30, 272, 16, { characters: `• ${s}`, fill: '#334155', fontSize: 10 });
  });
  
  addNode('rectangle', 'Btn Print QR', f5, 1100, 664, 142, 40, { fill: C.roleCardBg, cornerRadius: 10 });
  addNode('text', 'Btn Print QR Text', f5, 1100, 674, 142, 20, { characters: 'Cetak QR Tag', fill: C.brandBlue, fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });
  addNode('rectangle', 'Btn Edit Asset Sheet', f5, 1258, 664, 142, 40, { fill: C.brandBlue, cornerRadius: 10 });
  addNode('text', 'Btn Edit Asset Text Sheet', f5, 1258, 674, 142, 20, { characters: 'Edit Data Aset', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });

  // 6. GEDUNG & RUANGAN
  const f6 = addNode('frame', '[M3] SIMAS - Gedung & Ruangan', null, 1540, yRow2, 1440, 960, { fill: C.surface, clip: true });
  createFullSidebar(f6, 'admin', 'Admin Sarpras', 'Full Access', 'gedung');
  createTopBar(f6, 'admin', 'Manajemen Gedung, Fasilitas & Ruangan', 'Pemetaan Hierarki Fisik, Kapasitas Okupansi & Ketersediaan Real-Time', 'Bambang Irawan', 'Admin Sarpras');

  addNode('text', 'Gedung Title', f6, 280, 90, 420, 26, { characters: 'Pemetaan Denah Gedung & Ketersediaan Ruang', fill: '#0F172A', fontSize: 18, fontStyle: 'Bold' });
  addNode('rectangle', 'Btn Print Denah', f6, 1060, 88, 160, 42, { fill: '#FFFFFF', cornerRadius: 10, stroke: '#CBD5E1', strokeWeight: 1 });
  addNode('text', 'Text Print Denah', f6, 1060, 100, 160, 20, { characters: 'Cetak Denah PDF', fill: '#0F172A', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });
  addNode('rectangle', 'Btn Add Room', f6, 1234, 88, 186, 42, { fill: C.brandBlue, cornerRadius: 10 });
  addNode('text', 'Text Add Room', f6, 1234, 100, 186, 20, { characters: '+ Tambah Ruangan Baru', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });

  const kpisGedung = [
    { title: 'Total Kompleks', val: '4 Gedung', sub: 'TI, Utama, MIPA, Rektorat' },
    { title: 'Total Ruangan', val: '56 Ruang', sub: 'Kapasitas 3.200 Orang' },
    { title: 'Ruang Terpakai', val: '42 Ruangan', sub: '75% Tingkat Okupansi' },
    { title: 'Fasilitas Rusak', val: '3 Ruang', sub: 'Sedang Ditangani Teknisi' }
  ];
  kpisGedung.forEach((k, i) => {
    const x = 280 + i * 290;
    addNode('rectangle', `KPI Gedung ${i}`, f6, x, 146, 270, 90, { fill: '#FFFFFF', cornerRadius: 14, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `KPI Title Gedung ${i}`, f6, x + 16, 158, 230, 16, { characters: k.title, fill: '#64748B', fontSize: 11 });
    addNode('text', `KPI Val Gedung ${i}`, f6, x + 16, 174, 230, 24, { characters: k.val, fill: '#0F172A', fontSize: 17, fontStyle: 'Bold' });
    addNode('text', `KPI Sub Gedung ${i}`, f6, x + 16, 200, 230, 16, { characters: k.sub, fill: '#64748B', fontSize: 10 });
  });

  // Left: Tree Navigator (w: 260)
  addNode('rectangle', 'Tree Box', f6, 280, 252, 260, 678, { fill: '#FFFFFF', cornerRadius: 18, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Tree Title', f6, 298, 270, 200, 20, { characters: 'Hierarki Struktur Gedung', fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
  addNode('rectangle', 'Tree Search', f6, 298, 298, 224, 36, { fill: '#F1F5F9', cornerRadius: 8 });
  addNode('text', 'Tree Search Text', f6, 312, 308, 200, 16, { characters: 'Filter gedung...', fill: '#94A3B8', fontSize: 11 });

  const treeItems = [
    { name: 'Gedung TI (Teknik)', active: true, floors: ['• Lantai 1: Lab Dasar (3 Ruang)', '• Lantai 2: Ruang Dosen & Rapat', '• Lantai 3: Lab VR & AI (4 Ruang)'], y: 348 },
    { name: 'Gedung Utama Aula', active: false, floors: ['• Lantai 1: Aula Utama (800 Org)', '• Lantai 2: Ruang Teori Umum', '• Lantai 3: Ruang Seminar 1 & 2'], y: 470 },
    { name: 'Gedung Laboratorium MIPA', active: false, floors: ['• Lantai 1: Lab Kimia Dasar', '• Lantai 2: Lab Biologi Molekuler', '• Lantai 3: Lab Fisika Lanjutan'], y: 592 }
  ];
  treeItems.forEach((t, i) => {
    addNode('rectangle', `Tree Item ${i}`, f6, 298, t.y, 224, 110, { fill: t.active ? '#EEF2FF' : '#F8FAFC', cornerRadius: 10, stroke: t.active ? C.brandBlue : '#E2E8F0', strokeWeight: 1 });
    addNode('text', `Tree Item Name ${i}`, f6, 310, t.y + 10, 200, 18, { characters: t.name, fill: t.active ? C.brandBlue : '#0F172A', fontSize: 12, fontStyle: 'Bold' });
    t.floors.forEach((fl, fi) => {
      addNode('text', `Floor ${i} ${fi}`, f6, 310, t.y + 32 + fi * 22, 200, 16, { characters: fl, fill: '#64748B', fontSize: 10 });
    });
  });

  // Right: Rooms Grid (w: 860)
  addNode('rectangle', 'Room Grid Bg', f6, 560, 252, 860, 678, { fill: '#FFFFFF', cornerRadius: 18, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Room Grid Header', f6, 584, 270, 300, 20, { characters: 'Daftar Ruangan: Gedung TI Lt. 3', fill: '#0F172A', fontSize: 15, fontStyle: 'Bold' });

  const rooms = [
    { code: 'LAB-TI-301', name: 'Lab Multimedia & Virtual Reality', cap: '40 Kursi / Komputer', fac: '40x PC ROG, AC 2 PK, Smart Display, Audio', status: 'Terpakai Perkuliahan', stBg: C.warningBg, stTc: C.warningText, y: 310 },
    { code: 'SEM-UTM-302', name: 'Ruang Seminar Utama Kampus', cap: '120 Kursi Audiens', fac: 'Dual Proyektor Laser, Podium, Mic Shure, AC Sentral', status: 'Kosong Siap Pakai', stBg: C.successBg, stTc: C.successText, y: 450 },
    { code: 'AULA-001', name: 'Gedung Aula Utama Graha Mahasiswa', cap: '800 Kursi / Teater', fac: 'Videotron 6x3m, Sound Yamaha 680W, Panggung', status: 'Terjadwal Dies Natalis', stBg: C.infoBg, stTc: C.infoText, y: 590 },
    { code: 'LAB-BIO-204', name: 'Laboratorium Biologi Molekuler', cap: '30 Mahasiswa', fac: '30x Mikroskop Olympus, Fume Hood, Autoclave', status: 'Pembersihan Fisik', stBg: '#E2E8F0', stTc: '#475569', y: 730 }
  ];
  rooms.forEach((r, i) => {
    addNode('rectangle', `Room Box ${i}`, f6, 584, r.y, 812, 122, { fill: '#F8FAFC', cornerRadius: 14, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `R Code ${i}`, f6, 604, r.y + 14, 120, 16, { characters: r.code, fill: C.brandBlue, fontSize: 11, fontStyle: 'Bold' });
    addNode('rectangle', `R Status ${i}`, f6, 1220, r.y + 12, 156, 24, { fill: r.stBg, cornerRadius: 6 });
    addNode('text', `R Status Text ${i}`, f6, 1220, r.y + 16, 156, 16, { characters: r.status, fill: r.stTc, fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });
    addNode('text', `R Name ${i}`, f6, 604, r.y + 34, 450, 22, { characters: r.name, fill: '#0F172A', fontSize: 14, fontStyle: 'Bold' });
    addNode('text', `R Cap ${i}`, f6, 604, r.y + 58, 450, 16, { characters: `Kapasitas: ${r.cap}`, fill: '#0F172A', fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `R Fac ${i}`, f6, 604, r.y + 78, 550, 16, { characters: `Fasilitas: ${r.fac}`, fill: '#64748B', fontSize: 10 });
    addNode('rectangle', `Btn Book Room ${i}`, f6, 1220, r.y + 68, 156, 36, { fill: C.brandBlue, cornerRadius: 8 });
    addNode('text', `Text Book Room ${i}`, f6, 1220, r.y + 78, 156, 16, { characters: (r.status === 'Kosong Siap Pakai') ? '+ Booking Ruang' : 'Detail Jadwal', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });
  });

  // 7. PEMINJAMAN SARANA
  const f7 = addNode('frame', '[M3] SIMAS - Peminjaman Sarana', null, 3080, yRow2, 1440, 960, { fill: C.surface, clip: true });
  createFullSidebar(f7, 'admin', 'Admin Sarpras', 'Full Access', 'pinjam');
  createTopBar(f7, 'admin', 'Manajemen Peminjaman Sarana & Serah Terima', 'Pengajuan Online, Otorisasi Surat Tugas, & Verifikasi Pengembalian', 'Bambang Irawan', 'Admin Sarpras');

  addNode('text', 'Pinjam Title', f7, 280, 90, 420, 26, { characters: 'Sirkulasi Peminjaman Sarana & Prasarana', fill: '#0F172A', fontSize: 18, fontStyle: 'Bold' });
  addNode('rectangle', 'Btn Print SPK', f7, 1060, 88, 160, 42, { fill: '#FFFFFF', cornerRadius: 10, stroke: '#CBD5E1', strokeWeight: 1 });
  addNode('text', 'Text Print SPK', f7, 1060, 100, 160, 20, { characters: 'Cetak Rekap SPK', fill: '#0F172A', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });
  addNode('rectangle', 'Btn New Loan', f7, 1234, 88, 186, 42, { fill: C.brandBlue, cornerRadius: 10 });
  addNode('text', 'Text New Loan', f7, 1234, 100, 186, 20, { characters: '+ Buat Peminjaman Baru', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });

  const kpisPinjam = [
    { title: 'Permohonan Baru', val: '8 Antrean', sub: 'Perlu Tindakan Approval', bg: C.warningBg, tc: C.warningText, icon: VP.clipboard },
    { title: 'Pinjaman Berjalan', val: '12 Sarana', sub: 'Sedang Digunakan Pengguna', bg: C.infoBg, tc: C.infoText, icon: VP.package },
    { title: 'Verifikasi Kembali', val: '3 Barang', sub: 'Menunggu Cek Fisik Petugas', bg: C.purpleBg, tc: C.purpleText, icon: VP.calendar },
    { title: 'Selesai Bulan Ini', val: '45 Transaksi', sub: '100% Pengembalian Tertib', bg: C.successBg, tc: C.successText, icon: VP.star }
  ];
  renderKpiCards(f7, kpisPinjam);

  addNode('rectangle', 'Loan Table Main', f7, 280, 252, 1140, 678, { fill: '#FFFFFF', cornerRadius: 18, stroke: '#E2E8F0', strokeWeight: 1 });
  
  const loanTabs = [
    { label: 'Semua (68)', active: true, x: 302, w: 110 },
    { label: 'Menunggu Approval (8)', active: false, x: 422, w: 170 },
    { label: 'Sedang Berjalan (12)', active: false, x: 602, w: 160 },
    { label: 'Verifikasi Kembali (3)', active: false, x: 772, w: 170 },
    { label: 'Selesai (45)', active: false, x: 952, w: 110 }
  ];
  loanTabs.forEach(t => {
    addNode('rectangle', `LTab ${t.label}`, f7, t.x, 270, t.w, 36, { fill: t.active ? C.brandBlue : '#F1F5F9', cornerRadius: 8 });
    addNode('text', `LTab Text ${t.label}`, f7, t.x, 280, t.w, 16, { characters: t.label, fill: t.active ? '#FFFFFF' : '#475569', fontSize: 11, fontStyle: t.active ? 'Bold' : 'Regular', textAlign: 'center' });
  });

  const fullLoanList = [
    { code: 'PINJ-2026-089', user: 'Budi Santoso, M.Kom (Dosen TI)', item: '2x Proyektor Epson & Laser Pointer', date: '17 - 18 Nov 2026 (2 Hari)', status: 'Menunggu Review', stBg: C.warningBg, stTc: C.warningText, y: 326 },
    { code: 'PINJ-2026-086', user: 'Siti Rahmawati (Ketua BEM Univ)', item: 'Gedung Aula Utama & Sound System Yamaha', date: '19 - 20 Nov 2026 (Dies Natalis)', status: 'Disetujui Pimpinan', stBg: C.successBg, stTc: C.successText, y: 426 },
    { code: 'PINJ-2026-082', user: 'Dimas Arya (Himpunan Mahasiswa Elektro)', item: 'Kamera Sony A6400 Kit & Tripod', date: '16 Nov 2026 (Selesai Hari Ini)', status: 'Verifikasi Fisik', stBg: C.purpleBg, stTc: C.purpleText, y: 526 },
    { code: 'PINJ-2026-078', user: 'Laboratorium Rekayasa Perangkat Lunak', item: '10x Kabel LAN Cat6 & 1x Switch Cisco', date: '12 - 15 Nov 2026 (Tepat Waktu)', status: 'Selesai di Gudang', stBg: '#E2E8F0', stTc: '#475569', y: 626 },
    { code: 'PINJ-2026-075', user: 'Unit Kegiatan Mahasiswa Musik Kampus', item: '4x Mic Wireless & Drum Kit Elektrik', date: '10 Nov 2026', status: 'Ditolak (Bentrok)', stBg: C.errorBg, stTc: C.errorText, y: 726 }
  ];
  fullLoanList.forEach((fl, i) => {
    addNode('rectangle', `Loan Full Row ${i}`, f7, 302, fl.y, 1096, 86, { fill: '#F8FAFC', cornerRadius: 14, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `FL Code ${i}`, f7, 320, fl.y + 14, 140, 16, { characters: fl.code, fill: C.brandBlue, fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `FL User ${i}`, f7, 320, fl.y + 34, 380, 20, { characters: fl.user, fill: '#0F172A', fontSize: 13, fontStyle: 'Bold' });
    addNode('text', `FL Item ${i}`, f7, 320, fl.y + 56, 420, 16, { characters: `Sarana: ${fl.item}`, fill: '#64748B', fontSize: 11 });
    addNode('text', `FL Date ${i}`, f7, 740, fl.y + 24, 220, 16, { characters: fl.date, fill: '#0F172A', fontSize: 11 });
    addNode('rectangle', `FL Status Bg ${i}`, f7, 980, fl.y + 14, 150, 24, { fill: fl.stBg, cornerRadius: 6 });
    addNode('text', `FL Status Text ${i}`, f7, 980, fl.y + 18, 150, 16, { characters: fl.status, fill: fl.stTc, fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });
    addNode('rectangle', `FL Action Btn ${i}`, f7, 980, fl.y + 46, 150, 30, { fill: C.brandBlue, cornerRadius: 6 });
    addNode('text', `FL Action Text ${i}`, f7, 980, fl.y + 52, 150, 16, { characters: (fl.status === 'Menunggu Review') ? 'Review Approval ➔' : 'Detail SPK', fill: '#FFFFFF', fontSize: 10, fontStyle: 'Bold', textAlign: 'center' });
  });

  // 8. PEMELIHARAAN & KANBAN
  const f8 = addNode('frame', '[M3] SIMAS - Pemeliharaan & Kanban', null, 4620, yRow2, 1440, 960, { fill: C.surface, clip: true });
  createFullSidebar(f8, 'petugas', 'Petugas Sarpras', 'Teknisi', 'pemeliharaan');
  createTopBar(f8, 'petugas', 'Papan Kanban Pemeliharaan & Tiket Servis', 'Tracking Kerusakan Fasilitas, Penugasan Teknisi & Realisasi Biaya', 'Joko Supriyanto', 'Petugas Sarpras');

  addNode('text', 'Kanban Title', f8, 280, 90, 420, 26, { characters: 'Papan Kerja Kanban Servis & Pemeliharaan', fill: '#0F172A', fontSize: 18, fontStyle: 'Bold' });
  addNode('rectangle', 'Btn Cost Rep', f8, 1060, 88, 160, 42, { fill: '#FFFFFF', cornerRadius: 10, stroke: '#CBD5E1', strokeWeight: 1 });
  addNode('text', 'Text Cost Rep', f8, 1060, 100, 160, 20, { characters: 'Rekap Biaya Servis', fill: '#0F172A', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });
  addNode('rectangle', 'Btn New Ticket', f8, 1234, 88, 186, 42, { fill: '#059669', cornerRadius: 10 });
  addNode('text', 'Text New Ticket', f8, 1234, 100, 186, 20, { characters: '+ Buat Tiket Kerusakan', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });

  const columns = [
    { title: 'Antrean Tiket (3)', bg: '#FEF3C7', tc: '#B45309', x: 280, cards: [
      { code: 'TKT-021', name: 'Lampu TL Lab TI 01 Mati', loc: 'Lab Komputer 1', prio: 'Rendah', pBg: C.successBg, pTc: C.successText, cost: 'Est. Rp 150.000', tech: 'Belum Ditugaskan' },
      { code: 'TKT-022', name: 'Jack Audio Mic Seminar Putus', loc: 'R. Seminar Lt. 3', prio: 'Sedang', pBg: C.warningBg, pTc: C.warningText, cost: 'Est. Rp 75.000', tech: 'Belum Ditugaskan' },
      { code: 'TKT-023', name: 'Wastafel Rektorat Bocor', loc: 'Toilet Gedung Rektorat', prio: 'Rendah', pBg: C.successBg, pTc: C.successText, cost: 'Est. Rp 200.000', tech: 'Belum Ditugaskan' }
    ]},
    { title: 'Sedang Dikerjakan (3)', bg: '#DBEAFE', tc: '#1D4ED8', x: 570, cards: [
      { code: 'TKT-012', name: 'AC Daikin R. Seminar', loc: 'Gedung Utama Lt. 3', prio: 'Tinggi', pBg: C.errorBg, pTc: C.errorText, cost: 'Biaya Rp 850.000', tech: 'Teknisi: Joko Supriyanto' },
      { code: 'TKT-014', name: 'PC Lab Multimedia 04', loc: 'Lab TI 01', prio: 'Sedang', pBg: C.warningBg, pTc: C.warningText, cost: 'Garansi Asus Rp 0', tech: 'Teknisi: Vendor Asus' },
      { code: 'TKT-017', name: 'Proyektor BenQ Lab TI 02', loc: 'Lab TI 02', prio: 'Sedang', pBg: C.warningBg, pTc: C.warningText, cost: 'Biaya Rp 350.000', tech: 'Teknisi: Joko Supriyanto' }
    ]},
    { title: 'Pengujian Kualitas (2)', bg: '#F3E8FF', tc: '#7E22CE', x: 860, cards: [
      { code: 'TKT-009', name: 'Genset Cummins 150 kVA', loc: 'Power House B', prio: 'Tinggi', pBg: C.errorBg, pTc: C.errorText, cost: 'Biaya Rp 3.400.000', tech: 'Teknisi: Tim Sarpras' },
      { code: 'TKT-011', name: 'Sound System Aula Utama', loc: 'Aula Utama', prio: 'Tinggi', pBg: C.errorBg, pTc: C.errorText, cost: 'Biaya Rp 650.000', tech: 'Teknisi: Joko & Vendor' }
    ]},
    { title: 'Selesai Diperbaiki (14)', bg: '#DCFCE7', tc: '#15803D', x: 1150, cards: [
      { code: 'TKT-005', name: 'Kabel LAN Server TI', loc: 'Server Room', prio: 'Rendah', pBg: C.successBg, pTc: C.successText, cost: 'Total Rp 120.000', tech: 'Selesai 14 Nov 2026' },
      { code: 'TKT-002', name: 'Kursi Kuliah R. 201 (10 Unit)', loc: 'Gedung TI Lt. 2', prio: 'Rendah', pBg: C.successBg, pTc: C.successText, cost: 'Total Rp 450.000', tech: 'Selesai 10 Nov 2026' }
    ]}
  ];

  columns.forEach((col, ci) => {
    addNode('rectangle', `Col Bg ${ci}`, f8, col.x, 146, 270, 42, { fill: col.bg, cornerRadius: 10 });
    addNode('text', `Col Title ${ci}`, f8, col.x, 158, 270, 20, { characters: col.title, fill: col.tc, fontSize: 12, fontStyle: 'Bold', textAlign: 'center' });

    col.cards.forEach((cd, cdi) => {
      const cardY = 200 + cdi * 160;
      addNode('rectangle', `KCard ${ci} ${cdi}`, f8, col.x, cardY, 270, 146, { fill: '#FFFFFF', cornerRadius: 12, stroke: '#E2E8F0', strokeWeight: 1 });
      addNode('text', `KC Code ${ci} ${cdi}`, f8, col.x + 14, cardY + 12, 120, 16, { characters: cd.code, fill: C.brandBlue, fontSize: 10, fontStyle: 'Bold' });
      addNode('rectangle', `KC Prio Bg ${ci} ${cdi}`, f8, col.x + 178, cardY + 10, 78, 20, { fill: cd.pBg, cornerRadius: 4 });
      addNode('text', `KC Prio Text ${ci} ${cdi}`, f8, col.x + 178, cardY + 13, 78, 14, { characters: cd.prio, fill: cd.pTc, fontSize: 9, fontStyle: 'Bold', textAlign: 'center' });
      addNode('text', `KC Name ${ci} ${cdi}`, f8, col.x + 14, cardY + 34, 242, 20, { characters: cd.name, fill: '#0F172A', fontSize: 12, fontStyle: 'Bold' });
      addNode('text', `KC Loc ${ci} ${cdi}`, f8, col.x + 14, cardY + 56, 242, 16, { characters: `Lokasi: ${cd.loc}`, fill: '#64748B', fontSize: 10 });
      addNode('text', `KC Tech ${ci} ${cdi}`, f8, col.x + 14, cardY + 76, 242, 16, { characters: cd.tech, fill: '#475569', fontSize: 10 });
      addNode('text', `KC Cost ${ci} ${cdi}`, f8, col.x + 14, cardY + 98, 242, 18, { characters: cd.cost, fill: '#0F172A', fontSize: 11, fontStyle: 'Bold' });
      addNode('rectangle', `KC Drag ${ci} ${cdi}`, f8, col.x + 14, cardY + 122, 242, 16, { fill: '#F1F5F9', cornerRadius: 4 });
      addNode('text', `KC Drag Text ${ci} ${cdi}`, f8, col.x + 14, cardY + 124, 242, 12, { characters: '•••••• geser kartu ••••••', fill: '#94A3B8', fontSize: 8, textAlign: 'center' });
    });
  });
}

// =========================================================================
// ROW 3: LAPORAN & PORTAL LOGIN MULTI-ROLE (x: 0, 1540; y: 2200)
// =========================================================================
function buildRow3LaporanAndLogin() {
  const yRow3 = 2200;

  // 9. LAPORAN & AUDIT TRAIL
  const f9 = addNode('frame', '[M3] SIMAS - Laporan & Audit Trail', null, 0, yRow3, 1440, 960, { fill: C.surface, clip: true });
  createFullSidebar(f9, 'admin', 'Admin Sarpras', 'Full Access', 'laporan');
  createTopBar(f9, 'admin', 'Pusat Laporan, Rekapitulasi & Audit Trail Sarpras', 'Kompilasi BAST Transaksi, Utilisasi Ruangan, Serapan Anggaran & Log', 'Bambang Irawan', 'Admin Sarpras');

  addNode('text', 'Lap Title', f9, 280, 90, 450, 26, { characters: 'Pusat Laporan & Arsip BAST Sarana Prasarana', fill: '#0F172A', fontSize: 18, fontStyle: 'Bold' });
  addNode('rectangle', 'Btn Exp CSV', f9, 1060, 88, 160, 42, { fill: '#FFFFFF', cornerRadius: 10, stroke: '#CBD5E1', strokeWeight: 1 });
  addNode('text', 'Text Exp CSV', f9, 1060, 100, 160, 20, { characters: 'Unduh Excel / CSV', fill: '#0F172A', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });
  addNode('rectangle', 'Btn Print PDF', f9, 1234, 88, 186, 42, { fill: C.brandBlue, cornerRadius: 10 });
  addNode('text', 'Text Print PDF', f9, 1234, 100, 186, 20, { characters: 'Cetak Dokumen Resmi', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });

  // Filter Bar
  addNode('rectangle', 'Filter Bar Lap', f9, 280, 146, 1140, 64, { fill: '#FFFFFF', cornerRadius: 14, stroke: '#E2E8F0', strokeWeight: 1 });
  addNode('text', 'Per Label', f9, 302, 156, 120, 16, { characters: 'Periode Laporan:', fill: '#64748B', fontSize: 10 });
  addNode('rectangle', 'Per Input', f9, 302, 172, 220, 30, { fill: '#F1F5F9', cornerRadius: 6 });
  addNode('text', 'Per Val', f9, 312, 178, 200, 16, { characters: '01 Nov 2026 - 16 Nov 2026', fill: '#0F172A', fontSize: 11 });

  addNode('text', 'Mod Label', f9, 546, 156, 120, 16, { characters: 'Kategori Laporan:', fill: '#64748B', fontSize: 10 });
  addNode('rectangle', 'Mod Input', f9, 546, 172, 240, 30, { fill: '#F1F5F9', cornerRadius: 6 });
  addNode('text', 'Mod Val', f9, 556, 178, 220, 16, { characters: 'Semua Kategori (Aset, Pinjam, Servis)', fill: '#0F172A', fontSize: 11 });

  addNode('rectangle', 'Btn Apply Filter', f9, 1264, 166, 136, 36, { fill: C.brandBlue, cornerRadius: 8 });
  addNode('text', 'Text Apply Filter', f9, 1264, 176, 136, 16, { characters: 'Terapkan Filter', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });

  // 3 Summary Widgets (w: 366 each, symmetrical with 21px gap)
  const lapSummaries = [
    { title: 'Total Biaya Pemeliharaan', val: 'Rp 18.450.000', sub: 'Pagu Rp 35 Juta (Serapan 52.7%)' },
    { title: 'Sirkulasi Peminjaman', val: '65 Transaksi', sub: '45 Selesai, 12 Jalan, 8 Review' },
    { title: 'Valuasi Inventaris Aktif', val: 'Rp 4.850.000.000', sub: '1.248 Unit (Kelayakan 94.2%)' }
  ];
  lapSummaries.forEach((ls, i) => {
    const x = 280 + i * (366 + 21);
    addNode('rectangle', `LSum Box ${i}`, f9, x, 226, 366, 86, { fill: '#FFFFFF', cornerRadius: 14, stroke: '#E2E8F0', strokeWeight: 1 });
    addNode('text', `LSum Title ${i}`, f9, x + 20, 238, 320, 16, { characters: ls.title, fill: '#64748B', fontSize: 11 });
    addNode('text', `LSum Val ${i}`, f9, x + 20, 254, 320, 22, { characters: ls.val, fill: '#0F172A', fontSize: 16, fontStyle: 'Bold' });
    addNode('text', `LSum Sub ${i}`, f9, x + 20, 278, 320, 16, { characters: ls.sub, fill: '#64748B', fontSize: 10 });
  });

  // Paper Sheet Preview
  addNode('rectangle', 'Paper Sheet', f9, 280, 328, 1140, 602, { fill: '#FFFFFF', cornerRadius: 16, stroke: '#CBD5E1', strokeWeight: 1 });
  addNode('text', 'Kop 1', f9, 280, 348, 1140, 20, { characters: 'KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI', fill: '#0F172A', fontSize: 12, fontStyle: 'Bold', textAlign: 'center' });
  addNode('text', 'Kop 2', f9, 280, 368, 1140, 24, { characters: 'UNIVERSITAS INDONESIA - BIRO SARANA & PRASARANA', fill: C.brandText, fontSize: 14, fontStyle: 'Bold', textAlign: 'center' });
  addNode('text', 'Kop 3', f9, 280, 392, 1140, 16, { characters: 'Gedung Rektorat Lt. 1, Kampus Baru UI Depok • Telp (021) 7867222 • Email: sarpras@ui.ac.id', fill: '#64748B', fontSize: 10, textAlign: 'center' });
  addNode('rectangle', 'Kop Line', f9, 320, 414, 1060, 2, { fill: '#0F172A' });

  addNode('text', 'Doc Title', f9, 280, 430, 1140, 22, { characters: 'LAPORAN REKAPITULASI PENGAWASAN SARPRAS KAMPUS - BULAN NOVEMBER 2026', fill: '#0F172A', fontSize: 13, fontStyle: 'Bold', textAlign: 'center' });
  addNode('text', 'Doc No', f9, 280, 452, 1140, 16, { characters: 'Nomor: 1148/UN2.R2/SARPRAS/XI/2026 • Klasifikasi: Terbuka Terbatas', fill: '#64748B', fontSize: 10, textAlign: 'center' });

  addNode('rectangle', 'Rep TH', f9, 320, 480, 1060, 36, { fill: '#F1F5F9' });
  addNode('text', 'RTH 1', f9, 340, 492, 200, 16, { characters: 'KOMPLEKS FAKULTAS', fill: '#0F172A', fontSize: 10, fontStyle: 'Bold' });
  addNode('text', 'RTH 2', f9, 560, 492, 140, 16, { characters: 'JUMLAH ASET', fill: '#0F172A', fontSize: 10, fontStyle: 'Bold' });
  addNode('text', 'RTH 3', f9, 720, 492, 180, 16, { characters: 'VALUASI BUKU', fill: '#0F172A', fontSize: 10, fontStyle: 'Bold' });
  addNode('text', 'RTH 4', f9, 920, 492, 160, 16, { characters: 'TIKET SERVIS', fill: '#0F172A', fontSize: 10, fontStyle: 'Bold' });
  addNode('text', 'RTH 5', f9, 1100, 492, 260, 16, { characters: 'STATUS AUDIT', fill: '#0F172A', fontSize: 10, fontStyle: 'Bold' });

  const repRows = [
    { fac: 'Fakultas Teknik (TI, Mesin, Elektro)', count: '542 Unit', val: 'Rp 2.037.000.000', tkt: '3 Pengerjaan', status: 'Lengkap & Terverifikasi', y: 524 },
    { fac: 'Fakultas MIPA & Kedokteran', count: '410 Unit', val: 'Rp 1.358.000.000', tkt: '1 Selesai', status: 'Lengkap & Terverifikasi', y: 564 },
    { fac: 'Gedung Rektorat & Aula Utama', count: '296 Unit', val: 'Rp 1.455.000.000', tkt: '1 Pengerjaan', status: 'Lengkap & Terverifikasi', y: 604 }
  ];
  repRows.forEach((rr, i) => {
    addNode('rectangle', `RR Bg ${i}`, f9, 320, rr.y, 1060, 36, { fill: (i % 2 === 0) ? '#FFFFFF' : '#F8FAFC' });
    addNode('text', `RR 1 ${i}`, f9, 340, rr.y + 10, 200, 16, { characters: rr.fac, fill: '#0F172A', fontSize: 11 });
    addNode('text', `RR 2 ${i}`, f9, 560, rr.y + 10, 140, 16, { characters: rr.count, fill: '#64748B', fontSize: 11 });
    addNode('text', `RR 3 ${i}`, f9, 720, rr.y + 10, 180, 16, { characters: rr.val, fill: '#0F172A', fontSize: 11, fontStyle: 'Bold' });
    addNode('text', `RR 4 ${i}`, f9, 920, rr.y + 10, 160, 16, { characters: rr.tkt, fill: C.brandBlue, fontSize: 11 });
    addNode('text', `RR 5 ${i}`, f9, 1100, rr.y + 10, 260, 16, { characters: `✓ ${rr.status}`, fill: '#15803D', fontSize: 11, fontStyle: 'Bold' });
  });

  addNode('text', 'Sign 1 Role', f9, 360, 700, 300, 16, { characters: 'Penanggung Jawab Operasional Sarpras,', fill: '#0F172A', fontSize: 11, textAlign: 'center' });
  addNode('text', 'Sign 1 Name', f9, 360, 770, 300, 18, { characters: 'Bambang Irawan, S.Kom', fill: '#0F172A', fontSize: 12, fontStyle: 'Bold', textAlign: 'center' });
  addNode('text', 'Sign 1 NIP', f9, 360, 788, 300, 16, { characters: 'NIP: 198506122010011003', fill: '#64748B', fontSize: 10, textAlign: 'center' });

  addNode('text', 'Sign 2 Role', f9, 1020, 700, 300, 16, { characters: 'Mengesahkan, Wakil Rektor II,', fill: '#0F172A', fontSize: 11, textAlign: 'center' });
  addNode('text', 'Sign 2 Name', f9, 1020, 770, 300, 18, { characters: 'Dr. Ir. Hendro Wicaksono, M.T.', fill: '#0F172A', fontSize: 12, fontStyle: 'Bold', textAlign: 'center' });
  addNode('text', 'Sign 2 NIP', f9, 1020, 788, 300, 16, { characters: 'NIP: 197403191999031001', fill: '#64748B', fontSize: 10, textAlign: 'center' });

  // 10. PORTAL LOGIN MULTI-ROLE
  const f10 = addNode('frame', '[M3] SIMAS - Portal Login Multi-Role', null, 1540, yRow3, 1440, 960, { fill: '#FFFFFF', clip: true });
  const lHero = addNode('frame', 'Login Hero Left', f10, 0, 0, 560, 960, { fill: '#0F2A71', clip: true });
  
  addNode('rectangle', 'Big Logo Bg', lHero, 60, 80, 64, 64, { fill: '#1E40AF', cornerRadius: 18 });
  addVector('Big Logo Vector', lHero, 76, 96, 32, 32,
    VP.layers, '#FFFFFF', 2.5
  );
  addNode('text', 'Big Brand Title', lHero, 140, 86, 380, 32, { characters: 'SIMAS', fill: '#FFFFFF', fontSize: 26, fontStyle: 'Bold' });
  addNode('text', 'Big Brand Sub', lHero, 140, 120, 380, 20, { characters: 'Sistem Informasi Sarana & Prasarana Kampus', fill: '#93C5FD', fontSize: 13 });

  addNode('text', 'Hero Headline', lHero, 60, 240, 440, 90, { characters: 'Tata Kelola Fasilitas, Ruangan, & Aset Terpadu Berbasis Digital.', fill: '#FFFFFF', fontSize: 24, fontStyle: 'Bold' });
  addNode('text', 'Hero Desc', lHero, 60, 346, 440, 60, { characters: 'Efisiensi peminjaman sarana, visibilitas okupansi ruangan real-time, dan manajemen servis preventif terintegrasi dalam satu platform kampus.', fill: '#BFDBFE', fontSize: 13 });

  const loginFeats = [
    { title: 'Otorisasi 4 Role RBAC', desc: 'Hak wewenang terpisah: Admin, Petugas, Pimpinan, dan Peminjam.' },
    { title: 'Pelacakan Aset & QR Code Tag', desc: 'Scan barcode inventaris untuk audit fisik & riwayat mutasi instan.' },
    { title: 'Audit Trail Transparan', desc: 'Setiap transaksi serah terima terarsip aman dalam basis data Laravel.' }
  ];
  loginFeats.forEach((lf, idx) => {
    const fy = 450 + idx * 90;
    addNode('ellipse', `Feat Dot ${idx}`, lHero, 60, fy + 4, 28, 28, { fill: '#1E40AF' });
    addNode('text', `Feat Check ${idx}`, lHero, 60, fy + 8, 28, 20, { characters: '✓', fill: '#93C5FD', fontSize: 13, fontStyle: 'Bold', textAlign: 'center' });
    addNode('text', `Feat Title ${idx}`, lHero, 102, fy, 400, 20, { characters: lf.title, fill: '#FFFFFF', fontSize: 13, fontStyle: 'Bold' });
    addNode('text', `Feat Desc ${idx}`, lHero, 102, fy + 22, 400, 36, { characters: lf.desc, fill: '#93C5FD', fontSize: 11 });
  });

  addNode('text', 'Hero Footer Version', lHero, 60, 890, 440, 20, { characters: 'SIMAS v2.4 • Universitas Indonesia • Arsitektur Laravel 11 MVC', fill: '#60A5FA', fontSize: 11 });

  const rForm = addNode('frame', 'Login Form Right', f10, 560, 0, 880, 960, { fill: '#F8FAFC', clip: true });
  addNode('text', 'Form Title', rForm, 100, 100, 680, 32, { characters: 'Masuk ke Portal SIMAS', fill: '#0F172A', fontSize: 24, fontStyle: 'Bold' });
  addNode('text', 'Form Sub', rForm, 100, 138, 680, 24, { characters: 'Gunakan akun Anda atau klik salah satu peran demo di bawah untuk mencoba:', fill: '#64748B', fontSize: 13 });

  const demoRoles = [
    { role: 'Admin Sarpras', user: 'admin', desc: 'Full Access 6 Modul', selected: true, x: 100, y: 180 },
    { role: 'Petugas Sarpras', user: 'petugas', desc: 'Teknisi Lapangan', selected: false, x: 450, y: 180 },
    { role: 'Pimpinan', user: 'pimpinan', desc: 'Eksekutif & SK Approval', selected: false, x: 100, y: 260 },
    { role: 'Peminjam', user: 'peminjam', desc: 'Dosen / Mahasiswa', selected: false, x: 450, y: 260 }
  ];
  demoRoles.forEach((dr, di) => {
    addNode('rectangle', `DR Box ${di}`, rForm, dr.x, dr.y, 330, 68, { fill: dr.selected ? '#EEF2FF' : '#FFFFFF', cornerRadius: 12, stroke: dr.selected ? C.brandBlue : '#CBD5E1', strokeWeight: dr.selected ? 1.5 : 1 });
    addNode('ellipse', `DR Dot ${di}`, rForm, dr.x + 16, dr.y + 24, 20, 20, { fill: dr.selected ? C.brandBlue : '#E2E8F0' });
    addNode('text', `DR Dot Mark ${di}`, rForm, dr.x + 16, dr.y + 26, 20, 16, { characters: dr.selected ? '✓' : '', fill: '#FFFFFF', fontSize: 11, fontStyle: 'Bold', textAlign: 'center' });
    addNode('text', `DR Name ${di}`, rForm, dr.x + 46, dr.y + 14, 270, 20, { characters: dr.role, fill: dr.selected ? C.brandBlue : '#0F172A', fontSize: 13, fontStyle: 'Bold' });
    addNode('text', `DR Desc ${di}`, rForm, dr.x + 46, dr.y + 36, 270, 16, { characters: `User: ${dr.user} • ${dr.desc}`, fill: '#64748B', fontSize: 11 });
  });

  addNode('text', 'Label User', rForm, 100, 360, 680, 20, { characters: 'Nama Pengguna (Username):', fill: '#0F172A', fontSize: 12, fontStyle: 'Bold' });
  addNode('rectangle', 'Input User Box', rForm, 100, 386, 680, 50, { fill: '#FFFFFF', cornerRadius: 10, stroke: '#CBD5E1', strokeWeight: 1 });
  addNode('text', 'Input User Val', rForm, 120, 400, 640, 22, { characters: 'admin', fill: '#0F172A', fontSize: 13 });

  addNode('text', 'Label Pass', rForm, 100, 456, 680, 20, { characters: 'Kata Sandi (Password):', fill: '#0F172A', fontSize: 12, fontStyle: 'Bold' });
  addNode('rectangle', 'Input Pass Box', rForm, 100, 482, 680, 50, { fill: '#FFFFFF', cornerRadius: 10, stroke: '#CBD5E1', strokeWeight: 1 });
  addNode('text', 'Input Pass Val', rForm, 120, 496, 600, 22, { characters: '••••••••••••', fill: '#0F172A', fontSize: 13 });

  addNode('text', 'Remember Text', rForm, 100, 552, 300, 20, { characters: '☑ Ingat sesi login saya', fill: '#475569', fontSize: 12 });
  addNode('text', 'Forgot Text', rForm, 580, 552, 200, 20, { characters: 'Lupa kata sandi?', fill: C.brandBlue, fontSize: 12, fontStyle: 'Bold', textAlign: 'right' });

  addNode('rectangle', 'Btn Login Big', rForm, 100, 596, 680, 54, { fill: C.brandBlue, cornerRadius: 12 });
  addNode('text', 'Btn Login Big Text', rForm, 100, 612, 680, 24, { characters: 'Masuk ke Portal SIMAS ➔', fill: '#FFFFFF', fontSize: 15, fontStyle: 'Bold', textAlign: 'center' });

  addNode('rectangle', 'Sec Box', rForm, 100, 686, 680, 80, { fill: '#F1F5F9', cornerRadius: 10 });
  addNode('text', 'Sec Title', rForm, 120, 700, 640, 18, { characters: 'Keamanan Sistem Terverifikasi:', fill: '#0F172A', fontSize: 11, fontStyle: 'Bold' });
  addNode('text', 'Sec Desc', rForm, 120, 720, 640, 36, { characters: 'Sesi dilindungi otentikasi JWT/Session Guard Laravel 11. Setiap aktivitas login & kegagalan sandi dicatat dalam log keamanan.', fill: '#64748B', fontSize: 10 });
}

// -------------------------------------------------------------------------
// RUN
// -------------------------------------------------------------------------
console.log('Generating complete suite of all 10 screens with balanced symmetry...');
buildDashboardAdmin();
buildDashboardPetugas();
buildDashboardPimpinan();
buildDashboardPeminjam();
buildRow2Modules();
buildRow3LaporanAndLogin();

const scriptPath = path.join(__dirname, 'scratch_simas_all_10_v4.json');
fs.writeFileSync(scriptPath, JSON.stringify(commands, null, 2));
console.log(`Generated ${commands.length} commands!`);

const outPath = 'C:\\Coding\\PWEB AISTUDIO\\simas_material3.figcraft';
console.log(`Executing figcraft-cli to generate ${outPath}...`);
try {
  const result = cp.execSync(`"C:\\Program Files\\ArtCraft\\FigCraft\\figcraft-cli.exe" run "${scriptPath}" --out "${outPath}"`, {
    maxBuffer: 1024 * 1024 * 100
  });
  console.log('SUCCESS! FigCraft CLI finished generating all 10 screens.');
} catch (e) {
  console.error('CLI Execution Error:', e.stdout?.toString() || e.message);
}
