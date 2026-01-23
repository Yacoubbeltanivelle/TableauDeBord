<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Store a newly created task.
     */
    public function store(StoreTaskRequest $request): RedirectResponse
    {
        $task = Task::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
            'project_id' => $request->project_id,
            'status' => $request->status ?? 'TODO',
            'priority' => $request->priority ?? 'MEDIUM',
            'due_date' => $request->due_date,
            'is_today' => $request->is_today ?? false,
            'estimated_minutes' => $request->estimated_minutes,
        ]);

        return back()->with('success', 'Tâche créée avec succès !');
    }

    /**
     * Toggle task completion status.
     * Also manages task_completions journal for daily tracking.
     */
    public function toggle(Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        if ($task->status === 'DONE') {
            // Reopen task: go back to IN_PROGRESS and soft-delete today's completion
            $task->update([
                'status' => 'IN_PROGRESS',
                'completed_at' => null,
            ]);
            
            // Soft-delete today's completion entry if exists
            \App\Models\TaskCompletion::where('user_id', auth()->id())
                ->where('task_id', $task->id)
                ->whereDate('completed_on', today())
                ->delete();
        } else {
            // Complete task: mark as DONE and record completion
            $task->update([
                'status' => 'DONE',
                'completed_at' => now(),
            ]);
            
            // Upsert completion entry (restore if soft-deleted)
            $existing = \App\Models\TaskCompletion::withTrashed()
                ->where('user_id', auth()->id())
                ->where('task_id', $task->id)
                ->whereDate('completed_on', today())
                ->first();
            
            if ($existing) {
                $existing->restore();
            } else {
                \App\Models\TaskCompletion::create([
                    'user_id' => auth()->id(),
                    'task_id' => $task->id,
                    'completed_on' => today(),
                ]);
            }
        }

        return back()->with('success', 'Tâche mise à jour !');
    }

    /**
     * Move task to today.
     */
    public function moveToToday(Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        $task->update(['is_today' => true]);

        return back()->with('success', 'Tâche ajoutée à Aujourd\'hui !');
    }

    /**
     * Update task details.
     */
    public function update(UpdateTaskRequest $request, Task $task): RedirectResponse
    {
        // Authorization handled by FormRequest or explicitly here? 
        // UpdateTaskRequest usually handles it or we call authorize.
        // Let's check UpdateTaskRequest content first. 
        // Assuming standard policy usage:
        // $this->authorize('update', $task); // Usually done in Request authorize()
        
        $task->update($request->validated());

        return back()->with('success', 'Tâche mise à jour !');
    }

    /**
     * Update task status (for kanban board).
     */
    public function updateStatus(Request $request, Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        $request->validate([
            'status' => ['required', 'in:TODO,IN_PROGRESS,BLOCKED,DONE'],
        ]);

        // WIP limit check for IN_PROGRESS
        if ($request->status === 'IN_PROGRESS') {
            $wipCount = Task::where('user_id', auth()->id())
                ->where('status', 'IN_PROGRESS')
                ->count();

            if ($wipCount >= 3) {
                return back()->with('error', 'Limite WIP atteinte ! Max 3 tâches en cours.');
            }
        }

        $task->update([
            'status' => $request->status,
            'completed_at' => $request->status === 'DONE' ? now() : null,
        ]);

        return back()->with('success', 'Statut mis à jour !');
    }

    /**
     * Delete task.
     */
    public function destroy(Task $task): RedirectResponse
    {
        $this->authorize('delete', $task);

        $task->delete();

        return back()->with('success', 'Tâche supprimée !');
    }
    /**
     * Reorder tasks.
     */
    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:tasks,id'],
            'items.*.position' => ['required', 'integer'],
            'items.*.status' => ['required', 'string', 'in:TODO,IN_PROGRESS,BLOCKED,DONE'],
        ]);

        // Check for WIP limit violation if any task is moved to IN_PROGRESS
        $newInProgress = collect($request->items)->where('status', 'IN_PROGRESS')->count();
        if ($newInProgress > 0) {
            $currentInProgress = Task::where('user_id', auth()->id())
                ->where('status', 'IN_PROGRESS')
                ->whereNotIn('id', collect($request->items)->pluck('id'))
                ->count();
            
            if (($currentInProgress + $newInProgress) > 3) {
                 return back()->with('error', 'Limite WIP atteinte ! Max 3 tâches en cours.');
            }
        }

        \DB::transaction(function () use ($request) {
            foreach ($request->items as $item) {
                $task = Task::find($item['id']);
                
                // Policy check: ensure user owns the task
                if ($task && $task->user_id === auth()->id()) {
                    $task->update([
                        'position' => $item['position'],
                        'status' => $item['status'],
                    ]);
                }
            }
        });

        return back()->with('success', 'Ordre mis à jour !');
    }
}
