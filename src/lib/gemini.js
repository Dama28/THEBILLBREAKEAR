import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
}

export async function getEnergyAdvice(appliances, currentBill) {
    if (!genAI) {
        return { error: "API Key missing" };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const applianceList = appliances.map(a => `${a.name} (${a.wattage}W, ${a.hours_per_day}h/day)`).join(", ");

        const prompt = `
      You are an expert energy consultant called "The Bill Breaker".
      
      User Context:
      - Current Estimated Bill: $${currentBill}
      - Appliances: ${applianceList}

      Task:
      1. Identify the appliance consuming the most energy.
      2. Suggest one specific action to reduce its usage.
      3. Recommend the best time of day to use high-energy appliances (assuming standard TOU rates).
      
      Format the output as JSON with keys: "highest_consumer", "action_item", "best_hours".
      Keep the advice specific and under 20 words per item.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Simple cleanup to ensure valid JSON parsing if the model adds markdown
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Error:", error);
        return {
            highest_consumer: "Analysis unavailable",
            action_item: "Could not generate advice at this time.",
            best_hours: "Off-peak hours (usually 9PM - 7AM)"
        };
    }
}
