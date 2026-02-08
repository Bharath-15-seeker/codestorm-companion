import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Trophy, BookOpen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type EventStatus = "REGISTRATION_OPEN" | "REGISTRATION_CLOSED" | "COMPLETED";
type EventType = "CODING" | "APTITUDE";

type Event = {
  id: number;
  name: string;
  eventDate: string;
  registrationOpenDate: string;
  registrationCloseDate: string;
  status: EventStatus;
  type: EventType;
};

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [tab, setTab] = useState<"UPCOMING" | "COMPLETED">("UPCOMING");
  const [typeFilter, setTypeFilter] = useState<"ALL" | EventType>("ALL");
  const { toast } = useToast();

  useEffect(() => {
    fetch("http://localhost:8081/api/events")
      .then((res) => res.json())
      .then(setEvents)
      .catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const byTab =
        tab === "UPCOMING" ? e.status !== "COMPLETED" : e.status === "COMPLETED";
      const byType = typeFilter === "ALL" ? true : e.type === typeFilter;
      return byTab && byType;
    });
  }, [events, tab, typeFilter]);

  const registerEvent = async (eventId: number) => {
    try {
      setLoadingId(eventId);
      const res = await fetch(
        `http://localhost:8081/api/events/${eventId}/register`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Failed");
      toast({
        title: "Registered!",
        description: "You have successfully registered for the event.",
      });
    } catch {
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoadingId(null);
    }
  };

  const badgeClass = (status: EventStatus) =>
    status === "REGISTRATION_OPEN"
      ? "text-green-600 bg-green-100"
      : status === "REGISTRATION_CLOSED"
      ? "text-yellow-600 bg-yellow-100"
      : "text-gray-600 bg-gray-200";

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Events</h1>
        <p className="text-muted-foreground">
          Participate in coding contests and hackathons
        </p>
      </div>

      {/* Tabs + Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("UPCOMING")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              tab === "UPCOMING"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setTab("COMPLETED")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              tab === "COMPLETED"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Completed
          </button>
        </div>

        <div className="ml-auto flex gap-2">
          {(["ALL", "CODING", "APTITUDE"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-md text-sm ${
                typeFilter === t
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Event Cards */}
      <div className="space-y-4">
        {filtered.map((event) => (
          <Card key={event.id} className="rounded-2xl">
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle>{event.name}</CardTitle>
                <p className="text-muted-foreground text-sm mt-1">
                  Event Date: {event.eventDate}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClass(
                  event.status
                )}`}
              >
                {event.status.replace("_", " ")}
              </span>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Reg: {event.registrationOpenDate} →{" "}
                  {event.registrationCloseDate}
                </div>
                <div className="flex items-center gap-1">
                  {event.type === "CODING" ? (
                    <Trophy className="w-4 h-4" />
                  ) : (
                    <BookOpen className="w-4 h-4" />
                  )}
                  {event.type}
                </div>
              </div>

              {event.status === "REGISTRATION_OPEN" ? (
                <button
                  onClick={() => registerEvent(event.id)}
                  disabled={loadingId === event.id}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
                >
                  {loadingId === event.id ? "Registering..." : "Register"}
                </button>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 rounded-md bg-muted text-muted-foreground text-sm cursor-not-allowed"
                >
                  {event.status === "COMPLETED"
                    ? "Completed"
                    : "Registration Closed"}
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Events;
