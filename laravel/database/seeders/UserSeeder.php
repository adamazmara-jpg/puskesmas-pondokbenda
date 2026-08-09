<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Super Admin
        User::updateOrCreate(
            ['email' => 'superadmin@puskesmas.go.id'],
            [
                'name' => 'Super Administrator IT Dinkes',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'department' => 'Divisi Teknologi Informasi & Sistem',
            ]
        );

        // 2. Admin
        User::updateOrCreate(
            ['email' => 'admin@puskesmas.go.id'],
            [
                'name' => 'Dr. Hj. Ratna Sari, M.Kes (Admin Puskesmas)',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'department' => 'Kepala Tata Usaha & Mutu',
            ]
        );

        // 3. Petugas Loket
        User::updateOrCreate(
            ['email' => 'petugas@puskesmas.go.id'],
            [
                'name' => 'Budi Santoso, Amd.Kep (Petugas Loket)',
                'password' => Hash::make('password'),
                'role' => 'petugas_loket',
                'department' => 'Loket Pendaftaran Utama',
            ]
        );
    }
}
