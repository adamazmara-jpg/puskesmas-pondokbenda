<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QueueTicket extends Model
{
    use HasFactory;

    protected $table = 'queue_tickets';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'ticket_number',
        'queue_sequence',
        'patient_name',
        'patient_nik',
        'patient_bpjs',
        'patient_phone',
        'poli_id',
        'poli_name',
        'doctor_id',
        'doctor_name',
        'status',
        'patient_type',
        'registration_type',
        'estimated_time',
        'called_at',
        'completed_at',
    ];

    public function poliService()
    {
        return $this->belongsTo(PoliService::class, 'poli_id', 'id');
    }
}
