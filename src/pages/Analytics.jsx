function Analytics({ tasks }) {
  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const total = tasks.length;

  const completionRate =
    total === 0
      ? 0
      : Math.round(
          (completed / total) * 100
        );

  const categories = {};

  tasks.forEach((task) => {
    categories[task.category] =
      (categories[task.category] || 0) +
      1;
  });

  return (
    <section className="content-section">
      <div className="page-heading">
        <p className="small-text">
          INSIGHTS
        </p>

        <h1>
          Productivity Analytics
        </h1>

        <p>
          A basic view of how your work
          is distributed.
        </p>
      </div>

      <div className="analytics-grid">

        <div className="analytics-card">
          <p>Completion Rate</p>
          <strong>
            {completionRate}%
          </strong>

          <div className="progress-track">
            <div
              className="progress-bar"
              style={{
                width: `${completionRate}%`,
              }}
            />
          </div>
        </div>

        <div className="analytics-card">
          <p>Completed Tasks</p>
          <strong>
            {completed}
          </strong>
        </div>

        <div className="analytics-card">
          <p>Total Tasks</p>
          <strong>
            {total}
          </strong>
        </div>

      </div>

      <div className="info-card">
        <h3>
          Tasks by category
        </h3>

        {Object.entries(categories).map(
          ([category, count]) => (
            <div
              className="category-stat"
              key={category}
            >
              <span>{category}</span>

              <strong>{count}</strong>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default Analytics;