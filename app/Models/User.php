<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'username',
        'password',
        'nama',
        'nip',
        'email',
        'unit',
        'account_type',     // 'mahasiswa' | 'dosen'
        'role',             // 'admin' | 'petugas' | 'pimpinan' | 'peminjam'
        'status',           // 'pending' | 'active' | 'rejected'
        'rejection_reason',
        'approved_by',
        'approved_at',
        'roleLabel',
        'avatar',
        'deskripsi',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Cek apakah pengguna memiliki salah satu role yang diizinkan
     */
    public function hasRole(string|array $roles): bool
    {
        $allowed = is_array($roles) ? $roles : [$roles];
        return in_array($this->role, $allowed, true);
    }

    /**
     * Relasi: Satu peminjam dapat memiliki banyak permohonan peminjaman
     */
    public function loans()
    {
        return $this->hasMany(Loan::class, 'requester_name', 'nama');
    }
}
