<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations (Skema Database SIMAS - Laravel 11)
     */
    public function up(): void
    {
        // 1. Tabel Pengguna & Role (RBAC)
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('password');
            $table->string('nama');
            $table->string('nip')->nullable();
            $table->string('email')->unique();
            $table->string('unit')->nullable();
            $table->string('account_type')->nullable(); // mahasiswa | dosen
            $table->enum('role', ['admin', 'petugas', 'pimpinan', 'peminjam'])->default('peminjam');
            $table->enum('status', ['pending', 'active', 'rejected'])->default('active');
            $table->string('rejection_reason')->nullable();
            $table->string('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->string('roleLabel')->nullable();
            $table->string('avatar')->nullable();
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });

        // 2. Tabel Master Inventaris Aset
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('kode')->unique();
            $table->string('nup')->nullable();
            $table->string('serial')->nullable();
            $table->string('nama');
            $table->text('desc')->nullable();
            $table->string('kategori_nama')->default('Elektronik');
            $table->string('gedung')->default('Gedung Rektorat (Pusat)');
            $table->string('lokasi')->default('Ruang Rapat');
            $table->string('kondisi')->default('Baik');
            $table->string('status')->default('Tersedia');
            $table->string('pic')->default('Petugas Sarpras');
            $table->bigInteger('nilai')->default(15000000);
            $table->string('foto')->nullable();
            $table->timestamps();
        });

        // 3. Tabel Gedung & Ruangan
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('title');
            $table->string('gedung');
            $table->string('floor')->default('Lantai 1');
            $table->string('capacity')->default('30 Orang');
            $table->string('area')->default('48 m²');
            $table->string('status')->default('Tersedia');
            $table->string('pic')->nullable();
            $table->text('facilities')->nullable();
            $table->timestamps();
        });

        // 4. Tabel Peminjaman Sarana & Reservasi Ruangan
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->string('loan_code')->unique();
            $table->string('requester_name');
            $table->string('requester_dept')->nullable();
            $table->string('asset_name');
            $table->string('asset_code')->nullable();
            $table->string('category')->default('perangkat');
            $table->string('schedule');
            $table->text('purpose')->nullable();
            $table->string('attendees')->nullable();
            $table->string('status')->default('Menunggu Approval');
            $table->timestamps();
        });

        // 5. Tabel Tiket Pemeliharaan & Perbaikan (Kanban)
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_code')->unique();
            $table->string('title');
            $table->string('location');
            $table->string('gedung')->nullable();
            $table->string('priority')->default('SEDANG');
            $table->string('category')->nullable();
            $table->string('status')->default('baru'); // baru | ditugaskan | proses | selesai
            $table->string('reporter')->nullable();
            $table->string('technician')->nullable();
            $table->text('desc')->nullable();
            $table->bigInteger('cost')->default(0);
            $table->timestamps();
        });

        // 6. Tabel Log Audit Aktivitas
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->string('timestamp');
            $table->string('actor');
            $table->string('role')->nullable();
            $table->string('action');
            $table->string('module')->nullable();
            $table->string('target')->nullable();
            $table->string('status')->default('Berhasil');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('tickets');
        Schema::dropIfExists('loans');
        Schema::dropIfExists('locations');
        Schema::dropIfExists('assets');
        Schema::dropIfExists('users');
    }
};
