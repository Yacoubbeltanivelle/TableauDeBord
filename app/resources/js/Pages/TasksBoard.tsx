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
    Plus,
    Pencil,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";
import TaskModal from "@/Components/Modals/TaskModal";

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
    projects: { id: string; name: string }[];
}

const columnConfig = {
    TODO: { title: "À faire", color: "bg-muted" },
    IN_PROGRESS: { title: "En cours", color: "bg-blue-500" },
    BLOCKED: { title: "Bloqué", color: "bg-red-500" },
    DONE: { title: "Terminé", color: "bg-green-500" },
};

const priorityColors: Record<string, string> = {
    urgent: "border-l-red-500",
    high: "border-l-orange-500",
    medium: "border-l-yellow-500",
    low: "border-l-border",
};

export default function TasksBoard({
    columns,
    wipLimit,
    projects,
}: TasksBoardProps) {
    const [boardData, setBoardData] = useState(columns);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const { flash } = usePage().props as {
        flash?: { success?: string; error?: string };
    };

    // Sync local state with props when props change (server update)
    useEffect(() => {
        setBoardData(columns);
    }, [columns]);

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

    const handleDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const sourceColKey = source.droppableId as keyof typeof columns;
        const destColKey = destination.droppableId as keyof typeof columns;

        // Check WIP limit for IN_PROGRESS
        if (destColKey === "IN_PROGRESS" && sourceColKey !== "IN_PROGRESS") {
            if (boardData.IN_PROGRESS.length >= wipLimit) {
                setToast({
                    message: `Limite WIP atteinte ! Max ${wipLimit} tâches en cours.`,
                    type: "error",
                });
                return;
            }
        }

        // Optimistic Update
        const newSourceList = Array.from(boardData[sourceColKey]);
        const [movedTask] = newSourceList.splice(source.index, 1);
        const updatedTask = { ...movedTask, status: destColKey };

        let newBoardData = { ...boardData };

        if (sourceColKey === destColKey) {
            newSourceList.splice(destination.index, 0, movedTask);
            newBoardData[sourceColKey] = newSourceList;
        } else {
            const newDestList = Array.from(boardData[destColKey]);
            newDestList.splice(destination.index, 0, updatedTask);
            newBoardData[sourceColKey] = newSourceList;
            newBoardData[destColKey] = newDestList;
        }

        setBoardData(newBoardData);

        // Prepare items for API
        const itemsToUpdate: {
            id: string;
            position: number;
            status: string;
        }[] = [];

        // Helper to add column items
        const addColumnItems = (colKey: keyof typeof columns) => {
            newBoardData[colKey].forEach((task, index) => {
                itemsToUpdate.push({
                    id: task.id,
                    position: index,
                    status: colKey,
                });
            });
        };

        // Add items from source and dest columns
        addColumnItems(sourceColKey);
        if (sourceColKey !== destColKey) {
            addColumnItems(destColKey);
        }

        // Call API
        router.patch(
            "/api/tasks/reorder",
            { items: itemsToUpdate },
            {
                preserveScroll: true,
                onError: () => {
                    setToast({
                        message: "Erreur de sauvegarde",
                        type: "error",
                    });
                    setBoardData(columns); // Revert
                },
            },
        );
    };

    const moveTaskManual = (taskId: string, newStatus: string) => {
        const targetStatus = newStatus as keyof typeof columns;

        // Check WIP limit for IN_PROGRESS
        if (
            targetStatus === "IN_PROGRESS" &&
            boardData.IN_PROGRESS.length >= wipLimit
        ) {
            setToast({
                message: `Limite WIP atteinte ! Max ${wipLimit} tâches en cours.`,
                type: "error",
            });
            return;
        }

        router.patch(
            `/api/tasks/${taskId}/status`,
            { status: targetStatus },
            { preserveScroll: true },
        );
    };

    const handleCreateTask = () => {
        setEditingTask(null);
        setShowTaskModal(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setShowTaskModal(true);
    };

    const renderColumn = (status: keyof typeof columns) => {
        const tasks = boardData[status];
        const config = columnConfig[status];
        const isWipWarning =
            status === "IN_PROGRESS" && tasks.length >= wipLimit;

        return (
            <div className="flex-1 min-w-[280px] flex flex-col">
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

                <Droppable droppableId={status}>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`space-y-2 min-h-[150px] p-1 rounded-xl transition-colors ${
                                status === "IN_PROGRESS" && isWipWarning
                                    ? "bg-orange-500/5"
                                    : "bg-muted/30"
                            }`}
                        >
                            {tasks.map((task, index) => (
                                <Draggable
                                    key={task.id}
                                    draggableId={task.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Card
                                                className={`border-l-4 ${priorityColors[task.priority]} hover:shadow-md transition-shadow group`}
                                            >
                                                <CardContent className="p-3">
                                                    <div className="flex items-start gap-2">
                                                        <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0 cursor-grab active:cursor-grabbing" />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start">
                                                                <p className="font-medium text-sm truncate pr-2">
                                                                    {task.title}
                                                                </p>
                                                                <button
                                                                    onClick={() =>
                                                                        handleEditTask(
                                                                            task,
                                                                        )
                                                                    }
                                                                    className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity outline-none focus:ring-2 focus:ring-ring rounded-sm"
                                                                >
                                                                    <Pencil className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                            {task.project && (
                                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                                    <FolderKanban className="h-3 w-3" />
                                                                    {
                                                                        task
                                                                            .project
                                                                            .name
                                                                    }
                                                                </p>
                                                            )}
                                                            {task.due_date && (
                                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {new Date(
                                                                        task.due_date,
                                                                    ).toLocaleDateString(
                                                                        "fr-FR",
                                                                        {
                                                                            day: "numeric",
                                                                            month: "short",
                                                                        },
                                                                    )}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Quick move actions (fallback) */}
                                                    <div className="flex gap-1 mt-2">
                                                        {status !== "TODO" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 text-xs"
                                                                onClick={() =>
                                                                    moveTaskManual(
                                                                        task.id,
                                                                        "TODO",
                                                                    )
                                                                }
                                                            >
                                                                ← À faire
                                                            </Button>
                                                        )}
                                                        {status !==
                                                            "IN_PROGRESS" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 text-xs"
                                                                onClick={() =>
                                                                    moveTaskManual(
                                                                        task.id,
                                                                        "IN_PROGRESS",
                                                                    )
                                                                }
                                                            >
                                                                → En cours
                                                            </Button>
                                                        )}
                                                        {status !== "DONE" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 text-xs text-green-600 hover:text-green-700"
                                                                onClick={() =>
                                                                    moveTaskManual(
                                                                        task.id,
                                                                        "DONE",
                                                                    )
                                                                }
                                                            >
                                                                ✓ Terminé
                                                            </Button>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            {tasks.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground text-sm opacity-50">
                                    Déposez ici
                                </div>
                            )}
                        </div>
                    )}
                </Droppable>
            </div>
        );
    };

    return (
        <AppShell
            title="Tableau des tâches"
            actions={
                <Button onClick={handleCreateTask} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nouvelle tâche
                </Button>
            }
        >
            <Head title="Tableau des tâches" />

            {/* Toast Notification - Semantic Colors */}
            {toast && (
                <div
                    className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transition-all animate-in slide-in-from-top-2 ${
                        toast.type === "success"
                            ? "bg-background border border-green-500/50 text-green-600 dark:text-green-400"
                            : "bg-background border border-destructive/50 text-destructive"
                    }`}
                >
                    {toast.type === "success" ? (
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                    ) : (
                        <div className="h-2 w-2 rounded-full bg-destructive" />
                    )}
                    <span className="text-sm font-medium">{toast.message}</span>
                    <button
                        onClick={() => setToast(null)}
                        className="p-1 hover:bg-muted rounded-full transition-colors ml-2"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="overflow-x-auto pb-4">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="flex gap-4 min-w-[1200px] md:min-w-0">
                        {renderColumn("TODO")}
                        {renderColumn("IN_PROGRESS")}
                        {renderColumn("BLOCKED")}
                        {renderColumn("DONE")}
                    </div>
                </DragDropContext>
            </div>

            <TaskModal
                show={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                task={editingTask}
                projects={projects}
            />
        </AppShell>
    );
}
