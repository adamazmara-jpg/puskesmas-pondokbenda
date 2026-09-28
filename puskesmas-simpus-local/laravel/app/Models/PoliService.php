<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PoliService extends Model
{
    use HasFactory;

    protected $table = 'poli_services';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'code',
        'description',
        'quota_per_day',
        'is_active',
        'current_queue_number',
        'icon_name',
    ];

    public function queueTickets()
    {
        return $this->hasMany(QueueTicket::class, 'poli_id', 'id');
    }

    public function doctorSchedules()
    {
        return $this->hasMany(DoctorSchedule::class, 'poli_id', 'id');
    }
}
