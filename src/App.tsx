import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import StudentLayout from "./layouts/StudentLayout";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import CodingSheet from "./pages/student/CodingSheet";
import AptitudeSheet from"./pages/student/AptitudeSheet";
import Leaderboard from "./pages/student/Leaderboard";
import CareerTracks from "./pages/student/CareerTracks";
import CareerResources from "./pages/student/CareerResources";
import Events from "./pages/student/Events";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="topics" element={<AdminDashboard />} />
              <Route path="events" element={<AdminDashboard />} />
              <Route path="career-tracks" element={<AdminDashboard />} />
              <Route path="students" element={<AdminDashboard />} />
            </Route>

            {/* Student Routes */}
           <Route
  path="/dashboard"
  element={
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <StudentLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<StudentDashboard />} />
  <Route path="coding" element={<CodingSheet />} />
  <Route path="aptitude" element={<AptitudeSheet />} />
  <Route path="leaderboard" element={<Leaderboard />} />
  <Route path="events" element={<Events />} />
  <Route path="career-tracks" element={<CareerTracks />} />
<Route path="career-tracks/:id" element={<CareerResources />} />

</Route>


            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
