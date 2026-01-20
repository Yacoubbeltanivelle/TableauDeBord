import { Head, router } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
    CheckCircle2,
    Circle,
    Sun,
    Calendar,
    FolderKanban,
} from "lucide-react";

interface Task {
    id: string;
    title: string;
    description: string | null;
    priority: "low" | "medium" | "high" | "urgent";
    status: string;
    completed: boolean;
    due_date: string | null;
    project: {
        id: string;
        name: string;
        color: string;
    } | null;
}

interface TodayProps {
    tasks: Task[];
    stats: {
        completed: number;
        total: number;
        progress: number;
    };
}

export default function Today({ tasks, stats }: TodayProps) {
    const toggleTask = (taskId: string, completed: boolean) => {
        router.patch(
            `/api/tasks/${taskId}/toggle`,
            {
                completed: !completed,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const priorityColors = {
        urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    };

    return (
        <AppShell title="Today">
            <Head title="Today" />

            <div className="space-y-6">
                {/* Progress Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Today's Progress
                        </CardTitle>
                        <Sun className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.progress}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.completed} of {stats.total} tasks completed
                        </p>
                        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${stats.progress}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Tasks List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Today's Tasks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {tasks.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Sun className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No tasks for today yet.</p>
                                <p className="text-sm">
                                    Add tasks from your inbox or projects.
                                </p>
                            </div>
                        ) : (
                            tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                                        task.completed
                                            ? "border-muted bg-muted/50"
                                            : "border-border hover:bg-accent/50"
                                    }`}
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 shrink-0"
                                        onClick={() =>
                                            toggleTask(task.id, task.completed)
                                        }
                                    >
                                        {task.completed ? (
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        ) : (
                                            <Circle className="h-5 w-5 text-muted-foreground" />
                                        )}
                                    </Button>

                                    <div className="flex-1 min-w-0">
                                        <span
                                            className={`block truncate ${
                                                task.completed
                                                    ? "text-muted-foreground line-through"
                                                    : "text-foreground"
                                            }`}
                                        >
                                            {task.title}
                                        </span>
                                        {task.project && (
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                                <FolderKanban className="h-3 w-3" />
                                                {task.project.name}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {task.due_date && (
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(
                                                    task.due_date,
                                                ).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "short",
                                                })}
                                            </span>
                                        )}
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}
                                        >
                                            {task.priority}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}

                        <Button variant="outline" className="w-full mt-4">
                            + Add to Today
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
