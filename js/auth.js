/**
 * SIMAS - Sistem Informasi Sarana & Prasarana
 * js/auth.js - Modul Autentikasi, Pengelolaan Sesi, dan Akun Demo (Vanilla JS)
 */

const STORAGE_KEY_USERS = 'simas_users';
const STORAGE_KEY_CURRENT_USER = 'simas_current_user';

// Daftar Akun Demo Default Resmi sesuai spesifikasi tugas
const DEFAULT_DEMO_USERS = [
  {
    username: 'admin',
    password: 'admin123',
    nama: 'Bambang Irawan, S.Kom',
    nip: '198403152008121002',
    email: 'bambang.admin@institusi.ac.id',
    unit: 'Bagian Umum & Perlengkapan Sarpras',
    role: 'admin',
    roleLabel: 'Admin Sarpras',
    avatar: '../assets/avatar_bambang.jpg',
    deskripsi: 'Akses penuh ke seluruh sistem, inventaris, laporan, dan manajemen akun pengguna.'
  },
  {
    username: 'petugas',
    password: 'petugas123',
    nama: 'Joko Supriyanto, A.Md',
    nip: '198807212012011004',
    email: 'joko.sarpras@institusi.ac.id',
    unit: 'Divisi Operasional & Teknisi Sarpras',
    role: 'petugas',
    roleLabel: 'Petugas Sarpras',
    avatar: '../assets/avatar_bambang.jpg',
    deskripsi: 'Mengelola inventaris, peminjaman, dan pemeliharaan. Tidak memiliki akses hapus aset dan manajemen user.'
  },
  {
    username: 'pimpinan',
    password: 'pimpinan123',
    nama: 'Dr. Ir. Hendro Wicaksono, M.T.',
    nip: '197804152003121002',
    email: 'hendro.pimpinan@institusi.ac.id',
    unit: 'Wakil Rektor Bidang Sumber Daya & Sarana',
    role: 'pimpinan',
    roleLabel: 'Pimpinan Institusi',
    avatar: '../assets/avatar_hendro.jpg',
    deskripsi: 'Melihat dashboard, inventaris, laporan, dan memberikan persetujuan (approval) peminjaman.'
  },
  {
    username: 'peminjam',
    password: 'peminjam123',
    nama: 'Budi Santoso, M.Kom',
    nip: '199205102019031015',
    email: 'budi.santoso@institusi.ac.id',
    unit: 'Fakultas Teknik / Dosen Informatika',
    role: 'peminjam',
    roleLabel: 'Peminjam (Dosen/Tendik)',
    avatar: '../assets/avatar_bambang.jpg',
    deskripsi: 'Melihat ketersediaan aset, mengajukan permohonan peminjaman dan pengembalian sarana.'
  }
];

// Inisialisasi daftar pengguna di localStorage jika belum ada
function initUsersStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_USERS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(DEFAULT_DEMO_USERS));
      return DEFAULT_DEMO_USERS;
    }
    return JSON.parse(stored);
  } catch (err) {
    console.error('Error membaca storage pengguna:', err);
    return DEFAULT_DEMO_USERS;
  }
}

// Ambil seluruh daftar pengguna
function getUsers() {
  return initUsersStorage();
}

// Simpan daftar pengguna ke localStorage
function saveUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Error menyimpan pengguna:', err);
  }
}

// Ambil pengguna yang sedang login saat ini
function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error membaca sesi pengguna saat ini:', err);
    return null;
  }
}

// Simpan sesi login pengguna
function setCurrentUser(user) {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Error menyimpan sesi pengguna:', err);
  }
}

// Login dengan verifikasi username & password
function login(username, password) {
  const users = getUsers();
  const cleanUser = String(username).trim().toLowerCase();
  const cleanPass = String(password).trim();

  const found = users.find(u => 
    (u.username.toLowerCase() === cleanUser || u.nip === cleanUser || u.email.toLowerCase() === cleanUser) &&
    u.password === cleanPass
  );

  if (!found) {
    return {
      success: false,
      message: 'Username/NIP atau kata sandi tidak cocok. Silakan periksa kembali kredensial akun Anda.'
    };
  }

  // Simpan ke sesi
  setCurrentUser(found);

  return {
    success: true,
    user: found,
    message: `Selamat datang kembali, ${found.nama} (${found.roleLabel})!`
  };
}

