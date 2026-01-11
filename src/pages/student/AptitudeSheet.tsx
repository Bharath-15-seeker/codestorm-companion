import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

const AptitudeSheet = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Aptitude Sheet</h1>
        <p className="text-muted-foreground">
          Improve logical reasoning and quantitative aptitude
        </p>
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <Brain className="w-5 h-5 text-accent-foreground" />
          </div>
          <CardTitle>Logical & Quantitative</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">
            Aptitude practice questions will be shown here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AptitudeSheet;
