<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        $startAt = fake()->dateTimeBetween('now', '+30 days');
        $allDay = fake()->boolean(20);

        return [
            'user_id' => User::factory(),
            'task_id' => null,
            'title' => fake()->sentence(rand(3, 6)),
            'description' => fake()->optional(0.5)->paragraph(),
            'start_at' => $startAt,
            'end_at' => $allDay 
                ? (clone $startAt)->modify('+1 day') 
                : (clone $startAt)->modify('+' . rand(30, 120) . ' minutes'),
            'all_day' => $allDay,
            'recurrence' => null,
        ];
    }

    public function withTask(?Task $task = null): static
    {
        return $this->state(fn (array $attributes) => [
            'task_id' => $task ?? Task::factory(),
        ]);
    }

    public function allDay(): static
    {
        return $this->state(function (array $attributes) {
            $start = fake()->dateTimeBetween('now', '+30 days');
            return [
                'all_day' => true,
                'start_at' => $start,
                'end_at' => (clone $start)->modify('+1 day'),
            ];
        });
    }
}
