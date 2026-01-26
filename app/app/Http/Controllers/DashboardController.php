<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\InboxItem;
use App\Models\Kpi;
use App\Models\Note;
use App\Models\Objective;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Today page - shows tasks marked for today AND in progress
     */
    public function today(): Response
    {
        $user = auth()->user();
        
        // Focus: Only IN_PROGRESS tasks for "Today" focus
        // Sorted by Priority (URGENT->LOW) then Due Date (Closest->Furthest)
        $focusTasks = Task::where('user_id', $user->id)
            ->where('status', 'IN_PROGRESS')
            ->with('project:id,name,color')
            ->orderByRaw("CASE priority 
                WHEN 'URGENT' THEN 1 
                WHEN 'HIGH' THEN 2 
                WHEN 'MEDIUM' THEN 3 
                WHEN 'LOW' THEN 4 
                ELSE 5 END ASC")
            ->orderByRaw('CASE WHEN due_date IS NULL THEN 1 ELSE 0 END ASC') // Dates first, then nulls? Or user wants urgency? usually dates first.
            ->orderBy('due_date', 'asc') // Closest first
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(fn($task) => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'priority' => strtolower($task->priority),
                'status' => $task->status,
                'completed' => false,
                'due_date' => $task->due_date?->format('Y-m-d'),
                'project' => $task->project ? [
                    'id' => $task->project->id,
                    'name' => $task->project->name,
                    'color' => $task->project->color,
                ] : null,
            ]);

        // Completed today: from task_completions journal
        $completedToday = \App\Models\TaskCompletion::where('user_id', $user->id)
            ->whereDate('completed_on', today())
            ->with('task.project:id,name,color')
            ->get()
            ->map(fn($completion) => [
                'id' => $completion->task->id,
                'title' => $completion->task->title,
                'description' => $completion->task->description,
                'priority' => strtolower($completion->task->priority),
                'status' => 'DONE',
                'completed' => true,
                'due_date' => $completion->task->due_date?->format('Y-m-d'),
                'project' => $completion->task->project ? [
                    'id' => $completion->task->project->id,
                    'name' => $completion->task->project->name,
                    'color' => $completion->task->project->color,
                ] : null,
            ]);

        // Progress calculation: doneTodayCount / (doneTodayCount + focusCount)
        $doneTodayCount = $completedToday->count();
        $focusCount = $focusTasks->count();
        $progressPercent = ($doneTodayCount + $focusCount) > 0 
            ? (int) round(($doneTodayCount / ($doneTodayCount + $focusCount)) * 100)
            : 0;

        // Countdown calculation details
        $endOfYear = \Carbon\Carbon::createFromDate(now()->year, 12, 31)->endOfDay();
        $now = now();
        $diff = $now->diff($endOfYear);

        // Calculate weeks and days manually from total days difference to avoid Carbon's interval ambiguities
        // Carbon diff returns absolute differences (y, m, d, h, i, s). 
        // We want a cascade down: Years -> Months -> Weeks -> Days -> Hours
        // $diff->d is purely days (0-30).
        
        $years = $diff->y;
        $months = $diff->m;
        $daysRemainder = $diff->d; 
        
        // Calculate total weeks remaining in the year (not just remainder)
        // User requested "Exact weeks remaining" instead of "00"
        $totalWeeksRemaining = (int) $now->diffInWeeks($endOfYear);
        
        // For Days, we stick to the remainder days or total days?
        // The display is Y/M/W/D/H.
        // If we show Total Weeks (e.g. 48), showing Months=11 is confusing (redundant).
        // Usually Y/M/W/D is a breakdown.
        // BUT user specifically asked "Why is weeks 0?".
        // If I put "Total Weeks", then "Months" should probably be separate?
        // Let's stick to the requested "Weeks" value being the total weeks, but keep the rest as breakdown?
        // Actually, if Weeks = Total Weeks, then Months is redundant.
        // But the UI has 5 slots.
        // Let's assume user wants: Years (0), Months (11), Weeks (Total e.g. 48?), Days (5).
        // This is mathematically inconsistent (sum > total).
        // However, "Weeks = 0" was the complaint.
        // Maybe they want Weeks column to show the weeks component IF it was only Days/Weeks?
        
        // Let's try to interpret "Exact total weeks remaining".
        // I will replace the 'weeks' value with the Total Weeks count, as requested.
        // And keep 'days' as the remainder days? Or total days?
        // Let's keep 'days' as remainder of the Breakdown, otherwise it's confusing.
        // Wait, if I show 11 Months AND 48 Weeks, it looks like 11 Months + 48 Weeks = ~2 years.
        
        // Alternative interpretation: User thinks "0 Weeks" is wrong because 5 days is close to a week?
        // No, user said "afficher le nombre de semaine exact restantes à la place de 00". "Exact remaining weeks".
        // This implies Total Weeks.
        
        $years = str_pad((string)$years, 2, '0', STR_PAD_LEFT);
        $months = str_pad((string)$months, 2, '0', STR_PAD_LEFT);
        $weeks = str_pad((string)$totalWeeksRemaining, 2, '0', STR_PAD_LEFT);
        $days = str_pad((string)$daysRemainder, 2, '0', STR_PAD_LEFT); // Partial days inside the month/week?
        // Actually Carbon diff d is days *after* months.
        // So 11 months + 5 days.
        
        // I will set 'weeks' to Total Weeks, and strict 'days' to Remainder days. 
        // Note: This is visually inconsistent but matches user request "Show exact weeks".
        
        $countdown = [
            'years' => $years,
            'months' => $months,
            'weeks' => $weeks,
            'days' => $days,
            'hours' => str_pad((string)$diff->h, 2, '0', STR_PAD_LEFT),
        ];

        // Tasks completed since January 1st of current year (from journal)
        $startOfYear = \Carbon\Carbon::createFromDate(now()->year, 1, 1);
        $yearlyCompletedCount = \App\Models\TaskCompletion::where('user_id', $user->id)
            ->where('completed_on', '>=', $startOfYear)
            ->count();

        // Fetch projects for task creation dropdown
        $projects = Project::where('user_id', $user->id)
            ->whereIn('category', ['PROJECT', 'AREA'])
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Today', [
            'focusTasks' => $focusTasks,
            'completedToday' => $completedToday,
            'doneTodayCount' => $doneTodayCount,
            'focusCount' => $focusCount,
            'progressPercent' => $progressPercent,
            'countdown' => $countdown,
            'currentYear' => now()->year,
            'yearlyCompletedCount' => $yearlyCompletedCount,
            'projects' => $projects,
        ]);
    }

    /**
     * Inbox page - quick capture and inbox items
     */
    public function inbox(): Response
    {
        $user = auth()->user();
        
        $inboxItems = InboxItem::where('user_id', $user->id)
            ->whereNull('processed_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($item) => [
                'id' => $item->id,
                'content' => $item->content,
                'created_at' => $item->created_at->diffForHumans(),
            ]);

        // Also get tasks in inbox status (no is_today, not done)
        $inboxTasks = Task::where('user_id', $user->id)
            ->where('is_today', false)
            ->whereIn('status', ['TODO', 'IN_PROGRESS'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(fn($task) => [
                'id' => $task->id,
                'title' => $task->title,
                'priority' => strtolower($task->priority),
                'created_at' => $task->created_at->diffForHumans(),
            ]);

        // Fetch projects for task creation dropdown
        $projects = Project::where('user_id', $user->id)
            ->whereIn('category', ['PROJECT', 'AREA'])
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Inbox', [
            'inboxItems' => $inboxItems,
            'inboxTasks' => $inboxTasks,
            'projects' => $projects,
        ]);
    }

    /**
     * Tasks Board - Kanban view
     */
    public function tasks(): Response
    {
        $user = auth()->user();
        
        $tasks = Task::where('user_id', $user->id)
            ->with('project:id,name,color')
            ->orderBy('order')
            ->get()
            ->map(fn($task) => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'priority' => strtolower($task->priority),
                'due_date' => $task->due_date?->format('Y-m-d'),
                'is_today' => $task->is_today,
                'project' => $task->project ? [
                    'id' => $task->project->id,
                    'name' => $task->project->name,
                    'color' => $task->project->color,
                ] : null,
            ]);

        // Group by status
        $columns = [
            'TODO' => $tasks->where('status', 'TODO')->values(),
            'IN_PROGRESS' => $tasks->where('status', 'IN_PROGRESS')->values(),
            'BLOCKED' => $tasks->where('status', 'BLOCKED')->values(),
            'DONE' => $tasks->where('status', 'DONE')->values(),
        ];

        // Fetch projects for task creation dropdown
        $projects = Project::where('user_id', $user->id)
            ->whereIn('category', ['PROJECT', 'AREA'])
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('TasksBoard', [
            'columns' => $columns,
            'wipLimit' => 3, // Max tasks in IN_PROGRESS
            'projects' => $projects,
        ]);
    }

    /**
     * Projects page - PARA method organized
     */
    public function projects(): Response
    {
        $user = auth()->user();
        
        $projects = Project::where('user_id', $user->id)
            ->withCount(['tasks', 'tasks as completed_tasks_count' => function ($query) {
                $query->where('status', 'DONE');
            }])
            ->orderByRaw("CASE category 
                WHEN 'PROJECT' THEN 1 
                WHEN 'AREA' THEN 2 
                WHEN 'RESOURCE' THEN 3 
                WHEN 'ARCHIVE' THEN 4 
                ELSE 5 END")
            ->orderBy('name')
            ->get()
            ->map(fn($project) => [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'category' => $project->category,
                'status' => $project->status,
                'color' => $project->color,
                'icon' => $project->icon,
                'tasks_count' => $project->tasks_count,
                'completed_tasks_count' => $project->completed_tasks_count,
                'progress' => $project->tasks_count > 0 
                    ? round(($project->completed_tasks_count / $project->tasks_count) * 100) 
                    : 0,
            ]);

        return Inertia::render('Projects', [
            'projects' => $projects,
        ]);
    }

    /**
     * Notes page
     */
    public function notes(): Response
    {
        $user = auth()->user();
        
        $notes = Note::where('user_id', $user->id)
            ->with('project:id,name')
            ->orderBy('is_pinned', 'desc')
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(fn($note) => [
                'id' => $note->id,
                'title' => $note->title,
                'content' => $note->content,
                'preview' => \Str::limit(strip_tags($note->content), 100),
                'is_pinned' => $note->is_pinned,
                'project' => $note->project ? [
                    'id' => $note->project->id,
                    'name' => $note->project->name,
                ] : null,
                'updated_at' => $note->updated_at->diffForHumans(),
            ]);

        // Fetch projects for note linking
        $projects = Project::where('user_id', $user->id)
            ->whereIn('category', ['PROJECT', 'AREA', 'RESOURCE'])
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Notes', [
            'notes' => $notes,
            'projects' => $projects,
        ]);
    }

    /**
     * Calendar page
     */
    public function calendar(): Response
    {
        $user = auth()->user();
        
        $events = Event::where('user_id', $user->id)
            ->where('start_at', '>=', now()->startOfMonth())
            ->where('start_at', '<=', now()->endOfMonth()->addMonth())
            ->orderBy('start_at')
            ->get()
            ->map(fn($event) => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'starts_at' => $event->start_at->toIso8601String(),
                'ends_at' => $event->end_at?->toIso8601String(),
                'all_day' => $event->all_day,
                'location' => null,
                'date' => $event->start_at->format('Y-m-d'),
            ]);

        return Inertia::render('Calendar', [
            'events' => $events,
            'currentMonth' => now()->format('Y-m'),
        ]);
    }

    /**
     * Business overview page
     */
    public function business(): Response
    {
        $user = auth()->user();
        
        $objectives = Objective::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($obj) => [
                'id' => $obj->id,
                'name' => $obj->name,
                'target_value' => $obj->target_value,
                'current_value' => $obj->current_value,
                'unit' => $obj->unit,
                'progress' => $obj->target_value > 0 
                    ? round(($obj->current_value / $obj->target_value) * 100)
                    : 0,
            ]);

        $kpis = Kpi::where('user_id', $user->id)
            ->orderBy('recorded_at', 'desc')
            ->get()
            ->map(fn($kpi) => [
                'id' => $kpi->id,
                'name' => $kpi->name,
                'value' => $kpi->value,
                'unit' => $kpi->unit,
                'trend' => strtolower($kpi->trend),
            ]);

        return Inertia::render('BusinessOverview', [
            'objectives' => $objectives,
            'kpis' => $kpis,
        ]);
    }
}
