<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Redirect authenticated users to /today, guests see Landing
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('today');
    }
    return Inertia::render('Landing', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// Redirect /dashboard to /today
Route::get('/dashboard', function () {
    return redirect()->route('today');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // TableauDeBord MVP routes
    Route::get('/today', [DashboardController::class, 'today'])->name('today');
    Route::get('/inbox', [DashboardController::class, 'inbox'])->name('inbox');
    Route::get('/tasks', [DashboardController::class, 'tasks'])->name('tasks');
    Route::get('/projects', [DashboardController::class, 'projects'])->name('projects');
    Route::get('/notes', [DashboardController::class, 'notes'])->name('notes');
    Route::get('/calendar', [DashboardController::class, 'calendar'])->name('calendar');
    Route::get('/business', [DashboardController::class, 'business'])->name('business');

    // API Routes for CRUD operations
    Route::prefix('api')->group(function () {
        // Tasks
        Route::post('/tasks', [\App\Http\Controllers\Api\TaskController::class, 'store'])->name('api.tasks.store');
        Route::patch('/tasks/{task}/toggle', [\App\Http\Controllers\Api\TaskController::class, 'toggle'])->name('api.tasks.toggle');
        Route::patch('/tasks/{task}/today', [\App\Http\Controllers\Api\TaskController::class, 'moveToToday'])->name('api.tasks.today');
        Route::patch('/tasks/{task}/status', [\App\Http\Controllers\Api\TaskController::class, 'updateStatus'])->name('api.tasks.status');
        Route::delete('/tasks/{task}', [\App\Http\Controllers\Api\TaskController::class, 'destroy'])->name('api.tasks.destroy');

        // Projects
        Route::post('/projects', [\App\Http\Controllers\Api\ProjectController::class, 'store'])->name('api.projects.store');
        Route::delete('/projects/{project}', [\App\Http\Controllers\Api\ProjectController::class, 'destroy'])->name('api.projects.destroy');

        // Notes
        Route::post('/notes', [\App\Http\Controllers\Api\NoteController::class, 'store'])->name('api.notes.store');
        Route::patch('/notes/{note}', [\App\Http\Controllers\Api\NoteController::class, 'update'])->name('api.notes.update');
        Route::delete('/notes/{note}', [\App\Http\Controllers\Api\NoteController::class, 'destroy'])->name('api.notes.destroy');

        // Events
        Route::post('/events', [\App\Http\Controllers\Api\EventController::class, 'store'])->name('api.events.store');
        Route::delete('/events/{event}', [\App\Http\Controllers\Api\EventController::class, 'destroy'])->name('api.events.destroy');
    });
});

// Legal pages (public)
Route::get('/terms', function () {
    return Inertia::render('Legal/Terms');
})->name('terms');

Route::get('/privacy', function () {
    return Inertia::render('Legal/Privacy');
})->name('privacy');

require __DIR__.'/auth.php';
