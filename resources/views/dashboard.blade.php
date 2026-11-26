@extends('layouts.app')

@section('title', 'SIMAS - Dashboard Sarana & Prasarana')

@section('content')
  {{-- Halaman Dashboard Adaptif 4 Role (Admin, Petugas, Pimpinan, Peminjam) --}}
  <div id="dashboard-root">
    @includeIf('partials.dashboard-content')
  </div>
@endsection

@push('scripts')
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="{{ asset('js/app.js') }}"></script>
@endpush
