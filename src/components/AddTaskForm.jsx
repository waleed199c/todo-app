import { useState } from "react";
import { motion } from "framer-motion";

export default function AddTaskForm({ onAdd }) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, mood || null);
    setText("");
    setMood("");
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="flex flex-wrap md:flex-nowrap items-center gap-2 bg-gray-900/70 p-4 rounded-lg shadow-md backdrop-blur-sm"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="New task..."
        className="flex-grow px-4 h-10 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
      />
      <select
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        className="h-10 px-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">🎭 Mood</option>
        <option value="happy">😊 Happy</option>
        <option value="stressful">😰 Stressful</option>
        <option value="creative">✨ Creative</option>
        <option value="boring">😴 Boring</option>
        <option value="urgent">🔥 Urgent</option>
      </select>
      <button
        type="submit"
        className="h-10 px-4 rounded bg-blue-600 text-white font-medium hover:bg-blue-500 transition active:scale-95"
      >
        Add
      </button>
    </motion.form>
  );
}
