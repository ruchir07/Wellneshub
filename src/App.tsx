import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CheckIn from "./pages/CheckIn";
import Chatbot from "./pages/Chatbot";
import Booking from "./pages/Booking";
import MindfulGames from "./pages/MindfulGames";
import AcademicCalendar from "./pages/AcademicCalendar";
import CommunityForum from "./pages/CommunityForum";
import AdminDashboard from "./pages/AdminDashboard";
import StudentProfiles from "./pages/StudentProfiles";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/games" element={<MindfulGames />} />
          <Route path="/calendar" element={<AcademicCalendar />} />
          <Route path="/forum" element={<CommunityForum />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profiles" element={<StudentProfiles />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
