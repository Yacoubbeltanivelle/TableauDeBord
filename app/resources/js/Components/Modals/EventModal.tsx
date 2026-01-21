import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import Checkbox from "@/Components/Checkbox";
import { useEffect } from "react";
import { X } from "lucide-react";

interface Event {
    id: string;
    title: string;
    description: string | null;
    starts_at: string;
    ends_at: string | null;
    all_day: boolean;
}

interface EventModalProps {
    show: boolean;
    onClose: () => void;
    event?: Event | null;
    selectedDate?: Date | null;
}

export default function EventModal({
    show,
    onClose,
    event,
    selectedDate,
}: EventModalProps) {
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
        description: "",
        start_at: "",
        end_at: "",
        all_day: false,
    });

    useEffect(() => {
        if (show) {
            if (event) {
                // Parse dates for input fields (YYYY-MM-DDTHH:MM)
                const formatForInput = (dateStr: string) => {
                    const date = new Date(dateStr);
                    // Adjust to local ISO string somewhat or just use slice if string is ISO
                    // Since backend sends ISO, new Date(ISO) works.
                    // toISOString() returns UTC. We need local time for input type="datetime-local".
                    // Hack: subtract timezone offset before toISOString
                    const offset = date.getTimezoneOffset() * 60000;
                    return new Date(date.getTime() - offset)
                        .toISOString()
                        .slice(0, 16);
                };

                setData({
                    title: event.title,
                    description: event.description || "",
                    start_at: formatForInput(event.starts_at),
                    end_at: event.ends_at
                        ? formatForInput(event.ends_at)
                        : formatForInput(event.starts_at),
                    all_day: event.all_day,
                });
            } else if (selectedDate) {
                // Pre-fill start/end with selected date
                const start = new Date(selectedDate);
                start.setHours(9, 0, 0, 0); // Default 9 AM
                const end = new Date(selectedDate);
                end.setHours(10, 0, 0, 0); // Default 1 hour duration

                // Adjust for timezone offset for local input
                const toLocalISO = (d: Date) => {
                    const offset = d.getTimezoneOffset() * 60000;
                    return new Date(d.getTime() - offset)
                        .toISOString()
                        .slice(0, 16);
                };

                setData({
                    title: "",
                    description: "",
                    start_at: toLocalISO(start),
                    end_at: toLocalISO(end),
                    all_day: false,
                });
            } else {
                reset();
            }
            clearErrors();
        }
    }, [show, event, selectedDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (event) {
            patch(route("api.events.update", event.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post(route("api.events.store"), {
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
                        {event ? "Modifier l'événement" : "Nouvel événement"}
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
                            placeholder="Titre de l'événement..."
                            className="mt-1"
                            autoFocus
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="start_at">Début</Label>
                            <Input
                                id="start_at"
                                type="datetime-local"
                                value={data.start_at}
                                onChange={(e) =>
                                    setData("start_at", e.target.value)
                                }
                                className="mt-1"
                            />
                            {errors.start_at && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.start_at}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="end_at">Fin</Label>
                            <Input
                                id="end_at"
                                type="datetime-local"
                                value={data.end_at}
                                onChange={(e) =>
                                    setData("end_at", e.target.value)
                                }
                                className="mt-1"
                            />
                            {errors.end_at && (
                                <p className="text-sm text-destructive mt-1">
                                    {errors.end_at}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox
                                checked={data.all_day}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => setData("all_day", e.target.checked)}
                            />
                            <span className="text-sm font-medium text-foreground">
                                Toute la journée
                            </span>
                        </label>
                    </div>

                    <div>
                        <Label htmlFor="description">
                            Description (Optionnel)
                        </Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                            placeholder="Détails de l'événement..."
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
                            {event ? "Enregistrer" : "Créer"}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
