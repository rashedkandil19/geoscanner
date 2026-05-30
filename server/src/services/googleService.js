export async function geocode(location) {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_API_KEY}`;
  const r = await fetch(url);
  const d = await r.json();
  if (!d.results || !d.results.length) {
    throw new Error("Location not found.");
  }
  const result = d.results[0];
  return {
    lat: result.geometry.location.lat,
    lon: result.geometry.location.lng,
    display: result.formatted_address,
  };
}

export async function searchGooglePlaces(lat, lon, radiusM, keyword) {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radiusM}&keyword=${encodeURIComponent(keyword)}&key=${GOOGLE_API_KEY}`;
  const r = await fetch(url);
  if (!r.ok) {
    throw new Error("Google Places API error");
  }
  const d = await r.json();
  return d.results || [];
}
