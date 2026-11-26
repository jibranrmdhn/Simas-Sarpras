@extends('layouts.app')

@section('title', 'SIMAS - Pemeliharaan & Tiket Perbaikan (Kanban)')

@section('content')
  <div id="tickets-root">
    {{-- Papan Kanban 4 Tahap Pemeliharaan & Drawer Penyelesaian Servis --}}
  </div>
@endsection

@push('scripts')
  <script src="{{ asset('js/tiket.js') }}"></script>
@endpush
