
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import VanCard from "@/components/VanCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, UserPlus, Search, X } from "lucide-react";
import StudentCard from "@/components/StudentCard";

const HomePage: React.FC = () => {
  const { vans, students } = useAppContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredStudents = searchQuery.trim() !== "" 
    ? students.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
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

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search students by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.trim() !== "" && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">No students found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}

      {/* Only show vans if not searching or if search is empty */}
      {searchQuery.trim() === "" && (
        <>
          <h2 className="text-xl font-semibold mb-4">Vans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vans.map((van) => (
              <VanCard key={van.id} van={van} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
