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
        Schema::create('poli_services', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. 'poli-umum'
            $table->string('name');
            $table->string('code')->unique(); // e.g. 'A', 'B', 'C'
            $table->text('description')->nullable();
            $table->integer('quota_per_day')->default(40);
            $table->boolean('is_active')->default(true);
            $table->integer('current_queue_number')->default(0);
            $table->string('icon_name')->default('Activity');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('poli_services');
    }
};
