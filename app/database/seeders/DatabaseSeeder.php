<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\InboxItem;
use App\Models\Kpi;
use App\Models\Note;
use App\Models\Objective;
use App\Models\Project;
use App\Models\Tag;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create demo user (already verified for immediate access)
        $user = User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@tableaudebord.test',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        // Create tags for this user
        $tags = collect(['urgent', 'important', 'work', 'personal', 'review'])->map(function ($name) use ($user) {
            return Tag::factory()->create([
                'user_id' => $user->id,
                'name' => $name,
            ]);
        });

        // Create PARA projects
        $projects = collect([
            ['name' => 'TableauDeBord Development', 'category' => 'PROJECT', 'status' => 'ACTIVE', 'icon' => '📊'],
            ['name' => 'Client Work', 'category' => 'PROJECT', 'status' => 'ACTIVE', 'icon' => '💼'],
            ['name' => 'Health & Fitness', 'category' => 'AREA', 'status' => 'ACTIVE', 'icon' => '🏃'],
            ['name' => 'Learning Resources', 'category' => 'RESOURCE', 'status' => 'ACTIVE', 'icon' => '📚'],
            ['name' => 'Old Project 2025', 'category' => 'ARCHIVE', 'status' => 'ARCHIVED', 'icon' => '📦'],
        ])->map(function ($data) use ($user) {
            return Project::factory()->create(array_merge($data, ['user_id' => $user->id]));
        });

        // Create tasks for each active project
        $projects->filter(fn($p) => $p->status === 'ACTIVE')->each(function ($project) use ($user, $tags) {
            // Create 3-5 tasks per project
            Task::factory()->count(rand(3, 5))->create([
                'user_id' => $user->id,
                'project_id' => $project->id,
            ])->each(function ($task) use ($tags) {
                // Attach 1-2 random tags
                $task->tags()->attach($tags->random(rand(1, 2))->pluck('id'));
            });
        });

        // Create "today" tasks
        Task::factory()->count(3)->today()->create([
            'user_id' => $user->id,
            'project_id' => $projects->first()->id,
        ]);

        // Create inbox items
        InboxItem::factory()->count(5)->create(['user_id' => $user->id]);
        InboxItem::factory()->count(2)->processed()->create(['user_id' => $user->id]);

        // Create notes
        $projects->take(3)->each(function ($project) use ($user, $tags) {
            Note::factory()->count(rand(2, 4))->create([
                'user_id' => $user->id,
                'project_id' => $project->id,
            ])->each(function ($note) use ($tags) {
                $note->tags()->attach($tags->random(rand(1, 2))->pluck('id'));
            });
        });

        // Create a pinned note
        Note::factory()->pinned()->create([
            'user_id' => $user->id,
            'title' => 'Important Notes',
            'content' => "# Quick Reference\n\n- Check inbox daily\n- Review weekly objectives\n- Update KPIs",
        ]);

        // Create calendar events
        Event::factory()->count(5)->create(['user_id' => $user->id]);
        Event::factory()->allDay()->count(2)->create(['user_id' => $user->id]);

        // Create business objectives
        collect([
            ['name' => 'Q1 Revenue', 'target_value' => 50000, 'current_value' => 32500, 'unit' => '€'],
            ['name' => 'New Clients', 'target_value' => 10, 'current_value' => 6, 'unit' => ''],
            ['name' => 'Task Completion Rate', 'target_value' => 100, 'current_value' => 78, 'unit' => '%'],
        ])->each(function ($data) use ($user) {
            Objective::factory()->create(array_merge($data, ['user_id' => $user->id]));
        });

        // Create KPIs
        collect([
            ['name' => 'Monthly Revenue', 'value' => 12500, 'unit' => '€', 'trend' => 'UP'],
            ['name' => 'Active Projects', 'value' => 4, 'unit' => '', 'trend' => 'STABLE'],
            ['name' => 'Tasks Completed', 'value' => 15, 'unit' => '', 'trend' => 'UP'],
            ['name' => 'Hours Worked', 'value' => 42, 'unit' => 'h', 'trend' => 'DOWN'],
        ])->each(function ($data) use ($user) {
            Kpi::factory()->create(array_merge($data, ['user_id' => $user->id]));
        });

        $this->command->info('✅ Demo data seeded for: demo@tableaudebord.test (password: password)');
    }
}
