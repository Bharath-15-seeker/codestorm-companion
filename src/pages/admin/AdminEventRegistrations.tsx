import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/services/api";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface StudentRegistration {
  registrationId: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  department: string;
  points: number;
}

const AdminEventRegistrations = () => {

  const { eventId } = useParams();

  const [students,setStudents] = useState<StudentRegistration[]>([]);
  const [search,setSearch] = useState("");
  const [department,setDepartment] = useState("ALL");
  const [points,setPoints] = useState<Record<number,string>>({});

  /* ================= LOAD STUDENTS ================= */

  const loadRegistrations = async () => {

    const res = await api.get(
      `/api/admin/events/${eventId}/registrations`
    );

    setStudents(res.data);
  };

  useEffect(()=>{
    loadRegistrations();
  },[]);

  /* ================= ASSIGN POINTS ================= */

  const assignPoints = async (student: StudentRegistration) => {

    const pts = points[student.registrationId];
  
    if (!pts) {
      toast({
        title: "Enter points first"
      });
      return;
    }
  
    try {
  
      await api.post(
        `/api/admin/events/${eventId}/points`,
        {
          studentId: student.studentId,
          points: Number(pts)
        }
      );
  
      toast({
        title: "Points assigned successfully"
      });
  
      setPoints((prev) => ({
        ...prev,
        [student.registrationId]: ""
      }));
  
      loadRegistrations();
  
    } catch (error) {
  
      toast({
        title: "Failed to assign points"
      });
  
    }
  };

  /* ================= FILTER ================= */

  const filteredStudents = students.filter((s)=>{

    const searchMatch =
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentEmail.toLowerCase().includes(search.toLowerCase());

    const deptMatch =
      department === "ALL" ||
      s.department === department;

    return searchMatch && deptMatch;
  });

  /* ================= UNIQUE DEPARTMENTS ================= */

  const departments = [
    ...new Set(students.map((s)=>s.department))
  ];

  return (

<div className="space-y-6">

{/* HEADER */}

<div>
<h1 className="text-2xl font-bold">
Event Registrations
</h1>
</div>

{/* SEARCH + FILTER */}

<Card>

<CardContent className="p-4 space-y-4">

<Input
placeholder="Search student..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<div className="flex gap-3">

<select
className="border rounded-md p-2"
value={department}
onChange={(e)=>setDepartment(e.target.value)}
>

<option value="ALL">
All Departments
</option>

{departments.map((dept)=>(
<option key={dept}>
{dept}
</option>
))}

</select>

</div>

</CardContent>

</Card>

{/* STUDENT GRID */}

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

{filteredStudents.map((student)=>{

const avatar =
student.studentName.charAt(0).toUpperCase();

return (

<Card key={student.registrationId}>

<CardContent className="p-4 space-y-3">

{/* STUDENT HEADER */}

<div className="flex items-center gap-3">

<div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">

{avatar}

</div>

<div>

<p className="font-semibold">
{student.studentName}
</p>

<p className="text-xs text-muted-foreground">
{student.studentEmail}
</p>

</div>

</div>

{/* DETAILS */}

<div className="text-sm space-y-1">

<p>
Department: 
<span className="ml-1 font-medium">
{student.department}
</span>
</p>

<p>
Current Points: 
<span className="ml-1 font-bold text-accent">
{student.points}
</span>
</p>

</div>

{/* ASSIGN POINTS */}

<div className="flex gap-2">

<Input
type="number"
placeholder="Points"
value={points[student.registrationId] || ""}
onChange={(e)=>
setPoints((prev)=>({
...prev,
[student.registrationId]:e.target.value
}))
}
/>

<Button
onClick={()=>assignPoints(student)}
>

Assign

</Button>

</div>

</CardContent>

</Card>

);

})}

</div>

</div>

  );
};

export default AdminEventRegistrations;