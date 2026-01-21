<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNoteRequest;
use App\Models\Note;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    /**
     * Store a newly created note.
     */
    public function store(StoreNoteRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        
        Note::create($data);

        return back()->with('success', 'Note créée avec succès !');
    }

    /**
     * Update note.
     */
    public function update(Request $request, Note $note): RedirectResponse
    {
        $this->authorize('update', $note);

        $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'project_id' => ['nullable', 'uuid', 'exists:projects,id'],
            'is_pinned' => ['nullable', 'boolean'],
        ]);

        $note->update($request->only(['title', 'content', 'project_id', 'is_pinned']));

        return back()->with('success', 'Note mise à jour !');
    }

    /**
     * Delete note.
     */
    public function destroy(Note $note): RedirectResponse
    {
        $this->authorize('delete', $note);

        $note->delete();

        return back()->with('success', 'Note supprimée !');
    }
}
