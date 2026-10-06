import { categories } from "../data/defaultData";

function TaskForm({
  formData,
  setFormData,
  onSubmit,
  onClose,
  editingTask,
}) {
  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <div>
            <p className="modal-kicker">
              {editingTask
                ? "UPDATE TASK"
                : "NEW TASK"}
            </p>

            <h2>
              {editingTask
                ? "Edit Task"
                : "Add New Task"}
            </h2>
          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <label>Task Name</label>

          <input
            type="text"
            placeholder="Example: Study Machine Learning"
            value={formData.title}
            onChange={(e) =>
              updateField("title", e.target.value)
            }
            autoFocus
          />

          <label>Category</label>

          <select
            value={formData.category}
            onChange={(e) =>
              updateField(
                "category",
                e.target.value
              )
            }
          >
            {categories.map((category) => (
              <option
                value={category}
                key={category}
              >
                {category}
              </option>
            ))}
          </select>

          <label>Importance</label>

          <select
            value={formData.priority}
            onChange={(e) =>
              updateField(
                "priority",
                e.target.value
              )
            }
          >
            <option value="high">
              High
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="low">
              Low
            </option>
          </select>

          <label>Deadline</label>

          <input
            type="date"
            value={formData.deadline}
            onChange={(e) =>
              updateField(
                "deadline",
                e.target.value
              )
            }
          />

          <label>
            Estimated Time (hours)
          </label>

          <input
            type="number"
            min="0.5"
            step="0.5"
            placeholder="Example: 2"
            value={formData.estimatedTime}
            onChange={(e) =>
              updateField(
                "estimatedTime",
                e.target.value
              )
            }
          />

          <button
            type="submit"
            className="submit-button"
          >
            {editingTask
              ? "Save Changes"
              : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;