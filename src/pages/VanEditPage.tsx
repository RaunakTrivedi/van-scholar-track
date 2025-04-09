
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import HeaderWithBack from "@/components/HeaderWithBack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const VanEditPage: React.FC = () => {
  const { vanId } = useParams<{ vanId: string }>();
  const navigate = useNavigate();
  const { vans, updateVan, updateVanFeeForAllStudents } = useAppContext();

  if (!vanId) {
    return <div>Invalid van ID</div>;
  }

  const van = vans.find((v) => v.id === vanId);
  if (!van) {
    return <div>Van not found</div>;
  }

  const [formData, setFormData] = useState({
    name: van.name,
    route: van.route,
    capacity: van.capacity,
    defaultFee: van.defaultFee || 1500,
  });

  const [updateAllFees, setUpdateAllFees] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    route: "",
    capacity: "",
    defaultFee: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "capacity" || name === "defaultFee") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      route: "",
      capacity: "",
      defaultFee: "",
    };
    
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Van name is required";
      isValid = false;
    }

    if (!formData.route.trim()) {
      newErrors.route = "Route description is required";
      isValid = false;
    }

    if (formData.capacity <= 0) {
      newErrors.capacity = "Capacity must be a positive number";
      isValid = false;
    }
    
    if (formData.defaultFee <= 0) {
      newErrors.defaultFee = "Default fee must be a positive number";
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

    updateVan(vanId, formData);
    
    // If the update all fees switch is on, update fees for all students in this van
    if (updateAllFees) {
      updateVanFeeForAllStudents(vanId, formData.defaultFee);
      toast.success("Van details and student fees updated successfully");
    } else {
      toast.success("Van details updated successfully");
    }
    
    navigate(`/van/${vanId}`);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <HeaderWithBack title="Edit Van Details" />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Van Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter van name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="route">Route Description</Label>
              <Input
                id="route"
                name="route"
                placeholder="Enter route description"
                value={formData.route}
                onChange={handleChange}
              />
              {errors.route && (
                <p className="text-sm text-destructive">{errors.route}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                placeholder="Enter capacity"
                value={formData.capacity}
                onChange={handleChange}
              />
              {errors.capacity && (
                <p className="text-sm text-destructive">{errors.capacity}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultFee">Default Fee (per month)</Label>
              <Input
                id="defaultFee"
                name="defaultFee"
                type="number"
                min="1"
                placeholder="Enter default monthly fee"
                value={formData.defaultFee}
                onChange={handleChange}
              />
              {errors.defaultFee && (
                <p className="text-sm text-destructive">{errors.defaultFee}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <Switch
                id="updateAllFees"
                checked={updateAllFees}
                onCheckedChange={setUpdateAllFees}
              />
              <Label htmlFor="updateAllFees" className="cursor-pointer">
                Update all current month fees for students in this van
              </Label>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VanEditPage;
