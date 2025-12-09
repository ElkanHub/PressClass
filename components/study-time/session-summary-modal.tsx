'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Clock, Pause, Zap, Save } from 'lucide-react';

interface SessionSummaryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sessionData: {
        totalMinutes: number;
        pauseCount: number;
        sessionType: string;
    };
    onSave: (data: {
        subjectTag: string;
        notes: string;
        qualityRating: 'productive' | 'needs_improvement' | null;
    }) => void;
}

export function SessionSummaryModal({
    open,
    onOpenChange,
    sessionData,
    onSave,
}: SessionSummaryModalProps) {
    const [subjectTag, setSubjectTag] = useState('');
    const [notes, setNotes] = useState('');
    const [qualityRating, setQualityRating] = useState<'productive' | 'needs_improvement' | null>(null);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await onSave({ subjectTag, notes, qualityRating });
        setSaving(false);
        onOpenChange(false);
        // Reset form
        setSubjectTag('');
        setNotes('');
        setQualityRating(null);
    };

    const formatMinutes = (minutes: number) => {
        if (minutes < 60) return `${minutes} minutes`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Session Complete! 🎉</DialogTitle>
                    <DialogDescription>
                        Great work! Here's a summary of your study session.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Session Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                            <Clock className="h-5 w-5 text-blue-500 mb-2" />
                            <span className="text-sm text-muted-foreground">Total Time</span>
                            <span className="text-lg font-bold">{formatMinutes(sessionData.totalMinutes)}</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                            <Pause className="h-5 w-5 text-orange-500 mb-2" />
                            <span className="text-sm text-muted-foreground">Pauses</span>
                            <span className="text-lg font-bold">{sessionData.pauseCount}</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                            <Zap className="h-5 w-5 text-purple-500 mb-2" />
                            <span className="text-sm text-muted-foreground">Mode</span>
                            <span className="text-lg font-bold capitalize">{sessionData.sessionType}</span>
                        </div>
                    </div>

                    {/* Subject Tag */}
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject/Topic (Optional)</Label>
                        <Input
                            id="subject"
                            placeholder="e.g., Mathematics, History, Programming..."
                            value={subjectTag}
                            onChange={(e) => setSubjectTag(e.target.value)}
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Session Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="What did you study? Any insights or reflections..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                        />
                    </div>

                    {/* Quality Rating */}
                    <div className="space-y-2">
                        <Label>How productive was this session?</Label>
                        <RadioGroup value={qualityRating || ''} onValueChange={(value) => setQualityRating(value as 'productive' | 'needs_improvement')}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="productive" id="productive" />
                                <Label htmlFor="productive" className="font-normal cursor-pointer">
                                    ✅ Productive - I stayed focused and accomplished my goals
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="needs_improvement" id="needs_improvement" />
                                <Label htmlFor="needs_improvement" className="font-normal cursor-pointer">
                                    ⚠️ Needs Improvement - I struggled to stay focused
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={saving}
                        >
                            Skip
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="gap-2"
                        >
                            <Save className="h-4 w-4" />
                            {saving ? 'Saving...' : 'Save Session'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
