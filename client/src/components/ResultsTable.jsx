export default function ResultsTable({
  results,
  message,
  msgType,
  onToggleCollection,
  isInCollection,
}) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Address</th>
            <th>Category</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Save</th>
            <th>Map</th>
          </tr>
        </thead>
        <tbody>
          {message ? (
            <tr>
              <td colSpan="8" className={`msg ${msgType || ""}`}>
                {message}
              </td>
            </tr>
          ) : (
            results.map((r, i) => (
              <tr
                key={r.mapUrl}
                onClick={() => window.open(r.mapUrl, "_blank")}
                style={{ cursor: "pointer" }}
              >
                <td
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "0.7rem",
                    color: "var(--text3)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </td>
                <td className="name">{r.name}</td>
                <td style={{ fontSize: "0.78rem", maxWidth: "220px" }}>
                  {r.address}
                </td>
                <td>
                  <span className="tag">{r.category.replace(/_/g, " ")}</span>
                </td>
                <td className="phone">{r.phone}</td>
                <td>
                  <span
                    className={`tag ${r.opening === "Open Now" ? "open" : ""}`}
                  >
                    {r.opening || "—"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCollection(r);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.3rem",
                      color: isInCollection(r) ? "#ffd43b" : "#555",
                      transition: "color 0.2s",
                    }}
                    title={
                      isInCollection(r) ? "Remove from saved" : "Save place"
                    }
                  >
                    {isInCollection(r) ? "★" : "☆"}
                  </button>
                </td>
                <td>
                  <a
                    className="map-btn"
                    href={r.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                    MAP
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
