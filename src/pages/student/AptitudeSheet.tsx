import { useEffect, useState } from "react";
import { studentService } from "@/services/api";

// shadcn UI
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

// icons
import { ExternalLink } from "lucide-react";

/* =======================
   UI DTO TYPES
   ======================= */

interface AptitudeQuestion {
  id: number;
  question: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
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

/* =======================
   Helpers
   ======================= */

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

/* =======================
   Component
   ======================= */

const AptitudeSheet = () => {
  const [topics, setTopics] = useState<AptitudeTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSheet = async () => {
      try {
        const data = await studentService.getAptitudeSheet();

        // 🔥 Normalize backend → UI
        const mappedTopics: AptitudeTopic[] = (data.topics || []).map(
          (t: any) => ({
            id: t.id,
            name: t.name,
            subTopics: (t.subTopics || []).map((s: any) => ({
              id: s.id,
              name: s.name,
              questions: (s.questions || []).map((q: any) => ({
                id: q.id,
                question: q.question,
                difficulty: q.difficulty,
                solved: q.solved, // 👈 IMPORTANT
              })),
            })),
          })
        );

        setTopics(mappedTopics);
      } catch (error) {
        console.error("Failed to load aptitude sheet", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSheet();
  }, []);

  /* =======================
     Progress Toggle
     ======================= */

  const toggleSolved = async (questionId: number, solved: boolean) => {
    // Optimistic UI update
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
    } catch (error) {
      console.error("Failed to update aptitude progress", error);

      // Revert on failure
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
     UI
     ======================= */

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading aptitude sheet...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Aptitude Sheet
        </h1>
        <p className="text-muted-foreground">
          Practice aptitude questions and track your progress
        </p>
      </div>

      {/* =======================
          TOPIC ACCORDION
         ======================= */}
      <Accordion type="multiple" className="space-y-4">
        {topics.map((topic) => (
          <AccordionItem
            key={topic.id}
            value={`topic-${topic.id}`}
            className="border rounded-xl px-4"
          >
            {/* Topic */}
            <AccordionTrigger className="text-lg font-semibold">
              {topic.name}
            </AccordionTrigger>

            <AccordionContent className="space-y-4">
              {/* =======================
                  SUBTOPIC ACCORDION
                 ======================= */}
              <Accordion type="multiple" className="space-y-2">
                {topic.subTopics.map((sub) => (
                  <AccordionItem
                    key={sub.id}
                    value={`sub-${sub.id}`}
                    className="border rounded-lg px-3"
                  >
                    {/* Subtopic */}
                    <AccordionTrigger className="text-sm font-medium">
                      {sub.name}
                    </AccordionTrigger>

                    <AccordionContent>
                      {/* =======================
                          QUESTIONS TABLE
                         ======================= */}
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Question</TableHead>
                            <TableHead>Practice</TableHead>
                            <TableHead>Difficulty</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {sub.questions.map((q) => (
                            <TableRow key={q.id}>
                              {/* Status */}
                              <TableCell>
                                <Checkbox
                                  checked={!!q.solved}
                                  onCheckedChange={(checked) =>
                                    toggleSolved(q.id, Boolean(checked))
                                  }
                                />
                              </TableCell>

                              {/* Question */}
                              <TableCell className="font-medium">
                                {q.question}
                              </TableCell>

                              {/* Practice */}
                              <TableCell>
                                <a
                                  href="#"
                                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Practice
                                </a>
                              </TableCell>

                              {/* Difficulty */}
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

export default AptitudeSheet;
