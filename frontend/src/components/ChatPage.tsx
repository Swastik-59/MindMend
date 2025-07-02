"use client";

import ChatInput from "./chat/ChatInput";
import ChatMessages from "./chat/ChatMessages";

function ChatPage() {
  return (
    <div className="flex flex-col min-h-screen h-screen bg-background overflow-hidden relative">
      {/* Messages Container */}
      <div className="flex-1 flex flex-col overflow-hidden relative pt-2 sm:pt-4 md:pt-6">
        {/* Messages with proper scrolling */}
        <div
          className="flex-1 
                       overflow-y-auto 
                       overflow-x-hidden
                       scrollbar-thin 
                       scrollbar-thumb-muted 
                       scrollbar-track-background
                       pb-4 sm:pb-6 md:pb-8"
        >
          <ChatMessages />
        </div>

        {/* Gradient fade at bottom for better visual separation */}
        <div
          className="absolute 
                       bottom-0 left-0 right-0 
                       h-4 sm:h-6 md:h-8
                       bg-gradient-to-t 
                       from-background/80 
                       to-transparent 
                       pointer-events-none"
        />
      </div>

      {/* Input Container - Fixed at bottom */}
      <div
        className="flex-shrink-0 
                     relative 
                     z-10
                     border-t border-border/50
                     shadow-lg shadow-black/5
                     backdrop-blur-sm"
      >
        <ChatInput />
      </div>
    </div>
  );
}

export default ChatPage;
