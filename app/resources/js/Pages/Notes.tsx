import { Head, router } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { FileText, Plus, Pin, Search, FolderKanban } from "lucide-react";
import { useState } from "react";

interface Note {
    id: string;
    title: string;
    content: string;
    preview: string;
    is_pinned: boolean;
    project: {
        id: string;
        name: string;
    } | null;
    updated_at: string;
}

interface NotesProps {
    notes: Note[];
}

export default function Notes({ notes }: NotesProps) {
    const [selectedNote, setSelectedNote] = useState<Note | null>(
        notes[0] || null,
    );
    const [searchQuery, setSearchQuery] = useState("");

    const filteredNotes = notes.filter(
        (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const pinnedNotes = filteredNotes.filter((n) => n.is_pinned);
    const regularNotes = filteredNotes.filter((n) => !n.is_pinned);

    return (
        <AppShell title="Notes">
            <Head title="Notes" />

            <div className="flex gap-6 h-[calc(100vh-200px)]">
                {/* Sidebar - Notes List */}
                <div className="w-80 shrink-0 flex flex-col">
                    {/* Search & New */}
                    <div className="flex gap-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search notes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <Button size="icon">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Notes List */}
                    <div className="flex-1 overflow-y-auto space-y-1">
                        {pinnedNotes.length > 0 && (
                            <>
                                <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                                    Pinned
                                </p>
                                {pinnedNotes.map((note) => (
                                    <NoteItem
                                        key={note.id}
                                        note={note}
                                        selected={selectedNote?.id === note.id}
                                        onClick={() => setSelectedNote(note)}
                                    />
                                ))}
                            </>
                        )}

                        {regularNotes.length > 0 && (
                            <>
                                <p className="text-xs font-medium text-muted-foreground px-2 py-1 mt-3">
                                    Notes
                                </p>
                                {regularNotes.map((note) => (
                                    <NoteItem
                                        key={note.id}
                                        note={note}
                                        selected={selectedNote?.id === note.id}
                                        onClick={() => setSelectedNote(note)}
                                    />
                                ))}
                            </>
                        )}

                        {filteredNotes.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No notes found
                            </div>
                        )}
                    </div>
                </div>

                {/* Main - Note Content */}
                <Card className="flex-1 flex flex-col">
                    {selectedNote ? (
                        <>
                            <CardHeader className="border-b">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            {selectedNote.is_pinned && (
                                                <Pin className="h-4 w-4 text-primary" />
                                            )}
                                            {selectedNote.title}
                                        </CardTitle>
                                        {selectedNote.project && (
                                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                <FolderKanban className="h-3 w-3" />
                                                {selectedNote.project.name}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {selectedNote.updated_at}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-6">
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                    <pre className="whitespace-pre-wrap font-sans text-sm">
                                        {selectedNote.content}
                                    </pre>
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Select a note to view</p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppShell>
    );
}

function NoteItem({
    note,
    selected,
    onClick,
}: {
    note: Note;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selected
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-accent border border-transparent"
            }`}
        >
            <div className="flex items-start gap-2">
                {note.is_pinned && (
                    <Pin className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{note.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {note.preview}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {note.updated_at}
                    </p>
                </div>
            </div>
        </div>
    );
}
