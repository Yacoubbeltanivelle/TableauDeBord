import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useEffect } from "react";
import { X } from "lucide-react";

interface Project {
    id: string;
    name: string;
    description: string | null;
    category: "PROJECT" | "AREA" | "RESOURCE" | "ARCHIVE";
    status: string;
    color: string;
    icon: string;
}

interface ProjectModalProps {
    show: boolean;
    onClose: () => void;
    project?: Project | null;
}

export default function ProjectModal({
    show,
    onClose,
    project,
}: ProjectModalProps) {
    const {
        data,
        setData,
        post,
        patch,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        name: "",
        description: "",
        category: "PROJECT",
        color: "#3b82f6", // Default blue
        icon: "Folder",
    });

    useEffect(() => {
        if (show) {
            if (project) {
                setData({
                    name: project.name,
                    description: project.description || "",
                    category: project.category,
                    color: project.color,
                    icon: project.icon,
                });
            } else {
                reset();
                setData("category", "PROJECT");
            }
            clearErrors();
        }
    }, [show, project]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (project) {
            // We need a route for updating projects. Checks web.php...
            // We have api.projects.store (POST) and api.projects.destroy (DELETE).
            // Missing UPDATE.
            // For now, I'll comment this out or use a placeholder.
            // patch(route("api.projects.update", project.id), { ... });
            console.warn("Update project endpoint not implemented yet");
            onClose();
        } else {
            post(route("api.projects.store"), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-foreground">
                        {project ? "Modifier le projet" : "Nouveau projet"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nom</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Nom du projet..."
                            className="mt-1"
                            autoFocus
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="category">Catégorie (PARA)</Label>
                        <select
                            id="category"
                            value={data.category}
                            onChange={(e) =>
                                setData("category", e.target.value)
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                        >
                            <option value="PROJECT">
                                Projet (But court terme)
                            </option>
                            <option value="AREA">
                                Domaine (Responsabilité continue)
                            </option>
                            <option value="RESOURCE">
                                Ressource (Intérêt/Documentation)
                            </option>
                            <option value="ARCHIVE">
                                Archive (Terminé/Inactif)
                            </option>
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                            placeholder="Détails du projet..."
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {project ? "Enregistrer" : "Créer"}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
