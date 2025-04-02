
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import HeaderWithBack from "@/components/HeaderWithBack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface LocationState {
  preSelectedVanId?: string;
}

const AddStudentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vans, addStudent } = useAppContext();
  const { preSelectedVanId } = (location.state as LocationState) || {};

  const [formData, setFormData] = React.useState({
    name: "",
    className: "",
    rollNo: "",
    parentContact: "",
    vanId: preSelectedVanId || "",
  });

  const [errors, setErrors] = React.useState({
    name: "",
    className: "",
    rollNo: "",
    parentContact: "",
    vanId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleVanChange = (value: string) => {
    setFormData((prev) => ({ ...prev, vanId: value }));
    setErrors((prev) => ({ ...prev, vanId: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      className: "",
      rollNo: "",
      parentContact: "",
      vanId: "",
    };
    
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.className.trim()) {
      newErrors.className = "Class is required";
      isValid = false;
    }

    if (!formData.rollNo.trim()) {
      newErrors.rollNo = "Roll number is required";
      isValid = false;
    }

    if (!formData.parentContact.trim()) {
      newErrors.parentContact = "Parent's contact is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.parentContact)) {
      newErrors.parentContact = "Enter a valid 10-digit phone number";
      isValid = false;
    }

    if (!formData.vanId) {
      newErrors.vanId = "Please select a van";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    addStudent(formData);
    toast.success("Student added successfully");
    
    // Navigate back to the van details page if coming from there
    if (preSelectedVanId) {
      navigate(`/van/${preSelectedVanId}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <HeaderWithBack title="Add New Student" />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter student's full name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="className">Class</Label>
                <Input
                  id="className"
                  name="className"
                  placeholder="e.g., 10A"
                  value={formData.className}
                  onChange={handleChange}
                />
                {errors.className && (
                  <p className="text-sm text-destructive">{errors.className}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input
                  id="rollNo"
                  name="rollNo"
                  placeholder="e.g., 101"
                  value={formData.rollNo}
                  onChange={handleChange}
                />
                {errors.rollNo && (
                  <p className="text-sm text-destructive">{errors.rollNo}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentContact">Parent's Contact</Label>
              <Input
                id="parentContact"
                name="parentContact"
                placeholder="10-digit mobile number"
                value={formData.parentContact}
                onChange={handleChange}
              />
              {errors.parentContact && (
                <p className="text-sm text-destructive">{errors.parentContact}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vanId">Assign Van</Label>
              <Select
                value={formData.vanId}
                onValueChange={handleVanChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a van" />
                </SelectTrigger>
                <SelectContent>
                  {vans.map((van) => (
                    <SelectItem key={van.id} value={van.id}>
                      {van.name} - {van.route}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vanId && (
                <p className="text-sm text-destructive">{errors.vanId}</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit">Add Student</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddStudentPage;
