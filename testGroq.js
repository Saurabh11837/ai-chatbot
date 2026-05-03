import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

async function testAI() {
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "user", content: "Say hello from Groq AI" }
      ]
    });

    console.log("AI Response:");
    console.log(response.choices[0].message.content);

  } catch (error) {
    console.error("Error:", error);
  }
}

testAI();