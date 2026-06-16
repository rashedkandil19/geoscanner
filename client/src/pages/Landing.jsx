import { useEffect, useRef, useState } from "react";
import "../styles/landing.css";

const DEMO_QUERY = "real estate agencies in Cairo";
const DEMO_ROWS = [
  {
    idx: "01",
    name: "Nile View Realty",
    addr: "Zamalek, Cairo",
    status: "Open",
  },
  {
    idx: "02",
    name: "Cairo Prime Properties",
    addr: "Heliopolis, Cairo",
    status: "Open",
  },
  {
    idx: "03",
    name: "Maadi Homes Group",
    addr: "Maadi, Cairo",
    status: "Closed",
  },
  {
    idx: "04",
    name: "Downtown Estate Partners",
    addr: "Downtown, Cairo",
    status: "Open",
  },
];

export default function Landing() {
  // ─── Typed text effect state ────────────────────────────────────────────
  const [typedText, setTypedText] = useState("");
  const [sweepActive, setSweepActive] = useState(false);
  const [visibleRows, setVisibleRows] = useState([]);
  const demoRef = useRef(null);
  const hasRun = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRun.current) {
            hasRun.current = true;
            runDemo();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );

    if (demoRef.current) observer.observe(demoRef.current);
    return () => observer.disconnect();
  }, []);

  function runDemo() {
    let i = 0;
    const typeInterval = setInterval(() => {
      setTypedText(DEMO_QUERY.slice(0, i + 1));
      i++;
      if (i >= DEMO_QUERY.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          setSweepActive(true);
          setTimeout(() => {
            DEMO_ROWS.forEach((row, idx) => {
              setTimeout(() => {
                setVisibleRows((prev) => [...prev, row]);
              }, idx * 220);
            });
          }, 700);
        }, 400);
      }
    }, 38);
  }

  return (
    <div className="landing">
      <div className="grid-bg" />

      <nav className="l-nav">
        <div className="l-nav-inner">
          <div className="l-nav-logo">
            <span className="l-dot" />
            Spot<span className="l-accent-text">ly</span>
          </div>
          <a href="/app" className="l-nav-cta">
            Launch App →
          </a>
        </div>
      </nav>

      <header className="l-hero">
        <span className="l-eyebrow">Location intelligence, instantly</span>
        <h1>
          Turn any city into a <span className="l-accent-text">searchable</span>{" "}
          business directory.
        </h1>
        <p className="l-lede">
          Spotly scans real locations for real businesses — restaurants,
          suppliers, clinics, competitors — and hands you back structured,
          exportable data instead of forty open tabs.
        </p>

        <div className="l-hero-actions">
          <a href="/app" className="l-btn-primary">
            Find It. Spot It. Love It.
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#how" className="l-btn-ghost">
            See how it works
          </a>
        </div>

        <div className="l-demo" ref={demoRef}>
          <div className="l-demo-bar">
            <div className="l-demo-dots">
              <span />
              <span />
              <span />
            </div>
            spotly.app/search
          </div>

          <div
            className="l-demo-bar"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div className="l-demo-input-row">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span className="l-typed-text">{typedText}</span>
              <span className="l-cursor-blink" />
            </div>
          </div>

          <div className="l-demo-body">
            <div className={`l-scan-sweep ${sweepActive ? "active" : ""}`} />

            <div className="l-demo-head-row">
              <div>#</div>
              <div>Name</div>
              <div>Address</div>
              <div>Status</div>
              <div></div>
            </div>

            <div>
              {visibleRows.map((row) => (
                <div className="l-result-row show" key={row.idx}>
                  <div className="l-idx">{row.idx}</div>
                  <div className="l-name">{row.name}</div>
                  <div className="l-addr">{row.addr}</div>
                  <div
                    className="l-status"
                    style={
                      row.status === "Closed"
                        ? {
                            borderColor: "var(--accent2)",
                            color: "var(--accent2)",
                          }
                        : {}
                    }
                  >
                    {row.status}
                  </div>
                  <div className="l-pin">📍 map</div>
                </div>
              ))}
            </div>

            <div className="l-demo-stats">
              <div>
                <b>{visibleRows.length}</b> found
              </div>
              <div>
                Source: <b>cache</b>
              </div>
              <div>
                Response: <b>312ms</b>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="how">
        <div className="l-section-head">
          <span className="l-section-tag">How it works</span>
          <h2>Three inputs. One structured dataset.</h2>
          <p>
            No account setup, no map-clicking marathon. Type what you're looking
            for, where, and how far — Spotly does the rest.
          </p>
        </div>
        <div className="l-steps">
          <div className="l-step">
            <span className="l-num">01</span>
            <h3>Set the area</h3>
            <p>
              Type any location worldwide — a city, a neighborhood, even a
              landmark — and pick a radius from 500m to 50km.
            </p>
          </div>
          <div className="l-step">
            <span className="l-num">02</span>
            <h3>Name the target</h3>
            <p>
              Enter a keyword — "real estate agency," "pharmacy," "competitor
              cafés" — or tap a quick filter chip to start instantly.
            </p>
          </div>
          <div className="l-step">
            <span className="l-num">03</span>
            <h3>Get the dataset</h3>
            <p>
              Results land in a sortable table and on a live map, ready to
              filter, save, or export as CSV in one click.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="l-section-head">
          <span className="l-section-tag">What you get</span>
          <h2>Built for actual research, not just browsing.</h2>
        </div>
        <div className="l-features">
          <Feature
            icon={
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            }
            extra={<circle cx="12" cy="9" r="2.5" />}
            title="Interactive map"
            text="Every result lands on a live map with accurate coordinates, color-coded by category, with directions one tap away."
          />
          <Feature
            icon={<path d="M3 3v18h18" />}
            extra={<path d="M18 9l-5 5-3-3-4 4" />}
            title="Smart filters"
            text="Narrow by open now, has a phone number, or has a website — on both the table and the map, instantly."
          />
          <Feature
            icon={<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />}
            extra={
              <>
                <path d="M7 10l5 5 5-5" />
                <path d="M12 15V3" />
              </>
            }
            title="One-click export"
            text="Send any result set straight to CSV — name, address, category, status, and map link, ready for a spreadsheet."
          />
          <Feature
            icon={
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            }
            title="Saved collections"
            text="Star any place mid-search and build a running shortlist — competitor lists, supplier shortlists, trip plans."
          />
          <Feature
            icon={<circle cx="12" cy="12" r="9" />}
            extra={<path d="M12 7v5l3 3" />}
            title="Search history"
            text="Every past search is one click away — re-run a query from last week without retyping anything."
          />
          <Feature
            icon={<path d="M22 12h-4l-3 9L9 3l-3 9H2" />}
            title="Cached & fast"
            text="Repeat searches return in milliseconds from cache, not from scratch — built to stay fast at scale."
          />
        </div>
      </section>

      <div className="l-stats-band">
        <div className="l-stats-inner">
          <Stat val="50km" label="max search radius" />
          <Stat val="<1s" label="cached response time" />
          <Stat val="∞" label="searchable locations worldwide" />
          <Stat val="1-click" label="CSV export" />
        </div>
      </div>

      <section>
        <div className="l-section-head">
          <span className="l-section-tag">Who it's for</span>
          <h2>If your work starts with "where," Spotly fits.</h2>
        </div>
        <div className="l-usecases">
          <UseCase
            tag="Sales"
            title="Prospect lists"
            text="Pull every relevant business in a territory and export it straight into your outreach pipeline."
          />
          <UseCase
            tag="Local business"
            title="Competitor scans"
            text="See exactly who else is operating nearby, what's open, and who has a web presence and who doesn't."
          />
          <UseCase
            tag="Research"
            title="Market mapping"
            text="Quantify density of any business type across a city before drawing a single conclusion."
          />
          <UseCase
            tag="Travel"
            title="Local discovery"
            text="Land somewhere new and immediately see what's actually around you, sorted by what matters."
          />
        </div>
      </section>

      <section className="l-cta-section">
        <h2>
          Stop tabbing through{" "}
          <span className="l-accent-text">forty listings</span>.
          <br />
          Start with a dataset.
        </h2>
        <p>
          Spotly is free to try right now — no setup, just a location and a
          keyword.
        </p>
        <a href="/app" className="l-btn-primary">
          Launch Spotly
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      </section>

      <footer className="l-footer">
        <div className="l-footer-inner">
          <div>SPOTLY — FIND IT. SPOT IT. LOVE IT.</div>
          <div>© 2026 Spotly</div>
        </div>
      </footer>
    </div>
  );
}

// ─── Small presentational helpers ─────────────────────────────────────────
// Kept inside this file since they're only used here and are tiny

function Feature({ icon, extra, title, text }) {
  return (
    <div className="l-feature">
      <div className="l-feature-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {icon}
          {extra}
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function Stat({ val, label }) {
  return (
    <div className="l-stat-item">
      <span className="l-stat-val">{val}</span>
      <span className="l-stat-label">{label}</span>
    </div>
  );
}

function UseCase({ tag, title, text }) {
  return (
    <div className="l-usecase">
      <span className="l-usecase-tag">{tag}</span>
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  );
}
