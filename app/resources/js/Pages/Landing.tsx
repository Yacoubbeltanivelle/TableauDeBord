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
} from "lucide-react";

interface LandingProps {
    canLogin: boolean;
    canRegister: boolean;
}

// Feature Card Component
function FeatureCard({
    icon: Icon,
    title,
    description,
    gradient,
    size = "normal",
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    gradient: string;
    size?: "normal" | "large" | "wide";
}) {
    const sizeClasses = {
        normal: "col-span-1 row-span-1",
        large: "col-span-1 row-span-2 md:col-span-1",
        wide: "col-span-1 md:col-span-2 row-span-1",
    };

    return (
        <div
            className={`
            ${sizeClasses[size]}
            group relative overflow-hidden
            bg-white rounded-3xl p-8
            border border-gray-100
            shadow-sm hover:shadow-xl
            transition-all duration-500 ease-out
            hover:-translate-y-1
        `}
        >
            {/* Gradient Background on Hover */}
            <div
                className={`
                absolute inset-0 opacity-0 group-hover:opacity-5
                transition-opacity duration-500
                ${gradient}
            `}
            />

            {/* Icon */}
            <div
                className={`
                inline-flex items-center justify-center
                w-14 h-14 rounded-2xl mb-6
                ${gradient} text-white
                shadow-lg
                group-hover:scale-110 transition-transform duration-300
            `}
            >
                <Icon className="w-7 h-7" />
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
}

// Stats Card Component
function StatCard({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {value}
            </div>
            <div className="text-gray-500 mt-2 text-sm uppercase tracking-wide">
                {label}
            </div>
        </div>
    );
}

export default function Landing({ canLogin, canRegister }: LandingProps) {
    return (
        <>
            <Head title="TableauDeBord - Pilote tes projets comme un RPG" />

            <div className="min-h-screen bg-gray-50">
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                    <LayoutDashboard className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-gray-900">
                                    TableauDeBord
                                </span>
                            </div>

                            {/* Auth Buttons */}
                            <div className="flex items-center gap-3">
                                {canLogin && (
                                    <Link
                                        href="/login"
                                        className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                                    >
                                        Se connecter
                                    </Link>
                                )}
                                {canRegister && (
                                    <Link
                                        href="/register"
                                        className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg"
                                    >
                                        Créer un compte
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-700 text-sm font-medium mb-8">
                            <Sparkles className="w-4 h-4" />
                            <span>
                                Productivité personnelle nouvelle génération
                            </span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            Pilote tes projets
                            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                comme un RPG
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Un tableau de bord personnel qui combine{" "}
                            <strong>GTD</strong>, <strong>PARA</strong> et
                            gamification pour transformer ta productivité en
                            aventure quotidienne.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {canRegister && (
                                <Link
                                    href="/register"
                                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
                                >
                                    Commencer gratuitement
                                </Link>
                            )}
                            {canLogin && (
                                <Link
                                    href="/login"
                                    className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
                                >
                                    J'ai déjà un compte
                                </Link>
                            )}
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-12 flex items-center justify-center gap-8 text-gray-400 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>100% gratuit</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Aucune carte requise</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span>Données privées</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Tout ce dont tu as besoin
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Un écosystème complet pour gérer ta vie
                                personnelle et professionnelle
                            </p>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FeatureCard
                                icon={Zap}
                                title="Today"
                                description="Ta routine quotidienne gamifiée. Visualise tes tâches du jour, ta progression et tes habitudes en un coup d'œil."
                                gradient="bg-gradient-to-br from-amber-400 to-orange-500"
                                size="normal"
                            />

                            <FeatureCard
                                icon={FolderKanban}
                                title="Projects"
                                description="Organise tes projets avec la méthode PARA. Kanban, backlog et suivi de progression intégrés."
                                gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
                                size="normal"
                            />

                            <FeatureCard
                                icon={FileText}
                                title="Notes"
                                description="Capture tes idées instantanément. Markdown, tags et recherche full-text pour retrouver tout en un clic."
                                gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
                                size="normal"
                            />

                            <FeatureCard
                                icon={Calendar}
                                title="Calendar"
                                description="Vue mensuelle, hebdomadaire et quotidienne. Synchronise tes événements avec tes tâches et deadlines."
                                gradient="bg-gradient-to-br from-rose-500 to-pink-500"
                                size="normal"
                            />

                            <FeatureCard
                                icon={TrendingUp}
                                title="Business"
                                description="Tableau de bord micro-entreprise. Suivi clients, devis, factures et KPIs en temps réel."
                                gradient="bg-gradient-to-br from-violet-500 to-purple-600"
                                size="normal"
                            />

                            <FeatureCard
                                icon={Sparkles}
                                title="Coaching IA"
                                description="Ton assistant personnel propulsé par l'IA. Conseils quotidiens, priorisation intelligente et motivation."
                                gradient="bg-gradient-to-br from-indigo-500 to-blue-600"
                                size="normal"
                            />
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 px-6 bg-white">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <StatCard value="∞" label="Projets" />
                            <StatCard value="7" label="Modules" />
                            <StatCard value="24/7" label="Disponible" />
                            <StatCard value="100%" label="Gratuit" />
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 text-center">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                    Prêt à transformer ta productivité ?
                                </h2>
                                <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
                                    Rejoins les aventuriers qui ont choisi de
                                    reprendre le contrôle de leurs projets.
                                </p>

                                {canRegister && (
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all hover:-translate-y-0.5"
                                    >
                                        Créer mon compte
                                        <Zap className="w-5 h-5" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-6 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <LayoutDashboard className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-gray-600">
                                © 2026 TableauDeBord
                            </span>
                        </div>
                        <div className="text-gray-400 text-sm">
                            Fait avec ❤️ pour les solopreneurs
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
