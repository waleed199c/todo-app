// components/TaskGrid.jsx
import { motion, AnimatePresence } from "framer-motion";
import TaskItem from "./TaskItem";

export default function TaskGrid({ tasks, onToggle, onDelete, onEdit, onToggleDoLater }) {
  const active = tasks.filter((t) => !t.done && !t.doLater);
  const done = tasks.filter((t) => t.done);
  const later = tasks.filter((t) => !t.done && t.doLater);

  const spring = {
    type: "spring",
    stiffness: 500,
    damping: 30,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Active Tasks Column */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-center">📝 Active</h2>
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {active.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={spring}
              >
                <TaskItem
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onToggleDoLater={onToggleDoLater}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Do Later Tasks Column */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-center">⌛ Do Later</h2>
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {later.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={spring}
              >
                <TaskItem
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onToggleDoLater={onToggleDoLater}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Done Tasks Column */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-center">✅ Done</h2>
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {done.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={spring}
              >
                <TaskItem
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onToggleDoLater={onToggleDoLater}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
