/**
 * SIMAS - Form Input / Edit Aset (Client-Side Interactivity & Validation)
 * Mendukung mode Tambah dan Edit dengan validasi JavaScript murni serta sinkronisasi data.
 */

// ================= 1. DATA MASTER & DEFAULT ASSETS ================= //

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-panel-left', href: 'index.html', active: false },
  { id: 'aset', label: 'Manajemen Aset', icon: 'archive', href: 'aset.html', active: false },
  { id: 'form', label: 'Form Input / Edit', icon: 'edit', href: 'form.html', active: true },
  { id: 'gedung', label: 'Gedung & Ruangan', icon: 'building-2', href: 'gedung.html', active: false },
  { id: 'peminjaman', label: 'Peminjaman & Reservasi', icon: 'calendar-clock', href: 'peminjaman.html', active: false },
  { id: 'antrean', label: 'Antrean Persetujuan', icon: 'check-square', href: 'antrean.html', active: false, badge: 4 },
  { id: 'pemeliharaan', label: 'Pemeliharaan & Tiket', icon: 'wrench', href: 'tiket.html', active: false },
  { id: 'mutasi', label: 'Mutasi Aset', icon: 'arrow-left-right', href: 'mutasi.html', active: false },
  { id: 'stock', label: 'Stock Opname', icon: 'scan-barcode', href: 'stock.html', active: false },
  { id: 'laporan', label: 'Laporan & Rangkuman', icon: 'file-text', href: 'laporan.html', active: false },
];

const defaultAssets = [
  {
    kode: 'SAR/2025/0102',
    serial: 'PF3K9820-T14',
    nama: 'Laptop ThinkPad T14 Gen 4',
    spesifikasi: 'Core i7-1365U, 16GB RAM, 512GB SSD',
    kategori: 'Elektronik',
    gedung: 'Gedung A, Lt. 3',
    ruang: 'R. 302 - Staf Keuangan',
    kondisi: 'Baik',
    status: 'Dipinjam',
    pj: 'Dewi Sartika',
  },
  {
    kode: 'SAR/2024/0891',
    serial: 'EPS-2250U-88X',
    nama: 'LCD Proyektor Epson EB-2250U',
    spesifikasi: '5.000 Lumens Full HD WUXGA 3LCD',
    kategori: 'Elektronik',
    gedung: 'GKB, Lt. 1',
    ruang: 'R. Multimedia Utama',
    kondisi: 'Cukup',
    status: 'Tersedia',
    pj: 'Agus Riyadi',
  },
  {
    kode: 'SAR/2023/0440',
    serial: 'OLY-CX23-B712',
    nama: 'Mikroskop Binokuler Olympus CX23',
    spesifikasi: 'LED Illumination, Plan Achromat 4x/10x/40x',
    kategori: 'Alat Lab',
    gedung: 'Lab Terpadu',
    ruang: 'R. Biologi Molekuler',
    kondisi: 'Baik',
    status: 'Tersedia',
    pj: 'Rina Hartati',
  },
  {
    kode: 'SAR/2022/0119',
    serial: 'DKN-FTKC50TV',
    nama: 'AC Daikin Inverter 2 PK',
    spesifikasi: 'Premium Inverter R32, FTKC Series',
    kategori: 'Utilitas',
    gedung: 'Gedung B, Lt. 2',
    ruang: 'R. Rapat Utama Dekanat',
    kondisi: 'Rusak Ringan',
    status: 'Perawatan',
    pj: 'Joko Supriyanto',
  },
  {
    kode: 'SAR/2025/0225',
    serial: 'JTI-CONF-16P',
    nama: 'Set Meja Rapat Konferensi Kayu Jati',
    spesifikasi: 'Kapasitas 16 Kursi Kulit Eksekutif, Port Kabel Tanam',
    kategori: 'Mebel',
    gedung: 'Gedung Rektorat',
    ruang: 'Lt. 4 - Ruang Senat',
    kondisi: 'Baik',
    status: 'Tersedia',
    pj: 'Bambang Irawan',
  },
];

