import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useTheme } from "../context/ThemeContext";
import { fetchAIResponse } from "../utils/fetchAIResponse";

// Format AI message: bullets + paragraphs
const formatAIContent = (content) => {
  return content.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed === "") return null;

    const isBullet = /^[-•*]\s+/.test(trimmed);
    const isNumbered = /^\d+\.\s+/.test(trimmed);

    if (isBullet || isNumbered) {
      return (
        <div key={i} className="flex items-start gap-2">
          <span className="text-lg leading-tight">•</span>
          <span className="text-sm">
            {trimmed.replace(/^[-•*]|\d+\./, "").trim()}
          </span>
        </div>
      );
    }

    return (
      <p key={i} className="text-sm">
        {trimmed}
      </p>
    );
  });
};

// Typing dots animation
const TypingDots = () => (
  <div className="flex gap-1 items-center px-4 py-2 rounded-lg bg-zinc-200 text-black dark:bg-zinc-700 dark:text-white w-fit text-sm">
    <span className="animate-bounce delay-0">.</span>
    <span className="animate-bounce delay-100">.</span>
    <span className="animate-bounce delay-200">.</span>
  </div>
);

const AIChatBox = () => {
  const { darkMode } = useTheme();
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hey! I'm Mentor AI. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    const fullMessages = [
      { role: "system", content: "You are a helpful career mentor." },
      ...updatedMessages.map((msg) =>
        msg.role === "ai"
          ? { role: "assistant", content: msg.content }
          : msg
      ),
    ];

    const aiReply = await fetchAIResponse(fullMessages);

    setMessages((prev) => [...prev, { role: "ai", content: aiReply }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`h-[80%] md:h-[85vh] flex flex-col justify-between rounded-xl transition-all border ${
        darkMode
          ? "bg-zinc-800 border-zinc-700 text-white"
          : "bg-gray-100 border-gray-300 text-zinc-900"
      }`}
    >
      {/* Chat Messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-4 py-2 w-fit max-w-[75%] rounded-lg text-sm ${
              msg.role === "user"
                ? "ml-auto bg-indigo-500 text-white"
                : "bg-zinc-200 text-black dark:bg-zinc-700 dark:text-white"
            }`}
          >
            {msg.role === "ai"
              ? formatAIContent(msg.content)
              : <span>{msg.content}</span>}
          </motion.div>
        ))}
        {isLoading && <TypingDots />}
        <div ref={scrollRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-zinc-600 flex items-center gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something..."
          rows={1}
          className={`flex-1 px-4 py-2 rounded-md text-sm outline-none resize-none overflow-hidden max-h-32 transition-all duration-150 ${
            darkMode
              ? "bg-zinc-900 text-white border border-zinc-700"
              : "bg-white text-black border border-gray-300"
          }`}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md transition"
          disabled={isLoading}
        >
          <PaperPlaneIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AIChatBox;
