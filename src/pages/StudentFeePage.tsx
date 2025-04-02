
import React from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import HeaderWithBack from "@/components/HeaderWithBack";
import FeeStatusBadge from "@/components/FeeStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StudentFeePage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { getStudentById, getFeeRecordsByStudent, updateFeeStatus } = useAppContext();

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

  const totalFeeAmount = feeRecords.reduce((sum, record) => sum + record.amount, 0);
  const paidAmount = feeRecords
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
              <div className="text-sm text-muted-foreground">Total Fee</div>
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
              <TableRow key={record.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{record.month} {record.year}</span>
                  </div>
                </TableCell>
                <TableCell>₹{record.amount}</TableCell>
                <TableCell>
                  <FeeStatusBadge status={record.status} />
                </TableCell>
                <TableCell>{formatDate(record.paidDate)}</TableCell>
                <TableCell className="text-right">
                  {record.status === "unpaid" ? (
                    <Button
                      size="sm"
                      className="h-8"
                      onClick={() => handleMarkAsPaid(record.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Mark Paid
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8"
                      onClick={() => handleMarkAsUnpaid(record.id)}
                    >
                      Mark Unpaid
                    </Button>
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
