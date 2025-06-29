import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const BookmarkModal = ({ onClose, onSave }) => {
  const [heading, setHeading] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSave = () => {
    if (!heading.trim()) return;
    onSave(heading.trim());
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-zinc-900 p-6 rounded-xl w-[90%] max-w-md shadow-lg"
      >
        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          Save Conversation
        </h2>
        <input
          ref={inputRef}
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter conversation name"
          className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-black dark:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition"
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BookmarkModal;
