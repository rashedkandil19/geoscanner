export default function StatusBar({ stats }) {
  if (!stats) return null;

  const items = [
    { dot: "cyan", value: stats.total, label: "Suppliers Found" },
    { dot: "green", value: stats.withPhone, label: "With Phone" },
    { dot: "warn", value: stats.withWeb, label: "With Website" },
  ];

  return (
    <div className="stats-bar">
      {items.map((item) => (
        <div key={item.label} className="stat">
          <div className={`stat-dot ${item.dot}`} />
          {}
          {}
          <div>
            <div className="stat-value">{item.value}</div>
            <div className="stat-key">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
