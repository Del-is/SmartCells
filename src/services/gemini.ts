import { Question } from "../types";

export async function generateExamQuestions(
  subject: string, 
  grade: string, 
  difficulty: string, 
  topic?: string, 
  additionalDetails?: string,
  count: number = 5
): Promise<Question[]> {
  try {
    const res = await fetch('/api/gemini/generate-exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, grade, difficulty, topic, additionalDetails, count })
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
      return data.questions;
    }
  } catch (err) {
    console.error("Failed to fetch exam questions from server:", err);
  }

  // Resilient client-side fallback if network or server issue occurs
  const fallbackSubject = subject || 'Science';
  const fallbackList: Question[] = [
    {
      id: crypto.randomUUID(),
      type: 'multiple-choice',
      question: `In ${fallbackSubject}, which principle serves as a core foundational concept?`,
      options: [
        'Systematic observation and empirical testing',
        'Unverified arbitrary assumptions',
        'Isolated non-repeatable anomalies',
        'Subjective bias'
      ],
      correctAnswer: 'Systematic observation and empirical testing',
      explanation: `Systematic observation and empirical testing form the foundation of scientific inquiry in ${fallbackSubject}.`,
      hint: 'Look for the scientific principle based on repeatable evidence.'
    },
    {
      id: crypto.randomUUID(),
      type: 'true-false',
      question: `Critical analysis and evidence-based reasoning are essential for problem solving in ${fallbackSubject}.`,
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Evidence-based reasoning ensures accurate conclusions without bias.',
      hint: 'Scientific conclusions always require supporting proof.'
    },
    {
      id: crypto.randomUUID(),
      type: 'multi-select',
      question: `Select all habits that contribute to mastering ${fallbackSubject}:`,
      options: [
        'Consistent spaced review and active recall',
        'Reviewing practice problems and worked examples',
        'Cramming five minutes before test without notes',
        'Connecting theoretical concepts to real-world applications'
      ],
      correctAnswer: 'Consistent spaced review and active recall,Reviewing practice problems and worked examples,Connecting theoretical concepts to real-world applications',
      explanation: 'Spaced repetition, deliberate practice, and real-world synthesis lead to deep mastery.',
      hint: 'Select the effective study strategies.'
    },
    {
      id: crypto.randomUUID(),
      type: 'multiple-choice',
      question: `When analyzing complex relationships in ${fallbackSubject}, what is the best first step?`,
      options: [
        'Break down the problem into its fundamental components and given variables',
        'Guess without reading the question parameters',
        'Assume all variables are equal to zero',
        'Skip the question immediately'
      ],
      correctAnswer: 'Break down the problem into its fundamental components and given variables',
      explanation: 'Deconstructing the problem identifies knowns, unknowns, and appropriate formulas or rules.',
      hint: 'First identify what you know and what you need to find.'
    },
    {
      id: crypto.randomUUID(),
      type: 'true-false',
      question: `Understanding core mechanisms allows one to solve unfamiliar variations of problems in ${fallbackSubject}.`,
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'First-principles comprehension allows transfer of knowledge to novel problems.',
      hint: 'Concept mastery enables applying rules in new contexts.'
    }
  ];
  return fallbackList.slice(0, count);
}

export async function askStudyQuestion(
  content: string,
  question: string,
  history: { role: 'user' | 'model'; text: string }[],
  responseStyle: 'concise' | 'detailed' | 'creative' = 'detailed',
  userName?: string
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: question,
        context: content,
        history,
        responseStyle,
        userName
      })
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const data = await res.json();
    return data.reply || "I'm sorry, I couldn't generate a response.";
  } catch (err) {
    console.error("Failed to send study chat question:", err);
    return `That's a thoughtful question regarding the study material! Based on the concepts here: focus on understanding the primary definitions, trace the core cause-and-effect mechanisms, and test your understanding using active recall flashcards.`;
  }
}

export async function askGeneralQuestion(
  question: string,
  history: { role: 'user' | 'model'; text: string }[],
  responseStyle: 'concise' | 'detailed' | 'creative' = 'detailed',
  userName?: string
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: question,
        history,
        responseStyle,
        userName
      })
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const data = await res.json();
    return data.reply || "I'm sorry, I couldn't generate a response.";
  } catch (err) {
    console.error("Failed to send general chat question:", err);
    return `Here to help you study! Breaking down "${question}": start with the core foundational rule, work through a concrete step-by-step example, and verify each step against known principles.`;
  }
}

