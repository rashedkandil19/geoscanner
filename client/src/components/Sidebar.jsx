export default function Sidebar({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: "search",
      label: "Search",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="11" cy="11" r="7" strokeWidth="2.5" />
          <path d="M20 20L16.5 16.5" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "map",
      label: "Map View",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M3 6L9 4L15 6L21 4V18L15 20L9 18L3 20V6Z"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M9 4V18M15 6V20" strokeWidth="2.5" />
        </svg>
      ),
    },
    {
      id: "history",
      label: "History",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M3 12A9 9 0 1 0 6 5"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M3 5V10H8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 8V12L15 15" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "collections",
      label: "Collections",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M6 4.5C6 3.67 6.67 3 7.5 3H16.5C17.33 3 18 3.67 18 4.5V21L12 17L6 21V4.5Z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "export",
      label: "Export",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M12 3V15" strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M7 10L12 15L17 10"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M4 20H20" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M4 20V10" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M10 20V6" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M16 20V13" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M22 20V3" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <path d="M11 8v6M8 11h6" />
        </svg>
        <span className="sidebar-title">GeoScanner</span>
      </div>

      <nav className="sidebar-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`sidebar-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-tab">
          <span className="tab-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 3.5L13.8 4.8L16 4.4L16.8 6.5L18.9 7.4L18.5 9.6L20 11.5L18.5 13.4L18.9 15.6L16.8 16.5L16 18.6L13.8 18.2L12 19.5L10.2 18.2L8 18.6L7.2 16.5L5.1 15.6L5.5 13.4L4 11.5L5.5 9.6L5.1 7.4L7.2 6.5L8 4.4L10.2 4.8L12 3.5Z"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="11.5" r="3" strokeWidth="2" />
            </svg>
          </span>
          <span className="tab-label">Settings</span>
        </button>
      </div>
    </div>
  );
}
