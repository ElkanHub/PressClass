'use client';

import { Card } from '@/components/ui/card';
import { Clock, Coffee, Zap, Pause as PauseIcon, TrendingUp, Target } from 'lucide-react';
import type { StudyAnalytics } from '@/actions/study-time';

interface StudyAnalyticsProps {
    analytics: StudyAnalytics | null;
    loading?: boolean;
}

export function StudyAnalyticsBar({ analytics, loading = false }: StudyAnalyticsProps) {
    const formatMinutes = (minutes: number) => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    const stats = [
        {
            label: 'Today',
            value: analytics ? formatMinutes(analytics.totalMinutesToday) : '0m',
            icon: Clock,
            color: 'text-blue-500',
        },
        {
            label: 'This Week',
            value: analytics ? formatMinutes(analytics.totalMinutesThisWeek) : '0m',
            icon: Coffee,
            color: 'text-purple-500',
        },
        {
            label: 'Avg. Focus',
            value: analytics ? formatMinutes(analytics.averageFocusDuration) : '0m',
            icon: Zap,
            color: 'text-yellow-500',
        },
        {
            label: 'Pauses Today',
            value: analytics?.pausesToday.toString() || '0',
            icon: PauseIcon,
            color: 'text-orange-500',
        },
        {
            label: 'Longest Streak',
            value: `${analytics?.longestStreak || 0} days`,
            icon: TrendingUp,
            color: 'text-green-500',
        },
        {
            label: 'Total Sessions',
            value: analytics?.totalSessions.toString() || '0',
            icon: Target,
            color: 'text-pink-500',
        },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="p-4 animate-pulse">
                        <div className="h-4 bg-muted rounded w-16 mb-2" />
                        <div className="h-6 bg-muted rounded w-12" />
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                </Card>
            ))}
        </div>
    );
}
