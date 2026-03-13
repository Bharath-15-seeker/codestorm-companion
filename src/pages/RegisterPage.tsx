import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, ArrowRight, User, ChevronDown, Rocket, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Mascot from '@/components/Mascot';

const DEPARTMENTS = [
  "Bsc Computer Science",
  "Msc Computer Science",
  "Bsc Micro Biology",
  "BA English",
  "Bsc Bio Chemistry",
  "Msc Bio Chemistry"
];

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

    if (!department) {
      toast({ title: "Department required", description: "Please select your department.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please check again.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Must be at least 6 characters.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await register({ name, email, password, department, year: Number(year), registerNumber });
      toast({ title: "Welcome!", description: "Account created successfully." });
      navigate("/login");
    } catch (error) {
      toast({ title: "Registration failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: <Rocket />, title: "Placement Ready", desc: "Master patterns for top-tier companies." },
    { icon: <ShieldCheck />, title: "Aptitude Mastery", desc: "Quant, Logical, and Verbal reasoning." },
    { icon: <CheckCircle2 />, title: "Real-time Tracking", desc: "Monitor your growth and performance." }
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 lg:px-16 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Create an account</h2>
            <p className="text-muted-foreground">Join the CodeStorm community.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className="h-11" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registerNumber">Reg Number</Label>
                <Input id="registerNumber" value={registerNumber} onChange={(e) => setRegisterNumber(e.target.value)} required className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" min="1" max="4" value={year} onChange={(e) => setYear(Number(e.target.value))} required className="h-11" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <div className="relative">
                <select id="department" value={department} onChange={(e) => setDepartment(e.target.value)} required className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-primary outline-none">
                  <option value="" disabled>Select Department</option>
                  {DEPARTMENTS.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Eye className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="h-11" />
              </div>
            </div>

            <Button type="submit" variant="accent" size="lg" className="w-full mt-2 font-semibold" disabled={isLoading}>
              {isLoading ? "Loading..." : <>Create Account <ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Branding */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden lg:flex lg:w-[45%] bg-[#0f172a] p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
        <div className="relative z-10 w-full max-w-lg">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2.5 bg-accent rounded-xl"><Zap className="w-7 h-7 text-accent-foreground fill-accent-foreground" /></div>
            <span className="text-2xl font-bold text-white tracking-tight">CodeStorm</span>
          </div>

          <h1 className="text-5xl font-extrabold text-white leading-[1.1] mb-6">Your Gateway to <br /><span className="text-accent italic">Career Success.</span></h1>
          <p className="text-slate-400 text-lg mb-12">Bridge the gap between <span className="text-white font-medium">Coding Skills</span> and <span className="text-white font-medium">Aptitude</span>.</p>

          <div className="space-y-5">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="p-2.5 bg-accent/10 rounded-xl text-accent">{f.icon}</div>
                <div>
                  <h3 className="font-semibold text-white">{f.title}</h3>
                  <p className="text-sm text-slate-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;