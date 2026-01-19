<?php

namespace Database\Factories;

use App\Models\Objective;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Objective>
 */
class ObjectiveFactory extends Factory
{
    protected $model = Objective::class;

    public function definition(): array
    {
        $target = fake()->numberBetween(1000, 100000);
        $progress = fake()->numberBetween(0, 100);

        return [
            'user_id' => User::factory(),
            'name' => fake()->sentence(rand(2, 5)),
            'description' => fake()->optional(0.6)->paragraph(),
            'target_value' => $target,
            'current_value' => round($target * $progress / 100, 2),
            'unit' => fake()->randomElement(['€', '%', '', 'clients', 'tasks']),
            'deadline' => fake()->optional(0.7)->dateTimeBetween('now', '+1 year'),
        ];
    }

    public function revenue(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Q1 Revenue Target',
            'unit' => '€',
            'target_value' => 50000,
        ]);
    }
}
