const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export async function searchPlaces(location, keyword, radius) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(`${API_URL}/api/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, keyword, radius }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Server error");
    }
    return response.json();
  } catch (e) {
    clearTimeout(timeout);
    if (e.name === "AbortError") {
      throw new Error(
        "Server is waking up, please try again in a few seconds.",
        { cause: e },
      );
    }
    throw e;
  }
}
