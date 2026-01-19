import { Head } from '@inertiajs/react';
import AppShell from '@/Layouts/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { ArrowDownRight, ArrowUpRight, Download, Plus, Target, TrendingUp, Users } from 'lucide-react';

interface KPI {
    id: number;
    name: string;
    value: string;
    change: number;
    trend: 'up' | 'down';
    icon: React.ElementType;
}

interface Objective {
    id: number;
    name: string;
    target: number;
    current: number;
    unit: string;
}

export default function BusinessOverview() {
    // Placeholder data
    const kpis: KPI[] = [
        { id: 1, name: 'Revenue', value: '€12,500', change: 12, trend: 'up', icon: TrendingUp },
        { id: 2, name: 'Clients', value: '8', change: 2, trend: 'up', icon: Users },
        { id: 3, name: 'Tasks Done', value: '45', change: 15, trend: 'up', icon: Target },
    ];

    const objectives: Objective[] = [
        { id: 1, name: 'Q1 Revenue', target: 50000, current: 25000, unit: '€' },
        { id: 2, name: 'New clients', target: 10, current: 8, unit: '' },
        { id: 3, name: 'Launch MVP', target: 100, current: 40, unit: '%' },
    ];

    return (
        <AppShell title="Business Overview">
            <Head title="Business Overview" />

            <div className="space-y-6">
                {/* KPIs */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {kpis.map((kpi) => {
                        const Icon = kpi.icon;
                        return (
                            <Card key={kpi.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {kpi.name}
                                    </CardTitle>
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{kpi.value}</div>
                                    <div className="mt-1 flex items-center text-xs">
                                        {kpi.trend === 'up' ? (
                                            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                                        ) : (
                                            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                                        )}
                                        <span
                                            className={
                                                kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'
                                            }
                                        >
                                            {kpi.trend === 'up' ? '+' : '-'}{kpi.change}%
                                        </span>
                                        <span className="ml-1 text-muted-foreground">
                                            vs last month
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Objectives */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Objectives</CardTitle>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Objective
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {objectives.map((obj) => {
                            const progress = Math.round((obj.current / obj.target) * 100);
                            return (
                                <div key={obj.id}>
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="font-medium text-foreground">{obj.name}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {obj.unit === '€' ? `€${obj.current.toLocaleString()}` : obj.current}
                                            {' / '}
                                            {obj.unit === '€' ? `€${obj.target.toLocaleString()}` : `${obj.target}${obj.unit}`}
                                        </span>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                progress >= 80
                                                    ? 'bg-green-500'
                                                    : progress >= 50
                                                      ? 'bg-yellow-500'
                                                      : 'bg-primary'
                                            }`}
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        />
                                    </div>
                                    <p className="mt-1 text-right text-xs text-muted-foreground">
                                        {progress}%
                                    </p>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Trend Chart Placeholder */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Trend (30 days)</CardTitle>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export CSV
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
                            <p className="text-muted-foreground">
                                📈 Chart will be implemented here (Recharts or Chart.js)
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
