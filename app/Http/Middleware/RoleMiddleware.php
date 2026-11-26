<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Batasi akses halaman atau endpoint berdasarkan Role RBAC:
     * - admin    : Akses penuh ke seluruh modul & hapus aset
     * - petugas  : Operasional inventaris, pengembalian & teknisi pemeliharaan
     * - pimpinan : Monitoring eksekutif & otorisasi persetujuan (Approve/Reject)
     * - peminjam : Layanan mandiri peminjaman sarana & cek ruangan
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, $roles, true)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Akses Ditolak (403): Role Anda tidak memiliki izin untuk aksi ini.',
                ], 403);
            }

            abort(403, 'Akses Ditolak: Anda tidak memiliki hak akses ke modul ini.');
        }

        return $next($request);
    }
}
