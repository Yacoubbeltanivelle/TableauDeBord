<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_completions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('task_id')->constrained()->cascadeOnDelete();
            $table->date('completed_on');
            $table->timestamps();
            $table->softDeletes();
            
            // Prevent duplicate completions for same task on same day
            $table->unique(['user_id', 'task_id', 'completed_on']);
            // Fast lookup for daily completions
            $table->index(['user_id', 'completed_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_completions');
    }
};
