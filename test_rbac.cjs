const fs = require('fs');

// Mock browser global environment
global.window = global;
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; },
  clear() { this.store = {}; }
};

const authCode = fs.readFileSync('js/auth.js', 'utf8');
const rbacCode = fs.readFileSync('js/rbac.js', 'utf8');

eval(authCode);
eval(rbacCode);

console.log('--- Testing RBAC & Auth logic ---');
console.log('DEFAULT_USERS count:', window.Auth.getUsers().length);

const testMatrix = [
  // Admin permissions
  { role: 'admin', perm: 'assets:delete', expected: true },
  { role: 'admin', perm: 'assets:create', expected: true },
  { role: 'admin', perm: 'users:manage', expected: true },
  { role: 'admin', perm: 'settings:manage', expected: true },
  { role: 'admin', perm: 'reports:view', expected: true },
  
  // Petugas permissions
  { role: 'petugas', perm: 'assets:create', expected: true },
  { role: 'petugas', perm: 'assets:edit', expected: true },
  { role: 'petugas', perm: 'assets:delete', expected: false }, // Cannot delete assets
  { role: 'petugas', perm: 'users:manage', expected: false },  // Cannot manage users
  { role: 'petugas', perm: 'settings:manage', expected: false },
  { role: 'petugas', perm: 'maintenance:view', expected: true },
  { role: 'petugas', perm: 'reports:view', expected: true },
  
  // Pimpinan permissions
  { role: 'pimpinan', perm: 'assets:view', expected: true },
  { role: 'pimpinan', perm: 'assets:create', expected: false }, // No CRUD
  { role: 'pimpinan', perm: 'assets:edit', expected: false },
  { role: 'pimpinan', perm: 'assets:delete', expected: false },
  { role: 'pimpinan', perm: 'loans:approve', expected: true },  // Can approve loans
  { role: 'pimpinan', perm: 'reports:view', expected: true },
  { role: 'pimpinan', perm: 'users:manage', expected: false },
  
  // Peminjam permissions
  { role: 'peminjam', perm: 'assets:view', expected: true },
  { role: 'peminjam', perm: 'assets:create', expected: false },
  { role: 'peminjam', perm: 'assets:edit', expected: false },
  { role: 'peminjam', perm: 'assets:delete', expected: false },
  { role: 'peminjam', perm: 'loans:create', expected: true },   // Can request loan
  { role: 'peminjam', perm: 'loans:return', expected: true },   // Can return
  { role: 'peminjam', perm: 'loans:approve', expected: false }, // Cannot approve
  { role: 'peminjam', perm: 'reports:view', expected: false },  // No internal reports
  { role: 'peminjam', perm: 'maintenance:view', expected: false },
  { role: 'peminjam', perm: 'users:manage', expected: false }
];

let allPassed = true;
for (const test of testMatrix) {
  const result = window.RBAC.hasRolePermission(test.role, test.perm);
  const pass = result === test.expected;
  if (!pass) allPassed = false;
  console.log(`[${pass ? 'OK' : 'FAIL'}] Role: ${test.role.padEnd(8)} | Perm: ${test.perm.padEnd(18)} | Got: ${result} | Expected: ${test.expected}`);
}

// Test Demo Logins
console.log('\n--- Testing Demo Accounts Login ---');
const demoLogins = [
  { u: 'admin', p: 'admin123', expectedRole: 'admin' },
  { u: 'petugas', p: 'petugas123', expectedRole: 'petugas' },
  { u: 'pimpinan', p: 'pimpinan123', expectedRole: 'pimpinan' },
  { u: 'peminjam', p: 'peminjam123', expectedRole: 'peminjam' },
  { u: 'wrong', p: 'pass', expectFail: true }
];

for (const demo of demoLogins) {
  const res = window.Auth.login(demo.u, demo.p);
  if (demo.expectFail) {
    const ok = !res.success;
    console.log(`[${ok ? 'OK' : 'FAIL'}] Invalid login rejected properly: ${res.message}`);
    if (!ok) allPassed = false;
  } else {
    const ok = res.success && res.user.role === demo.expectedRole;
    console.log(`[${ok ? 'OK' : 'FAIL'}] Login ${demo.u}: role ${res.user ? res.user.role : 'none'} (expected: ${demo.expectedRole})`);
    if (!ok) allPassed = false;
  }
}

console.log('\nSUMMARY: ' + (allPassed ? 'ALL TESTS PASSED SUCCESSFULLY!' : 'SOME TESTS FAILED!'));

