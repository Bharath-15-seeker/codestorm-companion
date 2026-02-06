import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";

type CareerResource = {
  id: number;
  title: string;
  description: string;
  youtubeLink: string;
  orderIndex: number;
};

const CareerResources = () => {
  const { id } = useParams();
  const [resources, setResources] = useState<CareerResource[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8081/api/career-tracks/${id}`)
      .then((res) => res.json())
      .then((data) =>
        setResources(
          data.sort(
            (a: CareerResource, b: CareerResource) =>
              a.orderIndex - b.orderIndex
          )
        )
      )
      .catch(console.error);
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Career Resources
      </h1>

      <div className="relative ml-6">
        {/* Vertical Line */}
        <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-border" />

        <div className="space-y-10">
          {resources.map((res) => (
            <div key={res.id} className="relative flex gap-6">
              {/* Dot */}
              <div className="relative z-10">
                <div className="w-5 h-5 rounded-full bg-primary border-4 border-background" />
              </div>

              {/* Flag Card */}
              <Card className="relative p-4 rounded-xl w-full hover:shadow-lg transition">
                {/* Arrow */}
                <div className="absolute -left-3 top-6 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-card" />

                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {res.orderIndex}. {res.title}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      {res.description}
                    </p>
                  </div>

                  {/* Watch button always visible */}
                  <a
                    href={res.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary text-sm font-medium"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Watch
                  </a>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerResources;
