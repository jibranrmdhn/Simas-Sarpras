<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * Ambil seluruh daftar ruangan & kapasitas gedung (/api/locations)
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data'    => Location::orderBy('code')->get(),
        ]);
    }

    /**
     * Tambah Ruangan Baru (Khusus Admin & Petugas Sarpras)
     */
    public function store(Request $request)
    {
        $location = Location::create([
            'code'       => $request->input('code') ?? $request->input('kode'),
            'title'      => $request->input('title') ?? $request->input('nama'),
            'gedung'     => $request->input('gedung', 'Gedung Rektorat'),
            'floor'      => $request->input('floor') ?? $request->input('lantai', 'Lantai 1'),
            'capacity'   => $request->input('capacity') ?? $request->input('kapasitas', '30 Orang'),
            'area'       => $request->input('area') ?? $request->input('luas', '48 m²'),
            'status'     => $request->input('status', 'Tersedia'),
            'pic'        => $request->input('pic', 'Petugas Sarpras'),
            'facilities' => $request->input('facilities', 'AC, Proyektor, Wi-Fi'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ruangan baru berhasil didaftarkan.',
            'data'    => $location,
        ], 201);
    }

    /**
     * Ubah Status Ketersediaan Ruangan (Tersedia / Digunakan / Dalam Perawatan)
     */
    public function update(Request $request, $id)
    {
        $location = Location::findOrFail($id);
        $location->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Status ruangan berhasil diperbarui.',
            'data'    => $location,
        ]);
    }

    /**
     * Hapus Ruangan
     */
    public function destroy($id)
    {
        Location::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data ruangan berhasil dihapus.',
        ]);
    }
}
