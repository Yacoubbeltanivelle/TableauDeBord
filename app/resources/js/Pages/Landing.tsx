import { Head, Link } from "@inertiajs/react";
import {
    Calendar,
    CheckCircle2,
    FileText,
    FolderKanban,
    LayoutDashboard,
    Sparkles,
    TrendingUp,
    Zap,
    ArrowRight,
} from "lucide-react";

interface LandingProps {
    canLogin: boolean;
    canRegister: boolean;
}

// Grid Card Component - Apple Style
function GridCard({
    children,
    className = "",
    gradient,
    span = "normal",
}: {
    children: React.ReactNode;
    className?: string;
    gradient?: string;
    span?: "normal" | "tall" | "wide" | "hero";
}) {
    const spanClasses = {
        normal: "col-span-6 lg:col-span-4 row-span-1",
        tall: "col-span-6 lg:col-span-4 row-span-2",
        wide: "col-span-12 lg:col-span-8 row-span-1",
        hero: "col-span-12 lg:col-span-6 row-span-2",
    };

    return (
        <div
            className={`
            ${spanClasses[span]}
            relative overflow-hidden
            bg-white
            rounded-[2rem] lg:rounded-[2.5rem]
            p-8 lg:p-10
            border border-gray-100/80
            shadow-[0_2px_40px_-12px_rgba(0,0,0,0.08)]
            hover:shadow-[0_8px_50px_-12px_rgba(0,0,0,0.15)]
            transition-all duration-500 ease-out
            hover:scale-[1.01]
            group
            ${className}
        `}
        >
            {gradient && (
                <div
                    className={`absolute inset-0 opacity-[0.03] ${gradient}`}
                />
            )}
            <div className="relative z-10">{children}</div>
        </div>
    );
}

// Feature Icon Badge
function IconBadge({
    icon: Icon,
    gradient,
}: {
    icon: React.ElementType;
    gradient: string;
}) {
    return (
        <div
            className={`
            inline-flex items-center justify-center
            w-14 h-14 lg:w-16 lg:h-16
            rounded-2xl lg:rounded-[1.25rem]
            ${gradient}
            text-white
            shadow-lg shadow-black/10
            mb-6
            group-hover:scale-105 transition-transform duration-300
        `}
        >
            <Icon className="w-7 h-7 lg:w-8 lg:h-8" strokeWidth={1.5} />
        </div>
    );
}

// Pill Button
function PillButton({
    href,
    variant = "primary",
    children,
    icon: Icon,
}: {
    href: string;
    variant?: "primary" | "secondary";
    children: React.ReactNode;
    icon?: React.ElementType;
}) {
    const variants = {
        primary:
            "bg-gray-900 text-white hover:bg-gray-800 shadow-xl shadow-gray-900/20",
        secondary:
            "bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50",
    };

    return (
        <Link
            href={href}
            className={`
                inline-flex items-center justify-center gap-2
                px-7 py-4
                rounded-full
                font-semibold text-base
                transition-all duration-300
                hover:-translate-y-0.5
                ${variants[variant]}
            `}
        >
            {children}
            {Icon && <Icon className="w-5 h-5" />}
        </Link>
    );
}

