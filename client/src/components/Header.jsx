export default function Header() {
  return (
    <div className="header">
      <div className="header-icon">
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <path d="M11 8v6M8 11h6" />
        </svg>
      </div>
      <div className="logo">
        Geo<span>Scanner</span>
        <div className="header-sub">GLOBAL SCANNER</div>
      </div>
    </div>
  );
}
