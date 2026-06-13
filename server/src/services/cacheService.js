import mongoose from "mongoose";
const cacheScheme = new mongoose.Schema({
  keyword: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  radius: { type: Number, required: true },
  results: { type: Array, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const searchCache = mongoose.model("SearchCache", cacheScheme);

export async function getCached(keyword, lat, lon, radius) {
  const entry = await searchCache.findOne({
    keyword: keyword.toLowerCase().trim(),
    lat: Math.round(lat * 1000) / 1000,
    lon: Math.round(lon * 1000) / 1000,
    radius,
  });
  return entry ? entry.results : null;
}

export async function saveCache(keyword, lat, lon, radius, results) {
  await searchCache.create({
    keyword: keyword.toLowerCase().trim(),
    lat: Math.round(lat * 1000) / 1000,
    lon: Math.round(lon * 1000) / 1000,
    radius,
    results,
  });
}
