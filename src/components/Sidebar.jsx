function Sidebar({
  activePage,
  setActivePage,
}) {
  const navigation = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "⌂",
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: "✓",
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: "⚙",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "▥",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        Priority<span>AI</span>
      </div>

      <nav className="sidebar-nav">
        {navigation.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${
              activePage === item.id
                ? "active"
                : ""
            }`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="nav-icon">
              {item.icon}
            </span>

            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="engine-status">
          <span className="status-dot"></span>

          <div>
            <strong>Priority Engine</strong>
            <p>Running locally</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;