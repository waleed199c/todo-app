import TaskItem from './TaskItem';
import { motion, AnimatePresence } from "framer-motion";

export default function TaskList({ tasks, onToggle, onDelete, onEdit, onToggleDoLater }) {
  return (
    <div>
     <AnimatePresence>
  {tasks.map(task => (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
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
  );
}
