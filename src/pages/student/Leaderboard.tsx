import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

const Leaderboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-muted-foreground">
          See how you rank among other students
        </p>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <Trophy className="w-5 h-5 text-accent-foreground" />
          </div>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">
            Leaderboard data will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
