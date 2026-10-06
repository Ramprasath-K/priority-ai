import { useEffect, useState } from "react";

import "./App.css";

import Sidebar from "./components/Sidebar";
import TaskForm from "./components/Taskform";

import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Preferences from "./pages/Preferences";
import Analytics from "./pages/Analytics";

import {
  defaultPreferences,
  defaultTasks,
} from "./data/defaultData";

import {
  rankTasks,
} from "./services/priorityEngine";

const emptyForm = {
  title: "",
  category: "Other",
  priority: "medium",
  deadline: "",
  estimatedTime: "",
};

function App() {
  const [tasks, setTasks] = useState(
    () => {
      const saved =
        localStorage.getItem(
          "priorityai_tasks"
        );

      return saved
        ? JSON.parse(saved)
        : defaultTasks;
    }
  );

  const [preferences, setPreferences] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "priorityai_preferences"
        );

      return saved
        ? JSON.parse(saved)
        : defaultPreferences;
    });

  const [activePage, setActivePage] =
    useState("dashboard");

  const [showTaskForm, setShowTaskForm] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState(null);

  const [formData, setFormData] =
    useState(emptyForm);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  // --------------------------------
  // SAVE TO LOCAL STORAGE
  // --------------------------------

  useEffect(() => {
    localStorage.setItem(
      "priorityai_tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      "priorityai_preferences",
      JSON.stringify(preferences)
    );
  }, [preferences]);

  // --------------------------------
  // RANK TASKS
  // --------------------------------

  const rankedTasks = rankTasks(
    tasks,
    preferences
  );

  // --------------------------------
  // OPEN ADD FORM
  // --------------------------------

  const openAddTask = () => {
    setEditingTask(null);
    setFormData(emptyForm);
    setShowTaskForm(true);
  };

  // --------------------------------
  // OPEN EDIT FORM
  // --------------------------------

  const openEditTask = (task) => {
    setEditingTask(task);

    setFormData({
      title: task.title,
      category: task.category,
      priority: task.priority,
      deadline: task.deadline || "",
      estimatedTime:
        task.estimatedTime || "",
    });

    setShowTaskForm(true);
  };

  // --------------------------------
  // SAVE TASK
  // --------------------------------

  const saveTask = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a task name.");
      return;
    }

    if (editingTask) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                title:
                  formData.title.trim(),
                category:
                  formData.category,
                priority:
                  formData.priority,
                deadline:
                  formData.deadline,
                estimatedTime:
                  Number(
                    formData.estimatedTime
                  ) || 1,
              }
            : task
        )
      );
    } else {
      const newTask = {
        id: Date.now(),

        title:
          formData.title.trim(),

        category:
          formData.category,

        priority:
          formData.priority,

        deadline:
          formData.deadline,

        estimatedTime:
          Number(
            formData.estimatedTime
          ) || 1,

        completed: false,

        createdAt:
          new Date()
            .toISOString()
            .split("T")[0],
      };

      setTasks((current) => [
        ...current,
        newTask,
      ]);
    }

    setFormData(emptyForm);
    setEditingTask(null);
    setShowTaskForm(false);
  };

  // --------------------------------
  // TOGGLE TASK
  // --------------------------------

  const toggleTask = (id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              completed:
                !task.completed,
            }
          : task
      )
    );
  };

  // --------------------------------
  // DELETE TASK
  // --------------------------------

  const deleteTask = (id) => {
    const confirmed = window.confirm(
      "Delete this task?"
    );

    if (!confirmed) return;

    setTasks((current) =>
      current.filter(
        (task) => task.id !== id
      )
    );
  };

  // --------------------------------
  // UPDATE PREFERENCE
  // --------------------------------

  const updatePreference = (
    category,
    value
  ) => {
    setPreferences((current) => ({
      ...current,
      [category]: value,
    }));
  };

  // --------------------------------
  // PAGE RENDER
  // --------------------------------

  const renderPage = () => {
    switch (activePage) {
      case "tasks":
        return (
          <Tasks
            rankedTasks={rankedTasks}
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
            onToggle={toggleTask}
            onEdit={openEditTask}
            onDelete={deleteTask}
            onAddTask={openAddTask}
          />
        );

      case "preferences":
        return (
          <Preferences
            preferences={
              preferences
            }
            onChange={
              updatePreference
            }
          />
        );

      case "analytics":
        return (
          <Analytics
            tasks={tasks}
          />
        );

      default:
        return (
          <Dashboard
            tasks={tasks}
            rankedTasks={
              rankedTasks
            }
            onAddTask={
              openAddTask
            }
            onToggle={
              toggleTask
            }
            onEdit={
              openEditTask
            }
            onDelete={
              deleteTask
            }
          />
        );
    }
  };

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        setActivePage={
          setActivePage
        }
      />

      <main className="main">
        {renderPage()}
      </main>

      {showTaskForm && (
        <TaskForm
          formData={formData}
          setFormData={
            setFormData
          }
          onSubmit={saveTask}
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          editingTask={
            editingTask
          }
        />
      )}
    </div>
  );
}

export default App;