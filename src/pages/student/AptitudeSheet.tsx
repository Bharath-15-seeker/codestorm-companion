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
  youtubeLink?: string;
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
        pill: "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100",
      };
    case "MEDIUM":
      return {
        variant: "outline" as const,
        label: "Medium",
        dot: "bg-amber-400",
        pill: "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100",
      };
    case "HARD":
      return {
        variant: "destructive" as const,
        label: "Hard",
        dot: "bg-rose-500",
        pill: "bg-rose-50 text-rose-700 border border-rose-200 ring-1 ring-rose-100",
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

/* ─── Icons ─── */
const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#10b981" />
    <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="#f43f5e" />
    <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const RetryIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const BrainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.8A3 3 0 0 1 4 12a3 3 0 0 1 .58-1.77 2.5 2.5 0 0 1 0-3.46A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.8A3 3 0 0 0 20 12a3 3 0 0 0-.58-1.77 2.5 2.5 0 0 0 0-3.46A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const PlayIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" />
  </svg>
);

const ChevronDown = () => (
  <svg className="w-4 h-4 text-slate-400 transition-transform duration-300 group-data-[state=open]:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.5 6H18l-4.5 3 1.5 6-4.5-3-4.5 3 1.5-6L3 9h4.5z" />
  </svg>
);

/* ─── Subtopic YouTube Button ─── */
const WatchVideoButton = ({ link }: { link: string }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => e.stopPropagation()}
    className={cn(
      "group/btn inline-flex items-center gap-1.5 text-xs font-semibold",
      "px-3 py-1.5 rounded-lg border transition-all duration-200 select-none",
      "bg-white border-rose-200 text-rose-600",
      "hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-md hover:shadow-rose-200/50",
      "active:scale-95"
    )}
  >
    <span className="transition-colors duration-200">
      <YoutubeIcon />
    </span>
    <span className="hidden sm:inline">Watch</span>
  </a>
);

