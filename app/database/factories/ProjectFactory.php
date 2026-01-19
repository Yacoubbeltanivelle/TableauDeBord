<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        $categories = ['PROJECT', 'AREA', 'RESOURCE', 'ARCHIVE'];
        $statuses = ['ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'];
        $colors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
        $icons = ['📁', '🎯', '💼', '📚', '🔧', '🚀', '💡', '📊'];

        return [
            'user_id' => User::factory(),
            'name' => fake()->words(rand(2, 4), true),
            'description' => fake()->optional(0.7)->paragraph(),
            'category' => fake()->randomElement($categories),
            'color' => fake()->randomElement($colors),
            'icon' => fake()->optional(0.8)->randomElement($icons),
            'status' => fake()->randomElement($statuses),
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'ACTIVE',
        ]);
    }

    public function project(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'PROJECT',
        ]);
    }

    public function area(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'AREA',
        ]);
    }
}
