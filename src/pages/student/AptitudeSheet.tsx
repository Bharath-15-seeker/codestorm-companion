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

const difficultyVariant = (difficulty: string) => {
  switch (difficulty) {
    case "EASY":
      return "secondary";
    case "MEDIUM":
      return "outline";
    case "HARD":
      return "destructive";
    default:
      return "default";
  }
};

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
    const res = await axios.get(
      `http://localhost:8081/api/progress/aptitude?userId=${USER_ID}`
    );
    setProgress(res.data);
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
              ? {
                  ...q,
                  selectedOption: option,
                  showResult: true,
                  solved: isCorrect,
                }
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
              ? {
                  ...q,
                  selectedOption: undefined,
                  showResult: false,
                  solved: false,
                }
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
    if (!q.showResult) return "hover:bg-muted cursor-pointer";

    if (option === q.correctOption)
      return "bg-green-100 border-green-500 text-green-700";

    if (option === q.selectedOption)
      return "bg-red-100 border-red-500 text-red-700";

    return "opacity-60";
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">

      {/* HEADER + PROGRESS */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Aptitude Cheat Sheet</h1>

        <div className="w-60 space-y-2">
          <Progress
            value={progress.progressPercentage}
            className="transition-all duration-700"
          />
          <div className="text-sm text-right text-muted-foreground">
            {progress.solvedQuestions}/{progress.totalQuestions}
          </div>
        </div>
      </div>

      {/* TOPICS */}
      <Accordion type="multiple" className="space-y-4">
        {topics.map((topic) => (
          <AccordionItem
            key={topic.id}
            value={`topic-${topic.id}`}
            className="border rounded-xl px-4"
          >
            <AccordionTrigger className="text-lg font-semibold">
              {topic.name}
            </AccordionTrigger>

            <AccordionContent>
              {topic.subTopics.map((sub) => (
                <div key={sub.id} className="mb-6">
                  <h3 className="font-semibold mb-3">{sub.name}</h3>

                  {sub.questions.map((q) => (
                    <div
                      key={q.id}
                      className="border rounded-lg p-4 mb-4 space-y-3 transition-all duration-500"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{q.question}</p>
                        <Badge variant={difficultyVariant(q.difficulty)}>
                          {q.difficulty}
                        </Badge>
                      </div>

                      {/* OPTIONS */}
                      {["A", "B", "C", "D"].map((opt) => (
                        <div
                          key={opt}
                          onClick={() =>
                            !q.showResult &&
                            handleOptionClick(q.id, opt, q.correctOption)
                          }
                          className={cn(
                            "border p-2 rounded-md transition-all duration-300",
                            getOptionStyle(q, opt)
                          )}
                        >
                          {opt}. {q[`option${opt}` as keyof AptitudeQuestion]}
                        </div>
                      ))}

                      {/* RESULT + RETRY */}
                      {q.showResult && (
                        <div className="space-y-3 animate-in fade-in duration-500">

                          <div className="text-sm font-medium">
                            Correct Answer: {q.correctOption}
                          </div>

                          <Button
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300"
                            onClick={() => handleRetry(q.id)}
                          >
                            Retry
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default AptitudeSheet;
