import mongoose from "mongoose";
import { getCached, saveCache } from "../server/src/services/cacheService.js";
import {
  geocode,
  getPlaceDetails,
  searchGooglePlaces,
} from "../server/src/services/googleService.js";

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URL);
  isConnected = true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { keyword, location, radius } = req.body;

  if (!keyword || !location || !radius) {
    return res.status(400).json({
      error: "keyword, location, and radius are required",
    });
  }

  try {
    await connectDB();

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
}
