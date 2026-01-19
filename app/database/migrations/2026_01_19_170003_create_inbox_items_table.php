<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inbox_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('content');
            $table->boolean('processed')->default(false);
            $table->timestamp('processed_at')->nullable();
            $table->enum('converted_to', ['TASK', 'NOTE', 'ARCHIVED'])->nullable();
            $table->uuid('converted_id')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index(['user_id', 'processed']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inbox_items');
    }
};
