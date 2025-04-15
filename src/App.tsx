
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";
import HomePage from "./pages/HomePage";
import VanDetailsPage from "./pages/VanDetailsPage";
import VanEditPage from "./pages/VanEditPage";
import StudentFeePage from "./pages/StudentFeePage";
import AddStudentPage from "./pages/AddStudentPage";
import NotFound from "./pages/NotFound";
import LoadingPage from "./pages/LoadingPage";
import { useState } from "react";

const queryClient = new QueryClient();

// Create a loading wrapper component
const AppRoutes = () => {
  const { loading, error, retryLoading } = useAppContext();
  const [connectionTimeout, setConnectionTimeout] = useState(false);
  
  // Set a timeout for the connection
  React.useEffect(() => {
    if (loading) {
      const timeoutId = setTimeout(() => {
        if (loading) {
          setConnectionTimeout(true);
        }
      }, 15000); // Show timeout message after 15 seconds
      
      return () => clearTimeout(timeoutId);
    }
  }, [loading]);
  
  if (loading) {
    return (
      <LoadingPage 
        onRetry={retryLoading} 
        error={error} 
        timeout={connectionTimeout && !error}
      />
    );
  }
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/van/:vanId" element={<VanDetailsPage />} />
      <Route path="/van/:vanId/edit" element={<VanEditPage />} />
      <Route path="/student/:studentId" element={<StudentFeePage />} />
      <Route path="/add-student" element={<AddStudentPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
