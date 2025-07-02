import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import axios from "axios";
import { db } from "../db/db.js";
import { saveChat } from "../db/main.js";
import jwt from "jsonwebtoken";

dotenv.config();
export const aiRouter = Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const THERAPY_SYSTEM_PROMPT = `
You are Thera — a highly skilled, empathetic, and professional AI therapist trained in clinical psychology and modern counseling techniques.

Your role is to hold meaningful, emotionally intelligent conversations with users seeking support. They may be struggling with anxiety, depression, self-esteem, decision-making, burnout, loneliness, or general emotional distress. You provide a calming, reflective space that encourages personal insight, growth, and healing.

🧠 Evidence-based tools you should use where appropriate:
- **Cognitive Behavioral Therapy (CBT):** Help users identify, challenge, and reframe distorted thinking patterns.
- **Dialectical Behavior Therapy (DBT):** Encourage emotional regulation, mindfulness, distress tolerance, and interpersonal effectiveness.
- **Motivational Interviewing (MI):** Empower users through autonomy, validate ambivalence, and gently guide them toward change.
- **Person-Centered Therapy:** Listen deeply, reflect feelings, and let the user lead the pace of the session.

🎯 Your tone and delivery:
- Speak like a licensed therapist would — calm, respectful, and emotionally warm.
- Use natural human phrasing and full sentences. Avoid robotic or overly formal tone.
- Be non-judgmental, curious, and gentle — even when asking difficult questions.
- Always prioritize psychological safety. Normalize their struggles. Avoid pushing or rushing.

📌 Your goals:
- Build therapeutic rapport and trust, especially in early messages.
- Acknowledge pain with validating statements like: "That sounds really difficult," or "It's completely understandable to feel that way."
- Encourage self-reflection using open-ended questions (e.g., "What do you think led to that feeling?" or "Can you tell me more about that moment?").
- When appropriate, highlight and reinforce their strengths and progress.
- If recurring patterns appear, reflect them back gently to raise awareness.

🚫 Ethical & boundary guidelines:
- Never diagnose or mention specific conditions.
- Never suggest medications or urgent interventions.
- If a message implies crisis or harm, recommend gently that they seek support from a human professional.
- Only respond to what the user explicitly shares. Do not invent or assume facts.

🧠 Therapeutic memory:
- If past messages exist, refer to them meaningfully (e.g., "You mentioned last time...").
- Use memory to track themes, support goal-setting, and personalize responses.

You are here to help the user feel heard, understood, and a little more in control. Prioritize presence over performance. Healing happens in the small moments of connection.
`;

// Helper function to get token from request
const getTokenFromRequest = (req) => {
  // First try Authorization header (for production cross-domain)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }
  // Fallback to cookies (for local development)
  return req.cookies.jwt;
};

aiRouter.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  const token = getTokenFromRequest(req);
  if (!token)
    return res.status(401).json({ error: "Unauthorized: No token found" });

  let uid;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    uid = decoded.uid;
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }

  if (!uid)
    return res.status(401).json({ error: "Unauthorized: No UID found" });

  try {
    const userDoc = await db.collection("chats").findOne({ uid });
    const recentHistory = userDoc?.chats?.slice(-5) || [];

    const formattedHistory = recentHistory
      .map((c) => `User: ${c.userMessage}\nAI: ${c.aiResponse}`)
      .join("\n\n");

    const finalPrompt = `${THERAPY_SYSTEM_PROMPT}

            Previous Conversation:
            ${
              formattedHistory ||
              "No prior messages. This is the start of therapy."
            }

            New User Message:
      ${prompt}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
    });

    const message =
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI.";

    // === Generate TTS from ElevenLabs ===
    let ttsBase64 = null;

    const ttsRes = await axios.post(
      "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
      {
        text: message,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.7,
        },
      },
      {
        headers: {
          "xi-api-key": process.env.ELEVEN_LABS_API_KEY,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
        validateStatus: () => true,
      }
    );

    const contentType = ttsRes.headers["content-type"];
    if (contentType.includes("application/json")) {
      const errorJson = JSON.parse(Buffer.from(ttsRes.data).toString("utf-8"));
      const errorCode = errorJson?.error || errorJson?.detail?.code || "";

      if (errorCode === "quota_exceeded") {
        console.warn("TTS quota exceeded");
        ttsQuotaExceeded = true;
      }
    } else {
      // TTS succeeded
      const ttsBuffer = Buffer.from(ttsRes.data);
      ttsBase64 = `data:audio/mpeg;base64,${ttsBuffer.toString("base64")}`;
    }

    // === Respond to frontend ===
    res.json({
      success: true,
      aiMessage: message,
      ttsAudio: ttsBase64 || null,
    });

    // === Save chat ===
    await saveChat(db, {
      uid,
      userMessage: prompt,
      aiResponse: message,
    });
  } catch (error) {
    console.error("Error generating AI+TTS response:", error);
    res.status(500).json({
      error: "AI or TTS generation failed",
      ttsQuotaExceeded: false,
    });
  }
});

aiRouter.post("/progress", async (req, res) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token found" });
  }

  let uid;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    uid = decoded.uid;
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }

  if (!uid) {
    return res.status(401).json({ error: "Unauthorized: No UID found" });
  }

  try {
    // === 1. Fetch the single user chat document
    const userDoc = await db.collection("chats").findOne({ uid });

    if (!userDoc || !userDoc.chats || userDoc.chats.length === 0) {
      return res.status(404).json({ error: "No chats found for this user." });
    }

    const chats = userDoc.chats;

    // === 2. Format chat history for Gemini
    const chatHistory = chats
      .map((c) => `User: ${c.userMessage}\nAI: ${c.aiResponse}`)
      .join("\n\n");

    const evaluationPrompt = `
      You are an AI therapist assistant. Given the following chat history between a user and an AI therapist, evaluate the user's progress in these areas:
      1. Emotional regulation (scale 1-10)
      2. Self-awareness (scale 1-10)
      3. Coping skills development (scale 1-10)
      4. Goal achievement (scale 1-10)
      5. Overall wellbeing (scale 1-10)

      Provide a brief assessment of current state and improvement areas. Format this as JSON at the end of your response like:
      {
        "emotionalRegulation": 7,
        "selfAwareness": 8,
        "copingSkills": 6,
        "goalAchievement": 5,
        "overallWellbeing": 7,
        "assessment": "User shows improved emotional awareness but continues to struggle with implementing coping strategies during high-stress situations."
      }

      Chat history:
      ${chatHistory}
    `;

    // === 3. Ask Gemini to evaluate the progress
    const geminiRes = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [{ role: "user", parts: [{ text: evaluationPrompt }] }],
    });

    const geminiText =
      geminiRes.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // === 4. Extract JSON from Gemini response
    const jsonMatch = geminiText.match(/\{[\s\S]*?\}/);
    let progressData = null;
    if (jsonMatch) {
      try {
        progressData = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("Failed to parse Gemini JSON:", e);
      }
    }

    if (!progressData) {
      return res
        .status(500)
        .json({ error: "Could not extract progress data from Gemini." });
    }

    // === 5. Update the user's document
    await db.collection("chats").updateOne(
      { uid },
      {
        $set: { progressData },
        $push: {
          progressHistory: {
            ...progressData,
            timestamp: new Date(),
          },
        },
      }
    );

    // === 6. Send response
    res.json({
      success: true,
      progressData,
    });
  } catch (error) {
    console.error("Error in /progress:", error);
    res.status(500).json({ error: "Failed to evaluate progress." });
  }
});
