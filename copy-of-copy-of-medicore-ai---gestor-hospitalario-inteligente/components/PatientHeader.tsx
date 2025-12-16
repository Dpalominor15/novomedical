import React from 'react';
import { Patient } from '../types';
import { AlertTriangle, Clock, FileWarning } from 'lucide-react';

interface Props {
  patient: Patient;
}

const PatientHeader: React.FC<Props> = ({ patient }) => {
  // Logic to detect the specific "missed labs" scenario described by user
  const hasAbnormalRecentLabs = patient.recentLabs.some(l => l.isAbnormal);
  const hasFamilyRisk = patient.familyHistory.some(f => f.condition.includes('Leucemia'));

  return (
    <div className="bg-white p-6 shadow-sm border-b border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center space-x-4">
          <img src={patient.avatarUrl} alt={patient.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
            <div className="flex space-x-4 text-sm text-gray-500 mt-1">
              <span>{patient.age} años</span>
              <span>•</span>
              <span>{patient.gender}</span>
              <span>•</span>
              <span className="font-semibold text-red-600">Sangre: {patient.bloodType}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 flex gap-3">
            {/* AI Smart Alerts - Solving the "Missed Info" problem */}
            {hasAbnormalRecentLabs && (
                <div className="flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200 animate-pulse">
                    <FileWarning size={18} className="mr-2" />
                    <span className="text-sm font-bold">Exámenes anormales recientes (Hace 4 sem)</span>
                </div>
            )}
            {hasFamilyRisk && (
                 <div className="flex items-center px-4 py-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
                    <AlertTriangle size={18} className="mr-2" />
                    <span className="text-sm font-bold">Antecedente Familiar Crítico</span>
                </div>
            )}
        </div>
      </div>
      
      <div className="mt-6 flex flex-wrap gap-2">
        {patient.allergies.map(allergy => (
            <span key={allergy} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium uppercase tracking-wide">
                Alergia: {allergy}
            </span>
        ))}
         <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium uppercase tracking-wide flex items-center">
            <Clock size={12} className="mr-1" /> Última visita: 10 Mar 2024
        </span>
      </div>
    </div>
  );
};

export default PatientHeader;
