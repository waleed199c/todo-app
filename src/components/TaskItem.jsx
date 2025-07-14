// src/components/TaskItem.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskItem({ task, onToggle, onDelete, onEdit, onToggleDoLater, onUpdateChecklist }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [editDescription, setEditDescription] = useState(task.description || "");

  const toggleExpand = (e) => {
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SELECT' && e.target.tagName !== 'INPUT' && !isEditing) {
      setIsExpanded(prev => !prev);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const trimmed = editText.trim();
    if (trimmed && trimmed !== task.text) {
      onEdit(task.id, trimmed, task.mood, editDescription);
    } else {
      onEdit(task.id, task.text, task.mood, editDescription);
    }
    setIsEditing(false);
  };

  const formatDate = (iso) => new Date(iso).toLocaleString();

  const handleChecklistToggle = (index) => {
    const updated = [...(task.checklist || [])];
    updated[index].checked = !updated[index].checked;
    onUpdateChecklist(task.id, updated);
  };

  const handleChecklistAdd = () => {
    if (!newChecklistItem.trim()) return;
    const updated = [...(task.checklist || []), { text: newChecklistItem, checked: false }];
    setNewChecklistItem("");
    onUpdateChecklist(task.id, updated);
  };

  const handleChecklistRemove = (index) => {
    const updated = [...(task.checklist || [])];
    updated.splice(index, 1);
    onUpdateChecklist(task.id, updated);
  };

  const getPreviewContent = () => {
    const previewLimit = 2;
    const checklist = task.checklist || [];
    if (checklist.length > 0) {
      return (
        <ul className="ml-6 text-sm text-gray-400 list-disc">
          {checklist.slice(0, previewLimit).map((item, idx) => (
            <li key={idx} className={item.checked ? "line-through opacity-70" : ""}>{item.text}</li>
          ))}
          {checklist.length > previewLimit && <li className="italic text-gray-500">...Show more</li>}
        </ul>
      );
    } else if (task.description) {
      const preview = task.description.split("\n").slice(0, previewLimit);
      return (
        <p className="ml-6 text-sm text-gray-400">
          {preview.join("\n")}
          {task.description.split("\n").length > previewLimit && <span className="italic text-gray-500"> ...Show more</span>}
        </p>
      );
    }
    return null;
  };

  return (
    <div
      className={`bg-gray-900 rounded-lg p-6 min-h-[160px] border-l-4 transition-all cursor-pointer relative overflow-hidden 
        ${
          task.done ? "border-yellow-500 opacity-60" :
          task.doLater ? "border-blue-500" :
          "border-green-500"
        }`}
      onClick={toggleExpand}
    >
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={task.done}
            onClick={(e) => e.stopPropagation()}
            onChange={() => onToggle(task.id)}
            className="accent-purple-500"
          />
          <span className={`text-white ${task.done ? "line-through opacity-60" : ""}`}>
            {task.text}
          </span>
        </div>
        <select
          value={task.mood || ""}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onEdit(task.id, task.text, e.target.value, task.description)}
          className="text-sm rounded bg-gray-800 text-white px-2 py-1"
        >
          <option value="">No Mood</option>
          <option value="happy">😊 Happy</option>
          <option value="stressful">😰 Stressful</option>
          <option value="creative">✨ Creative</option>
          <option value="boring">😴 Boring</option>
          <option value="urgent">🔥 Urgent</option>
        </select>
      </div>

      {!isExpanded && getPreviewContent()}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="mt-4 pl-6 text-sm text-gray-300 space-y-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className="space-y-2">
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description..."
                  rows={3}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />
                <button type="submit" className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700">
                  Save
                </button>
              </form>
            ) : (
              <>
                {task.description && <p className="whitespace-pre-wrap">📝 {task.description}</p>}
              </>
            )}

            {Array.isArray(task.checklist) && task.checklist.length > 0 && (
              <div>
                <p>📋 Checklist:</p>
                <ul className="ml-4 space-y-1">
                  {task.checklist.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleChecklistToggle(idx)}
                      />
                      <span className={item.checked ? "line-through opacity-70" : ""}>{item.text}</span>
                      <button onClick={() => handleChecklistRemove(idx)} className="text-red-400 text-xs hover:underline">Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                className="bg-gray-800 text-white px-2 py-1 rounded"
                placeholder="New item..."
              />
              <button onClick={handleChecklistAdd} className="text-blue-400 hover:underline text-sm">+ Add</button>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-yellow-300 hover:underline"
              >
                ✎ Edit
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="text-red-400 hover:underline"
              >
                ✕ Delete
              </button>
              <button
                onClick={() => onToggleDoLater(task.id)}
                className={`text-sm px-2 py-1 rounded ${
                  task.doLater ? "bg-yellow-800 text-yellow-300" : "bg-gray-700 text-gray-300"
                }`}
              >
                {task.doLater ? "Later ✔" : "Do Later"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 border-t border-gray-800 pt-2 text-xs text-gray-500">
        {task.doLater && (
          <div className="text-center text-yellow-400 font-semibold text-sm mb-2">
            ⏳ Finish before: {formatDate(task.finishBefore || task.lastModified)}
          </div>
        )}
        <div className="flex justify-between">
          <p>📅 Created: {formatDate(task.createdAt)}</p>
          <p>🛠️ Modified: {formatDate(task.lastModified)}</p>
        </div>
      </div>
    </div>
  );
}
