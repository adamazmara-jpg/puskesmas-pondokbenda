<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConfusionMatrixDataset extends Model
{
    use HasFactory;

    protected $table = 'confusion_matrix_datasets';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'tanggal',
        'hari',
        'poli',
        'dokter',
        'jam_daftar',
        'nomor_antrian',
        'pasien_terdaftar',
        'maksimal_pasien',
        'slot_tersedia_actual',
        'slot_tersedia_predicted',
    ];

    /**
     * Otomatis hitung prediksi label berdasarkan kuota & nomor antrean
     */
    public function getPredictedAttribute()
    {
        return ($this->pasien_terdaftar <= $this->maksimal_pasien && $this->nomor_antrian <= $this->maksimal_pasien)
            ? 'Tersedia'
            : 'Tidak Tersedia';
    }
}
