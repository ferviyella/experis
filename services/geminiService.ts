import { GoogleGenAI } from "@google/genai";
import { ProcessInputs, AutomationCosts, CalculationResults } from '../types';

export const generateExecutiveSummary = async (
  inputs: ProcessInputs,
  costs: AutomationCosts,
  results: CalculationResults
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

  const prompt = `
    Actúa como un Consultor Senior experto en Automatización Robótica de Procesos (RPA) e Inteligencia Artificial.
    Tu objetivo es escribir un "Resumen Ejecutivo" persuasivo para convencer a un cliente ("${inputs.processName || 'Cliente'}") de comprar este proyecto.
    
    Utiliza los siguientes datos calculados:
    
    -- DATOS DEL PROCESO ACTUAL --
    Nombre del Proceso: ${inputs.processName}
    Volumen Anual: ${(inputs.volumePerMonth * 12).toLocaleString()} transacciones
    Costo Actual Anual: $${results.currentAnnualCost.toLocaleString()}
    
    -- BENEFICIOS DE LA AUTOMATIZACIÓN --
    Horas ahorradas al año: ${Math.round(results.hoursSavedAnnually).toLocaleString()} horas (que el equipo puede dedicar a valor añadido)
    Retorno de Inversión (ROI 1er Año): ${results.roiYear1.toFixed(1)}%
    Recuperación de la inversión (Payback): ${results.paybackPeriodMonths.toFixed(1)} meses
    Ahorro Neto (Año 1): $${results.netSavingsYear1.toLocaleString()}
    Ahorro Neto (Proyección 3 años): $${results.netSavingsYear3.toLocaleString()}
    
    -- ESTRUCTURA DE LA PROPUESTA --
    1. Título impactante.
    2. El Desafío: Breve resumen de la ineficiencia actual (costos y horas perdidas).
    3. La Solución: Cómo la automatización transformará este proceso.
    4. El Impacto Financiero: Resalta el ROI y el Payback rápido.
    5. Cierre: Llamada a la acción profesional.

    El tono debe ser profesional, enfocado en negocios, innovación y eficiencia. Usa formato Markdown.
    No inventes números, usa estrictamente los proporcionados.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No se pudo generar el resumen.";
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Error al conectar con Gemini AI.");
  }
};
