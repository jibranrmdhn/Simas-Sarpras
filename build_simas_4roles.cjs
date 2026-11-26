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
// COLOR PALETTE & TOKENS (MATERIAL DESIGN 3 + SIMAS SIDEBAR STYLE)
// -------------------------------------------------------------------------
const C = {
  // Sidebar Colors (Exact match with user's uploaded image)
  sidebarBg: '#F0F5FB',
  sidebarBorder: '#E2E8F0',
  brandBlue: '#1342B8',
  brandText: '#0F2A71',
  subtitleText: '#64748B',
  
  // Role Card Box in Sidebar
  roleCardBg: '#DBE8FB',
  roleShieldText: '#0F2A71',
  rolePeranText: '#475569',
  btnGantiRoleBg: '#FFFFFF',
  btnGantiRoleBorder: '#CBD5E1',
  
  // Nav items
  navActiveBg: '#1342B8',
  navActiveText: '#FFFFFF',
  navInactiveText: '#334155',
  navInactiveHover: '#E2EDF9',
  
  // Main Content Surface (Material Design 3)
  surface: '#F8FAFC',
  surfaceCard: '#FFFFFF',
  surfaceCardBorder: '#E2E8F0',
  primary: '#1342B8',
  onPrimary: '#FFFFFF',
  primaryContainer: '#E0E7FF',
  onPrimaryContainer: '#1E1B4B',
  
  // Status Pill Containers (M3 Tonal)
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
// COMPONENT: FULL SIDEBAR (250px) - Sesuai Gambar User
// -------------------------------------------------------------------------
function createFullSidebar(screenRef, roleKey, roleTitle, rolePeranDesc, activeMenuId) {
  // Sidebar Frame
  const sb = addNode('frame', `Sidebar ${roleKey}`, screenRef, 0, 0, 250, 960, {
    fill: C.sidebarBg,
    stroke: C.sidebarBorder,
    strokeWeight: 1,
    clip: true
  });
  
  // 1. BRAND HEADER
  // Logo Icon Squircle
  addNode('rectangle', `Brand Logo Bg ${roleKey}`, sb, 20, 20, 42, 42, {
    fill: C.brandBlue,
    cornerRadius: 12
  });
  // Stacked Layer Icon Representation (3 layers)
  addNode('text', `Brand Icon ${roleKey}`, sb, 20, 28, 42, 26, {
    characters: '🥞',
    fontSize: 20,
    textAlign: 'center'
  });
  
  // Brand Text
  addNode('text', `Brand Title ${roleKey}`, sb, 70, 22, 160, 20, {
    characters: 'SIMAS',
    fill: C.brandText,
    fontSize: 16,
    fontStyle: 'Bold'
  });
  addNode('text', `Brand Subtitle ${roleKey}`, sb, 70, 42, 160, 16, {
    characters: 'Sistem Sarana & Prasarana',
    fill: C.subtitleText,
    fontSize: 10
  });
  
  // 2. ROLE SWITCHER CARD (Exact match with user image)
  const rc = addNode('rectangle', `Role Card ${roleKey}`, sb, 16, 76, 218, 58, {
    fill: C.roleCardBg,
    cornerRadius: 14
  });
  // Shield Icon
  addNode('text', `Role Shield ${roleKey}`, sb, 24, 94, 24, 24, {
    characters: '🛡️',
    fontSize: 16
  });
  // Peran label & Title
  addNode('text', `Role Peran ${roleKey}`, sb, 52, 84, 100, 16, {
    characters: `Peran: ${rolePeranDesc}`,
    fill: C.rolePeranText,
    fontSize: 10
  });
  addNode('text', `Role Name ${roleKey}`, sb, 52, 102, 104, 18, {
    characters: roleTitle,
    fill: C.brandText,
    fontSize: 12,
    fontStyle: 'Bold'
  });
  // Ganti Role Button
  addNode('rectangle', `Btn Ganti Role ${roleKey}`, sb, 158, 92, 68, 26, {
    fill: C.btnGantiRoleBg,
    cornerRadius: 8,
    stroke: C.btnGantiRoleBorder,
    strokeWeight: 1
  });
  addNode('text', `Text Ganti Role ${roleKey}`, sb, 158, 98, 68, 14, {
    characters: 'Ganti Role',
    fill: C.brandText,
    fontSize: 10,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  
  // 3. NAVIGATION MENU LIST
  // List menu standard (6 Menu) vs Peminjam (4 Menu)
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
      // Active Pill Button (Biru tua pekat)
      addNode('rectangle', `Nav Pill ${roleKey} ${m.id}`, sb, 16, yPos, 218, 44, {
        fill: C.navActiveBg,
        cornerRadius: 12
      });
      addNode('text', `Nav Icon ${roleKey} ${m.id}`, sb, 28, yPos + 12, 24, 20, {
        characters: m.icon,
        fill: C.navActiveText,
        fontSize: 16
      });
      addNode('text', `Nav Label ${roleKey} ${m.id}`, sb, 56, yPos + 14, 160, 20, {
        characters: m.label,
        fill: C.navActiveText,
        fontSize: 13,
        fontStyle: 'Bold'
      });
    } else {
      // Inactive Item
      addNode('text', `Nav Icon ${roleKey} ${m.id}`, sb, 28, yPos + 12, 24, 20, {
        characters: m.icon,
        fill: C.navInactiveText,
        fontSize: 16
      });
      addNode('text', `Nav Label ${roleKey} ${m.id}`, sb, 56, yPos + 14, 160, 20, {
        characters: m.label,
        fill: C.navInactiveText,
        fontSize: 13
      });
    }
  });
  
  return sb;
}

