const PRIORITY_SCORES = {
  high: 30,
  medium: 20,
  low: 10,
};

const getDaysUntilDeadline = (deadline) => {
  if (!deadline) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(`${deadline}T00:00:00`);

  return Math.ceil(
    (dueDate - today) / (1000 * 60 * 60 * 24)
  );
};

const getUrgencyScore = (deadline) => {
  const days = getDaysUntilDeadline(deadline);

  if (days === null) return 5;

  if (days < 0) return 50;
  if (days === 0) return 45;
  if (days === 1) return 40;
  if (days <= 3) return 30;
  if (days <= 7) return 20;
  if (days <= 14) return 10;

  return 5;
};

const getPreferenceScore = (category, preferences) => {
  const preference = preferences[category] ?? 1;

  return preference * 5;
};

const getEffortScore = (estimatedTime) => {
  const hours = Number(estimatedTime) || 1;

  if (hours <= 1) return 5;
  if (hours <= 2) return 4;
  if (hours <= 4) return 2;

  return 1;
};

const getOverdueBonus = (deadline) => {
  const days = getDaysUntilDeadline(deadline);

  if (days === null || days >= 0) {
    return 0;
  }

  return Math.min(Math.abs(days) * 4, 20);
};

export const calculatePriorityScore = (
  task,
  preferences
) => {
  const importance = PRIORITY_SCORES[task.priority] ?? 10;

  const preference = getPreferenceScore(
    task.category,
    preferences
  );

  const urgency = getUrgencyScore(task.deadline);

  const effort = getEffortScore(task.estimatedTime);

  const overdue = getOverdueBonus(task.deadline);

  return (
    importance +
    preference +
    urgency +
    effort +
    overdue
  );
};

export const getDeadlineStatus = (deadline) => {
  const days = getDaysUntilDeadline(deadline);

  if (days === null) {
    return {
      label: "No deadline",
      type: "neutral",
    };
  }

  if (days < 0) {
    return {
      label: `${Math.abs(days)} day(s) overdue`,
      type: "overdue",
    };
  }

  if (days === 0) {
    return {
      label: "Due today",
      type: "today",
    };
  }

  if (days === 1) {
    return {
      label: "Due tomorrow",
      type: "tomorrow",
    };
  }

  return {
    label: `${days} day(s) left`,
    type: "future",
  };
};

export const getRecommendationReason = (
  task,
  preferences
) => {
  const reasons = [];

  const preference = preferences[task.category] ?? 1;

  if (preference >= 5) {
    reasons.push(
      `${task.category} is one of your highest priorities`
    );
  } else if (preference >= 4) {
    reasons.push(
      `${task.category} is important to you`
    );
  }

  const deadlineStatus = getDeadlineStatus(
    task.deadline
  );

  if (
    deadlineStatus.type === "overdue"
  ) {
    reasons.push(
      `it is ${deadlineStatus.label}`
    );
  } else if (
    deadlineStatus.type === "today"
  ) {
    reasons.push("it is due today");
  } else if (
    deadlineStatus.type === "tomorrow"
  ) {
    reasons.push("it is due tomorrow");
  }

  if (task.priority === "high") {
    reasons.push("you marked it as high priority");
  }

  if (Number(task.estimatedTime) <= 2) {
    reasons.push(
      "it can be completed in a relatively short session"
    );
  }

  if (reasons.length === 0) {
    reasons.push(
      "it currently has the highest calculated priority score"
    );
  }

  return reasons;
};

export const rankTasks = (
  tasks,
  preferences
) => {
  return tasks
    .filter((task) => !task.completed)
    .map((task) => ({
      ...task,
      score: calculatePriorityScore(
        task,
        preferences
      ),
      reasons: getRecommendationReason(
        task,
        preferences
      ),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return (
        new Date(a.deadline || "9999-12-31") -
        new Date(b.deadline || "9999-12-31")
      );
    });
};