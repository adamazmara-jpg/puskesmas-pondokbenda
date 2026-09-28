<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PoliService;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users (Super Admin, Admin, Petugas Loket)
        $this->call([
            UserSeeder::class,
        ]);

        // 2. Seed Master Data Poliklinik
        $polis = [
            [
                'id' => 'poli-umum',
                'name' => 'Poli Umum',
                'code' => 'A',
                'description' => 'Layanan pemeriksaan kesehatan umum dan konsultasi medis dasar.',
                'quota_per_day' => 50,
                'is_active' => true,
                'icon_name' => 'Stethoscope',
            ],
            [
                'id' => 'poli-gigi',
                'name' => 'Poli Gigi & Mulut',
                'code' => 'B',
                'description' => 'Pemeriksaan, pembersihan, dan perawatan kesehatan gigi.',
                'quota_per_day' => 30,
                'is_active' => true,
                'icon_name' => 'Smile',
            ],
            [
                'id' => 'poli-kia',
                'name' => 'Poli KIA & KB',
                'code' => 'C',
                'description' => 'Kesehatan Ibu dan Anak, imunisasi, serta konsultasi KB.',
                'quota_per_day' => 40,
                'is_active' => true,
                'icon_name' => 'Heart',
            ],
            [
                'id' => 'poli-lansia',
                'name' => 'Poli Lansia / Geriatri',
                'code' => 'D',
                'description' => 'Layanan khusus lansia di atas 60 tahun dengan pendampingan khusus.',
                'quota_per_day' => 35,
                'is_active' => true,
                'icon_name' => 'UserCheck',
            ],
        ];

        foreach ($polis as $poli) {
            PoliService::updateOrCreate(['id' => $poli['id']], $poli);
        }
    }
}
