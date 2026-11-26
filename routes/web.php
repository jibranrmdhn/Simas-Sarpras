<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\ReportController;

/*
|--------------------------------------------------------------------------
| Web Routes (SIMAS - 6 Menu Inti & Role-Based Access Control)
|--------------------------------------------------------------------------
*/

Route::get('/', fn () => redirect()->route('login'));
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'authenticate'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware(['auth'])->group(function () {
    // 1. Dashboard (Adaptif sesuai Role: Admin, Petugas, Pimpinan, Peminjam)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // 2. Inventaris Aset
    Route::get('/aset', [AssetController::class, 'index'])->name('assets.index');

    // 3. Gedung & Ruangan
    Route::get('/gedung', [LocationController::class, 'index'])->name('locations.index');

    // 4. Peminjaman Sarana & Ruangan
    Route::get('/peminjaman', [LoanController::class, 'index'])->name('loans.index');

    // 5. Pemeliharaan / Tiket Kanban (Dibatasi untuk Peminjam via RoleMiddleware)
    Route::get('/pemeliharaan', [TicketController::class, 'index'])
        ->middleware('role:admin,petugas,pimpinan')
        ->name('tickets.index');

    // 6. Laporan & Audit Eksekutif (Dibatasi untuk Peminjam via RoleMiddleware)
    Route::get('/laporan', [ReportController::class, 'index'])
        ->middleware('role:admin,petugas,pimpinan')
        ->name('reports.index');
});
