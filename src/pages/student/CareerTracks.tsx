import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

const CareerTracks = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Career Tracks</h1>
        <p className="text-muted-foreground">
          Follow structured paths to build your career
        </p>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-accent-foreground" />
          </div>
          <CardTitle>Available Tracks</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">
            Career tracks will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerTracks;
