import { formatKm } from "../utils/formatKm";

function RadiusSlider({ value, onChange }) {
  return (
    <div className="field full">
      <label>SEARCH RADIUS</label>
      <div className="radius-row">
        <input
          type="range"
          min="500"
          max="50000"
          step="500"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <div className="radius-val">{formatKm(value)}</div>
      </div>
    </div>
  );
}

export default RadiusSlider;
