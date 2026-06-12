export default function Header() {
  return (
    <div className="header">
      <div className="header-icon">
        <img
          src="/spotlylogo1.png"
          alt="spotly logo"
          width="150px"
          height="100px"
        />
      </div>
      <div className="logo">
        Spot<span>ly</span>
        <div className="header-sub">
          FIND IT. SPOT IT. <span>LOVE IT</span>{" "}
        </div>
      </div>
    </div>
  );
}
