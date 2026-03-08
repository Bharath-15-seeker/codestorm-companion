import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

import { motion } from "framer-motion";
import { Pencil, Trash2, Users, Trophy } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

/* ================= TYPES ================= */

type EventStatus =
  | "REGISTRATION_OPEN"
  | "REGISTRATION_CLOSED"
  | "COMPLETED";

type EventType = "CODING" | "APTITUDE";

interface Event {
  id: number;
  name: string;
  type: EventType;
  status: EventStatus;
  eventDate: string;
  registrationOpenDate: string;
  registrationCloseDate: string;
}

/* ================= COMPONENT ================= */

const AdminEvents = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState<Event[]>([]);
  const [filtered, setFiltered] = useState<Event[]>([]);
  const [filter, setFilter] = useState("ALL");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    type: "CODING" as EventType,
    status: "REGISTRATION_OPEN" as EventStatus,
    eventDate: "",
    registrationOpenDate: "",
    registrationCloseDate: "",
  });

  /* ================= LOAD EVENTS ================= */

  const loadEvents = async () => {
    try {
      const res = await api.get("/api/events");
      setEvents(res.data);
      setFiltered(res.data);
    } catch {
      toast({ title: "Failed to load events" });
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  /* ================= FILTER ================= */

  useEffect(() => {
    if (filter === "ALL") {
      setFiltered(events);
    } else {
      setFiltered(events.filter((e) => e.status === filter));
    }
  }, [filter, events]);

  /* ================= RESET FORM ================= */

  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      type: "CODING",
      status: "REGISTRATION_OPEN",
      eventDate: "",
      registrationOpenDate: "",
      registrationCloseDate: "",
    });
  };

  /* ================= CREATE EVENT ================= */

  const createEvent = async () => {
    if (!form.name) {
      toast({ title: "Event name required" });
      return;
    }

    try {
      await api.post("/api/admin/events", form);
      toast({ title: "Event created successfully" });
      resetForm();
      loadEvents();
    } catch {
      toast({ title: "Failed to create event" });
    }
  };

  /* ================= UPDATE EVENT ================= */

  const updateEvent = async () => {
    if (!editingId) return;

    try {
      await api.put(`/api/admin/events/${editingId}`, form);
      toast({ title: "Event updated successfully" });
      resetForm();
      loadEvents();
    } catch {
      toast({ title: "Failed to update event" });
    }
  };

  /* ================= DELETE EVENT ================= */

  const deleteEvent = async (id: number) => {
    if (!confirm("Delete this event?")) return;

    try {
      await api.delete(`/api/admin/events/${id}`);
      toast({ title: "Event deleted" });
      loadEvents();
    } catch {
      toast({ title: "Failed to delete event" });
    }
  };

  /* ================= ASSIGN POINTS ================= */

  const assignPoints = async (event: Event) => {
    if (event.status !== "COMPLETED") {
      toast({
        title: "Points can only be assigned when event is completed",
      });
      return;
    }

    const studentId = prompt("Enter Student ID");
    const points = prompt("Enter Points");

    if (!studentId || !points) return;

    try {
      await api.post(`/api/admin/events/${event.id}/points`, {
        studentId,
        points,
      });

      toast({ title: "Points assigned successfully" });
    } catch {
      toast({ title: "Failed to assign points" });
    }
  };

  /* ================= BADGE COLORS ================= */

  const statusColor = (status: EventStatus) => {
    switch (status) {
      case "REGISTRATION_OPEN":
        return "bg-green-100 text-green-700";

      case "REGISTRATION_CLOSED":
        return "bg-yellow-100 text-yellow-700";

      case "COMPLETED":
        return "bg-blue-100 text-blue-700";

      default:
        return "";
    }
  };

  const typeColor = (type: EventType) => {
    switch (type) {
      case "CODING":
        return "bg-blue-100 text-blue-700";

      case "APTITUDE":
        return "bg-purple-100 text-purple-700";

      default:
        return "";
    }
  };

  /* ================= UI ================= */

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold">Event Management</h1>
        <p className="text-muted-foreground">
          Create, manage and monitor events
        </p>
      </div>

      {/* FILTER TABS */}

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="REGISTRATION_OPEN">
            Registration Open
          </TabsTrigger>
          <TabsTrigger value="REGISTRATION_CLOSED">
            Registration Closed
          </TabsTrigger>
          <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* CREATE / EDIT EVENT */}

      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Event" : "Create Event"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <Input
            placeholder="Event Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          {/* TYPE */}

          <select
            className="border rounded-md p-2 w-full"
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as EventType,
              })
            }
          >
            <option value="CODING">Coding</option>
            <option value="APTITUDE">Aptitude</option>
          </select>

          {/* STATUS */}

          <select
            className="border rounded-md p-2 w-full"
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as EventStatus,
              })
            }
          >
            <option value="REGISTRATION_OPEN">
              Registration Open
            </option>
            <option value="REGISTRATION_CLOSED">
              Registration Closed
            </option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* DATES */}

          <Input
            type="date"
            value={form.eventDate}
            onChange={(e) =>
              setForm({ ...form, eventDate: e.target.value })
            }
          />

          <Input
            type="date"
            value={form.registrationOpenDate}
            onChange={(e) =>
              setForm({
                ...form,
                registrationOpenDate: e.target.value,
              })
            }
          />

          <Input
            type="date"
            value={form.registrationCloseDate}
            onChange={(e) =>
              setForm({
                ...form,
                registrationCloseDate: e.target.value,
              })
            }
          />

          {editingId ? (
            <Button onClick={updateEvent}>
              Update Event
            </Button>
          ) : (
            <Button onClick={createEvent}>
              Create Event
            </Button>
          )}
        </CardContent>
      </Card>

      {/* EVENT LIST */}

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((event) => (
          <Card key={event.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex flex-col gap-1">
                <CardTitle>{event.name}</CardTitle>

                <div className="flex gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${typeColor(
                      event.type
                    )}`}
                  >
                    {event.type}
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${statusColor(
                      event.status
                    )}`}
                  >
                    {event.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="p-2 hover:bg-muted rounded"
                  onClick={() => {
                    setEditingId(event.id);
                    setForm(event);
                  }}
                >
                  <Pencil className="w-4 h-4 text-blue-500" />
                </button>

                <button
                  className="p-2 hover:bg-muted rounded"
                  onClick={() => deleteEvent(event.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              <p className="text-sm">
                Event Date: {event.eventDate}
              </p>

              <p className="text-sm text-muted-foreground">
                Registration: {event.registrationOpenDate} →{" "}
                {event.registrationCloseDate}
              </p>

              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    navigate(
                      `/admin/events/${event.id}/registrations`
                    )
                  }
                >
                  <Users className="w-4 h-4 mr-1" />
                  Registrations
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => assignPoints(event)}
                >
                  <Trophy className="w-4 h-4 mr-1" />
                  Assign Points
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminEvents;