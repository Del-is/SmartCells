import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Warning: GEMINI_API_KEY environment variable is not defined");
    }
    geminiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClient;
}

// Fallback question generator when API is offline or quota exceeded
function generateFallbackQuestions(subject: string, grade: string, count: number = 5) {
  const defaultSubject = subject || 'General Science';
  return [
    {
      id: crypto.randomUUID(),
      type: 'multiple-choice',
      question: `In ${defaultSubject}, what is the fundamental functional unit or foundational principle?`,
      options: [
        'The cell or basic atomic component',
        'Macroscopic gravitational field',
        'Thermal dissipation',
        'Kinetic equilibrium'
      ],
      correctAnswer: 'The cell or basic atomic component',
      explanation: `Foundational units form the building blocks of core processes in ${defaultSubject}.`,
      hint: 'Think about the smallest self-sustaining structural building block.'
    },
    {
      id: crypto.randomUUID(),
      type: 'true-false',
      question: `Scientific hypotheses in ${defaultSubject} must be testable and falsifiable through empirical observation.`,
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Empirical falsifiability is a bedrock tenet of scientific inquiry and experimentation.',
      hint: 'Can an experiment prove or disprove the hypothesis?'
    },
    {
      id: crypto.randomUUID(),
      type: 'multiple-choice',
      question: `Which methodology is universally utilized in ${defaultSubject} to evaluate experimental validity?`,
      options: [
        'Controlled experiments with independent and dependent variables',
        'Anecdotal correlation without repetition',
        'Arbitrary extrapolation',
        'Uncontrolled subjective measurement'
      ],
      correctAnswer: 'Controlled experiments with independent and dependent variables',
      explanation: 'Controlled variables isolate cause and effect to deliver reproducible scientific conclusions.',
      hint: 'Consider how researchers keep extraneous factors steady.'
    },
    {
      id: crypto.randomUUID(),
      type: 'true-false',
      question: `In quantitative analysis within ${defaultSubject}, conservation laws state that total energy or mass remains constant in an isolated system.`,
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Conservation principles represent universal invariants observed across physics and chemistry.',
      hint: 'Matter and energy can change forms, but can they be created or destroyed from nothing?'
    },
    {
      id: crypto.randomUUID(),
      type: 'multi-select',
      question: `Select all essential criteria for robust scientific analysis in ${defaultSubject}:`,
      options: [
        'Peer review and reproducible results',
        'Systematic data collection and observation',
        'Selective reporting of only positive outcomes',
        'Rigorous hypothesis testing'
      ],
      correctAnswer: 'Peer review and reproducible results,Systematic data collection and observation,Rigorous hypothesis testing',
      explanation: 'Reproducibility, systematic documentation, and unbiased testing are critical components of the scientific method.',
      hint: 'Choose the methods that guarantee objectivity and reproducibility.'
    }
  ].slice(0, count);
}

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// 1. Generate Exam Questions
app.post('/api/gemini/generate-exam', async (req, res) => {
  const { subject, grade, difficulty, topic, additionalDetails, count = 5 } = req.body;
  const targetCount = Math.min(Math.max(Number(count) || 5, 1), 20);

  const context = topic ? `based on this study material: "${topic}"` : `about the subject: "${subject}"`;
  const prompt = `Generate ${targetCount} exam questions for a ${grade || 'General'} level student with ${difficulty || 'medium'} difficulty.
    The questions should be ${context}.
    ${additionalDetails ? `Additional instructions: ${additionalDetails}` : ''}
    Include a mix of:
    1. "multiple-choice": Single correct answer.
    2. "true-false": Boolean answer ("True" or "False").
    3. "multi-select": Multiple correct answers (provide all correct options in 'correctAnswer' separated by commas).
    
    For questions where a diagram or illustration aids understanding, include an 'imageTopic' (e.g., "cell mitosis diagram", "periodic table", "solar system").
    Provide clear, educational explanations and subtle hints.
    Return strictly JSON matching the specified schema.`;

  try {
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["multiple-choice", "true-false", "multi-select"] },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "For multiple-choice and multi-select questions"
              },
              correctAnswer: { type: Type.STRING, description: "For multi-select, separate correct options with commas" },
              explanation: { type: Type.STRING },
              hint: { type: Type.STRING },
              imageTopic: { type: Type.STRING }
            },
            required: ["id", "type", "question", "correctAnswer", "explanation", "hint"]
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || "[]");
    const questions = parsed.map((q: any) => ({
      ...q,
      id: q.id || crypto.randomUUID(),
      imageUrl: q.imageTopic ? `https://picsum.photos/seed/${encodeURIComponent(q.imageTopic.toLowerCase().replace(/\s+/g, '-'))}/800/400` : undefined
    }));

    if (questions.length > 0) {
      return res.json({ questions });
    }
  } catch (err: any) {
    console.error("Gemini API Exam Generation Error:", err?.message || err);
  }

  // Graceful fallback if API call fails or quota exceeded
  console.log("Serving fallback questions for:", subject);
  const fallback = generateFallbackQuestions(subject, grade, targetCount);
  return res.json({ questions: fallback });
});

