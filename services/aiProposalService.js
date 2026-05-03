import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const generateProposalFromAI = async ({
  companyName,
  clientName,
  service,
  budget,
  timeline
}) => {

const prompt = `
Generate a professional B2B business proposal.

Return ONLY JSON.

Fields required:
title
introduction
scopeOfWork
timeline
budget
conclusion

Details:

Company: ${companyName}
Client: ${clientName}
Service: ${service}
Budget: ${budget}
Timeline: ${timeline}

Return format:

{
"title":"",
"introduction":"",
"scopeOfWork":[],
"timeline":"",
"budget":"",
"conclusion":""
}
`;

const response = await groq.chat.completions.create({
  model: process.env.GROQ_MODEL,
  messages: [
    {
      role: "user",
      content: prompt
    }
  ]
});

const text = response.choices[0].message.content;

const clean = text.replace(/```json|```/g, "").trim();

const jsonMatch = clean.match(/\{[\s\S]*\}/);

if (!jsonMatch) {
  throw new Error("Invalid AI JSON response");
}

return JSON.parse(jsonMatch[0]);

};