import AuthLayout from "@/Layouts/AuthLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Mail, RefreshCw, LogOut, CheckCircle } from "lucide-react";

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <>
            <Head title="Vérifiez votre email" />

            <div className="min-h-screen bg-background antialiased">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
                    <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <svg
                                    className="w-4 h-4 text-primary-foreground"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                                    />
                                </svg>
                            </div>
                            <span className="text-[15px] font-semibold text-foreground">
                                TableauDeBord
                            </span>
                        </Link>

                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                        >
                            <LogOut className="w-4 h-4" />
                            Déconnexion
                        </Link>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex items-center justify-center px-4 py-16 min-h-[calc(100vh-56px)]">
                    <div className="w-full max-w-[480px]">
                        {/* Card */}
                        <div className="bg-card rounded-[28px] p-8 lg:p-10 shadow-sm border border-border text-center">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                                <Mail className="w-8 h-8 text-primary" />
                            </div>

                            {/* Title */}
                            <h1 className="text-[24px] font-bold text-card-foreground tracking-[-0.02em] mb-3">
                                Vérifiez votre email
                            </h1>

                            {/* Description */}
                            <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
                                Merci de vous être inscrit ! Avant de commencer,
                                veuillez vérifier votre adresse email en
                                cliquant sur le lien que nous venons de vous
                                envoyer.
                            </p>

                            {/* Success message */}
                            {status === "verification-link-sent" && (
                                <div className="flex items-center gap-2 justify-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-6">
                                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                    <p className="text-[13px] text-emerald-600 dark:text-emerald-400 font-medium">
                                        Un nouveau lien de vérification a été
                                        envoyé !
                                    </p>
                                </div>
                            )}

                            {/* Resend form */}
                            <form onSubmit={submit}>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`
                                        w-full flex items-center justify-center gap-2
                                        px-6 py-3.5 rounded-xl text-[15px] font-semibold
                                        transition-all duration-200
                                        ${
                                            !processing
                                                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10"
                                                : "bg-muted text-muted-foreground cursor-not-allowed"
                                        }
                                    `}
                                >
                                    {processing ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-5 h-5" />
                                            Renvoyer l'email de vérification
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Help text */}
                            <p className="mt-6 text-[13px] text-muted-foreground">
                                Vous n'avez pas reçu l'email ?{" "}
                                <span className="text-foreground font-medium">
                                    Vérifiez vos spams.
                                </span>
                            </p>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-6 flex items-center justify-center gap-6 text-[12px] text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                                Données sécurisées
                            </span>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
