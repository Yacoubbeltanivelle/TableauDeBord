<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kpis', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('value', 15, 2);
            $table->string('unit', 20)->default('');
            $table->enum('trend', ['UP', 'DOWN', 'STABLE'])->default('STABLE');
            $table->timestamp('recorded_at')->useCurrent();

            $table->index(['user_id', 'name']);
            $table->index(['user_id', 'recorded_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kpis');
    }
};
