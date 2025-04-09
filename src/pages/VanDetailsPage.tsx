
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import StudentCard from "@/components/StudentCard";
import HeaderWithBack from "@/components/HeaderWithBack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Edit, Search, X, LayoutGrid, List, Columns } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const VanDetailsPage: React.FC = () => {
  const { vanId } = useParams<{ vanId: string }>();
  const navigate = useNavigate();
  const { vans, getStudentsByVan } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "columns">("grid");

  if (!vanId) {
    return <div>Invalid van ID</div>;
  }

  const van = vans.find((v) => v.id === vanId);
  if (!van) {
    return <div>Van not found</div>;
  }

  const allStudents = getStudentsByVan(vanId);
  
  // Filter students based on search query
  const filteredStudents = searchQuery.trim() !== "" 
    ? allStudents.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.parentName && student.parentName.toLowerCase().includes(searchQuery.toLowerCase())))
    : allStudents;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <HeaderWithBack title={van.name} />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/van/${vanId}/edit`)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          <span>Edit Van</span>
        </Button>
      </div>
      
      <Card className="mb-6 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Route</h3>
              <p>{van.route}</p>
            </div>
            <div>
              <h3 className="font-medium">Capacity</h3>
              <p className="text-right">{filteredStudents.length} / {van.capacity} students</p>
            </div>
          </div>
          {van.defaultFee && (
            <div className="mt-2">
              <h3 className="font-medium">Default Fee</h3>
              <p>₹{van.defaultFee}</p>
            </div>
          )}
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
      
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search students by name or parent name..."
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
      
      {/* View Mode Selector */}
      <div className="flex justify-end mb-4">
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list" | "columns")}>
          <ToggleGroupItem value="grid" aria-label="Grid View">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List View">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="columns" aria-label="Columns View">
            <Columns className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">
            {searchQuery ? `No students found matching "${searchQuery}"` : "No students assigned to this van yet"}
          </p>
          <Button 
            className="mt-4" 
            variant="outline"
            onClick={() => navigate("/add-student", { state: { preSelectedVanId: vanId } })}
          >
            Add First Student
          </Button>
        </div>
      ) : (
        <>
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}
          
          {viewMode === "list" && (
            <div className="space-y-2">
              {filteredStudents.map((student) => (
                <Card 
                  key={student.id}
                  className="cursor-pointer hover:shadow-md transition-shadow duration-300"
                  onClick={() => navigate(`/student/${student.id}`)}
                >
                  <CardContent className="p-3 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">Class {student.className}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{student.parentContact}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {viewMode === "columns" && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow 
                      key={student.id} 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => navigate(`/student/${student.id}`)}
                    >
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.className}</TableCell>
                      <TableCell>{student.parentName || "-"}</TableCell>
                      <TableCell>{student.parentContact}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VanDetailsPage;
