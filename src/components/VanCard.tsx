
import React from "react";
import { useNavigate } from "react-router-dom";
import { Van } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Bus } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

interface VanCardProps {
  van: Van;
}

const VanCard: React.FC<VanCardProps> = ({ van }) => {
  const navigate = useNavigate();
  const { getStudentsByVan } = useAppContext();
  const students = getStudentsByVan(van.id);

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
          <span className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full text-primary">
            {students.length}/{van.capacity} Students
          </span>
        </div>
        <h3 className="text-xl font-bold mb-1">{van.name}</h3>
        <p className="text-sm text-muted-foreground">{van.route}</p>
      </CardContent>
    </Card>
  );
};

export default VanCard;
