
import React from "react";
import { useNavigate } from "react-router-dom";
import { Student } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Phone, User } from "lucide-react";

interface StudentCardProps {
  student: Student;
}

const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-300"
      onClick={() => navigate(`/student/${student.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{student.name}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <GraduationCap className="w-4 h-4 mr-1" />
              <span>Class {student.className}</span>
            </div>
          </div>
        </div>
        
        {student.parentName && (
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <User className="w-4 h-4 mr-1" />
            <span>{student.parentName}</span>
          </div>
        )}
        
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <Phone className="w-4 h-4 mr-1" />
          <span>{student.parentContact}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
