import { useEffect, useState } from "react";
import api from "@/services/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { toast } from "@/components/ui/use-toast";
import { Pencil, Trash2, X, Check, Plus } from "lucide-react";

type SheetType = "CODING" | "APTITUDE";

const AdminContentManager = () => {
  const [sheet, setSheet] = useState<SheetType>("CODING");
  const [topics, setTopics] = useState<any[]>([]);
  const [newTopic, setNewTopic] = useState("");

  // Edit States for Topics and Subtopics
  const [editingTopicId, setEditingTopicId] = useState<number | null>(null);
  const [editTopicValue, setEditTopicValue] = useState("");
  const [editingSubId, setEditingSubId] = useState<number | null>(null);
  const [editSubValue, setEditSubValue] = useState("");

  // Question Management States
  const [subtopicInputs, setSubtopicInputs] = useState<Record<number, string>>({});
  const [questionForms, setQuestionForms] = useState<Record<number, any>>({});
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);

  /* ================= LOAD DATA ================= */
  const loadSheet = async () => {
    try {
      const endpoint = sheet === "CODING" ? "/api/sheets/coding" : "/api/sheets/aptitude";
      const res = await api.get(endpoint);
      setTopics(res.data.topics || []);
    } catch (error) {
      toast({ title: "Error loading content", variant: "destructive" });
    }
  };

  useEffect(() => {
    loadSheet();
  }, [sheet]);

  /* ================= TOPIC ACTIONS ================= */
  const createTopic = async () => {
    if (!newTopic) return;
    const sheetId = sheet === "CODING" ? 1 : 2;
    await api.post("/api/admin/topics", { sheetId, name: newTopic, orderIndex: topics.length + 1 });
    toast({ title: "Topic created" });
    setNewTopic("");
    loadSheet();
  };

  const updateTopic = async (topicId: number) => {
    await api.put(`/api/admin/topics/${topicId}`, { name: editTopicValue });
    setEditingTopicId(null);
    loadSheet();
  };

  const deleteTopic = async (topicId: number) => {
    if (!confirm("Delete topic and all nested content?")) return;
    await api.delete(`/api/admin/topics/${topicId}`);
    loadSheet();
  };

  /* ================= SUBTOPIC ACTIONS ================= */
  const createSubtopic = async (topicId: number) => {
    const name = subtopicInputs[topicId];
    if (!name) return;
    await api.post("/api/admin/subtopics", { topicId, name, youtubeLink: "" });
    setSubtopicInputs(prev => ({ ...prev, [topicId]: "" }));
    loadSheet();
  };

  const updateSubtopic = async (subId: number) => {
    await api.put(`/api/admin/subtopics/${subId}`, { name: editSubValue });
    setEditingSubId(null);
    loadSheet();
  };

  const deleteSubtopic = async (subId: number) => {
    if (!confirm("Delete subtopic?")) return;
    await api.delete(`/api/admin/subtopics/${subId}`);
    loadSheet();
  };

  /* ================= QUESTION ACTIONS ================= */
  const handleQuestionSubmit = async (subTopicId: number) => {
    const form = questionForms[subTopicId];
    if (!form || !form.title) return;

    try {
      if (editingQuestionId) {
        await api.put(`/api/admin/questions/${editingQuestionId}`, { ...form });
        toast({ title: "Question updated successfully" });
      } else {
        const endpoint = sheet === "CODING" ? "/api/admin/questions/coding" : "/api/admin/questions/aptitude";
        await api.post(endpoint, { subTopicId, ...form });
        toast({ title: "Question created successfully" });
      }
      
      setEditingQuestionId(null);
      setQuestionForms(prev => ({ ...prev, [subTopicId]: {} }));
      loadSheet();
    } catch (error) {
      toast({ title: "Action failed", variant: "destructive" });
    }
  };

  const startEditQuestion = (subTopicId: number, question: any) => {
    setEditingQuestionId(question.id);
    setQuestionForms(prev => ({
      ...prev,
      [subTopicId]: { ...question }
    }));
  };

  const deleteQuestion = async (qId: number) => {
    if (!confirm("Delete question?")) return;
    await api.delete(`/api/admin/questions/${qId}`);
    loadSheet();
  };

  return (
    <div className="space-y-6 p-6 w-full">
      <div>
        <h1 className="text-2xl font-bold">Content Management</h1>
        <p className="text-muted-foreground">Manage Topics, Subtopics & Questions</p>
      </div>

      <Tabs value={sheet} onValueChange={(v) => { setSheet(v as SheetType); setEditingQuestionId(null); }}>
        <TabsList>
          <TabsTrigger value="CODING">Coding</TabsTrigger>
          <TabsTrigger value="APTITUDE">Aptitude</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ADD TOPIC CARD */}
      <Card className="w-full">
        <CardHeader><CardTitle className="text-sm font-medium">Create New Topic</CardTitle></CardHeader>
        <CardContent className="flex gap-3">
          <Input placeholder="Topic name" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} />
          <Button onClick={createTopic}><Plus className="w-4 h-4 mr-2"/> Add Topic</Button>
        </CardContent>
      </Card>

      {/* TOPICS ACCORDION */}
      <Accordion type="multiple" className="space-y-4 w-full">
        {topics.map((topic) => (
          <AccordionItem key={topic.id} value={`topic-${topic.id}`} className="border rounded-lg px-4 bg-card shadow-sm">
            <div className="flex items-center gap-2">
              {editingTopicId === topic.id ? (
                <div className="flex items-center gap-2 py-3 flex-1">
                  <Input value={editTopicValue} onChange={(e) => setEditTopicValue(e.target.value)} className="h-9" />
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateTopic(topic.id)}><Check className="w-4 h-4"/></Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingTopicId(null)}><X className="w-4 h-4"/></Button>
                </div>
              ) : (
                <>
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline flex-1 py-4">
                    {topic.name}
                  </AccordionTrigger>
                  <div className="flex gap-1 pr-4">
                    <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); setEditingTopicId(topic.id); setEditTopicValue(topic.name); }}>
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); deleteTopic(topic.id); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </>
              )}
            </div>

            <AccordionContent className="space-y-4 pt-2 border-t">
              <div className="flex gap-3 mb-4 p-3 bg-secondary/30 rounded-lg">
                <Input
                  placeholder="New subtopic name..."
                  value={subtopicInputs[topic.id] || ""}
                  onChange={(e) => setSubtopicInputs(prev => ({ ...prev, [topic.id]: e.target.value }))}
                />
                <Button variant="outline" size="sm" onClick={() => createSubtopic(topic.id)}>Add Subtopic</Button>
              </div>

              <Accordion type="multiple" className="w-full space-y-2 pb-2">
                {topic.subTopics?.map((sub: any) => (
                  <AccordionItem key={sub.id} value={`sub-${sub.id}`} className="border rounded-md px-3 bg-background">
                    <div className="flex items-center gap-2">
                      {editingSubId === sub.id ? (
                        <div className="flex items-center gap-2 py-2 flex-1">
                          <Input value={editSubValue} onChange={(e) => setEditSubValue(e.target.value)} className="h-8" />
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateSubtopic(sub.id)}><Check className="w-3 h-3"/></Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingSubId(null)}><X className="w-3 h-3"/></Button>
                        </div>
                      ) : (
                        <>
                          <AccordionTrigger className="text-md font-medium py-3 flex-1">{sub.name}</AccordionTrigger>
                          <div className="flex gap-1 pr-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setEditingSubId(sub.id); setEditSubValue(sub.name); }}>
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={(e) => { e.stopPropagation(); deleteSubtopic(sub.id); }}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <AccordionContent className="space-y-4 pt-4 border-t mt-2">
                      {/* FORM */}
                      <div className={`grid gap-3 p-4 border rounded-lg shadow-sm ${editingQuestionId ? 'bg-blue-50/50 border-blue-200' : 'bg-muted/30'}`}>
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-sm text-primary">{editingQuestionId ? "Editing Question" : "Add New Question"}</h4>
                          {editingQuestionId && (
                            <Button variant="ghost" size="sm" onClick={() => { setEditingQuestionId(null); setQuestionForms(prev => ({ ...prev, [sub.id]: {} })); }}>Cancel Edit</Button>
                          )}
                        </div>
                        
                        <Input placeholder="Question Title" value={questionForms[sub.id]?.title || ""} onChange={(e) => setQuestionForms(prev => ({ ...prev, [sub.id]: { ...prev[sub.id], title: e.target.value, difficulty: prev[sub.id]?.difficulty || "EASY" } }))} />

                        <select className="border rounded-md px-3 py-2 w-full text-sm bg-background" value={questionForms[sub.id]?.difficulty || "EASY"} onChange={(e) => setQuestionForms(prev => ({ ...prev, [sub.id]: { ...prev[sub.id], difficulty: e.target.value } }))}>
                          <option value="EASY">Easy</option><option value="MEDIUM">Medium</option><option value="HARD">Hard</option>
                        </select>

                        {sheet === "CODING" ? (
                          <>
                            <Input placeholder="Problem Link" value={questionForms[sub.id]?.problemLink || ""} onChange={(e) => setQuestionForms(prev => ({ ...prev, [sub.id]: { ...prev[sub.id], problemLink: e.target.value } }))} />
                            <Input placeholder="Video Link" value={questionForms[sub.id]?.videoLink || ""} onChange={(e) => setQuestionForms(prev => ({ ...prev, [sub.id]: { ...prev[sub.id], videoLink: e.target.value } }))} />
                          </>
                        ) : (
                          <>
                            <div className="grid grid-cols-2 gap-2">
                              <Input placeholder="Option A" value={questionForms[sub.id]?.optionA || ""} onChange={(e) => setQuestionForms(prev => ({ ...prev, [sub.id]: { ...prev[sub.id], optionA: e.target.value } }))} />
                              <Input placeholder="Option B" value={questionForms[sub.id]?.optionB || ""} onChange={(e) => setQuestionForms(prev => ({ ...prev, [sub.id]: { ...prev[sub.id], optionB: e.target.value } }))} />
                              <Input placeholder="Option C" value={questionForms[sub.id]?.optionC || ""} onChange={(e) => setQuestionForms(prev => ({ ...prev, [sub.id]: { ...prev[sub.id], optionC: e.target.value } }))} />
                              <Input placeholder="Option D" value={questionForms[sub.id]?.optionD || ""} onChange={(e) => setQuestionForms(prev => ({ ...prev, [sub.id]: { ...prev[sub.id], optionD: e.target.value } }))} />
                            </div>
                            <select className="border rounded-md px-3 py-2 w-full text-sm bg-background" value={questionForms[sub.id]?.correctOption || "A"} onChange={(e) => setQuestionForms(prev => ({ ...prev, [sub.id]: { ...prev[sub.id], correctOption: e.target.value } }))}>
                              <option value="A">Correct Option A</option><option value="B">Correct Option B</option><option value="C">Correct Option C</option><option value="D">Correct Option D</option>
                            </select>
                            <Textarea placeholder="Explanation" value={questionForms[sub.id]?.explanation || ""} onChange={(e) => setQuestionForms(prev => ({ ...prev, [sub.id]: { ...prev[sub.id], explanation: e.target.value } }))} />
                            <Input placeholder="Video Link" value={questionForms[sub.id]?.videoLink || ""} onChange={(e) => setQuestionForms(prev => ({ ...prev, [sub.id]: { ...prev[sub.id], videoLink: e.target.value } }))} />
                          </>
                        )}
                        <Button className="w-full" variant={editingQuestionId ? "default" : "secondary"} onClick={() => handleQuestionSubmit(sub.id)}>
                          {editingQuestionId ? "Update Question" : "Add Question"}
                        </Button>
                      </div>

                      <div className="space-y-2 mt-4">
                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Questions</p>
                        {sub.questions?.map((q: any) => (
                          <div key={q.id} className="p-3 bg-muted/40 border rounded-md text-sm flex justify-between items-center group">
                            <div className="flex flex-col">
                              <span className="font-semibold">{q.title}</span>
                              <span className="text-[10px] text-muted-foreground uppercase">{q.difficulty}</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEditQuestion(sub.id, q)}><Pencil className="w-3.5 h-3.5" /></Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteQuestion(q.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                            </div>
                          </div>
                        ))}
                      </div>
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

export default AdminContentManager;