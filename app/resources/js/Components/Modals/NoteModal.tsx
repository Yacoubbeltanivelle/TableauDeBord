import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import Checkbox from "@/Components/Checkbox";
import { useEffect } from "react";
import { X } from "lucide-react";

interface Note {
    id: string;
    title: string;
    content: string;
    is_pinned: boolean;
    project?: { id: string } | null;
}

interface Project {
    id: string;
    name: string;
}

interface NoteModalProps {
    show: boolean;
    onClose: () => void;
    note?: Note | null;
    projects: Project[]; // Assuming we pass projects for linking
}

export default function NoteModal({
    show,
    onClose,
    note,
    projects,
}: NoteModalProps) {
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
        title: "",
        content: "",
        is_pinned: false,
        project_id: "",
    });

    useEffect(() => {
        if (show) {
            if (note) {
                setData({
                    title: note.title,
                    content: note.content || "",
                    is_pinned: note.is_pinned,
                    project_id: note.project?.id || "",
                });
            } else {
                reset();
            }
            clearErrors();
        }
    }, [show, note]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (note) {
            patch(route("api.notes.update", note.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route("api.notes.store"), {
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
                        {note ? "Modifier la note" : "Nouvelle note"}
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
                        <Label htmlFor="title">Titre</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            placeholder="Titre de la note..."
                            className="mt-1"
                            autoFocus
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="project">
                            Lié au projet (Optionnel)
                        </Label>
                        <select
                            id="project"
                            value={data.project_id}
                            onChange={(e) =>
                                setData("project_id", e.target.value)
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                        >
                            <option value="">Aucun projet</option>
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="content">Contenu</Label>
                        {/* Simple textarea for now, ideally a rich text editor later */}
                        <textarea
                            id="content"
                            value={data.content}
                            onChange={(e) => setData("content", e.target.value)}
                            className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                            placeholder="Écrivez votre note ici..."
                        />
                        {errors.content && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.content}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox
                                checked={data.is_pinned}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => setData("is_pinned", e.target.checked)}
                            />
                            <span className="text-sm font-medium text-foreground">
                                Épingler cette note
                            </span>
                        </label>
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
                            {note ? "Enregistrer" : "Créer"}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
