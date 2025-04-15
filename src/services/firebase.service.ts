
import { db } from "@/lib/firebase";
import { Van, Student, FeeRecord } from "@/context/AppContext";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  writeBatch
} from "firebase/firestore";

// Collections
const VANS_COLLECTION = "vans";
const STUDENTS_COLLECTION = "students";
const FEE_RECORDS_COLLECTION = "feeRecords";

// Utility function to handle Firebase errors
const handleFirebaseError = (error: any, operation: string) => {
  console.error(`Firebase error during ${operation}:`, error);
  throw error;
};

// Van operations
export const fetchVans = async (): Promise<Van[]> => {
  try {
    const vansCollection = collection(db, VANS_COLLECTION);
    const vansSnapshot = await getDocs(vansCollection);
    return vansSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Van));
  } catch (error) {
    handleFirebaseError(error, "fetching vans");
    return [];
  }
};

export const addVanToFirebase = async (van: Omit<Van, "id">): Promise<Van> => {
  try {
    const vansCollection = collection(db, VANS_COLLECTION);
    const docRef = await addDoc(vansCollection, van);
    return {
      id: docRef.id,
      ...van
    };
  } catch (error) {
    handleFirebaseError(error, "adding van");
    throw error;
  }
};

export const updateVanInFirebase = async (id: string, data: Partial<Van>): Promise<void> => {
  try {
    const vanRef = doc(db, VANS_COLLECTION, id);
    await updateDoc(vanRef, data);
  } catch (error) {
    handleFirebaseError(error, "updating van");
  }
};

export const deleteVanFromFirebase = async (id: string): Promise<void> => {
  try {
    const vanRef = doc(db, VANS_COLLECTION, id);
    await deleteDoc(vanRef);
  } catch (error) {
    handleFirebaseError(error, "deleting van");
  }
};

// Student operations
export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const studentsCollection = collection(db, STUDENTS_COLLECTION);
    const studentsSnapshot = await getDocs(studentsCollection);
    return studentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Student));
  } catch (error) {
    handleFirebaseError(error, "fetching students");
    return [];
  }
};

export const addStudentToFirebase = async (student: Omit<Student, "id">): Promise<Student> => {
  try {
    const studentsCollection = collection(db, STUDENTS_COLLECTION);
    const docRef = await addDoc(studentsCollection, student);
    return {
      id: docRef.id,
      ...student
    };
  } catch (error) {
    handleFirebaseError(error, "adding student");
    throw error;
  }
};

export const updateStudentInFirebase = async (id: string, data: Partial<Student>): Promise<void> => {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, id);
    await updateDoc(studentRef, data);
  } catch (error) {
    handleFirebaseError(error, "updating student");
  }
};

// Fee record operations
export const fetchFeeRecords = async (): Promise<FeeRecord[]> => {
  try {
    const feeCollection = collection(db, FEE_RECORDS_COLLECTION);
    const feeSnapshot = await getDocs(feeCollection);
    return feeSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FeeRecord));
  } catch (error) {
    handleFirebaseError(error, "fetching fee records");
    return [];
  }
};

export const addFeeRecordToFirebase = async (feeRecord: Omit<FeeRecord, "id">): Promise<FeeRecord> => {
  try {
    const feeCollection = collection(db, FEE_RECORDS_COLLECTION);
    const docRef = await addDoc(feeCollection, feeRecord);
    return {
      id: docRef.id,
      ...feeRecord
    };
  } catch (error) {
    handleFirebaseError(error, "adding fee record");
    throw error;
  }
};

export const updateFeeRecordInFirebase = async (id: string, data: Partial<FeeRecord>): Promise<void> => {
  try {
    const feeRef = doc(db, FEE_RECORDS_COLLECTION, id);
    await updateDoc(feeRef, data);
  } catch (error) {
    handleFirebaseError(error, "updating fee record");
  }
};

// Utility functions
export const getStudentsByVanFromFirebase = async (vanId: string): Promise<Student[]> => {
  try {
    const studentsCollection = collection(db, STUDENTS_COLLECTION);
    const q = query(studentsCollection, where("vanId", "==", vanId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Student));
  } catch (error) {
    handleFirebaseError(error, "getting students by van");
    return [];
  }
};

export const getFeeRecordsByStudentFromFirebase = async (studentId: string): Promise<FeeRecord[]> => {
  try {
    const feeCollection = collection(db, FEE_RECORDS_COLLECTION);
    const q = query(feeCollection, where("studentId", "==", studentId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FeeRecord));
  } catch (error) {
    handleFirebaseError(error, "getting fee records by student");
    return [];
  }
};

// Initialize Firebase with sample data
export const initializeFirebaseData = async (
  initialVans: Van[], 
  initialStudents: Student[], 
  initialFeeRecords: FeeRecord[]
) => {
  try {
    // Check if data already exists
    const vansSnapshot = await getDocs(collection(db, VANS_COLLECTION));
    
    if (vansSnapshot.empty) {
      console.log("Initializing Firebase with sample data...");
      
      // Use batch writes for better performance and atomicity
      const batch = writeBatch(db);
      
      // Add vans
      for (const van of initialVans) {
        const vanRef = doc(db, VANS_COLLECTION, van.id);
        batch.set(vanRef, van);
      }
      
      // Add students
      for (const student of initialStudents) {
        const studentRef = doc(db, STUDENTS_COLLECTION, student.id);
        batch.set(studentRef, student);
      }
      
      // Add fee records (in batches to avoid exceeding limits)
      const feeRecordBatches = [];
      const batchSize = 250; // Firestore batch limit is 500
      
      for (let i = 0; i < initialFeeRecords.length; i += batchSize) {
        const currentBatch = writeBatch(db);
        const batch = initialFeeRecords.slice(i, i + batchSize);
        
        for (const feeRecord of batch) {
          const feeRef = doc(db, FEE_RECORDS_COLLECTION, feeRecord.id);
          currentBatch.set(feeRef, feeRecord);
        }
        
        feeRecordBatches.push(currentBatch.commit());
      }
      
      // Commit van and student batches
      await batch.commit();
      
      // Commit fee record batches
      await Promise.all(feeRecordBatches);
      
      console.log("Sample data initialized successfully");
    } else {
      console.log("Firebase already contains data, skipping initialization");
    }
  } catch (error) {
    console.error("Error initializing Firebase data:", error);
    throw error;
  }
};
