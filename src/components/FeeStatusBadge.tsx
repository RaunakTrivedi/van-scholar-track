
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface FeeStatusBadgeProps {
  status: "paid" | "unpaid";
}

const FeeStatusBadge: React.FC<FeeStatusBadgeProps> = ({ status }) => {
  if (status === "paid") {
    return (
      <Badge className="bg-success hover:bg-success">
        <Check className="w-3 h-3 mr-1" />
        Paid
      </Badge>
    );
  }

  return (
    <Badge variant="destructive">
      <X className="w-3 h-3 mr-1" />
      Unpaid
    </Badge>
  );
};

export default FeeStatusBadge;
