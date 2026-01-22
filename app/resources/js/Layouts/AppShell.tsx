import { Link, usePage } from "@inertiajs/react";
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    FolderKanban,
    Inbox,
    LayoutDashboard,
    Moon,
    NotebookPen,
    PanelRight,
    Sun,
    TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Separator } from "@/Components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    routeName: string;
}

const navItems: NavItem[] = [
    { name: "Aujourd'hui", href: "/today", icon: Sun, routeName: "today" },
    {
        name: "Boîte de réception",
        href: "/inbox",
        icon: Inbox,
        routeName: "inbox",
    },
    {
        name: "Tableau des tâches",
        href: "/tasks",
        icon: LayoutDashboard,
        routeName: "tasks",
    },
    {
        name: "Projets",
        href: "/projects",
        icon: FolderKanban,
        routeName: "projects",
    },
    { name: "Notes", href: "/notes", icon: NotebookPen, routeName: "notes" },
    {
        name: "Calendrier",
        href: "/calendar",
        icon: CalendarDays,
        routeName: "calendar",
    },
    {
        name: "Activité",
        href: "/business",
        icon: TrendingUp,
        routeName: "business",
    },
];

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const { url } = usePage();

    return (
        <aside
            className={`fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300 ${
                collapsed ? "w-16" : "w-64"
            }`}
        >
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
                {!collapsed && (
                    <Link href="/today" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            🎯
                        </div>
                        <span className="font-bold text-foreground">
                            TableauDeBord
                        </span>
                    </Link>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggle}
                    className={collapsed ? "mx-auto" : ""}
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-4rem)]">
                <nav className="flex flex-col gap-1 p-2">
                    <TooltipProvider delayDuration={0}>
                        {navItems.map((item) => {
                            const isActive = url.startsWith(item.href);
                            const Icon = item.icon;

                            const linkContent = (
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    } ${collapsed ? "justify-center" : ""}`}
                                >
                                    <Icon className="h-5 w-5 shrink-0" />
                                    {!collapsed && <span>{item.name}</span>}
                                </Link>
                            );

                            if (collapsed) {
                                return (
                                    <Tooltip key={item.name}>
                                        <TooltipTrigger asChild>
                                            {linkContent}
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p>{item.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            }

                            return <div key={item.name}>{linkContent}</div>;
                        })}
                    </TooltipProvider>
                </nav>
            </ScrollArea>
        </aside>
    );
}

interface TopbarProps {
    sidebarCollapsed: boolean;
    rightPanelOpen: boolean;
    onToggleRightPanel: () => void;
    title?: string;
    actions?: React.ReactNode;
}

export function Topbar({
    sidebarCollapsed,
    rightPanelOpen,
    onToggleRightPanel,
    title,
    actions,
}: TopbarProps) {
    const user = usePage().props.auth.user;
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check localStorage and system preference on mount
        const stored = localStorage.getItem("theme");
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;
        const shouldBeDark = stored === "dark" || (!stored && prefersDark);

        setIsDark(shouldBeDark);
        document.documentElement.classList.toggle("dark", shouldBeDark);
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        document.documentElement.classList.toggle("dark", newIsDark);
        localStorage.setItem("theme", newIsDark ? "dark" : "light");
    };

    return (
        <header
            className={`fixed top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur transition-all duration-300 ${
                sidebarCollapsed ? "left-16" : "left-64"
            } ${rightPanelOpen ? "right-80" : "right-0"}`}
        >
            <div className="flex items-center gap-4">
                {title && (
                    <h1 className="text-xl font-semibold text-foreground">
                        {title}
                    </h1>
                )}
                {actions && (
                    <div className="ml-4 flex items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                            >
                                {isDark ? (
                                    <Sun className="h-5 w-5" />
                                ) : (
                                    <Moon className="h-5 w-5" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{isDark ? "Mode clair" : "Mode sombre"}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleRightPanel}
                >
                    <PanelRight className="h-5 w-5" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Link
                    href="/profile"
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="hidden sm:inline">
                        {user?.name || "User"}
                    </span>
                </Link>
            </div>
        </header>
    );
}

interface RightPanelProps {
    open: boolean;
}

export function RightPanel({ open }: RightPanelProps) {
    if (!open) return null;

    return (
        <aside className="fixed right-0 top-0 z-40 h-screen w-80 border-l border-border bg-card">
            <div className="flex h-16 items-center border-b border-border px-4">
                <h2 className="font-semibold text-foreground">Aperçu rapide</h2>
            </div>
            <ScrollArea className="h-[calc(100vh-4rem)] p-4">
                <div className="space-y-4">
                    <div className="rounded-lg border border-border bg-muted/50 p-4">
                        <h3 className="mb-2 text-sm font-medium text-foreground">
                            Focus du jour
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Aucune tâche. Ajoutez votre première !
                        </p>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/50 p-4">
                        <h3 className="mb-2 text-sm font-medium text-foreground">
                            À venir
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Rien de prévu cette semaine.
                        </p>
                    </div>
                </div>
            </ScrollArea>
        </aside>
    );
}

interface AppShellProps {
    children: React.ReactNode;
    title?: string;
    actions?: React.ReactNode;
}

export default function AppShell({ children, title, actions }: AppShellProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [rightPanelOpen, setRightPanelOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <Topbar
                sidebarCollapsed={sidebarCollapsed}
                rightPanelOpen={rightPanelOpen}
                onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
                title={title}
                actions={actions}
            />
            <RightPanel open={rightPanelOpen} />

            <main
                className={`pt-16 transition-all duration-300 ${
                    sidebarCollapsed ? "ml-16" : "ml-64"
                } ${rightPanelOpen ? "mr-80" : "mr-0"}`}
            >
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}
