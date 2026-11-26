<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Halaman Laporan & Audit Eksekutif
     */
    public function index()
    {
        return view('reports.index');
    }

    /**
     * Ambil seluruh riwayat audit aktivitas sistem (/api/activity-logs)
     */
    public function activityLogs()
    {
        return response()->json([
            'success' => true,
            'data'    => ActivityLog::orderByDesc('id')->limit(50)->get(),
        ]);
    }

    /**
     * Catat log aktivitas baru ke database
     */
    public function storeActivityLog(Request $request)
    {
        $log = ActivityLog::create([
            'timestamp' => $request->input('timestamp', now()->format('d M Y, H:i')),
            'actor'     => $request->input('actor', 'Admin Sarpras'),
            'role'      => $request->input('role', 'admin'),
            'action'    => $request->input('action', 'Aktivitas Sistem'),
            'module'    => $request->input('module', 'Sistem'),
            'target'    => $request->input('target', '-'),
            'status'    => $request->input('status', 'Berhasil'),
        ]);

        return response()->json([
            'success' => true,
            'data'    => $log,
        ], 201);
    }
}
