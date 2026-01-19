import { Head } from '@inertiajs/react';
import AppShell from '@/Layouts/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { FileText, FolderOpen, Pin, Plus, Search } from 'lucide-react';
import { useState } from 'react';

interface Note {
    id: number;
    title: string;
    preview: string;
    project?: string;
    isPinned: boolean;
    updatedAt: string;
}

export default function Notes() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    // Placeholder data
    const notes: Note[] = [
        {
            id: 1,
            title: 'Meeting Notes - Client ABC',
            preview: 'Discussed project timeline and deliverables...',
            project: 'Client ABC',
            isPinned: true,
            updatedAt: '2 hours ago',
        },
        {
            id: 2,
            title: 'Architecture decisions',
            preview: 'Decided to use React + Laravel for the frontend...',
            project: 'TableauDeBord',
            isPinned: false,
            updatedAt: 'Yesterday',
        },
        {
            id: 3,
            title: 'Weekly review template',
            preview: '## What went well\n## What could be improved...',
            isPinned: false,
            updatedAt: '3 days ago',
        },
    ];

    const filteredNotes = notes.filter(
        (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppShell title="Notes">
            <Head title="Notes" />

            <div className="flex h-[calc(100vh-8rem)] gap-4">
                {/* Notes List */}
                <div className="w-80 shrink-0 rounded-lg border border-border bg-card">
                    <div className="border-b border-border p-3">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search notes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>
                            <Button size="icon" className="shrink-0">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <ScrollArea className="h-[calc(100%-4rem)]">
                        <div className="p-2">
                            {filteredNotes.map((note) => (
                                <button
                                    key={note.id}
                                    onClick={() => setSelectedNote(note)}
                                    className={`mb-1 w-full rounded-lg p-3 text-left transition-colors ${
                                        selectedNote?.id === note.id
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-accent'
                                    }`}
                                >
                                    <div className="flex items-start gap-2">
                                        {note.isPinned && (
                                            <Pin className="mt-0.5 h-3 w-3 shrink-0" />
                                        )}
                                        <div className="flex-1 overflow-hidden">
                                            <p className="truncate font-medium">{note.title}</p>
                                            <p
                                                className={`mt-0.5 truncate text-xs ${
                                                    selectedNote?.id === note.id
                                                        ? 'text-primary-foreground/70'
                                                        : 'text-muted-foreground'
                                                }`}
                                            >
                                                {note.preview}
                                            </p>
                                            <div className="mt-1 flex items-center gap-2 text-xs">
                                                {note.project && (
                                                    <span className="flex items-center gap-1">
                                                        <FolderOpen className="h-3 w-3" />
                                                        {note.project}
                                                    </span>
                                                )}
                                                <span
                                                    className={
                                                        selectedNote?.id === note.id
                                                            ? 'text-primary-foreground/50'
                                                            : 'text-muted-foreground'
                                                    }
                                                >
                                                    {note.updatedAt}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Note Editor */}
                <Card className="flex-1">
                    {selectedNote ? (
                        <>
                            <CardHeader className="border-b border-border">
                                <CardTitle>{selectedNote.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <p>{selectedNote.preview}</p>
                                    <p className="text-muted-foreground">
                                        [Markdown editor will be implemented here]
                                    </p>
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                            <FileText className="mb-3 h-12 w-12" />
                            <p>Select a note or create a new one</p>
                        </div>
                    )}
                </Card>
            </div>
        </AppShell>
    );
}
