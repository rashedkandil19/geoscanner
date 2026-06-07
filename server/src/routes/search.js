import { Router } from "express";
import { getCached, saveCache } from "../services/cacheService.js";
import {
  geocode,
  getPlaceDetails,
  searchGooglePlaces,
} from "../services/googleService.js";

const router = Router();

router.post("/", async (req, res) => {
  const { keyword, location, radius } = req.body;
  if (!keyword || !location || !radius) {
    return res.status(400).json({
      error: "keyword, location, and radius are required",
    });
  }
  try {
    const coords = await geocode(location);
    const { lat, lon } = coords;

    const cached = await getCached(keyword, lat, lon, radius);
    if (cached) {
      return res.json({
        results: cached,
        fromCache: true,
        coords: { lat, lon },
      });
    }

    const places = await searchGooglePlaces(lat, lon, radius, keyword);

    const placesWithDetails = await Promise.all(
      places.map(async (place) => {
        const details = await getPlaceDetails(place.place_id);
        return { ...place, ...details };
      }),
    );

    if (placesWithDetails.length > 0) {
      await saveCache(keyword, lat, lon, radius, placesWithDetails);
    }

    return res.json({
      results: placesWithDetails,
      fromCache: false,
      coords: { lat, lon },
    });
  } catch (err) {
    console.error("Search error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
