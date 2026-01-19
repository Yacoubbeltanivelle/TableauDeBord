<?php

namespace Database\Factories;

use App\Models\Note;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Note>
 */
class NoteFactory extends Factory
{
    protected $model = Note::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'project_id' => null,
            'title' => fake()->sentence(rand(3, 8)),
            'content' => fake()->paragraphs(rand(2, 5), true),
            'is_pinned' => fake()->boolean(10),
        ];
    }

    public function withProject(?Project $project = null): static
    {
        return $this->state(fn (array $attributes) => [
            'project_id' => $project ?? Project::factory(),
        ]);
    }

    public function pinned(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_pinned' => true,
        ]);
    }
}
