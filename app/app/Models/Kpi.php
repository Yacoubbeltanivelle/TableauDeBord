<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Kpi extends Model
{
    use HasFactory, HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'name',
        'value',
        'unit',
        'trend',
        'recorded_at',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'trend' => 'string',
        'recorded_at' => 'datetime',
    ];

    // ─────────────────────────────────────────────────────────────
    // Relationships
    // ─────────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ─────────────────────────────────────────────────────────────
    // Scopes
    // ─────────────────────────────────────────────────────────────

    public function scopeLatest($query)
    {
        return $query->orderBy('recorded_at', 'desc');
    }

    public function scopeByName($query, string $name)
    {
        return $query->where('name', $name);
    }

    // ─────────────────────────────────────────────────────────────
    // Static Methods
    // ─────────────────────────────────────────────────────────────

    public static function record(int $userId, string $name, float $value, string $unit = '', ?string $trend = null): self
    {
        // Determine trend if not provided
        if ($trend === null) {
            $previous = static::where('user_id', $userId)
                              ->where('name', $name)
                              ->orderBy('recorded_at', 'desc')
                              ->first();

            if ($previous) {
                if ($value > $previous->value) {
                    $trend = 'UP';
                } elseif ($value < $previous->value) {
                    $trend = 'DOWN';
                } else {
                    $trend = 'STABLE';
                }
            } else {
                $trend = 'STABLE';
            }
        }

        return static::create([
            'user_id' => $userId,
            'name' => $name,
            'value' => $value,
            'unit' => $unit,
            'trend' => $trend,
            'recorded_at' => now(),
        ]);
    }
}
