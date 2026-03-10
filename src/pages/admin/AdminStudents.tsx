import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ExternalLink } from "lucide-react";
import api from "@/services/api";

import { Card, CardContent } from "@/components/ui/card";

interface Student {
  id: number;
  name: string;
  email: string;
  department: string;
  year: number;
  codingPoints: number;
  aptitudePoints: number;
}

const AdminStudents = () => {

  const [students, setStudents] = useState<Student[]>([]);
  const navigate = useNavigate();

  const loadStudents = async () => {
    try {
      const res = await api.get("/api/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to load students");
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" />
          Students
        </h1>
        <p className="text-muted-foreground">
          View all registered students
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

        {students.map((student) => (

          <Card
            key={student.id}
            className="cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate(`/students/${student.id}`)}
          >
            <CardContent className="p-5 space-y-2">

              <h3 className="font-bold text-lg">
                {student.name}
              </h3>

              <p className="text-sm text-muted-foreground">
                {student.email}
              </p>

              <p className="text-sm">
                {student.department} • Year {student.year}
              </p>

              <div className="flex justify-between text-sm pt-2">

                <span className="font-medium text-blue-500">
                  Coding: {student.codingPoints}
                </span>

                <span className="font-medium text-purple-500">
                  Aptitude: {student.aptitudePoints}
                </span>

              </div>

              <div className="flex justify-end pt-2">
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>

            </CardContent>
          </Card>

        ))}

      </div>

    </div>
  );
};

export default AdminStudents;