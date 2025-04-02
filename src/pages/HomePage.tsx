
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import VanCard from "@/components/VanCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus } from "lucide-react";

const HomePage: React.FC = () => {
  const { vans } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Scholar Van Manager</h1>
          <p className="text-muted-foreground">Manage your school vans and student fees</p>
        </div>
        <Button 
          onClick={() => navigate("/add-student")}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-5 w-5" />
          <span>Add Student</span>
        </Button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Vans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vans.map((van) => (
          <VanCard key={van.id} van={van} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
