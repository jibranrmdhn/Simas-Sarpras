@extends('layouts.app')

@section('title', 'SIMAS - Peminjaman & Reservasi Sarana')

@section('content')
  <div id="loans-root">
    {{-- Daftar Peminjaman, Panel Otorisasi Setujui/Tolak & Pengembalian --}}
  </div>
@endsection

@push('scripts')
  <script src="{{ asset('js/peminjaman.js') }}"></script>
@endpush
