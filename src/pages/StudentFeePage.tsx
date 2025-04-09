
import React, { useState, useMemo } from "react";
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

const StudentFeePage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { getStudentById, getFeeRecordsByStudent, updateFeeStatus, updateFeeAmount, vans } = useAppContext();
  
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

  const van = vans.find(v => v.id === student.vanId);
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
  
  // Calculate pending amount including current month and previous unpaid months
  const pendingFeeCalculation = useMemo(() => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonthIndex = months.indexOf(currentMonthName);
    
    // Get records from current month and previous months that are unpaid
    const relevantRecords = feeRecords.filter(record => {
      const monthIndex = months.indexOf(record.month);
      const isCurrentYear = record.year === currentDate.getFullYear();
      
      // Include if it's from current year and is either the current month or a previous month
      return isCurrentYear && monthIndex <= currentMonthIndex && record.status === "unpaid";
    });
    
    const pendingAmount = relevantRecords.reduce((sum, record) => sum + record.amount, 0);
    const pendingMonths = relevantRecords.length;
    
    return { pendingAmount, pendingMonths };
  }, [feeRecords, currentMonthName, currentDate]);

  // Find current month's fee record
  const currentMonthFeeRecord = feeRecords.find(
    record => record.month === currentMonthName && record.year === currentDate.getFullYear()
  );
  
  const currentMonthFee = currentMonthFeeRecord?.amount || 
    student.customFeeAmount || 
    van?.defaultFee || 
    1500;

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

  const handleUpdateCurrentFee = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseInt(e.target.value);
    if (currentMonthFeeRecord && !isNaN(newAmount) && newAmount > 0) {
      updateFeeAmount(currentMonthFeeRecord.id, newAmount);
    }
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
            Class {student.className} • Parent: {student.parentName || "Not specified"}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Current Month Fee</div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">₹</span>
                <Input 
                  type="number" 
                  value={currentMonthFee}
                  onChange={handleUpdateCurrentFee}
                  className="w-24 h-8 text-xl font-bold p-1"
                />
              </div>
            </div>
            <div className="bg-destructive/5 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">
                Pending Fee ({pendingFeeCalculation.pendingMonths} {pendingFeeCalculation.pendingMonths === 1 ? 'month' : 'months'})
              </div>
              <div className="text-xl font-bold">₹{pendingFeeCalculation.pendingAmount}</div>
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
