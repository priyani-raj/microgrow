const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = 'llama-3.1-8b-instant'; // fast + free tier friendly

// ---------------------------------------------
// 1. Concept Explainer
// Given a topic, return a clear explanation in under 60 seconds of reading
// ---------------------------------------------
const explainConcept = async (topic, simpler = false) => {
  const prompt = simpler
    ? `The student found your previous explanation of "${topic}" confusing. Try again with a COMPLETELY DIFFERENT, simpler analogy - assume they have very little background knowledge.

Rules:
- Keep it short enough to read in under 60 seconds (roughly 100-130 words)
- Use ONE very simple, everyday analogy (different from a typical one - think kitchen, sports, traffic, etc.)
- Avoid technical terms entirely where possible
- Build up from the most basic idea first

Format as plain text, no markdown headers.`
    : `Explain the CS concept "${topic}" to a student preparing for technical interviews.

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

// ---------------------------------------------
// 4. DSA Problem Generator
// Generates an original DSA problem with a title, prompt, and expected approach
// ---------------------------------------------
const generateDSAProblem = async (topic, difficulty) => {
  const prompt = `Create an original technical interview DSA practice problem.

Topic: ${topic}
Difficulty: ${difficulty}

Requirements:
- The problem must be ORIGINAL (do not copy well-known problems verbatim, write your own version/wording)
- It should be solvable conceptually in ${difficulty === 'easy' ? '8-10' : difficulty === 'medium' ? '10-15' : '15-20'} minutes by describing an approach (not writing full code)
- Provide a clear, correct "expected approach" explanation including the optimal algorithm and its time/space complexity

Respond in this EXACT JSON format with no extra text:
{
  "title": "<short descriptive title, 3-6 words>",
  "prompt": "<2-4 sentence problem description>",
  "expectedApproach": "<3-5 sentences explaining the optimal approach and its time/space complexity>",
  "tags": ["<tag1>", "<tag2>"],
  "estimatedMins": <integer>
}`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    max_tokens: 500,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(completion.choices[0].message.content);
};

module.exports = { explainConcept, evaluateApproach, generateFlashcards, generateDSAProblem };
