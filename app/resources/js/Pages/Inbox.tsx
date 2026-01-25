import { Head, router } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Inbox, Plus, Sun, Trash2, Clock } from "lucide-react";
import { FormEventHandler, useState } from "react";
import CreateTaskModal from "@/Components/CreateTaskModal";

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

interface Project {
    id: string;
    name: string;
}

interface InboxProps {
    inboxItems: InboxItem[];
    inboxTasks: InboxTask[];
    projects?: Project[];
}

export default function InboxPage({
    inboxItems,
    inboxTasks,
    projects = [],
}: InboxProps) {
    const [quickCapture, setQuickCapture] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [itemToConvert, setItemToConvert] = useState<InboxItem | null>(null);

    const handleQuickCapture: FormEventHandler = (e) => {
        e.preventDefault();
        if (!quickCapture.trim()) return;

        setIsSubmitting(true);
        router.post(
            "/api/inbox",
            { content: quickCapture },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setQuickCapture("");
                    setIsSubmitting(false);
                },
                onError: () => setIsSubmitting(false),
            },
        );
    };

    const moveToToday = (taskId: string) => {
        router.patch(
            `/api/tasks/${taskId}/today`,
            {},
            { preserveScroll: true },
        );
    };

    const deleteItem = (itemId: string) => {
        router.delete(`/api/inbox/${itemId}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteConfirmId(null),
        });
    };

    const openCreateTaskModal = (item?: InboxItem) => {
        setItemToConvert(item || null);
        setShowCreateModal(true);
    };

    const handleTaskCreated = () => {
        // If we were converting an item, delete it now
        if (itemToConvert) {
            deleteItem(itemToConvert.id);
        }
        setShowCreateModal(false);
        setItemToConvert(null);
    };

    const formatTimeAgo = (dateStr: string) => {
        // Handle already-formatted relative time strings
        if (dateStr.startsWith("Il y a") || dateStr.includes("ago")) {
            return dateStr;
        }

        const date = new Date(dateStr);

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return dateStr; // Return original if can't parse
        }

        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);

        if (diff < 1) return "À l'instant";
        if (diff < 60) return `Il y a ${diff} min`;
        if (diff < 1440) return `Il y a ${Math.floor(diff / 60)}h`;
        return `Il y a ${Math.floor(diff / 1440)}j`;
    };

    const totalItems = inboxItems.length + inboxTasks.length;

    return (
        <AppShell title="Boîte de réception">
            <Head title="Boîte de réception" />

            <div className="space-y-6">
                {/* Quick Capture */}
                <Card className="overflow-hidden">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Plus className="h-5 w-5 text-primary" />
                            Capture rapide
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
                                placeholder="Qu'avez-vous en tête ? Appuyez sur Entrée..."
                                className="flex-1 px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                            />
                            <Button
                                type="submit"
                                disabled={!quickCapture.trim() || isSubmitting}
                                className="px-6"
                            >
                                {isSubmitting ? "..." : "Capturer"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Inbox Items */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Inbox className="h-5 w-5" />
                            Éléments à traiter
                        </CardTitle>
                        {totalItems > 0 && (
                            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                {totalItems} élément{totalItems > 1 ? "s" : ""}
                            </span>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {totalItems === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Inbox className="h-16 w-16 mx-auto mb-4 opacity-30" />
                                <p className="text-lg font-medium">
                                    Boîte de réception vide !
                                </p>
                                <p className="text-sm mt-1">
                                    Capturez vos idées et tâches ci-dessus.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Raw inbox items (quick captures) */}
                                {inboxItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group flex items-center gap-3 rounded-xl border border-dashed border-border p-4 bg-muted/30 hover:bg-card hover:border-primary/30 transition-all"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground">
                                                {item.content}
                                            </p>
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                <Clock className="h-3 w-3" />
                                                {formatTimeAgo(item.created_at)}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-1"
                                                onClick={() =>
                                                    openCreateTaskModal(item)
                                                }
                                            >
                                                <Plus className="h-3 w-3" />
                                                Créer tâche
                                            </Button>
                                            {deleteConfirmId === item.id ? (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() =>
                                                            deleteItem(item.id)
                                                        }
                                                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                                    >
                                                        Oui
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setDeleteConfirmId(
                                                                null,
                                                            )
                                                        }
                                                        className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-muted"
                                                    >
                                                        Non
                                                    </button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() =>
                                                        setDeleteConfirmId(
                                                            item.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Tasks not in Today */}
                                {inboxTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="group flex items-center gap-3 rounded-xl border p-4 hover:shadow-sm hover:bg-accent transition-all"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-foreground">
                                                {task.title}
                                            </p>
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                <Clock className="h-3 w-3" />
                                                {formatTimeAgo(task.created_at)}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() =>
                                                    moveToToday(task.id)
                                                }
                                                className="gap-1"
                                            >
                                                <Sun className="h-3 w-3" />
                                                Aujourd'hui
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <CreateTaskModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                projects={projects}
                defaultTitle={itemToConvert?.content || ""}
                onSuccess={handleTaskCreated}
            />
        </AppShell>
    );
}
