import { useEffect, useState } from "react";

import "./App.css";

import Sidebar from "./components/Sidebar";
import TaskForm from "./components/Taskform";

import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Preferences from "./pages/Preferences";
import Analytics from "./pages/Analytics";

import { defaultPreferences } from "./data/defaultData";
import { rankTasks } from "./services/priorityEngine";

const DEMO_EMAIL = "demo@priorityai.com";
const DEMO_PASSWORD = "Priority@123";

const emptyForm = {
  title: "",
  category: "Other",
  priority: "medium",
  deadline: "",
  estimatedTime: "",
};

const tutorialSlides = [
  {
    icon: "➕",
    title: "Add your tasks",
    description:
      "Create tasks with a name, category, importance, deadline and estimated time.",
  },
  {
    icon: "⚙️",
    title: "Set your preferences",
    description:
      "Tell PriorityAI what matters most to you. Your preferences influence task ranking.",
  },
  {
    icon: "🧠",
    title: "Get your next best action",
    description:
      "PriorityAI combines importance, preferences, deadlines, overdue status and effort.",
  },
  {
    icon: "📊",
    title: "Track your progress",
    description:
      "Complete tasks and use Analytics to understand how you're spending your time.",
  },
];

/* =========================
   LOGIN SCREEN
========================= */

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const enteredEmail = email.trim().toLowerCase();

    if (
      enteredEmail === DEMO_EMAIL &&
      password === DEMO_PASSWORD
    ) {
      setError("");
      onLogin();
      return;
    }

    setError(
      "Invalid login. Please use the demo credentials shown below."
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          Priority<span>AI</span>
        </div>

        <p className="auth-kicker">
          PERSONAL PRIORITY ENGINE
        </p>

        <h1>Welcome back</h1>

        <p className="auth-description">
          Login to start organizing your work around
          what matters most.
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>
        </form>

        <div className="demo-credentials">
          <strong>Prototype login</strong>

          <p>
            Email: {DEMO_EMAIL}
          </p>

          <p>
            Password: {DEMO_PASSWORD}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================
   TUTORIAL
========================= */

function Tutorial({
  step,
  setStep,
  onSkip,
}) {
  const currentSlide = tutorialSlides[step];

  const isLast =
    step === tutorialSlides.length - 1;

  const handleNext = () => {
    if (isLast) {
      onSkip();
      return;
    }

    setStep((currentStep) => currentStep + 1);
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-dialog">
        <button
          className="tutorial-close"
          onClick={onSkip}
          aria-label="Skip tutorial"
          title="Skip tutorial"
        >
          ✕
        </button>

        <div className="tutorial-icon">
          {currentSlide.icon}
        </div>

        <p className="tutorial-step">
          STEP {step + 1} OF {tutorialSlides.length}
        </p>

        <h2>{currentSlide.title}</h2>

        <p className="tutorial-description">
          {currentSlide.description}
        </p>

        <div className="tutorial-dots">
          {tutorialSlides.map((_, index) => (
            <span
              key={index}
              className={
                index === step
                  ? "tutorial-dot active"
                  : "tutorial-dot"
              }
            />
          ))}
        </div>

        <div className="tutorial-actions">
          <button
            className="skip-button"
            onClick={onSkip}
          >
            Skip
          </button>

          <button
            className="next-button"
            onClick={handleNext}
          >
            {isLast ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   MAIN APP
========================= */

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return (
      localStorage.getItem("priorityai_logged_in") ===
      "true"
    );
  });

  const [showTutorial, setShowTutorial] = useState(
    () => {
      return (
        localStorage.getItem(
          "priorityai_tutorial_completed"
        ) !== "true"
      );
    }
  );

  const [tutorialStep, setTutorialStep] = useState(0);

  /*
   * IMPORTANT:
   * Start with NO default tasks.
   */
  const [tasks, setTasks] = useState([]);

  const [preferences, setPreferences] =
    useState(defaultPreferences);

  const [activePage, setActivePage] =
    useState("dashboard");

  const [showTaskForm, setShowTaskForm] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState(null);

  const [formData, setFormData] =
    useState(emptyForm);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  /* =========================
     LOAD SAVED DATA
  ========================= */

  useEffect(() => {
    /*
     * Remove tasks from older versions.
     * This guarantees a clean start for this version.
     */
    const currentVersion =
      localStorage.getItem(
        "priorityai_data_version"
      );

    if (currentVersion !== "v3") {
      localStorage.removeItem("priorityai_tasks");

      localStorage.setItem(
        "priorityai_data_version",
        "v3"
      );

      setTasks([]);
    } else {
      const savedTasks =
        localStorage.getItem("priorityai_tasks");

      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks);

          if (Array.isArray(parsedTasks)) {
            setTasks(parsedTasks);
          } else {
            setTasks([]);
          }
        } catch {
          setTasks([]);
        }
      }
    }

    const savedPreferences =
      localStorage.getItem(
        "priorityai_preferences"
      );

    if (savedPreferences) {
      try {
        const parsedPreferences =
          JSON.parse(savedPreferences);

        setPreferences(parsedPreferences);
      } catch {
        setPreferences(defaultPreferences);
      }
    }
  }, []);

  /* =========================
     SAVE TASKS
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "priorityai_tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  /* =========================
     SAVE PREFERENCES
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "priorityai_preferences",
      JSON.stringify(preferences)
    );
  }, [preferences]);

  /* =========================
     SMART RANKING
  ========================= */

  const rankedTasks = rankTasks(
    tasks,
    preferences
  );

  /* =========================
     LOGIN
  ========================= */

  const login = () => {
    localStorage.setItem(
      "priorityai_logged_in",
      "true"
    );

    setIsLoggedIn(true);

    setShowTutorial(false);
  };

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {
    localStorage.removeItem(
      "priorityai_logged_in"
    );

    setIsLoggedIn(false);

    setTutorialStep(0);

    /*
     * Show tutorial again after logout.
     */
    setShowTutorial(true);
  };

  /* =========================
     TUTORIAL
  ========================= */

  const skipTutorial = () => {
    localStorage.setItem(
      "priorityai_tutorial_completed",
      "true"
    );

    setShowTutorial(false);

    setTutorialStep(0);
  };

  /* =========================
     ADD TASK
  ========================= */

  const openAddTask = () => {
    setEditingTask(null);

    setFormData(emptyForm);

    setShowTaskForm(true);
  };

  /* =========================
     EDIT TASK
  ========================= */

  const openEditTask = (task) => {
    setEditingTask(task);

    setFormData({
      title: task.title || "",
      category: task.category || "Other",
      priority: task.priority || "medium",
      deadline: task.deadline || "",
      estimatedTime: task.estimatedTime || "",
    });

    setShowTaskForm(true);
  };

  /* =========================
     SAVE TASK
  ========================= */

  const saveTask = (e) => {
    e.preventDefault();

    const title = formData.title.trim();

    if (!title) {
      alert("Please enter a task name.");
      return;
    }

    if (editingTask) {
      setTasks((currentTasks) =>
        currentTasks.map((task) => {
          if (task.id !== editingTask.id) {
            return task;
          }

          return {
            ...task,
            title,
            category: formData.category,
            priority: formData.priority,
            deadline: formData.deadline,
            estimatedTime:
              Number(formData.estimatedTime) || 1,
          };
        })
      );
    } else {
      const newTask = {
        id: Date.now(),
        title,
        category: formData.category,
        priority: formData.priority,
        deadline: formData.deadline,
        estimatedTime:
          Number(formData.estimatedTime) || 1,
        completed: false,
        createdAt: new Date()
          .toISOString()
          .split("T")[0],
      };

      setTasks((currentTasks) => [
        ...currentTasks,
        newTask,
      ]);
    }

    setFormData(emptyForm);
    setEditingTask(null);
    setShowTaskForm(false);
  };

  /* =========================
     TOGGLE TASK
  ========================= */

  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== id) {
          return task;
        }

        return {
          ...task,
          completed: !task.completed,
        };
      })
    );
  };

  /* =========================
     DELETE TASK
  ========================= */

  const deleteTask = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) => task.id !== id
      )
    );
  };

  /* =========================
     UPDATE PREFERENCE
  ========================= */

  const updatePreference = (
    category,
    value
  ) => {
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      [category]: Number(value),
    }));
  };

  /* =========================
     PAGE RENDER
  ========================= */

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
            preferences={preferences}
            onChange={updatePreference}
          />
        );

      case "analytics":
        return (
          <Analytics
            tasks={tasks}
          />
        );

      case "dashboard":
      default:
        return (
          <Dashboard
            tasks={tasks}
            rankedTasks={rankedTasks}
            onAddTask={openAddTask}
            onToggle={toggleTask}
            onEdit={openEditTask}
            onDelete={deleteTask}
          />
        );
    }
  };

  /* =========================
     NOT LOGGED IN
  ========================= */

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen onLogin={login} />

        {showTutorial && (
          <Tutorial
            step={tutorialStep}
            setStep={setTutorialStep}
            onSkip={skipTutorial}
          />
        )}
      </>
    );
  }

  /* =========================
     LOGGED IN
  ========================= */

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main">
        <div className="logout-area">
          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>

        {renderPage()}
      </main>

      {showTaskForm && (
        <TaskForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={saveTask}
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
            setFormData(emptyForm);
          }}
          editingTask={editingTask}
        />
      )}
    </div>
  );
}

export default App;