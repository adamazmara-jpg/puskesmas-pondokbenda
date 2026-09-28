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
        Schema::create('doctor_schedules', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('doctor_name');
            $table->string('specialization');
            $table->string('poli_id');
            $table->string('day'); // e.g. 'Senin', 'Selasa'
            $table->time('time_start');
            $table->time('time_end');
            $table->integer('max_quota')->default(30);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('poli_id')->references('id')->on('poli_services')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctor_schedules');
    }
};
