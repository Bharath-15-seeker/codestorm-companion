import { useEffect, useState } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";
import clsx from "clsx";

/* ---------- HELPER ---------- */
const mapCorrectOption = (
  opt: "A" | "B" | "C" | "D"
): "optionA" | "optionB" | "optionC" | "optionD" =>
  `option${opt}` as any;

/* ---------- TYPES ---------- */
interface Question {
  id: number;
  title: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  difficulty: string;
  correctOption: "A" | "B" | "C" | "D";
}

interface SubTopic {
  id: number;
  name: string;
  questions: Question[];
}

interface Topic {
  id: number;
  name: string;
  subTopics: SubTopic[];
}

/* ---------- COMPONENT ---------- */
export default function AptitudeSheet() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [answers, setAnswers] = useState<
    Record<number, { selected: string; locked: boolean }>
  >({});

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/sheets/aptitude")
      .then((res) => setTopics(res.data.topics))
      .catch(console.error);
  }, []);

  const handleAnswer = (qId: number, option: string) => {
    setAnswers((prev) => {
      if (prev[qId]?.locked) return prev;
      return {
        ...prev,
        [qId]: { selected: option, locked: true },
      };
    });
  };

  const resetQuestion = (qId: number) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Aptitude Sheet</h1>
        <p className="text-muted-foreground">
          Improve logical reasoning and quantitative aptitude
        </p>
      </div>

      {/* ---------- TOPIC ACCORDION ---------- */}
      <Accordion type="single" collapsible className="space-y-4">
        {topics.map((topic) => (
          <AccordionItem
            key={topic.id}
            value={`topic-${topic.id}`}
          >
            <AccordionTrigger className="text-lg font-semibold">
              {topic.name}
            </AccordionTrigger>

            <AccordionContent>
              {/* ---------- SUBTOPIC ACCORDION ---------- */}
              <Accordion
                type="single"
                collapsible
                className="space-y-3"
              >
                {topic.subTopics.map((sub) => (
                  <AccordionItem
                    key={sub.id}
                    value={`sub-${sub.id}`}
                  >
                 <AccordionTrigger className="w-full flex items-center justify-between text-left">
  <div className="flex items-center gap-2">
    <Brain className="w-4 h-4 text-primary" />
    <span>{sub.name}</span>
  </div>
</AccordionTrigger>


                    <AccordionContent>
                      <Card className="rounded-2xl">
                        <CardContent className="p-4 space-y-4">
                          {/* QUESTIONS */}
                          {sub.questions.map((q) => {
                            const answer = answers[q.id];
                            const locked =
                              answer?.locked === true;
                            const selected = answer?.selected;
                            const correctKey =
                              mapCorrectOption(
                                q.correctOption
                              );
                            const isCorrect =
                              selected === correctKey;

                            return (
                              <div
                                key={q.id}
                                className="border rounded-xl p-4 space-y-3"
                              >
                                {/* Question header */}
                                <div className="flex justify-between items-center">
                                  <p className="font-medium">
                                    {q.title}
                                  </p>
                                  <div className="flex gap-2 items-center">
                                    <Badge variant="secondary">
                                      {q.difficulty}
                                    </Badge>
                                    {locked && (
                                      <button
                                        onClick={() =>
                                          resetQuestion(
                                            q.id
                                          )
                                        }
                                        className="text-xs px-2 py-1 rounded-md border hover:bg-muted"
                                      >
                                        🔄
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Options */}
                                <div className="grid grid-cols-2 gap-3">
                                  {(
                                    [
                                      "optionA",
                                      "optionB",
                                      "optionC",
                                      "optionD",
                                    ] as const
                                  ).map((opt) => (
                                    <button
                                      key={opt}
                                      disabled={locked}
                                      onClick={() =>
                                        handleAnswer(
                                          q.id,
                                          opt
                                        )
                                      }
                                      className={clsx(
                                        "border rounded-lg p-2 text-left",
                                        locked &&
                                          opt ===
                                            correctKey &&
                                          "bg-green-100 border-green-500",
                                        locked &&
                                          selected ===
                                            opt &&
                                          opt !==
                                            correctKey &&
                                          "bg-red-100 border-red-500",
                                        !locked &&
                                          "hover:bg-muted"
                                      )}
                                    >
                                      {q[opt]}
                                    </button>
                                  ))}
                                </div>

                                {/* Explanation */}
                                {locked && (
                                  <div
                                    className={clsx(
                                      "p-3 rounded-lg text-sm font-medium",
                                      isCorrect
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    )}
                                  >
                                    {isCorrect ? (
                                      <>✅ Correct!</>
                                    ) : (
                                      <>
                                        ❌ Incorrect.
                                        <br />
                                        <b>
                                          Correct Answer:
                                        </b>{" "}
                                        {q[correctKey]}
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
