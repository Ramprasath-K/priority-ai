function Preferences({
  preferences,
  onChange,
}) {
  const preferenceLabels = {
    5: "Very High",
    4: "High",
    3: "Medium",
    2: "Low",
    1: "Very Low",
  };

  return (
    <section className="content-section">
      <div className="page-heading">
        <p className="small-text">
          PERSONALIZATION
        </p>

        <h1>
          Your Preferences
        </h1>

        <p>
          These weights influence how
          PriorityAI ranks your tasks.
        </p>
      </div>

      <div className="preferences-grid">
        {Object.entries(
          preferences
        ).map(
          ([category, value]) => (
            <div
              className="preference-card"
              key={category}
            >
              <div>
                <h3>{category}</h3>

                <p>
                  {
                    preferenceLabels[
                      value
                    ]
                  }
                </p>
              </div>

              <select
                value={value}
                onChange={(e) =>
                  onChange(
                    category,
                    Number(
                      e.target.value
                    )
                  )
                }
              >
                <option value="5">
                  Very High
                </option>

                <option value="4">
                  High
                </option>

                <option value="3">
                  Medium
                </option>

                <option value="2">
                  Low
                </option>

                <option value="1">
                  Very Low
                </option>
              </select>
            </div>
          )
        )}
      </div>

      <div className="info-card">
        <h3>
          How your score works
        </h3>

        <p>
          PriorityAI currently combines
          task importance, your category
          preference, deadline urgency,
          overdue status and estimated
          effort.
        </p>
      </div>
    </section>
  );
}

export default Preferences;