let currentMode = 'add'; // 'add' | 'edit'
let selectedEditKode = null;

// ================= 2. INITIALIZATION & RENDERING ================= //

function getStoredAssets() {
  try {
    const raw = localStorage.getItem('simas_assets_data');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Gagal membaca localStorage:', e);
  }
  return [...defaultAssets];
}

function saveStoredAssets(data) {
  try {
    localStorage.setItem('simas_assets_data', JSON.stringify(data));
  } catch (e) {
    console.warn('Gagal menyimpan ke localStorage:', e);
  }
}

function renderSidebar() {
  if (typeof renderNavigation === 'function') {
    renderNavigation('form');
    return;
  }
  const container = document.getElementById('sidebar-menu-list');
  if (!container) return;

  container.innerHTML = menuItems.map(item => {
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
}

function populateEditSelector() {
  const select = document.getElementById('edit-asset-selector');
  if (!select) return;

  const assets = getStoredAssets();
  select.innerHTML = '<option value="">-- Pilih Aset yang Akan Diedit --</option>' +
    assets.map(a => `<option value="${a.kode}">${a.kode} - ${a.nama}</option>`).join('');
}

// Sidebar Mobile Toggle
function toggleSidebar() {
  const sidebar = document.getElementById('main-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar) return;
  sidebar.classList.toggle('-translate-x-full');
  if (overlay) overlay.classList.toggle('hidden');
}

// ================= 3. MODE SWITCHING ================= //

function switchFormMode(mode) {
  currentMode = mode;
  const tabAdd = document.getElementById('tab-mode-add');
  const tabEdit = document.getElementById('tab-mode-edit');
  const badgeMode = document.getElementById('badge-page-mode');
  const editSelectorCard = document.getElementById('edit-selector-card');
  const btnSubmitLabel = document.getElementById('btn-submit-label');
  const inputKode = document.getElementById('form-kode');

  clearValidationErrors();

  if (mode === 'add') {
    tabAdd.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition bg-white text-slate-900 shadow-xs flex items-center gap-1.5';
    tabEdit.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
    badgeMode.textContent = 'Mode: Tambah Aset Baru';
    badgeMode.className = 'px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider';
    editSelectorCard.classList.add('hidden');
    btnSubmitLabel.textContent = 'Simpan Data Aset Baru';
    inputKode.disabled = false;

    // Reset fields & beri saran kode baru
    resetFormInputs();
    const assets = getStoredAssets();
    const nextNum = String(assets.length + 1).padStart(4, '0');
    inputKode.value = `SAR/2025/${nextNum}`;
  } else {
    tabEdit.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition bg-white text-slate-900 shadow-xs flex items-center gap-1.5';
    tabAdd.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
    badgeMode.textContent = 'Mode: Edit / Perbarui Aset';
    badgeMode.className = 'px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider';
    editSelectorCard.classList.remove('hidden');
    btnSubmitLabel.textContent = 'Perbarui Data Aset';

    populateEditSelector();
    const selector = document.getElementById('edit-asset-selector');
    if (selectedEditKode) {
      selector.value = selectedEditKode;
      loadAssetForEdit(selectedEditKode);
    } else {
      selector.selectedIndex = 1;
      if (selector.value) loadAssetForEdit(selector.value);
    }
  }

  if (window.lucide) lucide.createIcons();
}

function loadAssetForEdit(kode) {
  if (!kode) return;
  selectedEditKode = kode;

  const assets = getStoredAssets();
  const item = assets.find(a => a.kode === kode);
  if (!item) return;

  clearValidationErrors();

  const inputKode = document.getElementById('form-kode');
  inputKode.value = item.kode;
  inputKode.disabled = true; // Kode NUP adalah identifier permanen

  document.getElementById('form-serial').value = item.serial || '';
  document.getElementById('form-nama').value = item.nama || '';
  document.getElementById('form-kategori').value = item.kategori || '';
  document.getElementById('form-spesifikasi').value = item.spesifikasi || '';
  document.getElementById('form-gedung').value = item.gedung || '';
  document.getElementById('form-ruang').value = item.ruang || '';
  document.getElementById('form-kondisi').value = item.kondisi || 'Baik';
  document.getElementById('form-status').value = item.status || 'Tersedia';
  document.getElementById('form-pj').value = item.pj || '';

  showToast(`Data aset ${kode} berhasil dimuat ke dalam formulir edit.`, 'info');
}

function resetFormInputs() {
  clearValidationErrors();
  document.getElementById('form-kode').value = '';
  document.getElementById('form-serial').value = '';
  document.getElementById('form-nama').value = '';
  document.getElementById('form-kategori').value = '';
  document.getElementById('form-spesifikasi').value = '';
  document.getElementById('form-gedung').value = '';
  document.getElementById('form-ruang').value = '';
  document.getElementById('form-kondisi').value = 'Baik';
  document.getElementById('form-status').value = 'Tersedia';
  document.getElementById('form-pj').value = '';

  if (currentMode === 'add') {
    const assets = getStoredAssets();
    const nextNum = String(assets.length + 1).padStart(4, '0');
    document.getElementById('form-kode').value = `SAR/2025/${nextNum}`;
  }
}

// ================= 4. JAVASCRIPT VALIDATION ================= //

function clearValidationErrors() {
  const fields = ['kode', 'serial', 'nama', 'kategori', 'spesifikasi', 'gedung', 'ruang', 'pj'];
  fields.forEach(f => {
    const err = document.getElementById(`err-${f}`);
    const input = document.getElementById(`form-${f}`);
    if (err) err.classList.add('hidden');
    if (input) input.classList.remove('border-rose-500', 'bg-rose-50/30');
  });
}

function showFieldError(field, message) {
  const err = document.getElementById(`err-${field}`);
  const input = document.getElementById(`form-${field}`);
  if (err) {
    err.textContent = message;
    err.classList.remove('hidden');
  }
  if (input) {
    input.classList.add('border-rose-500', 'bg-rose-50/30');
  }
}

function validateForm() {
  clearValidationErrors();
  let isValid = true;
  let firstInvalid = null;

  const kode = document.getElementById('form-kode').value.trim();
  const serial = document.getElementById('form-serial').value.trim();
  const nama = document.getElementById('form-nama').value.trim();
  const kategori = document.getElementById('form-kategori').value;
  const spesifikasi = document.getElementById('form-spesifikasi').value.trim();
  const gedung = document.getElementById('form-gedung').value;
  const ruang = document.getElementById('form-ruang').value.trim();
  const pj = document.getElementById('form-pj').value.trim();

  const assets = getStoredAssets();

  // 1. Validasi Kode
  if (!kode) {
    showFieldError('kode', 'Kode aset (NUP) wajib diisi.');
    isValid = false;
    if (!firstInvalid) firstInvalid = document.getElementById('form-kode');
  } else if (!/^SAR\/\d{4}\/\d{4}$/.test(kode)) {
    showFieldError('kode', 'Format kode harus: SAR/YYYY/XXXX (contoh: SAR/2025/0105)');
    isValid = false;
    if (!firstInvalid) firstInvalid = document.getElementById('form-kode');
  } else if (currentMode === 'add' && assets.some(a => a.kode === kode)) {
    showFieldError('kode', 'Kode aset ini sudah terdaftar. Gunakan nomor unik lainnya.');
    isValid = false;
    if (!firstInvalid) firstInvalid = document.getElementById('form-kode');
  }

  // 2. Validasi Nomor Seri
  if (!serial) {
    showFieldError('serial', 'Nomor seri pabrik (Serial Number) wajib diisi.');
    isValid = false;
    if (!firstInvalid) firstInvalid = document.getElementById('form-serial');
  } else if (serial.length < 4) {
    showFieldError('serial', 'Nomor seri minimal 4 karakter.');
    isValid = false;
    if (!firstInvalid) firstInvalid = document.getElementById('form-serial');
  }

  // 3. Validasi Nama Barang
  if (!nama) {
    showFieldError('nama', 'Nama sarana / barang wajib diisi.');
    isValid = false;
    if (!firstInvalid) firstInvalid = document.getElementById('form-nama');
  } else if (nama.length < 3) {
    showFieldError('nama', 'Nama barang minimal 3 karakter.');
    isValid = false;
    if (!firstInvalid) firstInvalid = document.getElementById('form-nama');
  }

  // 4. Validasi Kategori
  if (!kategori) {
    showFieldError('kategori', 'Silakan pilih kategori aset.');
    isValid = false;
    if (!firstInvalid) firstInvalid = document.getElementById('form-kategori');
  }

  // 5. Validasi Spesifikasi
  if (!spesifikasi) {
    showFieldError('spesifikasi', 'Spesifikasi teknis dan rincian wajib diisi.');
    isValid = false;
    if (!firstInvalid) firstInvalid = document.getElementById('form-spesifikasi');
  }

  // 6. Validasi Gedung
  if (!gedung) {
    showFieldError('gedung', 'Silakan pilih lokasi gedung / kampus.');
    isValid = false;
    if (!firstInvalid) firstInvalid = document.getElementById('form-gedung');
  }

  // 7. Validasi Ruangan
  if (!ruang) {
    showFieldError('ruang', 'Nama ruangan spesifik wajib diisi.');
    isValid = false;
    if (!firstInvalid) firstInvalid = document.getElementById('form-ruang');
  }

  // 8. Validasi PJ
  if (!pj) {
    showFieldError('pj', 'Nama penanggung jawab (PJ) wajib diisi.');
    isValid = false;
    if (!firstInvalid) firstInvalid = document.getElementById('form-pj');
  } else if (pj.length < 3) {
    showFieldError('pj', 'Nama PJ minimal 3 karakter.');
    isValid = false;
    if (!firstInvalid) firstInvalid = document.getElementById('form-pj');
  }

  if (firstInvalid) {
    firstInvalid.focus();
  }

  return isValid;
}

// ================= 5. FORM SUBMISSION ================= //

async function handleFormSubmit(e) {
  e.preventDefault();

  if (typeof requirePermission === 'function') {
    const required = currentMode === 'add' ? 'assets:create' : 'assets:edit';
    const actionLabel = currentMode === 'add' ? 'Menambah Aset Baru' : 'Memperbarui Data Aset';
    if (!requirePermission(required, actionLabel)) return;
  }

  if (!validateForm()) {
    showToast('Terdapat kesalahan input formulir. Mohon periksa kolom bertanda merah.', 'error');
    return;
  }

  const kode = document.getElementById('form-kode').value.trim();
  const serial = document.getElementById('form-serial').value.trim();
  const nama = document.getElementById('form-nama').value.trim();
  const kategori = document.getElementById('form-kategori').value;
  const spesifikasi = document.getElementById('form-spesifikasi').value.trim();
  const gedung = document.getElementById('form-gedung').value;
  const ruang = document.getElementById('form-ruang').value.trim();
  const kondisi = document.getElementById('form-kondisi').value;
  const status = document.getElementById('form-status').value;
  const pj = document.getElementById('form-pj').value.trim();

  let fotoDefault = '../assets/laptop.jpg';
  if (kategori === 'Alat Lab') fotoDefault = '../assets/mikroskop.jpg';
  else if (kategori === 'Utilitas') fotoDefault = '../assets/ac.jpg';
  else if (kategori === 'Mebel') fotoDefault = '../assets/meja-rapat.jpg';
  else if (kategori === 'Elektronik') fotoDefault = '../assets/proyektor.jpg';

  const assets = getStoredAssets();

  if (currentMode === 'add') {
    // TAMBAH DATA (CREATE)
    const newAsset = {
      kode,
      serial,
      nama,
      spesifikasi,
      foto: fotoDefault,
      kategori,
      gedung,
      ruang,
      kondisi,
      status,
      pj,
      nilai: kategori === 'Elektronik' ? 24000000 : kategori === 'Mebel' ? 65000000 : 15000000
    };
    assets.unshift(newAsset);
    saveStoredAssets(assets);

    if (typeof API !== 'undefined') {
      try {
        await API.createAsset({
          nama,
          kode,
          serial,
          desc: spesifikasi,
          kategori_nama: kategori,
          gedung,
          lokasi: ruang,
          kondisi,
          status,
          pic: pj,
          foto: fotoDefault,
          nilai: newAsset.nilai
        });
      } catch (err) {
        console.warn('Backend create error:', err);
      }
    }

    showToast(`Data aset ${kode} (${nama}) berhasil disimpan ke database!`, 'success');

    // Beri opsi navigasi balik ke tabel
    setTimeout(() => {
      const confirmed = confirm(`Aset ${kode} berhasil ditambahkan ke database!\n\nIngin melihat daftar data di Halaman Tabel Master Aset?`);
      if (confirmed) {
        window.location.href = 'aset.html';
      } else {
        switchFormMode('add');
      }
    }, 300);

  } else {
    // EDIT DATA (UPDATE)
    const targetKode = selectedEditKode || kode;
    const index = assets.findIndex(a => a.kode === targetKode);
    if (index !== -1) {
      assets[index] = {
        ...assets[index],
        serial,
        nama,
        spesifikasi,
        kategori,
        gedung,
        ruang,
        kondisi,
        status,
        pj,
      };
      saveStoredAssets(assets);
      showToast(`Data aset ${targetKode} berhasil diperbarui!`, 'success');

      if (typeof API !== 'undefined' && assets[index].id) {
        try {
          await API.updateAsset(assets[index].id, {
            nama,
            serial,
            desc: spesifikasi,
            kategori_nama: kategori,
            gedung,
            lokasi: ruang,
            kondisi,
            status,
            pic: pj
          });
        } catch (err) {
          console.warn('Backend update error:', err);
        }
      }

      setTimeout(() => {
        const confirmed = confirm(`Pembaruan aset ${targetKode} berhasil!\n\nIngin melihat perubahan di Halaman Tabel Master Aset?`);
        if (confirmed) {
          window.location.href = 'aset.html';
        }
      }, 300);
    }
  }
}

// ================= 6. TOAST NOTIFICATION ================= //

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const typeStyles = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    info: 'bg-slate-900 text-white',
  };

  const icons = {
    success: '<i data-lucide="check-circle" class="w-4 h-4 shrink-0"></i>',
    error: '<i data-lucide="alert-circle" class="w-4 h-4 shrink-0"></i>',
    info: '<i data-lucide="info" class="w-4 h-4 shrink-0"></i>',
  };

  toast.className = `${typeStyles[type] || typeStyles.info} px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 pointer-events-auto transform translate-y-2 opacity-0`;
  toast.innerHTML = `
    ${icons[type] || icons.info}
    <span>${message}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ================= 7. PARSE URL PARAMETERS & INIT ================= //

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();

  const urlParams = new URLSearchParams(window.location.search);
  const modeParam = urlParams.get('mode');
  const kodeParam = urlParams.get('kode');

  if (modeParam === 'edit' || kodeParam) {
    selectedEditKode = kodeParam;
    switchFormMode('edit');
    if (kodeParam) {
      loadAssetForEdit(kodeParam);
    }
  } else {
    switchFormMode('add');
  }

  if (window.lucide) {
    lucide.createIcons();
  }
});
