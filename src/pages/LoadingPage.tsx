
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingPage: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h1 className="text-2xl font-bold text-primary">Loading data...</h1>
      <p className="text-muted-foreground mt-2">Connecting to the Firebase database</p>
    </div>
  );
};

export default LoadingPage;
