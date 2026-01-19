<?php

namespace Database\Factories;

use App\Models\InboxItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InboxItem>
 */
class InboxItemFactory extends Factory
{
    protected $model = InboxItem::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'content' => fake()->sentence(rand(5, 15)),
            'processed' => false,
            'processed_at' => null,
            'converted_to' => null,
            'converted_id' => null,
        ];
    }

    public function processed(): static
    {
        return $this->state(fn (array $attributes) => [
            'processed' => true,
            'processed_at' => now(),
            'converted_to' => fake()->randomElement(['TASK', 'NOTE', 'ARCHIVED']),
        ]);
    }
}
