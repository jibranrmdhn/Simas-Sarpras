<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    /**
     * Ambil seluruh daftar tiket pemeliharaan Kanban (/api/tickets)
     * Diakses oleh: Admin, Petugas Sarpras (Teknisi), dan Pimpinan (Read-Only)
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data'    => Ticket::orderByDesc('id')->get(),
        ]);
    }

    /**
     * Buat Tiket Laporan Kerusakan Baru (Petugas Sarpras & Admin)
     */
    public function store(Request $request)
    {
        $ticket = Ticket::create([
            'ticket_code' => $request->input('ticket_code', 'TK-' . date('Y') . '-' . rand(1000, 9999)),
            'title'       => $request->input('title') ?? $request->input('judul'),
            'location'    => $request->input('location') ?? $request->input('lokasi', 'Gedung Rektorat'),
            'gedung'      => $request->input('gedung', 'Rektorat'),
            'priority'    => $request->input('priority', 'TINGGI'),
            'category'    => $request->input('category', 'Kelistrikan & Utilitas'),
            'status'      => 'baru',
            'reporter'    => $request->input('reporter', 'Petugas Sarpras'),
            'technician'  => $request->input('technician', 'Tim Teknisi'),
            'desc'        => $request->input('desc', ''),
            'cost'        => (int) $request->input('cost', 0),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tiket pemeliharaan berhasil dibuat.',
            'data'    => $ticket,
        ], 201);
    }

    /**
     * Perbarui Status Tahapan Kanban & Biaya Servis (Tugas Utama Petugas Sarpras / Teknisi)
     * Tahapan: baru -> ditugaskan -> proses -> selesai
     */
    public function update(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $ticket->update($request->only(['status', 'technician', 'desc', 'cost', 'priority']));

        return response()->json([
            'success' => true,
            'message' => 'Status pengerjaan & biaya tiket berhasil diperbarui.',
            'data'    => $ticket,
        ]);
    }

    /**
     * Hapus Tiket Pemeliharaan
     */
    public function destroy($id)
    {
        Ticket::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tiket berhasil dihapus.',
        ]);
    }
}