// -------------------------------------------------------------------------
// COMPONENT: TOP APP BAR (Width: 1190px, x: 250px)
// -------------------------------------------------------------------------
function createTopBar(screenRef, roleKey, title, subtitle, userName, userRole) {
  const tb = addNode('frame', `TopBar ${roleKey}`, screenRef, 250, 0, 1190, 72, {
    fill: '#FFFFFF',
    stroke: C.sidebarBorder,
    strokeWeight: 1,
    clip: true
  });
  
  // Title & Subtitle
  addNode('text', `TB Title ${roleKey}`, tb, 28, 14, 450, 24, {
    characters: title,
    fill: '#0F172A',
    fontSize: 18,
    fontStyle: 'Bold'
  });
  addNode('text', `TB Sub ${roleKey}`, tb, 28, 40, 450, 18, {
    characters: subtitle,
    fill: '#64748B',
    fontSize: 11
  });
  
  // Search Bar
  addNode('rectangle', `TB Search ${roleKey}`, tb, 510, 14, 340, 44, {
    fill: '#F1F5F9',
    cornerRadius: 22
  });
  addNode('text', `TB Search Text ${roleKey}`, tb, 532, 26, 300, 20, {
    characters: '🔍 Cari data di dashboard ini...',
    fill: '#94A3B8',
    fontSize: 12
  });
  
  // Notification Bell
  addNode('rectangle', `TB Notif ${roleKey}`, tb, 870, 16, 40, 40, {
    fill: '#F8FAFC',
    cornerRadius: 20,
    stroke: '#E2E8F0',
    strokeWeight: 1
  });
  addNode('text', `TB Bell ${roleKey}`, tb, 870, 26, 40, 20, {
    characters: '🔔',
    fontSize: 16,
    textAlign: 'center'
  });
  addNode('ellipse', `TB Dot ${roleKey}`, tb, 896, 20, 8, 8, {
    fill: '#EF4444'
  });
  
  // User Profile Pill
  addNode('rectangle', `TB Profile ${roleKey}`, tb, 930, 14, 230, 44, {
    fill: '#EFF6FF',
    cornerRadius: 22,
    stroke: '#BFDBFE',
    strokeWeight: 1
  });
  addNode('ellipse', `TB Avatar ${roleKey}`, tb, 936, 20, 32, 32, {
    fill: C.brandBlue
  });
  addNode('text', `TB Initials ${roleKey}`, tb, 936, 28, 32, 16, {
    characters: userName.split(' ').map(n => n[0]).slice(0, 2).join(''),
    fill: '#FFFFFF',
    fontSize: 11,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  addNode('text', `TB Name ${roleKey}`, tb, 976, 20, 140, 16, {
    characters: userName,
    fill: '#0F172A',
    fontSize: 12,
    fontStyle: 'Bold'
  });
  addNode('text', `TB Role ${roleKey}`, tb, 976, 36, 140, 14, {
    characters: userRole,
    fill: C.brandBlue,
    fontSize: 10
  });
  
  return tb;
}


// =========================================================================
// FRAME 1: ROLE 1 - ADMIN SARPRAS (Full Access 6 Menu)
// =========================================================================
const f1 = addNode('frame', '[M3] SIMAS - Dashboard Admin Sarpras', null, 0, 0, 1440, 960, {
  fill: C.surface,
  clip: true
});

createFullSidebar(f1, 'admin', 'Admin Sarpras', 'Full Access', 'dashboard');
createTopBar(f1, 'admin', 'Dashboard Eksekutif Admin Sarpras', 'Kontrol Penuh 6 Menu • Master Aset, Ruangan, Approval, Kanban, Laporan', 'Bambang Irawan', 'Admin Sarpras (Full Control)');

// Banner Welcome Admin
addNode('rectangle', 'Banner Admin', f1, 274, 88, 1142, 80, {
  fill: '#EEF2FF',
  cornerRadius: 18,
  stroke: '#C7D2FE',
  strokeWeight: 1
});
addNode('text', 'Banner Admin Title', f1, 296, 102, 700, 24, {
  characters: 'Selamat Datang, Bambang Irawan, S.Kom! (Admin Sarpras) 👑',
  fill: '#1E1B4B',
  fontSize: 17,
  fontStyle: 'Bold'
});
addNode('text', 'Banner Admin Sub', f1, 296, 128, 700, 20, {
  characters: 'Wewenang Penuh: Tambah/Edit/Hapus Aset, Setujui Pinjaman, Kelola Tiket Kanban, & Rekap Cetak Laporan.',
  fill: '#4338CA',
  fontSize: 12
});
// Quick Action Buttons
addNode('rectangle', 'Btn Action 1 Admin', f1, 1080, 106, 150, 42, {
  fill: C.brandBlue,
  cornerRadius: 12
});
addNode('text', 'Btn Action 1 Text Admin', f1, 1080, 118, 150, 20, {
  characters: '+ Tambah Aset Baru',
  fill: '#FFFFFF',
  fontSize: 11,
  fontStyle: 'Bold',
  textAlign: 'center'
});
addNode('rectangle', 'Btn Action 2 Admin', f1, 1242, 106, 150, 42, {
  fill: '#FFFFFF',
  cornerRadius: 12,
  stroke: '#CBD5E1',
  strokeWeight: 1
});
addNode('text', 'Btn Action 2 Text Admin', f1, 1242, 118, 150, 20, {
  characters: '🖨️ Cetak Laporan',
  fill: '#0F172A',
  fontSize: 11,
  fontStyle: 'Bold',
  textAlign: 'center'
});

// 4 KPI Cards Admin
const kpisAdmin = [
  { title: 'Total Master Aset', val: '1.248 Unit', sub: 'Valuasi: Rp 4,85 Miliar', badge: '94% Kondisi Baik', bg: C.successBg, tc: C.successText, icon: '📦' },
  { title: 'Okupansi Ruangan', val: '42 / 56', sub: '75% Kapasitas Terisi', badge: '14 Ruang Kosong', bg: C.infoBg, tc: C.infoText, icon: '🏢' },
  { title: 'Antrean Pinjaman', val: '8 Pengajuan', sub: '4 Butuh Approval Admin', badge: 'Tindakan Cepat', bg: C.warningBg, tc: C.warningText, icon: '📋' },
  { title: 'Tiket Perbaikan', val: '5 Pengerjaan', sub: 'Biaya: Rp 4.250.000', badge: '2 Selesai Hari Ini', bg: C.purpleBg, tc: C.purpleText, icon: '🔧' }
];

kpisAdmin.forEach((k, i) => {
  const x = 274 + i * (272 + 18);
  addNode('rectangle', `KPI Admin ${i}`, f1, x, 182, 272, 128, {
    fill: '#FFFFFF',
    cornerRadius: 16,
    stroke: '#E2E8F0',
    strokeWeight: 1
  });
  addNode('rectangle', `KPI Icon Box Admin ${i}`, f1, x + 16, 198, 42, 42, {
    fill: '#F1F5F9',
    cornerRadius: 12
  });
  addNode('text', `KPI Icon Admin ${i}`, f1, x + 16, 208, 42, 24, {
    characters: k.icon,
    fontSize: 20,
    textAlign: 'center'
  });
  addNode('text', `KPI Title Admin ${i}`, f1, x + 66, 198, 190, 16, {
    characters: k.title,
    fill: '#64748B',
    fontSize: 11
  });
  addNode('text', `KPI Val Admin ${i}`, f1, x + 66, 214, 190, 26, {
    characters: k.val,
    fill: '#0F172A',
    fontSize: 19,
    fontStyle: 'Bold'
  });
  addNode('text', `KPI Sub Admin ${i}`, f1, x + 16, 252, 240, 16, {
    characters: k.sub,
    fill: '#64748B',
    fontSize: 10
  });
  addNode('rectangle', `KPI Badge Bg Admin ${i}`, f1, x + 16, 276, 130, 22, {
    fill: k.bg,
    cornerRadius: 6
  });
  addNode('text', `KPI Badge Text Admin ${i}`, f1, x + 16, 280, 130, 16, {
    characters: k.badge,
    fill: k.tc,
    fontSize: 10,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
});

// Dual Big Cards Admin
// Left Card: Permohonan Pinjaman (Approval wewenang admin)
addNode('rectangle', 'Loan Card Admin', f1, 274, 324, 700, 608, {
  fill: '#FFFFFF',
  cornerRadius: 18,
  stroke: '#E2E8F0',
  strokeWeight: 1
});
addNode('text', 'Loan Card Header Admin', f1, 296, 346, 400, 22, {
  characters: 'Otorisasi & Approval Permohonan Peminjaman',
  fill: '#0F172A',
  fontSize: 15,
  fontStyle: 'Bold'
});
addNode('text', 'Loan Card Sub Admin', f1, 296, 370, 400, 18, {
  characters: 'Admin Sarpras berwenang menyetujui, menolak, & menerbitkan SPK',
  fill: '#64748B',
  fontSize: 11
});

// 4 Loan items with Tolak / Setujui buttons
const adminLoans = [
  { name: 'Budi Santoso, M.Kom (Dosen TI)', item: '2x Proyektor Epson & Laser Pointer', time: '17 Nov 2026 (08:00 - 14:00)', y: 404, status: 'Menunggu' },
  { name: 'Siti Rahmawati (Ketua BEM Univ)', item: 'Gedung Aula Utama & Sound System Yamaha', time: '19-20 Nov 2026 (2 Hari Penuh)', y: 520, status: 'Menunggu' },
  { name: 'Dimas Arya (Himpunan Elektro)', item: '5x Solder Station & 2x Multimeter Fluke', time: '18 Nov 2026 (09:00 - 16:00)', y: 636, status: 'Menunggu' },
  { name: 'Laboratorium Rekayasa Perangkat Lunak', item: '10x Kabel LAN Cat6 & 1x Switch Cisco', time: '16 Nov 2026 (Digunakan Sekarang)', y: 752, status: 'Disetujui' }
];

adminLoans.forEach((l, i) => {
  addNode('rectangle', `Loan Row Box Admin ${i}`, f1, 296, l.y, 656, 102, {
    fill: '#F8FAFC',
    cornerRadius: 14,
    stroke: '#E2E8F0',
    strokeWeight: 1
  });
  addNode('text', `Loan Name Admin ${i}`, f1, 312, l.y + 14, 380, 20, {
    characters: l.name,
    fill: '#0F172A',
    fontSize: 13,
    fontStyle: 'Bold'
  });
  addNode('text', `Loan Item Admin ${i}`, f1, 312, l.y + 36, 380, 18, {
    characters: `Sarana: ${l.item}`,
    fill: C.brandBlue,
    fontSize: 11,
    fontStyle: 'Bold'
  });
  addNode('text', `Loan Time Admin ${i}`, f1, 312, l.y + 56, 380, 16, {
    characters: `Jadwal: ${l.time}`,
    fill: '#64748B',
    fontSize: 10
  });
  
  if (l.status === 'Menunggu') {
    // Tombol Tolak
    addNode('rectangle', `Btn Tolak Admin ${i}`, f1, 740, l.y + 34, 90, 36, {
      fill: C.errorBg,
      cornerRadius: 10
    });
    addNode('text', `Text Tolak Admin ${i}`, f1, 740, l.y + 44, 90, 16, {
      characters: '✕ Tolak',
      fill: C.errorText,
      fontSize: 11,
      fontStyle: 'Bold',
      textAlign: 'center'
    });
    // Tombol Setujui
    addNode('rectangle', `Btn Setuju Admin ${i}`, f1, 842, l.y + 34, 96, 36, {
      fill: C.brandBlue,
      cornerRadius: 10
    });
    addNode('text', `Text Setuju Admin ${i}`, f1, 842, l.y + 44, 96, 16, {
      characters: '✓ Setujui',
      fill: '#FFFFFF',
      fontSize: 11,
      fontStyle: 'Bold',
      textAlign: 'center'
    });
  } else {
    addNode('rectangle', `Badge OK Admin ${i}`, f1, 780, l.y + 36, 150, 32, {
      fill: C.successBg,
      cornerRadius: 8
    });
    addNode('text', `Text OK Admin ${i}`, f1, 780, l.y + 44, 150, 16, {
      characters: '✓ Disetujui (SPK Terbit)',
      fill: C.successText,
      fontSize: 10,
      fontStyle: 'Bold',
      textAlign: 'center'
    });
  }
});

// Right Card: Kanban Snapshot & Log Aktivitas Admin
addNode('rectangle', 'Kanban Card Admin', f1, 990, 324, 426, 608, {
  fill: '#FFFFFF',
  cornerRadius: 18,
  stroke: '#E2E8F0',
  strokeWeight: 1
});
addNode('text', 'Kanban Card Header Admin', f1, 1012, 346, 300, 22, {
  characters: 'Kanban Pemeliharaan & Audit Trail',
  fill: '#0F172A',
  fontSize: 15,
  fontStyle: 'Bold'
});
addNode('text', 'Kanban Card Sub Admin', f1, 1012, 370, 300, 18, {
  characters: 'Monitoring teknisi Joko S. & riwayat perubahan',
  fill: '#64748B',
  fontSize: 11
});

// 3 Kanban mini cards
const adminKanban = [
  { code: 'TKT-012', name: 'AC Daikin R. Seminar', tech: 'Teknisi: Joko S.', status: 'Pengerjaan (75%)', cost: 'Rp 850.000', y: 404 },
  { code: 'TKT-014', name: 'PC Lab Multimedia 04', tech: 'Teknisi: Vendor Asus', status: 'Tunggu Sparepart', cost: 'Garansi Rp 0', y: 504 },
  { code: 'TKT-009', name: 'Genset Cummins 150 kVA', tech: 'Teknisi: Tim Sarpras', status: 'Selesai Uji Coba', cost: 'Rp 3.400.000', y: 604 }
];

adminKanban.forEach((t, i) => {
  addNode('rectangle', `KB Box Admin ${i}`, f1, 1012, t.y, 382, 88, {
    fill: '#F8FAFC',
    cornerRadius: 12,
    stroke: '#E2E8F0',
    strokeWeight: 1
  });
  addNode('text', `KB Code Admin ${i}`, f1, 1026, t.y + 12, 100, 16, {
    characters: t.code,
    fill: C.brandBlue,
    fontSize: 10,
    fontStyle: 'Bold'
  });
  addNode('text', `KB Status Admin ${i}`, f1, 1240, t.y + 12, 140, 16, {
    characters: t.status,
    fill: '#B45309',
    fontSize: 10,
    fontStyle: 'Bold',
    textAlign: 'right'
  });
  addNode('text', `KB Name Admin ${i}`, f1, 1026, t.y + 30, 260, 20, {
    characters: t.name,
    fill: '#0F172A',
    fontSize: 12,
    fontStyle: 'Bold'
  });
  addNode('text', `KB Tech Admin ${i}`, f1, 1026, t.y + 54, 200, 16, {
    characters: t.tech,
    fill: '#64748B',
    fontSize: 10
  });
  addNode('text', `KB Cost Admin ${i}`, f1, 1240, t.y + 54, 140, 16, {
    characters: t.cost,
    fill: '#0F172A',
    fontSize: 11,
    fontStyle: 'Bold',
    textAlign: 'right'
  });
});

// Live Audit Log
addNode('text', 'Audit Title Admin', f1, 1012, 712, 200, 18, {
  characters: 'Live Audit Log (Sistem Keamanan):',
  fill: '#0F172A',
  fontSize: 12,
  fontStyle: 'Bold'
});

const auditLogs = [
  '• 10:45 WIB: Bambang (Admin) menyetujui pinjaman #PINJ-088',
  '• 09:20 WIB: Joko (Petugas) verifikasi pengembalian proyektor',
  '• 08:15 WIB: Dr. Hendro (Pimpinan) mengesahkan laporan triwulan',
  '• 07:50 WIB: Budi (Peminjam) mengajukan izin Ruang Seminar'
];

auditLogs.forEach((a, i) => {
  addNode('text', `Audit Row Admin ${i}`, f1, 1012, 736 + i * 28, 382, 24, {
    characters: a,
    fill: '#475569',
    fontSize: 10
  });
});


// =========================================================================
// FRAME 2: ROLE 2 - PETUGAS SARPRAS (Joko S. - Teknisi & Operasional)
// =========================================================================
const f2 = addNode('frame', '[M3] SIMAS - Dashboard Petugas Sarpras', null, 1540, 0, 1440, 960, {
  fill: C.surface,
  clip: true
});

createFullSidebar(f2, 'petugas', 'Petugas Sarpras', 'Teknisi Lapangan', 'dashboard');
createTopBar(f2, 'petugas', 'Dashboard Operasional Petugas & Teknisi', 'Inspeksi Sarana • Verifikasi Pengembalian Fisik • Eksekusi Servis Kanban', 'Joko Supriyanto', 'Petugas Sarpras (Teknisi Lapangan)');

// Banner Petugas
addNode('rectangle', 'Banner Petugas', f2, 274, 88, 1142, 80, {
  fill: '#ECFDF5',
  cornerRadius: 18,
  stroke: '#A7F3D0',
  strokeWeight: 1
});
addNode('text', 'Banner Petugas Title', f2, 296, 102, 700, 24, {
  characters: 'Halo, Joko Supriyanto, A.Md! (Teknisi Sarpras) 🛠️',
  fill: '#064E3B',
  fontSize: 17,
  fontStyle: 'Bold'
});
addNode('text', 'Banner Petugas Sub', f2, 296, 128, 800, 20, {
  characters: 'Wewenang Petugas: Cek fisik aset, verifikasi barang kembali, update Kanban & nota perbaikan. (Dilarang menghapus aset).',
  fill: '#047857',
  fontSize: 12
});
// Action Petugas
addNode('rectangle', 'Btn Action Petugas', f2, 1180, 106, 212, 42, {
  fill: '#059669',
  cornerRadius: 12
});
addNode('text', 'Btn Action Text Petugas', f2, 1180, 118, 212, 20, {
  characters: '+ Catat Kerusakan Baru',
  fill: '#FFFFFF',
  fontSize: 12,
  fontStyle: 'Bold',
  textAlign: 'center'
});

// 4 KPI Petugas
const kpisPetugas = [
  { title: 'Tugas Servis Saya', val: '4 Tiket', sub: '2 Prioritas Mendesak Hari Ini', badge: 'Kerjakan Sekarang', bg: C.warningBg, tc: C.warningText, icon: '🔧' },
  { title: 'Cek Barang Kembali', val: '3 Item', sub: 'Menunggu Pemeriksaan Fisik', badge: 'Perlu Verifikasi', bg: C.errorBg, tc: C.errorText, icon: '📥' },
  { title: 'Aset Butuh Servis', val: '8 Unit', sub: 'AC, Proyektor & Kabel Lab', badge: 'Antrean Bengkel', bg: C.infoBg, tc: C.infoText, icon: '⚙️' },
  { title: 'Suku Cadang Terpakai', val: 'Rp 1.450.000', sub: 'Nota Pembelian Terverifikasi', badge: 'Klaim APBN', bg: C.purpleBg, tc: C.purpleText, icon: '🧾' }
];

kpisPetugas.forEach((k, i) => {
  const x = 274 + i * (272 + 18);
  addNode('rectangle', `KPI Petugas ${i}`, f2, x, 182, 272, 128, {
    fill: '#FFFFFF',
    cornerRadius: 16,
    stroke: '#E2E8F0',
    strokeWeight: 1
  });
  addNode('rectangle', `KPI Icon Box Petugas ${i}`, f2, x + 16, 198, 42, 42, {
    fill: '#F1F5F9',
    cornerRadius: 12
  });
  addNode('text', `KPI Icon Petugas ${i}`, f2, x + 16, 208, 42, 24, {
    characters: k.icon,
    fontSize: 20,
    textAlign: 'center'
  });
  addNode('text', `KPI Title Petugas ${i}`, f2, x + 66, 198, 190, 16, {
    characters: k.title,
    fill: '#64748B',
    fontSize: 11
  });
  addNode('text', `KPI Val Petugas ${i}`, f2, x + 66, 214, 190, 26, {
    characters: k.val,
    fill: '#0F172A',
    fontSize: 19,
    fontStyle: 'Bold'
  });
  addNode('text', `KPI Sub Petugas ${i}`, f2, x + 16, 252, 240, 16, {
    characters: k.sub,
    fill: '#64748B',
    fontSize: 10
  });
  addNode('rectangle', `KPI Badge Bg Petugas ${i}`, f2, x + 16, 276, 140, 22, {
    fill: k.bg,
    cornerRadius: 6
  });
  addNode('text', `KPI Badge Text Petugas ${i}`, f2, x + 16, 280, 140, 16, {
    characters: k.badge,
    fill: k.tc,
    fontSize: 10,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
});

// Dual Big Cards Petugas
// Left: Meja Kerja Verifikasi Pengembalian Fisik
addNode('rectangle', 'Return Desk Petugas', f2, 274, 324, 680, 608, {
  fill: '#FFFFFF',
  cornerRadius: 18,
  stroke: '#E2E8F0',
  strokeWeight: 1
});
addNode('text', 'Return Title Petugas', f2, 296, 346, 400, 22, {
  characters: 'Meja Verifikasi Pengembalian Sarana (Check-In Desk)',
  fill: '#0F172A',
  fontSize: 15,
  fontStyle: 'Bold'
});
addNode('text', 'Return Sub Petugas', f2, 296, 370, 450, 18, {
  characters: 'Periksa kelengkapan, fungsi tombol, & kebersihan sebelum disimpan kembali',
  fill: '#64748B',
  fontSize: 11
});

const returnItems = [
  { peminjam: 'Budi Santoso (Dosen TI)', item: 'Proyektor Epson EB-X500', cond: 'Kabel lengkap, lensa bersih', y: 404, status: 'Siap Verifikasi' },
  { peminjam: 'Siti Rahma (Ketua BEM)', item: '2x Mic Wireless Shure & Kabel XLR', cond: 'Baterai habis, fisik utuh', y: 520, status: 'Siap Verifikasi' },
  { peminjam: 'Dimas Arya (Mhs Elektro)', item: 'Kamera Sony A6400 Kit & Tripod', cond: 'Tutup lensa tertinggal di Lab', y: 636, status: 'Perlu Catatan' },
  { peminjam: 'Laboratorium MIPA', item: '1x Tabung Oksigen & Regulator', cond: 'Kondisi 100% normal', y: 752, status: 'Telah Kembali' }
];

returnItems.forEach((r, i) => {
  addNode('rectangle', `Return Row Petugas ${i}`, f2, 296, r.y, 636, 102, {
    fill: '#F8FAFC',
    cornerRadius: 14,
    stroke: '#E2E8F0',
    strokeWeight: 1
  });
  addNode('text', `Return Name Petugas ${i}`, f2, 312, r.y + 14, 340, 20, {
    characters: r.peminjam,
    fill: '#0F172A',
    fontSize: 13,
    fontStyle: 'Bold'
  });
  addNode('text', `Return Item Petugas ${i}`, f2, 312, r.y + 36, 340, 18, {
    characters: `Barang: ${r.item}`,
    fill: '#059669',
    fontSize: 11,
    fontStyle: 'Bold'
  });
  addNode('text', `Return Cond Petugas ${i}`, f2, 312, r.y + 56, 340, 16, {
    characters: `Catatan Fisik: ${r.cond}`,
    fill: '#64748B',
    fontSize: 10
  });
  
  if (r.status === 'Siap Verifikasi') {
    addNode('rectangle', `Btn Return Petugas ${i}`, f2, 700, r.y + 34, 218, 36, {
      fill: '#059669',
      cornerRadius: 10
    });
    addNode('text', `Text Return Petugas ${i}`, f2, 700, r.y + 44, 218, 16, {
      characters: '✓ Konfirmasi Kembali (Layak)',
      fill: '#FFFFFF',
      fontSize: 11,
      fontStyle: 'Bold',
      textAlign: 'center'
    });
  } else if (r.status === 'Perlu Catatan') {
    addNode('rectangle', `Btn Note Petugas ${i}`, f2, 700, r.y + 34, 218, 36, {
      fill: C.warningBg,
      cornerRadius: 10
    });
    addNode('text', `Text Note Petugas ${i}`, f2, 700, r.y + 44, 218, 16, {
      characters: '⚠️ Catat Kelengkapan Hilang',
      fill: C.warningText,
      fontSize: 11,
      fontStyle: 'Bold',
      textAlign: 'center'
    });
  } else {
    addNode('rectangle', `Btn Done Petugas ${i}`, f2, 740, r.y + 34, 178, 36, {
      fill: '#E2E8F0',
      cornerRadius: 10
    });
    addNode('text', `Text Done Petugas ${i}`, f2, 740, r.y + 44, 178, 16, {
      characters: 'Selesai di Gudang',
      fill: '#475569',
      fontSize: 11,
      textAlign: 'center'
    });
  }
});

// Right: Tiket Perbaikan Aktif Ditugaskan ke Joko
addNode('rectangle', 'Tech Tickets Petugas', f2, 970, 324, 446, 608, {
  fill: '#FFFFFF',
  cornerRadius: 18,
  stroke: '#E2E8F0',
  strokeWeight: 1
});
addNode('text', 'Tech Title Petugas', f2, 992, 346, 350, 22, {
  characters: 'Tiket Perbaikan Ditugaskan Ke Anda',
  fill: '#0F172A',
  fontSize: 15,
  fontStyle: 'Bold'
});
addNode('text', 'Tech Sub Petugas', f2, 992, 370, 350, 18, {
  characters: 'Eksekusi perbaikan teknis & laporkan nota suku cadang',
  fill: '#64748B',
  fontSize: 11
});

const myTasks = [
  { code: 'TKT-012', title: 'AC Daikin Ruang Seminar', prog: '75%', desc: 'Ganti kapasitor blower & tambah freon R32', btn: '+ Update Selesai 100%', y: 404 },
  { code: 'TKT-017', title: 'Proyektor BenQ Lab TI 02', prog: '20%', desc: 'Lampu mati mendadak saat kuliah umum', btn: 'Input Nota Part', y: 536 },
  { code: 'TKT-019', title: 'Kabel Audio Jack Aula', prog: '0%', desc: 'Kabel putus tertarik saat latihan paduan suara', btn: 'Mulai Pengerjaan', y: 668 }
];

myTasks.forEach((m, i) => {
  addNode('rectangle', `Task Box Petugas ${i}`, f2, 992, m.y, 402, 118, {
    fill: '#F8FAFC',
    cornerRadius: 14,
    stroke: '#E2E8F0',
    strokeWeight: 1
  });
  addNode('text', `Task Code Petugas ${i}`, f2, 1008, m.y + 12, 120, 16, {
    characters: m.code,
    fill: '#059669',
    fontSize: 11,
    fontStyle: 'Bold'
  });
  addNode('text', `Task Prog Petugas ${i}`, f2, 1270, m.y + 12, 110, 16, {
    characters: `Progres: ${m.prog}`,
    fill: '#0F172A',
    fontSize: 11,
    fontStyle: 'Bold',
    textAlign: 'right'
  });
  addNode('text', `Task Title Petugas ${i}`, f2, 1008, m.y + 32, 280, 20, {
    characters: m.title,
    fill: '#0F172A',
    fontSize: 13,
    fontStyle: 'Bold'
  });
  addNode('text', `Task Desc Petugas ${i}`, f2, 1008, m.y + 54, 370, 16, {
    characters: m.desc,
    fill: '#64748B',
    fontSize: 10
  });
  
  // Action Button
  addNode('rectangle', `Btn Task Petugas ${i}`, f2, 1008, m.y + 76, 370, 32, {
    fill: C.brandBlue,
    cornerRadius: 8
  });
  addNode('text', `Text Task Petugas ${i}`, f2, 1008, m.y + 84, 370, 16, {
    characters: m.btn,
    fill: '#FFFFFF',
    fontSize: 11,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
});

// Notice Bar RBAC Petugas
addNode('rectangle', 'Notice Petugas', f2, 992, 804, 402, 108, {
  fill: '#FEF2F2',
  cornerRadius: 12,
  stroke: '#FCA5A5',
  strokeWeight: 1
});
addNode('text', 'Notice Petugas Title', f2, 1008, 818, 370, 18, {
  characters: '🔒 Batasan Wewenang (RBAC Petugas):',
  fill: '#991B1B',
  fontSize: 11,
  fontStyle: 'Bold'
});
addNode('text', 'Notice Petugas Content', f2, 1008, 840, 370, 60, {
  characters: '• Petugas tidak diizinkan menghapus master aset dari sistem.\n• Petugas tidak memiliki tombol Approve pinjaman (wewenang Pimpinan/Admin).\n• Seluruh catatan kondisi fisik akan tersinkron ke log peminjaman.',
  fill: '#B91C1C',
  fontSize: 10
});


// =========================================================================
// FRAME 3: ROLE 3 - PIMPINAN INSTITUSI (Dr. Hendro - Eksekutif & Otorisasi)
// =========================================================================
const f3 = addNode('frame', '[M3] SIMAS - Dashboard Pimpinan Institusi', null, 3080, 0, 1440, 960, {
  fill: C.surface,
  clip: true
});

createFullSidebar(f3, 'pimpinan', 'Pimpinan Institusi', 'Eksekutif & Approval', 'dashboard');
createTopBar(f3, 'pimpinan', 'Dashboard Eksekutif & Otorisasi Pimpinan', 'Valuasi Aset • Persetujuan Fasilitas Strategis • Pengesahan Laporan', 'Dr. Ir. Hendro Wicaksono', 'Pimpinan Institusi (Eksekutif)');

// Banner Pimpinan
addNode('rectangle', 'Banner Pimpinan', f3, 274, 88, 1142, 80, {
  fill: '#FAF5FF',
  cornerRadius: 18,
  stroke: '#E9D5FF',
  strokeWeight: 1
});
addNode('text', 'Banner Pimpinan Title', f3, 296, 102, 700, 24, {
  characters: 'Selamat Pagi, Dr. Ir. Hendro Wicaksono, M.T. (Wakil Rektor II) 🏛️',
  fill: '#581C87',
  fontSize: 17,
  fontStyle: 'Bold'
});
addNode('text', 'Banner Pimpinan Sub', f3, 296, 128, 700, 20, {
  characters: 'Otorisasi Eksekutif: Memantau nilai & okupansi sarpras, menyetujui peminjaman strategis, & mengesahkan laporan audit.',
  fill: '#7E22CE',
  fontSize: 12
});
addNode('rectangle', 'Btn Action Pimpinan', f3, 1180, 106, 212, 42, {
  fill: '#7E22CE',
  cornerRadius: 12
});
addNode('text', 'Btn Action Text Pimpinan', f3, 1180, 118, 212, 20, {
  characters: '🖋️ Pengesahan Dokumen (2)',
  fill: '#FFFFFF',
  fontSize: 12,
  fontStyle: 'Bold',
  textAlign: 'center'
});

// 4 KPI Pimpinan
const kpisPimpinan = [
  { title: 'Total Valuasi Aset', val: 'Rp 4,85 Miliar', sub: 'Inventaris Tercatat 1.248 Unit', badge: 'Audit BPK Clean', bg: C.successBg, tc: C.successText, icon: '🏛️' },
  { title: 'Rasio Keterpakaian', val: '78.5%', sub: 'Pemanfaatan Ruang Rapat & Aula', badge: 'Efisiensi Tinggi', bg: C.infoBg, tc: C.infoText, icon: '📊' },
  { title: 'Otorisasi Pinjam', val: '3 Permohonan', sub: 'Aula Utama & Bus Kampus', badge: 'Perlu SK Pimpinan', bg: C.warningBg, tc: C.warningText, icon: '📜' },
  { title: 'Serapan Biaya Servis', val: 'Rp 18.450.000', sub: 'Pagu Anggaran: Rp 35.000.000', badge: 'Serapan 52.7%', bg: C.purpleBg, tc: C.purpleText, icon: '💰' }
];

kpisPimpinan.forEach((k, i) => {
  const x = 274 + i * (272 + 18);
  addNode('rectangle', `KPI Pimpinan ${i}`, f3, x, 182, 272, 128, {
    fill: '#FFFFFF',
    cornerRadius: 16,
    stroke: '#E2E8F0',
    strokeWeight: 1
  });
  addNode('rectangle', `KPI Icon Box Pimpinan ${i}`, f3, x + 16, 198, 42, 42, {
    fill: '#F1F5F9',
    cornerRadius: 12
  });
  addNode('text', `KPI Icon Pimpinan ${i}`, f3, x + 16, 208, 42, 24, {
    characters: k.icon,
    fontSize: 20,
    textAlign: 'center'
  });
  addNode('text', `KPI Title Pimpinan ${i}`, f3, x + 66, 198, 190, 16, {
    characters: k.title,
    fill: '#64748B',
    fontSize: 11
  });
  addNode('text', `KPI Val Pimpinan ${i}`, f3, x + 66, 214, 190, 26, {
    characters: k.val,
    fill: '#0F172A',
    fontSize: 19,
    fontStyle: 'Bold'
  });
  addNode('text', `KPI Sub Pimpinan ${i}`, f3, x + 16, 252, 240, 16, {
    characters: k.sub,
    fill: '#64748B',
    fontSize: 10
  });
  addNode('rectangle', `KPI Badge Bg Pimpinan ${i}`, f3, x + 16, 276, 140, 22, {
    fill: k.bg,
    cornerRadius: 6
  });
  addNode('text', `KPI Badge Text Pimpinan ${i}`, f3, x + 16, 280, 140, 16, {
    characters: k.badge,
    fill: k.tc,
    fontSize: 10,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
});

// Dual Big Cards Pimpinan
// Left: Meja Otorisasi & Keputusan Persetujuan Pimpinan
addNode('rectangle', 'Approval Desk Pimpinan', f3, 274, 324, 720, 608, {
  fill: '#FFFFFF',
  cornerRadius: 18,
  stroke: '#E2E8F0',
  strokeWeight: 1
});
addNode('text', 'Approval Title Pimpinan', f3, 296, 346, 420, 22, {
  characters: 'Otorisasi Peminjaman Fasilitas Strategis Kampus',
  fill: '#0F172A',
  fontSize: 15,
  fontStyle: 'Bold'
});
addNode('text', 'Approval Sub Pimpinan', f3, 296, 370, 420, 18, {
  characters: 'Wewenang mutlak Pimpinan Institusi menerbitkan Surat Izin Resmi',
  fill: '#64748B',
  fontSize: 11
});

const leaderApprovals = [
  {
    org: 'Badan Eksekutif Mahasiswa (BEM Univ)',
    event: 'Seminar Nasional Kebangsaan & Kepemimpinan 2026',
    facility: 'Gedung Aula Utama & Sound System (Kapasitas 800 Orang)',
    date: '19 - 20 Nov 2026 (08:00 - 17:00 WIB)',
    y: 404
  },
  {
    org: 'Himpunan Mahasiswa Teknik Mesin',
    event: 'Kunjungan Studi Ekskursi Industri Manufaktur',
    facility: '1x Bus Kampus Isuzu Elf 28-Seat & Sopir Operasional',
    date: '24 Nov 2026 (Jakarta - Karawang)',
    y: 536
  },
  {
    org: 'Lembaga Penelitian & Pengabdian Masyarakat (LPPM)',
    event: 'Lokakarya Publikasi Riset Internasional Scopus',
    facility: 'Ruang Rapat Senat Lt. 3 & Smart Display 75 Inch',
    date: '22 Nov 2026 (Full Day)',
    y: 668
  }
];

leaderApprovals.forEach((a, i) => {
  addNode('rectangle', `Appr Box Pimpinan ${i}`, f3, 296, a.y, 676, 118, {
    fill: '#F8FAFC',
    cornerRadius: 14,
    stroke: '#E2E8F0',
    strokeWeight: 1
  });
  addNode('text', `Appr Org Pimpinan ${i}`, f3, 314, a.y + 14, 400, 20, {
    characters: a.org,
    fill: '#581C87',
    fontSize: 13,
    fontStyle: 'Bold'
  });
  addNode('text', `Appr Event Pimpinan ${i}`, f3, 314, a.y + 36, 400, 18, {
    characters: `Acara: ${a.event}`,
    fill: '#0F172A',
    fontSize: 12,
    fontStyle: 'Bold'
  });
  addNode('text', `Appr Facil Pimpinan ${i}`, f3, 314, a.y + 58, 400, 16, {
    characters: `Fasilitas: ${a.facility}`,
    fill: '#64748B',
    fontSize: 11
  });
  addNode('text', `Appr Date Pimpinan ${i}`, f3, 314, a.y + 78, 400, 16, {
    characters: `Waktu: ${a.date}`,
    fill: '#64748B',
    fontSize: 10
  });
  
  // Tombol Tolak
  addNode('rectangle', `Btn Tolak Pimpinan ${i}`, f3, 730, a.y + 40, 94, 40, {
    fill: C.errorBg,
    cornerRadius: 10
  });
  addNode('text', `Text Tolak Pimpinan ${i}`, f3, 730, a.y + 52, 94, 16, {
    characters: '✕ Tolak',
    fill: C.errorText,
    fontSize: 11,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  
  // Tombol Setujui Pimpinan
  addNode('rectangle', `Btn Setuju Pimpinan ${i}`, f3, 836, a.y + 40, 120, 40, {
    fill: '#7E22CE',
    cornerRadius: 10
  });
  addNode('text', `Text Setuju Pimpinan ${i}`, f3, 836, a.y + 52, 120, 16, {
    characters: '✓ Setujui (SK)',
    fill: '#FFFFFF',
    fontSize: 11,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
});

// Right: Grafik Sebaran Nilai Aset & Pengesahan Dokumen
addNode('rectangle', 'Stat Desk Pimpinan', f3, 1010, 324, 406, 608, {
  fill: '#FFFFFF',
  cornerRadius: 18,
  stroke: '#E2E8F0',
  strokeWeight: 1
});
addNode('text', 'Stat Title Pimpinan', f3, 1032, 346, 350, 22, {
  characters: 'Distribusi Nilai Aset per Fakultas',
  fill: '#0F172A',
  fontSize: 15,
  fontStyle: 'Bold'
});
addNode('text', 'Stat Sub Pimpinan', f3, 1032, 370, 350, 18, {
  characters: 'Total Aset Tercatat: Rp 4.850.000.000',
  fill: '#64748B',
  fontSize: 11
});

// Visual Bar Chart Distribution
const faculties = [
  { name: 'Fakultas Teknik', pct: '42%', val: 'Rp 2,03 M', barW: 280, color: '#1342B8', y: 404 },
  { name: 'Fakultas MIPA & Kedokteran', pct: '28%', val: 'Rp 1,35 M', barW: 190, color: '#059669', y: 474 },
  { name: 'Fakultas Ilmu Komputer', pct: '18%', val: 'Rp 873 Jt', barW: 120, color: '#7E22CE', y: 544 },
  { name: 'Gedung Rektorat & Umum', pct: '12%', val: 'Rp 582 Jt', barW: 80, color: '#D97706', y: 614 }
];

faculties.forEach((f, i) => {
  addNode('text', `Fac Name Pimpinan ${i}`, f3, 1032, f.y, 220, 18, {
    characters: f.name,
    fill: '#0F172A',
    fontSize: 12,
    fontStyle: 'Bold'
  });
  addNode('text', `Fac Val Pimpinan ${i}`, f3, 1260, f.y, 140, 18, {
    characters: `${f.pct} (${f.val})`,
    fill: '#64748B',
    fontSize: 11,
    textAlign: 'right'
  });
  // Bar Bg
  addNode('rectangle', `Bar Bg Pimpinan ${i}`, f3, 1032, f.y + 22, 362, 12, {
    fill: '#E2E8F0',
    cornerRadius: 6
  });
  // Bar Fill
  addNode('rectangle', `Bar Fill Pimpinan ${i}`, f3, 1032, f.y + 22, f.barW, 12, {
    fill: f.color,
    cornerRadius: 6
  });
});

// Pengesahan Dokumen Resmi Card
addNode('rectangle', 'Sign Box Pimpinan', f3, 1032, 696, 362, 216, {
  fill: '#FAF5FF',
  cornerRadius: 14,
  stroke: '#E9D5FF',
  strokeWeight: 1
});
addNode('text', 'Sign Title Pimpinan', f3, 1050, 714, 320, 20, {
  characters: 'Pengesahan Dokumen Triwulan:',
  fill: '#581C87',
  fontSize: 13,
  fontStyle: 'Bold'
});
addNode('text', 'Sign Doc Pimpinan', f3, 1050, 740, 320, 36, {
  characters: '📄 Laporan Rekapitulasi Audit Fisik Sarpras Q3-2026.pdf (Terverifikasi Tim BPK)',
  fill: '#0F172A',
  fontSize: 11
});
addNode('rectangle', 'Btn Sign Pimpinan', f3, 1050, 792, 326, 44, {
  fill: '#7E22CE',
  cornerRadius: 10
});
addNode('text', 'Text Sign Pimpinan', f3, 1050, 804, 326, 20, {
  characters: '🖋️ Sahkan Dokumen (Tanda Tangan Digital)',
  fill: '#FFFFFF',
  fontSize: 12,
  fontStyle: 'Bold',
  textAlign: 'center'
});
addNode('text', 'Sign Safe Note Pimpinan', f3, 1050, 846, 326, 16, {
  characters: '🔒 Terenkripsi dengan Sertifikat BSrE Nasional',
  fill: '#64748B',
  fontSize: 10,
  textAlign: 'center'
});


// =========================================================================
// FRAME 4: ROLE 4 - PEMINJAM / DOSEN & MAHASISWA (Portal Mandiri 4 Menu)
// =========================================================================
const f4 = addNode('frame', '[M3] SIMAS - Dashboard Peminjam Mandiri', null, 4620, 0, 1440, 960, {
  fill: C.surface,
  clip: true
});

// Note: Sidebar role peminjam hanya memiliki 4 Menu (Menu Pemeliharaan & Laporan ditutup!)
createFullSidebar(f4, 'peminjam', 'Peminjam (Dosen/Mhs)', 'Layanan Mandiri', 'dashboard');
createTopBar(f4, 'peminjam', 'Portal Layanan Mandiri Peminjaman Sarpras', 'Peminjaman Mandiri • Cek Ruang Kosong • Katalog Alat Tersedia', 'Budi Santoso', 'Peminjam (Dosen Teknik)');

// Banner Peminjam
addNode('rectangle', 'Banner Peminjam', f4, 274, 88, 1142, 80, {
  fill: '#EFF6FF',
  cornerRadius: 18,
  stroke: '#BFDBFE',
  strokeWeight: 1
});
addNode('text', 'Banner Peminjam Title', f4, 296, 102, 700, 24, {
  characters: 'Selamat Datang di Portal Mandiri, Pak Budi Santoso! 🎓',
  fill: '#1E3A8A',
  fontSize: 17,
  fontStyle: 'Bold'
});
addNode('text', 'Banner Peminjam Sub', f4, 296, 128, 700, 20, {
  characters: 'Layanan Mandiri: Ajukan pinjaman sarana perkuliahan & booking ruangan kosong tanpa birokrasi rumit.',
  fill: '#2563EB',
  fontSize: 12
});
addNode('rectangle', 'Btn Action Peminjam', f4, 1180, 106, 212, 42, {
  fill: C.brandBlue,
  cornerRadius: 12
});
addNode('text', 'Btn Action Text Peminjam', f4, 1180, 118, 212, 20, {
  characters: '+ Ajukan Peminjaman Baru',
  fill: '#FFFFFF',
  fontSize: 12,
  fontStyle: 'Bold',
  textAlign: 'center'
});

// 4 KPI Peminjam Personal
const kpisPeminjam = [
  { title: 'Sarana Aktif Dipinjam', val: '2 Sarana', sub: 'Proyektor & Kabel Roll', badge: 'Sedang Digunakan', bg: C.infoBg, tc: C.infoText, icon: '📦' },
  { title: 'Dalam Proses Review', val: '1 Pengajuan', sub: 'Surat Izin Lab Komputer', badge: 'Menunggu Review', bg: C.warningBg, tc: C.warningText, icon: '⏳' },
  { title: 'Tenggat Kembali', val: 'Besok 17:00', sub: 'Ruang Sarpras Gedung Rektorat', badge: 'Jangan Terlambat', bg: C.errorBg, tc: C.errorText, icon: '⏰' },
  { title: 'Skor Kepatuhan Saya', val: '100% Sempurna', sub: '18x Pinjam Tepat Waktu', badge: 'Pemohon Terpercaya', bg: C.successBg, tc: C.successText, icon: '⭐' }
];

kpisPeminjam.forEach((k, i) => {
  const x = 274 + i * (272 + 18);
  addNode('rectangle', `KPI Peminjam ${i}`, f4, x, 182, 272, 128, {
    fill: '#FFFFFF',
    cornerRadius: 16,
    stroke: '#E2E8F0',
    strokeWeight: 1
  });
  addNode('rectangle', `KPI Icon Box Peminjam ${i}`, f4, x + 16, 198, 42, 42, {
    fill: '#F1F5F9',
    cornerRadius: 12
  });
  addNode('text', `KPI Icon Peminjam ${i}`, f4, x + 16, 208, 42, 24, {
    characters: k.icon,
    fontSize: 20,
    textAlign: 'center'
  });
  addNode('text', `KPI Title Peminjam ${i}`, f4, x + 66, 198, 190, 16, {
    characters: k.title,
    fill: '#64748B',
    fontSize: 11
  });
  addNode('text', `KPI Val Peminjam ${i}`, f4, x + 66, 214, 190, 26, {
    characters: k.val,
    fill: '#0F172A',
    fontSize: 19,
    fontStyle: 'Bold'
  });
  addNode('text', `KPI Sub Peminjam ${i}`, f4, x + 16, 252, 240, 16, {
    characters: k.sub,
    fill: '#64748B',
    fontSize: 10
  });
  addNode('rectangle', `KPI Badge Bg Peminjam ${i}`, f4, x + 16, 276, 140, 22, {
    fill: k.bg,
    cornerRadius: 6
  });
  addNode('text', `KPI Badge Text Peminjam ${i}`, f4, x + 16, 280, 140, 16, {
    characters: k.badge,
    fill: k.tc,
    fontSize: 10,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
});

// Dual Big Cards Peminjam
// Left: Barang yang Sedang Saya Pinjam & Timeline
addNode('rectangle', 'My Loan Desk Peminjam', f4, 274, 324, 700, 608, {
  fill: '#FFFFFF',
  cornerRadius: 18,
  stroke: '#E2E8F0',
  strokeWeight: 1
});
addNode('text', 'My Loan Title Peminjam', f4, 296, 346, 400, 22, {
  characters: 'Sarana yang Sedang Saya Pinjam Saat Ini',
  fill: '#0F172A',
  fontSize: 15,
  fontStyle: 'Bold'
});
addNode('text', 'My Loan Sub Peminjam', f4, 296, 370, 450, 18, {
  characters: 'Pantau sisa durasi pemakaian & ajukan perpanjangan jika diperlukan',
  fill: '#64748B',
  fontSize: 11
});

const activeBorrowed = [
  {
    name: 'Proyektor Epson EB-X500 (3600 Lumens)',
    code: 'AST-TI-2024-002',
    loc: 'Digunakan di: Ruang Seminar 2 (Mata Kuliah Kecerdasan Buatan)',
    due: 'Tenggat Kembali: 17 Nov 2026, 17:00 WIB (Sisa 24 Jam)',
    status: 'Sedang Digunakan',
    statusBg: C.infoBg,
    statusText: C.infoText,
    y: 404
  },
  {
    name: '1x Wireless Pointer Logitech R400 + Baterai',
    code: 'AST-TI-2024-009',
    loc: 'Paket bersama Proyektor Epson',
    due: 'Tenggat Kembali: 17 Nov 2026, 17:00 WIB',
    status: 'Sedang Digunakan',
    statusBg: C.infoBg,
    statusText: C.infoText,
    y: 536
  }
];

activeBorrowed.forEach((b, i) => {
  addNode('rectangle', `Borrow Box Peminjam ${i}`, f4, 296, b.y, 656, 118, {
    fill: '#F8FAFC',
    cornerRadius: 14,
    stroke: '#E2E8F0',
    strokeWeight: 1
  });
  addNode('text', `Borrow Name Peminjam ${i}`, f4, 314, b.y + 14, 400, 20, {
    characters: b.name,
    fill: '#0F172A',
    fontSize: 13,
    fontStyle: 'Bold'
  });
  addNode('text', `Borrow Code Peminjam ${i}`, f4, 314, b.y + 36, 400, 16, {
    characters: `Kode Aset: ${b.code}`,
    fill: C.brandBlue,
    fontSize: 11,
    fontStyle: 'Bold'
  });
  addNode('text', `Borrow Loc Peminjam ${i}`, f4, 314, b.y + 56, 400, 16, {
    characters: b.loc,
    fill: '#64748B',
    fontSize: 10
  });
  addNode('text', `Borrow Due Peminjam ${i}`, f4, 314, b.y + 76, 400, 16, {
    characters: `⏰ ${b.due}`,
    fill: '#B45309',
    fontSize: 11,
    fontStyle: 'Bold'
  });
  
  // Action Buttons
  addNode('rectangle', `Btn Extend Peminjam ${i}`, f4, 730, b.y + 24, 200, 34, {
    fill: '#EFF6FF',
    cornerRadius: 8,
    stroke: '#BFDBFE',
    strokeWeight: 1
  });
  addNode('text', `Text Extend Peminjam ${i}`, f4, 730, b.y + 34, 200, 16, {
    characters: '⏱️ Ajukan Perpanjangan',
    fill: C.brandBlue,
    fontSize: 11,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  
  addNode('rectangle', `Btn Guide Peminjam ${i}`, f4, 730, b.y + 66, 200, 34, {
    fill: '#F1F5F9',
    cornerRadius: 8
  });
  addNode('text', `Text Guide Peminjam ${i}`, f4, 730, b.y + 76, 200, 16, {
    characters: 'Petunjuk Pengembalian',
    fill: '#475569',
    fontSize: 11,
    textAlign: 'center'
  });
});

// Live Tracking Permohonan Pinjaman
addNode('rectangle', 'Tracking Box Peminjam', f4, 296, 676, 656, 236, {
  fill: '#FAF5FF',
  cornerRadius: 14,
  stroke: '#E9D5FF',
  strokeWeight: 1
});
addNode('text', 'Tracking Title Peminjam', f4, 314, 696, 400, 20, {
  characters: 'Live Tracking: Pengajuan #PINJ-2026-089 (Workshop AI)',
  fill: '#581C87',
  fontSize: 13,
  fontStyle: 'Bold'
});
addNode('text', 'Tracking Sub Peminjam', f4, 314, 720, 600, 16, {
  characters: 'Ruang Seminar Utama Lt. 3 • Diajukan 16 Nov 2026 • 2 Hari Kerja',
  fill: '#64748B',
  fontSize: 11
});

// Tracking Stepper Bar
const pSteps = [
  { no: '1', label: 'Diajukan', state: 'done', x: 340 },
  { no: '2', label: 'Cek Stok', state: 'done', x: 470 },
  { no: '3', label: 'Review Pimpinan', state: 'active', x: 610 },
  { no: '4', label: 'Ambil Barang', state: 'pending', x: 760 }
];

pSteps.forEach(s => {
  addNode('ellipse', `PStep Ellipse ${s.no}`, f4, s.x, 756, 32, 32, {
    fill: (s.state === 'done') ? '#059669' : (s.state === 'active' ? '#D97706' : '#CBD5E1')
  });
  addNode('text', `PStep Mark ${s.no}`, f4, s.x, 764, 32, 16, {
    characters: (s.state === 'done') ? '✓' : (s.state === 'active' ? '⏳' : s.no),
    fill: '#FFFFFF',
    fontSize: 12,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  addNode('text', `PStep Label ${s.no}`, f4, s.x - 20, 796, 72, 16, {
    characters: s.label,
    fill: (s.state === 'active') ? '#B45309' : '#0F172A',
    fontSize: 10,
    fontStyle: (s.state === 'active') ? 'Bold' : 'Regular',
    textAlign: 'center'
  });
});

addNode('text', 'Tracking Note Peminjam', f4, 314, 860, 600, 36, {
  characters: 'Status Terkini: Permohonan telah lolos verifikasi stok dan saat ini sedang menunggu persetujuan Dekan / Pimpinan Institusi. Anda akan menerima notifikasi jika disetujui.',
  fill: '#7E22CE',
  fontSize: 11
});

// Right: Katalog Cepat Sarana Siap Pakai (Direct Booking)
addNode('rectangle', 'Catalog Desk Peminjam', f4, 994, 324, 422, 608, {
  fill: '#FFFFFF',
  cornerRadius: 18,
  stroke: '#E2E8F0',
  strokeWeight: 1
});
addNode('text', 'Catalog Title Peminjam', f4, 1016, 346, 350, 22, {
  characters: 'Katalog Sarpras Siap Pakai Hari Ini',
  fill: '#0F172A',
  fontSize: 15,
  fontStyle: 'Bold'
});
addNode('text', 'Catalog Sub Peminjam', f4, 1016, 370, 350, 18, {
  characters: 'Fasilitas & ruangan yang berstatus kosong/tersedia',
  fill: '#64748B',
  fontSize: 11
});

const quickAvailable = [
  { icon: '🏢', name: 'Ruang Seminar 1 (Gedung TI)', cap: 'Kapasitas 60 Orang • AC & Audio', avail: 'Tersedia Sekarang', y: 404 },
  { icon: '🎤', name: 'Sound Portable Yamaha 680W', cap: '2 Mic Wireless + Mixer 10-Ch', avail: 'Ready di Sarpras', y: 520 },
  { icon: '💻', name: 'Laptop ASUS ROG Lab VR', cap: 'Core i9, 32GB RAM, RTX 4070', avail: 'Ready di Lab 1', y: 636 },
  { icon: '📷', name: 'Kamera Sony A6400 Kit 4K', cap: 'Lensa 16-50mm + Tripod', avail: 'Ready di Sarpras', y: 752 }
];

quickAvailable.forEach((q, i) => {
  addNode('rectangle', `Quick Box Peminjam ${i}`, f4, 1016, q.y, 378, 102, {
    fill: '#F8FAFC',
    cornerRadius: 14,
    stroke: '#E2E8F0',
    strokeWeight: 1
  });
  addNode('rectangle', `Quick Icon Box Peminjam ${i}`, f4, 1032, q.y + 16, 42, 42, {
    fill: '#EFF6FF',
    cornerRadius: 10
  });
  addNode('text', `Quick Icon Peminjam ${i}`, f4, 1032, q.y + 26, 42, 24, {
    characters: q.icon,
    fontSize: 20,
    textAlign: 'center'
  });
  addNode('text', `Quick Name Peminjam ${i}`, f4, 1084, q.y + 14, 290, 20, {
    characters: q.name,
    fill: '#0F172A',
    fontSize: 12,
    fontStyle: 'Bold'
  });
  addNode('text', `Quick Cap Peminjam ${i}`, f4, 1084, q.y + 36, 290, 16, {
    characters: q.cap,
    fill: '#64748B',
    fontSize: 10
  });
  
  // Status pill & Book button
  addNode('rectangle', `Quick Avail Peminjam ${i}`, f4, 1084, q.y + 60, 130, 26, {
    fill: C.successBg,
    cornerRadius: 6
  });
  addNode('text', `Quick Avail Text Peminjam ${i}`, f4, 1084, q.y + 66, 130, 16, {
    characters: `✓ ${q.avail}`,
    fill: C.successText,
    fontSize: 10,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  
  addNode('rectangle', `Quick Book Peminjam ${i}`, f4, 270 + 980, q.y + 60, 110, 26, {
    fill: C.brandBlue,
    cornerRadius: 6
  });
  addNode('text', `Quick Book Text Peminjam ${i}`, f4, 270 + 980, q.y + 66, 110, 16, {
    characters: '+ Pinjam',
    fill: '#FFFFFF',
    fontSize: 10,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
});


// -------------------------------------------------------------------------
// WRITE JSON SCRIPT & RUN FIGCRAFT CLI
// -------------------------------------------------------------------------
const scriptPath = path.join(__dirname, 'scratch_simas_4roles.json');
fs.writeFileSync(scriptPath, JSON.stringify(commands, null, 2));
console.log(`Generated ${commands.length} commands for 4 separated Role Dashboards.`);

const outPath = 'C:\\Coding\\PWEB AISTUDIO\\simas_material3.figcraft';
console.log(`Executing figcraft-cli to generate ${outPath}...`);
try {
  const result = cp.execSync(`"C:\\Program Files\\ArtCraft\\FigCraft\\figcraft-cli.exe" run "${scriptPath}" --out "${outPath}"`, {
    maxBuffer: 1024 * 1024 * 50
  });
  console.log('SUCCESS! FigCraft CLI finished.');
} catch (e) {
  console.error('CLI Execution Error:', e.stdout?.toString() || e.message);
}
