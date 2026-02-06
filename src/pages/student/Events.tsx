import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Trophy, BookOpen } from "lucide-react";

type Event = {
  id: number;
  name: string;
  eventDate: string;
  registrationOpenDate: string;
  registrationCloseDate: string;
  status: "REGISTRATION_OPEN" | "REGISTRATION_CLOSED" | "COMPLETED";
  type: "CODING" | "APTITUDE";
};

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:8081/api/events")
      .then((res) => res.json())
      .then(setEvents)
      .catch(console.error);
  }, []);

  const registerEvent = async (eventId: number) => {
    try {
      setLoadingId(eventId);
      await fetch(`http://localhost:8081/api/events/${eventId}/register`, {
        method: "POST",
      });
      alert("Registered successfully!");
    } catch (err) {
      alert("Registration failed");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status: Event["status"]) => {
    switch (status) {
      case "REGISTRATION_OPEN":
        return "text-green-600 bg-green-100";
      case "REGISTRATION_CLOSED":
        return "text-yellow-600 bg-yellow-100";
      case "COMPLETED":
        return "text-gray-600 bg-gray-200";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Events</h1>
        <p className="text-muted-foreground">
          Participate in coding contests and hackathons
        </p>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="rounded-2xl">
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle>{event.name}</CardTitle>
                <p className="text-muted-foreground text-sm mt-1">
                  Event Date: {event.eventDate}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
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

              {/* ACTION */}
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
