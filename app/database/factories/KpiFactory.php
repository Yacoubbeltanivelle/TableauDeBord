<?php

namespace Database\Factories;

use App\Models\Kpi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Kpi>
 */
class KpiFactory extends Factory
{
    protected $model = Kpi::class;

    public function definition(): array
    {
        $trends = ['UP', 'DOWN', 'STABLE'];

        return [
            'user_id' => User::factory(),
            'name' => fake()->randomElement(['Revenue', 'Clients', 'Tasks Done', 'Hours Worked']),
            'value' => fake()->randomFloat(2, 0, 100000),
            'unit' => fake()->randomElement(['€', '', '%']),
            'trend' => fake()->randomElement($trends),
            'recorded_at' => fake()->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
