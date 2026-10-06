import {
  getDeadlineStatus,
} from "../services/priorityEngine";

function PriorityCard({
  task,
  onComplete,
}) {
  if (!task) {
    return (
      <div className="priority-card empty-priority">
        <div className="priority-icon">
          🎉
        </div>

        <div className="priority-info">
          <h3>
            Nothing needs your attention right now.
          </h3>

          <p>
            Complete tasks or add a new one.
          </p>
        </div>
      </div>
    );
  }

  const deadline = getDeadlineStatus(
    task.deadline
  );

  return (
    <div className="priority-card">
      <div className="priority-icon">
        🧠
      </div>

      <div className="priority-info">
        <div className="recommendation-label">
          RECOMMENDED NEXT
        </div>

        <h3>{task.title}</h3>

        <div className="task-details">
          <span className="score-pill">
            SCORE {task.score}
          </span>

          <span>
            {task.category}
          </span>

          <span>
            {deadline.label}
          </span>

          <span>
            {task.estimatedTime}h
          </span>
        </div>

        <div className="why-box">
          <strong>Why this task?</strong>

          <p>
            {task.reasons.join(" • ")}
          </p>
        </div>
      </div>

      <button
        className="start-button"
        onClick={() => onComplete(task.id)}
      >
        Complete
      </button>
    </div>
  );
}

export default PriorityCard;