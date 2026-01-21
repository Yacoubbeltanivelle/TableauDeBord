import AuthLayout from "@/Layouts/AuthLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <AuthLayout
            title="Bon retour !"
            subtitle="Connectez-vous à votre tableau de bord"
        >
            <Head title="Connexion" />

            {/* Status message (e.g., password reset success) */}
            {status && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                    <p className="text-[13px] text-emerald-600 dark:text-emerald-400 font-medium">
                        {status}
                    </p>
                </div>
            )}

            {/* Global error message */}
            {Object.keys(errors).length > 0 && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl">
                    <p className="text-[13px] text-destructive font-medium">
                        Email ou mot de passe incorrect.
                    </p>
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* Email */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-[13px] font-medium text-foreground mb-1.5"
                    >
                        Adresse email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className={`
                            w-full px-4 py-3 text-[15px] rounded-xl border bg-background
                            focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring
                            transition-all
                            ${errors.email ? "border-destructive" : "border-input"}
                        `}
                        placeholder="jean@exemple.com"
                        autoComplete="email"
                        autoFocus
                        required
                    />
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label
                            htmlFor="password"
                            className="block text-[13px] font-medium text-foreground"
                        >
                            Mot de passe
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-[12px] text-primary hover:underline"
                            >
                                Mot de passe oublié ?
                            </Link>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className={`
                                w-full px-4 py-3 pr-12 text-[15px] rounded-xl border bg-background
                                focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring
                                transition-all
                                ${errors.password ? "border-destructive" : "border-input"}
                            `}
                            placeholder="••••••••••••"
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Remember me */}
                <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                            className="w-4 h-4 rounded border-input text-primary focus:ring-ring"
                        />
                        <span className="text-[13px] text-muted-foreground">
                            Se souvenir de moi
                        </span>
                    </label>
                </div>

                {/* Submit */}
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
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Connexion...
                        </>
                    ) : (
                        "Se connecter"
                    )}
                </button>

                {/* Register link */}
                <p className="text-center text-[13px] text-muted-foreground">
                    Pas encore de compte ?{" "}
                    <Link
                        href="/register"
                        className="text-primary font-medium hover:underline"
                    >
                        Créer un compte
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
