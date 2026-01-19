import { Head } from '@inertiajs/react';
import AppShell from '@/Layouts/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { CheckCircle2, Circle, Sun } from 'lucide-react';

export default function Today() {
    // Placeholder data - will be replaced with real data from backend
    const tasks = [
        { id: 1, title: 'Review pull request #42', priority: 'high', completed: false },
        { id: 2, title: 'Write SPEC documentation', priority: 'medium', completed: true },
        { id: 3, title: 'Update data model', priority: 'medium', completed: true },
        { id: 4, title: 'Deploy to staging', priority: 'low', completed: false },
    ];

    const completedCount = tasks.filter((t) => t.completed).length;
    const progressPercent = Math.round((completedCount / tasks.length) * 100);

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
                        <div className="text-2xl font-bold">{progressPercent}%</div>
                        <p className="text-xs text-muted-foreground">
                            {completedCount} of {tasks.length} tasks completed
                        </p>
                        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
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
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                                    task.completed
                                        ? 'border-muted bg-muted/50'
                                        : 'border-border hover:bg-accent/50'
                                }`}
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 shrink-0"
                                >
                                    {task.completed ? (
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                    ) : (
                                        <Circle className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </Button>
                                <span
                                    className={`flex-1 ${
                                        task.completed
                                            ? 'text-muted-foreground line-through'
                                            : 'text-foreground'
                                    }`}
                                >
                                    {task.title}
                                </span>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                        task.priority === 'high'
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            : task.priority === 'medium'
                                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                    }`}
                                >
                                    {task.priority}
                                </span>
                            </div>
                        ))}

                        <Button variant="outline" className="w-full mt-4">
                            + Add to Today
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
