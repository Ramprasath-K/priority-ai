function Stats({ tasks }) {
  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const pending = total - completed;

  const highPriority = tasks.filter(
    (task) =>
      task.priority === "high" &&
      !task.completed
  ).length;

  const overdue = tasks.filter((task) => {
    if (
      task.completed ||
      !task.deadline
    ) {
      return false;
    }

    return (
      new Date(
        `${task.deadline}T00:00:00`
      ) < new Date()
    );
  }).length;

  return (
    <section className="stats-grid">
      <div className="stat-card">
        <p>Total Tasks</p>
        <h2>{total}</h2>
      </div>

      <div className="stat-card">
        <p>Pending</p>
        <h2>{pending}</h2>
      </div>

      <div className="stat-card">
        <p>High Priority</p>
        <h2>{highPriority}</h2>
      </div>

      <div className="stat-card">
        <p>Overdue</p>
        <h2>{overdue}</h2>
      </div>
    </section>
  );
}

export default Stats;