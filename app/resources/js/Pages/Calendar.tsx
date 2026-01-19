import { Head } from '@inertiajs/react';
import AppShell from '@/Layouts/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'week' | 'day'>('month');

    // Placeholder events
    const events = [
        { id: 1, date: '2026-01-19', title: 'Team standup', color: '#6366F1' },
        { id: 2, date: '2026-01-19', title: 'Client call', color: '#EF4444' },
        { id: 3, date: '2026-01-22', title: 'Sprint review', color: '#10B981' },
        { id: 4, date: '2026-01-25', title: 'Deadline: MVP', color: '#F59E0B' },
    ];

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days = [];
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }
        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const days = getDaysInMonth(currentDate);
    const today = new Date();

    const goToPrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const formatDateString = (day: number) => {
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        return `${currentDate.getFullYear()}-${month}-${dayStr}`;
    };

    const getEventsForDay = (day: number) => {
        const dateStr = formatDateString(day);
        return events.filter((e) => e.date === dateStr);
    };

    const isToday = (day: number) => {
        return (
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        );
    };

    return (
        <AppShell title="Calendar">
            <Head title="Calendar" />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={goToPrevMonth}>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <CardTitle>
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex rounded-lg border border-border">
                            {(['month', 'week', 'day'] as const).map((v) => (
                                <Button
                                    key={v}
                                    variant={view === v ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className="capitalize"
                                    onClick={() => setView(v)}
                                >
                                    {v[0].toUpperCase()}
                                </Button>
                            ))}
                        </div>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Event
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Days of week header */}
                    <div className="mb-2 grid grid-cols-7 gap-1">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div
                                key={day}
                                className="py-2 text-center text-sm font-medium text-muted-foreground"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, index) => (
                            <div
                                key={index}
                                className={`min-h-24 rounded-lg border p-2 ${
                                    day === null
                                        ? 'border-transparent bg-transparent'
                                        : isToday(day)
                                          ? 'border-primary bg-primary/5'
                                          : 'border-border hover:bg-accent/50'
                                }`}
                            >
                                {day !== null && (
                                    <>
                                        <span
                                            className={`text-sm font-medium ${
                                                isToday(day)
                                                    ? 'flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground'
                                                    : 'text-foreground'
                                            }`}
                                        >
                                            {day}
                                        </span>
                                        <div className="mt-1 space-y-1">
                                            {getEventsForDay(day).map((event) => (
                                                <div
                                                    key={event.id}
                                                    className="truncate rounded px-1.5 py-0.5 text-xs text-white"
                                                    style={{ backgroundColor: event.color }}
                                                >
                                                    {event.title}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </AppShell>
    );
}
