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
    Check,
} from "lucide-react";

interface LandingProps {
    canLogin: boolean;
    canRegister: boolean;
}

export default function Landing({ canLogin, canRegister }: LandingProps) {
    return (
        <>
            <Head title="TableauDeBord - Pilote tes projets comme un RPG" />

            {/* Apple-style light gray background */}
            <div className="min-h-screen bg-background antialiased">
                {/* ===== HEADER - Sticky, minimal ===== */}
                <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
                    <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <LayoutDashboard
                                    className="w-4 h-4 text-white"
                                    strokeWidth={2}
                                />
                            </div>
                            <span className="text-[15px] font-semibold text-foreground">
                                TableauDeBord
                            </span>
                        </Link>

                        {/* Auth */}
                        <div className="flex items-center gap-3">
                            {canLogin && (
                                <Link
                                    href="/login"
                                    className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Se connecter
                                </Link>
                            )}
                            {canRegister && (
                                <Link
                                    href="/register"
                                    className="text-[13px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-2 rounded-full transition-all"
                                >
                                    Créer un compte
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                {/* ===== MAIN GRID ===== */}
                <main className="max-w-[1200px] mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* ===== ROW 1 ===== */}

                        {/* HERO Card - Large left */}
                        <div className="md:col-span-1 lg:col-span-2 lg:row-span-2 bg-card rounded-[28px] p-8 lg:p-10 shadow-sm border border-border flex flex-col justify-between min-h-[380px] lg:min-h-[480px]">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-full text-indigo-600 text-[11px] font-semibold uppercase tracking-wide mb-6">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Productivité gamifiée
                                </div>
                                <h1 className="text-[40px] lg:text-[56px] font-bold text-card-foreground leading-[1.05] tracking-[-0.02em] mb-5">
                                    Pilote tes
                                    <br />
                                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                                        projets
                                    </span>
                                </h1>
                                <p className="text-[17px] lg:text-[19px] text-muted-foreground leading-relaxed max-w-[380px]">
                                    Un tableau de bord personnel qui combine{" "}
                                    <span className="text-foreground font-medium">
                                        GTD
                                    </span>
                                    ,{" "}
                                    <span className="text-foreground font-medium">
                                        PARA
                                    </span>{" "}
                                    et gamification.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-6">
                                {canRegister && (
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-[15px] font-semibold rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/10"
                                    >
                                        Commencer gratuitement
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                )}
                                {canLogin && (
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center px-6 py-3 text-muted-foreground text-[15px] font-semibold rounded-full border-2 border-border hover:border-foreground/20 hover:bg-accent transition-all"
                                    >
                                        J'ai déjà un compte
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* TODAY Card - Right top */}
                        <div className="bg-card rounded-[28px] p-7 shadow-sm border border-border flex flex-col min-h-[230px]">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-5 shadow-lg shadow-orange-500/20">
                                <Zap
                                    className="w-5 h-5 text-white"
                                    strokeWidth={2}
                                />
                            </div>
                            <h3 className="text-[22px] font-bold text-card-foreground tracking-[-0.01em] mb-2">
                                Today
                            </h3>
                            <p className="text-[15px] text-muted-foreground leading-relaxed mb-auto">
                                Ta routine quotidienne gamifiée.
                            </p>
                            <div className="mt-6">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-[32px] font-bold text-foreground">
                                        73%
                                    </span>
                                    <span className="text-[13px] text-muted-foreground">
                                        complété
                                    </span>
                                </div>
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full w-[73%] bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* PROJECTS Card - Right bottom (part of row-span-2 group) */}
                        <div className="bg-card rounded-[28px] p-7 shadow-sm border border-border min-h-[230px]">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/20">
                                <FolderKanban
                                    className="w-5 h-5 text-white"
                                    strokeWidth={2}
                                />
                            </div>
                            <h3 className="text-[22px] font-bold text-card-foreground tracking-[-0.01em] mb-2">
                                Projects
                            </h3>
                            <p className="text-[15px] text-muted-foreground leading-relaxed">
                                Méthode PARA. Kanban intégré pour chaque projet.
                            </p>
                        </div>

                        {/* ===== ROW 2 ===== */}

                        {/* NOTES Card */}
                        <div className="bg-card rounded-[28px] p-7 shadow-sm border border-border min-h-[200px]">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/20">
                                <FileText
                                    className="w-5 h-5 text-white"
                                    strokeWidth={2}
                                />
                            </div>
                            <h3 className="text-[22px] font-bold text-card-foreground tracking-[-0.01em] mb-2">
                                Notes
                            </h3>
                            <p className="text-[15px] text-muted-foreground leading-relaxed">
                                Capture Markdown. Recherche instantanée.
                            </p>
                        </div>

                        {/* DARK STATS Card - Wide */}
                        <div className="md:col-span-2 bg-[#1d1d1f] text-white rounded-[28px] p-8 shadow-sm min-h-[140px]">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-[20px] font-bold mb-1">
                                        Tout en un seul endroit
                                    </h3>
                                    <p className="text-[14px] text-white/50">
                                        7 modules intégrés pour ta vie pro et
                                        perso
                                    </p>
                                </div>
                                <div className="flex gap-10">
                                    <div className="text-center">
                                        <div className="text-[28px] font-bold">
                                            ∞
                                        </div>
                                        <div className="text-[11px] text-white/50 uppercase tracking-wider">
                                            Projets
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[28px] font-bold">
                                            7
                                        </div>
                                        <div className="text-[11px] text-white/50 uppercase tracking-wider">
                                            Modules
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[28px] font-bold">
                                            100%
                                        </div>
                                        <div className="text-[11px] text-white/50 uppercase tracking-wider">
                                            Gratuit
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ===== ROW 3 ===== */}

                        {/* CALENDAR Card */}
                        <div className="bg-card rounded-[28px] p-7 shadow-sm border border-border min-h-[200px]">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-400 flex items-center justify-center mb-5 shadow-lg shadow-rose-500/20">
                                <Calendar
                                    className="w-5 h-5 text-white"
                                    strokeWidth={2}
                                />
                            </div>
                            <h3 className="text-[22px] font-bold text-card-foreground tracking-[-0.01em] mb-2">
                                Calendar
                            </h3>
                            <p className="text-[15px] text-muted-foreground leading-relaxed">
                                Vue mensuelle et hebdomadaire.
                            </p>
                        </div>

                        {/* BUSINESS Card - Tall */}
                        <div className="lg:row-span-2 bg-card rounded-[28px] p-7 shadow-sm border border-border flex flex-col min-h-[200px] lg:min-h-[420px]">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-5 shadow-lg shadow-violet-500/20">
                                <TrendingUp
                                    className="w-5 h-5 text-white"
                                    strokeWidth={2}
                                />
                            </div>
                            <h3 className="text-[22px] font-bold text-card-foreground tracking-[-0.01em] mb-2">
                                Business
                            </h3>
                            <p className="text-[15px] text-muted-foreground leading-relaxed mb-auto">
                                Tableau de bord micro-entreprise. Suivi clients
                                et KPIs.
                            </p>
                            <div className="mt-6 space-y-3 pt-6 border-t border-border">
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] text-muted-foreground">
                                        Revenus Q1
                                    </span>
                                    <span className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400">
                                        +24%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] text-muted-foreground">
                                        Clients actifs
                                    </span>
                                    <span className="text-[13px] font-semibold text-foreground">
                                        12
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] text-muted-foreground">
                                        Tâches complètes
                                    </span>
                                    <span className="text-[13px] font-semibold text-foreground">
                                        89%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* COACHING IA Card */}
                        <div className="bg-card rounded-[28px] p-7 shadow-sm border border-border min-h-[200px]">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/20">
                                <Sparkles
                                    className="w-5 h-5 text-white"
                                    strokeWidth={2}
                                />
                            </div>
                            <h3 className="text-[22px] font-bold text-card-foreground tracking-[-0.01em] mb-2">
                                Coaching IA
                            </h3>
                            <p className="text-[15px] text-muted-foreground leading-relaxed">
                                Assistant personnel. Conseils quotidiens.
                            </p>
                        </div>

                        {/* ===== ROW 4 - CTA ===== */}

                        {/* CTA GRADIENT Card */}
                        <div className="md:col-span-2 lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-[28px] p-8 min-h-[160px]">
                            {/* Decorative blurs */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

                            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                                <div>
                                    <h3 className="text-[22px] font-bold text-white mb-1">
                                        Prêt à commencer ?
                                    </h3>
                                    <p className="text-[15px] text-white/70">
                                        Rejoins les aventuriers productifs
                                    </p>
                                </div>
                                {canRegister && (
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 text-[15px] font-semibold rounded-full hover:shadow-xl transition-all"
                                    >
                                        Créer mon compte
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* TRUST Card */}
                        <div className="bg-card rounded-[28px] p-7 shadow-sm border border-border">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <Check
                                            className="w-3 h-3 text-emerald-600 dark:text-emerald-400"
                                            strokeWidth={3}
                                        />
                                    </div>
                                    <span className="text-[14px] text-muted-foreground">
                                        100% gratuit
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <Check
                                            className="w-3 h-3 text-emerald-600 dark:text-emerald-400"
                                            strokeWidth={3}
                                        />
                                    </div>
                                    <span className="text-[14px] text-muted-foreground">
                                        Aucune carte requise
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                        <Check
                                            className="w-3 h-3 text-emerald-600 dark:text-emerald-400"
                                            strokeWidth={3}
                                        />
                                    </div>
                                    <span className="text-[14px] text-muted-foreground">
                                        Données privées
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* ===== FOOTER ===== */}
                <footer className="max-w-[1200px] mx-auto px-6 py-8 border-t border-border">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <LayoutDashboard className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-[13px] text-muted-foreground">
                                © 2026 TableauDeBord
                            </span>
                        </div>
                        <div className="text-[13px] text-muted-foreground">
                            Fait par Yacoub.Nivelle avec ❤️ pour les
                            solopreneurs
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
