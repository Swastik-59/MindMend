"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store/zustand";
import AILoader from "@/components/AILoader";

const ChatMessages = () => {
  const userInput = useStore((state: any) => state.userInput);
  const aiResponse = useStore((state: any) => state.aiResponse);
  const aiLoading = useStore((state: any) => state.aiLoading);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: "smooth" });
    }
  }, [userInput, aiResponse, aiLoading]);

  const messages = [
    ...(userInput ? [{ sender: "user", text: userInput }] : []),
    ...(aiResponse ? [{ sender: "ai", text: aiResponse }] : []),
  ];

  const noMessages = messages.length === 0 && !aiLoading;

  return (
    <div
      ref={scrollRef}
      className="flex flex-col gap-3 sm:gap-4 md:gap-6 w-full 
                 px-3 py-4 
                 sm:px-4 sm:py-6 
                 md:px-6 md:py-8 
                 lg:px-8 lg:py-10 
                 xl:px-10 xl:py-12
                 transition-all duration-300 
                 max-h-[calc(100vh-200px)] 
                 overflow-y-auto 
                 scrollbar-thin scrollbar-thumb-muted scrollbar-track-background"
    >
      {noMessages && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full flex justify-center items-center min-h-[200px] sm:min-h-[250px] md:min-h-[300px]"
        >
          <div className="text-center max-w-md mx-auto px-4">
            <p
              className="text-muted-foreground 
                         text-sm sm:text-base md:text-lg lg:text-xl 
                         font-medium leading-relaxed"
            >
              Start by telling me how you're feeling today 😊
            </p>
            <p
              className="text-muted-foreground/70 
                         text-xs sm:text-sm md:text-base 
                         mt-2 sm:mt-3"
            >
              I'm here to listen and help
            </p>
          </div>
        </motion.div>
      )}

      {messages.map((msg, idx) => {
        const isUser = msg.sender === "user";
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className={`w-full flex ${
              isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-2xl 
                         px-3 py-2 
                         sm:px-4 sm:py-3 
                         md:px-5 md:py-3 
                         shadow-md hover:shadow-lg transition-shadow duration-200
                         max-w-[95%] 
                         xs:max-w-[90%] 
                         sm:max-w-[85%] 
                         md:max-w-[75%] 
                         lg:max-w-[70%] 
                         xl:max-w-[65%]
                         text-xs 
                         sm:text-sm 
                         md:text-base 
                         lg:text-base
                         tracking-wide leading-relaxed whitespace-pre-line
                         break-words ${
                           isUser
                             ? "bg-accent text-background rounded-br-sm ml-auto"
                             : "bg-muted text-primary rounded-bl-sm mr-auto"
                         }`}
            >
              {msg.text}
            </div>
          </motion.div>
        );
      })}

      {aiLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-start w-full"
        >
          <div
            className="bg-muted rounded-2xl 
                         px-3 py-2 
                         sm:px-4 sm:py-3 
                         md:px-4 md:py-3 
                         shadow-sm hover:shadow-md transition-shadow duration-200
                         text-primary 
                         text-xs 
                         sm:text-sm 
                         md:text-base
                         max-w-[95%] 
                         xs:max-w-[90%] 
                         sm:max-w-[85%] 
                         md:max-w-[75%] 
                         lg:max-w-[70%] 
                         xl:max-w-[65%]"
          >
            <AILoader />
          </div>
        </motion.div>
      )}

      {/* Spacer for bottom padding on mobile */}
      <div className="h-4 sm:h-6 md:h-8 flex-shrink-0" />
    </div>
  );
};

export default ChatMessages;
