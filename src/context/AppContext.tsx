
import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export interface Student {
  id: string;
  name: string;
  className: string;
  rollNo: string;
  parentName?: string;
  parentContact: string;
  vanId: string;
  customFeeAmount?: number;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  month: string;
  year: number;
  amount: number;
  status: "paid" | "unpaid";
  paidDate?: string;
}

export interface Van {
  id: string;
  name: string;
  capacity: number;
  route: string;
  defaultFee?: number; // New field for default fee
}

interface AppContextType {
  vans: Van[];
  students: Student[];
  feeRecords: FeeRecord[];
  addStudent: (student: Omit<Student, "id">) => void;
  getStudentsByVan: (vanId: string) => Student[];
  getStudentById: (id: string) => Student | undefined;
  getFeeRecordsByStudent: (studentId: string) => FeeRecord[];
  updateFeeStatus: (feeId: string, status: "paid" | "unpaid", paidDate?: string) => void;
  updateFeeAmount: (feeId: string, amount: number) => void;
  updateVan: (vanId: string, vanData: Partial<Van>) => void;
  addVan: (vanData: Omit<Van, "id">) => void; // New function to add van
  removeVan: (vanId: string) => void; // New function to remove van
  updateVanFeeForAllStudents: (vanId: string, feeAmount: number) => void; // New function
}

// Mock data
const initialVans: Van[] = [
  { id: "1", name: "Van A", capacity: 15, route: "North Route", defaultFee: 1500 },
  { id: "2", name: "Van B", capacity: 12, route: "South Route", defaultFee: 1500 },
  { id: "3", name: "Van C", capacity: 15, route: "East Route", defaultFee: 1500 },
  { id: "4", name: "Van D", capacity: 12, route: "West Route", defaultFee: 1500 },
  { id: "5", name: "Van E", capacity: 15, route: "Central Route", defaultFee: 1500 },
  { id: "6", name: "Van F", capacity: 12, route: "Highway Route", defaultFee: 1500 },
];

const initialStudents: Student[] = [
  { id: "1", name: "John Doe", className: "10A", rollNo: "101", parentName: "Michael Doe", parentContact: "9876543210", vanId: "1" },
  { id: "2", name: "Jane Smith", className: "9B", rollNo: "102", parentName: "Sarah Smith", parentContact: "9876543211", vanId: "1" },
  { id: "3", name: "Alex Johnson", className: "11C", rollNo: "103", parentName: "David Johnson", parentContact: "9876543212", vanId: "2" },
  { id: "4", name: "Emily Davis", className: "8A", rollNo: "104", parentName: "Robert Davis", parentContact: "9876543213", vanId: "2" },
  { id: "5", name: "Michael Brown", className: "12B", rollNo: "105", parentName: "Jennifer Brown", parentContact: "9876543214", vanId: "3" },
  { id: "6", name: "Sarah Wilson", className: "7C", rollNo: "106", parentName: "Thomas Wilson", parentContact: "9876543215", vanId: "3" },
  { id: "7", name: "David Miller", className: "10B", rollNo: "107", parentName: "Laura Miller", parentContact: "9876543216", vanId: "4" },
  { id: "8", name: "Olivia Taylor", className: "9A", rollNo: "108", parentName: "William Taylor", parentContact: "9876543217", vanId: "4" },
  { id: "9", name: "James Anderson", className: "11B", rollNo: "109", parentName: "Elizabeth Anderson", parentContact: "9876543218", vanId: "5" },
  { id: "10", name: "Sophia Thomas", className: "8C", rollNo: "110", parentName: "Richard Thomas", parentContact: "9876543219", vanId: "5" },
  { id: "11", name: "William Jackson", className: "12A", rollNo: "111", parentName: "Mary Jackson", parentContact: "9876543220", vanId: "6" },
  { id: "12", name: "Emma Harris", className: "7B", rollNo: "112", parentName: "George Harris", parentContact: "9876543221", vanId: "6" },
];

