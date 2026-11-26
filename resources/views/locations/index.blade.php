@extends('layouts.app')

@section('title', 'SIMAS - Gedung & Ruangan Kampus')

@section('content')
  <div id="locations-root">
    {{-- Hirarki Gedung, Kartu Ketersediaan Ruangan & Daftar Aset Ruangan --}}
  </div>
@endsection

@push('scripts')
  <script src="{{ asset('js/gedung.js') }}"></script>
@endpush
