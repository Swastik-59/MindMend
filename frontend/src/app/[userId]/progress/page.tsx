"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store/zustand";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Pointer } from "@/components/magicui/pointer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "@/components/Sidebar";
import { ToastContainer } from "react-toastify";

const Page = () => {
  const { getProgressData, progressData } = useStore();

  useEffect(() => {
    getProgressData();
  }, [getProgressData]);

  const scores = progressData
    ? [
        {
          label: "Emotional Regulation",
          value: progressData.emotionalRegulation,
        },
        { label: "Self-Awareness", value: progressData.selfAwareness },
        { label: "Coping Skills", value: progressData.copingSkills },
        { label: "Goal Achievement", value: progressData.goalAchievement },
        { label: "Overall Wellbeing", value: progressData.overallWellbeing },
      ]
    : [];

  return (
    <div className="relative min-h-screen bg-background text-text overflow-hidden">
      <Pointer className="fill-accent" />
      <ToastContainer />
      <Sidebar />

      <main className="px-4 sm:px-6 md:px-8 pt-6 pb-12">
        <Card className="max-w-4xl mx-auto w-full shadow-xl border-none bg-muted/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl text-primary font-bold text-center">
              <TextAnimate by="word" animation="fadeIn" duration={0.6}>
                MindMend Progress Tracker
              </TextAnimate>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {!progressData ? (
              <p className="text-center text-muted-foreground">
                Loading progress...
              </p>
            ) : (
              <Tabs defaultValue="table" className="w-full">
                <TabsList className="grid grid-cols-2 w-full mb-6 text-sm sm:text-base">
                  <TabsTrigger value="table">Evaluation Table</TabsTrigger>
                  <TabsTrigger value="chart">Visual Chart</TabsTrigger>
                </TabsList>

                <TabsContent value="table">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-center">
                            Score (1–10)
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scores.map((score) => (
                          <TableRow
                            key={score.label}
                            className="hover:bg-muted/40"
                          >
                            <TableCell>{score.label}</TableCell>
                            <TableCell className="text-center font-semibold">
                              {score.value}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="chart">
                  <div className="h-72 sm:h-80 md:h-[24rem]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scores} barCategoryGap={30}>
                        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, 10]} tickCount={6} />
                        <Tooltip
                          wrapperStyle={{ fontSize: "0.85rem" }}
                          cursor={{ fill: "var(--muted)" }}
                        />
                        <Bar
                          dataKey="value"
                          fill="var(--accent)"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {progressData?.assessment && (
              <div className="mt-8 space-y-6">
                <div className="p-4 border border-border rounded-xl bg-muted/50 text-sm text-muted-foreground">
                  <strong className="text-primary block mb-1">
                    Assessment:
                  </strong>
                  {progressData.assessment}
                </div>

                <div className="p-4 rounded-xl bg-background/70 border border-border text-sm text-muted-foreground">
                  <p>
                    <span className="text-accent font-semibold">
                      How we evaluate you:
                    </span>{" "}
                    We use your chat history with our AI therapist to analyze
                    emotional regulation, self-awareness, coping strategies,
                    goal orientation, and overall well-being. Each session
                    contributes to this evaluation using evidence-based mental
                    health frameworks like CBT, DBT, and motivational
                    interviewing.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/40 border border-border text-sm text-muted-foreground">
                  <p>
                    <span className="text-accent font-semibold">
                      Understanding the 1–10 Scale:
                    </span>{" "}
                    Each dimension is rated from 1 (low/early stage) to 10
                    (excellent/mastered). These scores reflect emotional tone,
                    self-reflection, and progress over time. Use these insights
                    as motivation, not judgment.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Page;
