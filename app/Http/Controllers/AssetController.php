<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class AssetController extends Controller
{
    /**
     * Halaman Inventaris Aset (Katalog untuk Peminjam / Master CRUD untuk Admin & Petugas)
     */
    public function index()
    {
        $assets = Asset::orderByDesc('id')->get();

        return response()->json([
            'success' => true,
            'data'    => $assets,
        ]);
    }

    /**
     * Tambah Aset Baru (Khusus Admin & Petugas Sarpras)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode'          => 'required|string|unique:assets,kode',
            'nama'          => 'required|string|min:3',
            'serial'        => 'nullable|string',
            'desc'          => 'nullable|string',
            'kategori_nama' => 'required|string',
            'gedung'        => 'required|string',
            'lokasi'        => 'required|string',
            'kondisi'       => 'required|string',
            'status'        => 'required|string',
            'pic'           => 'required|string',
            'nilai'         => 'nullable|numeric',
            'foto'          => 'nullable|string',
        ]);

        $asset = Asset::create($validated);

        ActivityLog::create([
            'timestamp' => now()->format('d M Y, H:i'),
            'actor'     => 'Petugas / Admin Sarpras',
            'role'      => 'Admin / Petugas',
            'action'    => 'Registrasi Aset Baru',
            'module'    => 'Inventaris Aset',
            'target'    => "{$asset->kode} - {$asset->nama}",
            'status'    => 'Berhasil',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Aset baru berhasil disimpan ke database.',
            'data'    => $asset,
        ], 201);
    }

    /**
     * Perbarui Data / Kondisi Fisik Aset (Khusus Admin & Petugas Sarpras)
     */
    public function update(Request $request, $id)
    {
        $asset = Asset::findOrFail($id);
        $asset->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Data aset berhasil diperbarui.',
            'data'    => $asset,
        ]);
    }

    /**
     * Hapus Aset Permanen (HANYA Admin Sarpras — Petugas Dilarang Menghapus)
     */
    public function destroy($id)
    {
        $asset = Asset::findOrFail($id);
        $asset->delete();

        return response()->json([
            'success' => true,
            'message' => 'Aset berhasil dihapus dari inventaris.',
        ]);
    }
}
