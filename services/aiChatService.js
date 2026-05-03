import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// System prompt with follow-up instruction
const SYSTEM_PROMPT = `
You are a helpful AI assistant similar to ChatGPT.

Rules:
- Provide clear, structured answers
- Use headings, bullet points, and examples where useful
- Keep language simple and readable
- Avoid spelling mistakes
- At the end of each answer, suggest 3-4 follow-up questions the user might ask next, numbered 1., 2., 3., 4.
`;

export const getAIResponseWithSuggestions = async (messages) => {
  const formattedMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages
  ];

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant", // fast response
    messages: formattedMessages,
    temperature: 0.3,
    top_p: 0.9,
    stream: false // full response, not streaming
  });

  const aiText = completion.choices[0].message.content;

  // Extract numbered follow-up questions from AI text
  const suggestions = extractSuggestions(aiText);

  return { reply: aiText, suggestions };
};

// Extract numbered lines like 1., 2., 3., 4.
const extractSuggestions = (text) => {
  const lines = text.split("\n");
  const suggestions = [];
  for (let line of lines) {
    line = line.trim();
    const match = line.match(/^[1-4]\.\s*(.+)/);
    if (match) suggestions.push(match[1]);
  }
  return suggestions;
};