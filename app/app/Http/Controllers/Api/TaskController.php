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
     */
    public function toggle(Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        if ($task->status === 'DONE') {
            $task->update([
                'status' => 'TODO',
                'completed_at' => null,
            ]);
        } else {
            $task->update([
                'status' => 'DONE',
                'completed_at' => now(),
            ]);
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
}
