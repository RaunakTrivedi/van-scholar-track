
import React from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingPage: React.FC = () => {
  const [loadingText, setLoadingText] = React.useState("Connecting to Firebase");
  const [dots, setDots] = React.useState("");
  
  // Simulate a loading sequence with changing text
  React.useEffect(() => {
    const loadingSteps = [
      "Connecting to Firebase",
      "Initializing database",
      "Fetching van data",
      "Fetching student records",
      "Loading fee information"
    ];
    
    let currentStep = 0;
    
    const textInterval = setInterval(() => {
      currentStep = (currentStep + 1) % loadingSteps.length;
      setLoadingText(loadingSteps[currentStep]);
    }, 2500);
    
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + "." : "");
    }, 500);
    
    return () => {
      clearInterval(textInterval);
      clearInterval(dotsInterval);
    };
  }, []);
  
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h1 className="text-2xl font-bold text-primary">Loading data...</h1>
      <p className="text-muted-foreground mt-2 min-h-6">{loadingText}{dots}</p>
      
      <div className="mt-8 flex flex-col items-center gap-2 max-w-md">
        <div className="w-full">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          If loading takes too long, the app will automatically switch to sample data. 
          You can always refresh the page to try again.
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
