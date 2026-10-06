export const defaultTasks = [
  {
    id: 1,
    title: "Complete GATE Probability Practice",
    category: "GATE",
    priority: "high",
    deadline: "2026-10-07",
    estimatedTime: 2,
    completed: false,
    createdAt: "2026-10-06",
  },
  {
    id: 2,
    title: "Finish PriorityAI Project",
    category: "Project",
    priority: "medium",
    deadline: "2026-10-10",
    estimatedTime: 3,
    completed: false,
    createdAt: "2026-10-06",
  },
  {
    id: 3,
    title: "Complete College Assignment",
    category: "College",
    priority: "high",
    deadline: "2026-10-08",
    estimatedTime: 1,
    completed: false,
    createdAt: "2026-10-06",
  },
];

export const defaultPreferences = {
  GATE: 5,
  College: 3,
  Project: 4,
  Placement: 5,
  Personal: 2,
  Other: 1,
};

export const categories = [
  "GATE",
  "College",
  "Project",
  "Placement",
  "Personal",
  "Other",
];

export const priorityLabels = {
  high: "High",
  medium: "Medium",
  low: "Low",
};