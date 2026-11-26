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
| API Routes (SIMAS RESTful API - Laravel 11)
|--------------------------------------------------------------------------
| Seluruh endpoint ini otomatis memiliki prefix /api/...
*/

// Autentikasi, Pendaftaran Mandiri & ACC Akun (Hanya Admin)
Route::post('/auth/login', [AuthController::class, 'apiLogin']);
Route::post('/auth/register', [AuthController::class, 'apiRegister']);
Route::get('/users', [AuthController::class, 'users']);
Route::get('/users/pending', [AuthController::class, 'pendingUsers']);
Route::put('/users/{id}/approve', [AuthController::class, 'approveUser']);
Route::put('/users/{id}/reject', [AuthController::class, 'rejectUser']);

// 1. Ringkasan KPI Dashboard & Log Aktivitas
Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
Route::get('/activity-logs', [ReportController::class, 'activityLogs']);
Route::post('/activity-logs', [ReportController::class, 'storeActivityLog']);

// 2. Modul Inventaris Aset & Kategori
Route::apiResource('assets', AssetController::class);
Route::apiResource('categories', AssetController::class)->only(['index', 'store', 'update', 'destroy']);

// 3. Modul Gedung & Ruangan
Route::get('/buildings', [LocationController::class, 'buildings']);
Route::post('/buildings', [LocationController::class, 'storeBuilding']);
Route::apiResource('locations', LocationController::class);

// 4. Modul Peminjaman, Otorisasi Pimpinan & Pengembalian Petugas
Route::apiResource('loans', LoanController::class)->only(['index', 'store', 'destroy']);
Route::put('/loans/{id}/approve', [LoanController::class, 'approve']);
Route::put('/loans/{id}/reject', [LoanController::class, 'reject']);
Route::put('/loans/{id}/return', [LoanController::class, 'markReturned']);

// 5. Modul Pemeliharaan & Tiket Perbaikan (Kanban)
Route::apiResource('tickets', TicketController::class);
