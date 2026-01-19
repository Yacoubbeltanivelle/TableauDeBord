<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function today(): Response
    {
        return Inertia::render('Today');
    }

    public function inbox(): Response
    {
        return Inertia::render('Inbox');
    }

    public function tasks(): Response
    {
        return Inertia::render('TasksBoard');
    }

    public function projects(): Response
    {
        return Inertia::render('Projects');
    }

    public function notes(): Response
    {
        return Inertia::render('Notes');
    }

    public function calendar(): Response
    {
        return Inertia::render('Calendar');
    }

    public function business(): Response
    {
        return Inertia::render('BusinessOverview');
    }
}
