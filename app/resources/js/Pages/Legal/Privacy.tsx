import { Head, Link } from "@inertiajs/react";
import { LayoutDashboard, ArrowLeft } from "lucide-react";

export default function Privacy() {
    return (
        <>
            <Head title="Politique de confidentialité" />

            <div className="min-h-screen bg-[#f5f5f7] antialiased">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-[#f5f5f7]/80 backdrop-blur-xl border-b border-black/5">
                    <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <LayoutDashboard
                                    className="w-4 h-4 text-white"
                                    strokeWidth={2}
                                />
                            </div>
                            <span className="text-[15px] font-semibold text-gray-900">
                                TableauDeBord
                            </span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Se connecter
                            </Link>
                            <Link
                                href="/register"
                                className="text-[13px] font-medium text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-full transition-all"
                            >
                                Créer un compte
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-[800px] mx-auto px-6 py-12">
                    {/* Back link */}
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour à l'inscription
                    </Link>

                    {/* Card */}
                    <div className="bg-white rounded-[28px] p-8 lg:p-12 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <h1 className="text-[32px] font-bold text-gray-900 tracking-[-0.02em] mb-2">
                            Politique de confidentialité
                        </h1>
                        <p className="text-[14px] text-gray-400 mb-8">
                            Dernière mise à jour : Janvier 2026
                        </p>

                        <div className="prose prose-gray max-w-none">
                            <section className="mb-8">
                                <h2 className="text-[20px] font-semibold text-gray-900 mb-4">
                                    1. Introduction
                                </h2>
                                <p className="text-[15px] text-gray-600 leading-relaxed">
                                    Chez TableauDeBord, nous prenons votre vie
                                    privée au sérieux. Cette politique décrit
                                    comment nous collectons, utilisons et
                                    protégeons vos informations personnelles.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-[20px] font-semibold text-gray-900 mb-4">
                                    2. Données collectées
                                </h2>
                                <p className="text-[15px] text-gray-600 leading-relaxed mb-4">
                                    Nous collectons uniquement les données
                                    nécessaires au fonctionnement du service :
                                </p>
                                <ul className="list-disc list-inside text-[15px] text-gray-600 space-y-2">
                                    <li>
                                        <strong>Données de compte</strong> :
                                        nom, email, mot de passe hashé
                                    </li>
                                    <li>
                                        <strong>Données d'utilisation</strong> :
                                        projets, tâches, notes que vous créez
                                    </li>
                                    <li>
                                        <strong>Données techniques</strong> :
                                        adresse IP, type de navigateur (pour la
                                        sécurité)
                                    </li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-[20px] font-semibold text-gray-900 mb-4">
                                    3. Utilisation des données
                                </h2>
                                <p className="text-[15px] text-gray-600 leading-relaxed mb-4">
                                    Vos données sont utilisées pour :
                                </p>
                                <ul className="list-disc list-inside text-[15px] text-gray-600 space-y-2">
                                    <li>
                                        Fournir et améliorer le service
                                        TableauDeBord
                                    </li>
                                    <li>
                                        Vous envoyer des emails importants
                                        (vérification, sécurité)
                                    </li>
                                    <li>
                                        Protéger contre les abus et les accès
                                        non autorisés
                                    </li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-[20px] font-semibold text-gray-900 mb-4">
                                    4. Protection des données
                                </h2>
                                <p className="text-[15px] text-gray-600 leading-relaxed">
                                    Nous utilisons des mesures de sécurité
                                    standard de l'industrie : chiffrement HTTPS,
                                    mots de passe hashés (bcrypt), protection
                                    contre les attaques par injection SQL et
                                    XSS.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-[20px] font-semibold text-gray-900 mb-4">
                                    5. Partage des données
                                </h2>
                                <p className="text-[15px] text-gray-600 leading-relaxed">
                                    Nous ne vendons jamais vos données. Nous ne
                                    les partageons avec des tiers que si la loi
                                    l'exige ou pour protéger nos droits.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-[20px] font-semibold text-gray-900 mb-4">
                                    6. Vos droits
                                </h2>
                                <p className="text-[15px] text-gray-600 leading-relaxed mb-4">
                                    Conformément au RGPD, vous avez le droit de
                                    :
                                </p>
                                <ul className="list-disc list-inside text-[15px] text-gray-600 space-y-2">
                                    <li>Accéder à vos données personnelles</li>
                                    <li>Rectifier vos données inexactes</li>
                                    <li>
                                        Supprimer votre compte et vos données
                                    </li>
                                    <li>
                                        Exporter vos données dans un format
                                        portable
                                    </li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-[20px] font-semibold text-gray-900 mb-4">
                                    7. Cookies
                                </h2>
                                <p className="text-[15px] text-gray-600 leading-relaxed">
                                    Nous utilisons uniquement des cookies
                                    essentiels pour le fonctionnement du service
                                    (session, authentification). Pas de cookies
                                    de tracking publicitaire.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-[20px] font-semibold text-gray-900 mb-4">
                                    8. Contact
                                </h2>
                                <p className="text-[15px] text-gray-600 leading-relaxed">
                                    Pour toute question concernant vos données
                                    personnelles, contactez notre DPO à :
                                    privacy@tableaudebord.app
                                </p>
                            </section>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="max-w-[1200px] mx-auto px-6 py-8 border-t border-black/5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-gray-400">
                        <span>© 2026 TableauDeBord</span>
                        <div className="flex gap-6">
                            <Link
                                href="/terms"
                                className="hover:text-gray-600 transition-colors"
                            >
                                Conditions
                            </Link>
                            <Link
                                href="/privacy"
                                className="hover:text-gray-600 transition-colors"
                            >
                                Confidentialité
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
