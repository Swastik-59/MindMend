# MindMend

MindMend is an AI-powered mental wellness application that enables users to engage in meaningful therapeutic conversations, track emotional progress, and build stronger coping strategies—all from the comfort of their devices. It offers a minimal, intuitive interface for personalized mental health support, driven by state-of-the-art AI models.

---

## Tech Stack

- **Frontend:** Next.js 14, TailwindCSS, shadcn/ui, MagicUI, Zustand, DaisyUI, Framer Motion
- **Backend:** Node.js, Express.js, Firebase Admin SDK, MongoDB Atlas, Google Gemini API, ElevenLabs TTS
- **Authentication:** Firebase Auth (Custom JWT with Cookies)
- **AI Services:** Gemini 2.0 Flash for therapy, ElevenLabs for voice synthesis
- **State Management:** Zustand
- **Deployment:**
  - Frontend: [Vercel](https://vercel.com)
  - Backend: [Render](https://render.com)
  - Database: MongoDB Atlas

---

## Why MindMend

India, like many parts of the world, faces significant mental health challenges, often exacerbated by stigma and lack of access. MindMend helps address this by:

- Offering **anonymous**, AI-powered emotional support
- Encouraging **self-awareness** through reflective conversations
- Providing **progress tracking** using AI-based scoring
- Supporting **voice interaction** for a more natural feel

MindMend doesn't replace professional therapy, but it makes the first step easier and more approachable.

---

## Social Impact

In India, especially among students and young professionals, mental health is often overlooked due to stigma and limited accessibility. MindMend:

- Provides **free, anonymous support**
- Uses conversational AI to foster **early mental health habits**
- Offers **insightful feedback** through well-being evaluations
- Helps people **reflect and grow**, without judgment

---

## Performance & Limitations

- The app may be **slow to respond initially** due to Render’s cold start behavior for free-tier deployments.
- ElevenLabs API has a **limited token quota**, and when exhausted, the app automatically switches to browser-based speech synthesis.
- In case of token exhaustion, audio playback might fall back to a lower-quality voice, depending on the browser.

---
