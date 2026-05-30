import { CHIPS } from "../constants/chips";

function QuickChips({ onSelect }) {
  return (
    <div className="quick-chips">
      {CHIPS.map((chip) => (
        <div key={chip} className="chip" onClick={() => onSelect(chip)}>
          {chip}
        </div>
      ))}
    </div>
  );
}

export default QuickChips;
