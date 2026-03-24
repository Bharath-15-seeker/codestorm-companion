import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Trophy, BookOpen, Loader2 } from "lucide-react";
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
  registered: boolean;
};

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [tab, setTab] = useState<"UPCOMING" | "COMPLETED">("UPCOMING");
  const [typeFilter, setTypeFilter] = useState<"ALL" | EventType>("ALL");
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://demo-deployment-latest-dfxy.onrender.com/api/events", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://demo-deployment-latest-dfxy.onrender.com/api/events/${eventId}/register`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed");

      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, registered: true } : e))
      );

      toast({
        title: "Registered!",
        description: "You have successfully registered for the event.",
      });
    } catch (err) {
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoadingId(null);
    }
  };

  const unregisterEvent = async (eventId: number) => {
    try {
      setLoadingId(eventId);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://demo-deployment-latest-dfxy.onrender.com/api/events/${eventId}/unregister`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to unregister");

      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, registered: false } : e))
      );

      toast({
        title: "Unregistered",
        description: "You have successfully unregistered from the event.",
      });
    } catch (err) {
      toast({
        title: "Unregister failed",
        description: "Could not cancel registration. Please try again.",
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
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === "UPCOMING"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setTab("COMPLETED")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === "COMPLETED"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
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
              className={`px-3 py-2 rounded-md text-sm transition-colors ${
                typeFilter === t
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
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
          <Card key={event.id} className="rounded-2xl shadow-sm">
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
                  Reg: {event.registrationOpenDate} → {event.registrationCloseDate}
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

              <div className="flex gap-2">
                {event.status === "REGISTRATION_OPEN" ? (
                  event.registered ? (
                    <button
                      onClick={() => unregisterEvent(event.id)}
                      disabled={loadingId === event.id}
                      className="px-4 py-2 rounded-md bg-destructive/10 text-destructive border border-destructive/20 text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition-all flex items-center gap-2"
                    >
                      {loadingId === event.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Unregister"
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => registerEvent(event.id)}
                      disabled={loadingId === event.id}
                      className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      {loadingId === event.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        "Register Now"
                      )}
                    </button>
                  )
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
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No events found for the selected category.
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;