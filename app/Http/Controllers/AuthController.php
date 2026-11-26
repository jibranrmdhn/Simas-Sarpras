<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Tampilkan halaman Login SIMAS
     */
    public function showLogin()
    {
        return view('auth.login');
    }

    /**
     * Endpoint Login REST API & Session (/api/auth/login)
     */
    public function apiLogin(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $credentials['username'])
            ->orWhere('nip', $credentials['username'])
            ->orWhere('email', $credentials['username'])
            ->first();

        if (! $user || $user->password !== $credentials['password']) {
            return response()->json([
                'success' => false,
                'message' => 'Username/NIP atau kata sandi tidak cocok.',
            ], 401);
        }

        if ($user->status === 'pending') {
            return response()->json([
                'success' => false,
                'code'    => 'ACCOUNT_PENDING',
                'message' => 'Akun Anda sedang menunggu persetujuan (ACC) dari Admin Sarpras.',
            ], 403);
        }

        if ($user->status === 'rejected') {
            return response()->json([
                'success' => false,
                'code'    => 'ACCOUNT_REJECTED',
                'message' => 'Pendaftaran akun Anda ditolak oleh Admin Sarpras.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'user'    => $user,
        ]);
    }

    /**
     * Pendaftaran akun baru (status otomatis pending hingga di-ACC Admin)
     */
    public function apiRegister(Request $request)
    {
        if ($request->filled('role') && strtolower((string) $request->input('role')) !== 'peminjam') {
            return response()->json([
                'success' => false,
                'message' => 'Pendaftaran mandiri hanya tersedia untuk akun Peminjam (Mahasiswa / Dosen).',
            ], 400);
        }

        $validated = $request->validate([
            'nama'         => 'required|string|max:255',
            'username'     => 'required|string|max:100|unique:users,username',
            'email'        => 'required|email|unique:users,email',
            'password'     => 'required|string|min:6',
            'nip'          => 'required|string|max:50',
            'unit'         => 'nullable|string|max:150',
            'account_type' => 'required|in:mahasiswa,dosen',
        ]);

        $user = User::create([
            'nama'         => $validated['nama'],
            'username'     => $validated['username'],
            'email'        => $validated['email'],
            'password'     => $validated['password'],
            'nip'          => $validated['nip'],
            'unit'         => $validated['unit'] ?? '',
            'account_type' => $validated['account_type'],
            'role'         => 'peminjam',
            'status'       => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran akun Peminjam berhasil dikirim! Menunggu persetujuan (ACC) Admin Sarpras.',
            'data'    => $user,
        ], 201);
    }

    /**
     * Ambil daftar seluruh akun pengguna (RBAC)
     */
    public function users()
    {
        return response()->json([
            'success' => true,
            'data'    => User::orderByRaw("CASE WHEN status = 'pending' THEN 0 WHEN status = 'active' THEN 1 ELSE 2 END")->latest()->get(),
        ]);
    }

    /**
     * Ambil daftar akun yang menunggu ACC Admin
     */
    public function pendingUsers()
    {
        $pending = User::where('status', 'pending')->latest()->get();
        return response()->json([
            'success' => true,
            'count'   => $pending->count(),
            'data'    => $pending,
        ]);
    }

    /**
     * ACC (Setujui & Aktifkan) Pendaftaran Akun — HANYA ADMIN
     */
    public function approveUser(Request $request, int $id)
    {
        if (strtolower((string) $request->header('X-User-Role')) !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak: Hanya Admin Sarpras yang berwenang melakukan ACC pendaftaran akun.',
            ], 403);
        }

        $user = User::findOrFail($id);
        $user->update([
            'status'           => 'active',
            'role'             => $request->input('role', $user->role),
            'rejection_reason' => '',
            'approved_by'      => $request->input('approved_by', 'Admin Sarpras'),
            'approved_at'      => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Akun {$user->nama} berhasil di-ACC dan sekarang aktif!",
            'data'    => $user,
        ]);
    }

    /**
     * Tolak Pendaftaran Akun — HANYA ADMIN
     */
    public function rejectUser(Request $request, int $id)
    {
        if (strtolower((string) $request->header('X-User-Role')) !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak: Hanya Admin Sarpras yang berwenang menolak pendaftaran akun.',
            ], 403);
        }

        $user = User::findOrFail($id);
        $user->update([
            'status'           => 'rejected',
            'rejection_reason' => $request->input('reason', 'Data identitas belum terverifikasi.'),
            'approved_by'      => $request->input('approved_by', 'Admin Sarpras'),
            'approved_at'      => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Pendaftaran akun {$user->nama} telah ditolak.",
            'data'    => $user,
        ]);
    }

    /**
     * Logout pengguna dari sesi
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
