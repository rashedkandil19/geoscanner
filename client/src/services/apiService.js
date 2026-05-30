const API_URL = import.meta.env.VITE_API_URL || "https://localhost:5000";
export async function searchPlaces(location, keyword, radius) {
  const response = await fetch(`${API_URL}/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location, keyword, radius }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Server error");
  }
  return response.json();
}
