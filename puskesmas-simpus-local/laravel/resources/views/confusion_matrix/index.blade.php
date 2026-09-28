@extends('layouts.app')

@section('title', 'Evaluasi Confusion Matrix - Model Prediksi Slot Tersedia')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

    <!-- Header Section -->
    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-slate-900">
                    Pengujian Confusion Matrix Modul Pendaftaran Online
                </h1>
                <p class="text-xs text-slate-600 mt-1">
                    Standardisasi Pengukuran Performa Klasifikasi (<strong>Accuracy</strong>, <strong>Precision</strong>, <strong>Recall</strong>, <strong>F1-Score</strong>) untuk pengujian akurasi label: <strong className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Slot Tersedia</strong>.
                </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
                <form action="{{ route('confusion.destroyAll') }}" method="POST" onsubmit="return confirm('Kosongkan seluruh data dataset?')">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="px-3.5 py-2 bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 hover:bg-rose-100 transition">
                        Kosongkan Data
                    </button>
                </form>
            </div>
        </div>
    </div>

    <!-- 4 Key Metric Cards (0% default when empty) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Accuracy -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <span class="text-xs font-bold uppercase text-slate-600">Accuracy (Akurasi)</span>
            <div class="text-3xl font-extrabold font-mono text-slate-900">
                {{ $metrics['accuracy'] }}%
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2">
                <div class="bg-emerald-600 h-2 rounded-full" style="width: {{ $metrics['accuracy'] }}%"></div>
            </div>
            <p class="text-[11px] text-slate-500">Rasio seluruh prediksi yang benar terhadap total sampel.</p>
        </div>

        <!-- Precision -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <span class="text-xs font-bold uppercase text-slate-600">Precision (Presisi)</span>
            <div class="text-3xl font-extrabold font-mono text-slate-900">
                {{ $metrics['precision'] }}%
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: {{ $metrics['precision'] }}%"></div>
            </div>
            <p class="text-[11px] text-slate-500">Tingkat ketepatan data yang diprediksi Tersedia.</p>
        </div>

        <!-- Recall -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <span class="text-xs font-bold uppercase text-slate-600">Recall (Sensitivitas)</span>
            <div class="text-3xl font-extrabold font-mono text-slate-900">
                {{ $metrics['recall'] }}%
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2">
                <div class="bg-amber-600 h-2 rounded-full" style="width: {{ $metrics['recall'] }}%"></div>
            </div>
            <p class="text-[11px] text-slate-500">Kemampuan menemukan kembali data aktual Tersedia.</p>
        </div>

        <!-- F1-Score -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <span class="text-xs font-bold uppercase text-slate-600">F1-Score</span>
            <div class="text-3xl font-extrabold font-mono text-slate-900">
                {{ $metrics['f1_score'] }}%
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2">
                <div class="bg-purple-600 h-2 rounded-full" style="width: {{ $metrics['f1_score'] }}%"></div>
            </div>
            <p class="text-[11px] text-slate-500">Rata-rata harmonis antara Precision dan Recall.</p>
        </div>
    </div>

    <!-- 2x2 Matrix & Detail Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- 2x2 Table -->
        <div class="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 class="text-base font-bold text-slate-900">Matriks 2x2 Confusion Matrix</h3>
            <div class="grid grid-cols-12 gap-2 text-center text-xs font-bold">
                <div class="col-span-3"></div>
                <div class="col-span-9 bg-slate-100 py-1 rounded border border-slate-200 text-slate-700">Prediksi Model AI</div>
            </div>
            <div class="grid grid-cols-12 gap-2 items-stretch text-xs">
                <div class="col-span-3 bg-emerald-50 border border-emerald-200 rounded p-2 flex items-center justify-center font-bold text-emerald-900">
                    TERSEDIA
                </div>
                <div class="col-span-4 bg-emerald-50 border-2 border-emerald-600 rounded p-3 text-center">
                    <span class="text-[10px] font-bold text-emerald-800 uppercase block">True Positive (TP)</span>
                    <span class="text-2xl font-black font-mono text-emerald-900">{{ $metrics['tp'] }}</span>
                </div>
                <div class="col-span-5 bg-rose-50 border border-rose-200 rounded p-3 text-center">
                    <span class="text-[10px] font-bold text-rose-800 uppercase block">False Negative (FN)</span>
                    <span class="text-2xl font-black font-mono text-rose-900">{{ $metrics['fn'] }}</span>
                </div>
            </div>
            <div class="grid grid-cols-12 gap-2 items-stretch text-xs">
                <div class="col-span-3 bg-amber-50 border border-amber-200 rounded p-2 flex items-center justify-center font-bold text-amber-900">
                    TIDAK TERSEDIA
                </div>
                <div class="col-span-4 bg-amber-50 border border-amber-200 rounded p-3 text-center">
                    <span class="text-[10px] font-bold text-amber-800 uppercase block">False Positive (FP)</span>
                    <span class="text-2xl font-black font-mono text-amber-900">{{ $metrics['fp'] }}</span>
                </div>
                <div class="col-span-5 bg-blue-50 border-2 border-blue-600 rounded p-3 text-center">
                    <span class="text-[10px] font-bold text-blue-800 uppercase block">True Negative (TN)</span>
                    <span class="text-2xl font-black font-mono text-blue-900">{{ $metrics['tn'] }}</span>
                </div>
            </div>
        </div>

        <div class="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 class="text-base font-bold text-slate-900">Ringkasan Klasifikasi Model</h3>
            <p class="text-xs text-slate-600 leading-relaxed">
                Evaluasi model Machine Learning Klasifikasi Slot Tersedia. Nilai awal default 0% apabila belum ada data yang diimpor ke sistem.
            </p>
            <div class="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900">
                <strong>Status Dataset:</strong> Total data tersimpan saat ini: <strong>{{ $metrics['total'] }} baris</strong>.
            </div>
        </div>
    </div>

    <!-- Scrollable Dataset Table (Default 5 Rows) -->
    <div class="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <h3 class="text-base font-bold text-slate-900">
                Daftar Data Dataset Excel & Hasil Evaluasi Prediksi Per-Baris
            </h3>

            <!-- Limit Selector -->
            <div class="flex items-center gap-2 text-xs font-semibold">
                <span class="text-slate-500">Tampilkan:</span>
                <a href="{{ route('confusion.index', ['limit' => 5]) }}" class="px-2.5 py-1 rounded {{ $pageSize == 5 ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700' }}">5</a>
                <a href="{{ route('confusion.index', ['limit' => 10]) }}" class="px-2.5 py-1 rounded {{ $pageSize == 10 ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700' }}">10</a>
                <a href="{{ route('confusion.index', ['limit' => 'all']) }}" class="px-2.5 py-1 rounded {{ $pageSize == 'all' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700' }}">Semua</a>
            </div>
        </div>

        <div class="overflow-x-auto max-h-[400px] overflow-y-auto border border-slate-200 rounded-lg">
            <table class="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold sticky top-0 bg-slate-100 z-10 border-b border-slate-200">
                    <tr>
                        <th class="p-2.5">No</th>
                        <th class="p-2.5">Tanggal</th>
                        <th class="p-2.5">Poli</th>
                        <th class="p-2.5">Dokter</th>
                        <th class="p-2.5 text-center">No. Antrian</th>
                        <th class="p-2.5 text-center">Kuota Maks</th>
                        <th class="p-2.5 text-center">Slot Actual</th>
                        <th class="p-2.5 text-center">Slot Prediksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 bg-white">
                    @forelse($records as $index => $row)
                        <tr class="hover:bg-slate-50">
                            <td class="p-2.5 font-mono text-slate-500">{{ $index + 1 }}</td>
                            <td class="p-2.5 font-semibold text-slate-800">{{ $row->tanggal }}</td>
                            <td class="p-2.5 font-semibold text-emerald-800">{{ $row->poli }}</td>
                            <td class="p-2.5 text-slate-700">{{ $row->dokter }}</td>
                            <td class="p-2.5 text-center font-mono font-bold">{{ $row->nomor_antrian }}</td>
                            <td class="p-2.5 text-center font-mono">{{ $row->maksimal_pasien }}</td>
                            <td class="p-2.5 text-center font-bold text-slate-800">{{ $row->slot_tersedia_actual }}</td>
                            <td class="p-2.5 text-center font-bold text-emerald-700">{{ $row->predicted }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="8" class="p-8 text-center text-slate-400">
                                Belum ada data. Silakan masukkan data dataset Excel.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

</div>
@endsection
