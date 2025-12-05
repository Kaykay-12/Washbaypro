import { GoogleGenAI } from "@google/genai";
import { Job, Expense } from "../types";

// In a real app, this would be a secure backend call.
// The user must provide the key, or we assume it's in env.
// For this demo, we assume process.env.API_KEY is available or handled by the caller.

export const generateBusinessInsight = async (
  jobs: Job[], 
  expenses: Expense[]
): Promise<string> => {
  try {
    // Safely check for process.env to avoid ReferenceError in browser
    const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;
    
    if (!apiKey) return "API Key not configured for AI insights.";

    const ai = new GoogleGenAI({ apiKey });
    
    const today = new Date().toISOString().split('T')[0];
    const todayJobs = jobs.filter(j => j.startTime.startsWith(today));
    const totalRevenue = todayJobs.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalExpenses = expenses.filter(e => e.date === today).reduce((acc, curr) => acc + curr.amount, 0);
    
    const prompt = `
      You are an expert business analyst for a Washing Bay in Accra, Ghana.
      Analyze today's performance:
      - Total Revenue: GHS ${totalRevenue}
      - Total Cars Washed: ${todayJobs.length}
      - Expenses: GHS ${totalExpenses}
      
      Provide a short, motivating summary (max 3 sentences) in English with a touch of Ghanaian friendly tone.
      Suggest one quick marketing tip for tomorrow.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate insight.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Insight currently unavailable (check connection).";
  }
};