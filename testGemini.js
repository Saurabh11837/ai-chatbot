import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const result = await model.generateContent("Say hello from Gemini");

    const response = await result.response;
    const text = response.text();

    console.log("Gemini Response:");
    console.log(text);

  } catch (error) {
    console.error("Gemini Error:", error);
  }
}

testGemini();