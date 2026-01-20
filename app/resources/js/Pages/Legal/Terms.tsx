import { Head, Link } from "@inertiajs/react";
import { LayoutDashboard, ArrowLeft } from "lucide-react";

export default function Terms() {
    return (
        <>
            <Head title="Conditions d'utilisation" />

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
                            Conditions d'utilisation
                        </h1>
                        <p className="text-[14px] text-gray-400 mb-8">
                            Dernière mise à jour : Janvier 2026
                        </p>

                        <div className="prose prose-gray max-w-none">
                            <section className="mb-8">
                                <h2 className="text-[20px] font-semibold text-gray-900 mb-4">
                                    1. Acceptation des conditions
                                </h2>
                                <p className="text-[15px] text-gray-600 leading-relaxed">
                                    En accédant et en utilisant TableauDeBord,
                                    vous acceptez d'être lié par ces conditions
                                    d'utilisation. Si vous n'acceptez pas ces
                                    conditions, veuillez ne pas utiliser notre
                                    service.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-[20px] font-semibold text-gray-900 mb-4">
                                    2. Description du service
                                </h2>
                                <p className="text-[15px] text-gray-600 leading-relaxed">
                                    TableauDeBord est une application de
                                    productivité personnelle qui vous permet de
                                    gérer vos projets, tâches, notes et
                                    objectifs. Le service est fourni "tel quel"
                                    et nous nous efforçons de le maintenir
                                    disponible 24/7.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-[20px] font-semibold text-gray-900 mb-4">
                                    3. Compte utilisateur
                                </h2>
                                <p className="text-[15px] text-gray-600 leading-relaxed mb-4">
                                    Pour utiliser TableauDeBord, vous devez
                                    créer un compte. Vous êtes responsable de :
                                </p>
                                <ul className="list-disc list-inside text-[15px] text-gray-600 space-y-2">
                                    <li>
                                        Maintenir la confidentialité de votre
                                        mot de passe
                                    </li>
                                    <li>
                                        Toute activité qui se produit sous votre
                                        compte
                                    </li>
                                    <li>
                                        Nous informer immédiatement de toute
                                        utilisation non autorisée
                                    </li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-[20px] font-semibold text-gray-900 mb-4">
                                    4. Utilisation acceptable
                                </h2>
                                <p className="text-[15px] text-gray-600 leading-relaxed">
                                    Vous vous engagez à ne pas utiliser le
                                    service pour des activités illégales,
                                    abusives ou susceptibles de nuire à d'autres
                                    utilisateurs ou au fonctionnement du
                                    service.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-[20px] font-semibold text-gray-900 mb-4">
                                    5. Propriété intellectuelle
                                </h2>
                                <p className="text-[15px] text-gray-600 leading-relaxed">
                                    Le contenu que vous créez vous appartient.
                                    Nous ne revendiquons aucun droit de
                                    propriété sur vos données. Cependant, le
                                    code, le design et la marque TableauDeBord
                                    restent notre propriété.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-[20px] font-semibold text-gray-900 mb-4">
                                    6. Limitation de responsabilité
                                </h2>
                                <p className="text-[15px] text-gray-600 leading-relaxed">
                                    TableauDeBord est fourni sans garantie
                                    d'aucune sorte. Nous ne serons pas
                                    responsables des dommages indirects,
                                    spéciaux ou consécutifs résultant de
                                    l'utilisation du service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-[20px] font-semibold text-gray-900 mb-4">
                                    7. Contact
                                </h2>
                                <p className="text-[15px] text-gray-600 leading-relaxed">
                                    Pour toute question concernant ces
                                    conditions, contactez-nous à :
                                    contact@tableaudebord.app
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
