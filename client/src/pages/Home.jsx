import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import QuickChips from "../components/QuickChips";
import RadiusSlider from "../components/RadiusSlider";
import ResultsTable from "../components/ResultsTable";
import SearchButton from "../components/SearchButton";
import StatusBar from "../components/StatusBar";
import { searchPlaces } from "../services/apiService";

export default function Home() {
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

  function showMsg(text, type = "") {
    setMessage(text);
    setMsgType(type);
    setResults([]);
  }

  function clearMsg() {
    setMessage(null);
    setMsgType("");
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
    <div className="container" onKeyDown={handleKeyDown}>
      <Header />

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
          <ResultsTable results={results} message={message} msgType={msgType} />
        </div>
      )}

      <Footer />
    </div>
  );
}
