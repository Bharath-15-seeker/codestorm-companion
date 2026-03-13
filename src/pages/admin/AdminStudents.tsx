import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ExternalLink, Search, XCircle } from "lucide-react";
import api from "@/services/api";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");
  
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

  // Filter Logic
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = deptFilter === "ALL" || student.department === deptFilter;
    const matchesYear = yearFilter === "ALL" || student.year.toString() === yearFilter;

    return matchesSearch && matchesDept && matchesYear;
  });

  // Extract unique departments from student list for the dropdown
  const departments = Array.from(new Set(students.map((s) => s.department)));

  const resetFilters = () => {
    setSearchTerm("");
    setDeptFilter("ALL");
    setYearFilter("ALL");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Students
          </h1>
          <p className="text-muted-foreground">
            View and manage all registered students
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Years</SelectItem>
              <SelectItem value="1">Year 1</SelectItem>
              <SelectItem value="2">Year 2</SelectItem>
              <SelectItem value="3">Year 3</SelectItem>
              <SelectItem value="4">Year 4</SelectItem>
            </SelectContent>
          </Select>

          {(searchTerm || deptFilter !== "ALL" || yearFilter !== "ALL") && (
            <Button variant="ghost" size="icon" onClick={resetFilters} title="Clear filters">
              <XCircle className="w-5 h-5 text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredStudents.length} of {students.length} students
      </div>

      {/* Grid Display */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <Card
              key={student.id}
              className="cursor-pointer hover:shadow-lg transition group border-l-4 border-l-transparent hover:border-l-primary"
              onClick={() => navigate(`/students/${student.id}`)}
            >
              <CardContent className="p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                    {student.name}
                  </h3>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <p className="text-sm text-muted-foreground">
                  {student.email}
                </p>

                <p className="text-sm">
                  <span className="bg-secondary px-2 py-0.5 rounded text-secondary-foreground">
                    {student.department}
                  </span>
                  <span className="mx-2 text-muted-foreground">•</span>
                  Year {student.year}
                </p>

                <div className="flex justify-between text-sm pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold">Coding</span>
                    <span className="font-bold text-blue-500 text-base">
                      {student.codingPoints}
                    </span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold">Aptitude</span>
                    <span className="font-bold text-purple-500 text-base">
                      {student.aptitudePoints}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/20">
            <Users className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No students found</p>
            <p className="text-sm text-muted-foreground/70">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudents;