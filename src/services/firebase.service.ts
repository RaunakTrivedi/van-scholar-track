
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
  where 
} from "firebase/firestore";

// Collections
const VANS_COLLECTION = "vans";
const STUDENTS_COLLECTION = "students";
const FEE_RECORDS_COLLECTION = "feeRecords";

// Van operations
export const fetchVans = async (): Promise<Van[]> => {
  const vansCollection = collection(db, VANS_COLLECTION);
  const vansSnapshot = await getDocs(vansCollection);
  return vansSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Van));
};

export const addVanToFirebase = async (van: Omit<Van, "id">): Promise<Van> => {
  const vansCollection = collection(db, VANS_COLLECTION);
  const docRef = await addDoc(vansCollection, van);
  return {
    id: docRef.id,
    ...van
  };
};

export const updateVanInFirebase = async (id: string, data: Partial<Van>): Promise<void> => {
  const vanRef = doc(db, VANS_COLLECTION, id);
  await updateDoc(vanRef, data);
};

export const deleteVanFromFirebase = async (id: string): Promise<void> => {
  const vanRef = doc(db, VANS_COLLECTION, id);
  await deleteDoc(vanRef);
};

// Student operations
export const fetchStudents = async (): Promise<Student[]> => {
  const studentsCollection = collection(db, STUDENTS_COLLECTION);
  const studentsSnapshot = await getDocs(studentsCollection);
  return studentsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Student));
};

export const addStudentToFirebase = async (student: Omit<Student, "id">): Promise<Student> => {
  const studentsCollection = collection(db, STUDENTS_COLLECTION);
  const docRef = await addDoc(studentsCollection, student);
  return {
    id: docRef.id,
    ...student
  };
};

export const updateStudentInFirebase = async (id: string, data: Partial<Student>): Promise<void> => {
  const studentRef = doc(db, STUDENTS_COLLECTION, id);
  await updateDoc(studentRef, data);
};

// Fee record operations
export const fetchFeeRecords = async (): Promise<FeeRecord[]> => {
  const feeCollection = collection(db, FEE_RECORDS_COLLECTION);
  const feeSnapshot = await getDocs(feeCollection);
  return feeSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as FeeRecord));
};

export const addFeeRecordToFirebase = async (feeRecord: Omit<FeeRecord, "id">): Promise<FeeRecord> => {
  const feeCollection = collection(db, FEE_RECORDS_COLLECTION);
  const docRef = await addDoc(feeCollection, feeRecord);
  return {
    id: docRef.id,
    ...feeRecord
  };
};

export const updateFeeRecordInFirebase = async (id: string, data: Partial<FeeRecord>): Promise<void> => {
  const feeRef = doc(db, FEE_RECORDS_COLLECTION, id);
  await updateDoc(feeRef, data);
};

// Utility functions
export const getStudentsByVanFromFirebase = async (vanId: string): Promise<Student[]> => {
  const studentsCollection = collection(db, STUDENTS_COLLECTION);
  const q = query(studentsCollection, where("vanId", "==", vanId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Student));
};

export const getFeeRecordsByStudentFromFirebase = async (studentId: string): Promise<FeeRecord[]> => {
  const feeCollection = collection(db, FEE_RECORDS_COLLECTION);
  const q = query(feeCollection, where("studentId", "==", studentId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as FeeRecord));
};

// Initialize Firebase with sample data
export const initializeFirebaseData = async (
  initialVans: Van[], 
  initialStudents: Student[], 
  initialFeeRecords: FeeRecord[]
) => {
  // Check if data already exists
  const vansSnapshot = await getDocs(collection(db, VANS_COLLECTION));
  
  if (vansSnapshot.empty) {
    console.log("Initializing Firebase with sample data...");
    
    // Add vans
    for (const van of initialVans) {
      await setDoc(doc(db, VANS_COLLECTION, van.id), van);
    }
    
    // Add students
    for (const student of initialStudents) {
      await setDoc(doc(db, STUDENTS_COLLECTION, student.id), student);
    }
    
    // Add fee records
    for (const feeRecord of initialFeeRecords) {
      await setDoc(doc(db, FEE_RECORDS_COLLECTION, feeRecord.id), feeRecord);
    }
    
    console.log("Sample data initialized successfully");
  } else {
    console.log("Firebase already contains data, skipping initialization");
  }
};
