"use client";

import { Keyboard, Mic, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store/zustand";
import { toast } from "react-toastify";

const ChatInput = () => {
  const [showTextarea, setShowTextarea] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const sendMessageToAI = useStore((state: any) => state.sendMessageToAI);

  const handleSubmit = async () => {
    const trimmed = userInput.trim();
    if (!trimmed) {
      toast.warning("Please type a message before sending.", {
        autoClose: 1500,
        pauseOnHover: false,
      });
      return;
    }

    try {
      await sendMessageToAI({ message: trimmed });
      setUserInput("");
    } catch (err) {
      toast.error("Failed to send message.");
      console.error(err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Voice recognition is not supported in this browser.");
      return;
    }

    try {
      const ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.value = 0.1;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 150);
    } catch (e) {}

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };
    recognition.onerror = (event: { error: string }) => {
      console.error("Voice input error:", event);
      if (event.error === "no-speech") {
        toast.warning(
          "Didn't catch anything. Try speaking louder or closer to the mic.",
          {
            autoClose: 2000,
            pauseOnHover: false,
          }
        );
      } else {
        toast.error(`Voice input error: ${event.error}`, {
          autoClose: 2000,
          pauseOnHover: false,
        });
      }
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setShowTextarea(true);
      setUserInput((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.start();
  };

  return (
    <motion.div
      className="w-full 
                 px-3 py-4 
                 sm:px-4 sm:py-5 
                 md:px-6 md:py-6 
                 lg:px-8 lg:py-6
                 bg-background 
                 border-t border-border
                 sticky bottom-0 z-30
                 backdrop-blur-sm bg-background/95"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="max-w-4xl mx-auto flex flex-col 
                     gap-3 sm:gap-4 md:gap-4"
      >
        {/* Button Controls */}
        <div
          className="flex flex-col items-center 
                       gap-2 sm:gap-3"
        >
          <div
            className="flex justify-center 
                         gap-3 sm:gap-4 md:gap-6"
          >
            {/* Voice Input Button */}
            <Button
              size="icon"
              variant="ghost"
              className={`rounded-full border shadow-md bg-muted 
                         transition-all duration-300
                         h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16
                         ${
                           isListening
                             ? "bg-green-600 animate-pulse border-green-300 ring-2 ring-green-400/40 scale-110"
                             : "hover:scale-105 active:scale-95"
                         }`}
              onClick={isListening ? undefined : startVoiceInput}
              disabled={isListening}
            >
              <Mic className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
            </Button>

            {/* Keyboard Toggle Button */}
            <Button
              size="icon"
              variant="ghost"
              className={`rounded-full border shadow-md bg-muted 
                         transition-all duration-300
                         h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16
                         hover:scale-105 active:scale-95
                         ${
                           showTextarea
                             ? "bg-accent text-background ring-2 ring-accent/30"
                             : "hover:bg-muted/70"
                         }`}
              onClick={() => setShowTextarea((prev) => !prev)}
            >
              <Keyboard className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
            </Button>
          </div>

          {/* Voice Status Indicator */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="flex items-center gap-2"
              >
                <div className="flex gap-1">
                  <div
                    className="w-1 h-1 bg-green-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-1 h-1 bg-green-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-1 h-1 bg-green-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
                <span className="text-xs sm:text-sm text-green-400 font-medium">
                  Listening...
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text Input Area */}
        <AnimatePresence>
          {showTextarea && (
            <motion.div
              key="textarea"
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex flex-col 
                        gap-2 sm:gap-3 md:gap-4"
            >
                      <Textarea
                      placeholder="Share how you feel today..."
                      className="w-full 
                            text-sm sm:text-base 
                            border-muted shadow-sm bg-muted/20 
                            text-muted-foreground 
                            focus:ring-2 focus:ring-accent 
                            resize-none rounded-xl 
                            transition-all duration-300
                            min-h-[40px] sm:min-h-[40px] md:min-h-[40px]
                            px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-4"
                      rows={1}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      />

                      {/* Send Button */}
              <div className="flex justify-between items-center">
                {/* Character count (mobile friendly) */}
                <span
                  className="text-xs text-muted-foreground/60 
                               hidden sm:block"
                >
                  {userInput.length} characters
                </span>

                {/* Send Button */}
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.03 }}
                  className="ml-auto"
                >
                  <Button
                    onClick={handleSubmit}
                    disabled={!userInput.trim()}
                    className="flex items-center 
                              gap-2 sm:gap-3
                              px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3
                              text-sm sm:text-base
                              bg-accent text-background 
                              hover:bg-accent/90 
                              disabled:opacity-50 disabled:cursor-not-allowed
                              shadow-md rounded-full 
                              transition-all duration-200
                              min-w-[80px] sm:min-w-[100px]"
                  >
                    <SendHorizonal className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    <span className="hidden xs:inline">Send</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ChatInput;
