import PriorityCard from "../components/PriorityCard";
import Stats from "../components/Stats";
import TaskRow from "../components/TaskRow";

function Dashboard({
  tasks,
  rankedTasks,
  onAddTask,
  onToggle,
  onEdit,
  onDelete,
}) {
  const recommendedTask =
    rankedTasks[0] ?? null;

  return (
    <>
      <div className="topbar">
        <div>
          <p className="small-text">
            PriorityAI Dashboard
          </p>

          <h1>
            Good evening 👋
          </h1>
        </div>

        <div className="profile-button">
          SP
        </div>
      </div>

      <p className="subtitle">
        Your task list is ranked around
        what matters most to you.
      </p>

      <Stats tasks={tasks} />

      <section className="content-section">
        <div className="section-header">
          <h2>
            What You Should Do Next
          </h2>

          <span className="ai-badge">
            Smart Recommendation
          </span>
        </div>

        <PriorityCard
          task={recommendedTask}
          onComplete={onToggle}
        />
      </section>

      <section className="content-section">
        <div className="section-header">
          <h2>Your Tasks</h2>

          <button
            className="add-button"
            onClick={onAddTask}
          >
            + Add Task
          </button>
        </div>

        <div className="task-list">
          {rankedTasks.length === 0 ? (
            <div className="empty-state">
              No pending tasks.
            </div>
          ) : (
            rankedTasks.map(
              (task, index) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  rank={index + 1}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              )
            )
          )}
        </div>
      </section>
    </>
  );
}

export default Dashboard;