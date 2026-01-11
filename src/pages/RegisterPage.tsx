import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Mascot from '@/components/Mascot';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
const [year, setYear] = useState<number | ''>('');
const [registerNumber, setRegisterNumber] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
    await register({
  name,
  email,
  password,
  department,
  year: Number(year),
  registerNumber,
});

toast({
  title: "Registration successful",
  description: "Please login to continue",
});

navigate("/login");


    } catch (error) {
  toast({
    title: "Registration failed",
    description: "Something went wrong. Please try again.",
    variant: "destructive",
  });
}
 finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-16 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">CodeStorm</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Create your account</h2>
            <p className="text-muted-foreground">Start your journey to coding mastery</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 pl-11"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

          <div className="space-y-2">
  <Label htmlFor="registerNumber">Register Number</Label>
  <Input
    id="registerNumber"
    value={registerNumber}
    onChange={(e) => setRegisterNumber(e.target.value)}
    required
    className="h-12"
  />
</div>

<div className="space-y-2">
  <Label htmlFor="department">Department</Label>
  <Input
    id="department"
    value={department}
    onChange={(e) => setDepartment(e.target.value)}
    required
    className="h-12"
  />
</div>

<div className="space-y-2">
  <Label htmlFor="year">Year</Label>
  <Input
    id="year"
    type="number"
    value={year}
    onChange={(e) => setYear(Number(e.target.value))}
    required
    className="h-12"
  />
</div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-accent font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex justify-center"
          >
            <Mascot message="Join us! Let's code together 🚀" size="sm" />
          </motion.div>
        </motion.div>
      </div>

      {/* Right Panel - Branding */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-10 left-20 w-96 h-96 rounded-full bg-accent/50 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-primary-foreground">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-accent-foreground" />
            </div>
            <span className="text-3xl font-bold">CodeStorm</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-4"
          >
            Begin Your <br />
            <span className="text-accent">Learning Journey</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-primary-foreground/80 mb-12"
          >
            Create an account and unlock access to curated coding sheets,
            compete in events, and track your growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { number: '500+', label: 'Problems' },
              { number: '10K+', label: 'Students' },
              { number: '50+', label: 'Events' },
              { number: '15+', label: 'Tracks' },
            ].map((stat, i) => (
              <div key={i} className="bg-primary-foreground/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-accent">{stat.number}</div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
