import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";
import ErrorBoundary from "./components/ErrorBoundary";
import { useTasks } from "./hooks/useTasks";
import { useState } from "react";
import TaskGrid from "./components/TaskGrid";

function App() {
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    toggleDoLater,
    onUpdateChecklist,
    onUpdateFinishBefore,
  } = useTasks();
  const [filter, setFilter] = useState("all");
  const [moodFilter, setMoodFilter] = useState(null);

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "active") return !task.done && !task.doLater;
      if (filter === "done") return task.done;
      if (filter === "later") return task.doLater;
      return true;
    })
    .filter((task) => {
      return !moodFilter || task.mood === moodFilter;
    });

  return (
    <ErrorBoundary>
      <main className="min-h-screen w-full bg-gradient-to-b from-black via-slate-900 to-black text-white p-4 flex justify-center items-start">
        <div className="w-full max-w-8xl mt-12 space-y-6">
          <h1 className="text-4xl font-bold tracking-wide text-center bg-gradient-to-r from-pink-500 via-purple-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
            Your Todo App
          </h1>

          <AddTaskForm onAdd={addTask} />

          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">Status:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-gray-800 text-white px-3 py-1 rounded"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="done">Done</option>
                <option value="later">Do Later</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">Mood:</span>
              <select
                value={moodFilter || ""}
                onChange={(e) => setMoodFilter(e.target.value || null)}
                className="bg-gray-800 text-white px-3 py-1 rounded"
              >
                <option value="">Any</option>
                <option value="happy">😊 Happy</option>
                <option value="stressful">😰 Stressful</option>
                <option value="creative">✨ Creative</option>
                <option value="boring">😴 Boring</option>
                <option value="urgent">🔥 Urgent</option>
              </select>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-center">
            {filter === "all"
              ? "All Tasks"
              : filter === "active"
              ? "Things To Do"
              : filter === "done"
              ? "Completed Tasks"
              : "Deferred to Do Later"}
          </h2>

          <TaskGrid
            tasks={filteredTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={editTask}
            onToggleDoLater={toggleDoLater}
            onUpdateChecklist={onUpdateChecklist}
            onUpdateFinishBefore={onUpdateFinishBefore}
          />
        </div>
      </main>
    </ErrorBoundary>
  );
}

export default App;
