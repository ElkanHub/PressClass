'use client';

import { Card } from '@/components/ui/card';
import { Clock, Pause, Zap } from 'lucide-react';

interface LiveSessionInsightsProps {
    timeSpent: number; // in seconds
    timeRemaining?: number; // in seconds (for countdown)
    pauseCount: number;
    currentStreak: number; // in seconds
}

export function LiveSessionInsights({
    timeSpent,
    timeRemaining,
    pauseCount,
    currentStreak,
}: LiveSessionInsightsProps) {
    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs}h ${mins}m ${secs}s`;
        }
        if (mins > 0) {
            return `${mins}m ${secs}s`;
        }
        return `${secs}s`;
    };

    const insights = [
        {
            label: 'Time Spent',
            value: formatTime(timeSpent),
            icon: Clock,
            color: 'text-blue-500',
        },
        ...(timeRemaining !== undefined
            ? [
                {
                    label: 'Time Remaining',
                    value: formatTime(timeRemaining),
                    icon: Clock,
                    color: 'text-purple-500',
                },
            ]
            : []),
        {
            label: 'Pauses',
            value: pauseCount.toString(),
            icon: Pause,
            color: 'text-orange-500',
        },
        {
            label: 'Current Streak',
            value: formatTime(currentStreak),
            icon: Zap,
            color: 'text-green-500',
        },
    ];

    return (
        <Card className="p-6 bg-muted/30">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Live Session Insights</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {insights.map((insight, index) => (
                    <div key={index} className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <insight.icon className={`h-4 w-4 ${insight.color}`} />
                            <span className="text-xs text-muted-foreground">{insight.label}</span>
                        </div>
                        <span className="text-lg font-bold">{insight.value}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
