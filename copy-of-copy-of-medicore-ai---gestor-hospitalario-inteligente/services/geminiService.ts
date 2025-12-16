import { GoogleGenAI, HarmCategory, HarmBlockThreshold, Schema } from "@google/genai";
import { Patient } from '../types';

// WARNING: In a production app, the API Key should be handled via a secure backend proxy.
// Direct frontend usage is only for prototyping/demos.
const API_KEY = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey: API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

export const analyzePatientCase = async (patient: Patient, currentSymptoms: string) => {
  if (!API_KEY) return "Error: API Key no configurada.";

  const prompt = `
    Actúa como un médico especialista senior y asistente de diagnóstico clínico (Copiloto Médico).
    Analiza la siguiente información del paciente con extremo detalle para encontrar correlaciones ocultas que un humano podría pasar por alto por falta de tiempo.

    DATOS DEL PACIENTE:
    ${JSON.stringify(patient, null, 2)}

    SÍNTOMAS ACTUALES REPORTADOS EN CONSULTA:
    "${currentSymptoms}"

    TU OBJETIVO:
    1. Identificar posibles diagnósticos basados en la tríada: Historial + Exámenes Pasados + Síntomas Actuales.
    2. ALERTA CRÍTICA: Busca si hay exámenes recientes (últimos 3 meses) que muestren anormalidades y correlaciónalos con los síntomas actuales (ej. moretones + leucocitos bajos/altos).
    3. Sugerir el plan de acción inmediato y exámenes requeridos.
    4. Citar fuentes médicas generales (ej. Guías Clínicas, Mayo Clinic) para validar la sospecha.

    FORMATO DE RESPUESTA (Usa Markdown):
    - **Alerta de Seguridad**: Si encuentras algo grave ignorado previamente.
    - **Hipótesis Diagnóstica**: Lista numerada con probabilidades.
    - **Justificación**: Por qué crees esto (conecta los puntos: abuela con leucemia + moretones + labs anteriores alterados).
    - **Plan Recomendado**: Pasos a seguir.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.2, // Low temperature for more analytical/factual responses
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }, // Medical context requires discussing illness
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Lo siento, hubo un error conectando con el servicio de IA. Verifique su conexión.";
  }
};

export const chatWithCopilot = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
    if (!API_KEY) return "Error: API Key no configurada.";
    
    // Simple wrapper for chat interface
    try {
        const chat = ai.chats.create({
            model: MODEL_NAME,
            history: history,
            config: {
                systemInstruction: "Eres MediCore, un asistente médico avanzado. Responde de forma concisa, profesional y basada en evidencia. Tu prioridad es la seguridad del paciente."
            }
        });
        
        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Chat Error:", error);
        return "Error en el servicio de chat.";
    }
}

// New function for structured Triage/Referral logic
export const generateTriageRecommendation = async (patient: Patient, notes: string) => {
    if (!API_KEY) throw new Error("API Key missing");

    const prompt = `
        Analiza las notas de la consulta y el historial del paciente.
        Genera una recomendación de triage, posible diagnóstico (CIE-10 aproximado) y especialidad sugerida.
        
        Paciente: ${JSON.stringify(patient)}
        Notas de consulta: "${notes}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        diagnosis: { type: "STRING", description: "Diagnóstico presuntivo principal" },
                        icd10Code: { type: "STRING", description: "Código CIE-10 estimado" },
                        urgencyLevel: { type: "STRING", enum: ["Baja", "Moderada", "Alta", "Crítica"] },
                        specialtyReferral: { type: "STRING", description: "Especialidad médica a la que se debe derivar" },
                        reasoning: { type: "STRING", description: "Breve justificación clínica para la derivación (max 30 palabras)" },
                        recommendedLabTests: { type: "ARRAY", items: { type: "STRING" } }
                    }
                } as Schema // Explicit casting if strictly typed
            }
        });
        
        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Triage Error:", error);
        return null;
    }
}