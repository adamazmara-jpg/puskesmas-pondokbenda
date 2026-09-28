<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ConfusionMatrixDataset;

class ConfusionMatrixController extends Controller
{
    /**
     * Tampilkan Halaman Evaluasi Confusion Matrix ML
     */
    public function index(Request $request)
    {
        $pageSize = $request->get('limit', 5); // Default 5 baris
        $query = ConfusionMatrixDataset::query();

        if ($request->has('poli') && $request->poli != 'all') {
            $query->where('poli', $request->poli);
        }

        if ($request->has('search') && !empty($request->search)) {
            $search = strtolower($request->search);
            $query->where(function($q) use ($search) {
                $q->where('poli', 'LIKE', "%{$search}%")
                  ->orWhere('dokter', 'LIKE', "%{$search}%")
                  ->orWhere('hari', 'LIKE', "%{$search}%");
            });
        }

        $allData = ConfusionMatrixDataset::all();
        $total = $allData->count();

        // Inisialisasi Metrik (Secara Standar = 0 jika Data Belum Dimasukkan)
        $metrics = [
            'tp' => 0,
            'fp' => 0,
            'tn' => 0,
            'fn' => 0,
            'total' => $total,
            'accuracy' => 0,
            'precision' => 0,
            'recall' => 0,
            'f1_score' => 0,
        ];

        if ($total > 0) {
            $tp = 0; $fp = 0; $tn = 0; $fn = 0;

            foreach ($allData as $item) {
                $actual = $item->slot_tersedia_actual;
                $predicted = $item->predicted;

                if ($actual === 'Tersedia' && $predicted === 'Tersedia') $tp++;
                elseif ($actual === 'Tidak Tersedia' && $predicted === 'Tersedia') $fp++;
                elseif ($actual === 'Tidak Tersedia' && $predicted === 'Tidak Tersedia') $tn++;
                elseif ($actual === 'Tersedia' && $predicted === 'Tidak Tersedia') $fn++;
            }

            $accuracy = ($total > 0) ? (($tp + $tn) / $total) * 100 : 0;
            $precision = ($tp + $fp > 0) ? ($tp / ($tp + $fp)) * 100 : 0;
            $recall = ($tp + $fn > 0) ? ($tp / ($tp + $fn)) * 100 : 0;
            $f1 = ($precision + $recall > 0) ? (2 * ($precision * $recall)) / ($precision + $recall) : 0;

            $metrics = [
                'tp' => $tp,
                'fp' => $fp,
                'tn' => $tn,
                'fn' => $fn,
                'total' => $total,
                'accuracy' => round($accuracy, 2),
                'precision' => round($precision, 2),
                'recall' => round($recall, 2),
                'f1_score' => round($f1, 2),
            ];
        }

        if ($pageSize === 'all') {
            $records = $query->get();
        } else {
            $records = $query->paginate((int)$pageSize);
        }

        $uniquePolis = ConfusionMatrixDataset::distinct()->pluck('poli');

        return view('confusion_matrix.index', compact('records', 'metrics', 'uniquePolis', 'pageSize'));
    }

    /**
     * Kosongkan Seluruh Data Dataset
     */
    public function destroyAll()
    {
        ConfusionMatrixDataset::truncate();
        return redirect()->back()->with('success', 'Seluruh data dataset berhasil dikosongkan. Indikator kembali 0%.');
    }
}
