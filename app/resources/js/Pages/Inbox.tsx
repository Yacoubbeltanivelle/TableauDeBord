import { Head, router, useForm } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Inbox, Plus, Sun, Trash2, ArrowRight } from "lucide-react";
import { FormEventHandler, useState } from "react";

interface InboxItem {
    id: string;
    content: string;
    created_at: string;
}

interface InboxTask {
    id: string;
    title: string;
    priority: string;
    created_at: string;
}

interface InboxProps {
    inboxItems: InboxItem[];
    inboxTasks: InboxTask[];
}

export default function InboxPage({ inboxItems, inboxTasks }: InboxProps) {
    const [quickCapture, setQuickCapture] = useState("");

    const handleQuickCapture: FormEventHandler = (e) => {
        e.preventDefault();
        if (!quickCapture.trim()) return;

        router.post(
            "/api/inbox",
            {
                content: quickCapture,
            },
            {
                preserveScroll: true,
                onSuccess: () => setQuickCapture(""),
            },
        );
    };

    const moveToToday = (taskId: string) => {
        router.patch(
            `/api/tasks/${taskId}/today`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const deleteItem = (itemId: string) => {
        router.delete(`/api/inbox/${itemId}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppShell title="Inbox">
            <Head title="Inbox" />

            <div className="space-y-6">
                {/* Quick Capture */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            Quick Capture
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleQuickCapture}
                            className="flex gap-3"
                        >
                            <input
                                type="text"
                                value={quickCapture}
                                onChange={(e) =>
                                    setQuickCapture(e.target.value)
                                }
                                placeholder="What's on your mind? Press Enter to capture..."
                                className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <Button
                                type="submit"
                                disabled={!quickCapture.trim()}
                            >
                                Capture
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Inbox Items */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Inbox className="h-5 w-5" />
                            Inbox Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {inboxItems.length === 0 && inboxTasks.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Your inbox is empty!</p>
                                <p className="text-sm">
                                    Capture ideas and tasks above.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Raw inbox items (quick captures) */}
                                {inboxItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 rounded-lg border border-dashed p-3 bg-muted/30"
                                    >
                                        <div className="flex-1">
                                            <p className="text-sm">
                                                {item.content}
                                            </p>
                                            <span className="text-xs text-muted-foreground">
                                                {item.created_at}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">
                                                → Task
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={() =>
                                                    deleteItem(item.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {/* Tasks not in Today */}
                                {inboxTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                {task.title}
                                            </p>
                                            <span className="text-xs text-muted-foreground">
                                                {task.created_at}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    moveToToday(task.id)
                                                }
                                                className="gap-1"
                                            >
                                                <Sun className="h-3 w-3" />
                                                Today
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
