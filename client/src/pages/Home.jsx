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
  const [searchHistory, setSearchHistory] = useState(
    JSON.parse(localStorage.getItem("searchHistory")) || [],
  );

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
      const { results: places } = await searchPlaces(location, keyword, radius);

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
        phone: "—",
        website: null,
        opening: place.opening_hours?.open_now ? "Open Now" : "Unknown",
        mapUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      }));

      const withPhone = mapped.filter((r) => r.phone !== "—").length;
      const withWeb = mapped.filter((r) => r.website).length;

      clearMsg();
      setResults(mapped);
      setStats({ total: mapped.length, withPhone, withWeb });
      addToHistory(location, keyword, radius);

      // Store coordinates for map
      setLat(30.0444);
      setLonValue(31.2357);
    } catch (e) {
      showMsg(`⚠ ${e.message}`, "error");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") startSearch();
  }

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="main-content">
        <Header />

        {activeTab === "search" && (
          <div className="container" onKeyDown={handleKeyDown}>
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
                <StatusBar stats={stats} />
                <ResultsTable
                  results={results}
                  message={message}
                  msgType={msgType}
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
                <div style={{ padding: "20px" }}>
                  {searchHistory.map((search) => (
                    <div
                      key={search.id}
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #333",
                        cursor: "pointer",
                        marginBottom: "8px",
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
                      <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
                        {search.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "collections" && (
          <div className="container">
            <div className="panel">
              <div className="panel-label">Saved Collections</div>
              <div
                style={{ padding: "20px", textAlign: "center", color: "#888" }}
              >
                Collections coming soon
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="container">
            <div className="panel">
              <div className="panel-label">Analytics</div>
              <div
                style={{ padding: "20px", textAlign: "center", color: "#888" }}
              >
                Analytics dashboard coming soon
              </div>
            </div>
          </div>
        )}

        {activeTab === "map" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {results.length > 0 ? (
              <MapView
                results={results}
                searchCoords={{ lat, lon: lonValue }}
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
              <div
                style={{ padding: "20px", textAlign: "center", color: "#888" }}
              >
                Export feature coming soon
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
