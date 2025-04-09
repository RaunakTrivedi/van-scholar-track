
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import VanCard from "@/components/VanCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, UserPlus, Search, X, Bus } from "lucide-react";
import StudentCard from "@/components/StudentCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const HomePage: React.FC = () => {
  const { vans, students, addVan, removeVan } = useAppContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddVanDialogOpen, setIsAddVanDialogOpen] = useState(false);
  const [isDeleteVanDialogOpen, setIsDeleteVanDialogOpen] = useState(false);
  const [selectedVanId, setSelectedVanId] = useState<string | null>(null);
  
  const [newVan, setNewVan] = useState({
    name: "",
    route: "",
    capacity: 10,
    defaultFee: 1500,
  });
  
  const filteredStudents = searchQuery.trim() !== "" 
    ? students.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.parentName && student.parentName.toLowerCase().includes(searchQuery.toLowerCase())))
    : [];

  const handleAddVan = () => {
    if (!newVan.name.trim()) {
      toast.error("Van name is required");
      return;
    }
    
    if (!newVan.route.trim()) {
      toast.error("Route description is required");
      return;
    }
    
    if (newVan.capacity <= 0) {
      toast.error("Capacity must be a positive number");
      return;
    }
    
    if (newVan.defaultFee <= 0) {
      toast.error("Default fee must be a positive number");
      return;
    }
    
    addVan(newVan);
    setNewVan({
      name: "",
      route: "",
      capacity: 10,
      defaultFee: 1500,
    });
    setIsAddVanDialogOpen(false);
    toast.success("New van added successfully");
  };
  
  const handleDeleteVan = () => {
    if (!selectedVanId) return;
    
    try {
      removeVan(selectedVanId);
      toast.success("Van removed successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleteVanDialogOpen(false);
      setSelectedVanId(null);
    }
  };
  
  const openDeleteDialog = (vanId: string) => {
    setSelectedVanId(vanId);
    setIsDeleteVanDialogOpen(true);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Scholar Van Manager</h1>
          <p className="text-muted-foreground">Manage your school vans and student fees</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate("/add-student")}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            <span>Add Student</span>
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsAddVanDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add Van</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
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
              <VanCard 
                key={van.id} 
                van={van} 
                onDeleteClick={(e) => {
                  e.stopPropagation();
                  openDeleteDialog(van.id);
                }}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Add Van Dialog */}
      <Dialog open={isAddVanDialogOpen} onOpenChange={setIsAddVanDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Van</DialogTitle>
            <DialogDescription>
              Enter van details below to add a new van to your fleet.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Van Name</Label>
              <Input
                id="name"
                value={newVan.name}
                onChange={(e) => setNewVan({ ...newVan, name: e.target.value })}
                placeholder="Enter van name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="route">Route Description</Label>
              <Input
                id="route"
                value={newVan.route}
                onChange={(e) => setNewVan({ ...newVan, route: e.target.value })}
                placeholder="Enter route description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  value={newVan.capacity}
                  onChange={(e) => setNewVan({ ...newVan, capacity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="defaultFee">Default Fee</Label>
                <Input
                  id="defaultFee"
                  type="number"
                  min={1}
                  value={newVan.defaultFee}
                  onChange={(e) => setNewVan({ ...newVan, defaultFee: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddVanDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddVan}>Add Van</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Van Confirmation */}
      <Dialog open={isDeleteVanDialogOpen} onOpenChange={setIsDeleteVanDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Van</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this van? This action cannot be undone.
              Note: You can only delete vans that don't have any assigned students.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteVanDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteVan}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;