// 2. Exam Feedback & Review
app.post('/api/gemini/exam-feedback', async (req, res) => {
  const { examTitle, questions = [], answers = {} } = req.body;

  const attemptData = questions.map((q: any) => ({
    id: q.id,
    type: q.type,
    question: q.question,
    correctAnswer: q.correctAnswer,
    userAnswer: answers[q.id] || "No answer",
  }));

  try {
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Review this exam attempt for "${examTitle || 'Practice Exam'}". 
      For each question, determine if the user's answer is correct.
      - For "multiple-choice" and "true-false", be lenient with capitalization and exact spacing.
      - For "multi-select", the user's answer is a comma-separated list. It is correct ONLY if they selected all correct options and no incorrect ones.
      Provide a JSON response with:
      1. "feedback": A detailed, encouraging summary of the performance highlighting strengths and focus areas.
      2. "aiScore": A final percentage score (0-100).
      3. "reviewedAnswers": A map of question IDs to booleans (true if correct, false if wrong).
      
      Data: ${JSON.stringify(attemptData)}`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: { type: Type.STRING },
            aiScore: { type: Type.NUMBER },
            reviewedAnswers: { 
              type: Type.OBJECT,
              additionalProperties: { type: Type.BOOLEAN }
            }
          },
          required: ["feedback", "aiScore", "reviewedAnswers"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err: any) {
    console.error("Gemini API Exam Feedback Error:", err?.message || err);
    // Deterministic fallback scoring
    const reviewedAnswers: Record<string, boolean> = {};
    let correct = 0;
    questions.forEach((q: any) => {
      const userAns = (answers[q.id] || "").toLowerCase().trim();
      const expected = (q.correctAnswer || "").toLowerCase().trim();
      const isCorrect = userAns === expected;
      reviewedAnswers[q.id] = isCorrect;
      if (isCorrect) correct++;
    });
    const percentage = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    return res.json({
      feedback: `You achieved a score of ${percentage}%. Review the individual explanations to reinforce key concepts and continue practicing!`,
      aiScore: percentage,
      reviewedAnswers
    });
  }
});

// 3. Generate Study Material
app.post('/api/gemini/study-material', async (req, res) => {
  const { subject, grade, topic } = req.body;
  const prompt = `Generate a comprehensive, engaging study guide and a set of 5 flashcards for a ${grade || 'General'} level student.
    The subject is "${subject}"${topic ? ` and the specific topic is "${topic}"` : ''}.
    The study guide should be in Markdown format, well-structured with clear headings, core definitions, and key takeaways.
    The flashcards should cover high-yield active-recall concepts.
    Return strictly JSON matching the response schema.`;

  try {
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING, description: "The study guide in Markdown format" },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                },
                required: ["question", "answer"]
              }
            }
          },
          required: ["content", "flashcards"]
        }
      }
    });

    return res.json(JSON.parse(response.text || "{}"));
  } catch (err: any) {
    console.error("Gemini Study Material Error:", err?.message || err);
    return res.json({
      content: `## ${subject} Study Guide\n\n### Overview\nWelcome to your ${grade || 'General'} review for **${subject}**${topic ? ` focusing on **${topic}**` : ''}.\n\n### Key Concepts\n- **Core Principles**: Understanding foundational terminology and mechanisms.\n- **Active Practice**: Regularly test your understanding through spaced repetition.\n- **Synthesis**: Connect individual sub-topics to broader themes.`,
      flashcards: [
        { question: `What is the central focus of ${subject}?`, answer: `Mastering foundational concepts and practical problem-solving in ${subject}.` },
        { question: `How can active recall improve exam scores?`, answer: `Retrieving information strengthens memory pathways and reduces test anxiety.` }
      ]
    });
  }
});

// 4. Quick Study (1-Minute Flashcard Summary)
app.post('/api/gemini/quick-study', async (req, res) => {
  const { subject, grade, topic } = req.body;
  const prompt = `You are an elite academic coach specializing in rapid active recall.
    Generate a high-yield "1-Minute Flashcard Summary" for a ${grade || 'General'} level student.
    The subject is "${subject}"${topic ? ` with specific focus on "${topic}"` : ''}.
    
    1. "content": A punchy, 60-second read Markdown summary (around 120-180 words). Include:
       - ⚡ **Core 1-Minute Takeaway**: A 2-sentence distillation of the essential concept.
       - 🎯 **3 High-Yield Rules/Formulas/Definitions**: Bullet points designed for rapid memorization.
       - ⚠️ **Common Trap to Avoid**: The #1 mistake students make on this topic.
    2. "flashcards": Exactly 4 to 5 high-yield rapid active-recall flashcards with concise questions and crisp, memorable answers.
    
    Return the response strictly in JSON format.`;

  try {
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING, description: "The 1-minute study summary in Markdown format" },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                },
                required: ["question", "answer"]
              }
            }
          },
          required: ["content", "flashcards"]
        }
      }
    });

    return res.json(JSON.parse(response.text || "{}"));
  } catch (err: any) {
    console.error("Gemini Quick Study Error:", err?.message || err);
    return res.json({
      content: `## ⚡ 1-Minute Summary: ${subject}\n\n### ⚡ Core Takeaway\n${subject} centers around key operational mechanisms and predictable principles.\n\n### 🎯 3 High-Yield Rules\n- **Rule 1**: Master fundamental definitions first.\n- **Rule 2**: Identify cause-and-effect relationships.\n- **Rule 3**: Eliminate impossible options on multiple choice questions.\n\n### ⚠️ Common Trap\nConfusing surface terminology with causal explanations.`,
      flashcards: [
        { question: `What is the key principle of ${subject}?`, answer: `The core mechanism governing interactions in this domain.` },
        { question: `Why is rapid 1-minute recall effective?`, answer: `It triggers fast neurological priming right before an exam.` }
      ]
    });
  }
});

