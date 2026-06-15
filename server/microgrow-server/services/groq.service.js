const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = 'llama-3.1-8b-instant'; // fast + free tier friendly

// ---------------------------------------------
// 1. Concept Explainer
// Given a topic, return a clear explanation in under 60 seconds of reading
// ---------------------------------------------
const explainConcept = async (topic) => {
  const prompt = `Explain the CS concept "${topic}" to a student preparing for technical interviews.

Rules:
- Keep it short enough to read in under 60 seconds (roughly 120-150 words)
- Use exactly ONE simple real-world analogy
- No jargon without explaining it
- End with one sentence on why this matters in interviews

Format as plain text, no markdown headers.`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 300,
  });

  return completion.choices[0].message.content.trim();
};

// ---------------------------------------------
// 2. DSA Approach Evaluator
// User writes their approach in plain English, AI scores and gives feedback
// ---------------------------------------------
const evaluateApproach = async (problemTitle, problemPrompt, expectedApproach, userApproach) => {
  const prompt = `You are evaluating a student's approach to a DSA interview problem. Be encouraging but honest.

Problem: ${problemTitle}
Problem description: ${problemPrompt}
A correct/expected approach: ${expectedApproach}
Student's approach: "${userApproach}"

Evaluate the student's approach and respond in this EXACT JSON format with no extra text:
{
  "score": <integer 1-5>,
  "verdict": "<one of: Correct, Partially Correct, Incorrect, Off Track>",
  "timeComplexity": "<student's likely time complexity, e.g. O(n), or 'not addressed'>",
  "feedback": "<2-3 sentences: what they got right, what they missed, one suggestion>"
}`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 300,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(completion.choices[0].message.content);
};

// ---------------------------------------------
// 3. Flashcard Generator
// Given a topic, generate N question/answer pairs
// ---------------------------------------------
const generateFlashcards = async (topic, count = 5) => {
  const prompt = `Generate ${count} flashcards for the CS topic "${topic}" aimed at technical interview preparation.

Rules:
- Questions should be concise and test understanding, not just definitions
- Answers should be 1-3 sentences, clear and correct
- Mix difficulty levels (easy, medium, hard)

Respond in this EXACT JSON format with no extra text:
{
  "flashcards": [
    {"question": "...", "answer": "...", "difficulty": "easy|medium|hard"}
  ]
}`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.6,
    max_tokens: 800,
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(completion.choices[0].message.content);
  return result.flashcards;
};

module.exports = { explainConcept, evaluateApproach, generateFlashcards };
