'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { StudyAnalyticsBar } from '@/components/study-time/study-analytics';
import { TimerDisplay } from '@/components/study-time/timer-display';
import { TimerControls } from '@/components/study-time/timer-controls';
import { LiveSessionInsights } from '@/components/study-time/live-session-insights';
import { SessionSummaryModal } from '@/components/study-time/session-summary-modal';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getStudyAnalytics, createStudySession, updateStudySession, createPause, endPause } from '@/actions/study-time';
import type { StudyAnalytics } from '@/actions/study-time';
import { useToast } from '@/hooks/use-toast';

type TimerMode = 'pomodoro' | 'countdown' | 'stopwatch';

interface TimerSettings {
    workDuration: number; // minutes
    breakDuration: number; // minutes
    longBreakDuration: number; // minutes
    longBreakInterval: number; // number of work sessions before long break
    countdownDuration: number; // minutes
}

export default function StudyTimePage() {
    const { toast } = useToast();

    // Analytics
    const [analytics, setAnalytics] = useState<StudyAnalytics | null>(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState(true);

    // Timer state
    const [mode, setMode] = useState<TimerMode>('pomodoro');
    const [time, setTime] = useState(0); // Current time in seconds
    const [totalTime, setTotalTime] = useState(0); // Total time for progress calculation
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Session tracking
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);
    const [pauseCount, setPauseCount] = useState(0);
    const [currentPauseId, setCurrentPauseId] = useState<string | null>(null);
    const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [timeSpent, setTimeSpent] = useState(0);

    // Modal
    const [showSummary, setShowSummary] = useState(false);
    const [sessionSummaryData, setSessionSummaryData] = useState<any>(null);

    // Settings
    const [settings, setSettings] = useState<TimerSettings>({
        workDuration: 25,
        breakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4,
        countdownDuration: 45,
    });
    const [showSettings, setShowSettings] = useState(false);

    // Refs
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const streakIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Load analytics on mount
    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        setLoadingAnalytics(true);
        const { data } = await getStudyAnalytics();
        setAnalytics(data);
        setLoadingAnalytics(false);
    };

    // Timer logic
    useEffect(() => {
        if (isRunning && !isPaused) {
            intervalRef.current = setInterval(() => {
                setTime((prev) => {
                    if (mode === 'countdown' && prev <= 1) {
                        handleTimerComplete();
                        return 0;
                    }
                    return mode === 'countdown' ? prev - 1 : prev + 1;
                });
                setTimeSpent((prev) => prev + 1);
            }, 1000);

            // Track current streak
            streakIntervalRef.current = setInterval(() => {
                setCurrentStreak((prev) => prev + 1);
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (streakIntervalRef.current) clearInterval(streakIntervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (streakIntervalRef.current) clearInterval(streakIntervalRef.current);
        };
    }, [isRunning, isPaused, mode]);

    const handleTimerComplete = () => {
        setIsRunning(false);
        handleEndSession();
    };

    const handleStart = async () => {
        // Initialize timer based on mode
        let initialTime = 0;
        let total = 0;

        if (mode === 'pomodoro') {
            initialTime = settings.workDuration * 60;
            total = settings.workDuration * 60;
        } else if (mode === 'countdown') {
            initialTime = settings.countdownDuration * 60;
            total = settings.countdownDuration * 60;
        } else {
            initialTime = 0;
            total = 0;
        }

        setTime(initialTime);
        setTotalTime(total);
        setIsRunning(true);
        setIsPaused(false);
        setTimeSpent(0);
        setCurrentStreak(0);
        setPauseCount(0);

        // Create session in database
        const startTime = new Date().toISOString();
        setSessionStartTime(startTime);

        const { data, error } = await createStudySession({
            session_type: mode,
            start_time: startTime,
            settings: settings,
        });

        if (error) {
            toast({
                title: 'Error',
                description: 'Failed to start session. Please try again.',
                variant: 'destructive',
            });
            return;
        }

        if (data) {
            setSessionId(data.id);
        }
    };

    const handlePause = async () => {
        setIsPaused(true);
        setIsRunning(false);
        setPauseCount((prev) => prev + 1);
        setCurrentStreak(0); // Reset streak on pause

        // Record pause start
        if (sessionId) {
            const pauseStart = new Date().toISOString();
            setPauseStartTime(Date.now());
            const { data } = await createPause(sessionId, pauseStart);
            if (data) {
                setCurrentPauseId(data.id);
            }
        }
    };

    const handleResume = async () => {
        setIsPaused(false);
        setIsRunning(true);

        // Record pause end
        if (currentPauseId && pauseStartTime) {
            const pauseEnd = new Date().toISOString();
            const durationSeconds = Math.floor((Date.now() - pauseStartTime) / 1000);
            await endPause(currentPauseId, pauseEnd, durationSeconds);
            setCurrentPauseId(null);
            setPauseStartTime(null);
        }
    };

    const handleEndSession = async () => {
        setIsRunning(false);
        setIsPaused(false);

        if (!sessionId) return;

        // Calculate total minutes
        const totalMinutes = Math.floor(timeSpent / 60);
        const endTime = new Date().toISOString();

        // Update session
        await updateStudySession(sessionId, {
            end_time: endTime,
            total_minutes: totalMinutes,
            pause_count: pauseCount,
        });

        // Show summary modal
        setSessionSummaryData({
            totalMinutes,
            pauseCount,
            sessionType: mode,
        });
        setShowSummary(true);

        // Reset timer
        setTime(0);
        setTotalTime(0);
        setTimeSpent(0);
        setCurrentStreak(0);
        setPauseCount(0);
        setSessionId(null);
        setSessionStartTime(null);

        // Reload analytics
        loadAnalytics();
    };

    const handleSaveSummary = async (data: {
        subjectTag: string;
        notes: string;
        qualityRating: 'productive' | 'needs_improvement' | null;
    }) => {
        if (!sessionId) return;

        await updateStudySession(sessionId, {
            subject_tag: data.subjectTag || null,
            notes: data.notes || null,
            quality_rating: data.qualityRating,
        });

        toast({
            title: 'Session Saved',
            description: 'Your study session has been saved successfully.',
        });

        loadAnalytics();
    };

    const handleModeChange = (newMode: TimerMode) => {
        if (isRunning || isPaused) {
            toast({
                title: 'Cannot Change Mode',
                description: 'Please end the current session before changing modes.',
                variant: 'destructive',
            });
            return;
        }
        setMode(newMode);
        setShowSettings(false);
    };

    return (
        <div className="flex-1 w-full flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Study Time</h1>
                <p className="text-muted-foreground mt-1">
                    Focus, track, and improve your study sessions
                </p>
            </div>

            {/* Analytics Bar */}
            <StudyAnalyticsBar analytics={analytics} loading={loadingAnalytics} />

            {/* Main Timer Section */}
            <div className="flex flex-col items-center gap-8">
                {/* Mode Selector */}
                {!isRunning && !isPaused && (
                    <Card className="p-6 w-full max-w-2xl">
                        <Label className="text-base font-semibold mb-4 block">Select Timer Mode</Label>
                        <RadioGroup value={mode} onValueChange={(value) => handleModeChange(value as TimerMode)}>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <RadioGroupItem value="pomodoro" id="pomodoro" />
                                    <Label htmlFor="pomodoro" className="flex-1 cursor-pointer">
                                        <div className="font-medium">Pomodoro Timer</div>
                                        <div className="text-sm text-muted-foreground">
                                            {settings.workDuration}min work, {settings.breakDuration}min break
                                        </div>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <RadioGroupItem value="countdown" id="countdown" />
                                    <Label htmlFor="countdown" className="flex-1 cursor-pointer">
                                        <div className="font-medium">Countdown Timer</div>
                                        <div className="text-sm text-muted-foreground">
                                            Set custom duration: {settings.countdownDuration} minutes
                                        </div>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <RadioGroupItem value="stopwatch" id="stopwatch" />
                                    <Label htmlFor="stopwatch" className="flex-1 cursor-pointer">
                                        <div className="font-medium">Stopwatch</div>
                                        <div className="text-sm text-muted-foreground">
                                            Open-ended focus session
                                        </div>
                                    </Label>
                                </div>
                            </div>
                        </RadioGroup>

                        {/* Settings Toggle */}
                        {!showSettings && (
                            <Button
                                variant="link"
                                onClick={() => setShowSettings(true)}
                                className="mt-4"
                            >
                                Customize Settings
                            </Button>
                        )}

                        {/* Settings Panel */}
                        {showSettings && (
                            <div className="mt-6 pt-6 border-t space-y-4">
                                <h3 className="font-semibold">Timer Settings</h3>

                                {mode === 'pomodoro' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="work">Work Duration (min)</Label>
                                                <Input
                                                    id="work"
                                                    type="number"
                                                    min="1"
                                                    value={settings.workDuration}
                                                    onChange={(e) => setSettings({ ...settings, workDuration: parseInt(e.target.value) || 25 })}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="break">Break Duration (min)</Label>
                                                <Input
                                                    id="break"
                                                    type="number"
                                                    min="1"
                                                    value={settings.breakDuration}
                                                    onChange={(e) => setSettings({ ...settings, breakDuration: parseInt(e.target.value) || 5 })}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {mode === 'countdown' && (
                                    <div>
                                        <Label htmlFor="countdown">Duration (minutes)</Label>
                                        <Input
                                            id="countdown"
                                            type="number"
                                            min="1"
                                            value={settings.countdownDuration}
                                            onChange={(e) => setSettings({ ...settings, countdownDuration: parseInt(e.target.value) || 45 })}
                                        />
                                    </div>
                                )}

                                <Button
                                    variant="outline"
                                    onClick={() => setShowSettings(false)}
                                    className="w-full"
                                >
                                    Done
                                </Button>
                            </div>
                        )}
                    </Card>
                )}

                {/* Timer Display */}
                <TimerDisplay
                    time={time}
                    mode={mode}
                    isRunning={isRunning}
                    totalTime={totalTime}
                />

                {/* Timer Controls */}
                <TimerControls
                    isRunning={isRunning}
                    isPaused={isPaused}
                    onStart={handleStart}
                    onPause={handlePause}
                    onResume={handleResume}
                    onEnd={handleEndSession}
                />

                {/* Live Session Insights */}
                {(isRunning || isPaused) && (
                    <div className="w-full max-w-3xl">
                        <LiveSessionInsights
                            timeSpent={timeSpent}
                            timeRemaining={mode === 'countdown' ? time : undefined}
                            pauseCount={pauseCount}
                            currentStreak={currentStreak}
                        />
                    </div>
                )}
            </div>

            {/* Session Summary Modal */}
            <SessionSummaryModal
                open={showSummary}
                onOpenChange={setShowSummary}
                sessionData={sessionSummaryData || { totalMinutes: 0, pauseCount: 0, sessionType: mode }}
                onSave={handleSaveSummary}
            />
        </div>
    );
}
