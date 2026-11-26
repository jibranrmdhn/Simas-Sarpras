<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $table = 'locations';

    protected $fillable = [
        'code',
        'title',
        'gedung',
        'floor',
        'capacity',
        'area',
        'status', // 'Tersedia' | 'Digunakan' | 'Dalam Perawatan'
        'pic',
        'facilities',
    ];

    /**
     * Scope ruangan yang siap dibooking hari ini
     */
    public function scopeReadyToBook($query)
    {
        return $query->where('status', 'Tersedia');
    }
}
