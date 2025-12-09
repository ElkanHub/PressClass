'use client';

import { cn } from '@/lib/utils';

interface TimerDisplayProps {
    time: number; // Time in seconds
    mode: 'pomodoro' | 'countdown' | 'stopwatch';
    isRunning: boolean;
    totalTime?: number; // For progress calculation (countdown/pomodoro)
}

export function TimerDisplay({ time, mode, isRunning, totalTime }: TimerDisplayProps) {
    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate progress percentage for circular progress
    const progress = totalTime && totalTime > 0 ? ((totalTime - time) / totalTime) * 100 : 0;
    const circumference = 2 * Math.PI * 120; // radius = 120
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center">
            {/* Circular Progress Ring */}
            <svg className="w-80 h-80 transform -rotate-90" viewBox="0 0 280 280">
                {/* Background circle */}
                <circle
                    cx="140"
                    cy="140"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted/20"
                />
                {/* Progress circle */}
                {totalTime && (
                    <circle
                        cx="140"
                        cy="140"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className={cn(
                            "transition-all duration-1000 ease-linear",
                            isRunning ? "text-primary" : "text-primary/50"
                        )}
                        strokeLinecap="round"
                    />
                )}
            </svg>

            {/* Timer Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={cn(
                    "text-6xl md:text-7xl font-bold tabular-nums transition-colors",
                    isRunning ? "text-foreground" : "text-muted-foreground"
                )}>
                    {formatTime(time)}
                </div>
                <div className="text-sm text-muted-foreground mt-2 capitalize">
                    {mode} {isRunning ? '• Running' : '• Paused'}
                </div>
            </div>
        </div>
    );
}
