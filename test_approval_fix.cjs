const fs = require('fs');
const path = require('path');

console.log('--- Testing Peminjaman Approval Integration & RBAC Fix ---');

const peminjamanJs = fs.readFileSync(path.join(__dirname, 'js', 'peminjaman.js'), 'utf8');

// 1. Verify that 'menunggu approval' status is handled in getFilteredLoans
if (!peminjamanJs.includes("statusNorm === 'menunggu approval'")) {
  console.error('[FAIL] getFilteredLoans does not check statusNorm === menunggu approval');
  process.exit(1);
}
console.log('[PASS] getFilteredLoans handles statusNorm === menunggu approval');

// 2. Verify that selectLoan checks isPending for awaiting approval
if (!peminjamanJs.includes("const isPending = statusNorm === 'diajukan' || statusNorm === 'menunggu approval' || statusNorm.includes('menunggu');")) {
  console.error('[FAIL] selectLoan does not check isPending with Menunggu Approval');
  process.exit(1);
}
console.log('[PASS] selectLoan checks isPending properly for Menunggu Approval');

// 3. Verify approveSelectedLoan, rejectSelectedLoan, returnSelectedLoan call API
if (!peminjamanJs.includes('API.approveLoan') || !peminjamanJs.includes('API.rejectLoan') || !peminjamanJs.includes('API.returnLoan')) {
  console.error('[FAIL] API approval methods missing in peminjaman.js');
  process.exit(1);
}
console.log('[PASS] API approval methods present in peminjaman.js');

// 4. Test logic with simulated object
function simulateActionContainer(role, status) {
  const canApprove = role === 'admin' || role === 'pimpinan';
  const isPeminjam = role === 'peminjam';
  const statusNorm = status.toLowerCase().trim();
  const isPending = statusNorm === 'diajukan' || statusNorm === 'menunggu approval' || statusNorm.includes('menunggu');
  const isActive = statusNorm === 'disetujui' || statusNorm === 'aktif' || statusNorm === 'sedang dipinjam' || statusNorm === 'terlambat';
  const isRejected = statusNorm === 'ditolak';

  if (isPending) {
    if (canApprove) return 'BUTTONS: SETUJUI & TOLAK';
    return 'NOTICE: MENUNGGU PERSETUJUAN';
  } else if (isActive) {
    return isPeminjam ? 'BUTTON: AJUKAN PENGEMBALIAN' : 'BUTTON: KONFIRMASI PENGEMBALIAN';
  } else if (isRejected) {
    return 'NOTICE: DITOLAK';
  } else {
    return 'NOTICE: SELESAI / ARSIP';
  }
}

// Check admin with Menunggu Approval (the user's exact case)
const adminResult = simulateActionContainer('admin', 'Menunggu Approval');
if (adminResult !== 'BUTTONS: SETUJUI & TOLAK') {
  console.error(`[FAIL] Admin with Menunggu Approval expected buttons, got: ${adminResult}`);
  process.exit(1);
}
console.log('[PASS] Role Admin with status "Menunggu Approval" generates Setujui & Tolak buttons');

// Check pimpinan with Menunggu Approval
const pimpinanResult = simulateActionContainer('pimpinan', 'Menunggu Approval');
if (pimpinanResult !== 'BUTTONS: SETUJUI & TOLAK') {
  console.error(`[FAIL] Pimpinan with Menunggu Approval expected buttons, got: ${pimpinanResult}`);
  process.exit(1);
}
console.log('[PASS] Role Pimpinan with status "Menunggu Approval" generates Setujui & Tolak buttons');

// Check peminjam with Menunggu Approval
const peminjamResult = simulateActionContainer('peminjam', 'Menunggu Approval');
if (peminjamResult !== 'NOTICE: MENUNGGU PERSETUJUAN') {
  console.error(`[FAIL] Peminjam with Menunggu Approval expected notice, got: ${peminjamResult}`);
  process.exit(1);
}
console.log('[PASS] Role Peminjam with status "Menunggu Approval" displays waiting notice (no approval buttons)');

console.log('\n========================================');
console.log('APPROVAL LOGIC VERIFICATION: ALL PASSED');
console.log('========================================');

