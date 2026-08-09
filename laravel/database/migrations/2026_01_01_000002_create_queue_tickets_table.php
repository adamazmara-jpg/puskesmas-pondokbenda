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
        Schema::create('queue_tickets', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. 'TICKET-170000000'
            $table->string('ticket_number'); // e.g. 'A-001'
            $table->integer('queue_sequence'); // e.g. 1
            $table->string('patient_name');
            $table->string('patient_nik');
            $table->string('patient_bpjs')->nullable();
            $table->string('patient_phone');
            $table->string('poli_id');
            $table->string('poli_name');
            $table->string('doctor_id')->nullable();
            $table->string('doctor_name')->nullable();
            $table->enum('status', ['waiting', 'calling', 'serving', 'completed', 'cancelled', 'skipped'])->default('waiting');
            $table->enum('patient_type', ['BPJS', 'Umum'])->default('Umum');
            $table->enum('registration_type', ['online', 'walkin'])->default('online');
            $table->string('estimated_time')->nullable();
            $table->timestamp('called_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->foreign('poli_id')->references('id')->on('poli_services')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('queue_tickets');
    }
};
