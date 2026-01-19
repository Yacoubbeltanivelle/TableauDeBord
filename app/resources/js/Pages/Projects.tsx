import { Head } from '@inertiajs/react';
import AppShell from '@/Layouts/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { FolderKanban, Grid3X3, List, Plus } from 'lucide-react';
import { useState } from 'react';

interface Project {
    id: number;
    name: string;
    category: 'PROJECT' | 'AREA' | 'RESOURCE' | 'ARCHIVE';
    color: string;
    tasksCompleted: number;
    tasksTotal: number;
    status: 'active' | 'on_hold' | 'completed';
}

export default function Projects() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [activeCategory, setActiveCategory] = useState<string>('all');

    // Placeholder data
    const projects: Project[] = [
        { id: 1, name: 'TableauDeBord', category: 'PROJECT', color: '#10B981', tasksCompleted: 8, tasksTotal: 10, status: 'active' },
        { id: 2, name: 'Client ABC', category: 'PROJECT', color: '#6366F1', tasksCompleted: 6, tasksTotal: 10, status: 'active' },
        { id: 3, name: 'Marketing', category: 'AREA', color: '#8B5CF6', tasksCompleted: 0, tasksTotal: 0, status: 'active' },
        { id: 4, name: 'Learning', category: 'RESOURCE', color: '#F59E0B', tasksCompleted: 0, tasksTotal: 0, status: 'active' },
    ];

    const categories = [
        { id: 'all', label: 'All' },
        { id: 'PROJECT', label: 'Projects' },
        { id: 'AREA', label: 'Areas' },
        { id: 'RESOURCE', label: 'Resources' },
        { id: 'ARCHIVE', label: 'Archives' },
    ];

    const filteredProjects = activeCategory === 'all' 
        ? projects 
        : projects.filter(p => p.category === activeCategory);

    return (
        <AppShell title="Projects">
            <Head title="Projects" />

            <div className="space-y-6">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-2">
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={activeCategory === cat.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.label}
                            </Button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex rounded-lg border border-border">
                            <Button
                                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                size="icon"
                                className="rounded-r-none"
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                size="icon"
                                className="rounded-l-none"
                                onClick={() => setViewMode('list')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Project
                        </Button>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className={viewMode === 'grid' 
                    ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'space-y-3'
                }>
                    {filteredProjects.map((project) => (
                        <Card 
                            key={project.id} 
                            className="cursor-pointer transition-shadow hover:shadow-md"
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="flex h-10 w-10 items-center justify-center rounded-lg"
                                            style={{ backgroundColor: `${project.color}20` }}
                                        >
                                            <FolderKanban
                                                className="h-5 w-5"
                                                style={{ color: project.color }}
                                            />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{project.name}</CardTitle>
                                            <p className="text-xs text-muted-foreground">
                                                {project.category}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {project.tasksTotal > 0 ? (
                                    <>
                                        <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                                            <div
                                                className="h-full transition-all duration-500"
                                                style={{
                                                    width: `${(project.tasksCompleted / project.tasksTotal) * 100}%`,
                                                    backgroundColor: project.color,
                                                }}
                                            />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {project.tasksCompleted}/{project.tasksTotal} tasks
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        {project.category === 'AREA' ? 'Ongoing' : 'Reference'}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}