// Generate fee records for the past 6 months for each student
const generateFeeRecords = (): FeeRecord[] => {
  const records: FeeRecord[] = [];
  const months = ["January", "February", "March", "April", "May", "June"];
  const currentYear = new Date().getFullYear();
  
  initialStudents.forEach(student => {
    const van = initialVans.find(v => v.id === student.vanId);
    const feeAmount = student.customFeeAmount || van?.defaultFee || 1500;
    
    months.forEach((month, index) => {
      // Randomly set some as paid and some as unpaid
      const isPaid = Math.random() > 0.3;
      records.push({
        id: `${student.id}-${month}`,
        studentId: student.id,
        month,
        year: currentYear,
        amount: feeAmount,
        status: isPaid ? "paid" : "unpaid",
        paidDate: isPaid ? new Date(currentYear, index, Math.floor(Math.random() * 28) + 1).toISOString() : undefined
      });
    });
  });
  
  return records;
};

const initialFeeRecords = generateFeeRecords();

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vans, setVans] = useState<Van[]>(initialVans);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>(initialFeeRecords);

  const addStudent = (studentData: Omit<Student, "id">) => {
    const newStudent: Student = {
      ...studentData,
      id: `${students.length + 1}`,
    };
    setStudents([...students, newStudent]);
    
    // Create fee records for the new student
    const months = ["January", "February", "March", "April", "May", "June"];
    const currentYear = new Date().getFullYear();
    
    const van = vans.find(v => v.id === studentData.vanId);
    const feeAmount = studentData.customFeeAmount || van?.defaultFee || 1500;
    
    const newFeeRecords = months.map((month, index) => ({
      id: `${newStudent.id}-${month}`,
      studentId: newStudent.id,
      month,
      year: currentYear,
      amount: feeAmount,
      status: "unpaid" as const
    }));
    
    setFeeRecords([...feeRecords, ...newFeeRecords]);
  };

  const getStudentsByVan = (vanId: string) => {
    return students.filter(student => student.vanId === vanId);
  };

  const getStudentById = (id: string) => {
    return students.find(student => student.id === id);
  };

  const getFeeRecordsByStudent = (studentId: string) => {
    return feeRecords.filter(record => record.studentId === studentId);
  };

  const updateFeeStatus = (feeId: string, status: "paid" | "unpaid", paidDate?: string) => {
    setFeeRecords(prevRecords => 
      prevRecords.map(record => 
        record.id === feeId 
          ? { ...record, status, paidDate }
          : record
      )
    );
  };

  const updateFeeAmount = (feeId: string, amount: number) => {
    setFeeRecords(prevRecords => 
      prevRecords.map(record => 
        record.id === feeId 
          ? { ...record, amount }
          : record
      )
    );
  };

  const updateVan = (vanId: string, vanData: Partial<Van>) => {
    setVans(prevVans => 
      prevVans.map(van => 
        van.id === vanId 
          ? { ...van, ...vanData }
          : van
      )
    );
  };
  
  // New function to add a van
  const addVan = (vanData: Omit<Van, "id">) => {
    const newVan: Van = {
      ...vanData,
      id: `${vans.length + 1}`,
    };
    setVans([...vans, newVan]);
  };
  
  // New function to remove a van
  const removeVan = (vanId: string) => {
    // First check if there are students assigned to this van
    const studentsInVan = students.filter(student => student.vanId === vanId);
    
    if (studentsInVan.length > 0) {
      throw new Error("Cannot remove a van with assigned students");
    }
    
    setVans(prevVans => prevVans.filter(van => van.id !== vanId));
  };
  
  // New function to update fee for all students in a van
  const updateVanFeeForAllStudents = (vanId: string, feeAmount: number) => {
    const studentsInVan = getStudentsByVan(vanId);
    const currentDate = new Date();
    const currentMonthName = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ][currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();
    
    // Update the default fee for the van
    updateVan(vanId, { defaultFee: feeAmount });
    
    // Update current month's fee records for all students in the van who don't have custom fee
    setFeeRecords(prevRecords => 
      prevRecords.map(record => {
        const student = studentsInVan.find(s => s.id === record.studentId);
        // Only update if student is in this van, it's current month, and student has no custom fee
        if (student && 
            !student.customFeeAmount && 
            record.month === currentMonthName && 
            record.year === currentYear) {
          return { ...record, amount: feeAmount };
        }
        return record;
      })
    );
  };

  const value = {
    vans,
    students,
    feeRecords,
    addStudent,
    getStudentsByVan,
    getStudentById,
    getFeeRecordsByStudent,
    updateFeeStatus,
    updateFeeAmount,
    updateVan,
    addVan,
    removeVan,
    updateVanFeeForAllStudents
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
