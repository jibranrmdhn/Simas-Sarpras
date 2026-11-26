@extends('layouts.app')

@section('title', 'SIMAS - Inventaris Aset Kampus')

@section('content')
  <div id="assets-root">
    {{-- Tabel & Grid Inventaris Aset + Modal Tambah/Edit/Hapus/QR --}}
  </div>
@endsection

@push('scripts')
  <script src="{{ asset('js/aset.js') }}"></script>
@endpush
