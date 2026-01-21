import { Head, router } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { FolderKanban, Plus, Grid3X3, List, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import ProjectModal from "@/Components/Modals/ProjectModal";

interface Project {
    id: string;
    name: string;
    description: string | null;
    category: "PROJECT" | "AREA" | "RESOURCE" | "ARCHIVE";
    status: string;
    color: string;
    icon: string | null;
    tasks_count: number;
    completed_tasks_count: number;
    progress: number;
}

interface ProjectsProps {
    projects: Project[];
}

const categoryLabels = {
    PROJECT: "Projets",
    AREA: "Domaines",
    RESOURCE: "Ressources",
    ARCHIVE: "Archives",
};

const categoryColors = {
    PROJECT: "bg-blue-500",
    AREA: "bg-green-500",
    RESOURCE: "bg-purple-500",
    ARCHIVE: "bg-muted",
};

export default function Projects({ projects }: ProjectsProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [filter, setFilter] = useState<string>("all");
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const handleCreate = () => {
        setEditingProject(null);
        setShowModal(true);
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setShowModal(true);
    };

    const filteredProjects =
        filter === "all"
            ? projects
            : projects.filter((p) => p.category === filter);

    const groupedProjects = filteredProjects.reduce(
        (acc, project) => {
            if (!acc[project.category]) acc[project.category] = [];
            acc[project.category].push(project);
            return acc;
        },
        {} as Record<string, Project[]>,
    );

    return (
        <AppShell title="Projects">
            <Head title="Projects" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {["all", "PROJECT", "AREA", "RESOURCE", "ARCHIVE"].map(
                            (cat) => (
                                <Button
                                    key={cat}
                                    variant={
                                        filter === cat ? "default" : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setFilter(cat)}
                                >
                                    {cat === "all"
                                        ? "Tous"
                                        : categoryLabels[
                                              cat as keyof typeof categoryLabels
                                          ]}
                                </Button>
                            ),
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewMode("grid")}
                            className={viewMode === "grid" ? "bg-accent" : ""}
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewMode("list")}
                            className={viewMode === "list" ? "bg-accent" : ""}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button className="gap-2" onClick={handleCreate}>
                            <Plus className="h-4 w-4" />
                            Nouveau projet
                        </Button>
                    </div>
                </div>

                {/* Projects Grid/List */}
                {Object.entries(groupedProjects).map(
                    ([category, categoryProjects]) => (
                        <div key={category}>
                            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <div
                                    className={`w-2 h-2 rounded-full ${categoryColors[category as keyof typeof categoryColors]}`}
                                />
                                {
                                    categoryLabels[
                                        category as keyof typeof categoryLabels
                                    ]
                                }
                                <span className="text-sm text-muted-foreground font-normal">
                                    ({categoryProjects.length})
                                </span>
                            </h2>

                            <div
                                className={
                                    viewMode === "grid"
                                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                        : "space-y-2"
                                }
                            >
                                {categoryProjects.map((project) => (
                                    <Card
                                        key={project.id}
                                        className="hover:shadow-md transition-shadow cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        onClick={() => handleEdit(project)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === " "
                                            ) {
                                                e.preventDefault();
                                                handleEdit(project);
                                            }
                                        }}
                                        style={{
                                            borderLeftColor: project.color,
                                            borderLeftWidth: "4px",
                                        }}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">
                                                        {project.icon || "📁"}
                                                    </span>
                                                    <div>
                                                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                                                            {project.name}
                                                        </h3>
                                                        {project.description && (
                                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                                {
                                                                    project.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground flex items-center gap-1">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    {
                                                        project.completed_tasks_count
                                                    }
                                                    /{project.tasks_count}{" "}
                                                    tâches
                                                </span>
                                                <span className="font-medium">
                                                    {project.progress}%
                                                </span>
                                            </div>

                                            <div className="mt-2 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all"
                                                    style={{
                                                        width: `${project.progress}%`,
                                                    }}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ),
                )}

                {filteredProjects.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                        <FolderKanban className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucun projet trouvé.</p>
                    </div>
                )}
            </div>

            <ProjectModal
                show={showModal}
                onClose={() => setShowModal(false)}
                project={
                    editingProject
                        ? { ...editingProject, icon: editingProject.icon || "" }
                        : null
                }
            />
        </AppShell>
    );
}
