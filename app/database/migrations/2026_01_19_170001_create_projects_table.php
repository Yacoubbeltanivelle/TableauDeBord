<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('category', ['PROJECT', 'AREA', 'RESOURCE', 'ARCHIVE'])->default('PROJECT');
            $table->string('color', 7)->default('#6366F1');
            $table->string('icon', 10)->nullable();
            $table->enum('status', ['ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'])->default('ACTIVE');
            $table->timestamps();

            $table->index(['user_id', 'category']);
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
