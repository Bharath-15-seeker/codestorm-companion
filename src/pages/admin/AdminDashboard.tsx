import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Users,
  FileText,
  Calendar,
  TrendingUp,
  BookOpen,
  Award,
  Brain,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [statsData, setStatsData] = useState<any>(null);
  const [codingLeaders, setCodingLeaders] = useState<any[]>([]);
  const [aptitudeLeaders, setAptitudeLeaders] = useState<any[]>([]);

  /* ================= FETCH DASHBOARD DATA ================= */

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const stats = await api.get("/api/admin/dashboard/stats");
        setStatsData(stats.data);

        const coding = await api.get("/api/leaderboard/api/admin/dashboard/top-coding");
        setCodingLeaders(coding.data);

        const aptitude = await api.get("/api/leaderboard/api/admin/dashboard/top-aptitude");
        setAptitudeLeaders(aptitude.data);
      } catch (err) {
        console.error("Dashboard load failed", err);
      }
    };

    loadDashboard();
  }, []);

  /* ================= STATS ================= */

  const stats = [
    {
      label: "Total Students",
      value: statsData?.totalStudents || 0,
      icon: Users,
      color: "bg-info",
      path: "/admin/students",
    },
    {
      label: "Questions",
      value: statsData?.totalQuestions || 0,
      icon: FileText,
      color: "bg-success",
      path: "/admin/topics",
    },
    {
      label: "Active Events",
      value: statsData?.totalEvents || 0,
      icon: Calendar,
      color: "bg-accent",
      path: "/admin/events",
    },
    {
      label: "Career Tracks",
      value: statsData?.totalCareerTracks || 0,
      icon: BookOpen,
      color: "bg-warning",
      path: "/admin/career-tracks",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* HEADER */}

      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening.
        </p>
      </motion.div>

      {/* ================= STATS ================= */}

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -4 }}
            className="cursor-pointer"
            onClick={() => navigate(stat.path)}
          >
            <Card className="border-0 shadow-card">
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>

                  <p className="text-3xl font-bold">
                    <AnimatedCounter value={stat.value} />
                  </p>
                </div>

                <div
                  className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ================= LEADERS ================= */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* CODING LEADERS */}

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="text-yellow-500 w-5 h-5" />
              Coding Leaders
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {codingLeaders.map((student, index) => (
              <div
                key={student.studentId}
                onClick={() =>
                  navigate("/admin/leaderboard?tab=coding")
                }
                className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-400 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>

                 <p className="font-medium">{student.name}</p>
                 </div>
<p className="font-bold text-red-500">{student.points}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* APTITUDE LEADERS */}

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="text-purple-500 w-5 h-5" />
              Aptitude Leaders
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {aptitudeLeaders.map((student, index) => (
              <div
                key={student.studentId}
                onClick={() =>
                  navigate("/admin/leaderboard?tab=aptitude")
                }
                className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>

                  <p className="font-medium">{student.name}</p>

                </div>

                <p className="font-bold text-orange-500">{student.points}</p>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>

      {/* ================= QUICK ACTIONS ================= */}

      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Topics & Questions",
                icon: FileText,
                path: "/admin/topics",
                color: "bg-info",
              },
              {
                label: "Create Event",
                icon: Calendar,
                path: "/admin/events",
                color: "bg-success",
              },
              {
                label: "Career Tracks",
                icon: BookOpen,
                path: "/admin/career-tracks",
                color: "bg-warning",
              },
              {
                label: "Leaderboard",
                icon: Award,
                path: "/admin/leaderboard",
                color: "bg-purple-500",
              },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border hover:border-accent hover:shadow-md transition"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>

                <span className="text-sm font-medium">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminDashboard;