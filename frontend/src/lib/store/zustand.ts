import { create } from "zustand";
import { axiosInstance } from "../axios";
import { toast } from "react-toastify";

type ProgressData = {
  emotionalRegulation: number;
  selfAwareness: number;
  copingSkills: number;
  goalAchievement: number;
  overallWellbeing: number;
  assessment: string;
};

type StoreState = {
  uid: string;
  setUid: (uid: string) => void;

  loading: boolean;
  authUser: any;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;

  aiLoading: boolean;
  aiError: string | null;
  userInput: string | null;
  aiResponse: string | null;

  progressData: ProgressData | null;

  hasShownQuotaToast: boolean;
  setHasShownQuotaToast: (v: boolean) => void;

  useBrowserTTS: boolean;
  setUseBrowserTTS: (v: boolean) => void;

  checkAuth: () => Promise<void>;
  signUp: (data: { email: string; password: string }) => Promise<void>;
  signIn: (data: { email: string; password: string }) => Promise<void>;
  sendMessageToAI: ({ message }: { message: string }) => Promise<string | null>;
  getProgressData: () => Promise<ProgressData | null>;
};

export const useStore = create<StoreState>((set, get) => ({
  uid: "",
  setUid: (uid: string) => set({ uid }),

  loading: true,
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,

  aiLoading: false,
  aiError: null,
  userInput: null,
  aiResponse: null,

  progressData: null,

  hasShownQuotaToast: false,
  setHasShownQuotaToast: (v) => set({ hasShownQuotaToast: v }),

  useBrowserTTS: true,
  setUseBrowserTTS: (v) => set({ useBrowserTTS: v }),

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      // First check if we have token and uid in localStorage
      const token = localStorage.getItem("jwt_token");
      const storedUid = localStorage.getItem("user_uid");

      if (!token || !storedUid) {
        set({ authUser: null, uid: "", isCheckingAuth: false });
        return;
      }

      // Set uid from localStorage
      set({ uid: storedUid });

      // Verify token with backend
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data || null });
    } catch (error) {
      console.error("Error checking auth:", error);
      // Clear invalid tokens
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user_uid");
      set({ authUser: null, uid: "" });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async ({ email, password }) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", { email, password });

      // Store token and uid in localStorage
      if (res.data.token && res.data.customID) {
        localStorage.setItem("jwt_token", res.data.token);
        localStorage.setItem("user_uid", res.data.customID);
      }

      set({ authUser: res.data.user, uid: res.data.customID });
      toast.success("Account created successfully!", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("Error signing up. Try again.");
    } finally {
      set({ isSigningUp: false });
    }
  },

  signIn: async ({ email, password }) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/signin", { email, password });

      // Store token and uid in localStorage
      if (res.data.token && res.data.customID) {
        localStorage.setItem("jwt_token", res.data.token);
        localStorage.setItem("user_uid", res.data.customID);
      }

      set({ authUser: res.data.user, uid: res.data.customID });
      toast.success("Logged in successfully!");
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Login failed. Check credentials.");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  sendMessageToAI: async ({ message }) => {
    set({ aiLoading: true, aiError: null, userInput: message });

    try {
      const res = await axiosInstance.post("/ai/generate", { prompt: message });
      const { aiMessage, ttsAudio } = res.data || {};
      const { useBrowserTTS } = get();

      if (aiMessage) {
        set({ aiResponse: aiMessage });

        if (!ttsAudio && !useBrowserTTS) {
          toast.info(
            "No voice response. You can enable browser voice from the sidebar."
          );
        }

        // ✅ ElevenLabs succeeded
        if (ttsAudio) {
          try {
            const audio = new Audio(ttsAudio);
            await audio.play();
          } catch (err) {
            console.error("Audio playback failed:", err);
          }

          // ✅ ElevenLabs failed → use browser fallback if toggle is on
        } else if (useBrowserTTS) {
          const synth = window.speechSynthesis;
          if (synth) {
            const speak = () => {
              const utterance = new SpeechSynthesisUtterance(aiMessage);
              utterance.lang = "en-US";
              utterance.pitch = 1.1;
              utterance.rate = 0.95;
              utterance.volume = 1;

              const voices = synth.getVoices();
              const preferredVoice =
                voices.find((v) =>
                  /(Google\sUS\sEnglish|Jenny|Samantha|Karen|Zira|female)/i.test(
                    v.name
                  )
                ) ||
                voices.find((v) => /en-US/i.test(v.lang)) ||
                voices[0];

              if (preferredVoice) utterance.voice = preferredVoice;

              synth.cancel();
              synth.speak(utterance);
            };

            if (synth.getVoices().length > 0) {
              speak();
            } else {
              synth.addEventListener("voiceschanged", speak, { once: true });
            }
          }
        }

        return aiMessage;
      } else {
        set({ aiError: res.data.error || "Unknown error" });
        toast.error("AI failed to respond.");
        return null;
      }
    } catch (error: any) {
      set({ aiError: error.message });
      toast.error("AI error: " + error.message);
      return null;
    } finally {
      set({ aiLoading: false });
    }
  },

  getProgressData: async () => {
    try {
      const res = await axiosInstance.post("/ai/progress");
      if (res.data?.progressData) {
        set({ progressData: res.data.progressData });
        toast.success("Progress data loaded!");
        return res.data.progressData;
      } else {
        toast.error("No progress data found.");
        return null;
      }
    } catch (error) {
      console.error("Progress fetch failed:", error);
      toast.error("Unable to fetch progress.");
      return null;
    }
  },
}));
