<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PoliService;
use App\Models\QueueTicket;
use Illuminate\Support\Str;

class QueueController extends Controller
{
    /**
     * Halaman Utama Pendaftaran Antrean Online Pasien
     */
    public function index()
    {
        $polis = PoliService::where('is_active', true)->get();
        return view('antrean.index', compact('polis'));
    }

    /**
     * Simpan Pendaftaran Antrean Pasien Baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_name' => 'required|string|max:255',
            'patient_nik'  => 'required|string|max:16',
            'patient_phone'=> 'required|string|max:20',
            'poli_id'      => 'required|exists:poli_services,id',
            'patient_type' => 'required|in:BPJS,Umum',
        ]);

        $poli = PoliService::findOrFail($validated['poli_id']);
        
        // Ambil nomor antrean terakhir hari ini
        $lastTicket = QueueTicket::where('poli_id', $poli->id)
            ->whereDate('created_at', now()->toDateString())
            ->orderBy('queue_sequence', 'desc')
            ->first();

        $sequence = $lastTicket ? $lastTicket->queue_sequence + 1 : 1;
        $ticketNumber = $poli->code . '-' . str_pad($sequence, 3, '0', STR_PAD_LEFT);

        $ticket = QueueTicket::create([
            'id'                => 'TICKET-' . Str::upper(Str::random(8)),
            'ticket_number'     => $ticketNumber,
            'queue_sequence'    => $sequence,
            'patient_name'      => $validated['patient_name'],
            'patient_nik'       => $validated['patient_nik'],
            'patient_bpjs'      => $request->patient_bpjs ?? null,
            'patient_phone'     => $validated['patient_phone'],
            'poli_id'           => $poli->id,
            'poli_name'         => $poli->name,
            'status'            => 'waiting',
            'patient_type'      => $validated['patient_type'],
            'registration_type' => 'online',
            'estimated_time'    => now()->addMinutes($sequence * 10)->format('H:i'),
        ]);

        return redirect()->back()->with('ticket', $ticket)->with('success', 'Pendaftaran antrean berhasil!');
    }
}
