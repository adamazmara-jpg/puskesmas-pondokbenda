<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('confusion_matrix_datasets', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('tanggal');
            $table->string('hari');
            $table->string('poli');
            $table->string('dokter');
            $table->string('jam_daftar');
            $table->integer('nomor_antrian');
            $table->integer('pasien_terdaftar');
            $table->integer('maksimal_pasien');
            $table->enum('slot_tersedia_actual', ['Tersedia', 'Tidak Tersedia'])->default('Tersedia');
            $table->enum('slot_tersedia_predicted', ['Tersedia', 'Tidak Tersedia'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('confusion_matrix_datasets');
    }
};
