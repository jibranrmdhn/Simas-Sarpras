<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $table = 'tickets';

    protected $fillable = [
        'ticket_code',
        'title',
        'location',
        'gedung',
        'priority', // 'URGENT' | 'TINGGI' | 'SEDANG' | 'RENDAH'
        'category',
        'status',   // 'baru' | 'ditugaskan' | 'proses' | 'selesai'
        'reporter',
        'technician',
        'desc',
        'cost',
    ];

    protected $casts = [
        'cost' => 'integer',
    ];
}
