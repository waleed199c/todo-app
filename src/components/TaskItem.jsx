import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrashAlt,
  FaEdit,
  FaClock,
  FaCalendarAlt,
  FaPenNib,
  FaRegStickyNote,
  FaListUl,
} from "react-icons/fa";
import { MdAccessTime, MdCheckCircle } from "react-icons/md";

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
  onToggleDoLater,
  onUpdateChecklist,
  onUpdateFinishBefore,
}) {
  // State for managing component behavior
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [editDescription, setEditDescription] = useState(
    task.description || ""
  );
  const [finishBeforeInput, setFinishBeforeInput] = useState(
    task.finishBefore ? task.finishBefore.slice(0, 16) : ""
  );

  // Toggle expansion when clicking on the task (but not on interactive elements)
  const toggleExpand = (e) => {
    if (
      e.target.tagName !== "BUTTON" &&
      e.target.tagName !== "SELECT" &&
      e.target.tagName !== "INPUT" &&
      !isEditing
    ) {
      setIsExpanded((prev) => !prev);
    }
  };

  // Handle saving edited task
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const trimmed = editText.trim();
    onEdit(task.id, trimmed || task.text, task.mood, editDescription);
    setIsEditing(false);
  };

  // Utility functions
  const formatDate = (iso) => new Date(iso).toLocaleString();
  const isDueSoon =
    task.finishBefore && new Date(task.finishBefore) - new Date() < 3600000;

  // Handle checklist item toggling
  const handleChecklistToggle = (index) => {
    const updated = [...(task.checklist || [])];
    updated[index].checked = !updated[index].checked;
    onUpdateChecklist(task.id, updated);
  };

  // Add new checklist item
  const handleChecklistAdd = () => {
    if (!newChecklistItem.trim()) return;
    const updated = [
      ...(task.checklist || []),
      { text: newChecklistItem, checked: false },
    ];
    setNewChecklistItem("");
    onUpdateChecklist(task.id, updated);
  };

  // Remove checklist item
  const handleChecklistRemove = (index) => {
    const updated = [...(task.checklist || [])];
    updated.splice(index, 1);
    onUpdateChecklist(task.id, updated);
  };

  // Generate preview content for collapsed state
  const getPreviewContent = () => {
    const previewLimit = 2;
    const checklist = task.checklist || [];

    if (checklist.length > 0) {
      return (
        <ul className="ml-6 text-sm text-gray-400 list-disc">
          {checklist.slice(0, previewLimit).map((item, idx) => (
            <li
              key={idx}
              className={item.checked ? "line-through opacity-70" : ""}
            >
              {item.text}
            </li>
          ))}
          {checklist.length > previewLimit && (
            <li className="italic text-gray-500">...Show more</li>
          )}
        </ul>
      );
    } else if (task.description) {
      const preview = task.description.split("\n").slice(0, previewLimit);
      return (
        <p className="ml-6 text-sm text-gray-400">
          {preview.join("\n")}
          {task.description.split("\n").length > previewLimit && (
            <span className="italic text-gray-500"> ...Show more</span>
          )}
        </p>
      );
    }
    return null;
  };

  return (
    <div
      className={`bg-gray-900 rounded-lg p-6 min-h-[160px] border-l-4 transition-all cursor-pointer relative overflow-hidden 
        ${
          task.done
            ? "border-yellow-500 opacity-60"
            : task.doLater
            ? "border-blue-500"
            : "border-green-500"
        }`}
      onClick={toggleExpand}
    >
      {/* Main task header with checkbox, text, and mood selector */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={task.done}
            onClick={(e) => e.stopPropagation()}
            onChange={() => onToggle(task.id)}
            className="accent-purple-500"
          />
          <span
            className={`text-white ${
              task.done ? "line-through opacity-60" : ""
            }`}
          >
            {task.text}
          </span>
        </div>

        <select
          value={task.mood || ""}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            onEdit(task.id, task.text, e.target.value, task.description)
          }
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

      {/* Mini finish-before preview when collapsed */}
      {!isExpanded && task.doLater && task.finishBefore && (
        <p className="text-yellow-400 text-sm mt-1 flex items-center gap-1">
          <FaClock /> Finish by: {formatDate(task.finishBefore)}
        </p>
      )}

      {/* Preview content when collapsed */}
      {!isExpanded && getPreviewContent()}

      {/* Expanded content area */}
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
            {/* Edit form or description display */}
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
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 hover:shadow-lg cursor-pointer"
                >
                  Save
                </button>
              </form>
            ) : (
              task.description && (
                <p className="whitespace-pre-wrap flex gap-1 items-center">
                  <FaRegStickyNote /> {task.description}
                </p>
              )
            )}

            {/* Checklist display */}
            {Array.isArray(task.checklist) && task.checklist.length > 0 && (
              <div>
                <p className="flex gap-1 items-center">
                  <FaListUl /> Checklist:
                </p>
                <ul className="mt-2 ml-2 space-y-1">
                  {task.checklist.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => handleChecklistToggle(idx)}
                        />
                        <span
                          className={
                            item.checked ? "line-through opacity-70" : ""
                          }
                        >
                          {item.text}
                        </span>
                      </div>
                      <button
                        onClick={() => handleChecklistRemove(idx)}
                        className="text-red-400 hover:text-red-200"
                        title="Remove"
                      >
                        <FaTrashAlt size={12} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add new checklist item */}
            <div className="flex items-center gap-2">
              <input
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                className="bg-gray-800 text-white px-2 py-1 rounded"
                placeholder="New item..."
              />
              <button
                onClick={handleChecklistAdd}
                className="text-blue-400 hover:text-blue-200 hover:scale-105 transition text-sm cursor-pointer"
              >
                + Add
              </button>
            </div>

            {/* Finish before date input for "Do Later" tasks */}
            {task.doLater && (
              <div className="flex flex-col gap-1">
                <label className="text-xs opacity-70 flex items-center gap-1">
                  <MdAccessTime /> Finish Before:
                </label>
                <input
                  type="datetime-local"
                  value={finishBeforeInput}
                  onChange={(e) => {
                    setFinishBeforeInput(e.target.value);
                    onUpdateFinishBefore(
                      task.id,
                      new Date(e.target.value).toISOString()
                    );
                  }}
                  className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
                />
                {isDueSoon && (
                  <span className="text-xs text-red-400">
                    ⚠️ This task is due soon!
                  </span>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-yellow-300 hover:text-yellow-200 hover:underline cursor-pointer"
              >
                <FaEdit size={14} /> Edit
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="flex items-center gap-1 text-red-400 hover:text-red-200 hover:underline cursor-pointer"
              >
                <FaTrashAlt size={14} /> Delete
              </button>
              <button
                onClick={() => onToggleDoLater(task.id)}
                className={`flex items-center gap-1 text-sm px-2 py-1 rounded transition hover:shadow-lg cursor-pointer ${
                  task.doLater
                    ? "bg-yellow-800 text-yellow-300 hover:bg-yellow-700"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <MdAccessTime size={16} />{" "}
                {task.doLater ? "Do Later" : "Do Later"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer with timestamps */}
      <div className="mt-4 border-t border-gray-800 pt-2 text-xs text-gray-500">
        {task.done && (
          <p className="text-center text-green-300 font-semibold text-sm mb-2 flex items-center justify-center gap-1">
            <MdCheckCircle /> Finished at: {formatDate(task.lastModified)}
          </p>
        )}
        <div className="flex justify-between">
          <p className="flex items-center gap-1">
            <FaCalendarAlt /> Created: {formatDate(task.createdAt)}
          </p>
          <p className="flex items-center gap-1">
            <FaPenNib /> Modified: {formatDate(task.lastModified)}
          </p>
        </div>
      </div>
    </div>
  );
}
