export enum UrgencyLevel {
  LOW = 'Baja',
  MODERATE = 'Moderada',
  HIGH = 'Alta',
  CRITICAL = 'Crítica'
}

export type PatientStatus = 'Waiting' | 'In_Consultation' | 'Discharged' | 'Referred';

export interface LabResult {
  id: string;
  testName: string;
  date: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  notes?: string;
}

export interface MedicalHistory {
  condition: string;
  diagnosedDate: string;
  status: 'Active' | 'Resolved' | 'Managed';
}

export interface FamilyHistory {
  relation: string;
  condition: string;
  note?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  allergies: string[];
  medicalHistory: MedicalHistory[];
  familyHistory: FamilyHistory[];
  recentLabs: LabResult[];
  upcomingAppointments: string[];
  avatarUrl: string;
  status: PatientStatus;
  waitTimeMinutes: number; // For the dashboard efficiency tracking
  triageNote?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface User {
  id: string;
  name: string;
  role: 'Doctor' | 'Admin' | 'Nurse';
  specialty?: string;
}
