<?php

namespace Database\Factories;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tag>
 */
class TagFactory extends Factory
{
    protected $model = Tag::class;

    public function definition(): array
    {
        $colors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];
        $tagNames = ['urgent', 'important', 'work', 'personal', 'review', 'idea', 'followup', 'waiting'];

        return [
            'user_id' => User::factory(),
            'name' => fake()->unique()->randomElement($tagNames),
            'color' => fake()->randomElement($colors),
        ];
    }
}
