<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $table = 'loans';

    protected $fillable = [
        'loan_code',
        'requester_name',
        'requester_dept',
        'asset_name',
        'asset_code',
        'category', // 'perangkat' | 'ruangan'
        'schedule',
        'purpose',
        'attendees',
        'status',   // 'Menunggu Approval' | 'Disetujui' | 'Sedang Dipinjam' | 'Dikembalikan' | 'Ditolak'
    ];

    /**
     * Relasi ke data master aset
     */
    public function asset()
    {
        return $this->belongsTo(Asset::class, 'asset_code', 'kode');
    }
}
