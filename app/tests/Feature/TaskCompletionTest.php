<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\TaskCompletion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskCompletionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Completing a task creates a TaskCompletion entry.
     */
    public function test_completing_task_creates_completion_entry(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create([
            'user_id' => $user->id,
            'status' => 'IN_PROGRESS',
        ]);

        $this->actingAs($user)
            ->patch("/api/tasks/{$task->id}/toggle")
            ->assertRedirect();

        // Task should be DONE
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'DONE',
        ]);

        // TaskCompletion entry should exist
        $this->assertTrue(
            TaskCompletion::where('user_id', $user->id)
                ->where('task_id', $task->id)
                ->whereDate('completed_on', today())
                ->exists()
        );
    }

    /**
     * Test: Reopening a task soft-deletes the TaskCompletion entry.
     */
    public function test_reopening_task_soft_deletes_completion_entry(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create([
            'user_id' => $user->id,
            'status' => 'DONE',
            'completed_at' => now(),
        ]);

        // Create completion entry
        $completion = TaskCompletion::create([
            'user_id' => $user->id,
            'task_id' => $task->id,
            'completed_on' => today(),
        ]);

        $this->actingAs($user)
            ->patch("/api/tasks/{$task->id}/toggle")
            ->assertRedirect();

        // Task should be IN_PROGRESS
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'IN_PROGRESS',
        ]);

        // TaskCompletion should be soft-deleted
        $this->assertSoftDeleted('task_completions', [
            'id' => $completion->id,
        ]);
    }

    /**
     * Test: Re-completing a task restores the soft-deleted entry.
     */
    public function test_recompleting_task_restores_soft_deleted_entry(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->create([
            'user_id' => $user->id,
            'status' => 'IN_PROGRESS',
        ]);

        // Create soft-deleted completion entry
        $completion = TaskCompletion::create([
            'user_id' => $user->id,
            'task_id' => $task->id,
            'completed_on' => today(),
        ]);
        $completion->delete();

        $this->actingAs($user)
            ->patch("/api/tasks/{$task->id}/toggle")
            ->assertRedirect();

        // TaskCompletion should be restored
        $this->assertDatabaseHas('task_completions', [
            'id' => $completion->id,
            'deleted_at' => null,
        ]);
    }

    /**
     * Test: User cannot toggle another user's task.
     */
    public function test_user_cannot_toggle_other_users_task(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $task = Task::factory()->create([
            'user_id' => $user1->id,
            'status' => 'IN_PROGRESS',
        ]);

        $this->actingAs($user2)
            ->patch("/api/tasks/{$task->id}/toggle")
            ->assertForbidden();

        // No completion entry should be created
        $this->assertDatabaseMissing('task_completions', [
            'task_id' => $task->id,
        ]);
    }
}
