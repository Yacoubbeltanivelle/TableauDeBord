import { Head, router } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
    Calendar as CalendarIcon,
    Plus,
    MapPin,
    Clock,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState, useMemo } from "react";

interface Event {
    id: string;
    title: string;
    description: string | null;
    starts_at: string;
    ends_at: string | null;
    all_day: boolean;
    location: string | null;
    date: string;
}

interface CalendarProps {
    events: Event[];
    currentMonth: string;
}

export default function Calendar({ events, currentMonth }: CalendarProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Get current month info
    const [year, month] = currentMonth.split("-").map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    // Group events by date
    const eventsByDate = useMemo(() => {
        return events.reduce(
            (acc, event) => {
                if (!acc[event.date]) acc[event.date] = [];
                acc[event.date].push(event);
                return acc;
            },
            {} as Record<string, Event[]>,
        );
    }, [events]);

    const days = useMemo(() => {
        const result: (number | null)[] = [];
        // Add empty cells for days before first of month
        for (let i = 0; i < startDayOfWeek; i++) {
            result.push(null);
        }
        // Add days of month
        for (let i = 1; i <= daysInMonth; i++) {
            result.push(i);
        }
        return result;
    }, [daysInMonth, startDayOfWeek]);

    const monthName = firstDay.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
    });
    const today = new Date().toISOString().split("T")[0];

    const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

    return (
        <AppShell title="Calendar">
            <Head title="Calendar" />

            <div className="flex gap-6">
                {/* Calendar Grid */}
                <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="capitalize">
                            {monthName}
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Weekday headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {[
                                "Dim",
                                "Lun",
                                "Mar",
                                "Mer",
                                "Jeu",
                                "Ven",
                                "Sam",
                            ].map((day) => (
                                <div
                                    key={day}
                                    className="text-center text-xs font-medium text-muted-foreground py-2"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {days.map((day, idx) => {
                                if (day === null) {
                                    return <div key={idx} className="h-20" />;
                                }

                                const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                                const dayEvents = eventsByDate[dateStr] || [];
                                const isToday = dateStr === today;
                                const isSelected = dateStr === selectedDate;

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedDate(dateStr)}
                                        className={`h-20 p-1 rounded-lg border cursor-pointer transition-colors ${
                                            isSelected
                                                ? "border-primary bg-primary/5"
                                                : isToday
                                                  ? "border-primary/50 bg-primary/5"
                                                  : "border-transparent hover:bg-accent"
                                        }`}
                                    >
                                        <span
                                            className={`text-sm ${isToday ? "font-bold text-primary" : ""}`}
                                        >
                                            {day}
                                        </span>
                                        {dayEvents
                                            .slice(0, 2)
                                            .map((event, i) => (
                                                <div
                                                    key={event.id}
                                                    className="text-xs bg-primary/10 text-primary px-1 py-0.5 rounded truncate mt-0.5"
                                                >
                                                    {event.title}
                                                </div>
                                            ))}
                                        {dayEvents.length > 2 && (
                                            <div className="text-xs text-muted-foreground px-1">
                                                +{dayEvents.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Event Details Sidebar */}
                <Card className="w-80">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm">
                            {selectedDate
                                ? new Date(selectedDate).toLocaleDateString(
                                      "fr-FR",
                                      {
                                          weekday: "long",
                                          day: "numeric",
                                          month: "long",
                                      },
                                  )
                                : "Select a date"}
                        </CardTitle>
                        <Button size="icon" variant="outline">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {selectedEvents.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                No events
                            </div>
                        ) : (
                            selectedEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                                >
                                    <h4 className="font-medium text-sm">
                                        {event.title}
                                    </h4>
                                    {event.description && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {event.description}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {!event.all_day && (
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(
                                                    event.starts_at,
                                                ).toLocaleTimeString("fr-FR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        )}
                                        {event.location && (
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {event.location}
                                            </span>
                                        )}
                                        {event.all_day && (
                                            <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                                                All day
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
