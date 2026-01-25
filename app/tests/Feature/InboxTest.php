<?php

namespace Tests\Feature;

use App\Models\InboxItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InboxTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_inbox_item()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/api/inbox', [
            'content' => 'Buy milk',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('inbox_items', [
            'user_id' => $user->id,
            'content' => 'Buy milk',
            'processed' => false,
        ]);
    }

    public function test_user_can_delete_inbox_item()
    {
        $user = User::factory()->create();
        $item = InboxItem::forceCreate([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'user_id' => $user->id,
            'content' => 'Old item',
            'processed' => false,
            'created_at' => now(),
        ]);

        $response = $this->actingAs($user)->delete("/api/inbox/{$item->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('inbox_items', [
            'id' => $item->id,
        ]);
    }

    public function test_user_cannot_delete_others_inbox_item()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        
        $item = InboxItem::forceCreate([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'user_id' => $user2->id,
            'content' => 'User 2 item',
            'processed' => false,
            'created_at' => now(),
        ]);

        $response = $this->actingAs($user1)->deleteJson("/api/inbox/{$item->id}");

        $response->assertNotFound();
    }
}
