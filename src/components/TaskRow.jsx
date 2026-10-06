import {
  getDeadlineStatus,
} from "../services/priorityEngine";

function TaskRow({
  task,
  rank,
  onToggle,
  onEdit,
  onDelete,
}) {
  const deadline = getDeadlineStatus(
    task.deadline
  );

  return (
    <div
      className={`task-row ${
        task.completed
          ? "completed-task"
          : ""
      }`}
    >
      <div className="task-rank">
        #{rank}
      </div>

      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />

      <div className="task-name">
        <h3>{task.title}</h3>

        <p>
          {task.category}
          {" • "}
          {deadline.label}
          {" • "}
          {task.estimatedTime}h
        </p>
      </div>

      <div className="task-score">
        {task.score ?? "-"}
      </div>

      <span
        className={`priority ${task.priority}`}
      >
        {task.priority.toUpperCase()}
      </span>

      <div className="task-actions">
        <button
          onClick={() => onEdit(task)}
          title="Edit"
        >
          ✎
        </button>

        <button
          onClick={() => onDelete(task.id)}
          title="Delete"
        >
          🗑
        </button>
      </div>
    </div>
  );
}

export default TaskRow;