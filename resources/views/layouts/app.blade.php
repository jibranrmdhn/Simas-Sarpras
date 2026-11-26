<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="csrf-token" content="{{ csrf_token() }}" />
  <title>@yield('title', 'SIMAS - Sistem Informasi Sarana & Prasarana Kampus')</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="stylesheet" href="{{ asset('css/style.css') }}" />
</head>
<body class="bg-[#f4f7fb] text-slate-800 antialiased">
  <div class="min-h-screen flex">
    {{-- Sidebar Navigasi 6 Menu Inti --}}
    <aside id="main-sidebar" class="w-60 bg-[#eef3fb] border-r border-slate-200/80 flex flex-col justify-between shrink-0">
      <div class="p-4">
        <div class="flex items-center gap-2.5 mb-5">
          <div class="w-9 h-9 rounded-xl bg-[#0f2a71] text-white flex items-center justify-center font-bold">S</div>
          <div>
            <div class="font-extrabold text-sm text-slate-900">SIMAS</div>
            <div class="text-[11px] text-slate-500">Sistem Sarana & Prasarana</div>
          </div>
        </div>
        <nav id="sidebar-nav" class="space-y-1"></nav>
      </div>
    </aside>

    {{-- Konten Utama Halaman --}}
    <div class="flex-1 flex flex-col min-w-0">
      <main class="flex-1 p-5 space-y-5">
        @yield('content')
      </main>
    </div>
  </div>

  {{-- Script RBAC, Navigasi & Fetch API --}}
  <script src="{{ asset('js/auth.js') }}"></script>
  <script src="{{ asset('js/rbac.js') }}"></script>
  <script src="{{ asset('js/navigation.js') }}"></script>
  <script src="{{ asset('js/api.js') }}"></script>
  @stack('scripts')
</body>
</html>
