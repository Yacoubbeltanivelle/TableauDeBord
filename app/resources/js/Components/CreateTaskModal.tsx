import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { X } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

interface Project {
    id: string;
    name: string;
}

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    projects: Project[];
    defaultTitle?: string;
    onSuccess?: () => void;
}

export default function CreateTaskModal({
    isOpen,
    onClose,
    projects,
    defaultTitle = "",
    onSuccess,
}: CreateTaskModalProps) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: defaultTitle,
        description: "",
        priority: "MEDIUM",
        due_date: "",
        project_id: "",
        is_today: true,
    });

    // Update title if defaultTitle changes (e.g. when opening from different inbox items)
    useEffect(() => {
        if (isOpen) {
            setData("title", defaultTitle);
        }
    }, [defaultTitle, isOpen]);

    const submitNewTask = (e: React.FormEvent) => {
        e.preventDefault();
        post("/api/tasks", {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
                if (onSuccess) onSuccess();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-border">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Nouvelle tâche</h2>
                    <button
                        onClick={onClose}
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
                            onChange={(e) => setData("title", e.target.value)}
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
                                <option key={project.id} value={project.id}>
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
                            onClick={onClose}
                            className="flex-1"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !data.title}
                            className="flex-1"
                        >
                            {processing ? "Création..." : "Créer la tâche"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
