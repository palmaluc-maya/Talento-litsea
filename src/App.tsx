import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Vacantes from "./pages/Vacantes";
import Candidatos from "./pages/Candidatos";
import Empleadores from "./pages/Empleadores";
import DashboardCandidato from "./pages/DashboardCandidato";
import DashboardEmpleador from "./pages/DashboardEmpleador";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/vacantes" element={<Vacantes />} />
          <Route path="/candidatos" element={<Candidatos />} />
          <Route path="/empleadores" element={<Empleadores />} />
          <Route path="/dashboard/candidato" element={<ProtectedRoute allowedRoles={["candidate"]}><DashboardCandidato /></ProtectedRoute>} />
          <Route path="/dashboard/empleador" element={<ProtectedRoute allowedRoles={["employer"]}><DashboardEmpleador /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><Admin /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
