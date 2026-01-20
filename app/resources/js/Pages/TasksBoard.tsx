import { Head, router, usePage } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
    GripVertical,
    FolderKanban,
    Calendar,
    AlertCircle,
    X,
} from "lucide-react";
import { useState, useEffect } from "react";

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
    priority: string;
    due_date: string | null;
    is_today: boolean;
    project: {
        id: string;
        name: string;
        color: string;
    } | null;
}

interface TasksBoardProps {
    columns: {
        TODO: Task[];
        IN_PROGRESS: Task[];
        BLOCKED: Task[];
        DONE: Task[];
    };
    wipLimit: number;
}

const columnConfig = {
    TODO: { title: "À faire", color: "bg-gray-500" },
    IN_PROGRESS: { title: "En cours", color: "bg-blue-500" },
    BLOCKED: { title: "Bloqué", color: "bg-red-500" },
    DONE: { title: "Terminé", color: "bg-green-500" },
};

const priorityColors: Record<string, string> = {
    urgent: "border-l-red-500",
    high: "border-l-orange-500",
    medium: "border-l-yellow-500",
    low: "border-l-gray-300",
};

export default function TasksBoard({ columns, wipLimit }: TasksBoardProps) {
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);
    const { flash } = usePage().props as {
        flash?: { success?: string; error?: string };
    };

    // Show flash messages as toast
    useEffect(() => {
        if (flash?.success) {
            setToast({ message: flash.success, type: "success" });
        } else if (flash?.error) {
            setToast({ message: flash.error, type: "error" });
        }
    }, [flash]);

    // Auto-hide toast after 3 seconds
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const moveTask = (taskId: string, newStatus: string) => {
        // Check WIP limit for IN_PROGRESS
        if (
            newStatus === "IN_PROGRESS" &&
            columns.IN_PROGRESS.length >= wipLimit
        ) {
            setToast({
                message: `Limite WIP atteinte ! Max ${wipLimit} tâches en cours.`,
                type: "error",
            });
            return;
        }

        router.patch(
            `/api/tasks/${taskId}/status`,
            {
                status: newStatus,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const renderColumn = (status: keyof typeof columns) => {
        const tasks = columns[status];
        const config = columnConfig[status];
        const isWipWarning =
            status === "IN_PROGRESS" && tasks.length >= wipLimit;

        return (
            <div className="flex-1 min-w-[280px]">
                <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${config.color}`} />
                    <h3 className="font-semibold text-sm">{config.title}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {tasks.length}
                    </span>
                    {isWipWarning && (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    )}
                </div>

                <div className="space-y-2">
                    {tasks.map((task) => (
                        <Card
                            key={task.id}
                            className={`border-l-4 ${priorityColors[task.priority]} cursor-move hover:shadow-md transition-shadow`}
                        >
                            <CardContent className="p-3">
                                <div className="flex items-start gap-2">
                                    <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">
                                            {task.title}
                                        </p>
                                        {task.project && (
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                <FolderKanban className="h-3 w-3" />
                                                {task.project.name}
                                            </p>
                                        )}
                                        {task.due_date && (
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(
                                                    task.due_date,
                                                ).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "short",
                                                })}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Quick move actions */}
                                <div className="flex gap-1 mt-2">
                                    {status !== "TODO" && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 text-xs"
                                            onClick={() =>
                                                moveTask(task.id, "TODO")
                                            }
                                        >
                                            ← À faire
                                        </Button>
                                    )}
                                    {status !== "IN_PROGRESS" && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 text-xs"
                                            onClick={() =>
                                                moveTask(task.id, "IN_PROGRESS")
                                            }
                                        >
                                            → En cours
                                        </Button>
                                    )}
                                    {status !== "DONE" && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 text-xs text-green-600"
                                            onClick={() =>
                                                moveTask(task.id, "DONE")
                                            }
                                        >
                                            ✓ Terminé
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {tasks.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                            Aucune tâche
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <AppShell title="Tableau des tâches">
            <Head title="Tableau des tâches" />

            {/* Toast Notification */}
            {toast && (
                <div
                    className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transition-all ${
                        toast.type === "success"
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                >
                    <span className="text-sm font-medium">{toast.message}</span>
                    <button
                        onClick={() => setToast(null)}
                        className="p-1 hover:bg-black/10 rounded-full transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="flex gap-4 overflow-x-auto pb-4">
                {renderColumn("TODO")}
                {renderColumn("IN_PROGRESS")}
                {renderColumn("BLOCKED")}
                {renderColumn("DONE")}
            </div>
        </AppShell>
    );
}
