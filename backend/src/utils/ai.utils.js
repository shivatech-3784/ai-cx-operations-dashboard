import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const extractJson = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Invalid JSON from AI");
  return JSON.parse(match[0]);
};

export const analyzeTicketWithAI = async (title, description) => {
  console.log("🤖 Groq AI CALLED");

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `
You are an AI system for a customer support platform.
Return ONLY valid JSON. Do NOT add explanations.

Ticket:
Title: ${title}
Description: ${description}

Return:
{
  "severity": "low | medium | high",
  "summary": "short summary"
}
`
      }
    ],
    temperature: 0,
  });

  const content = response.choices[0].message.content;

  return extractJson(content);
};
