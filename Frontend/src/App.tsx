
import { Toaster } from "sonner";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Birthdays from "./pages/Birthdays";
import BirthdayDetail from "./pages/BirthdayDetail";
import BirthdayBoys from "./pages/BirthdayBoys";
import BirthdayBoyDetail from "./pages/BirthdayBoyDetail";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";

// Configure default query client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      meta: {
        onError: (error: any) => {
          const message = error?.message || 'An unexpected error occurred';
          toast.error(message);
        }
      }
    },
    mutations: {
      meta: {
        onError: (error: any) => {
          const message = error?.message || 'An unexpected error occurred';
          toast.error(message);
        }
      }
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/birthdays" element={<Birthdays />} />
            <Route path="/birthdays/:id" element={<BirthdayDetail />} />
            <Route path="/birthday-boys" element={<BirthdayBoys />} />
            <Route path="/birthday-boys/:id" element={<BirthdayBoyDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
