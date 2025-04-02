
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import StudentCard from "@/components/StudentCard";
import HeaderWithBack from "@/components/HeaderWithBack";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const VanDetailsPage: React.FC = () => {
  const { vanId } = useParams<{ vanId: string }>();
  const navigate = useNavigate();
  const { vans, getStudentsByVan } = useAppContext();

  if (!vanId) {
    return <div>Invalid van ID</div>;
  }

  const van = vans.find((v) => v.id === vanId);
  if (!van) {
    return <div>Van not found</div>;
  }

  const students = getStudentsByVan(vanId);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <HeaderWithBack title={van.name} />
      
      <Card className="mb-6 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Route</h3>
              <p>{van.route}</p>
            </div>
            <div>
              <h3 className="font-medium">Capacity</h3>
              <p className="text-right">{students.length} / {van.capacity} students</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Students</h2>
        <Button 
          size="sm"
          onClick={() => navigate("/add-student", { state: { preSelectedVanId: vanId } })}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Student</span>
        </Button>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">No students assigned to this van yet</p>
          <Button 
            className="mt-4" 
            variant="outline"
            onClick={() => navigate("/add-student", { state: { preSelectedVanId: vanId } })}
          >
            Add First Student
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VanDetailsPage;
