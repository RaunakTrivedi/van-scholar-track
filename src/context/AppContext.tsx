
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import {
  fetchVans, 
  fetchStudents, 
  fetchFeeRecords,
  addVanToFirebase,
  updateVanInFirebase,
  deleteVanFromFirebase,
  addStudentToFirebase,
  updateStudentInFirebase,
  addFeeRecordToFirebase,
  updateFeeRecordInFirebase,
  initializeFirebaseData
} from "@/services/firebase.service";

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
  defaultFee?: number;
}

interface AppContextType {
  vans: Van[];
  students: Student[];
  feeRecords: FeeRecord[];
  loading: boolean;
  addStudent: (student: Omit<Student, "id">) => Promise<void>;
  getStudentsByVan: (vanId: string) => Student[];
  getStudentById: (id: string) => Student | undefined;
  getFeeRecordsByStudent: (studentId: string) => FeeRecord[];
  updateFeeStatus: (feeId: string, status: "paid" | "unpaid", paidDate?: string) => Promise<void>;
  updateFeeAmount: (feeId: string, amount: number) => Promise<void>;
  updateVan: (vanId: string, vanData: Partial<Van>) => Promise<void>;
  addVan: (vanData: Omit<Van, "id">) => Promise<void>;
  removeVan: (vanId: string) => Promise<void>;
  updateVanFeeForAllStudents: (vanId: string, feeAmount: number) => Promise<void>;
}

// Mock data for initial seeding
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
  const [vans, setVans] = useState<Van[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize data from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // First, try to initialize with sample data if DB is empty
        await initializeFirebaseData(initialVans, initialStudents, initialFeeRecords);
        
        // Then fetch all data
        const vansData = await fetchVans();
        const studentsData = await fetchStudents();
        const feeRecordsData = await fetchFeeRecords();
        
        setVans(vansData);
        setStudents(studentsData);
        setFeeRecords(feeRecordsData);
      } catch (error) {
        console.error("Error loading data from Firebase:", error);
        toast.error("Failed to load data from the server");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const addStudent = async (studentData: Omit<Student, "id">) => {
    try {
      const newStudent = await addStudentToFirebase(studentData);
      setStudents(prev => [...prev, newStudent]);
      
      // Create fee records for the new student
      const months = ["January", "February", "March", "April", "May", "June"];
      const currentYear = new Date().getFullYear();
      
      const van = vans.find(v => v.id === studentData.vanId);
      const feeAmount = studentData.customFeeAmount || van?.defaultFee || 1500;
      
      const newFeeRecordsPromises = months.map((month) => {
        const newFeeRecord = {
          studentId: newStudent.id,
          month,
          year: currentYear,
          amount: feeAmount,
          status: "unpaid" as const
        };
        return addFeeRecordToFirebase(newFeeRecord);
      });
      
      const newFeeRecords = await Promise.all(newFeeRecordsPromises);
      setFeeRecords(prev => [...prev, ...newFeeRecords]);
      
      toast.success("Student added successfully");
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Failed to add student");
    }
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

  const updateFeeStatus = async (feeId: string, status: "paid" | "unpaid", paidDate?: string) => {
    try {
      await updateFeeRecordInFirebase(feeId, { status, paidDate });
      
      setFeeRecords(prevRecords => 
        prevRecords.map(record => 
          record.id === feeId 
            ? { ...record, status, paidDate }
            : record
        )
      );
    } catch (error) {
      console.error("Error updating fee status:", error);
      toast.error("Failed to update fee status");
    }
  };

  const updateFeeAmount = async (feeId: string, amount: number) => {
    try {
      await updateFeeRecordInFirebase(feeId, { amount });
      
      setFeeRecords(prevRecords => 
        prevRecords.map(record => 
          record.id === feeId 
            ? { ...record, amount }
            : record
        )
      );
    } catch (error) {
      console.error("Error updating fee amount:", error);
      toast.error("Failed to update fee amount");
    }
  };

  const updateVan = async (vanId: string, vanData: Partial<Van>) => {
    try {
      await updateVanInFirebase(vanId, vanData);
      
      setVans(prevVans => 
        prevVans.map(van => 
          van.id === vanId 
            ? { ...van, ...vanData }
            : van
        )
      );
      
      toast.success("Van updated successfully");
    } catch (error) {
      console.error("Error updating van:", error);
      toast.error("Failed to update van");
    }
  };
  
  const addVan = async (vanData: Omit<Van, "id">) => {
    try {
      const newVan = await addVanToFirebase(vanData);
      setVans([...vans, newVan]);
      toast.success("New van added successfully");
    } catch (error) {
      console.error("Error adding van:", error);
      toast.error("Failed to add new van");
    }
  };
  
  const removeVan = async (vanId: string) => {
    // First check if there are students assigned to this van
    const studentsInVan = students.filter(student => student.vanId === vanId);
    
    if (studentsInVan.length > 0) {
      throw new Error("Cannot remove a van with assigned students");
    }
    
    try {
      await deleteVanFromFirebase(vanId);
      setVans(prevVans => prevVans.filter(van => van.id !== vanId));
      toast.success("Van removed successfully");
    } catch (error) {
      console.error("Error removing van:", error);
      toast.error("Failed to remove van");
    }
  };
  
  const updateVanFeeForAllStudents = async (vanId: string, feeAmount: number) => {
    try {
      // Update the default fee for the van
      await updateVan(vanId, { defaultFee: feeAmount });
      
      const studentsInVan = getStudentsByVan(vanId);
      const currentDate = new Date();
      const currentMonthName = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ][currentDate.getMonth()];
      const currentYear = currentDate.getFullYear();
      
      // Update current month's fee records for all students in the van who don't have custom fee
      const updatedRecords = feeRecords.map(async (record) => {
        const student = studentsInVan.find(s => s.id === record.studentId);
        // Only update if student is in this van, it's current month, and student has no custom fee
        if (student && 
            !student.customFeeAmount && 
            record.month === currentMonthName && 
            record.year === currentYear) {
          await updateFeeRecordInFirebase(record.id, { amount: feeAmount });
          return { ...record, amount: feeAmount };
        }
        return record;
      });
      
      const resolvedRecords = await Promise.all(updatedRecords);
      setFeeRecords(resolvedRecords);
      
      toast.success("Van fee updated for all students");
    } catch (error) {
      console.error("Error updating van fee for students:", error);
      toast.error("Failed to update van fee for students");
    }
  };

  const value = {
    vans,
    students,
    feeRecords,
    loading,
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
