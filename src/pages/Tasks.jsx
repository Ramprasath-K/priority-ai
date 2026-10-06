import TaskRow from "../components/TaskRow";

function Tasks({
  rankedTasks,
  search,
  setSearch,
  filter,
  setFilter,
  onToggle,
  onEdit,
  onDelete,
  onAddTask,
}) {
  const filteredTasks =
    rankedTasks.filter((task) => {
      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesFilter =
        filter === "all" ||
        task.category === filter ||
        task.priority === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });

  return (
    <section className="content-section">
      <div className="page-heading inline-heading">
        <div>
          <p className="small-text">
            TASK MANAGEMENT
          </p>

          <h1>Your Tasks</h1>
        </div>

        <button
          className="add-button"
          onClick={onAddTask}
        >
          + Add Task
        </button>
      </div>

      <div className="task-toolbar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >
          <option value="all">
            All
          </option>

          <option value="GATE">
            GATE
          </option>

          <option value="College">
            College
          </option>

          <option value="Project">
            Project
          </option>

          <option value="Placement">
            Placement
          </option>

          <option value="Personal">
            Personal
          </option>

          <option value="high">
            High Priority
          </option>

          <option value="medium">
            Medium Priority
          </option>

          <option value="low">
            Low Priority
          </option>
        </select>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            No matching tasks.
          </div>
        ) : (
          filteredTasks.map(
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
  );
}

export default Tasks;