import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { PaperPlaneIcon, BookmarkIcon } from "@radix-ui/react-icons";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { fetchAIResponse } from "../utils/fetchAIResponse";
import BookmarkModal from "./partials/BookmarkModal";
import axios from "axios";
import { toast } from "react-toastify";

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

const TypingDots = () => (
  <div className="flex gap-1 items-center px-4 py-2 rounded-lg bg-zinc-200 text-black dark:bg-zinc-700 dark:text-white w-fit text-sm">
    <span className="animate-bounce delay-0">.</span>
    <span className="animate-bounce delay-100">.</span>
    <span className="animate-bounce delay-200">.</span>
  </div>
);

const AIChatBox = () => {
  const { darkMode } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hey! I'm Mentor AI. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
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

  const handleBookmarkClick = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to save conversation");
      return;
    }
  
    const userMessagesExist = messages.some((msg) => msg.role === "user");
  
    if (!userMessagesExist) {
      toast.info("Start a conversation to bookmark it!");
      return;
    }
  
    if (bookmarkId) {
      try {
        await axios.delete(
          `http://localhost:5050/api/chat-bookmarks/${bookmarkId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        toast.warn("❌Conversation removed from bookmarks");
        setBookmarkId(null);
      } catch (err) {
        toast.error("Failed to remove bookmark");
      }
    } else {
      setShowBookmarkModal(true);
    }
  };
  

  const handleSaveBookmark = async (heading) => {
    try {
      const res = await axios.post(
        "http://localhost:5050/api/chat-bookmarks",
        { heading, messages },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setBookmarkId(res.data.bookmarkId || res.data._id);
      toast.success("Conversation bookmarked!");
      setShowBookmarkModal(false);
    } catch (err) {
      toast.error("Failed to save bookmark");
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
        {messages.map((msg, i) => {
          const isFirstAI = i === 0 && msg.role === "ai";

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`w-fit max-w-[75%] text-sm rounded-lg ${
                msg.role === "user"
                  ? "ml-auto bg-indigo-500 text-white px-4 py-2"
                  : "bg-zinc-200 text-black dark:bg-zinc-700 dark:text-white p-3"
              }`}
            >
              {msg.role === "ai" && isFirstAI ? (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">{formatAIContent(msg.content)}</div>
                  <button
                    onClick={handleBookmarkClick}
                    title="Toggle Bookmark"
                    className={`p-2 rounded-full shadow transition hover:scale-[1.2] ${
                      bookmarkId
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-white"
                    }`}
                  >
                    <BookmarkIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : msg.role === "ai" ? (
                formatAIContent(msg.content)
              ) : (
                <span>{msg.content}</span>
              )}
            </motion.div>
          );
        })}
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

      {/* Bookmark Modal */}
      {showBookmarkModal && (
        <BookmarkModal
          onClose={() => setShowBookmarkModal(false)}
          onSave={handleSaveBookmark}
        />
      )}
    </div>
  );
};

export default AIChatBox;
