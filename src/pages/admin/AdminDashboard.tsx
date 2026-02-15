import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  Calendar,
  TrendingUp,
  Award,
  ArrowUpRight,
  BookOpen,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useNavigate } from "react-router-dom";


// Mock data - replace with real API calls
const stats = [
  { label: 'Total Students', value: 1234, icon: Users, trend: '+12%', color: 'bg-info' },
  { label: 'Questions', value: 567, icon: FileText, trend: '+8%', color: 'bg-success' },
  { label: 'Active Events', value: 8, icon: Calendar, trend: '+2', color: 'bg-accent' },
  { label: 'Career Tracks', value: 15, icon: BookOpen, trend: '+3', color: 'bg-warning' },
];

const recentActivities = [
  { action: 'New student registered', user: 'Alex Johnson', time: '2 min ago' },
  { action: 'Event created', user: 'Admin', time: '1 hour ago' },
  { action: 'Question added to Arrays', user: 'Admin', time: '3 hours ago' },
  { action: 'Career track updated', user: 'Admin', time: '5 hours ago' },
  { action: 'Event registration', user: 'Sarah Williams', time: '1 day ago' },
];

const topPerformers = [
  { name: 'Alex Johnson', score: 980, rank: 1 },
  { name: 'Sarah Williams', score: 945, rank: 2 },
  { name: 'Mike Chen', score: 920, rank: 3 },
  { name: 'Emily Davis', score: 890, rank: 4 },
  { name: 'Chris Brown', score: 875, rank: 5 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="card-hover border-0 shadow-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <div className="text-3xl font-bold text-foreground">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium text-success">{stat.trend}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-card" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-0 shadow-card h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" />
                Recent Activity
              </CardTitle>
              <button className="text-sm text-accent font-medium hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Performers */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-card h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPerformers.map((student, i) => (
                  <motion.div
                    key={student.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        student.rank === 1
                          ? 'bg-accent text-accent-foreground'
                          : student.rank === 2
                          ? 'bg-muted text-foreground'
                          : student.rank === 3
                          ? 'bg-warning/20 text-warning'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {student.rank}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{student.name}</p>
                    </div>
                    <span className="text-sm font-bold text-accent">
                      <AnimatedCounter value={student.score} />
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
  { label: 'Topics & Questions', icon: FileText, color: 'bg-info', path: '/admin/topics' },
  { label: 'Create Event', icon: Calendar, color: 'bg-success', path: '/admin/events' },
  { label: 'Career Tracks', icon: BookOpen, color: 'bg-warning', path: '/admin/career-tracks' },
  { label: 'View Students', icon: Users, color: 'bg-accent', path: '/admin/students' },
].map((action, i) => (
  <motion.button
    key={action.label}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => navigate(action.path)}
    className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border hover:border-accent hover:shadow-md transition-all"
  >
    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
      <action.icon className="w-6 h-6 text-card" />
    </div>
    <span className="text-sm font-medium text-foreground">
      {action.label}
    </span>
  </motion.button>
))}

            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
