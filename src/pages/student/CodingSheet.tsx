import { useEffect, useMemo, useState } from "react";
import { studentService } from "@/services/api";

// UI
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Icons
import { ExternalLink, Play } from "lucide-react";

// Progress component
import OverallProgress from "@/components/OverallProgress";

/* =======================
   TYPES
======================= */

type Difficulty = "EASY" | "MEDIUM" | "HARD";

interface CodingQuestion {
  id: number;
  title: string;
  difficulty: Difficulty;
  problemLink: string;
  videoLink?: string;
  solved: boolean;
}

interface CodingSubTopic {
  id: number;
  name: string;
  youtubeLink?: string;
  questions: CodingQuestion[];
}

interface CodingTopic {
  id: number;
  name: string;
  subTopics: CodingSubTopic[];
}

/* =======================
   HELPERS
======================= */

const difficultyVariant = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "EASY":
      return "secondary";
    case "MEDIUM":
      return "outline";
    case "HARD":
      return "destructive";
  }
};

/* =======================
   COMPONENT
======================= */

const CodingSheet = () => {
  const [topics, setTopics] = useState<CodingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  const [difficultyFilter, setDifficultyFilter] = useState<
    "ALL" | Difficulty
  >("ALL");

  const [showSolvedOnly, setShowSolvedOnly] = useState(false);

  /* =======================
     FETCH DATA
  ======================= */

  useEffect(() => {
    const fetchSheet = async () => {
      try {
        const data = await studentService.getCodingSheet();

        const mapped: CodingTopic[] = data.topics.map((t: any) => ({
          id: t.id,
          name: t.name,
          subTopics: t.subTopics.map((s: any) => ({
            id: s.id,
            name: s.name,
            youtubeLink: s.youtubeLink,
            questions: s.questions.map((q: any) => ({
              id: q.id,
              title: q.title,
              difficulty: q.difficulty,
              problemLink: q.problemLink,
              videoLink: q.videoLink,
              solved: q.solved ?? false,
            })),
          })),
        }));

        setTopics(mapped);
      } catch (e) {
        console.error("Failed to load coding sheet", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSheet();
  }, []);

  /* =======================
     TOGGLE SOLVED
  ======================= */

  const toggleSolved = async (questionId: number, solved: boolean) => {
    // Optimistic update
    setTopics((prev) =>
      prev.map((topic) => ({
        ...topic,
        subTopics: topic.subTopics.map((sub) => ({
          ...sub,
          questions: sub.questions.map((q) =>
            q.id === questionId ? { ...q, solved } : q
          ),
        })),
      }))
    );

    try {
      await studentService.updateQuestionProgress(questionId, solved);
    } catch (e) {
      console.error("Progress update failed", e);

      // rollback
      setTopics((prev) =>
        prev.map((topic) => ({
          ...topic,
          subTopics: topic.subTopics.map((sub) => ({
            ...sub,
            questions: sub.questions.map((q) =>
              q.id === questionId ? { ...q, solved: !solved } : q
            ),
          })),
        }))
      );
    }
  };

  /* =======================
     PROGRESS CALCULATION
  ======================= */

  const flatQuestions = useMemo(() => {
    return topics.flatMap((t) =>
      t.subTopics.flatMap((s) => s.questions)
    );
  }, [topics]);

  const total = flatQuestions.length;
  const solved = flatQuestions.filter((q) => q.solved).length;

  const difficultyStats = {
    EASY: {
      solved: flatQuestions.filter(
        (q) => q.difficulty === "EASY" && q.solved
      ).length,
      total: flatQuestions.filter((q) => q.difficulty === "EASY").length,
    },
    MEDIUM: {
      solved: flatQuestions.filter(
        (q) => q.difficulty === "MEDIUM" && q.solved
      ).length,
      total: flatQuestions.filter((q) => q.difficulty === "MEDIUM").length,
    },
    HARD: {
      solved: flatQuestions.filter(
        (q) => q.difficulty === "HARD" && q.solved
      ).length,
      total: flatQuestions.filter((q) => q.difficulty === "HARD").length,
    },
  };

  /* =======================
     FILTERED QUESTIONS
  ======================= */

  const filterQuestion = (q: CodingQuestion) => {
    if (difficultyFilter !== "ALL" && q.difficulty !== difficultyFilter)
      return false;
    if (showSolvedOnly && !q.solved) return false;
    return true;
  };

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading coding sheet...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Coding Sheet</h1>
        <p className="text-muted-foreground">
          Practice curated DSA problems and track your progress
        </p>
      </div>

      {/* OVERALL PROGRESS */}
      <OverallProgress
        solved={solved}
        total={total}
        easy={difficultyStats.EASY}
        medium={difficultyStats.MEDIUM}
        hard={difficultyStats.HARD}
      />

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="sm"
          variant={difficultyFilter === "ALL" ? "default" : "outline"}
          onClick={() => setDifficultyFilter("ALL")}
        >
          All
        </Button>

        {(["EASY", "MEDIUM", "HARD"] as Difficulty[]).map((d) => (
          <Button
            key={d}
            size="sm"
            variant={difficultyFilter === d ? "default" : "outline"}
            onClick={() => setDifficultyFilter(d)}
          >
            {d}
          </Button>
        ))}

        <div className="flex items-center gap-2 ml-auto">
          <Checkbox
            checked={showSolvedOnly}
            onCheckedChange={(v) => setShowSolvedOnly(Boolean(v))}
          />
          <span className="text-sm">Solved only</span>
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

            <AccordionContent className="space-y-4">
              <Accordion type="multiple" className="space-y-2">
                {topic.subTopics.map((sub) => (
                  <AccordionItem
                    key={sub.id}
                    value={`sub-${sub.id}`}
                    className="border rounded-lg px-3"
                  >
                    <AccordionTrigger className="text-sm font-medium">
                      {sub.name}
                    </AccordionTrigger>

                    <AccordionContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Problem</TableHead>
                            <TableHead>Resource</TableHead>
                            <TableHead>Practice</TableHead>
                            <TableHead>Difficulty</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {sub.questions
                            .filter(filterQuestion)
                            .map((q) => (
                              <TableRow key={q.id}>
                                <TableCell>
                                  <Checkbox
                                    checked={q.solved}
                                    onCheckedChange={() =>
                                      toggleSolved(q.id, !q.solved)
                                    }
                                  />
                                </TableCell>

                                <TableCell className="font-medium">
                                  {q.title}
                                </TableCell>

                                <TableCell>
                                  {q.videoLink ? (
                                    <a
                                      href={q.videoLink}
                                      target="_blank"
                                      className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                                    >
                                      <Play className="w-4 h-4" />
                                      Video
                                    </a>
                                  ) : (
                                    "---"
                                  )}
                                </TableCell>

                                <TableCell>
                                  <a
                                    href={q.problemLink}
                                    target="_blank"
                                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    Solve
                                  </a>
                                </TableCell>

                                <TableCell>
                                  <Badge
                                    variant={difficultyVariant(q.difficulty)}
                                  >
                                    {q.difficulty}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
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
};

export default CodingSheet;