// Logout: Hapus sesi dan alihkan ke halaman login
function logout() {
  localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  const isInPages = window.location.pathname.includes('/pages/');
  const target = isInPages ? 'login.html' : 'pages/login.html';
  window.location.href = target;
}



// Tambah akun pengguna baru (Khusus Admin)
function addUser(userData) {
  const users = getUsers();
  if (users.some(u => u.username.toLowerCase() === userData.username.toLowerCase().trim())) {
    return { success: false, message: 'Username sudah digunakan oleh akun lain.' };
  }

  const newUser = {
    username: userData.username.trim(),
    password: userData.password || 'password123',
    nama: userData.nama.trim(),
    nip: userData.nip ? userData.nip.trim() : '-',
    email: userData.email ? userData.email.trim() : `${userData.username}@institusi.ac.id`,
    unit: userData.unit ? userData.unit.trim() : 'Unit Kerja Institusi',
    role: userData.role || 'peminjam',
    roleLabel: getRoleLabel(userData.role || 'peminjam'),
    avatar: userData.avatar || '../assets/avatar_bambang.jpg',
    deskripsi: userData.deskripsi || 'Pengguna sistem sarana prasarana.'
  };

  users.push(newUser);
  saveUsers(users);

  // Sinkronisasi asinkron ke database backend SQLite
  if (typeof fetch !== 'undefined') {
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    }).catch(err => console.log('Offline/Local mode user save:', err.message));
  }

  return { success: true, message: 'Pengguna baru berhasil ditambahkan.', user: newUser };
}

// Edit akun pengguna (Khusus Admin)
function updateUser(username, updatedData) {
  const users = getUsers();
  const idx = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase().trim());
  if (idx === -1) {
    return { success: false, message: 'Pengguna tidak ditemukan.' };
  }

  users[idx] = {
    ...users[idx],
    ...updatedData,
    roleLabel: getRoleLabel(updatedData.role || users[idx].role)
  };

  saveUsers(users);

  // Jika yang diedit adalah akun yang sedang aktif, perbarui sesi juga
  const current = getCurrentUser();
  if (current && current.username.toLowerCase() === username.toLowerCase().trim()) {
    setCurrentUser(users[idx]);
  }

  return { success: true, message: 'Data pengguna berhasil diperbarui.', user: users[idx] };
}

// Hapus akun pengguna (Khusus Admin)
function deleteUser(username) {
  const current = getCurrentUser();
  if (current && current.username.toLowerCase() === username.toLowerCase().trim()) {
    return { success: false, message: 'Tidak dapat menghapus akun yang sedang Anda gunakan saat ini.' };
  }

  let users = getUsers();
  const initialLength = users.length;
  users = users.filter(u => u.username.toLowerCase() !== username.toLowerCase().trim());

  if (users.length === initialLength) {
    return { success: false, message: 'Pengguna tidak ditemukan.' };
  }

  saveUsers(users);
  return { success: true, message: 'Pengguna berhasil dihapus.' };
}

// Reset akun demo ke default bawaan
function resetDemoUsers() {
  saveUsers(DEFAULT_DEMO_USERS);
  return DEFAULT_DEMO_USERS;
}

// Helper mapping nama peran
function getRoleLabel(roleKey) {
  switch (roleKey) {
    case 'admin': return 'Admin Sarpras';
    case 'petugas': return 'Petugas Sarpras';
    case 'pimpinan': return 'Pimpinan Institusi';
    case 'peminjam': return 'Peminjam';
    default: return 'Pengguna';
  }
}

// Pastikan storage selalu terinisialisasi saat file dimuat
initUsersStorage();

// Expose object ke window / global scope untuk kemudahan akses & testing
if (typeof window !== 'undefined') {
  window.Auth = {
    DEFAULT_DEMO_USERS,
    initUsersStorage,
    getUsers,
    saveUsers,
    getCurrentUser,
    setCurrentUser,
    login,
    logout,
    addUser,
    updateUser,
    deleteUser,
    resetDemoUsers,
    getRoleLabel
  };
}
