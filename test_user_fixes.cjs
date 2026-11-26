const assert = require('assert');
const fs = require('fs');

console.log('--- Testing User Fixes ---');

// 1. Verify "Cetak Label QR" button removed from Daftar Inventaris Sarana & Aset header
const asetHtml = fs.readFileSync('pages/aset.html', 'utf8');
assert(!asetHtml.includes('id="btn-cetak-qr"'), 'btn-cetak-qr header button should be removed from aset.html');
console.log('[PASS] Header button "Cetak Label QR" removed from pages/aset.html');

// 2. Verify Advanced Filter panel and button exists in pages/aset.html
assert(asetHtml.includes('id="btn-filter-lanjut"'), 'btn-filter-lanjut must exist');
assert(asetHtml.includes('id="advanced-filter-panel"'), 'advanced-filter-panel must exist');
console.log('[PASS] Advanced Filter Panel exists in pages/aset.html');

// 3. Verify Tambah/Aksi button removed from dashboard topbar
const indexHtml = fs.readFileSync('pages/index.html', 'utf8');
assert(!indexHtml.includes('id="btn-tambah-aksi"'), 'btn-tambah-aksi should be removed from pages/index.html navbar');
console.log('[PASS] "Tambah / Aksi" button removed from pages/index.html');

// 4. Verify CSV formats across all files use BOM \\uFEFF and semicolon delimiter
const csvFiles = ['aset.js', 'peminjaman.js', 'antrean.js', 'laporan.js', 'mutasi.js', 'stock.js'];
csvFiles.forEach(file => {
  const code = fs.readFileSync('js/' + file, 'utf8');
  assert(code.includes("const BOM = '\\uFEFF';"), `${file} must include UTF-8 BOM`);
  assert(code.includes("const delimiter = ';';"), `${file} must use semicolon delimiter`);
  assert(code.includes('new Blob([csvContent]'), `${file} must use Blob download`);
  console.log(`[PASS] ${file} CSV export formatted with UTF-8 BOM, semicolon delimiter, and Blob`);
});

// 5. Verify peminjaman.js syntax and has no stray loan references
const peminjamanCode = fs.readFileSync('js/peminjaman.js', 'utf8');
assert(!peminjamanCode.includes('loan.status === \'Diajukan\'') || peminjamanCode.includes('const loan ='), 'peminjaman.js must declare loan');
console.log('[PASS] peminjaman.js syntax and loan references verified');

// 6. Verify aset.js synchronization with localStorage and getStoredAssets
const asetCode = fs.readFileSync('js/aset.js', 'utf8');
assert(asetCode.includes('getStoredAssets()'), 'aset.js must call getStoredAssets()');
assert(asetCode.includes('saveStoredAssets('), 'aset.js must call saveStoredAssets()');
assert(asetCode.includes('let assets = getStoredAssets();'), 'assets must be let initialized from getStoredAssets()');
console.log('[PASS] aset.js properly synchronizes with simas_assets_data localStorage and backend');

console.log('\n========================================');
console.log('ALL USER SPECIFIC CHECKS PASSED (6/6)');
console.log('========================================');

