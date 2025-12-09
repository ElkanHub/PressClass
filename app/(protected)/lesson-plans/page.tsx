import { getLessonPlans } from "@/actions/lesson-plans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, FileText, Calendar, Clock, GraduationCap } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default async function LessonPlansPage() {
    // Fetch all lesson plans (no pagination for grouping)
    const { data: lessonPlans } = await getLessonPlans(1, 1000);

    // Group lesson plans by subject
    const lessonPlansBySubject = lessonPlans.reduce((acc: any, plan: any) => {
        const subject = plan.subject || "Uncategorized";
        if (!acc[subject]) {
            acc[subject] = [];
        }
        acc[subject].push(plan);
        return acc;
    }, {});

    return (
        <div className="flex-1 w-full flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto">
            <Breadcrumb items={[{ label: "Lesson Plans" }]} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Lesson Plans</h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage all your lesson plans.
                    </p>
                </div>

                <Button asChild className="gap-2 bg-gradient-to-r from-primary to-purple-600">
                    <Link href="/generator/lesson-plan">
                        <Plus className="h-4 w-4" />
                        Create New
                    </Link>
                </Button>
            </div>

            {(!lessonPlans || lessonPlans.length === 0) && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No lesson plans found. Start by creating one!</p>
                </div>
            )}

            {Object.entries(lessonPlansBySubject || {}).map(([subject, subjectPlans]: [string, any]) => (
                <div key={subject} className="space-y-4">
                    <h2 className="text-2xl font-semibold border-b pb-2">{subject}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjectPlans.map((plan: any) => (
                            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg line-clamp-1">{plan.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <div className="flex items-center">
                                            <GraduationCap className="mr-2 h-4 w-4" />
                                            {plan.class_level}
                                        </div>
                                        <div className="flex items-center">
                                            <FileText className="mr-2 h-4 w-4" />
                                            {plan.topic}
                                        </div>
                                        {plan.duration && (
                                            <div className="flex items-center">
                                                <Clock className="mr-2 h-4 w-4" />
                                                {plan.duration}
                                            </div>
                                        )}
                                        <div className="flex items-center">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {plan.date || new Date(plan.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <Link href={`/lesson-plans/${plan.id}`} className="w-full block">
                                        <Button variant="outline" className="w-full">
                                            <FileText className="mr-2 h-4 w-4" /> View Plan
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
