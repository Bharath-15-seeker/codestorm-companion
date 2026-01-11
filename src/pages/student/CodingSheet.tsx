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
import { ExternalLink, Play } from "lucide-react";


/* =======================
   UI DTO TYPES (IMPORTANT)
   ======================= */

interface CodingQuestion {
  id: number;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  problemLink: string;
  videoLink?: string;
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

const CodingSheet = () => {
  const [topics, setTopics] = useState<CodingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSheet = async () => {
      try {
        const data = await studentService.getCodingSheet();

        // 🔥 Normalize backend → UI
        const mappedTopics: CodingTopic[] = (data.topics || []).map((t: any) => ({
          id: t.id,
          name: t.name,
          subTopics: (t.subTopics || []).map((s: any) => ({
            id: s.id,
            name: s.name,
            youtubeLink: s.youtubeLink,
            questions: (s.questions || []).map((q: any) => ({
              id: q.id,
              title: q.title,
              difficulty: q.difficulty,
              problemLink: q.problemLink,
              videoLink: q.videoLink,
            })),
          })),
        }));

        setTopics(mappedTopics);
      } catch (error) {
        console.error("Failed to load coding sheet", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSheet();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading coding sheet...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Coding Sheet
        </h1>
        <p className="text-muted-foreground">
          Practice curated DSA problems and track your progress
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
                            <TableHead>Problem</TableHead>
                            <TableHead>Resource</TableHead>
                            <TableHead>Practice</TableHead>
                            <TableHead>Difficulty</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {sub.questions.map((q) => (
                            <TableRow key={q.id}>
  {/* Status */}
  <TableCell>
    <Checkbox />
  </TableCell>

  {/* Problem title */}
  <TableCell className="font-medium">
    {q.title}
  </TableCell>

  {/* Resource → VIDEO ONLY */}
  <TableCell>
    {q.videoLink ? (
      <a
        href={q.videoLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
      >
        <Play className="w-4 h-4" />
        Video
      </a>
    ) : (
      <span className="text-muted-foreground">---</span>
    )}
  </TableCell>

  {/* Practice → PROBLEM LINK ONLY */}
  <TableCell>
    <a
      href={q.problemLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
    >
      <ExternalLink className="w-4 h-4" />
      Solve
    </a>
  </TableCell>

  {/* Difficulty */}
  <TableCell>
    <Badge variant={difficultyVariant(q.difficulty)}>
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
