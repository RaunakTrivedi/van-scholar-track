
import React, { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { retryFirebaseInitialization } from "@/lib/firebase";

const LoadingPage: React.FC<{
  onRetry?: () => void;
  error?: string | null;
  timeout?: boolean;
}> = ({ onRetry, error, timeout }) => {
  const [loadingText, setLoadingText] = useState("Connecting to Firebase");
  const [dots, setDots] = useState("");
  const [progress, setProgress] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  
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
    
    // Add progress bar that increases over time
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        // Slower progress as it gets higher
        const increment = 100 - prev > 50 ? 5 : 2;
        return Math.min(prev + increment, 95); // never reach 100%
      });
    }, 1000);
    
    return () => {
      clearInterval(textInterval);
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, []);
  
  const handleRetry = async () => {
    setIsRetrying(true);
    setProgress(0);
    
    // Reset loading text
    setLoadingText("Reconnecting to Firebase");
    
    try {
      // Try to reinitialize Firebase
      await retryFirebaseInitialization();
      
      // Call the parent component's retry handler
      if (onRetry) {
        onRetry();
      }
    } catch (error) {
      console.error("Retry failed:", error);
      // The parent component will handle the error state
    } finally {
      setIsRetrying(false);
    }
  };
  
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      {error || timeout ? (
        <div className="w-full max-w-md flex flex-col items-center">
          <Alert variant="destructive" className="mb-4 w-full">
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              {error || "Couldn't connect to Firebase after multiple attempts. Please check your internet connection and try again."}
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={handleRetry} 
            disabled={isRetrying}
            className="gap-2"
          >
            {isRetrying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> 
                Reconnecting...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" /> 
                Retry Connection
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Meanwhile, the app will use sample data so you can explore the features.
            You can retry connecting to Firebase at any time.
          </p>
        </div>
      ) : (
        <>
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h1 className="text-2xl font-bold text-primary">Loading data...</h1>
          <p className="text-muted-foreground mt-2 min-h-6">{loadingText}{dots}</p>
          
          <div className="w-full max-w-md mt-6 mb-8">
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="mt-2 flex flex-col items-center gap-2 max-w-md">
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
        </>
      )}
    </div>
  );
};

export default LoadingPage;
