import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const Events = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Events</h1>
        <p className="text-muted-foreground">
          Participate in coding contests and hackathons
        </p>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <Calendar className="w-5 h-5 text-accent-foreground" />
          </div>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">
            Upcoming events will be listed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Events;
