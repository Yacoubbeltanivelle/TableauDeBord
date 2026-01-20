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

        $task1 = Task::factory()->create(['user_id' => $user1->id, 'is_today' => true]);
        $task2 = Task::factory()->create(['user_id' => $user2->id, 'is_today' => true]);

        $response = $this->actingAs($user1)->get('/today');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('Today')
                ->has('tasks', 1) // Only user1's task
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
