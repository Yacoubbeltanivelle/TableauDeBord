<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskCompletion extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'task_id',
        'completed_on',
    ];

    protected $casts = [
        'completed_on' => 'date',
    ];

    // ─────────────────────────────────────────────────────────────
    // Relationships
    // ─────────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    // ─────────────────────────────────────────────────────────────
    // Helper Methods
    // ─────────────────────────────────────────────────────────────

    /**
     * Sync completion status based on task status.
     * Upserts completion entry when DONE, soft-deletes when not DONE.
     */
    public static function sync(Task $task): void
    {
        if ($task->status === 'DONE') {
            // Upsert completion entry (restore if soft-deleted)
            $existing = self::withTrashed()
                ->where('user_id', $task->user_id)
                ->where('task_id', $task->id)
                ->whereDate('completed_on', today())
                ->first();
            
            if ($existing) {
                if ($existing->trashed()) {
                    $existing->restore();
                }
            } else {
                self::create([
                    'user_id' => $task->user_id,
                    'task_id' => $task->id,
                    'completed_on' => today(),
                ]);
            }
        } else {
            // Soft-delete today's completion entry if exists (undo)
            self::where('user_id', $task->user_id)
                ->where('task_id', $task->id)
                ->whereDate('completed_on', today())
                ->delete();
        }
    }
}