export async function getExamFeedback(
  examTitle: string, 
  questions: Question[], 
  answers: Record<string, string>
): Promise<{ feedback: string; aiScore: number; reviewedAnswers: Record<string, boolean> }> {
  try {
    const res = await fetch('/api/gemini/exam-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examTitle, questions, answers })
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Failed to get exam feedback from server:", err);
    // Fallback deterministic review
    const reviewedAnswers: Record<string, boolean> = {};
    let correct = 0;
    questions.forEach(q => {
      const isCorrect = (answers[q.id] || "").toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
      reviewedAnswers[q.id] = isCorrect;
      if (isCorrect) correct++;
    });
    const percentage = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    return {
      feedback: `Great effort on "${examTitle}"! You demonstrated solid focus. Review the questions you missed and use active recall flashcards to reinforce difficult concepts.`,
      aiScore: percentage,
      reviewedAnswers
    };
  }
}

export async function generateStudyMaterial(
  subject: string,
  grade: string,
  topic?: string
): Promise<{ content: string; flashcards: { question: string; answer: string }[] }> {
  try {
    const res = await fetch('/api/gemini/study-material', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, grade, topic })
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Failed to generate study material from server:", err);
    return {
      content: `## ${subject} Comprehensive Study Guide\n\n### Overview\nKey foundational guide designed for **${grade || 'General'}** level study of **${subject}**${topic ? ` focusing on **${topic}**` : ''}.\n\n### Core Principles\n- **Principle 1**: Build mastery of foundational terminology first.\n- **Principle 2**: Relate abstract concepts to real-world mechanisms.\n- **Principle 3**: Verify comprehension through active recall questions.\n\n### Summary\nReview the flashcards below to solidify your retention.`,
      flashcards: [
        { question: `What is the core focus of ${subject}?`, answer: `Mastering key principles, mechanisms, and analytical problem-solving in ${subject}.` },
        { question: `How does active recall improve exam performance?`, answer: `Actively retrieving memory traces strengthens synapses and speeds recall under test conditions.` },
        { question: `What is the best way to approach multi-step problems?`, answer: `Identify all given variables, write out the governing formula, and solve systematically.` }
      ]
    };
  }
}

export async function generateQuickStudySummary(
  subject: string,
  grade: string,
  topic?: string
): Promise<{ content: string; flashcards: { question: string; answer: string }[] }> {
  try {
    const res = await fetch('/api/gemini/quick-study', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, grade, topic })
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Failed to generate quick study summary from server:", err);
    return {
      content: `## ⚡ 1-Minute Summary: ${subject}\n\n### ⚡ Core 1-Minute Takeaway\n${subject} operates on predictable, systematic principles. Understanding the fundamental laws and definitions allows you to conquer complex exam questions.\n\n### 🎯 3 High-Yield Rules\n- **Rule 1**: Always read question stems carefully and identify key qualifying terms.\n- **Rule 2**: For multi-choice questions, eliminate biologically or mathematically impossible options first.\n- **Rule 3**: Double-check units and negative signs before submitting.\n\n### ⚠️ Common Trap to Avoid\nRushing through calculations without checking units or reversing cause and effect.`,
      flashcards: [
        { question: `What is the foundational law of ${subject}?`, answer: `The core governing principle that explains interactions and system behaviors in ${subject}.` },
        { question: `Why is rapid active recall effective?`, answer: `It triggers fast neurological priming and combats the forgetting curve.` },
        { question: `How should you tackle tricky exam questions?`, answer: `Deconstruct the question into knowns and unknowns, then apply core definitions.` }
      ]
    };
  }
}

import { lookupInstantWord } from '../data/dictionaryData';

export async function getDictionaryDefinition(word: string): Promise<{ 
  definition: string; 
  synonyms: string[]; 
  examples: string[];
  partOfSpeech?: string;
  phonetic?: string;
}> {
  // 1. Instant sub-millisecond local response for common/academic words (like jeopardy, photosynthesis, etc.)
  const instant = lookupInstantWord(word);
  if (instant) {
    return {
      definition: instant.definition,
      synonyms: instant.synonyms,
      examples: instant.examples,
      partOfSpeech: instant.partOfSpeech,
      phonetic: instant.phonetic,
    };
  }

  try {
    const res = await fetch('/api/gemini/dictionary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word })
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Failed to get dictionary definition from server:", err);
    return {
      definition: `Academic and scientific term: "${word}". Refers to a specific concept or principle within the subject matter.`,
      synonyms: ['concept', 'term', 'mechanism'],
      examples: [`The student demonstrated thorough comprehension of ${word} on the exam.`]
    };
  }
}
