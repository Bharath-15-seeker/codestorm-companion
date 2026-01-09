import { motion } from 'framer-motion';
import {
  Code,
  Brain,
  Trophy,
  Calendar,
  TrendingUp,
  CheckCircle,
  Flame,
  Target,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedCounter from '@/components/AnimatedCounter';
import ProgressBar from '@/components/ProgressBar';
import Mascot from '@/components/Mascot';

// Mock data - replace with real API calls
const progressData = {
  coding: { completed: 45, total: 150 },
  aptitude: { completed: 32, total: 80 },
  streak: 7,
  rank: 24,
};

const upcomingEvents = [
  { id: 1, title: 'Code Sprint 2024', date: 'Jan 15', status: 'OPEN' as const },
  { id: 2, title: 'DSA Marathon', date: 'Jan 22', status: 'OPEN' as const },
  { id: 3, title: 'Mock Interview Day', date: 'Feb 1', status: 'OPEN' as const },
];

const recentQuestions = [
  { id: 1, title: 'Two Sum', difficulty: 'EASY' as const, topic: 'Arrays' },
  { id: 2, title: 'Reverse Linked List', difficulty: 'MEDIUM' as const, topic: 'Linked List' },
  { id: 3, title: 'Binary Tree Inorder', difficulty: 'MEDIUM' as const, topic: 'Trees' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Student';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const difficultyColors = {
    EASY: 'text-success bg-success/10',
    MEDIUM: 'text-warning bg-warning/10',
    HARD: 'text-destructive bg-destructive/10',
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pb-8"
    >
      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="bg-primary px-4 lg:px-8 py-8 lg:py-12"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="text-primary-foreground">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl lg:text-3xl font-bold mb-2"
              >
                {greeting}, {firstName}! 👋
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-primary-foreground/80"
              >
                Keep up the great work! You're making amazing progress.
              </motion.p>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4 mt-6"
              >
                {[
                  { icon: Flame, label: 'Day Streak', value: progressData.streak, color: 'bg-accent' },
                  { icon: Trophy, label: 'Global Rank', value: `#${progressData.rank}`, color: 'bg-warning' },
                  { icon: CheckCircle, label: 'Completed', value: progressData.coding.completed + progressData.aptitude.completed, color: 'bg-success' },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-3 bg-primary-foreground/10 rounded-xl px-4 py-3"
                  >
                    <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-card" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary-foreground">
                        {typeof stat.value === 'number' ? (
                          <AnimatedCounter value={stat.value} />
                        ) : (
                          stat.value
                        )}
                      </p>
                      <p className="text-xs text-primary-foreground/70">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:block"
            >
              <Mascot
                message="You're on fire! 🔥 Keep solving!"
                size="lg"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 -mt-6">
        {/* Progress Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Coding Progress */}
          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Code className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Coding Sheet</h3>
                    <p className="text-sm text-muted-foreground">DSA Problems</p>
                  </div>
                </div>
                <Link to="/dashboard/coding">
                  <Button variant="accent-outline" size="sm">
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <ProgressBar
                value={progressData.coding.completed}
                max={progressData.coding.total}
              />
              <p className="text-sm text-muted-foreground mt-2">
                {progressData.coding.completed} of {progressData.coding.total} problems completed
              </p>
            </CardContent>
          </Card>

          {/* Aptitude Progress */}
          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-info" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Aptitude Sheet</h3>
                    <p className="text-sm text-muted-foreground">Logical & Quantitative</p>
                  </div>
                </div>
                <Link to="/dashboard/aptitude">
                  <Button variant="accent-outline" size="sm">
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <ProgressBar
                value={progressData.aptitude.completed}
                max={progressData.aptitude.total}
                variant="default"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {progressData.aptitude.completed} of {progressData.aptitude.total} problems completed
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Questions */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-0 shadow-card h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  Continue Learning
                </CardTitle>
                <Link to="/dashboard/coding">
                  <Button variant="ghost" size="sm">
                    View all <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentQuestions.map((question, i) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-accent hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-sm font-bold text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground group-hover:text-accent transition-colors">
                            {question.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{question.topic}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[question.difficulty]}`}>
                        {question.difficulty}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-card h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 rounded-xl border border-border hover:border-accent transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-foreground mb-1">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                        </div>
                        <span className="px-2 py-1 bg-success/10 text-success text-xs font-semibold rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                          {event.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Link to="/dashboard/events" className="block mt-4">
                  <Button variant="outline" className="w-full">
                    View All Events
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Leaderboard Preview */}
        <motion.div variants={itemVariants} className="mt-6">
          <Card className="border-0 shadow-card bg-gradient-to-r from-primary to-primary/90">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-primary-foreground">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">You're ranked #{progressData.rank}!</h3>
                  <p className="text-primary-foreground/80">
                    Solve more problems to climb the leaderboard
                  </p>
                </div>
              </div>
              <Link to="/dashboard/leaderboard">
                <Button variant="accent" size="lg">
                  View Leaderboard
                  <TrendingUp className="w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;
