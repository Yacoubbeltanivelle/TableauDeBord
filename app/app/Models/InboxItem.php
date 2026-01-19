<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InboxItem extends Model
{
    use HasFactory, HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'content',
        'processed',
        'processed_at',
        'converted_to',
        'converted_id',
    ];

    protected $casts = [
        'processed' => 'boolean',
        'processed_at' => 'datetime',
        'converted_to' => 'string',
        'created_at' => 'datetime',
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

    public function scopeUnprocessed($query)
    {
        return $query->where('processed', false);
    }

    public function scopeProcessed($query)
    {
        return $query->where('processed', true);
    }

    // ─────────────────────────────────────────────────────────────
    // Methods
    // ─────────────────────────────────────────────────────────────

    public function convertToTask(): Task
    {
        $task = Task::create([
            'user_id' => $this->user_id,
            'title' => $this->content,
            'status' => 'TODO',
            'priority' => 'MEDIUM',
        ]);

        $this->update([
            'processed' => true,
            'processed_at' => now(),
            'converted_to' => 'TASK',
            'converted_id' => $task->id,
        ]);

        return $task;
    }

    public function convertToNote(): Note
    {
        $note = Note::create([
            'user_id' => $this->user_id,
            'title' => substr($this->content, 0, 100),
            'content' => $this->content,
        ]);

        $this->update([
            'processed' => true,
            'processed_at' => now(),
            'converted_to' => 'NOTE',
            'converted_id' => $note->id,
        ]);

        return $note;
    }

    public function archive(): void
    {
        $this->update([
            'processed' => true,
            'processed_at' => now(),
            'converted_to' => 'ARCHIVED',
        ]);
    }
}
