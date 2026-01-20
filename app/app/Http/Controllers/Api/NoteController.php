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
        Note::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'content' => $request->content ?? '',
            'project_id' => $request->project_id,
            'is_pinned' => $request->is_pinned ?? false,
        ]);

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
            'is_pinned' => ['nullable', 'boolean'],
        ]);

        $note->update($request->only(['title', 'content', 'is_pinned']));

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
