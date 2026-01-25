<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test 1: User can access Today page
     */
    public function test_authenticated_user_can_access_today(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/today');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Today'));
    }

    /**
     * Test 2: Guest cannot access Today page
     */
    public function test_guest_cannot_access_today(): void
    {
        $response = $this->get('/today');

        $response->assertRedirect('/login');
    }

    /**
     * Test 3: Seeder creates tasks for demo user
     */
    public function test_seeder_creates_demo_data(): void
    {
        $this->seed();

        $demoUser = User::where('email', 'demo@tableaudebord.test')->first();
        
        $this->assertNotNull($demoUser);
        $this->assertGreaterThan(0, $demoUser->tasks()->count());
        $this->assertGreaterThan(0, $demoUser->projects()->count());
    }

    /**
     * Test 4: User can only see their own tasks (isolation)
     */
    public function test_user_cannot_see_other_users_tasks(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // Today page now shows only IN_PROGRESS tasks in focusTasks
        $task1 = Task::factory()->create(['user_id' => $user1->id, 'status' => 'IN_PROGRESS']);
        $task2 = Task::factory()->create(['user_id' => $user2->id, 'status' => 'IN_PROGRESS']);

        $response = $this->actingAs($user1)->get('/today');

        $response->assertInertia(fn ($page) => 
            $page->component('Today')
                ->has('focusTasks')
                ->has('completedToday')
        );
    }

    /**
     * Test: Focus tasks are sorted effectively (Priority > DueDate).
     */
    public function test_focus_tasks_are_sorted_correctly(): void
    {
        $user = User::factory()->create();

        // Create tasks in random order
        $t1 = Task::factory()->create(['user_id' => $user->id, 'status' => 'IN_PROGRESS', 'priority' => 'LOW', 'due_date' => now()->addDays(5)]);
        $t2 = Task::factory()->create(['user_id' => $user->id, 'status' => 'IN_PROGRESS', 'priority' => 'URGENT', 'due_date' => now()->addDays(10)]); // Urgent comes first
        $t3 = Task::factory()->create(['user_id' => $user->id, 'status' => 'IN_PROGRESS', 'priority' => 'HIGH', 'due_date' => now()->addDays(1)]); // High comes second
        $t4 = Task::factory()->create(['user_id' => $user->id, 'status' => 'IN_PROGRESS', 'priority' => 'HIGH', 'due_date' => now()->addDays(20)]); // High same priority, later date -> after t3
        
        $response = $this->actingAs($user)->get('/today');
        
        $response->assertInertia(fn ($page) => $page
            ->component('Today')
            ->has('focusTasks', 4)
            ->where('focusTasks.0.id', $t2->id) // Urgent (t2)
            ->where('focusTasks.1.id', $t3->id) // High, early date (t3)
            ->where('focusTasks.2.id', $t4->id) // High, late date (t4)
            ->where('focusTasks.3.id', $t1->id) // Low (t1)
        );
    }

    /**
     * Test 5: User can access all main pages
     */
    public function test_user_can_access_all_main_pages(): void
    {
        $user = User::factory()->create();

        $pages = ['/today', '/inbox', '/tasks', '/projects', '/notes', '/calendar', '/business'];

        foreach ($pages as $page) {
            $response = $this->actingAs($user)->get($page);
            $response->assertStatus(200, "Failed to access {$page}");
        }
    }
}
