import { useEffect, useState } from "react";
import axios from "axios";
import { studentService } from "@/services/api";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AptitudeQuestion {
  id: number;
  question: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  correctOption: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  selectedOption?: string;
  showResult?: boolean;
  solved?: boolean;
}

interface AptitudeSubTopic {
  id: number;
  name: string;
  questions: AptitudeQuestion[];
}

interface AptitudeTopic {
  id: number;
  name: string;
  subTopics: AptitudeSubTopic[];
}

const USER_ID = 13;

const difficultyConfig = (difficulty: string) => {
  switch (difficulty) {
    case "EASY":
      return {
        variant: "secondary" as const,
        label: "Easy",
        dot: "bg-emerald-400",
        pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      };
    case "MEDIUM":
      return {
        variant: "outline" as const,
        label: "Medium",
        dot: "bg-amber-400",
        pill: "bg-amber-50 text-amber-700 border border-amber-200",
      };
    case "HARD":
      return {
        variant: "destructive" as const,
        label: "Hard",
        dot: "bg-rose-500",
        pill: "bg-rose-50 text-rose-700 border border-rose-200",
      };
    default:
      return {
        variant: "default" as const,
        label: difficulty,
        dot: "bg-slate-400",
        pill: "bg-slate-50 text-slate-700 border border-slate-200",
      };
  }
};

/* ── tiny icons as inline SVG ── */
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#10b981" />
    <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#f43f5e" />
    <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const RetryIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const BrainIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.8A3 3 0 0 1 4 12a3 3 0 0 1 .58-1.77 2.5 2.5 0 0 1 0-3.46A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.8A3 3 0 0 0 20 12a3 3 0 0 0-.58-1.77 2.5 2.5 0 0 0 0-3.46A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
);

