import React from 'react';
import { AlertTriangle, CheckCircle, Ambulance, ArrowRight, X } from 'lucide-react';

interface TriageData {
  diagnosis: string;
  icd10Code: string;
  urgencyLevel: 'Baja' | 'Moderada' | 'Alta' | 'Crítica';
  specialtyReferral: string;
  reasoning: string;
  recommendedLabTests: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: TriageData | null;
  loading: boolean;
}

const TriageModal: React.FC<Props> = ({ isOpen, onClose, data, loading }) => {
  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-pulse">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-bold text-slate-700">Generando Triage Inteligente...</h3>
            <p className="text-slate-500 mt-2">Analizando historial, laboratorios y notas...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const urgencyColors = {
    'Baja': 'bg-green-100 text-green-800 border-green-200',
    'Moderada': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Alta': 'bg-orange-100 text-orange-800 border-orange-200',
    'Crítica': 'bg-red-100 text-red-800 border-red-200 animate-pulse'
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold flex items-center">
                    <CheckCircle className="mr-2 text-green-400" /> Resumen de Atención
                </h2>
                <p className="text-slate-400 text-sm mt-1">Clasificación automática sugerida por MediCore AI</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
            
            {/* Diagnosis & Urgency */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase">Diagnóstico Presuntivo</span>
                    <div className="text-xl font-bold text-slate-800 mt-1">{data.diagnosis}</div>
                    <div className="text-sm font-mono text-slate-500 bg-slate-200 inline-block px-2 py-1 rounded mt-2">CIE-10: {data.icd10Code}</div>
                </div>
                
                <div className={`p-4 rounded-xl border flex flex-col justify-center items-center min-w-[150px] ${urgencyColors[data.urgencyLevel]}`}>
                    <span className="text-xs font-bold uppercase mb-1">Nivel de Urgencia</span>
                    <div className="text-2xl font-black flex items-center">
                        {data.urgencyLevel === 'Crítica' || data.urgencyLevel === 'Alta' ? <Ambulance className="mr-2"/> : null}
                        {data.urgencyLevel}
                    </div>
                </div>
            </div>

            {/* Referral */}
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
                <div className="flex items-center text-blue-800 mb-2">
                    <ArrowRight className="mr-2" />
                    <span className="font-bold">Derivación Sugerida:</span>
                    <span className="ml-2 text-xl font-bold underline">{data.specialtyReferral}</span>
                </div>
                <p className="text-blue-900/70 text-sm italic">
                    "{data.reasoning}"
                </p>
            </div>

            {/* Labs */}
            <div>
                <span className="text-sm font-bold text-slate-700 block mb-2">Exámenes Solicitados Automáticamente:</span>
                <div className="flex flex-wrap gap-2">
                    {data.recommendedLabTests.map((test, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-sm shadow-sm">
                            {test}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-white rounded-lg transition-colors">
                Editar Notas
            </button>
            <button className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-teal-700 flex items-center">
                Confirmar y Derivar Paciente
            </button>
        </div>
      </div>
    </div>
  );
};

export default TriageModal;
