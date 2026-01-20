import { Link } from "@inertiajs/react";
import { LayoutDashboard } from "lucide-react";
import { PropsWithChildren } from "react";

interface AuthLayoutProps extends PropsWithChildren {
    title?: string;
    subtitle?: string;
}

export default function AuthLayout({
    children,
    title,
    subtitle,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-[#f5f5f7] antialiased">
            {/* Header - Same style as Landing */}
            <header className="sticky top-0 z-50 bg-[#f5f5f7]/80 backdrop-blur-xl border-b border-black/5">
                <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
                    {/* Logo */}
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

                    {/* Auth links */}
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
            <main className="flex items-center justify-center px-4 py-12 min-h-[calc(100vh-56px)]">
                <div className="w-full max-w-[440px]">
                    {/* Card - Apple tile style */}
                    <div className="bg-white rounded-[28px] p-8 lg:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        {/* Title */}
                        {title && (
                            <div className="text-center mb-8">
                                <h1 className="text-[28px] font-bold text-gray-900 tracking-[-0.02em] mb-2">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="text-[15px] text-gray-500">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Form content */}
                        {children}
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-6 flex items-center justify-center gap-6 text-[12px] text-gray-400">
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
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            100% gratuit
                        </span>
                    </div>
                </div>
            </main>
        </div>
    );
}