export default function Landing({ canLogin, canRegister }: LandingProps) {
    return (
        <>
            <Head title="TableauDeBord - Pilote tes projets comme un RPG" />

            {/* Apple Light Gray Background */}
            <div className="min-h-screen bg-[#f5f5f7]">
                {/* Navigation - Floating Style */}
                <nav className="fixed top-0 left-0 right-0 z-50">
                    <div className="max-w-[1400px] mx-auto px-6 py-4">
                        <div className="flex items-center justify-between bg-white/70 backdrop-blur-2xl rounded-full px-6 py-3 border border-gray-200/50 shadow-lg shadow-black/5">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                    <LayoutDashboard
                                        className="w-5 h-5 text-white"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <span className="text-lg font-bold text-gray-900 hidden sm:block">
                                    TableauDeBord
                                </span>
                            </Link>

                            {/* Auth Buttons */}
                            <div className="flex items-center gap-2">
                                {canLogin && (
                                    <Link
                                        href="/login"
                                        className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-medium transition-colors rounded-full hover:bg-gray-100"
                                    >
                                        Se connecter
                                    </Link>
                                )}
                                {canRegister && (
                                    <Link
                                        href="/register"
                                        className="px-5 py-2.5 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20"
                                    >
                                        Créer un compte
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-28 pb-20">
                    {/* Hero Grid - Apple iPhone Style */}
                    <div className="grid grid-cols-12 gap-4 lg:gap-5">
                        {/* HERO Card - Main CTA */}
                        <GridCard
                            span="hero"
                            className="flex flex-col justify-between min-h-[400px] lg:min-h-[500px]"
                        >
                            <div>
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-sm font-medium mb-6">
                                    <Sparkles className="w-4 h-4" />
                                    Productivité gamifiée
                                </span>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6">
                                    Pilote tes
                                    <br />
                                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                                        projets
                                    </span>
                                </h1>
                                <p className="text-lg lg:text-xl text-gray-500 leading-relaxed max-w-md">
                                    Un tableau de bord personnel qui combine
                                    GTD, PARA et gamification.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-8">
                                {canRegister && (
                                    <PillButton
                                        href="/register"
                                        variant="primary"
                                        icon={ArrowRight}
                                    >
                                        Commencer gratuitement
                                    </PillButton>
                                )}
                                {canLogin && (
                                    <PillButton
                                        href="/login"
                                        variant="secondary"
                                    >
                                        J'ai déjà un compte
                                    </PillButton>
                                )}
                            </div>
                        </GridCard>

                        {/* Today Card - Tall */}
                        <GridCard
                            span="tall"
                            gradient="bg-gradient-to-br from-amber-400 to-orange-500"
                        >
                            <IconBadge
                                icon={Zap}
                                gradient="bg-gradient-to-br from-amber-400 to-orange-500"
                            />
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                                Today
                            </h3>
                            <p className="text-gray-500 text-base lg:text-lg leading-relaxed mb-6">
                                Ta routine quotidienne gamifiée. Visualise ta
                                progression en temps réel.
                            </p>
                            {/* Mini Progress Visual */}
                            <div className="mt-auto pt-8">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="text-4xl font-bold text-gray-900">
                                        73%
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        complété
                                    </div>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full w-[73%] bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
                                </div>
                            </div>
                        </GridCard>

                        {/* Projects Card - Normal */}
                        <GridCard
                            span="normal"
                            gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
                        >
                            <IconBadge
                                icon={FolderKanban}
                                gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
                            />
                            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                                Projects
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                Méthode PARA. Kanban intégré pour chaque projet.
                            </p>
                        </GridCard>

                        {/* Notes Card - Normal */}
                        <GridCard
                            span="normal"
                            gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
                        >
                            <IconBadge
                                icon={FileText}
                                gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
                            />
                            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                                Notes
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                Capture Markdown. Recherche instantanée.
                            </p>
                        </GridCard>

                        {/* Wide Stats Card */}
                        <GridCard
                            span="wide"
                            className="!bg-gray-900 text-white"
                        >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">
                                        Tout en un seul endroit
                                    </h3>
                                    <p className="text-gray-400">
                                        7 modules intégrés pour gérer ta vie pro
                                        et perso
                                    </p>
                                </div>
                                <div className="flex gap-8">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold">
                                            ∞
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                                            Projets
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold">
                                            7
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                                            Modules
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold">
                                            100%
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                                            Gratuit
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </GridCard>

                        {/* Calendar Card - Normal */}
                        <GridCard
                            span="normal"
                            gradient="bg-gradient-to-br from-rose-500 to-pink-500"
                        >
                            <IconBadge
                                icon={Calendar}
                                gradient="bg-gradient-to-br from-rose-500 to-pink-500"
                            />
                            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                                Calendar
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                Vue mensuelle et hebdomadaire. Sync tâches +
                                events.
                            </p>
                        </GridCard>

                        {/* Business Card - Tall */}
                        <GridCard
                            span="tall"
                            gradient="bg-gradient-to-br from-violet-500 to-purple-600"
                        >
                            <IconBadge
                                icon={TrendingUp}
                                gradient="bg-gradient-to-br from-violet-500 to-purple-600"
                            />
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                                Business
                            </h3>
                            <p className="text-gray-500 text-base lg:text-lg leading-relaxed mb-6">
                                Tableau de bord micro-entreprise. Suivi clients,
                                devis et KPIs.
                            </p>
                            {/* Mini KPI Visual */}
                            <div className="mt-auto pt-8 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">
                                        Revenus Q1
                                    </span>
                                    <span className="text-sm font-semibold text-emerald-600">
                                        +24%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">
                                        Clients actifs
                                    </span>
                                    <span className="text-sm font-semibold">
                                        12
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">
                                        Tâches complètes
                                    </span>
                                    <span className="text-sm font-semibold">
                                        89%
                                    </span>
                                </div>
                            </div>
                        </GridCard>

                        {/* Coaching IA Card - Normal */}
                        <GridCard
                            span="normal"
                            gradient="bg-gradient-to-br from-indigo-500 to-blue-600"
                        >
                            <IconBadge
                                icon={Sparkles}
                                gradient="bg-gradient-to-br from-indigo-500 to-blue-600"
                            />
                            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                                Coaching IA
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                Assistant personnel. Conseils et motivation
                                quotidienne.
                            </p>
                        </GridCard>

                        {/* CTA Card - Wide */}
                        <div className="col-span-12 lg:col-span-8">
                            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-[2rem] lg:rounded-[2.5rem] p-10 lg:p-12">
                                {/* Gradient Orbs */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                    <div>
                                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                                            Prêt à commencer ?
                                        </h3>
                                        <p className="text-white/70 text-lg">
                                            Rejoins les aventuriers productifs
                                        </p>
                                    </div>
                                    {canRegister && (
                                        <Link
                                            href="/register"
                                            className="inline-flex items-center gap-2 px-7 py-4 bg-white text-gray-900 rounded-full font-semibold hover:shadow-2xl transition-all hover:-translate-y-0.5"
                                        >
                                            Créer mon compte
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Trust Card - Small */}
                        <GridCard
                            span="normal"
                            className="flex flex-col justify-center"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span className="text-gray-600">
                                        100% gratuit
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span className="text-gray-600">
                                        Aucune carte requise
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span className="text-gray-600">
                                        Données privées
                                    </span>
                                </div>
                            </div>
                        </GridCard>
                    </div>
                </main>

                {/* Footer */}
                <footer className="max-w-[1400px] mx-auto px-6 py-8 border-t border-gray-200/50">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <LayoutDashboard className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-gray-500 text-sm">
                                © 2026 TableauDeBord
                            </span>
                        </div>
                        <div className="text-gray-400 text-sm">
                            Fait par Yacoub.Nivelle avec ❤️ pour les
                            solopreneurs
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
