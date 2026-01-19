<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Objective extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'target_value',
        'current_value',
        'unit',
        'deadline',
    ];

    protected $casts = [
        'target_value' => 'decimal:2',
        'current_value' => 'decimal:2',
        'deadline' => 'date',
    ];

    // ─────────────────────────────────────────────────────────────
    // Relationships
    // ─────────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ─────────────────────────────────────────────────────────────
    // Accessors
    // ─────────────────────────────────────────────────────────────

    public function getProgressAttribute(): int
    {
        if ($this->target_value == 0) return 0;
        return (int) min(100, round(($this->current_value / $this->target_value) * 100));
    }

    public function getIsCompletedAttribute(): bool
    {
        return $this->current_value >= $this->target_value;
    }

    // ─────────────────────────────────────────────────────────────
    // Methods
    // ─────────────────────────────────────────────────────────────

    public function updateProgress(float $value): void
    {
        $this->update(['current_value' => $value]);
    }

    public function incrementProgress(float $amount): void
    {
        $this->update(['current_value' => $this->current_value + $amount]);
    }
}
