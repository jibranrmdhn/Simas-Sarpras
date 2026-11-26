<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Asset;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class LoanController extends Controller
{
    /**
     * Ambil seluruh data peminjaman sarana & reservasi ruangan (/api/loans)
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data'    => Loan::orderByDesc('id')->get(),
        ]);
    }

    /**
     * Ajukan Permohonan Peminjaman Baru (Peminjam / Dosen / Mahasiswa)
     */
    public function store(Request $request)
    {
        $loan = Loan::create([
            'loan_code'      => $request->input('loan_code', 'LOAN-' . date('Y') . '-' . rand(1000, 9999)),
            'requester_name' => $request->input('requester_name') ?? $request->input('peminjam', 'Budi Santoso, M.Kom'),
            'requester_dept' => $request->input('requester_dept') ?? $request->input('unit', 'Fakultas Teknik'),
            'asset_name'     => $request->input('asset_name') ?? $request->input('aset'),
            'asset_code'     => $request->input('asset_code') ?? $request->input('kode_aset', 'SAR/2025/0001'),
            'category'       => $request->input('category', 'perangkat'),
            'schedule'       => $request->input('schedule') ?? $request->input('jadwal', date('d M Y')),
            'purpose'        => $request->input('purpose') ?? $request->input('keperluan', 'Kegiatan Akademik'),
            'attendees'      => $request->input('attendees', '-'),
            'status'         => 'Menunggu Approval',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Permohonan peminjaman berhasil diajukan dan menunggu persetujuan Pimpinan/Admin.',
            'data'    => $loan,
        ], 201);
    }

    /**
     * Otorisasi Setujui Peminjaman (Khusus Role: Pimpinan Institusi & Admin Sarpras)
     */
    public function approve($id)
    {
        $loan = Loan::findOrFail($id);
        $loan->update(['status' => 'Disetujui']);

        // Otomatis ubah status aset menjadi Sedang Dipinjam
        if ($loan->asset_code) {
            Asset::where('kode', $loan->asset_code)->update(['status' => 'Dipinjam']);
        }

        ActivityLog::create([
            'timestamp' => now()->format('d M Y, H:i'),
            'actor'     => 'Pimpinan / Admin',
            'role'      => 'Pimpinan Institusi',
            'action'    => 'Menyetujui Peminjaman',
            'module'    => 'Peminjaman Sarana',
            'target'    => "{$loan->loan_code} ({$loan->asset_name})",
            'status'    => 'Disetujui',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Permohonan peminjaman telah disetujui.',
            'data'    => $loan,
        ]);
    }

    /**
     * Tolak Permohonan Peminjaman (Khusus Role: Pimpinan Institusi & Admin Sarpras)
     */
    public function reject(Request $request, $id)
    {
        $loan = Loan::findOrFail($id);
        $loan->update(['status' => 'Ditolak']);

        return response()->json([
            'success' => true,
            'message' => 'Permohonan peminjaman ditolak.',
            'data'    => $loan,
        ]);
    }

    /**
     * Verifikasi Pengembalian Fisik Barang (Tugas Utama Petugas Sarpras & Admin)
     */
    public function markReturned($id)
    {
        $loan = Loan::findOrFail($id);
        $loan->update(['status' => 'Dikembalikan']);

        // Kembalikan status aset menjadi Tersedia di katalog
        if ($loan->asset_code) {
            Asset::where('kode', $loan->asset_code)->update(['status' => 'Tersedia']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Barang telah diverifikasi kembali dan status aset menjadi Tersedia.',
            'data'    => $loan,
        ]);
    }
}
