'use client';

import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Settings } from 'lucide-react';

interface TimerControlsProps {
    isRunning: boolean;
    isPaused: boolean;
    onStart: () => void;
    onPause: () => void;
    onResume: () => void;
    onEnd: () => void;
    onSettings?: () => void;
    disabled?: boolean;
}

export function TimerControls({
    isRunning,
    isPaused,
    onStart,
    onPause,
    onResume,
    onEnd,
    onSettings,
    disabled = false,
}: TimerControlsProps) {
    return (
        <div className="flex items-center justify-center gap-4">
            {!isRunning && !isPaused && (
                <>
                    <Button
                        onClick={onStart}
                        size="lg"
                        className="gap-2 px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        disabled={disabled}
                    >
                        <Play className="h-5 w-5" />
                        Start Session
                    </Button>
                    {onSettings && (
                        <Button
                            onClick={onSettings}
                            size="lg"
                            variant="outline"
                            className="gap-2"
                            disabled={disabled}
                        >
                            <Settings className="h-5 w-5" />
                            Settings
                        </Button>
                    )}
                </>
            )}

            {isRunning && !isPaused && (
                <>
                    <Button
                        onClick={onPause}
                        size="lg"
                        variant="outline"
                        className="gap-2 px-8"
                    >
                        <Pause className="h-5 w-5" />
                        Pause
                    </Button>
                    <Button
                        onClick={onEnd}
                        size="lg"
                        variant="destructive"
                        className="gap-2"
                    >
                        <Square className="h-5 w-5" />
                        End Session
                    </Button>
                </>
            )}

            {isPaused && (
                <>
                    <Button
                        onClick={onResume}
                        size="lg"
                        className="gap-2 px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                    >
                        <Play className="h-5 w-5" />
                        Resume
                    </Button>
                    <Button
                        onClick={onEnd}
                        size="lg"
                        variant="destructive"
                        className="gap-2"
                    >
                        <Square className="h-5 w-5" />
                        End Session
                    </Button>
                </>
            )}
        </div>
    );
}
