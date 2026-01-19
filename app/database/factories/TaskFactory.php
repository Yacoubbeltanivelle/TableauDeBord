<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        $statuses = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE'];
        $priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

        return [
            'user_id' => User::factory(),
            'project_id' => null,
            'title' => fake()->sentence(rand(3, 8)),
            'description' => fake()->optional(0.5)->paragraph(),
            'status' => fake()->randomElement($statuses),
            'priority' => fake()->randomElement($priorities),
            'due_date' => fake()->optional(0.6)->dateTimeBetween('now', '+30 days'),
            'is_today' => fake()->boolean(20),
            'estimated_minutes' => fake()->optional(0.4)->numberBetween(15, 240),
            'completed_at' => null,
            'order' => fake()->numberBetween(0, 100),
        ];
    }

    public function withProject(?Project $project = null): static
    {
        return $this->state(fn (array $attributes) => [
            'project_id' => $project ?? Project::factory(),
        ]);
    }

    public function today(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_today' => true,
        ]);
    }

    public function done(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'DONE',
            'completed_at' => now(),
        ]);
    }

    public function todo(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'TODO',
        ]);
    }

    public function highPriority(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'HIGH',
        ]);
    }
}
