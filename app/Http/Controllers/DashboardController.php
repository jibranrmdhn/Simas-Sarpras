<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Location;
use App\Models\Loan;
use App\Models\Ticket;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Tampilkan halaman Dashboard yang menyesuaikan tampilan berdasarkan Role
     * (Admin, Petugas Sarpras, Pimpinan Institusi, atau Peminjam)
     */
    public function index(Request $request)
    {
        return view('dashboard');
    }

    /**
     * Endpoint Ringkasan KPI Dashboard (/api/dashboard/stats)
     * Menggunakan Eloquent ORM sehingga sangat ringkas dan mudah dibaca
     */
    public function stats()
    {
        $totalAssets      = Asset::count();
        $totalNilai       = Asset::sum('nilai');
        $availableAssets  = Asset::where('status', 'Tersedia')->count();
        $goodCondition    = Asset::where('kondisi', 'Baik')->count();
        $borrowedAssets   = Asset::where('status', 'Dipinjam')->count();
        $maintenanceCount = Ticket::where('status', '!=', 'selesai')->count();
        $pendingLoans     = Loan::whereIn('status', ['Menunggu Approval', 'Diajukan'])->count();
        $availableRooms   = Location::where('status', 'Tersedia')->count();

        return response()->json([
            'success' => true,
            'data'    => [
                'total_assets'       => $totalAssets,
                'total_value'        => (int) $totalNilai,
                'available_assets'   => $availableAssets,
                'good_condition'     => $goodCondition,
                'borrowed_assets'    => $borrowedAssets,
                'maintenance_assets' => $maintenanceCount,
                'pending_approvals'  => $pendingLoans,
                'available_rooms'    => $availableRooms,
            ],
        ]);
    }
}
