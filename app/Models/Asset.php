<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    protected $table = 'assets';

    protected $fillable = [
        'kode',
        'nup',
        'serial',
        'nama',
        'desc',
        'kategori_nama',
        'gedung',
        'lokasi',
        'kondisi', // 'Baik' | 'Perlu Perbaikan' | 'Rusak Ringan'
        'status',  // 'Tersedia' | 'Dipinjam' | 'Dalam Perawatan'
        'pic',
        'nilai',
        'foto',
    ];

    protected $casts = [
        'nilai' => 'integer',
    ];

    /**
     * Relasi: Satu aset dapat memiliki banyak riwayat peminjaman
     */
    public function loans()
    {
        return $this->hasMany(Loan::class, 'asset_code', 'kode');
    }

    /**
     * Scope filter untuk katalog sarana siap dipinjam (Khusus Role Peminjam)
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'Tersedia')->where('kondisi', 'Baik');
    }
}
