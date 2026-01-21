import { Head } from "@inertiajs/react";
import AppShell from "@/Layouts/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Target,
    BarChart3,
    Plus,
    Euro,
    PiggyBank,
} from "lucide-react";

interface Objective {
    id: string;
    name: string;
    target_value: number;
    current_value: number;
    unit: string;
    progress: number;
}

interface Kpi {
    id: string;
    name: string;
    value: number;
    unit: string;
    trend: "up" | "down" | "stable";
}

interface BusinessOverviewProps {
    objectives: Objective[];
    kpis: Kpi[];
}

const trendIcons = {
    up: <TrendingUp className="h-4 w-4 text-green-500" />,
    down: <TrendingDown className="h-4 w-4 text-red-500" />,
    stable: <Minus className="h-4 w-4 text-muted-foreground" />,
};

const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    stable: "text-muted-foreground",
};

export default function BusinessOverview({
    objectives,
    kpis,
}: BusinessOverviewProps) {
    // Calculate totals (mock for now - will come from ledger entries later)
    const totalRevenue = 32500;
    const totalExpenses = 8200;
    const netProfit = totalRevenue - totalExpenses;

    return (
        <AppShell title="Business">
            <Head title="Business" />

            <div className="space-y-6">
                {/* Financial Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Revenue
                            </CardTitle>
                            <Euro className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {totalRevenue.toLocaleString("fr-FR")} €
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This quarter
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Expenses
                            </CardTitle>
                            <PiggyBank className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {totalExpenses.toLocaleString("fr-FR")} €
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This quarter
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Net Profit
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                                {netProfit.toLocaleString("fr-FR")} €
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This quarter
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* KPIs */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Key Performance Indicators
                        </h2>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add KPI
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {kpis.map((kpi) => (
                            <Card key={kpi.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                {kpi.name}
                                            </p>
                                            <p className="text-2xl font-bold mt-1">
                                                {kpi.value.toLocaleString(
                                                    "fr-FR",
                                                )}
                                                {kpi.unit}
                                            </p>
                                        </div>
                                        <div className={trendColors[kpi.trend]}>
                                            {trendIcons[kpi.trend]}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Objectives */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Objectives
                        </h2>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Objective
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {objectives.map((obj) => (
                            <Card key={obj.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-medium">
                                            {obj.name}
                                        </h3>
                                        <span
                                            className={`text-lg font-bold ${
                                                obj.progress >= 100
                                                    ? "text-green-600"
                                                    : obj.progress >= 50
                                                      ? "text-blue-600"
                                                      : "text-orange-600"
                                            }`}
                                        >
                                            {obj.progress}%
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Current
                                            </span>
                                            <span className="font-medium">
                                                {obj.current_value.toLocaleString(
                                                    "fr-FR",
                                                )}
                                                {obj.unit}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Target
                                            </span>
                                            <span className="font-medium">
                                                {obj.target_value.toLocaleString(
                                                    "fr-FR",
                                                )}
                                                {obj.unit}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${
                                                    obj.progress >= 100
                                                        ? "bg-green-500"
                                                        : obj.progress >= 50
                                                          ? "bg-blue-500"
                                                          : "bg-orange-500"
                                                }`}
                                                style={{
                                                    width: `${Math.min(obj.progress, 100)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Ledger Coming Soon */}
                <Card className="border-dashed">
                    <CardContent className="py-8 text-center text-muted-foreground">
                        <Euro className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="font-medium text-foreground mb-1">
                            Ledger Entries
                        </h3>
                        <p className="text-sm">
                            Transaction tracking coming soon...
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
