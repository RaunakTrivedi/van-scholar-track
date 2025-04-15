
import React from "react";
import { useNavigate } from "react-router-dom";
import { Van } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Bus, Trash2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface VanCardProps {
  van: Van;
  onDeleteClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const VanCard: React.FC<VanCardProps> = ({ van, onDeleteClick }) => {
  const navigate = useNavigate();
  const { getStudentsByVan, loading } = useAppContext();
  const students = getStudentsByVan(van.id);

  if (loading) {
    return (
      <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3 mt-2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-300 animate-pulse-soft overflow-hidden bg-gradient-to-br from-blue-50 to-white"
      onClick={() => navigate(`/van/${van.id}`)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Bus className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full text-primary">
              {students.length}/{van.capacity} Students
            </span>
            {onDeleteClick && students.length === 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0"
                onClick={onDeleteClick}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-1">{van.name}</h3>
        <p className="text-sm text-muted-foreground">{van.route}</p>
        {van.defaultFee && (
          <p className="text-sm text-muted-foreground mt-1">Fee: ₹{van.defaultFee}/month</p>
        )}
      </CardContent>
    </Card>
  );
};

export default VanCard;
