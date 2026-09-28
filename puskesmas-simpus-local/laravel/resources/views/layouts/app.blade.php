<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Sistem Antrean Puskesmas Online & Evaluasi ML')</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              emerald: {
                50: '#ecfdf5',
                100: '#d1fae5',
                600: '#059669',
                700: '#047857',
                800: '#065f46',
                900: '#064e3b',
              }
            }
          }
        }
      }
    </script>
</head>
<body class="bg-slate-50 text-slate-800 antialiased font-sans min-h-screen">
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-emerald-700 text-white font-black rounded-lg flex items-center justify-center text-sm shadow-xs">
                    PKM
                </div>
                <div>
                    <span class="font-extrabold text-slate-900 text-sm block">PUSKESMAS KECAMATAN</span>
                    <span class="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">Sistem Antrean & Evaluasi ML</span>
                </div>
            </div>
            <div class="flex items-center gap-4 text-xs font-bold">
                <a href="{{ route('antrean.index') }}" class="text-slate-700 hover:text-emerald-700 transition">Pendaftaran Antrean</a>
                <a href="{{ route('confusion.index') }}" class="px-3 py-1.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition">Confusion Matrix ML</a>
            </div>
        </div>
    </nav>

    <main class="py-6">
        @yield('content')
    </main>
</body>
</html>
