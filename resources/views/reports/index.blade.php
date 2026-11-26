@extends('layouts.app')

@section('title', 'SIMAS - Laporan & Audit Eksekutif')

@section('content')
  <div id="reports-root">
    {{-- Ringkasan Audit, Filter Periode, Ekspor CSV & Cetak Pengesahan PDF --}}
  </div>
@endsection

@push('scripts')
  <script src="{{ asset('js/laporan.js') }}"></script>
@endpush
