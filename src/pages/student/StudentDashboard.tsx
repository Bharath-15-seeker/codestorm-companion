import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Code,
  Brain,
  Trophy,
  TrendingUp,
  CheckCircle,
  Flame,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ProgressBar";
import Mascot from "@/components/Mascot";

import { useAuth } from "@/contexts/AuthContext";
import { studentService } from "@/services/api";

/* ============================
   Types
============================ */

interface ProgressResponse {
  progressPercentage: number;
  sheetType: "CODING" | "APTITUDE";
  solvedQuestions: number;
  totalQuestions: number;
}

/* ============================
   Animations
============================ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ============================
   Component
============================ */

const StudentDashboard = () => {
  const { user } = useAuth();

  const [codingProgress, setCodingProgress] =
    useState<ProgressResponse | null>(null);
  const [aptitudeProgress, setAptitudeProgress] =
    useState<ProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);

  /* ============================
     Fetch Progress
  ============================ */

  useEffect(() => {
    if (!user?.id) return;

    const fetchProgress = async () => {
      try {
        const [coding, aptitude] = await Promise.all([
          studentService.getCodingProgress(user.id),
          studentService.getAptitudeProgress(user.id),
        ]);

        setCodingProgress(coding);
        setAptitudeProgress(aptitude);
      } catch (err) {
        console.error("Failed to load progress", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user?.id]);

  /* ============================
     Greeting
  ============================ */

  const firstName = user?.name?.split(" ")[0] || "Student";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading dashboard...</div>;
  }

  const codingSolved = codingProgress?.solvedQuestions ?? 0;
  const codingTotal = codingProgress?.totalQuestions ?? 0;

  const aptitudeSolved = aptitudeProgress?.solvedQuestions ?? 0;
  const aptitudeTotal = aptitudeProgress?.totalQuestions ?? 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pb-8"
    >
      {/* HERO */}
      <motion.div
        variants={itemVariants}
        className="bg-primary px-4 lg:px-8 py-10"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-primary-foreground">
            <h1 className="text-2xl lg:text-3xl font-bold">
              {greeting}, {firstName}! 👋
            </h1>

            <p className="text-primary-foreground/80 mt-1">
              Keep pushing — consistency wins 🚀
            </p>

            <div className="flex gap-4 mt-6">
              <Stat icon={Flame} label="Consistency" value="Active" />

              <Stat
                icon={CheckCircle}
                label="Solved"
                value={codingSolved + aptitudeSolved}
              />
            </div>
          </div>

          <div className="hidden lg:block">
            <Mascot message="You're doing great! 🔥" size="lg" />
          </div>
        </div>
      </motion.div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 -mt-6">
        {/* Progress Cards */}
        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-2 gap-4 mb-6"
        >
          {/* Coding */}
          <ProgressCard
            title="Coding Sheet"
            subtitle="DSA Problems"
            icon={Code}
            solved={codingSolved}
            total={codingTotal}
            link="/dashboard/coding"
          />

          {/* Aptitude */}
          <ProgressCard
            title="Aptitude Sheet"
            subtitle="Logical & Quantitative"
            icon={Brain}
            solved={aptitudeSolved}
            total={aptitudeTotal}
            link="/dashboard/aptitude"
          />
        </motion.div>

        {/* Leaderboard */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-card bg-gradient-to-r from-primary to-primary/90">
            <CardContent className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-4 text-primary-foreground">
                <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-accent-foreground" />
                </div>

                <div>
                  <h3 className="text-lg font-bold">Climb the leaderboard</h3>
                  <p className="text-primary-foreground/80">
                    Every solved problem counts
                  </p>
                </div>
              </div>

              <Link to="/dashboard/leaderboard">
                <Button variant="accent">
                  View Leaderboard <TrendingUp className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ============================
   Small Components
============================ */

const Stat = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-center gap-3 bg-primary-foreground/10 px-4 py-3 rounded-xl">
    <Icon className="w-5 h-5" />
    <div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-primary-foreground/70">{label}</p>
    </div>
  </div>
);

const ProgressCard = ({
  title,
  subtitle,
  icon: Icon,
  solved,
  total,
  link,
}: any) => {
  const percentage = total === 0 ? 0 : (solved / total) * 100;

  return (
    <Card className="border-0 shadow-card">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-accent" />
            </div>

            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>

          <Link to={link}>
            <Button size="sm" variant="outline">
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <ProgressBar value={percentage} max={100} />

        <p className="text-sm text-muted-foreground mt-2">
          {solved} of {total} problems completed
        </p>
      </CardContent>
    </Card>
  );
};

export default StudentDashboard;