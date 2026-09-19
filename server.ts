import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Helper to initialize GoogleGenAI safely
  function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // POST /api/course/summary
  // Integrates Gemini API to generate a brief, high-yield summary for any course
  app.post("/api/course/summary", async (req, res) => {
    try {
      const { title, description, category, topic, instructor, lessons } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        // High quality structured fallback if GEMINI_API_KEY is not configured
        return res.json({
          source: "curated",
          summary: {
            overview: `${title} is a comprehensive, production-grade masterclass covering ${topic || category || 'specialized skill sets'}. It equips learners with modern best practices, battle-tested architectural principles, and real-world project experience.`,
            keyTakeaways: [
              `Master core paradigms and workflows specific to ${topic || 'the subject matter'}.`,
              "Build modular, accessible, and high-performance components with clean architecture.",
              "Adopt industry-standard debugging, profiling, and quality-assurance routines.",
              "Prepare a professional portfolio deliverable ready for employer evaluation."
            ],
            targetAudience: `Designers, engineers, and ambitious practitioners aiming to gain mastery in ${topic || 'modern workflows'}.`,
            prerequisites: "Fundamental familiarity with basic technical principles; no advanced prior experience required.",
            estimatedPace: "3 to 5 hours per week recommended for optimal retention and hands-on exercises.",
            careerImpact: `Accelerates practical capabilities in ${category || 'technical problem solving'} for immediate workplace impact.`
          }
        });
      }

      const lessonList = Array.isArray(lessons) ? lessons.slice(0, 12).join("; ") : "";
      const prompt = `Analyze this course and synthesize a brief, engaging, high-yield executive summary for prospective students:
Course Title: "${title}"
Category: "${category || ''}"
Topic: "${topic || ''}"
Instructor: "${instructor || 'Course Faculty'}"
Description: "${description || ''}"
Key Lessons & Modules: "${lessonList}"

Deliver a structured, professional breakdown:
- Overview: 2-3 inspiring, punchy sentences capturing the core value proposition.
- Key Takeaways: 3 to 4 actionable, specific capabilities the student will achieve.
- Target Audience: Concise 1-sentence description of who benefits most.
- Prerequisites: Realistic baseline requirements.
- Estimated Pace: Recommended weekly time dedication.
- Career Impact: Tangible job-ready or portfolio outcome.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a master curriculum advisor for an elite digital learning platform. You output strictly structured JSON adhering to the provided schema with zero markdown wrapping.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overview: {
                type: Type.STRING,
                description: "A concise 2-3 sentence overview of the course's purpose and primary learning transformation."
              },
              keyTakeaways: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 to 4 core actionable takeaways or skills mastered."
              },
              targetAudience: {
                type: Type.STRING,
                description: "Target demographic or skill level for this course."
              },
              prerequisites: {
                type: Type.STRING,
                description: "Prior knowledge or tooling recommended."
              },
              estimatedPace: {
                type: Type.STRING,
                description: "Estimated study hours per week."
              },
              careerImpact: {
                type: Type.STRING,
                description: "Career or practical portfolio impact upon completion."
              }
            },
            required: ["overview", "keyTakeaways", "targetAudience", "prerequisites", "estimatedPace", "careerImpact"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response text received from Gemini API");
      }

      const summaryData = JSON.parse(responseText);
      return res.json({
        source: "gemini",
        summary: summaryData
      });
    } catch (err: any) {
      console.error("Gemini course summary error:", err);
      return res.status(200).json({
        source: "curated",
        error: err?.message,
        summary: {
          overview: `An intensive deep-dive into ${req.body?.title || 'this domain'}, emphasizing foundational mechanics, practical assignments, and production patterns.`,
          keyTakeaways: [
            "Establish solid foundational competencies through structured lesson modules.",
            "Complete guided exercises simulating real-world production environments.",
            "Develop muscle memory for debugging, refactoring, and architectural scaling.",
            "Earn a verified credential demonstrating complete mastery of the curriculum."
          ],
          targetAudience: "Self-driven learners and professionals looking to level up their core skill set.",
          prerequisites: "Basic familiarity with computing or digital product workflows.",
          estimatedPace: "4 to 6 hours per week over 3-4 weeks.",
          careerImpact: "Adds verifiable project competency to your portfolio and resume."
        }
      });
    }
  });

  // POST /api/course/flashcards
  // Extracts key terms, definitions, examples, and study hints from the course content
  app.post("/api/course/flashcards", async (req, res) => {
    try {
      const { title, description, category, topic, lessons, count = 8 } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          source: "offline",
          deckTitle: `${title} Study Flashcards`,
          cards: []
        });
      }

      const lessonList = Array.isArray(lessons) ? lessons.slice(0, 12).join("; ") : "";
      const prompt = `Extract ${count} essential, high-yield key technical terms, design principles, or architectural concepts from this course:
Course: "${title}"
Category: "${category || ''}"
Topic: "${topic || ''}"
Description: "${description || ''}"
Curriculum Topics: "${lessonList}"

For every key term, provide:
1. term: Precise name of the term, paradigm, pattern, or formula.
2. definition: Clear, accurate 1-2 sentence definition focused on conceptual mastery.
3. category: The specific submodule or discipline area (e.g. Architecture, Layout, Flow, State).
4. example: A concrete real-world code snippet or practical application scenario.
5. hint: A clever memory mnemonic or context clue to prompt recall.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert cognitive scientist creating high-yield active recall flashcard decks for modern students. Return structured JSON with no markdown formatting.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              deckTitle: { type: Type.STRING },
              cards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    term: { type: Type.STRING },
                    definition: { type: Type.STRING },
                    category: { type: Type.STRING },
                    example: { type: Type.STRING },
                    hint: { type: Type.STRING }
                  },
                  required: ["id", "term", "definition", "category", "example", "hint"]
                }
              }
            },
            required: ["deckTitle", "cards"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response received from Gemini for flashcards");
      }

      const parsed = JSON.parse(responseText);
      return res.json({
        source: "gemini",
        deckTitle: parsed.deckTitle || `${title} Key Terms`,
        cards: parsed.cards || []
      });
    } catch (err: any) {
      console.error("Gemini flashcards extraction error:", err);
      return res.status(200).json({
        source: "offline",
        error: err?.message,
        deckTitle: `${req.body?.title || 'Course'} Flashcards`,
        cards: []
      });
    }
  });

  // Vite middleware setup
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

startServer();
