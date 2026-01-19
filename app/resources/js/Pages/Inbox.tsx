import { Head } from '@inertiajs/react';
import AppShell from '@/Layouts/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { ArrowRight, FileText, Inbox as InboxIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface InboxItem {
    id: number;
    content: string;
    createdAt: string;
}

export default function Inbox() {
    const [inputValue, setInputValue] = useState('');
    
    // Placeholder data
    const items: InboxItem[] = [
        { id: 1, content: 'Idée: nouveau feature calendar sync', createdAt: '2 min ago' },
        { id: 2, content: 'Rappel: contacter client XYZ', createdAt: '1 hour ago' },
        { id: 3, content: 'Article à lire sur productivité', createdAt: '3 hours ago' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add to inbox via API
        setInputValue('');
    };

    return (
        <AppShell title="Inbox">
            <Head title="Inbox" />

            <div className="space-y-6">
                {/* Quick Capture */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <InboxIcon className="h-5 w-5" />
                            Quick Capture
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="What's on your mind? Press Enter to add..."
                                className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <Button type="submit" disabled={!inputValue.trim()}>
                                Add
                            </Button>
                        </form>
                        <p className="mt-2 text-xs text-muted-foreground">
                            💡 GTD Tip: If it takes less than 2 minutes, do it now!
                        </p>
                    </CardContent>
                </Card>

                {/* Inbox Items */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Inbox Items</CardTitle>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                            {items.length}
                        </span>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <InboxIcon className="mb-2 h-12 w-12 text-muted-foreground/50" />
                                <p className="text-muted-foreground">Inbox Zero! 🎉</p>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start gap-3 rounded-lg border border-border p-4"
                                >
                                    <div className="flex-1">
                                        <p className="text-foreground">{item.content}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {item.createdAt}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm" className="gap-1">
                                            <ArrowRight className="h-4 w-4" />
                                            Task
                                        </Button>
                                        <Button variant="ghost" size="sm" className="gap-1">
                                            <FileText className="h-4 w-4" />
                                            Note
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
