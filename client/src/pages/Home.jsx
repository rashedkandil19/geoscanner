import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MapView from "../components/MapView";
import QuickChips from "../components/QuickChips";
import RadiusSlider from "../components/RadiusSlider";
import ResultsTable from "../components/ResultsTable";
import SearchButton from "../components/SearchButton";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import { searchPlaces } from "../services/apiService";

export default function Home() {
  const [activeTab, setActiveTab] = useState("search");
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");
  const [radius, setRadius] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("SCANNING...");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState(null);
  const [msgType, setMsgType] = useState("");
  const [stats, setStats] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [lat, setLat] = useState(null);
  const [lonValue, setLonValue] = useState(null);
  const [filters, setFilters] = useState({
    openNow: false,
    hasPhone: false,
    hasWebsite: false,
  });
  const [searchHistory, setSearchHistory] = useState(
    JSON.parse(localStorage.getItem("searchHistory")) || [],
  );
  const [collections, setCollections] = useState(
    JSON.parse(localStorage.getItem("collections")) || [],
  );
  // svg
  const removeFromFav = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
    >
      <line
        x1="7"
        y1="7"
        x2="17"
        y2="17"
        stroke="#f5fdff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="17"
        y1="7"
        x2="7"
        y2="17"
        stroke="#f5fdff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
  const opensNow = (
    <div style={{ display: " flex", gap: "7px", alignItems: "center" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="7" stroke="#00d4ff" strokeWidth="2" />
        <path
          d="M9 12L11 14L15 10"
          stroke="#00d4ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p>Open Now</p>
    </div>
  );
  const withWebsiteIcon = (
    <div
      style={{
        display: " flex",
        gap: "7px",
        alignItems: "center",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="9" stroke="#00d4ff" strokeWidth="2" />

        <path d="M3 12H21" stroke="#00d4ff" strokeWidth="2" />

        <path
          d="M12 3C14.5 5.5 16 8.7 16 12C16 15.3 14.5 18.5 12 21"
          stroke="#00d4ff"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          d="M12 3C9.5 5.5 8 8.7 8 12C8 15.3 9.5 18.5 12 21"
          stroke="#00d4ff"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <p>Has Website</p>
    </div>
  );
  const hasPhoneIcon = (
    <div style={{ display: " flex", gap: "7px", alignItems: "center" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M7.5 4H5.5C4.67 4 4 4.67 4 5.5C4 13.5 10.5 20 18.5 20C19.33 20 20 19.33 20 18.5V16.5L15.5 15L13.5 17C10.8 15.8 8.2 13.2 7 10.5L9 8.5L7.5 4Z"
          stroke="#00d4ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p>Has Website</p>
    </div>
  );
  function isInCollection(place) {
    return collections.some((p) => p.mapUrl === place.mapUrl);
  }
  function toggleCollection(place) {
    const exists = collections.find((p) => p.mapUrl === place.mapUrl);
    let updated;
    if (exists) {
      updated = collections.filter((p) => p.mapUrl !== place.mapUrl);
    } else {
      updated = [...collections, place];
    }
    setCollections(updated);
    localStorage.setItem("collections", JSON.stringify(updated));
  }

  function showMsg(text, type = "") {
    setMessage(text);
    setMsgType(type);
    setResults([]);
  }

  function clearMsg() {
    setMessage(null);
    setMsgType("");
  }

  function addToHistory(loc, kw, rad) {
    const newSearch = {
      id: Date.now(),
      location: loc,
      keyword: kw,
      radius: rad,
      timestamp: new Date().toLocaleString(),
    };
    const updated = [newSearch, ...searchHistory].slice(0, 20);
    setSearchHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  }

  async function startSearch() {
    if (!location || !keyword) {
      alert("Please enter a location and keyword.");
      return;
    }

    setLoading(true);
    setLoadMsg("SCANNING...");
    setShowResults(true);
    setStats(null);
    showMsg("Locating coordinates...", "loading");

    try {
      const { results: places, coords } = await searchPlaces(
        location,
        keyword,
        radius,
      );

      if (!places.length) {
        showMsg(
          "No places found. Try another keyword or bigger radius.",
          "error",
        );
        setStats({ total: 0, withPhone: 0, withWeb: 0 });
        return;
      }

      const mapped = places.map((place) => ({
        name: place.name || "—",
        address: place.vicinity || "—",
        category: place.types?.[0] || "—",
        phone: place.phone || "—",
        website: place.website || null,
        opening: place.opening_hours?.open_now ? "Open Now" : "Unknown",
        mapUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        lat: place.geometry?.location?.lat ?? null,
        lon: place.geometry?.location?.lng ?? null,
      }));

      const withPhone = mapped.filter((r) => r.phone !== "—").length;
      const withWeb = mapped.filter((r) => r.website).length;

      clearMsg();
      setResults(mapped);
      setStats({ total: mapped.length, withPhone, withWeb });
      addToHistory(location, keyword, radius);
      setLat(coords.lat);
      setLonValue(coords.lon);
    } catch (e) {
      showMsg(`⚠ ${e.message}`, "error");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") startSearch();
  }

  function exportCSV() {
    if (!results.length) return;
    const headers = ["#", "Name", "Address", "Category", "Status", "MapLink"];
    const rows = results.map((r, i) => [
      i + 1,
      r.name,
      r.address,
      r.category.replace(/_/g, " "),
      r.opening,
      r.mapUrl,
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\r\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `geoscanner-${keyword}-${location}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredResults = results.filter((r) => {
    if (filters.openNow && r.opening !== "Open Now") return false;
    if (filters.hasPhone && r.phone === "—") return false;
    if (filters.hasWebsite && !r.website) return false;
    return true;
  });

  return (
    <div className="app-layout" onKeyDown={handleKeyDown}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="main-content">
        <Header />

        {activeTab === "search" && (
          <div className="container">
            <div className="panel">
              <div className="panel-label">Search Parameters</div>
              <div className="input-grid">
                <div className="field full">
                  <label>LOCATION</label>
                  <input
                    type="text"
                    placeholder="Cairo, Egypt"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="field full">
                  <label>WHAT ARE YOU LOOKING FOR?</label>
                  <input
                    type="text"
                    placeholder='e.g. "Malls Near Me"'
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <QuickChips onSelect={setKeyword} />
                </div>
                <RadiusSlider value={radius} onChange={setRadius} />
              </div>
              <SearchButton
                onClick={startSearch}
                loading={loading}
                loadMsg={loadMsg}
              />
            </div>

            {showResults && (
              <div className="panel result-panel">
                <div className="scanline" />
                <div className="panel-label">Results</div>

                {/* Filters */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    { key: "openNow", label: opensNow },
                    { key: "hasPhone", label: hasPhoneIcon },
                    { key: "hasWebsite", label: withWebsiteIcon },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          [f.key]: !prev[f.key],
                        }))
                      }
                      style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        border: "1px solid",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        background: filters[f.key]
                          ? "var(--accent)"
                          : "transparent",
                        color: filters[f.key] ? "var(--bg)" : "var(--text2)",
                        borderColor: filters[f.key]
                          ? "var(--accent)"
                          : "var(--border)",
                        transition: "all 0.2s",
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                  {(filters.openNow ||
                    filters.hasPhone ||
                    filters.hasWebsite) && (
                    <button
                      onClick={() =>
                        setFilters({
                          openNow: false,
                          hasPhone: false,
                          hasWebsite: false,
                        })
                      }
                      style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        border: "1px solid var(--accent2)",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        background: "transparent",
                        color: "var(--accent2)",
                      }}
                    >
                      ✕ Clear
                    </button>
                  )}
                </div>

                <StatusBar stats={stats} />
                <ResultsTable
                  results={filteredResults}
                  message={message}
                  msgType={msgType}
                  onToggleCollection={toggleCollection}
                  isInCollection={isInCollection}
                />
              </div>
            )}
          </div>
        )}
        {activeTab === "history" && (
          <div className="container">
            <div className="panel">
              <div className="panel-label">Recent Searches</div>
              {searchHistory.length === 0 ? (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#888",
                  }}
                >
                  No search history yet
                </div>
              ) : (
                <>
                  <div
                    style={{
                      padding: "20px 20px 0",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={() => {
                        if (window.confirm("Clear all search history?")) {
                          setSearchHistory([]);
                        }
                      }}
                      style={{
                        background: "#ff4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 14px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                      }}
                    >
                      Clear All
                    </button>
                  </div>

                  <div style={{ padding: "20px" }}>
                    {searchHistory.map((search) => (
                      <div
                        key={search.id}
                        style={{
                          padding: "12px",
                          borderBottom: "1px solid #333",
                          cursor: "pointer",
                          marginBottom: "8px",
                          position: "relative",
                        }}
                        onClick={() => {
                          setLocation(search.location);
                          setKeyword(search.keyword);
                          setRadius(search.radius);
                          setActiveTab("search");
                        }}
                      >
                        <div style={{ fontWeight: 500 }}>
                          {search.keyword} in {search.location}
                        </div>

                        <div
                          style={{
                            fontSize: "0.85rem",
                            color: "#aaa",
                          }}
                        >
                          {search.timestamp}
                        </div>

                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchHistory((prev) =>
                              prev.filter((item) => item.id !== search.id),
                            );
                          }}
                          style={{
                            position: "absolute",
                            right: "20px",
                            top: "19px",
                            cursor: "pointer",
                          }}
                        >
                          {removeFromFav}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {activeTab === "collections" && (
          <div className="container">
            <div className="panel">
              <div className="panel-label">
                Saved Places ({collections.length})
              </div>
              {collections.length === 0 ? (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#888",
                  }}
                >
                  No saved places yet — click ⭐ on any result to save it
                </div>
              ) : (
                <div style={{ padding: "10px" }}>
                  {collections.map((place) => (
                    <div
                      key={place.mapUrl}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px",
                        borderBottom: "1px solid #333",
                        gap: "10px",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{place.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "#aaa" }}>
                          {place.address}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--accent)",
                            marginTop: "4px",
                          }}
                        >
                          {place.category.replace(/_/g, " ")}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >
                        <a
                          href={place.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "var(--accent)", fontSize: "0.8rem" }}
                        >
                          Maps
                        </a>
                        <button
                          onClick={() => toggleCollection(place)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1.2rem",
                            color: "#ffd43b",
                          }}
                        >
                          ★
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="container">
            <div className="panel analytics-panel">
              <div className="panel-label">Analytics</div>

              <div className="analytics-content">
                <h2>Location Intelligence Platform</h2>

                <p>
                  Transform location data into actionable insights. Discover
                  demand hotspots, analyze competitors, identify market gaps,
                  track business density, and uncover new opportunities through
                  advanced geographic analytics.
                </p>

                <p>
                  Whether you're a business owner, marketer, investor, or
                  researcher, GeoScanner Analytics will help you make smarter
                  decisions backed by real-world location data.
                </p>

                <div className="coming-soon-badge"> Coming Soon</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "map" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {results.length > 0 ? (
              <MapView
                results={filteredResults}
                searchCoords={{ lat, lon: lonValue }}
                onToggleCollection={toggleCollection}
                isInCollection={isInCollection}
              />
            ) : (
              <div className="container">
                <div className="panel">
                  <div className="panel-label">Map View</div>
                  <div
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#888",
                    }}
                  >
                    Do a search first to see results on the map
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "export" && (
          <div className="container">
            <div className="panel">
              <div className="panel-label">Export Results</div>
              {results.length === 0 ? (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#888",
                  }}
                >
                  Do a search first to export results
                </div>
              ) : (
                <div style={{ padding: "20px" }}>
                  <div style={{ marginBottom: "20px", color: "#ccc" }}>
                    {results.length} results ready to export
                  </div>
                  <button className="btn-search" onClick={exportCSV}>
                    ⬇ Export as CSV
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
