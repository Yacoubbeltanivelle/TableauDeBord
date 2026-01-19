import { Head } from '@inertiajs/react';
import AppShell from '@/Layouts/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Plus } from 'lucide-react';

interface Task {
    id: number;
    title: string;
    priority: 'low' | 'medium' | 'high';
    project?: string;
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

export default function TasksBoard() {
    // Placeholder data
    const columns: Column[] = [
        {
            id: 'todo',
            title: 'To Do',
            tasks: [
                { id: 1, title: 'Design new dashboard', priority: 'high', project: 'TableauDeBord' },
                { id: 2, title: 'Write API endpoints', priority: 'medium', project: 'TableauDeBord' },
                { id: 3, title: 'Setup CI/CD', priority: 'low' },
            ],
        },
        {
            id: 'in_progress',
            title: 'In Progress',
            tasks: [
                { id: 4, title: 'Implement auth flow', priority: 'high', project: 'TableauDeBord' },
                { id: 5, title: 'Database migrations', priority: 'medium' },
            ],
        },
        {
            id: 'blocked',
            title: 'Blocked',
            tasks: [
                { id: 6, title: 'Waiting for client feedback', priority: 'high', project: 'Client ABC' },
            ],
        },
        {
            id: 'done',
            title: 'Done',
            tasks: [
                { id: 7, title: 'Project setup', priority: 'low', project: 'TableauDeBord' },
                { id: 8, title: 'Documentation spec', priority: 'medium' },
            ],
        },
    ];

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-500';
            case 'medium':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-400';
        }
    };

    return (
        <AppShell title="Tasks Board">
            <Head title="Tasks Board" />

            <div className="flex gap-4 overflow-x-auto pb-4">
                {columns.map((column) => (
                    <div
                        key={column.id}
                        className="flex w-80 shrink-0 flex-col rounded-lg border border-border bg-muted/30"
                    >
                        {/* Column Header */}
                        <div className="flex items-center justify-between border-b border-border p-3">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">{column.title}</h3>
                                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                    {column.tasks.length}
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Tasks */}
                        <div className="flex flex-1 flex-col gap-2 p-2">
                            {column.tasks.map((task) => (
                                <Card
                                    key={task.id}
                                    className="cursor-grab border-border bg-card shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
                                >
                                    <CardContent className="p-3">
                                        <div className="flex items-start gap-2">
                                            <div
                                                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${getPriorityColor(task.priority)}`}
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-foreground">
                                                    {task.title}
                                                </p>
                                                {task.project && (
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        📁 {task.project}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {column.tasks.length === 0 && (
                                <div className="flex flex-1 items-center justify-center py-8 text-center text-sm text-muted-foreground">
                                    No tasks
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </AppShell>
    );
}
