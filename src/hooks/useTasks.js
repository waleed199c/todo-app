import { useState, useEffect } from "react";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(stored);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      console.log("Saving to localStorage:", tasks);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, loaded]);

  const addTask = (text, mood = null, description = "") => {
    const now = new Date();
    const newTask = {
      id: crypto.randomUUID(),
      text,
      done: false,
      doLater: false,
      mood,
      description,
      checklist: [],
      createdAt: now.toISOString(),
      lastModified: now.toISOString(),
      history: [],
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              done: !task.done,
              lastModified: new Date().toISOString(),
            }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const editTask = (id, newText, newMood = null, newDescription = null) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              text: newText,
              lastModified: new Date().toISOString(),
              history: [
                ...(task.history || []),
                { text: task.text, at: new Date().toISOString() },
              ],
              mood: newMood !== null ? newMood : task.mood,
              description: newDescription !== null ? newDescription : task.description,
            }
          : task
      )
    );
  };

  const toggleDoLater = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              doLater: !task.doLater,
              lastModified: new Date().toISOString(),
            }
          : task
      )
    );
  };

  return { tasks, addTask, toggleTask, deleteTask, editTask, toggleDoLater };
}
