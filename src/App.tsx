
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LiveInterview from "./pages/LiveInterview";
import StartLiveInterview from "./pages/StartLiveInterview";
import InterviewRoom from "./pages/InterviewRoom";
import AiInterview from "./pages/AiInterview";
import ResumeBuilder from "./pages/ResumeBuilder";
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
          <Route path="/live-interview" element={<LiveInterview />} />
          <Route path="/start-live-interview" element={<StartLiveInterview />} />
          <Route path="/live-interview/:roomId" element={<InterviewRoom />} />
          <Route path="/ai-interview" element={<AiInterview />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
