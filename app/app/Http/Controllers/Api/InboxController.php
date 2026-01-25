<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InboxItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InboxController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        InboxItem::create([
            'user_id' => Auth::id(),
            'content' => $request->content,
            'processed' => false,
            'created_at' => now(),
        ]);

        return back()->with('success', 'Élément ajouté à la boîte de réception');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $item = InboxItem::where('user_id', Auth::id())->findOrFail($id);
        
        // Hard delete as per user request flow (converted to task -> delete this)
        $item->delete();

        return back()->with('success', 'Élément supprimé');
    }
}
