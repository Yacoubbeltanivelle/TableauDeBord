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
    Target,
    Trophy,
    Quote,
    RotateCw,
} from "lucide-react";
import { useState, useEffect } from "react";

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
    focusTasks: Task[];
    completedToday: Task[];
    doneTodayCount: number;
    focusCount: number;
    progressPercent: number;
    countdown: {
        years: string;
        months: string;
        weeks: string;
        days: string;
        hours: string;
    };
    currentYear: number;
    yearlyCompletedCount: number;
    projects?: Project[];
}

export default function Today({
    focusTasks,
    completedToday,
    doneTodayCount,
    focusCount,
    progressPercent,
    countdown,
    currentYear,
    yearlyCompletedCount,
    projects = [],
}: TodayProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [hideCompleted, setHideCompleted] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [quote, setQuote] = useState<{
        text: string;
        author: string | null;
    } | null>(null);
    const [quoteLoading, setQuoteLoading] = useState(true);

    const refreshQuote = () => {
        setQuoteLoading(true);
        fetch("/api/motivation?refresh=true")
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) {
                    setQuote({ text: data.text, author: data.author });
                }
                setQuoteLoading(false);
            })
            .catch(() => setQuoteLoading(false));
    };

    // Auto-refresh countdown every hour
    useEffect(() => {
        const interval = setInterval(
            () => {
                router.reload({ only: ["countdown"], preserveScroll: true });
            },
            1000 * 60 * 60,
        ); // 1 hour

        return () => clearInterval(interval);
    }, []);

    // Fetch motivational quote on mount
    useEffect(() => {
        fetch("/api/motivation")
            .then((res) => res.json())
            .then((data) => {
                if (!data.error) {
                    setQuote({ text: data.text, author: data.author });
                }
                setQuoteLoading(false);
            })
            .catch(() => setQuoteLoading(false));
    }, []);

    const { data, setData, post, processing, reset, errors } = useForm({
        title: "",
        description: "",
        priority: "MEDIUM",
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
        urgent: "bg-red-100 text-red-800 border border-red-200",
        high: "bg-orange-100 text-orange-800 border border-orange-200",
        medium: "bg-amber-100 text-amber-800 border border-amber-200",
        low: "bg-secondary text-secondary-foreground border border-border",
    };

    // No longer need these since we have separate lists
    // filteredTasks and completedCount removed

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
                            {progressPercent}%
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {doneTodayCount} terminées aujourd'hui •{" "}
                            {focusCount} en cours
                        </p>
                        {/* Enhanced progress bar */}
                        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* 3 Motivational Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* B1: Countdown Card */}
                    <Card className="col-span-1 md:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Fin d'année
                            </CardTitle>
                            <Target className="h-5 w-5 text-blue-500" />
                        </CardHeader>
                        <CardContent className="flex justify-between items-center px-4 py-8">
                            {/* Countdown Items */}
                            {[
                                { label: "Mois", value: countdown.months },
                                { label: "Sem.", value: countdown.weeks },
                                { label: "Jours", value: countdown.days },
                                { label: "Heures", value: countdown.hours },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-sm">
                                        <span
                                            className={`font-bold text-zinc-900 dark:text-zinc-100 font-mono tracking-tighter ${
                                                String(item.value).length > 3
                                                    ? "text-lg md:text-xl"
                                                    : String(item.value)
                                                            .length > 2
                                                      ? "text-xl md:text-2xl"
                                                      : "text-2xl md:text-3xl"
                                            }`}
                                        >
                                            {item.value}
                                        </span>
                                    </div>
                                    <span className="text-[10px] md:text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* B2: Yearly Completed */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Cette année
                            </CardTitle>
                            <Trophy className="h-5 w-5 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">
                                {yearlyCompletedCount} tâches
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                terminées depuis le 1er janvier
                            </p>
                        </CardContent>
                    </Card>

                    {/* B3: Motivation Quote */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                Motivation
                                <button
                                    onClick={refreshQuote}
                                    className="text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                                    title="Nouvelle citation"
                                    disabled={quoteLoading}
                                >
                                    <RotateCw
                                        className={`h-3 w-3 ${quoteLoading ? "animate-spin" : ""}`}
                                    />
                                </button>
                            </CardTitle>
                            <Quote className="h-5 w-5 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            {quoteLoading ? (
                                <p className="text-sm text-muted-foreground italic">
                                    Chargement...
                                </p>
                            ) : quote ? (
                                <>
                                    <p className="text-sm text-foreground italic line-clamp-3">
                                        "{quote.text}"
                                    </p>
                                    {quote.author && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                            — {quote.author}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">
                                    Citation indisponible
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Focus Tasks List */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Tâches en cours (Focus)</CardTitle>
                        <div className="flex items-center gap-2">
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
                        {focusTasks.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Sun className="h-16 w-16 mx-auto mb-4 opacity-30" />
                                <p className="text-lg font-medium">
                                    Aucune tâche en cours
                                </p>
                                <p className="text-sm mt-1">
                                    Toutes vos tâches sont terminées ! 🎉
                                </p>
                            </div>
                        ) : (
                            focusTasks.map((task: Task) => (
                                <div
                                    key={task.id}
                                    className="group flex items-center gap-3 rounded-xl border p-4 transition-all duration-200 border-border bg-card hover:border-primary/30 hover:shadow-sm"
                                >
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className="shrink-0 focus:outline-none"
                                    >
                                        <Circle className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
                                    </button>
                                    <div
                                        className="flex-1 min-w-0 cursor-pointer"
                                        onClick={() => setEditingTask(task)}
                                    >
                                        <span className="block font-medium text-foreground">
                                            {task.title}
                                        </span>
                                        {task.project && (
                                            <Link
                                                href="/projects"
                                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-1"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <FolderKanban className="h-3 w-3" />
                                                {task.project.name}
                                            </Link>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
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
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Completed Today Section */}
                {completedToday.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                Terminées aujourd'hui ({doneTodayCount})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {completedToday.map((task: Task) => (
                                <div
                                    key={task.id}
                                    className="group flex items-center gap-3 rounded-xl border p-4 transition-all duration-200 border-border bg-muted/30 opacity-60"
                                >
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className="shrink-0 focus:outline-none"
                                    >
                                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <span className="block font-medium text-muted-foreground line-through">
                                            {task.title}
                                        </span>
                                        {task.project && (
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                <FolderKanban className="h-3 w-3" />
                                                {task.project.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Add Task Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setShowAddModal(false)}
                    />
                    <div className="relative bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-border">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">
                                Nouvelle tâche
                            </h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-accent rounded-full"
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

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    placeholder="Détails supplémentaires (optionnel)"
                                    rows={3}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>

                            <div>
                                <Label htmlFor="project_id">Projet</Label>
                                <select
                                    id="project_id"
                                    value={data.project_id}
                                    onChange={(e) =>
                                        setData("project_id", e.target.value)
                                    }
                                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                >
                                    <option value="">Aucun projet</option>
                                    {projects.map((project) => (
                                        <option
                                            key={project.id}
                                            value={project.id}
                                        >
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
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
                                        <option value="LOW">Basse</option>
                                        <option value="MEDIUM">Moyenne</option>
                                        <option value="HIGH">Haute</option>
                                        <option value="URGENT">Urgente</option>
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
                    <div className="relative bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">
                                Détails de la tâche
                            </h2>
                            <button
                                onClick={() => setEditingTask(null)}
                                className="p-2 hover:bg-accent rounded-full"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-muted-foreground">
                                    Titre
                                </Label>
                                <p className="font-medium text-lg">
                                    {editingTask.title}
                                </p>
                            </div>

                            {editingTask.description && (
                                <div>
                                    <Label className="text-muted-foreground">
                                        Description
                                    </Label>
                                    <p className="text-secondary-foreground">
                                        {editingTask.description}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">
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
                                    <Label className="text-muted-foreground">
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
                                    <Label className="text-muted-foreground">
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
                                    <Label className="text-muted-foreground">
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
