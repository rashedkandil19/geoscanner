export function formatKm(v) {
  return v >= 1000
    ? (v / 1000).toFixed(v % 1000 === 0 ? 0 : 1) + "Km"
    : v + " m";
}
