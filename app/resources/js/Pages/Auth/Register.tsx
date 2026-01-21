import AuthLayout from "@/Layouts/AuthLayout";
import PasswordStrength, { rules } from "@/Components/PasswordStrength";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useState, useMemo, useEffect } from "react";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        terms: false,
        // Honeypot fields
        website: "", // Hidden field - should remain empty
        form_time: Date.now().toString(),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formStartTime] = useState(Date.now());

    // Password validation
    const passwordValid = useMemo(() => {
        return rules.every((rule) => rule.test(data.password));
    }, [data.password]);

    const passwordsMatch = useMemo(() => {
        return (
            data.password === data.password_confirmation &&
            data.password_confirmation.length > 0
        );
    }, [data.password, data.password_confirmation]);

    const formValid = useMemo(() => {
        return (
            data.name.length >= 2 &&
            data.email.includes("@") &&
            passwordValid &&
            passwordsMatch &&
            data.terms
        );
    }, [data.name, data.email, passwordValid, passwordsMatch, data.terms]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Update form time before submitting
        setData("form_time", formStartTime.toString());

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <AuthLayout
            title="Créer un compte"
            subtitle="Commencez votre aventure gratuitement"
        >
            <Head title="Créer un compte" />

            {/* Global error message */}
            {Object.keys(errors).length > 0 && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl">
                    <p className="text-[13px] text-destructive font-medium">
                        Veuillez corriger les erreurs ci-dessous.
                    </p>
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* Honeypot - Hidden from users */}
                <input
                    type="text"
                    name="website"
                    value={data.website}
                    onChange={(e) => setData("website", e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                />
                <input type="hidden" name="form_time" value={data.form_time} />

                {/* Name */}
                <div>
                    <label
                        htmlFor="name"
                        className="block text-[13px] font-medium text-foreground mb-1.5"
                    >
                        Nom complet
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className={`
                            w-full px-4 py-3 text-[15px] rounded-xl border bg-background
                            focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring
                            transition-all
                            ${errors.name ? "border-destructive" : "border-input"}
                        `}
                        placeholder="Jean Dupont"
                        autoComplete="name"
                        autoFocus
                        required
                    />
                    {errors.name && (
                        <p className="mt-1.5 text-[12px] text-destructive">
                            {errors.name}
                        </p>
                    )}
                </div>

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
                        required
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-[12px] text-red-600">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-[13px] font-medium text-foreground mb-1.5"
                    >
                        Mot de passe
                    </label>
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
                            autoComplete="new-password"
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
                    {errors.password && (
                        <p className="mt-1.5 text-[12px] text-red-600">
                            {errors.password}
                        </p>
                    )}
                    <PasswordStrength password={data.password} />
                </div>

                {/* Confirm Password */}
                <div>
                    <label
                        htmlFor="password_confirmation"
                        className="block text-[13px] font-medium text-foreground mb-1.5"
                    >
                        Confirmer le mot de passe
                    </label>
                    <div className="relative">
                        <input
                            id="password_confirmation"
                            type={showConfirmPassword ? "text" : "password"}
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            className={`
                                w-full px-4 py-3 pr-12 text-[15px] rounded-xl border bg-background
                                focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring
                                transition-all
                                ${data.password_confirmation && !passwordsMatch ? "border-destructive" : "border-input"}
                                ${passwordsMatch ? "border-emerald-500" : ""}
                            `}
                            placeholder="••••••••••••"
                            autoComplete="new-password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {data.password_confirmation && !passwordsMatch && (
                        <p className="mt-1.5 text-[12px] text-red-600">
                            Les mots de passe ne correspondent pas
                        </p>
                    )}
                    {passwordsMatch && (
                        <p className="mt-1.5 text-[12px] text-emerald-600 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Les mots de passe
                            correspondent
                        </p>
                    )}
                </div>

                {/* Terms */}
                <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.terms}
                            onChange={(e) => setData("terms", e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded border-input text-primary focus:ring-ring"
                        />
                        <span className="text-[13px] text-muted-foreground leading-relaxed">
                            J'accepte les{" "}
                            <Link
                                href="/terms"
                                className="text-primary hover:underline"
                            >
                                Conditions d'utilisation
                            </Link>{" "}
                            et la{" "}
                            <Link
                                href="/privacy"
                                className="text-primary hover:underline"
                            >
                                Politique de confidentialité
                            </Link>
                        </span>
                    </label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={!formValid || processing}
                    className={`
                        w-full flex items-center justify-center gap-2
                        px-6 py-3.5 rounded-xl text-[15px] font-semibold
                        transition-all duration-200
                        ${
                            formValid && !processing
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10"
                                : "bg-muted text-muted-foreground cursor-not-allowed"
                        }
                    `}
                >
                    {processing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Création en cours...
                        </>
                    ) : (
                        "Créer mon compte"
                    )}
                </button>

                {/* Login link */}
                <p className="text-center text-[13px] text-muted-foreground">
                    Déjà un compte ?{" "}
                    <Link
                        href="/login"
                        className="text-primary font-medium hover:underline"
                    >
                        Se connecter
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
