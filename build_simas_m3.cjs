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
// MATERIAL DESIGN 3 COLOR PALETTE
// -------------------------------------------------------------------------
const C = {
  primary: '#6750A4',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005D',
  
  secondary: '#625B71',
  secondaryContainer: '#E8DEF8',
  onSecondaryContainer: '#1D192B',
  
  tertiary: '#7D5260',
  tertiaryContainer: '#FFD8E4',
  onTertiaryContainer: '#31111D',
  
  surface: '#FEF7FF',
  surfaceContainerLow: '#F7F2FA',
  surfaceContainer: '#F3EDF7',
  surfaceContainerHigh: '#ECE6F0',
  surfaceContainerHighest: '#E6E0E9',
  cardBg: '#FFFFFF',
  
  onSurface: '#1D1B20',
  onSurfaceVariant: '#49454F',
  outline: '#79747E',
  outlineVariant: '#CAC4D0',
  
  // Status Colors (M3 Tonal containers)
  successContainer: '#D4E8D1',
  onSuccess: '#103810',
  warningContainer: '#FFDBCF',
  onWarning: '#3B0900',
  errorContainer: '#FFDAD6',
  onError: '#410002',
  infoContainer: '#D0E4FF',
  onInfo: '#001D36'
};

// -------------------------------------------------------------------------
// HELPER: BUILD NAVIGATION RAIL
// -------------------------------------------------------------------------
function createNavRail(screenRef, activeItem) {
  const rail = addNode('frame', 'Navigation Rail', screenRef, 0, 0, 96, 960, {
    fill: C.surfaceContainer,
    clip: true
  });
  
  // Brand Logo Container
  addNode('rectangle', 'Brand Logo Bg', rail, 24, 24, 48, 48, {
    fill: C.primary,
    cornerRadius: 16
  });
  addNode('text', 'Brand Text', rail, 24, 35, 48, 26, {
    characters: 'S',
    fill: C.onPrimary,
    fontSize: 22,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', y: 104 },
    { id: 'aset', label: 'Aset', icon: '📦', y: 184 },
    { id: 'gedung', label: 'Ruang', icon: '🏢', y: 264 },
    { id: 'pinjam', label: 'Pinjam', icon: '📋', y: 344, badge: '8' },
    { id: 'tiket', label: 'Tiket', icon: '🔧', y: 424 },
    { id: 'laporan', label: 'Laporan', icon: '📈', y: 504 }
  ];
  
  navItems.forEach(item => {
    const isActive = (item.id === activeItem);
    if (isActive) {
      addNode('rectangle', `Active Pill ${item.label}`, rail, 20, item.y, 56, 32, {
        fill: C.secondaryContainer,
        cornerRadius: 16
      });
      addNode('text', `Icon ${item.label}`, rail, 20, item.y + 6, 56, 20, {
        characters: item.icon,
        fill: C.onSecondaryContainer,
        fontSize: 16,
        textAlign: 'center'
      });
      addNode('text', `Label ${item.label}`, rail, 8, item.y + 36, 80, 16, {
        characters: item.label,
        fill: C.onSecondaryContainer,
        fontSize: 11,
        fontStyle: 'Bold',
        textAlign: 'center'
      });
    } else {
      addNode('text', `Icon ${item.label}`, rail, 20, item.y + 6, 56, 20, {
        characters: item.icon,
        fill: C.onSurfaceVariant,
        fontSize: 16,
        textAlign: 'center'
      });
      addNode('text', `Label ${item.label}`, rail, 8, item.y + 36, 80, 16, {
        characters: item.onSurfaceVariant,
        characters: item.label,
        fill: C.onSurfaceVariant,
        fontSize: 11,
        textAlign: 'center'
      });
    }
    
    if (item.badge) {
      addNode('rectangle', `Badge ${item.label}`, rail, 56, item.y - 2, 18, 18, {
        fill: C.errorContainer,
        cornerRadius: 9
      });
      addNode('text', `Badge Text ${item.label}`, rail, 56, item.y + 1, 18, 14, {
        characters: item.badge,
        fill: C.onError,
        fontSize: 10,
        fontStyle: 'Bold',
        textAlign: 'center'
      });
    }
  });
  
  // User Profile at bottom
  addNode('ellipse', 'User Avatar', rail, 28, 880, 40, 40, {
    fill: C.primary
  });
  addNode('text', 'User Initials', rail, 28, 891, 40, 20, {
    characters: 'BI',
    fill: C.onPrimary,
    fontSize: 14,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  
  return rail;
}

// -------------------------------------------------------------------------
// HELPER: BUILD TOP APP BAR
// -------------------------------------------------------------------------
function createTopAppBar(screenRef, title, subtitle) {
  const bar = addNode('frame', 'Top App Bar', screenRef, 96, 0, 1344, 72, {
    fill: C.surface,
    clip: true
  });
  
  // Title & Subtitle
  addNode('text', 'Page Title', bar, 32, 14, 450, 26, {
    characters: title,
    fill: C.onSurface,
    fontSize: 20,
    fontStyle: 'Bold'
  });
  addNode('text', 'Page Subtitle', bar, 32, 42, 450, 18, {
    characters: subtitle,
    fill: C.onSurfaceVariant,
    fontSize: 12
  });
  
  // M3 Search Bar
  addNode('rectangle', 'Search Box', bar, 520, 14, 420, 44, {
    fill: C.surfaceContainerHigh,
    cornerRadius: 22
  });
  addNode('text', 'Search Placeholder', bar, 544, 26, 360, 20, {
    characters: '🔍 Cari aset, kode inventaris, ruangan, tiket...',
    fill: C.onSurfaceVariant,
    fontSize: 13
  });
  
  // Notification Bell
  addNode('rectangle', 'Notification Btn', bar, 960, 16, 40, 40, {
    fill: C.surfaceContainer,
    cornerRadius: 20
  });
  addNode('text', 'Bell Icon', bar, 960, 26, 40, 20, {
    characters: '🔔',
    fill: C.onSurfaceVariant,
    fontSize: 16,
    textAlign: 'center'
  });
  addNode('ellipse', 'Bell Dot', bar, 986, 20, 8, 8, {
    fill: '#B3261E'
  });
  
  // Profile Pill
  addNode('rectangle', 'Profile Pill', bar, 1020, 14, 280, 44, {
    fill: C.surfaceContainer,
    cornerRadius: 22
  });
  addNode('ellipse', 'Pill Avatar', bar, 1026, 20, 32, 32, {
    fill: C.primary
  });
  addNode('text', 'Pill Initials', bar, 1026, 28, 32, 16, {
    characters: 'BI',
    fill: C.onPrimary,
    fontSize: 12,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  addNode('text', 'Pill Name', bar, 1068, 20, 160, 16, {
    characters: 'Bambang Irawan',
    fill: C.onSurface,
    fontSize: 13,
    fontStyle: 'Bold'
  });
  addNode('text', 'Pill Role', bar, 1068, 36, 160, 14, {
    characters: 'Admin Sarpras • Aktif',
    fill: C.primary,
    fontSize: 11
  });
  
  return bar;
}

// =========================================================================
// SCREEN 1: DASHBOARD EKSEKUTIF (M3)
// =========================================================================
const scr1 = addNode('frame', '[M3] SIMAS - Dashboard Eksekutif', null, 0, 0, 1440, 960, {
  fill: C.surface,
  clip: true
});

createNavRail(scr1, 'dashboard');
createTopAppBar(scr1, 'Dashboard Eksekutif Sarana & Prasarana', 'SIMAS • Universitas Indonesia • Tahun Akademik 2026/2027');

// Banner Welcome (M3 Primary Container)
const banner = addNode('rectangle', 'Welcome Banner', scr1, 128, 88, 1276, 96, {
  fill: C.primaryContainer,
  cornerRadius: 24
});
addNode('text', 'Banner Greeting', scr1, 156, 106, 800, 28, {
  characters: 'Selamat Datang, Bambang Irawan! (Admin Sarpras) 👋',
  fill: C.onPrimaryContainer,
  fontSize: 20,
  fontStyle: 'Bold'
});
addNode('text', 'Banner Sub', scr1, 156, 138, 800, 20, {
  characters: '8 permohonan peminjaman baru & 5 tiket pemeliharaan butuh tindakan Anda hari ini.',
  fill: C.onPrimaryContainer,
  fontSize: 13
});
// Banner Action Button
addNode('rectangle', 'Banner Action Btn', scr1, 1180, 114, 190, 44, {
  fill: C.primary,
  cornerRadius: 22
});
addNode('text', 'Banner Action Text', scr1, 1180, 126, 190, 20, {
  characters: '+ Buat Peminjaman',
  fill: C.onPrimary,
  fontSize: 13,
  fontStyle: 'Bold',
  textAlign: 'center'
});

// -------------------------------------------------------------------------
// 4 KPI METRIC CARDS
// -------------------------------------------------------------------------
const kpis = [
  {
    title: 'Total Master Aset',
    value: '1.248 Unit',
    sub: 'Total Nilai: Rp 4,85 Miliar',
    badge: '94% Kondisi Baik',
    badgeColor: C.successContainer,
    badgeText: C.onSuccess,
    icon: '📦',
    iconBg: C.secondaryContainer
  },
  {
    title: 'Okupansi Ruangan',
    value: '42 / 56',
    sub: '75% Ruangan Terisi Saat Ini',
    badge: '14 Ruang Kosong',
    badgeColor: C.infoContainer,
    badgeText: C.onInfo,
    icon: '🏢',
    iconBg: '#D0E4FF'
  },
  {
    title: 'Permohonan Pinjam',
    value: '8 Antrean',
    sub: '4 Butuh Approval Cepat',
    badge: 'Perlu Tindakan',
    badgeColor: C.warningContainer,
    badgeText: C.onWarning,
    icon: '📋',
    iconBg: '#FFDBCF'
  },
  {
    title: 'Tiket Perbaikan',
    value: '5 Aktif',
    sub: 'Est. Biaya: Rp 4.250.000',
    badge: '2 Dalam Pengerjaan',
    badgeColor: C.tertiaryContainer,
    badgeText: C.onTertiaryContainer,
    icon: '🔧',
    iconBg: '#FFD8E4'
  }
];

const kpiWidth = 302;
const kpiGap = 22;
const startX = 128;

kpis.forEach((k, idx) => {
  const x = startX + idx * (kpiWidth + kpiGap);
  // Card Container
  addNode('rectangle', `KPI Card ${idx}`, scr1, x, 200, kpiWidth, 140, {
    fill: C.cardBg,
    cornerRadius: 20,
    stroke: C.outlineVariant,
    strokeWeight: 1
  });
  
  // Icon Container
  addNode('rectangle', `KPI Icon Container ${idx}`, scr1, x + 18, 218, 44, 44, {
    fill: k.iconBg,
    cornerRadius: 14
  });
  addNode('text', `KPI Icon ${idx}`, scr1, x + 18, 228, 44, 24, {
    characters: k.icon,
    fontSize: 20,
    textAlign: 'center'
  });
  
  // Title & Value
  addNode('text', `KPI Title ${idx}`, scr1, x + 72, 218, 210, 16, {
    characters: k.title,
    fill: C.onSurfaceVariant,
    fontSize: 12
  });
  addNode('text', `KPI Value ${idx}`, scr1, x + 72, 236, 210, 28, {
    characters: k.value,
    fill: C.onSurface,
    fontSize: 22,
    fontStyle: 'Bold'
  });
  
  // Subtitle
  addNode('text', `KPI Sub ${idx}`, scr1, x + 18, 276, 260, 16, {
    characters: k.sub,
    fill: C.onSurfaceVariant,
    fontSize: 11
  });
  
  // Badge
  addNode('rectangle', `KPI Badge Bg ${idx}`, scr1, x + 18, 300, 140, 24, {
    fill: k.badgeColor,
    cornerRadius: 8
  });
  addNode('text', `KPI Badge Text ${idx}`, scr1, x + 18, 304, 140, 16, {
    characters: k.badge,
    fill: k.badgeText,
    fontSize: 11,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
});

// -------------------------------------------------------------------------
// TWO LARGE CARDS: PEMINJAMAN TERKINI & KANBAN PEMELIHARAAN
// -------------------------------------------------------------------------
// Left Card: Permohonan Peminjaman (Approval Queue)
const leftCard = addNode('rectangle', 'Left Card Bg', scr1, 128, 360, 780, 560, {
  fill: C.cardBg,
  cornerRadius: 24,
  stroke: C.outlineVariant,
  strokeWeight: 1
});

addNode('text', 'Left Card Header', scr1, 156, 384, 420, 24, {
  characters: 'Permohonan Peminjaman Menunggu Approval',
  fill: C.onSurface,
  fontSize: 16,
  fontStyle: 'Bold'
});
addNode('text', 'Left Card Sub', scr1, 156, 412, 420, 18, {
  characters: 'Akses otorisasi persetujuan Pimpinan & Admin Sarpras (RBAC)',
  fill: C.onSurfaceVariant,
  fontSize: 12
});

// Filter Chips
const chips = [
  { label: 'Semua (8)', active: true, x: 570 },
  { label: 'Dosen (3)', active: false, x: 670 },
  { label: 'Mahasiswa (5)', active: false, x: 770 }
];
chips.forEach(ch => {
  addNode('rectangle', `Chip ${ch.label}`, scr1, ch.x, 384, 90, 32, {
    fill: ch.active ? C.secondaryContainer : C.surfaceContainer,
    cornerRadius: 8
  });
  addNode('text', `Chip Text ${ch.label}`, scr1, ch.x, 392, 90, 16, {
    characters: ch.label,
    fill: ch.active ? C.onSecondaryContainer : C.onSurfaceVariant,
    fontSize: 11,
    fontStyle: ch.active ? 'Bold' : 'Regular',
    textAlign: 'center'
  });
});

// List of Loan Requests
const loanRequests = [
  {
    name: 'Budi Santoso, M.Kom (Dosen TI)',
    item: '2x Proyektor Epson EB-X500 & Pointer',
    loc: 'Ruang Seminar 2 • 17 Nov 2026 (08:00 - 14:00)',
    badge: 'Menunggu Approval',
    badgeBg: C.warningContainer,
    badgeText: C.onWarning,
    y: 448
  },
  {
    name: 'Siti Rahmawati (Ketua BEM Univ)',
    item: 'Gedung Aula Utama & Sound System Yamaha',
    loc: 'Kapasitas 500 Org • 19 Nov 2026 (Full Day)',
    badge: 'Menunggu Approval',
    badgeBg: C.warningContainer,
    badgeText: C.onWarning,
    y: 564
  },
  {
    name: 'Dimas Arya (Himpunan Mahasiswa Elektro)',
    item: '5x Solder Station & 2x Multimeter Fluke',
    loc: 'Lab Elektronika Dasar • 18 Nov 2026',
    badge: 'Menunggu Approval',
    badgeBg: C.warningContainer,
    badgeText: C.onWarning,
    y: 680
  },
  {
    name: 'Dr. Ir. Hendro Wicaksono (Pimpinan)',
    item: 'Kamera Sony A6400 & Wireless Mic DJI',
    loc: 'Dokumentasi Rapat Senat • 20 Nov 2026',
    badge: 'Disetujui',
    badgeBg: C.successContainer,
    badgeText: C.onSuccess,
    y: 796
  }
];

loanRequests.forEach((req, idx) => {
  // Row card
  addNode('rectangle', `Loan Row ${idx}`, scr1, 156, req.y, 724, 100, {
    fill: C.surfaceContainerLow,
    cornerRadius: 16
  });
  
  // Avatar / Icon
  addNode('rectangle', `Loan Avatar ${idx}`, scr1, 174, req.y + 16, 48, 48, {
    fill: C.primaryContainer,
    cornerRadius: 24
  });
  addNode('text', `Loan Avatar Text ${idx}`, scr1, 174, req.y + 28, 48, 24, {
    characters: '👤',
    fontSize: 20,
    textAlign: 'center'
  });
  
  // Info
  addNode('text', `Loan Name ${idx}`, scr1, 234, req.y + 16, 320, 20, {
    characters: req.name,
    fill: C.onSurface,
    fontSize: 14,
    fontStyle: 'Bold'
  });
  addNode('text', `Loan Item ${idx}`, scr1, 234, req.y + 38, 340, 18, {
    characters: req.item,
    fill: C.primary,
    fontSize: 12,
    fontStyle: 'Bold'
  });
  addNode('text', `Loan Loc ${idx}`, scr1, 234, req.y + 58, 340, 16, {
    characters: req.loc,
    fill: C.onSurfaceVariant,
    fontSize: 11
  });
  
  // Status Badge
  addNode('rectangle', `Loan Badge ${idx}`, scr1, 570, req.y + 16, 120, 24, {
    fill: req.badgeBg,
    cornerRadius: 8
  });
  addNode('text', `Loan Badge Text ${idx}`, scr1, 570, req.y + 20, 120, 16, {
    characters: req.badge,
    fill: req.badgeText,
    fontSize: 10,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  
  // Action Buttons
  if (req.badge === 'Menunggu Approval') {
    // Tolak Btn (Tonal)
    addNode('rectangle', `Tolak Btn ${idx}`, scr1, 700, req.y + 14, 80, 32, {
      fill: C.errorContainer,
      cornerRadius: 16
    });
    addNode('text', `Tolak Text ${idx}`, scr1, 700, req.y + 22, 80, 16, {
      characters: 'Tolak',
      fill: C.onError,
      fontSize: 11,
      fontStyle: 'Bold',
      textAlign: 'center'
    });
    
    // Setujui Btn (Filled Primary)
    addNode('rectangle', `Setuju Btn ${idx}`, scr1, 788, req.y + 14, 84, 32, {
      fill: C.primary,
      cornerRadius: 16
    });
    addNode('text', `Setuju Text ${idx}`, scr1, 788, req.y + 22, 84, 16, {
      characters: 'Setujui ✓',
      fill: C.onPrimary,
      fontSize: 11,
      fontStyle: 'Bold',
      textAlign: 'center'
    });
  } else {
    // Lihat Detail
    addNode('rectangle', `Detail Btn ${idx}`, scr1, 720, req.y + 14, 152, 32, {
      fill: C.secondaryContainer,
      cornerRadius: 16
    });
    addNode('text', `Detail Text ${idx}`, scr1, 720, req.y + 22, 152, 16, {
      characters: 'Lihat Surat Tugas',
      fill: C.onSecondaryContainer,
      fontSize: 11,
      fontStyle: 'Bold',
      textAlign: 'center'
    });
  }
});

// -------------------------------------------------------------------------
// Right Card: Kanban Snapshot & Status Fasilitas
// -------------------------------------------------------------------------
const rightCard = addNode('rectangle', 'Right Card Bg', scr1, 930, 360, 474, 560, {
  fill: C.cardBg,
  cornerRadius: 24,
  stroke: C.outlineVariant,
  strokeWeight: 1
});

addNode('text', 'Right Card Header', scr1, 956, 384, 320, 24, {
  characters: 'Status Tiket Pemeliharaan Sarpras',
  fill: C.onSurface,
  fontSize: 17,
  fontStyle: 'Bold'
});
addNode('text', 'Right Card Sub', scr1, 956, 410, 320, 18, {
  characters: 'Kanban operasional teknisi & tracking servis',
  fill: C.onSurfaceVariant,
  fontSize: 12
});

// Open Kanban link button
addNode('text', 'Kanban Link', scr1, 1270, 386, 110, 20, {
  characters: 'Lihat Semua →',
  fill: C.primary,
  fontSize: 12,
  fontStyle: 'Bold'
});

// Mini Kanban Pipeline Status
const pipeline = [
  { label: 'Antrean', count: '2', color: C.warningContainer, textColor: C.onWarning, x: 956 },
  { label: 'Pengerjaan', count: '2', color: C.infoContainer, textColor: C.onInfo, x: 1100 },
  { label: 'Selesai Uji', count: '1', color: C.successContainer, textColor: C.onSuccess, x: 1244 }
];

pipeline.forEach(p => {
  addNode('rectangle', `Pipeline ${p.label}`, scr1, p.x, 442, 134, 48, {
    fill: p.color,
    cornerRadius: 12
  });
  addNode('text', `Pipeline Count ${p.label}`, scr1, p.x, 448, 134, 20, {
    characters: p.count,
    fill: p.textColor,
    fontSize: 16,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  addNode('text', `Pipeline Label ${p.label}`, scr1, p.x, 468, 134, 16, {
    characters: p.label,
    fill: p.textColor,
    fontSize: 11,
    textAlign: 'center'
  });
});

// Kanban Tickets
const tickets = [
  {
    code: 'TKT-2026-012',
    name: 'AC Daikin Inverter 2 PK',
    loc: 'Ruang Seminar Gedung Utama Lt. 3',
    issue: 'Kompresor bising & tidak dingin',
    tech: 'Teknisi: Joko Supriyanto',
    cost: 'Est. Biaya: Rp 850.000',
    status: 'Sedang Diperbaiki',
    statusBg: C.infoContainer,
    statusText: C.onInfo,
    y: 510
  },
  {
    code: 'TKT-2026-014',
    name: 'PC All-in-One Core i7',
    loc: 'Lab Komputer Multimedia (Unit PC-12)',
    issue: 'RAM error & Layar blue-screen',
    tech: 'Teknisi: Vendor Garansi Asus',
    cost: 'Garansi Resmi (Rp 0)',
    status: 'Tunggu Suku Cadang',
    statusBg: C.warningContainer,
    statusText: C.onWarning,
    y: 636
  },
  {
    code: 'TKT-2026-009',
    name: 'Genset Cummins 150 kVA',
    loc: 'Ruang Power House Gedung B',
    issue: 'Perawatan berkala 500 jam & oli',
    tech: 'Teknisi: Bambang (Admin) & Tim',
    cost: 'Biaya Realisasi: Rp 3.400.000',
    status: 'Selesai Perbaikan',
    statusBg: C.successContainer,
    statusText: C.onSuccess,
    y: 762
  }
];

tickets.forEach((t, idx) => {
  addNode('rectangle', `Ticket Card ${idx}`, scr1, 956, t.y, 422, 114, {
    fill: C.surfaceContainerLow,
    cornerRadius: 16
  });
  
  // Header: Code & Status
  addNode('text', `Ticket Code ${idx}`, scr1, 972, t.y + 12, 180, 16, {
    characters: t.code,
    fill: C.primary,
    fontSize: 11,
    fontStyle: 'Bold'
  });
  addNode('rectangle', `Ticket Status Bg ${idx}`, scr1, 1238, t.y + 10, 126, 22, {
    fill: t.statusBg,
    cornerRadius: 6
  });
  addNode('text', `Ticket Status Text ${idx}`, scr1, 1238, t.y + 13, 126, 16, {
    characters: t.status,
    fill: t.statusText,
    fontSize: 10,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  
  // Asset Name & Loc
  addNode('text', `Ticket Name ${idx}`, scr1, 972, t.y + 32, 280, 18, {
    characters: t.name,
    fill: C.onSurface,
    fontSize: 13,
    fontStyle: 'Bold'
  });
  addNode('text', `Ticket Loc ${idx}`, scr1, 972, t.y + 50, 380, 16, {
    characters: t.loc,
    fill: C.onSurfaceVariant,
    fontSize: 11
  });
  
  // Issue & Cost
  addNode('text', `Ticket Issue ${idx}`, scr1, 972, t.y + 70, 380, 16, {
    characters: `Kerusakan: ${t.issue}`,
    fill: '#B3261E',
    fontSize: 11
  });
  addNode('text', `Ticket Tech ${idx}`, scr1, 972, t.y + 90, 200, 16, {
    characters: t.tech,
    fill: C.onSurfaceVariant,
    fontSize: 10
  });
  addNode('text', `Ticket Cost ${idx}`, scr1, 1210, t.y + 90, 154, 16, {
    characters: t.cost,
    fill: C.onSurface,
    fontSize: 11,
    fontStyle: 'Bold',
    textAlign: 'right'
  });
});

// Floating Action Button (FAB)
addNode('rectangle', 'FAB Background', scr1, 1344, 864, 56, 56, {
  fill: C.primaryContainer,
  cornerRadius: 16
});
addNode('text', 'FAB Icon', scr1, 1344, 874, 56, 36, {
  characters: '+',
  fill: C.onPrimaryContainer,
  fontSize: 28,
  fontStyle: 'Bold',
  textAlign: 'center'
});


// =========================================================================
// SCREEN 2: MASTER INVENTARIS SARANA & ASET (M3)
// =========================================================================
const scr2 = addNode('frame', '[M3] SIMAS - Master Inventaris Aset', null, 1540, 0, 1440, 960, {
  fill: C.surface,
  clip: true
});

createNavRail(scr2, 'aset');
createTopAppBar(scr2, 'Master Inventaris Sarana & Aset Kampus', 'Database Aset • Lokasi Ruang • Label QR & Riwayat Perawatan');

// Subheader & Filter Chips
addNode('text', 'Aset Header', scr2, 128, 92, 400, 28, {
  characters: 'Katalog Inventaris Sarana (1.248 Aset)',
  fill: C.onSurface,
  fontSize: 20,
  fontStyle: 'Bold'
});

// Category Filter Chips
const catChips = [
  { label: 'Semua Kategori (1.248)', active: true, x: 128, w: 170 },
  { label: 'Elektronik & IT (542)', active: false, x: 310, w: 160 },
  { label: 'Furnitur & Meubeler (410)', active: false, x: 482, w: 180 },
  { label: 'Peralatan Lab (278)', active: false, x: 674, w: 155 },
  { label: 'Kendaraan (18)', active: false, x: 841, w: 125 }
];

catChips.forEach(c => {
  addNode('rectangle', `Cat Chip ${c.label}`, scr2, c.x, 130, c.w, 36, {
    fill: c.active ? C.secondaryContainer : C.surfaceContainer,
    cornerRadius: 8
  });
  addNode('text', `Cat Text ${c.label}`, scr2, c.x, 140, c.w, 16, {
    characters: c.label,
    fill: c.active ? C.onSecondaryContainer : C.onSurfaceVariant,
    fontSize: 12,
    fontStyle: c.active ? 'Bold' : 'Regular',
    textAlign: 'center'
  });
});

// Action Row: Search & Add Button
addNode('rectangle', 'Search Asset Box', scr2, 128, 180, 360, 44, {
  fill: C.surfaceContainerHigh,
  cornerRadius: 22
});
addNode('text', 'Search Asset Text', scr2, 150, 192, 300, 20, {
  characters: '🔍 Filter nama atau kode aset...',
  fill: C.onSurfaceVariant,
  fontSize: 13
});

// Filter Status Dropdown Pill
addNode('rectangle', 'Status Filter Pill', scr2, 506, 180, 180, 44, {
  fill: C.surfaceContainer,
  cornerRadius: 22
});
addNode('text', 'Status Filter Text', scr2, 506, 192, 180, 20, {
  characters: 'Status: Semua Kondisi ▾',
  fill: C.onSurface,
  fontSize: 12,
  textAlign: 'center'
});

// Lokasi Gedung Dropdown Pill
addNode('rectangle', 'Lokasi Filter Pill', scr2, 702, 180, 180, 44, {
  fill: C.surfaceContainer,
  cornerRadius: 22
});
addNode('text', 'Lokasi Filter Text', scr2, 702, 192, 180, 20, {
  characters: 'Gedung: Semua Gedung ▾',
  fill: C.onSurface,
  fontSize: 12,
  textAlign: 'center'
});

// Add Asset Button (Filled Primary)
addNode('rectangle', 'Add Asset Btn', scr2, 1204, 180, 200, 44, {
  fill: C.primary,
  cornerRadius: 22
});
addNode('text', 'Add Asset Btn Text', scr2, 1204, 192, 200, 20, {
  characters: '+ Tambah Aset Baru',
  fill: C.onPrimary,
  fontSize: 13,
  fontStyle: 'Bold',
  textAlign: 'center'
});

// Main Data Table Container
const table = addNode('rectangle', 'Aset Table Bg', scr2, 128, 244, 880, 680, {
  fill: C.cardBg,
  cornerRadius: 24,
  stroke: C.outlineVariant,
  strokeWeight: 1
});

// Table Header Row
addNode('rectangle', 'Table Header Bg', scr2, 128, 244, 880, 48, {
  fill: C.surfaceContainer,
  cornerRadius: 24
});
addNode('text', 'TH Kode', scr2, 156, 260, 130, 18, {
  characters: 'KODE ASET',
  fill: C.onSurfaceVariant,
  fontSize: 11,
  fontStyle: 'Bold'
});
addNode('text', 'TH Nama', scr2, 296, 260, 250, 18, {
  characters: 'NAMA & SPESIFIKASI',
  fill: C.onSurfaceVariant,
  fontSize: 11,
  fontStyle: 'Bold'
});
addNode('text', 'TH Lokasi', scr2, 556, 260, 160, 18, {
  characters: 'LOKASI RUANG',
  fill: C.onSurfaceVariant,
  fontSize: 11,
  fontStyle: 'Bold'
});
addNode('text', 'TH Status', scr2, 726, 260, 120, 18, {
  characters: 'KONDISI / STATUS',
  fill: C.onSurfaceVariant,
  fontSize: 11,
  fontStyle: 'Bold'
});
addNode('text', 'TH Aksi', scr2, 896, 260, 80, 18, {
  characters: 'AKSI',
  fill: C.onSurfaceVariant,
  fontSize: 11,
  fontStyle: 'Bold',
  textAlign: 'center'
});

// Table Rows (Real asset samples from SIMAS)
const assetRows = [
  {
    code: 'AST-TI-2024-001',
    name: 'Laptop ASUS ROG Strix G16',
    spec: 'Core i9, 32GB RAM, RTX 4070 (Lab VR)',
    loc: 'Lab Multimedia Komputer 1',
    cond: 'Baik',
    condBg: C.successContainer,
    condText: C.onSuccess,
    avail: 'Tersedia',
    availBg: C.infoContainer,
    availText: C.onInfo,
    selected: true,
    y: 300
  },
  {
    code: 'AST-TI-2024-002',
    name: 'Proyektor Epson EB-X500',
    spec: '3600 ANSI Lumens, HDMI & Wireless',
    loc: 'Ruang Dosen TI Lt. 2',
    cond: 'Baik',
    condBg: C.successContainer,
    condText: C.onSuccess,
    avail: 'Dipinjam',
    availBg: C.warningContainer,
    availText: C.onWarning,
    selected: false,
    y: 396
  },
  {
    code: 'AST-FT-2023-014',
    name: 'AC Daikin Inverter 2 PK',
    spec: 'R32 Eco, Wall Mounted High Power',
    loc: 'Ruang Seminar Utama Lt. 3',
    cond: 'Rusak Ringan',
    condBg: C.errorContainer,
    condText: C.onError,
    avail: 'Dalam Servis',
    availBg: C.tertiaryContainer,
    availText: C.onTertiaryContainer,
    selected: false,
    y: 492
  },
  {
    code: 'AST-MIPA-2022-088',
    name: 'Mikroskop Binokuler Olympus CX23',
    spec: 'LED Illumination, 4x-100x Objective',
    loc: 'Laboratorium Biologi Molekuler',
    cond: 'Baik',
    condBg: C.successContainer,
    condText: C.onSuccess,
    avail: 'Tersedia',
    availBg: C.infoContainer,
    availText: C.onInfo,
    selected: false,
    y: 588
  },
  {
    code: 'AST-UM-2024-045',
    name: 'Sound System Yamaha StagePas',
    spec: '680W 10-Ch Mixer + Dual Mic Wireless',
    loc: 'Ruang Sarpras Aula Lt. 1',
    cond: 'Baik',
    condBg: C.successContainer,
    condText: C.onSuccess,
    avail: 'Tersedia',
    availBg: C.infoContainer,
    availText: C.onInfo,
    selected: false,
    y: 684
  },
  {
    code: 'AST-FT-2021-009',
    name: 'Switch Cisco Catalyst 2960 24-Port',
    spec: 'Gigabit PoE Managed Layer 2 Switch',
    loc: 'Server Room Data Center Lt. 2',
    cond: 'Baik',
    condBg: C.successContainer,
    condText: C.onSuccess,
    avail: 'Terpasang',
    availBg: C.secondaryContainer,
    availText: C.onSecondaryContainer,
    selected: false,
    y: 780
  }
];

assetRows.forEach((r, idx) => {
  // Row bg (highlight selected row in Material tonal color)
  addNode('rectangle', `Asset Row Bg ${idx}`, scr2, 140, r.y, 856, 84, {
    fill: r.selected ? C.primaryContainer : (idx % 2 === 0 ? C.cardBg : C.surfaceContainerLow),
    cornerRadius: 14,
    stroke: r.selected ? C.primary : '#E0E0E0',
    strokeWeight: r.selected ? 1.5 : 0.5
  });
  
  // Code
  addNode('text', `Row Code ${idx}`, scr2, 156, r.y + 18, 130, 18, {
    characters: r.code,
    fill: C.primary,
    fontSize: 12,
    fontStyle: 'Bold'
  });
  
  // Name & Spec
  addNode('text', `Row Name ${idx}`, scr2, 296, r.y + 16, 250, 20, {
    characters: r.name,
    fill: C.onSurface,
    fontSize: 13,
    fontStyle: 'Bold'
  });
  addNode('text', `Row Spec ${idx}`, scr2, 296, r.y + 38, 250, 16, {
    characters: r.spec,
    fill: C.onSurfaceVariant,
    fontSize: 11
  });
  
  // Location
  addNode('text', `Row Loc ${idx}`, scr2, 556, r.y + 24, 160, 18, {
    characters: r.loc,
    fill: C.onSurface,
    fontSize: 12
  });
  
  // Badges: Kondisi & Ketersediaan
  addNode('rectangle', `Row Cond Bg ${idx}`, scr2, 726, r.y + 16, 80, 22, {
    fill: r.condBg,
    cornerRadius: 6
  });
  addNode('text', `Row Cond Text ${idx}`, scr2, 726, r.y + 19, 80, 16, {
    characters: r.cond,
    fill: r.condText,
    fontSize: 10,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  
  addNode('rectangle', `Row Avail Bg ${idx}`, scr2, 726, r.y + 44, 80, 22, {
    fill: r.availBg,
    cornerRadius: 6
  });
  addNode('text', `Row Avail Text ${idx}`, scr2, 726, r.y + 47, 80, 16, {
    characters: r.avail,
    fill: r.availText,
    fontSize: 10,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  
  // Action Icon Menu
  addNode('text', `Row Action ${idx}`, scr2, 906, r.y + 28, 50, 24, {
    characters: '✏️  ⋮',
    fontSize: 14,
    textAlign: 'center'
  });
});

// Pagination Bar
addNode('text', 'Pagination Info', scr2, 156, 888, 300, 20, {
  characters: 'Menampilkan 1 - 6 dari 1.248 inventaris',
  fill: C.onSurfaceVariant,
  fontSize: 12
});
addNode('rectangle', 'Page Prev', scr2, 850, 880, 60, 32, {
  fill: C.surfaceContainer,
  cornerRadius: 8
});
addNode('text', 'Prev Text', scr2, 850, 888, 60, 16, {
  characters: '◀ Prev',
  fill: C.onSurfaceVariant,
  fontSize: 11,
  textAlign: 'center'
});
addNode('rectangle', 'Page Next', scr2, 920, 880, 60, 32, {
  fill: C.primary,
  cornerRadius: 8
});
addNode('text', 'Next Text', scr2, 920, 888, 60, 16, {
  characters: 'Next ▶',
  fill: C.onPrimary,
  fontSize: 11,
  fontStyle: 'Bold',
  textAlign: 'center'
});

// Right Side Drawer: Asset Detail Card (Material 3 Side Sheet)
const detailSheet = addNode('rectangle', 'Detail Sheet Bg', scr2, 1024, 244, 380, 680, {
  fill: C.cardBg,
  cornerRadius: 24,
  stroke: C.outlineVariant,
  strokeWeight: 1
});

addNode('text', 'Sheet Title', scr2, 1048, 268, 260, 24, {
  characters: 'Detail & Label Barcode Aset',
  fill: C.onSurface,
  fontSize: 16,
  fontStyle: 'Bold'
});
addNode('text', 'Sheet Close', scr2, 1360, 268, 24, 24, {
  characters: '✕',
  fill: C.onSurfaceVariant,
  fontSize: 16,
  textAlign: 'center'
});

// Asset Image Placeholder
addNode('rectangle', 'Asset Image Box', scr2, 1048, 308, 332, 140, {
  fill: C.surfaceContainerHigh,
  cornerRadius: 16
});
addNode('text', 'Asset Image Icon', scr2, 1048, 350, 332, 32, {
  characters: '💻',
  fontSize: 36,
  textAlign: 'center'
});
addNode('text', 'Asset Image Label', scr2, 1048, 390, 332, 20, {
  characters: 'Foto Fisik Inventaris • Update 12 Nov 2026',
  fill: C.onSurfaceVariant,
  fontSize: 11,
  textAlign: 'center'
});

// Asset Detail Specs
addNode('text', 'Detail Name', scr2, 1048, 464, 332, 22, {
  characters: 'Laptop ASUS ROG Strix G16',
  fill: C.onSurface,
  fontSize: 16,
  fontStyle: 'Bold'
});
addNode('text', 'Detail Code', scr2, 1048, 488, 332, 18, {
  characters: 'Nomor Registrasi: AST-TI-2024-001',
  fill: C.primary,
  fontSize: 12,
  fontStyle: 'Bold'
});

// Specifications List in Material Surface
addNode('rectangle', 'Specs Container', scr2, 1048, 516, 332, 180, {
  fill: C.surfaceContainerLow,
  cornerRadius: 16
});

const specs = [
  ('Tahun Pengadaan: 2024 (APBN Kampus)'),
  ('Harga Pembelian: Rp 28.500.000'),
  ('Lokasi Fisik: Lab Komputer 1 (Meja Instruktur)'),
  ('Penanggung Jawab: Bambang Irawan (Admin Sarpras)'),
  ('Garansi: Resmi ASUS Indonesia s/d 2026')
];

specs.forEach((s, idx) => {
  addNode('text', `Spec ${idx}`, scr2, 1064, 532 + idx * 32, 300, 18, {
    characters: `• ${s}`,
    fill: C.onSurface,
    fontSize: 11
  });
});

// Action Buttons at bottom of Sheet
addNode('rectangle', 'Print QR Btn', scr2, 1048, 716, 160, 40, {
  fill: C.secondaryContainer,
  cornerRadius: 20
});
addNode('text', 'Print QR Text', scr2, 1048, 726, 160, 20, {
  characters: '🖨️ Cetak QR Tag',
  fill: C.onSecondaryContainer,
  fontSize: 12,
  fontStyle: 'Bold',
  textAlign: 'center'
});

addNode('rectangle', 'Edit Asset Btn', scr2, 1220, 716, 160, 40, {
  fill: C.primary,
  cornerRadius: 20
});
addNode('text', 'Edit Asset Text', scr2, 1220, 726, 160, 20, {
  characters: 'Edit Data Aset',
  fill: C.onPrimary,
  fontSize: 12,
  fontStyle: 'Bold',
  textAlign: 'center'
});

// Log Riwayat Singkat
addNode('text', 'Log Title', scr2, 1048, 780, 260, 18, {
  characters: 'Riwayat Audit & Mutasi:',
  fill: C.onSurfaceVariant,
  fontSize: 12,
  fontStyle: 'Bold'
});
addNode('text', 'Log 1', scr2, 1048, 806, 332, 32, {
  characters: '✓ 12 Nov 2026: Verifikasi fisik tahunan oleh Petugas Joko S. (Kondisi 100% Baik)',
  fill: C.onSurface,
  fontSize: 11
});
addNode('text', 'Log 2', scr2, 1048, 846, 332, 32, {
  characters: '✓ 04 Okt 2026: Peminjaman untuk Uji Sertifikasi Mahasiswa (Selesai tanpa kendala)',
  fill: C.onSurfaceVariant,
  fontSize: 11
});


// =========================================================================
// SCREEN 3: ALUR APPROVAL & DETAIL PEMINJAMAN (M3)
// =========================================================================
const scr3 = addNode('frame', '[M3] SIMAS - Detail Approval Peminjaman', null, 3080, 0, 1440, 960, {
  fill: C.surface,
  clip: true
});

createNavRail(scr3, 'pinjam');
createTopAppBar(scr3, 'Otorisasi & Approval Peminjaman Sarpras', 'Portal Wewenang Pimpinan & Admin Sarpras • Verifikasi Stok & Penerbitan SPK');

// Breadcrumb & Back Link
addNode('text', 'Breadcrumb', scr3, 128, 90, 600, 20, {
  characters: '← Kembali ke Daftar Peminjaman  /  Detail Permohonan #PINJ-2026-089',
  fill: C.primary,
  fontSize: 13,
  fontStyle: 'Bold'
});

// Stepper Progress Bar (M3 Process Indicator)
const stepperBg = addNode('rectangle', 'Stepper Bg', scr3, 128, 124, 1276, 76, {
  fill: C.cardBg,
  cornerRadius: 20,
  stroke: C.outlineVariant,
  strokeWeight: 1
});

const steps = [
  { no: '1', title: 'Pengajuan Dosen/Mhs', status: 'Selesai', color: C.primary, text: C.onPrimary, x: 170 },
  { no: '2', title: 'Verifikasi Ketersediaan', status: 'Selesai', color: C.primary, text: C.onPrimary, x: 440 },
  { no: '3', title: 'Approval Pimpinan/Admin', status: 'Aktif Menunggu', color: C.warningContainer, text: C.onWarning, active: true, x: 740 },
  { no: '4', title: 'Penyerahan Sarana', status: 'Pending', color: C.surfaceContainerHigh, text: C.onSurfaceVariant, x: 1040 }
];

steps.forEach(s => {
  addNode('ellipse', `Step Circle ${s.no}`, scr3, s.x, 142, 36, 36, {
    fill: s.color
  });
  addNode('text', `Step No ${s.no}`, scr3, s.x, 150, 36, 20, {
    characters: s.active ? '⏳' : (s.status === 'Selesai' ? '✓' : s.no),
    fill: s.text,
    fontSize: 14,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  addNode('text', `Step Title ${s.no}`, scr3, s.x + 48, 142, 220, 18, {
    characters: s.title,
    fill: C.onSurface,
    fontSize: 12,
    fontStyle: 'Bold'
  });
  addNode('text', `Step Sub ${s.no}`, scr3, s.x + 48, 162, 220, 16, {
    characters: s.status,
    fill: s.active ? '#B3261E' : C.onSurfaceVariant,
    fontSize: 11
  });
});

// Two Columns for Detail Review
// Left Column: Applicant Profile & Item Details
const leftCol = addNode('rectangle', 'Left Col Bg', scr3, 128, 220, 800, 700, {
  fill: C.cardBg,
  cornerRadius: 24,
  stroke: C.outlineVariant,
  strokeWeight: 1
});

addNode('text', 'Review Title', scr3, 156, 248, 400, 24, {
  characters: 'Berkas Permohonan Peminjaman Sarpras',
  fill: C.onSurface,
  fontSize: 18,
  fontStyle: 'Bold'
});
addNode('text', 'Review Code', scr3, 156, 274, 400, 18, {
  characters: 'Nomor Tiket: PINJ-2026-089 • Tanggal Masuk: 16 Nov 2026, 09:15 WIB',
  fill: C.onSurfaceVariant,
  fontSize: 12
});

// Status Badge at top right of card
addNode('rectangle', 'Review Status Bg', scr3, 760, 246, 140, 28, {
  fill: C.warningContainer,
  cornerRadius: 8
});
addNode('text', 'Review Status Text', scr3, 760, 251, 140, 18, {
  characters: 'Menunggu Persetujuan',
  fill: C.onWarning,
  fontSize: 11,
  fontStyle: 'Bold',
  textAlign: 'center'
});

// Profile Applicant Box
addNode('rectangle', 'Applicant Box', scr3, 156, 310, 744, 110, {
  fill: C.surfaceContainerLow,
  cornerRadius: 16
});
addNode('ellipse', 'App Avatar', scr3, 178, 330, 64, 64, {
  fill: C.primaryContainer
});
addNode('text', 'App Avatar Icon', scr3, 178, 344, 64, 36, {
  characters: '👨‍🏫',
  fontSize: 28,
  textAlign: 'center'
});

addNode('text', 'App Name', scr3, 260, 328, 300, 22, {
  characters: 'Budi Santoso, M.Kom',
  fill: C.onSurface,
  fontSize: 16,
  fontStyle: 'Bold'
});
addNode('text', 'App NIP', scr3, 260, 352, 400, 18, {
  characters: 'NIP: 198804152014041002 • Dosen Tetap Teknik Informatika',
  fill: C.onSurfaceVariant,
  fontSize: 12
});
addNode('text', 'App Contact', scr3, 260, 372, 400, 18, {
  characters: 'Kontak: 0812-9876-5432 • Email: budi.santoso@univ.ac.id',
  fill: C.primary,
  fontSize: 12
});
addNode('text', 'App Keperluan', scr3, 260, 392, 480, 18, {
  characters: 'Keperluan Acara: Workshop Nasional "AI & Cloud Computing 2026"',
  fill: C.onSurface,
  fontSize: 12,
  fontStyle: 'Bold'
});

// Sarana Yang Diajukan
addNode('text', 'Item Header', scr3, 156, 444, 300, 20, {
  characters: 'Daftar Sarana & Prasarana Yang Dimohon:',
  fill: C.onSurface,
  fontSize: 14,
  fontStyle: 'Bold'
});

const requestedItems = [
  {
    name: '2x Proyektor Epson EB-X500',
    code: 'AST-TI-2024-002 & AST-TI-2024-003',
    stock: 'Stok: Tersedia (Kondisi Baik 100%)',
    stockColor: C.onSuccess,
    badgeBg: C.successContainer,
    y: 476
  },
  {
    name: '1x Ruang Seminar Utama Lt. 3 (Kapasitas 120 Org)',
    code: 'GEDUNG-UTAMA-LT3-SEM',
    stock: 'Jadwal: Ruangan Kosong Pada Tanggal Tersebut',
    stockColor: C.onSuccess,
    badgeBg: C.successContainer,
    y: 560
  },
  {
    name: '2x Wireless Microphone Shure & Sound System',
    code: 'AST-UM-2024-045',
    stock: 'Stok: Tersedia di Gudang Sarpras',
    stockColor: C.onSuccess,
    badgeBg: C.successContainer,
    y: 644
  }
];

requestedItems.forEach((it, idx) => {
  addNode('rectangle', `Req Item Box ${idx}`, scr3, 156, it.y, 744, 72, {
    fill: C.surfaceContainerLow,
    cornerRadius: 14
  });
  addNode('text', `Req Item Name ${idx}`, scr3, 176, it.y + 14, 400, 20, {
    characters: it.name,
    fill: C.onSurface,
    fontSize: 13,
    fontStyle: 'Bold'
  });
  addNode('text', `Req Item Code ${idx}`, scr3, 176, it.y + 38, 400, 16, {
    characters: it.code,
    fill: C.onSurfaceVariant,
    fontSize: 11
  });
  
  // Stock Check Badge
  addNode('rectangle', `Req Badge ${idx}`, scr3, 620, it.y + 20, 260, 30, {
    fill: it.badgeBg,
    cornerRadius: 8
  });
  addNode('text', `Req Badge Text ${idx}`, scr3, 620, it.y + 26, 260, 18, {
    characters: `✓ ${it.stock}`,
    fill: it.stockColor,
    fontSize: 11,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
});

// Waktu Pinjam & Rincian Pengembalian
addNode('rectangle', 'Time Box', scr3, 156, 736, 744, 64, {
  fill: C.infoContainer,
  cornerRadius: 14
});
addNode('text', 'Time Icon', scr3, 176, 752, 32, 32, {
  characters: '📅',
  fontSize: 22
});
addNode('text', 'Time Title', scr3, 216, 746, 600, 20, {
  characters: 'Jadwal Peminjaman: 17 Nov 2026 (08:00 WIB) s/d 18 Nov 2026 (17:00 WIB)',
  fill: C.onInfo,
  fontSize: 13,
  fontStyle: 'Bold'
});
addNode('text', 'Time Sub', scr3, 216, 768, 600, 18, {
  characters: 'Total Durasi: 2 Hari Kerja • Lokasi Pengembalian: Ruang Sarpras Gedung Rektorat Lt. 1',
  fill: C.onInfo,
  fontSize: 11
});

// Dokumen Surat Izin Lampiran
addNode('rectangle', 'Doc Lampiran Box', scr3, 156, 818, 744, 76, {
  fill: C.surfaceContainer,
  cornerRadius: 14
});
addNode('text', 'Doc Icon', scr3, 176, 836, 32, 32, {
  characters: '📄',
  fontSize: 24
});
addNode('text', 'Doc Name', scr3, 216, 832, 450, 20, {
  characters: 'Surat_Tugas_Dekan_Workshop_AI_2026.pdf (1.4 MB)',
  fill: C.primary,
  fontSize: 13,
  fontStyle: 'Bold'
});
addNode('text', 'Doc Signed', scr3, 216, 854, 450, 18, {
  characters: 'Ditandatangani secara elektronik oleh Dekan Fakultas Teknik',
  fill: C.onSurfaceVariant,
  fontSize: 11
});
addNode('rectangle', 'Preview Doc Btn', scr3, 740, 836, 140, 36, {
  fill: C.secondaryContainer,
  cornerRadius: 18
});
addNode('text', 'Preview Doc Text', scr3, 740, 846, 140, 18, {
  characters: 'Buka Dokumen ↗',
  fill: C.onSecondaryContainer,
  fontSize: 11,
  fontStyle: 'Bold',
  textAlign: 'center'
});


// -------------------------------------------------------------------------
// Right Column: Form Otorisasi & Keputusan Persetujuan (Pimpinan / Admin)
// -------------------------------------------------------------------------
const rightCol = addNode('rectangle', 'Right Col Bg', scr3, 952, 220, 452, 700, {
  fill: C.cardBg,
  cornerRadius: 24,
  stroke: C.outlineVariant,
  strokeWeight: 1
});

addNode('text', 'Decision Header', scr3, 980, 248, 380, 24, {
  characters: 'Keputusan Otorisasi Sarpras',
  fill: C.onSurface,
  fontSize: 18,
  fontStyle: 'Bold'
});
addNode('text', 'Decision Sub', scr3, 980, 274, 380, 18, {
  characters: 'Persetujuan resmi penanggung jawab fasilitas kampus',
  fill: C.onSurfaceVariant,
  fontSize: 12
});

// Aktor Otorisasi Pill
addNode('rectangle', 'Actor Pill', scr3, 980, 310, 396, 56, {
  fill: C.primaryContainer,
  cornerRadius: 16
});
addNode('text', 'Actor Name', scr3, 996, 320, 360, 20, {
  characters: 'Pejabat Penyetuju: Bambang Irawan (Admin Sarpras)',
  fill: C.onPrimaryContainer,
  fontSize: 13,
  fontStyle: 'Bold'
});
addNode('text', 'Actor Role', scr3, 996, 340, 360, 16, {
  characters: 'Hak Akses: Pimpinan & Admin Berwenang Menyetujui',
  fill: C.primary,
  fontSize: 11
});

// Syarat & Catatan Persetujuan
addNode('text', 'Note Label', scr3, 980, 386, 380, 18, {
  characters: 'Catatan & Instruksi Khusus untuk Peminjam:',
  fill: C.onSurface,
  fontSize: 12,
  fontStyle: 'Bold'
});

addNode('rectangle', 'Note Textarea', scr3, 980, 412, 396, 120, {
  fill: C.surfaceContainerLow,
  cornerRadius: 12,
  stroke: C.outlineVariant,
  strokeWeight: 1
});
addNode('text', 'Note Content', scr3, 996, 426, 364, 80, {
  characters: 'Disetujui untuk kegiatan akademik. Peminjam wajib mengembalikan proyektor dalam keadaan bersih dan melapor ke petugas Joko Supriyanto sebelum pukul 17:00 WIB.',
  fill: C.onSurface,
  fontSize: 12
});

// Checklist Persyaratan Fisik
addNode('text', 'Checklist Label', scr3, 980, 552, 380, 18, {
  characters: 'Checklist Verifikasi Teknis:',
  fill: C.onSurface,
  fontSize: 12,
  fontStyle: 'Bold'
});

const checks = [
  'Ketersediaan jadwal ruangan tidak bentrok perkuliahan',
  'Barang telah diuji kelayakan & baterai pointer penuh',
  'Surat tugas lengkap & terverifikasi Fakultas Teknik',
  'Penanggung jawab operasional telah ditunjuk'
];

checks.forEach((ch, idx) => {
  addNode('rectangle', `Check Box ${idx}`, scr3, 980, 580 + idx * 32, 20, 20, {
    fill: C.primary,
    cornerRadius: 4
  });
  addNode('text', `Check Mark ${idx}`, scr3, 980, 582 + idx * 32, 20, 16, {
    characters: '✓',
    fill: C.onPrimary,
    fontSize: 12,
    fontStyle: 'Bold',
    textAlign: 'center'
  });
  addNode('text', `Check Text ${idx}`, scr3, 1010, 582 + idx * 32, 360, 18, {
    characters: ch,
    fill: C.onSurface,
    fontSize: 11
  });
});

// Action Buttons: Tolak vs Setujui
// Tombol Tolak (Outlined / Tonal M3)
addNode('rectangle', 'Tolak Large Btn', scr3, 980, 740, 396, 48, {
  fill: C.errorContainer,
  cornerRadius: 24
});
addNode('text', 'Tolak Large Text', scr3, 980, 754, 396, 20, {
  characters: '✕ Tolak Permohonan Pinjaman',
  fill: C.onError,
  fontSize: 13,
  fontStyle: 'Bold',
  textAlign: 'center'
});

// Tombol Setujui (Filled Primary M3 with elevation)
addNode('rectangle', 'Setuju Large Btn', scr3, 980, 804, 396, 56, {
  fill: C.primary,
  cornerRadius: 28
});
addNode('text', 'Setuju Large Text', scr3, 980, 820, 396, 24, {
  characters: '✓ Setujui & Terbitkan Surat Peminjaman (SPK)',
  fill: C.onPrimary,
  fontSize: 14,
  fontStyle: 'Bold',
  textAlign: 'center'
});

addNode('text', 'Security Note', scr3, 980, 874, 396, 20, {
  characters: '🔒 Tindakan ini akan dicatat ke dalam Audit Trail Log SIMAS',
  fill: C.onSurfaceVariant,
  fontSize: 11,
  textAlign: 'center'
});

// Write to JSON
const scriptPath = path.join(__dirname, 'scratch_simas_m3.json');
fs.writeFileSync(scriptPath, JSON.stringify(commands, null, 2));
console.log(`Generated ${commands.length} commands for 3 Material Design 3 screens.`);

// Execute with FigCraft CLI
const outPath = 'C:\\Coding\\PWEB AISTUDIO\\simas_material3.figcraft';
console.log(`Executing figcraft-cli to generate ${outPath}...`);
try {
  const result = cp.execSync(`"C:\\Program Files\\ArtCraft\\FigCraft\\figcraft-cli.exe" run "${scriptPath}" --out "${outPath}"`, {
    maxBuffer: 1024 * 1024 * 50
  });
  console.log('FigCraft CLI result:', result.toString());
} catch (e) {
  console.error('CLI Execution Error:', e.stdout?.toString() || e.message);
}
