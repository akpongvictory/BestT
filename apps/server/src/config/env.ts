import dotenv from "dotenv";

dotenv.config();

export const env = {
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-flash-latest",
  port: Number(process.env.PORT) || 5000,
};

console.log("=== BestT AI CONFIG ===");
console.log("Gemini API key:", Boolean(env.geminiApiKey));
console.log("Gemini model:", env.geminiModel);
console.log("Server port:", env.port);
console.log("=======================");