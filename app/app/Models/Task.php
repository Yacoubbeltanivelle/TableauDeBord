<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'project_id',
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'is_today',
        'estimated_minutes',
        'completed_at',
        'completed_at',
        'position',
    ];

    protected $casts = [
        'status' => 'string',
        'priority' => 'string',
        'due_date' => 'date',
        'is_today' => 'boolean',
        'estimated_minutes' => 'integer',
        'completed_at' => 'datetime',
        'position' => 'integer',
    ];

    // ─────────────────────────────────────────────────────────────
    // Relationships
    // ─────────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'task_tag');
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    // ─────────────────────────────────────────────────────────────
    // Scopes
    // ─────────────────────────────────────────────────────────────

    public function scopeToday($query)
    {
        return $query->where('is_today', true);
    }

    public function scopeDueToday($query)
    {
        return $query->whereDate('due_date', today());
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeNotDone($query)
    {
        return $query->where('status', '!=', 'DONE');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('position')->orderBy('created_at');
    }

    // ─────────────────────────────────────────────────────────────
    // Methods
    // ─────────────────────────────────────────────────────────────

    public function markAsDone(): void
    {
        $this->update([
            'status' => 'DONE',
            'completed_at' => now(),
        ]);
    }

    public function addToToday(): void
    {
        $this->update(['is_today' => true]);
    }

    public function removeFromToday(): void
    {
        $this->update(['is_today' => false]);
    }
}
