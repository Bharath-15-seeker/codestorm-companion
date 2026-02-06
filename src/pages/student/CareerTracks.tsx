import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

type CareerTrack = {
  id: number;
  name: string;
  description: string;
};

const CareerTracks = () => {
  const [tracks, setTracks] = useState<CareerTrack[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8081/api/career-tracks")
      .then((res) => res.json())
      .then((data) => setTracks(data))
      .catch((err) => console.error("Failed to fetch tracks", err));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Career Tracks</h1>
        <p className="text-muted-foreground">
          Follow structured paths to build your career
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track) => (
          <Card
            key={track.id}
            className="rounded-2xl cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/dashboard/career-tracks/${track.id}`)}
          >
            {/* IMAGE PLACEHOLDER */}


            
            <div className="h-40 bg-accent rounded-t-2xl flex items-center justify-center">
              <Briefcase className="w-12 h-12 text-accent-foreground" />
            </div>

            <CardHeader>
              <CardTitle>{track.name}</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground">
                {track.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CareerTracks;
