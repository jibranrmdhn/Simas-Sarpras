<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Asset;
use App\Models\Location;
use App\Models\Loan;
use App\Models\Ticket;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed data awal SIMAS untuk 4 Role RBAC & Master Inventaris Kampus
     */
    public function run(): void
    {
        // 1. Seed 4 Akun Demo Resmi sesuai Role RBAC
        $users = [
            [
                'username'  => 'admin',
                'password'  => 'admin123',
                'nama'      => 'Bambang Irawan, S.Kom',
                'nip'       => '198403152008121002',
                'email'     => 'bambang.admin@institusi.ac.id',
                'unit'      => 'Bagian Umum & Perlengkapan Sarpras',
                'role'      => 'admin',
                'roleLabel' => 'Admin Sarpras',
                'deskripsi' => 'Akses penuh ke seluruh sistem, master aset, dan laporan.',
            ],
            [
                'username'  => 'petugas',
                'password'  => 'petugas123',
                'nama'      => 'Joko Supriyanto, A.Md',
                'nip'       => '198807212012011004',
                'email'     => 'joko.sarpras@institusi.ac.id',
                'unit'      => 'Divisi Operasional & Teknisi Sarpras',
                'role'      => 'petugas',
                'roleLabel' => 'Petugas Sarpras',
                'deskripsi' => 'Mengelola inventaris fisik, pengembalian pinjaman, dan mengerjakan tiket perbaikan Kanban.',
            ],
            [
                'username'  => 'pimpinan',
                'password'  => 'pimpinan123',
                'nama'      => 'Dr. Ir. Hendro Wicaksono, M.T.',
                'nip'       => '197804152003121002',
                'email'     => 'hendro.pimpinan@institusi.ac.id',
                'unit'      => 'Wakil Rektor Bidang Sumber Daya & Sarana',
                'role'      => 'pimpinan',
                'roleLabel' => 'Pimpinan Institusi',
                'deskripsi' => 'Memantau dashboard eksekutif, menyetujui/menolak peminjaman, dan mengesahkan laporan.',
            ],
            [
                'username'  => 'peminjam',
                'password'  => 'peminjam123',
                'nama'      => 'Budi Santoso, M.Kom',
                'nip'       => '199205102019031015',
                'email'     => 'budi.santoso@institusi.ac.id',
                'unit'      => 'Fakultas Teknik / Dosen Informatika',
                'role'      => 'peminjam',
                'roleLabel' => 'Peminjam (Dosen/Tendik)',
                'deskripsi' => 'Melihat katalog sarana & ruangan kosong serta mengajukan peminjaman mandiri.',
            ],
        ];

        foreach ($users as $u) {
            User::updateOrCreate(['username' => $u['username']], $u);
        }

        // 2. Seed Sampel Aset Utama
        Asset::updateOrCreate(
            ['kode' => 'SAR/2025/0001'],
            [
                'nup'           => 'SAR/2025/0001',
                'serial'        => 'SN-MBP-884120',
                'nama'          => 'MacBook Pro 16" M3 Max',
                'desc'          => 'RAM 36GB, SSD 1TB, Liquid Retina XDR',
                'kategori_nama' => 'Elektronik',
                'gedung'        => 'Gedung Rektorat (Pusat)',
                'lokasi'        => 'R. Multimedia Lt. 2',
                'kondisi'       => 'Baik',
                'status'        => 'Tersedia',
                'pic'           => 'Bambang Irawan, S.Kom',
                'nilai'         => 48500000,
            ]
        );
    }
}
