<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Redirect authenticated users to /today, guests see Welcome
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('today');
    }
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
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
});

require __DIR__.'/auth.php';
