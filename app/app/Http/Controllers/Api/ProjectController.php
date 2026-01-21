<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;

class ProjectController extends Controller
{
    /**
     * Store a newly created project.
     */
    public function store(StoreProjectRequest $request): RedirectResponse
    {
        Project::create([
            'user_id' => auth()->id(),
            'name' => $request->name,
            'description' => $request->description,
            'category' => $request->category ?? 'PROJECT',
            'status' => $request->status ?? 'ACTIVE',
            'color' => $request->color ?? '#3B82F6',
            'icon' => $request->icon ?? '📁',
        ]);

        return back()->with('success', 'Projet créé avec succès !');
    }

    /**
     * Update project details.
     */
    public function update(StoreProjectRequest $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $project->update($request->validated());

        return back()->with('success', 'Projet mis à jour !');
    }

    /**
     * Delete project.
     */
    public function destroy(Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        $project->delete();

        return back()->with('success', 'Projet supprimé !');
    }
}