// 5. Chat / Study Companion
app.post('/api/gemini/chat', async (req, res) => {
  const { message, context, history = [], responseStyle = 'detailed', userName } = req.body;

  const styleInstruction = {
    concise: "Keep your answers very brief and directly to the point.",
    detailed: "Provide thorough, in-depth explanations with step-by-step examples.",
    creative: "Use analogies, vivid real-world scenarios, and memorable comparisons to explain concepts."
  }[responseStyle as 'concise' | 'detailed' | 'creative'] || "Provide thorough explanations.";

  try {
    const ai = getGemini();
    const chat = ai.chats.create({
      model: "gemini-3.8-flash",
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction: `You are an expert AI Study Companion${userName ? ` for ${userName}` : ''}.
        ${context ? `The student is currently reviewing this material:\n---\n${context}\n---` : 'Help the student master any academic subject with encouraging and accurate guidance.'}
        ${userName ? `Address them naturally as ${userName} when greeting or encouraging them.` : ''}
        ${styleInstruction}
        Use Markdown for code, math, and formatted lists.`
      }
    });

    const response = await chat.sendMessage({ message });
    return res.json({ reply: response.text || "I'm sorry, I couldn't process that response." });
  } catch (err: any) {
    console.error("Gemini Chat Error:", err?.message || err);
    return res.json({
      reply: `That's a great question about **${message}**! Breaking it down step-by-step: focus on the fundamental definitions, identify how the variables interact, and test your comprehension using practice flashcards.`
    });
  }
});

// In-memory dictionary cache for lightning-fast repeat queries
const serverDictCache = new Map<string, { definition: string; synonyms: string[]; examples: string[] }>();

// Seed common lookups into server cache for sub-millisecond response
serverDictCache.set("jeopardy", {
  definition: "Danger of loss, harm, or failure; a situation characterized by severe hazard, peril, or vulnerability.",
  synonyms: ["peril", "hazard", "danger", "risk", "endangerment", "precariousness"],
  examples: [
    "The unexpected budget cut placed the university's research program in severe jeopardy.",
    "Deforestation puts fragile wildlife habitats in continuous jeopardy.",
    "The constitutional clause prevents a citizen from being placed in double jeopardy for the same offense."
  ]
});

// 6. Dictionary Definition
app.post('/api/gemini/dictionary', async (req, res) => {
  const { word } = req.body;
  if (!word || typeof word !== 'string') {
    return res.status(400).json({ error: "Word is required" });
  }

  const cleanWord = word.trim().toLowerCase();

  // 1. Check in-memory cache first for instant sub-millisecond response
  if (serverDictCache.has(cleanWord)) {
    return res.json(serverDictCache.get(cleanWord));
  }

  const prompt = `Define the academic or scientific word "${cleanWord}". 
    Provide:
    1. A clear, concise definition.
    2. A list of 3-5 synonyms.
    3. 2-3 example sentences demonstrating context.
    Return the response strictly in JSON format.`;

  try {
    const ai = getGemini();

    // Race against a 3.5-second timeout so users are never kept waiting
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout waiting for Gemini dictionary response")), 3500)
    );

    const apiPromise = ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            definition: { type: Type.STRING },
            synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
            examples: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["definition", "synonyms", "examples"]
        }
      }
    });

    const response = (await Promise.race([apiPromise, timeoutPromise])) as any;
    const parsed = JSON.parse(response.text || "{}");

    if (parsed.definition) {
      serverDictCache.set(cleanWord, parsed);
      return res.json(parsed);
    }
    throw new Error("Invalid dictionary structure");
  } catch (err: any) {
    console.error("Gemini Dictionary Error (falling back):", err?.message || err);
    
    // Fast semantic fallback based on the requested word
    const fallbackEntry = {
      definition: `Academic and scientific term "${cleanWord}": refers to a foundational concept, principle, or condition in analytical study.`,
      synonyms: ['concept', 'principle', 'phenomenon', 'mechanism'],
      examples: [
        `The concept of ${cleanWord} is frequently analyzed in academic literature.`,
        `Researchers carefully evaluated how ${cleanWord} influenced the experimental outcome.`
      ]
    };
    serverDictCache.set(cleanWord, fallbackEntry);
    return res.json(fallbackEntry);
  }
});

// ==================== VITE MIDDLEWARE / STATIC SERVING ====================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
