export default async function handler(req, res) {
  try {
    const { geocode, searchGooglePlaces, getPlaceDetails } =
      await import("./googleService.js");
    const { getCached, saveCache } = await import("./cacheService.js");
    const mongoose = await import("mongoose");

    res.json({ status: "imports ok" });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
}
