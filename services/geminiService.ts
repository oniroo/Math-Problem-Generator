
import { GoogleGenAI, Type } from "@google/genai";
import { Problem, ProblemType, UserPerformance } from "../types";
import { PROBLEM_TYPE_LABELS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export class GeminiMathService {
  static async generateProblems(
    types: ProblemType[], 
    count: number = 5, 
    performance?: UserPerformance
  ): Promise<Problem[]> {
    const typeDescriptions = types.map(t => `${t}`).join(", ");
    
    let personalContext = "";
    if (performance && performance.weakTypes.length > 0) {
      const weakLabelList = performance.weakTypes
        .filter(t => types.includes(t))
        .map(t => PROBLEM_TYPE_LABELS[t])
        .join(", ");
      
      if (weakLabelList) {
        personalContext = `
        User Profile Context:
        The user is currently struggling with these types: [${weakLabelList}].
        For these specific types, please:
        1. Provide problems that reinforce fundamental concepts.
        2. Ensure the 'explanation' is extra clear and breaks down every single logarithmic step.
        3. Prioritize these types in the generated set if possible.`;
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} math problems about logarithms. 
      The requested types are: [${typeDescriptions}].
      ${personalContext}
      
      Requirements:
      1. Numbers should be simple (integers or basic fractions) so they can be solved mentally or with simple calculation.
      2. Question and explanation must use LaTeX format (wrapped in $...$ or $$...$$).
      3. For 'APPROXIMATION' type, provide the base log values like $\\log_{10} 2 = 0.3010$ and ask to find another value.
      4. Language: Korean.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING, description: "One of the provided ProblemType values" },
              typeName: { type: Type.STRING },
              question: { type: Type.STRING, description: "Problem text with LaTeX" },
              correctAnswer: { type: Type.STRING, description: "The final numerical or simple LaTeX answer" },
              explanation: { type: Type.STRING, description: "Step-by-step solution using LaTeX" }
            },
            required: ["id", "type", "typeName", "question", "correctAnswer", "explanation"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      return [];
    }
  }
}
