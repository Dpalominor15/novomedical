import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, Send, BrainCircuit, FileText, ChevronRight } from 'lucide-react';
import { Patient } from '../types';
import { analyzePatientCase, chatWithCopilot } from '../services/geminiService';

interface Props {
  patient: Patient;
  notesInput: string;
}

const AICopilot: React.FC<Props> = ({ patient, notesInput }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, analysis]);

  const handleDeepAnalysis = async () => {
    if (!notesInput) {
        alert("Por favor ingrese síntomas o notas en el área izquierda para analizar.");
        return;
    }
    setLoading(true);
    const result = await analyzePatientCase(patient, notesInput);
    setAnalysis(result);
    setLoading(false);
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setLoading(true);

    // Prepare context for chat
    const historyApiFormat = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));
    
    // Inject patient context in the latest turn essentially (simulated context)
    const contextPrompt = `Contexto Paciente: ${patient.name}, ${patient.age} años. Antecedentes: ${patient.familyHistory.map(f => f.condition).join(', ')}. Pregunta: ${userMsg}`;

    const response = await chatWithCopilot(historyApiFormat, contextPrompt);
    
    setMessages(prev => [...prev, { role: 'model', text: response || 'Error en respuesta.' }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-2 text-primary">
          <Sparkles size={20} className="text-accent" />
          <h2 className="font-bold text-lg">Copiloto IA MediCore</h2>
        </div>
        <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold flex items-center">
            <Bot size={12} className="mr-1"/> Gemini 2.5 Active
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        
        {/* Initial Call to Action */}
        {!analysis && messages.length === 0 && (
            <div className="text-center py-10 px-6 text-slate-500">
                <BrainCircuit size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="mb-4">Ingresa los síntomas actuales del paciente en el panel izquierdo y solicita un análisis profundo para detectar correlaciones ocultas.</p>
                <button 
                    onClick={handleDeepAnalysis}
                    disabled={loading || notesInput.length < 5}
                    className={`px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center mx-auto ${notesInput.length > 5 ? 'bg-gradient-to-r from-primary to-teal-600 text-white hover:scale-105' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                    {loading ? 'Analizando...' : 'Analizar Caso Completo'}
                </button>
            </div>
        )}

        {/* AI Analysis Result */}
        {analysis && (
            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden animate-fade-in-up">
                <div className="bg-slate-800 text-white p-3 flex items-center">
                    <FileText size={16} className="mr-2" />
                    <span className="font-semibold text-sm">Análisis Clínico Generado</span>
                </div>
                <div className="p-5 prose prose-sm max-w-none text-slate-700">
                   {/* Rendering markdown-like text simply for prototype */}
                   {analysis.split('\n').map((line, i) => (
                       <p key={i} className={`mb-2 ${line.startsWith('**Alerta') ? 'text-red-600 font-bold bg-red-50 p-2 rounded' : ''} ${line.startsWith('**Hipótesis') ? 'text-primary font-bold' : ''}`}>
                           {line.replace(/\*\*/g, '')}
                       </p>
                   ))}
                </div>
                <div className="bg-slate-50 p-3 border-t border-slate-100 flex justify-end space-x-2">
                    <button className="text-xs bg-white border border-slate-300 px-3 py-1 rounded hover:bg-slate-50">Copiar a Historia</button>
                    <button className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-teal-700">Validar Fuentes</button>
                </div>
            </div>
        )}

        {/* Chat Messages */}
        {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}`}>
                    {msg.text}
                </div>
            </div>
        ))}
        
        {loading && (
            <div className="flex items-center space-x-2 text-slate-400 text-sm pl-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                <span>Pensando...</span>
            </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-center space-x-2 bg-slate-100 rounded-full px-4 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
            <input 
                type="text" 
                placeholder="Pregunta a la IA (ej. Dosis de...)"
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-400"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
            />
            <button 
                onClick={handleChat}
                className="p-2 bg-primary text-white rounded-full hover:bg-teal-700 transition-colors shadow-sm"
            >
                <Send size={16} />
            </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
            La IA puede cometer errores. Verifica siempre información crítica.
        </p>
      </div>
    </div>
  );
};

export default AICopilot;
