<?php

use App\Models\Task;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\patchJson;

test('authenticated user can reorder tasks', function () {
    $user = User::factory()->create();
    actingAs($user);

    $task1 = Task::factory()->create(['user_id' => $user->id, 'position' => 0, 'status' => 'TODO']);
    $task2 = Task::factory()->create(['user_id' => $user->id, 'position' => 1, 'status' => 'TODO']);

    $response = patchJson(route('api.tasks.reorder'), [
        'items' => [
            ['id' => $task1->id, 'position' => 10, 'status' => 'IN_PROGRESS'],
            ['id' => $task2->id, 'position' => 5, 'status' => 'TODO'],
        ]
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('tasks', [
        'id' => $task1->id,
        'position' => 10,
        'status' => 'IN_PROGRESS',
    ]);

    $this->assertDatabaseHas('tasks', [
        'id' => $task2->id,
        'position' => 5,
        'status' => 'TODO',
    ]);
});

test('user cannot reorder others tasks', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    actingAs($user);

    $task = Task::factory()->create(['user_id' => $otherUser->id, 'position' => 0]);

    $response = patchJson(route('api.tasks.reorder'), [
        'items' => [
            ['id' => $task->id, 'position' => 10, 'status' => 'TODO'],
        ]
    ]);

    $response->assertRedirect();
    
    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'position' => 0,
    ]);
});

test('wip limit on reorder', function () {
    $user = User::factory()->create();
    actingAs($user);

    Task::factory()->count(3)->create(['user_id' => $user->id, 'status' => 'IN_PROGRESS']);
    $task = Task::factory()->create(['user_id' => $user->id, 'status' => 'TODO']);

    $response = patchJson(route('api.tasks.reorder'), [
        'items' => [
            ['id' => $task->id, 'position' => 10, 'status' => 'IN_PROGRESS'],
        ]
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('error', 'Limite WIP atteinte ! Max 3 tâches en cours.');

    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'status' => 'TODO',
    ]);
});
