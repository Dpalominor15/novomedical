import { Patient } from './types';

export const CURRENT_USER = {
  id: 'DR-001',
  name: 'Dr. Alejandro Ramirez',
  role: 'Doctor',
  specialty: 'Medicina Interna'
};

export const PATIENTS_DB: Patient[] = [
  {
    id: 'P-2024-001',
    name: 'Maria Gonzales', // THE CRITICAL CASE
    age: 34,
    gender: 'Femenino',
    bloodType: 'O+',
    allergies: ['Penicilina'],
    avatarUrl: 'https://picsum.photos/id/64/200/200',
    status: 'Waiting',
    waitTimeMinutes: 45,
    triageNote: 'Moretones múltiples, fatiga.',
    medicalHistory: [
      { condition: 'Estrés Laboral', diagnosedDate: '2023-11-15', status: 'Managed' },
      { condition: 'Epistaxis (Sangrado nasal)', diagnosedDate: '2024-03-10', status: 'Resolved' }
    ],
    familyHistory: [
      { relation: 'Abuela Materna', condition: 'Leucemia Mieloide Aguda', note: 'Fallecida' },
      { relation: 'Padre', condition: 'Hipertensión', note: 'Controlado' }
    ],
    recentLabs: [
      {
        id: 'L-101',
        testName: 'Hemograma Completo',
        date: '2024-04-02', 
        value: '3.8',
        unit: 'mil/mm3',
        referenceRange: '4.5 - 11.0',
        isAbnormal: true,
        notes: 'Leucopenia leve observada.'
      },
      {
        id: 'L-102',
        testName: 'Hemoglobina',
        date: '2024-04-15',
        value: '10.5',
        unit: 'g/dL',
        referenceRange: '12.0 - 15.5',
        isAbnormal: true,
        notes: 'Anemia leve.'
      }
    ],
    upcomingAppointments: ['2024-07-20 - Hematología']
  },
  {
    id: 'P-2024-002',
    name: 'Juan Perez',
    age: 58,
    gender: 'Masculino',
    bloodType: 'A+',
    allergies: [],
    avatarUrl: 'https://picsum.photos/id/91/200/200',
    status: 'Waiting',
    waitTimeMinutes: 12,
    triageNote: 'Control hipertensión arterial',
    medicalHistory: [{ condition: 'Hipertensión', diagnosedDate: '2020-01-01', status: 'Active' }],
    familyHistory: [],
    recentLabs: [],
    upcomingAppointments: []
  },
  {
    id: 'P-2024-003',
    name: 'Luisa Mendoza',
    age: 22,
    gender: 'Femenino',
    bloodType: 'B-',
    allergies: ['Nueces'],
    avatarUrl: 'https://picsum.photos/id/1027/200/200',
    status: 'In_Consultation',
    waitTimeMinutes: 0,
    triageNote: 'Dolor abdominal agudo',
    medicalHistory: [],
    familyHistory: [],
    recentLabs: [],
    upcomingAppointments: []
  }
];

export const VITALS_DATA = [
  { name: 'Ene', heartRate: 72, bpSys: 110, bpDia: 70 },
  { name: 'Feb', heartRate: 75, bpSys: 115, bpDia: 72 },
  { name: 'Mar', heartRate: 88, bpSys: 125, bpDia: 80 }, 
  { name: 'Abr', heartRate: 92, bpSys: 118, bpDia: 75 },
  { name: 'May', heartRate: 95, bpSys: 110, bpDia: 68 }, 
];
