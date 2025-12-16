import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import PatientHeader from './PatientHeader';
import AICopilot from './AICopilot';
import VitalChart from './VitalChart';
import TriageModal from './TriageModal';
import { generateTriageRecommendation } from '../services/geminiService';
import { PATIENTS_DB } from '../constants'; // Using the DB now
import { ClipboardList, FlaskConical, History, Mic, AlertCircle, MicOff, ArrowLeft } from 'lucide-react';

const PatientView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find patient from DB based on URL ID
  const patient = PATIENTS_DB.find(p => p.id === id) || PATIENTS_DB[0];

  const [consultationNotes, setConsultationNotes] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showTriage, setShowTriage] = useState(false);
  const [triageLoading, setTriageLoading] = useState(false);
  const [triageData, setTriageData] = useState<any>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'es-ES';

        recognitionRef.current.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setConsultationNotes(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + finalTranscript);
            }
        };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return alert("Navegador no soportado");
    isListening ? (recognitionRef.current.stop(), setIsListening(false)) : (recognitionRef.current.start(), setIsListening(true));
  };
  
  const handleFinalizeConsultation = async () => {
      if (consultationNotes.length < 5) return alert("Ingrese notas de consulta.");
      setShowTriage(true);
      setTriageLoading(true);
      const data = await generateTriageRecommendation(patient, consultationNotes);
      setTriageData(data);
      setTriageLoading(false);
  };

  const handleConfirmReferral = () => {
      setShowTriage(false);
      alert("Paciente derivado exitosamente y historia clínica actualizada.");
      navigate('/dashboard'); // Go back to dashboard after finishing
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 flex flex-col h-screen overflow-hidden">
        
        {/* Navigation Bar inside Patient View */}
        <div className="bg-white px-6 py-2 border-b border-gray-100 flex items-center">
             <button onClick={() => navigate('/dashboard')} className="flex items-center text-slate-500 hover:text-primary transition-colors text-sm font-medium">
                 <ArrowLeft size={16} className="mr-1"/> Volver al Dashboard
             </button>
        </div>

        <PatientHeader patient={patient} />

        <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <VitalChart />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-700 flex items-center"><History size={18} className="mr-2"/> Historial Reciente</h3>
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded">Últimos 6 meses</span>
                        </div>
                        <ul className="space-y-3">
                            {patient.medicalHistory.map((h, i) => (
                                <li key={i} className="flex justify-between text-sm border-b border-slate-50 pb-2">
                                    <span>{h.condition}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${h.status === 'Active' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{h.status}</span>
                                </li>
                            ))}
                            {patient.familyHistory.length > 0 && (
                                <li className="flex justify-between text-sm bg-red-50 p-2 rounded border border-red-100 mt-2">
                                    <span className="font-bold text-red-700">Ant. Familiar: {patient.familyHistory[0].condition}</span>
                                    <AlertCircle size={16} className="text-red-500"/>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                         <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-700 flex items-center"><FlaskConical size={18} className="mr-2"/> Resultados Laboratorio</h3>
                        </div>
                        <ul className="space-y-3">
                             {patient.recentLabs.map((lab) => (
                                <li key={lab.id} className="flex flex-col text-sm border-l-4 border-red-400 pl-3 py-1 bg-red-50/50">
                                    <div className="flex justify-between">
                                        <span className="font-bold">{lab.testName}</span>
                                        <span className="text-slate-500 text-xs">{lab.date}</span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-red-600 font-bold">{lab.value} {lab.unit}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-primary/20 shadow-md ring-1 ring-primary/5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center">
                            <ClipboardList className="mr-2 text-primary"/> Notas de Consulta Actual
                        </h3>
                        <div className="flex items-center space-x-2">
                            {isListening && <span className="text-xs text-red-500 font-bold animate-pulse">● Grabando...</span>}
                            <button onClick={toggleListening} className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white shadow-lg ring-4 ring-red-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
                                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>
                        </div>
                    </div>
                    <textarea 
                        className="w-full h-40 p-4 rounded-lg bg-slate-50 border border-slate-300 focus:ring-2 focus:ring-primary outline-none resize-none font-medium text-slate-700"
                        placeholder="Dicte o escriba los síntomas..."
                        value={consultationNotes}
                        onChange={(e) => setConsultationNotes(e.target.value)}
                    ></textarea>
                    <div className="mt-4 flex justify-end">
                         <button onClick={handleFinalizeConsultation} className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow hover:bg-teal-700 transition-transform active:scale-95">
                             Finalizar Consulta
                         </button>
                    </div>
                </div>
            </div>

            <div className="w-[400px] hidden xl:block h-full shadow-2xl z-20">
                <AICopilot patient={patient} notesInput={consultationNotes} />
            </div>
        </div>
        
        <TriageModal isOpen={showTriage} onClose={() => setShowTriage(false)} data={triageData} loading={triageLoading} /> 
        {/* We need to pass a confirmation handler to TriageModal in real implementation */}
      </main>
    </div>
  );
};

export default PatientView;
