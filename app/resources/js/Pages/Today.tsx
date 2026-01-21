import { Head, router, useForm, Link } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    CheckCircle2,
    Circle,
    Sun,
    Calendar,
    FolderKanban,
    Plus,
    X,
    Eye,
    EyeOff,
    Trash2,
} from "lucide-react";
import { useState } from "react";

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

interface Project {
    id: string;
    name: string;
}

interface TodayProps {
    tasks: Task[];
    stats: {
        completed: number;
        total: number;
        progress: number;
    };
    projects?: Project[];
}

export default function Today({ tasks, stats, projects = [] }: TodayProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [hideCompleted, setHideCompleted] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        title: "",
        priority: "medium",
        due_date: "",
        project_id: "",
        is_today: true,
    });

    const toggleTask = (taskId: string) => {
        router.patch(
            `/api/tasks/${taskId}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const deleteTask = (taskId: string) => {
        router.delete(`/api/tasks/${taskId}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteConfirmId(null),
        });
    };

    const submitNewTask = (e: React.FormEvent) => {
        e.preventDefault();
        post("/api/tasks", {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowAddModal(false);
            },
        });
    };

    const priorityColors = {
        urgent: "bg-red-100 text-red-700",
        high: "bg-orange-100 text-orange-700",
        medium: "bg-yellow-100 text-yellow-700",
        low: "bg-gray-100 text-gray-600",
    };

    const filteredTasks = hideCompleted
        ? tasks.filter((t) => !t.completed)
        : tasks;

    const completedCount = tasks.filter((t) => t.completed).length;

    return (
        <AppShell title="Aujourd'hui">
            <Head title="Aujourd'hui" />

            <div className="space-y-6">
                {/* Progress Card - Enhanced */}
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Progression du jour
                        </CardTitle>
                        <Sun className="h-5 w-5 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-primary">
                            {stats.progress}%
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {stats.completed} sur {stats.total} tâches terminées
                        </p>
                        {/* Enhanced progress bar */}
                        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700 ease-out"
                                style={{ width: `${stats.progress}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Tasks List */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Tâches du jour</CardTitle>
                        <div className="flex items-center gap-2">
                            {/* Hide completed toggle */}
                            {completedCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        setHideCompleted(!hideCompleted)
                                    }
                                    className="text-muted-foreground"
                                >
                                    {hideCompleted ? (
                                        <>
                                            <Eye className="h-4 w-4 mr-1" />
                                            Afficher terminées ({completedCount}
                                            )
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff className="h-4 w-4 mr-1" />
                                            Masquer terminées
                                        </>
                                    )}
                                </Button>
                            )}
                            {/* Add task button */}
                            <Button
                                size="sm"
                                onClick={() => setShowAddModal(true)}
                                className="bg-primary hover:bg-primary/90"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Nouvelle tâche
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {filteredTasks.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Sun className="h-16 w-16 mx-auto mb-4 opacity-30" />
                                <p className="text-lg font-medium">
                                    Aucune tâche pour aujourd'hui
                                </p>
                                <p className="text-sm mt-1">
                                    Cliquez sur "Nouvelle tâche" pour commencer
                                </p>
                            </div>
                        ) : (
                            filteredTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`group flex items-center gap-3 rounded-xl border p-4 transition-all duration-200 ${
                                        task.completed
                                            ? "border-gray-200 bg-gray-50/50"
                                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm hover:bg-white"
                                    }`}
                                >
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className="shrink-0 focus:outline-none"
                                    >
                                        {task.completed ? (
                                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                                        ) : (
                                            <Circle className="h-6 w-6 text-gray-300 hover:text-gray-400 transition-colors" />
                                        )}
                                    </button>

                                    {/* Task content - clickable */}
                                    <div
                                        className="flex-1 min-w-0 cursor-pointer"
                                        onClick={() => setEditingTask(task)}
                                    >
                                        <span
                                            className={`block font-medium ${
                                                task.completed
                                                    ? "text-gray-400 line-through"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            {task.title}
                                        </span>
                                        {task.project && (
                                            <Link
                                                href={`/projects`}
                                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-1"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <FolderKanban className="h-3 w-3" />
                                                {task.project.name}
                                            </Link>
                                        )}
                                    </div>

                                    {/* Right side - meta info */}
                                    <div className="flex items-center gap-3 shrink-0">
                                        {task.due_date && (
                                            <span className="flex items-center gap-1 text-xs text-gray-500">
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
                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityColors[task.priority]}`}
                                        >
                                            {task.priority === "urgent"
                                                ? "Urgent"
                                                : task.priority === "high"
                                                  ? "Haute"
                                                  : task.priority === "medium"
                                                    ? "Moyenne"
                                                    : "Basse"}
                                        </span>
                                        {/* Delete button with confirmation */}
                                        {deleteConfirmId === task.id ? (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() =>
                                                        deleteTask(task.id)
                                                    }
                                                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                                >
                                                    Oui
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setDeleteConfirmId(null)
                                                    }
                                                    className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors"
                                                >
                                                    Non
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteConfirmId(task.id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-400 hover:text-red-600" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Add Task Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setShowAddModal(false)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">
                                Nouvelle tâche
                            </h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={submitNewTask} className="space-y-4">
                            <div>
                                <Label htmlFor="title">Titre *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    placeholder="Que devez-vous faire ?"
                                    autoFocus
                                    required
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="priority">Priorité</Label>
                                    <select
                                        id="priority"
                                        value={data.priority}
                                        onChange={(e) =>
                                            setData("priority", e.target.value)
                                        }
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                    >
                                        <option value="low">Basse</option>
                                        <option value="medium">Moyenne</option>
                                        <option value="high">Haute</option>
                                        <option value="urgent">Urgente</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="due_date">Échéance</Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) =>
                                            setData("due_date", e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !data.title}
                                    className="flex-1"
                                >
                                    {processing
                                        ? "Création..."
                                        : "Créer la tâche"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Task Modal */}
            {editingTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setEditingTask(null)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">
                                Détails de la tâche
                            </h2>
                            <button
                                onClick={() => setEditingTask(null)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-gray-500">Titre</Label>
                                <p className="font-medium text-lg">
                                    {editingTask.title}
                                </p>
                            </div>

                            {editingTask.description && (
                                <div>
                                    <Label className="text-gray-500">
                                        Description
                                    </Label>
                                    <p className="text-gray-700">
                                        {editingTask.description}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-gray-500">
                                        Priorité
                                    </Label>
                                    <span
                                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${priorityColors[editingTask.priority]}`}
                                    >
                                        {editingTask.priority === "urgent"
                                            ? "Urgente"
                                            : editingTask.priority === "high"
                                              ? "Haute"
                                              : editingTask.priority ===
                                                  "medium"
                                                ? "Moyenne"
                                                : "Basse"}
                                    </span>
                                </div>
                                <div>
                                    <Label className="text-gray-500">
                                        Statut
                                    </Label>
                                    <p className="font-medium">
                                        {editingTask.completed
                                            ? "✅ Terminée"
                                            : "⏳ En cours"}
                                    </p>
                                </div>
                            </div>

                            {editingTask.project && (
                                <div>
                                    <Label className="text-gray-500">
                                        Projet
                                    </Label>
                                    <p className="flex items-center gap-1">
                                        <FolderKanban className="h-4 w-4" />
                                        {editingTask.project.name}
                                    </p>
                                </div>
                            )}

                            {editingTask.due_date && (
                                <div>
                                    <Label className="text-gray-500">
                                        Échéance
                                    </Label>
                                    <p className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(
                                            editingTask.due_date,
                                        ).toLocaleDateString("fr-FR", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                        })}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        toggleTask(editingTask.id);
                                        setEditingTask(null);
                                    }}
                                    className="flex-1"
                                >
                                    {editingTask.completed
                                        ? "Marquer non terminée"
                                        : "Marquer terminée"}
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        deleteTask(editingTask.id);
                                        setEditingTask(null);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppShell>
    );
}
