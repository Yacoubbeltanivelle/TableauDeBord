import { useState, useMemo } from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
    password: string;
}

interface PasswordRule {
    label: string;
    test: (password: string) => boolean;
}

const rules: PasswordRule[] = [
    { label: "Au moins 12 caractères", test: (p) => p.length >= 12 },
    { label: "Une lettre minuscule", test: (p) => /[a-z]/.test(p) },
    { label: "Une lettre majuscule", test: (p) => /[A-Z]/.test(p) },
    { label: "Un chiffre", test: (p) => /[0-9]/.test(p) },
    {
        label: "Un caractère spécial (!@#$...)",
        test: (p) => /[^a-zA-Z0-9]/.test(p),
    },
];

export default function PasswordStrength({ password }: PasswordStrengthProps) {
    const results = useMemo(() => {
        return rules.map((rule) => ({
            ...rule,
            passed: rule.test(password),
        }));
    }, [password]);

    const passedCount = results.filter((r) => r.passed).length;
    const strength = passedCount / rules.length;

    const strengthColor =
        strength === 1
            ? "bg-emerald-500"
            : strength >= 0.6
              ? "bg-amber-500"
              : strength >= 0.4
                ? "bg-orange-500"
                : "bg-red-500";

    const strengthLabel =
        strength === 1
            ? "Fort"
            : strength >= 0.6
              ? "Moyen"
              : strength >= 0.4
                ? "Faible"
                : "Très faible";

    if (!password) return null;

    return (
        <div className="mt-3 space-y-3">
            {/* Strength bar */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500 uppercase tracking-wide">
                        Force du mot de passe
                    </span>
                    <span
                        className={`font-medium ${
                            strength === 1
                                ? "text-emerald-600"
                                : strength >= 0.6
                                  ? "text-amber-600"
                                  : "text-red-600"
                        }`}
                    >
                        {strengthLabel}
                    </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 rounded-full ${strengthColor}`}
                        style={{ width: `${strength * 100}%` }}
                    />
                </div>
            </div>

            {/* Rules checklist */}
            <div className="space-y-1.5">
                {results.map((rule, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-2 text-[12px] transition-colors ${
                            rule.passed ? "text-emerald-600" : "text-gray-400"
                        }`}
                    >
                        {rule.passed ? (
                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        ) : (
                            <X className="w-3.5 h-3.5" strokeWidth={2} />
                        )}
                        <span>{rule.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export { rules };
