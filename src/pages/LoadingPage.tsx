
import React from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingPage: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h1 className="text-2xl font-bold text-primary">Loading data...</h1>
      <p className="text-muted-foreground mt-2">Connecting to the Firebase database</p>
      
      <div className="mt-8 flex flex-col items-center gap-2 max-w-md">
        <div className="w-full">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          If loading takes too long, please check your connection or refresh the page.
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
