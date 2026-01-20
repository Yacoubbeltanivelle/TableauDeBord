import { Head, router } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
    GripVertical,
    FolderKanban,
    Calendar,
    AlertCircle,
} from "lucide-react";

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
    TODO: { title: "To Do", color: "bg-gray-500" },
    IN_PROGRESS: { title: "In Progress", color: "bg-blue-500" },
    BLOCKED: { title: "Blocked", color: "bg-red-500" },
    DONE: { title: "Done", color: "bg-green-500" },
};

const priorityColors: Record<string, string> = {
    urgent: "border-l-red-500",
    high: "border-l-orange-500",
    medium: "border-l-yellow-500",
    low: "border-l-gray-300",
};

export default function TasksBoard({ columns, wipLimit }: TasksBoardProps) {
    const moveTask = (taskId: string, newStatus: string) => {
        // Check WIP limit for IN_PROGRESS
        if (
            newStatus === "IN_PROGRESS" &&
            columns.IN_PROGRESS.length >= wipLimit
        ) {
            alert(`WIP limit reached! Max ${wipLimit} tasks in progress.`);
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
                                            ← Todo
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
                                            → Doing
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
                                            ✓ Done
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {tasks.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                            No tasks
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <AppShell title="Tasks Board">
            <Head title="Tasks Board" />

            <div className="flex gap-4 overflow-x-auto pb-4">
                {renderColumn("TODO")}
                {renderColumn("IN_PROGRESS")}
                {renderColumn("BLOCKED")}
                {renderColumn("DONE")}
            </div>
        </AppShell>
    );
}
