import { useState, useEffect } from "react";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(stored);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, loaded]);

  const addTask = (text) => {
    const newTask = {
      id: crypto.randomUUID(),
      text,
      done: false,
      doLater: false,
      mood: null,
      createdAt: Date.now(),
      lastModified: Date.now(),
      description: "",
      checklist: [],
      finishBefore: null,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, done: !task.done, lastModified: Date.now() }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const editTask = (id, newText, mood = null, description = null) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              text: newText ?? task.text,
              mood: mood !== null ? mood : task.mood,
              description:
                description !== null ? description : task.description,
              lastModified: Date.now(),
              history: [
                ...(task.history || []),
                { text: task.text, at: Date.now() },
              ],
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
              lastModified: Date.now(),
            }
          : task
      )
    );
  };
  const onUpdateChecklist = (id, checklist) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, checklist, lastModified: Date.now() } : task
      )
    );
  };
  const onUpdateFinishBefore = (id, datetime) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              finishBefore: datetime,
              lastModified: Date.now(),
            }
          : task
      )
    );
  };

  const onAddSubItem = (id, text) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              items: [...(task.items || []), { text, done: false }],
              lastModified: Date.now(),
            }
          : task
      )
    );
  };

  const onToggleSubItem = (id, index) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const updatedItems = [...(task.items || [])];
          updatedItems[index].done = !updatedItems[index].done;
          return {
            ...task,
            items: updatedItems,
            lastModified: Date.now(),
          };
        }
        return task;
      })
    );
  };

  const onRemoveSubItem = (id, index) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const updatedItems = [...(task.items || [])];
          updatedItems.splice(index, 1);
          return {
            ...task,
            items: updatedItems,
            lastModified: Date.now(),
          };
        }
        return task;
      })
    );
  };

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    toggleDoLater,
    onUpdateChecklist,
    onUpdateFinishBefore,
    onAddSubItem,
    onToggleSubItem,
    onRemoveSubItem,
  };
}
