
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import HeaderWithBack from "@/components/HeaderWithBack";
import FeeStatusBadge from "@/components/FeeStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Edit, X } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

const StudentFeePage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { getStudentById, getFeeRecordsByStudent, updateFeeStatus, updateFeeAmount } = useAppContext();
  
  const [editingFeeId, setEditingFeeId] = useState<string | null>(null);
  const [editingPaidDate, setEditingPaidDate] = useState<string>("");
  const [editingAmount, setEditingAmount] = useState<number>(0);

  if (!studentId) {
    return <div>Invalid student ID</div>;
  }

  const student = getStudentById(studentId);
  if (!student) {
    return <div>Student not found</div>;
  }

  const feeRecords = getFeeRecordsByStudent(studentId);
  
  // Sort fee records by month (assuming month names)
  const sortedFeeRecords = [...feeRecords].sort((a, b) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });

  // Get the current month's index (0-based)
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11
  const currentMonthName = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ][currentMonth];
  
  // Calculate total and pending amounts for the current month
  const currentMonthFees = feeRecords.filter(
    record => record.month === currentMonthName && record.year === currentDate.getFullYear()
  );
  
  const totalFeeAmount = currentMonthFees.reduce((sum, record) => sum + record.amount, 0);
  const paidAmount = currentMonthFees
    .filter(record => record.status === "paid")
    .reduce((sum, record) => sum + record.amount, 0);
  const pendingAmount = totalFeeAmount - paidAmount;

  const handleMarkAsPaid = (feeId: string) => {
    const now = new Date().toISOString();
    updateFeeStatus(feeId, "paid", now);
    toast.success("Fee marked as paid successfully");
  };

  const handleMarkAsUnpaid = (feeId: string) => {
    updateFeeStatus(feeId, "unpaid", undefined);
    toast.success("Fee marked as unpaid");
  };

  const handleEditPaidDate = (feeId: string, record: any) => {
    setEditingFeeId(feeId);
    setEditingPaidDate(record.paidDate || "");
    setEditingAmount(record.amount);
  };

  const handleSavePaidDate = (feeId: string) => {
    updateFeeStatus(feeId, "paid", editingPaidDate);
    updateFeeAmount(feeId, editingAmount);
    setEditingFeeId(null);
    toast.success("Fee details updated successfully");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <HeaderWithBack title="Fee Details" />

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>{student.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            Class {student.className} • Roll #{student.rollNo}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Current Month Fee</div>
              <div className="text-xl font-bold">₹{totalFeeAmount}</div>
            </div>
            <div className="bg-destructive/5 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Pending Fee</div>
              <div className="text-xl font-bold">₹{pendingAmount}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Monthly Fee Records</h2>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Paid Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedFeeRecords.map((record) => (
              <TableRow key={record.id} className={record.month === currentMonthName ? "bg-muted/20" : ""}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{record.month} {record.year}</span>
                    {record.month === currentMonthName && (
                      <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">Current</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {editingFeeId === record.id ? (
                    <Input
                      type="number"
                      value={editingAmount}
                      onChange={(e) => setEditingAmount(Number(e.target.value))}
                      className="w-24 h-8"
                    />
                  ) : (
                    <>₹{record.amount}</>
                  )}
                </TableCell>
                <TableCell>
                  <FeeStatusBadge status={record.status} />
                </TableCell>
                <TableCell>
                  {editingFeeId === record.id ? (
                    <Input
                      type="date"
                      value={editingPaidDate ? editingPaidDate.substring(0, 10) : ""}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setEditingPaidDate(date.toISOString());
                      }}
                      className="w-40 h-8"
                    />
                  ) : (
                    formatDate(record.paidDate)
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingFeeId === record.id ? (
                    <Button
                      size="sm"
                      className="h-8"
                      onClick={() => handleSavePaidDate(record.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  ) : record.status === "unpaid" ? (
                    <Button
                      size="sm"
                      className="h-8"
                      onClick={() => handleMarkAsPaid(record.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Mark Paid
                    </Button>
                  ) : (
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={() => handleEditPaidDate(record.id, record)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={() => handleMarkAsUnpaid(record.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Unpaid
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentFeePage;
