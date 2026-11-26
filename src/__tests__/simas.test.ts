import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

test('SIMAS Core Module & File Integrity Checks', () => {
  const requiredFiles = [
    'backend/server.js',
    'backend/db.js',
    'js/api.js',
    'js/auth.js',
    'js/rbac.js',
    'js/app.js',
    'js/aset.js',
    'js/gedung.js',
    'js/peminjaman.js',
    'js/antrean.js',
    'js/tiket.js',
    'js/mutasi.js',
    'js/stock.js',
    'js/laporan.js',
    'pages/login.html',
    'pages/index.html',
    'pages/aset.html',
    'pages/gedung.html',
    'pages/peminjaman.html',
    'pages/antrean.html',
    'pages/tiket.html',
    'pages/mutasi.html',
    'pages/stock.html',
    'pages/laporan.html',
    'pages/kategori.html',
    'pages/pegawai.html',
    'pages/pengguna.html',
    'pages/pengaturan.html'
  ];

  for (const relPath of requiredFiles) {
    const fullPath = path.join(rootDir, relPath);
    assert.equal(fs.existsSync(fullPath), true, `Missing required file: ${relPath}`);
  }
});

test('SIMAS Mutable State Arrays for Backend Sync', () => {
  const stockJs = fs.readFileSync(path.join(rootDir, 'js/stock.js'), 'utf8');
  const mutasiJs = fs.readFileSync(path.join(rootDir, 'js/mutasi.js'), 'utf8');
  const laporanJs = fs.readFileSync(path.join(rootDir, 'js/laporan.js'), 'utf8');

  assert.equal(
    stockJs.includes('let auditItemsData = ['),
    true,
    'auditItemsData in js/stock.js must be declared with let so backend sync does not throw TypeError'
  );
  assert.equal(
    mutasiJs.includes('let mutasiData = ['),
    true,
    'mutasiData in js/mutasi.js must be declared with let so backend sync does not throw TypeError'
  );
  assert.equal(
    !laporanJs.includes('filteredLogsData'),
    true,
    'js/laporan.js must not reference undefined filteredLogsData'
  );
});

test('SIMAS CSV Export Formatting & UTF-8 BOM Compliance', () => {
  const csvFiles = ['js/aset.js', 'js/laporan.js', 'js/mutasi.js', 'js/stock.js', 'js/tiket.js'];
  for (const file of csvFiles) {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
    assert.equal(content.includes("const BOM = '\\uFEFF';"), true, `${file} must include UTF-8 BOM`);
    assert.equal(content.includes("const delimiter = ';';"), true, `${file} must use semicolon delimiter for Excel ID locale`);
  }
});

test('SIMAS No Blocking window.alert in Core Operational Modules', () => {
  const coreModules = ['js/app.js', 'js/aset.js', 'js/gedung.js', 'js/peminjaman.js', 'js/antrean.js', 'js/tiket.js', 'js/mutasi.js', 'js/stock.js', 'js/laporan.js'];
  for (const mod of coreModules) {
    const content = fs.readFileSync(path.join(rootDir, mod), 'utf8');
    assert.equal(
      /\balert\s*\(/.test(content),
      false,
      `${mod} should use non-blocking toast notifications instead of window.alert()`
    );
  }
});

test('SIMAS Redundant Tambah / Aksi Button Removed Across All Pages & Beginner Guide Enabled', () => {
  const pagesDir = path.join(rootDir, 'pages');
  const htmlFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));
  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(pagesDir, file), 'utf8');
    assert.equal(
      html.includes('id="btn-tambah-aksi"'),
      false,
      `pages/${file} should not contain redundant/non-functional #btn-tambah-aksi button`
    );
  }

  const navJs = fs.readFileSync(path.join(rootDir, 'js/navigation.js'), 'utf8');
  assert.equal(navJs.includes('PAGE_GUIDES'), true, 'js/navigation.js must include contextual beginner guides');
  assert.equal(navJs.includes('openSimasHelpModal'), true, 'js/navigation.js must provide interactive help modal');
});

test('SIMAS Peminjam Tenggat Kembali Countdown (Hari, Jam, Menit) & Same-Day 21:30 -> 22:00 Accuracy', () => {
  const appJs = fs.readFileSync(path.join(rootDir, 'js/app.js'), 'utf8');
  const startIdx = appJs.indexOf('function parseLocalDateTime(');
  const endIdx = appJs.indexOf('window.formatDueDateDisplay = formatDueDateDisplay;');
  assert.ok(startIdx > -1 && endIdx > startIdx, 'parseLocalDateTime & formatDueDateDisplay must exist in js/app.js');

  const snippet = appJs.slice(startIdx, endIdx).replace(/window\.\w+\s*=\s*\w+;/g, '');
  const fnFactory = new Function(`${snippet}; return { parseLocalDateTime, formatDueDateDisplay };`);
  const { parseLocalDateTime, formatDueDateDisplay } = fnFactory();

  // Exact scenario reported by user: now is 21:30, deadline is 22:00 same day -> must be 30 mnt, NOT overdue
  const now2130 = new Date(2026, 10, 20, 21, 30, 0);
  const resSameDay = formatDueDateDisplay('2026-11-20 22:00', now2130);
  assert.equal(resSameDay.isOverdue, false, '22:00 deadline at 21:30 must NOT be overdue');
  assert.equal(resSameDay.main, '30 mnt');
  assert.equal(resSameDay.countdownText, 'Sisa 30 mnt');

  // Multi-day + hours + minutes test
  const resMultiDay = formatDueDateDisplay('2026-11-22 00:15', now2130);
  assert.equal(resMultiDay.isOverdue, false);
  assert.equal(resMultiDay.main, '1 hari 2 jam 45 mnt');

  // Overdue by 1 jam 15 mnt
  const resOverdue = formatDueDateDisplay('2026-11-20 20:15', now2130);
  assert.equal(resOverdue.isOverdue, true);
  assert.equal(resOverdue.main, 'Lewat 1 jam 15 mnt');
  assert.equal(resOverdue.badge, 'Terlambat');

  // Date-only fallback defaults to local 23:59 (not overdue at 21:30 same day)
  const parsedDateOnly = parseLocalDateTime('2026-11-20');
  assert.equal(parsedDateOnly.getHours(), 23);
  assert.equal(parsedDateOnly.getMinutes(), 59);
  const resDateOnly = formatDueDateDisplay('2026-11-20', now2130);
  assert.equal(resDateOnly.isOverdue, false);
  assert.equal(resDateOnly.main, '2 jam 29 mnt');
});

test('SIMAS Audit Fixes: No Crashed Handlers or Dead window.print in Active Views', () => {
  const tiketJs = fs.readFileSync(path.join(rootDir, 'js/tiket.js'), 'utf8');
  assert.equal(tiketJs.includes('openActionDrawer('), false, 'js/tiket.js must not call undefined openActionDrawer()');

  const asetHtml = fs.readFileSync(path.join(rootDir, 'pages/aset.html'), 'utf8');
  assert.equal(asetHtml.includes('onclick="window.print()"'), false, 'pages/aset.html QR modal must not call dead window.print()');

  const laporanJs = fs.readFileSync(path.join(rootDir, 'js/laporan.js'), 'utf8');
  assert.equal(laporanJs.includes('downloadOfficialReportHTML'), true, 'js/laporan.js must use downloadable HTML report instead of dead window.print()');
});