/* ─── Skeleton loader ─── */
const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-slate-200/70 rounded-lg", className)} />
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
              youtubeLink: s.youtubeLink,
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
      return "hover:bg-indigo-50/80 hover:border-indigo-300 cursor-pointer hover:shadow-sm hover:shadow-indigo-100 active:scale-[0.985] active:shadow-none";

    if (option === q.correctOption)
      return "bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm shadow-emerald-100/80";

    if (option === q.selectedOption)
      return "bg-rose-50 border-rose-300 text-rose-900 shadow-sm shadow-rose-100/80";

    return "opacity-35 cursor-default pointer-events-none";
  };

  /* ================= LOADING ================= */
  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 flex flex-col">
        {/* Skeleton header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="w-10 h-10 rounded-xl" />
              <div className="space-y-1.5">
                <SkeletonBlock className="w-32 h-4 rounded" />
                <SkeletonBlock className="w-24 h-3 rounded" />
              </div>
            </div>
            <SkeletonBlock className="w-48 h-7 rounded-full" />
          </div>
        </div>
        {/* Skeleton cards */}
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 pt-8 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <SkeletonBlock className="w-8 h-8 rounded-lg" />
                <SkeletonBlock className="flex-1 h-4 rounded max-w-xs" />
              </div>
              <SkeletonBlock className="w-full h-2 rounded-full" />
            </div>
          ))}
          <div className="flex justify-center pt-6 gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );

  const pct = progress.progressPercentage;

  const progressColor =
    pct >= 80
      ? "from-emerald-400 to-emerald-500"
      : pct >= 40
      ? "from-amber-400 to-orange-400"
      : "from-indigo-500 to-violet-500";

  const progressBadgeStyle =
    pct >= 80
      ? "bg-emerald-100 text-emerald-700"
      : pct >= 40
      ? "bg-amber-100 text-amber-700"
      : "bg-indigo-100 text-indigo-700";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">

      {/* ══════════ HEADER ══════════ */}
      <div className="sticky top-0 z-20 bg-white/85 backdrop-blur-lg border-b border-slate-100/80 shadow-[0_1px_12px_rgba(99,102,241,0.06)]">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 py-3.5 flex items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200/60 flex-shrink-0">
              <BrainIcon />
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-slate-900 leading-tight tracking-tight">
                Aptitude Sheet
              </h1>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">Practice · Learn · Master</p>
            </div>
          </div>

          {/* Desktop Progress */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                <span className="text-[13px] text-slate-500">
                  <span className="font-bold text-slate-800">{progress.solvedQuestions}</span>
                  {" "}/{" "}
                  {progress.totalQuestions} solved
                </span>
                <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full", progressBadgeStyle)}>
                  {Math.round(pct)}%
                </span>
              </div>
              {/* Progress track */}
              <div className="w-48 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out relative overflow-hidden",
                    progressColor
                  )}
                  style={{ width: `${pct}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_1.8s_infinite] w-[200%] -translate-x-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: just the badge */}
          <div className="sm:hidden flex items-center gap-2">
            <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full", progressBadgeStyle)}>
              {Math.round(pct)}%
            </span>
          </div>
        </div>
      </div>

      {/* ══════════ MAIN ══════════ */}
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 pt-6 pb-20 flex-1 space-y-4">

        {/* Mobile progress card */}
        <div className="sm:hidden bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <SparkleIcon />
              Your Progress
            </span>
            <span className={cn("text-sm font-bold px-2.5 py-0.5 rounded-full", progressBadgeStyle)}>
              {Math.round(pct)}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", progressColor)}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            {progress.solvedQuestions} of {progress.totalQuestions} questions solved
          </p>
        </div>

        {/* ══ TOPICS ACCORDION ══ */}
       {/* ══ TOPICS ACCORDION ══ */}
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
        className="bg-white border rounded-2xl overflow-hidden"
      >
        {/* 🔹 TOPIC HEADER */}
        <AccordionTrigger className="px-5 py-4 hover:no-underline group [&>svg]:hidden">
          <div className="flex items-center justify-between w-full gap-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                {topicIdx + 1}
              </span>
              <span className="font-semibold text-slate-800">
                {topic.name}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">
                {solvedQ}/{totalQ}
              </span>
              <ChevronDown />
            </div>
          </div>
        </AccordionTrigger>

        {/* 🔹 TOPIC CONTENT → SUBTOPICS */}
        <AccordionContent className="px-5 pb-5">

          {/* ✅ NEW: SUBTOPIC ACCORDION */}
          <Accordion type="multiple" className="space-y-4">

            {topic.subTopics.map((sub) => (
              <AccordionItem key={sub.id} value={`sub-${sub.id}`} className="border-none">

                {/* 🔹 SUBTOPIC HEADER */}
                <AccordionTrigger className="hover:no-underline px-0 py-2 group [&>svg]:hidden">
                  <div className="flex items-center gap-2.5 w-full">

                    <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-indigo-400 to-violet-500" />

                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.12em]">
                      {sub.name}
                    </h3>

                    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />

                    <span className="text-[11px] text-slate-400">
                      {sub.questions.filter((q) => q.solved).length}/{sub.questions.length}
                    </span>

                    {sub.youtubeLink && (
                      <WatchVideoButton link={sub.youtubeLink} />
                    )}

                    <ChevronDown />
                  </div>
                </AccordionTrigger>

                {/* 🔹 QUESTIONS (ONLY ON SUBTOPIC CLICK) */}
                <AccordionContent className="pt-3 space-y-3">

                  {sub.questions.map((q, qIdx) => {
                    const diff = difficultyConfig(q.difficulty);

                    return (
                      <div
                        key={q.id}
                        className={cn(
                          "rounded-xl border p-4 space-y-3",
                          q.solved
                            ? "border-emerald-200 bg-emerald-50"
                            : q.showResult
                            ? "border-rose-200 bg-rose-50"
                            : "border-slate-200 bg-white"
                        )}
                      >
                        {/* Question */}
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">
                            {qIdx + 1}. {q.question}
                          </p>

                          <span className={cn("text-xs px-2 py-1 rounded", diff.pill)}>
                            {diff.label}
                          </span>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {["A", "B", "C", "D"].map((opt) => {
                            const isCorrect = q.showResult && opt === q.correctOption;
                            const isWrong =
                              q.showResult &&
                              opt === q.selectedOption &&
                              opt !== q.correctOption;

                            return (
                              <div
                                key={opt}
                                onClick={() =>
                                  !q.showResult &&
                                  handleOptionClick(q.id, opt, q.correctOption)
                                }
                                className={cn(
                                  "border rounded-lg px-3 py-2 cursor-pointer",
                                  getOptionStyle(q, opt)
                                )}
                              >
                                <span className="font-semibold mr-2">{opt}.</span>
                                {q[`option${opt}` as keyof AptitudeQuestion]}

                                {isCorrect && " ✅"}
                                {isWrong && " ❌"}
                              </div>
                            );
                          })}
                        </div>

                        {/* Result */}
                        {q.showResult && (
                          <div className="flex justify-between items-center mt-2">
                            <span
                              className={cn(
                                "text-sm font-semibold",
                                q.solved ? "text-green-600" : "text-red-600"
                              )}
                            >
                              {q.solved
                                ? "Correct!"
                                : `Answer: ${q.correctOption}`}
                            </span>

                            <button
                              onClick={() => handleRetry(q.id)}
                              className="text-xs text-blue-600"
                            >
                              Retry
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    );
  })}
</Accordion>
        {/* ══ EMPTY STATE ══ */}
        {topics.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center mb-4 shadow-sm">
              <BrainIcon />
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">No topics found</h3>
            <p className="text-sm text-slate-400">Check back later for new content.</p>
          </div>
        )}
      </div>

      {/* shimmer keyframe injection */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default AptitudeSheet;