const AptitudeSheet = () => {
  const [topics, setTopics] = useState<AptitudeTopic[]>([]);
  const [progress, setProgress] = useState({
    solvedQuestions: 0,
    totalQuestions: 0,
    progressPercentage: 0,
  });
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PROGRESS ================= */
  const fetchProgress = async () => {
    const res = await studentService.getAptitudeProgress();
    setProgress(res);
  };

  /* ================= FETCH SHEET ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sheet = await studentService.getAptitudeSheet();

        const mappedTopics: AptitudeTopic[] = (sheet.topics || []).map(
          (t: any) => ({
            id: t.id,
            name: t.name,
            subTopics: (t.subTopics || []).map((s: any) => ({
              id: s.id,
              name: s.name,
              questions: (s.questions || []).map((q: any) => ({
                id: q.id,
                question: q.title,
                difficulty: q.difficulty,
                correctOption: q.correctOption,
                optionA: q.optionA,
                optionB: q.optionB,
                optionC: q.optionC,
                optionD: q.optionD,
                solved: q.solved,
              })),
            })),
          })
        );

        setTopics(mappedTopics);
        await fetchProgress();
      } catch (err) {
        console.error("Error loading sheet", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= OPTION CLICK ================= */
  const handleOptionClick = async (
    questionId: number,
    option: string,
    correctOption: string
  ) => {
    const isCorrect = option === correctOption;

    setTopics((prev) =>
      prev.map((topic) => ({
        ...topic,
        subTopics: topic.subTopics.map((sub) => ({
          ...sub,
          questions: sub.questions.map((q) =>
            q.id === questionId
              ? { ...q, selectedOption: option, showResult: true, solved: isCorrect }
              : q
          ),
        })),
      }))
    );

    if (isCorrect) {
      await studentService.updateQuestionProgress(questionId, true);
      await fetchProgress();
    }
  };

  /* ================= RETRY ================= */
  const handleRetry = async (questionId: number) => {
    setTopics((prev) =>
      prev.map((topic) => ({
        ...topic,
        subTopics: topic.subTopics.map((sub) => ({
          ...sub,
          questions: sub.questions.map((q) =>
            q.id === questionId
              ? { ...q, selectedOption: undefined, showResult: false, solved: false }
              : q
          ),
        })),
      }))
    );

    await studentService.updateQuestionProgress(questionId, false);
    await fetchProgress();
  };

  /* ================= OPTION STYLE ================= */
  const getOptionStyle = (q: AptitudeQuestion, option: string) => {
    if (!q.showResult)
      return "hover:bg-indigo-50 hover:border-indigo-300 cursor-pointer hover:shadow-sm active:scale-[0.99]";

    if (option === q.correctOption)
      return "bg-emerald-50 border-emerald-400 text-emerald-800 shadow-emerald-100 shadow-sm";

    if (option === q.selectedOption)
      return "bg-rose-50 border-rose-400 text-rose-800 shadow-rose-100 shadow-sm";

    return "opacity-40 cursor-default";
  };

  /* ================= LOADING ================= */
  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-sm text-slate-500 font-medium tracking-wide">Loading your sheet…</p>
      </div>
    );

  const pct = progress.progressPercentage;

  return (
   <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">

      {/* ── TOP HEADER BAR ── */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-6">

          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <BrainIcon />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">
                Aptitude Sheet
              </h1>
              <p className="text-xs text-slate-400 font-medium">Practice · Learn · Master</p>
            </div>
          </div>

          {/* Progress pill */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">
                  {progress.solvedQuestions}
                  <span className="text-slate-400 font-normal"> / {progress.totalQuestions} solved</span>
                </span>
                <span
                  className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-full",
                    pct >= 80
                      ? "bg-emerald-100 text-emerald-700"
                      : pct >= 40
                      ? "bg-amber-100 text-amber-700"
                      : "bg-indigo-100 text-indigo-700"
                  )}
                >
                  {Math.round(pct)}%
                </span>
              </div>
              <div className="w-48 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    pct >= 80
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                      : pct >= 40
                      ? "bg-gradient-to-r from-amber-400 to-orange-400"
                      : "bg-gradient-to-r from-indigo-400 to-violet-500"
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 pt-8 pb-20 space-y-4 flex-1">

        {/* Mobile progress card */}
        <div className="sm:hidden bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">Your Progress</span>
              <span className="text-sm font-bold text-indigo-600">{Math.round(pct)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-500 transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">
              {progress.solvedQuestions} of {progress.totalQuestions} questions solved
            </p>
          </div>
        </div>

        {/* ── TOPICS ACCORDION ── */}
        <Accordion type="multiple" className="space-y-3">
          {topics.map((topic, topicIdx) => {
            const totalQ = topic.subTopics.reduce((a, s) => a + s.questions.length, 0);
            const solvedQ = topic.subTopics.reduce(
              (a, s) => a + s.questions.filter((q) => q.solved).length,
              0
            );
            const topicPct = totalQ ? Math.round((solvedQ / totalQ) * 100) : 0;

            return (
              <AccordionItem
                key={topic.id}
                value={`topic-${topic.id}`}
                className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden data-[state=open]:shadow-md data-[state=open]:border-indigo-200 transition-all duration-300"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-slate-50/60 transition-colors group [&>svg]:hidden">
                  <div className="flex items-center justify-between w-full gap-4">
                    {/* Left: number + name */}
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-bold flex items-center justify-center flex-shrink-0 group-data-[state=open]:bg-indigo-600 group-data-[state=open]:text-white transition-colors duration-200">
                        {topicIdx + 1}
                      </span>
                      <span className="text-base font-semibold text-slate-800 text-left">
                        {topic.name}
                      </span>
                    </div>

                    {/* Right: mini stats + chevron */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="hidden sm:flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-indigo-400 transition-all duration-500"
                            style={{ width: `${topicPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                          {solvedQ}/{totalQ}
                        </span>
                      </div>
                      <svg
                        className="w-4 h-4 text-slate-400 group-data-[state=open]:rotate-180 transition-transform duration-300"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                      >
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-5 pb-5">
                  <div className="space-y-6 pt-2">
                    {topic.subTopics.map((sub, subIdx) => (
                      <div key={sub.id}>
                        {/* Sub-topic header */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-widest">
                            {sub.name}
                          </h3>
                          <div className="flex-1 h-px bg-slate-100" />
                          <span className="text-xs text-slate-400">
                            {sub.questions.filter((q) => q.solved).length}/{sub.questions.length}
                          </span>
                        </div>

                        {/* Questions */}
                        <div className="space-y-3">
                          {sub.questions.map((q, qIdx) => {
                            const diff = difficultyConfig(q.difficulty);
                            return (
                              <div
                                key={q.id}
                                className={cn(
                                  "rounded-xl border p-4 space-y-3 transition-all duration-300",
                                  q.solved
                                    ? "border-emerald-200 bg-emerald-50/40"
                                    : q.showResult
                                    ? "border-rose-200 bg-rose-50/30"
                                    : "border-slate-200 bg-white hover:border-slate-300"
                                )}
                              >
                                {/* Question header */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-2.5">
                                    {/* solved indicator */}
                                    <span
                                      className={cn(
                                        "mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all duration-300",
                                        q.solved
                                          ? "bg-emerald-500 text-white"
                                          : "bg-slate-100 text-slate-400"
                                      )}
                                    >
                                      {q.solved ? "✓" : qIdx + 1}
                                    </span>
                                    <p className="text-sm font-medium text-slate-800 leading-relaxed">
                                      {q.question}
                                    </p>
                                  </div>
                                  <span
                                    className={cn(
                                      "flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full",
                                      diff.pill
                                    )}
                                  >
                                    {diff.label}
                                  </span>
                                </div>

                                {/* Options grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {["A", "B", "C", "D"].map((opt) => {
                                    const isCorrect = q.showResult && opt === q.correctOption;
                                    const isWrong = q.showResult && opt === q.selectedOption && opt !== q.correctOption;
                                    return (
                                      <div
                                        key={opt}
                                        onClick={() =>
                                          !q.showResult &&
                                          handleOptionClick(q.id, opt, q.correctOption)
                                        }
                                        className={cn(
                                          "flex items-center gap-2.5 border rounded-lg px-3 py-2.5 text-sm transition-all duration-250 select-none",
                                          getOptionStyle(q, opt)
                                        )}
                                      >
                                        {/* Option letter badge */}
                                        <span
                                          className={cn(
                                            "w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center text-xs font-bold transition-colors duration-200",
                                            isCorrect
                                              ? "bg-emerald-500 text-white"
                                              : isWrong
                                              ? "bg-rose-500 text-white"
                                              : "bg-slate-100 text-slate-500"
                                          )}
                                        >
                                          {opt}
                                        </span>
                                        <span className="leading-snug flex-1">
                                          {q[`option${opt}` as keyof AptitudeQuestion]}
                                        </span>
                                        {isCorrect && (
                                          <span className="flex-shrink-0">
                                            <CheckIcon />
                                          </span>
                                        )}
                                        {isWrong && (
                                          <span className="flex-shrink-0">
                                            <XIcon />
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Result + Retry */}
                                {q.showResult && (
                                  <div className="flex items-center justify-between pt-1 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                    <div
                                      className={cn(
                                        "flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg",
                                        q.solved
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-rose-100 text-rose-700"
                                      )}
                                    >
                                      {q.solved ? (
                                        <>
                                          <CheckIcon />
                                          Correct! Well done
                                        </>
                                      ) : (
                                        <>
                                          <XIcon />
                                          Correct answer: <strong>{q.correctOption}</strong>
                                        </>
                                      )}
                                    </div>

                                    <button
                                      onClick={() => handleRetry(q.id)}
                                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-200 transition-all duration-200"
                                    >
                                      <RetryIcon />
                                      Try Again
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* ── EMPTY STATE ── */}
        {topics.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
              <BrainIcon />
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">No topics found</h3>
            <p className="text-sm text-slate-400">Check back later for new content.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AptitudeSheet;