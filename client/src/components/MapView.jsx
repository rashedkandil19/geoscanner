import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapView({ results, searchCoords }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersLayer = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    const initialLat = searchCoords?.lat || 20;
    const initialLon = searchCoords?.lon || 0;

    map.current = L.map(mapContainer.current).setView(
      [initialLat, initialLon],
      12,
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map.current);

    markersLayer.current = L.layerGroup().addTo(map.current);

    if (searchCoords?.lat && searchCoords?.lon) {
      L.circleMarker([searchCoords.lat, searchCoords.lon], {
        color: "#00d4ff",
        radius: 8,
        fillColor: "#00d4ff",
        fillOpacity: 0.3,
        weight: 2,
      })
        .bindPopup("Search Center")
        .addTo(map.current);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [searchCoords]);

  useEffect(() => {
    if (!map.current || !markersLayer.current || !results.length) return;

    markersLayer.current.clearLayers();

    const categoryColors = {
      restaurant: "#ff6b6b",
      cafe: "#ffd43b",
      hotel: "#748ffc",
      hospital: "#ff922b",
      pharmacy: "#51cf66",
      default: "#00d4ff",
    };

    results.forEach((place, index) => {
      const lat = place.lat;
      const lon = place.lon;

      if (!lat || !lon) return;

      const category = place.category.toLowerCase();
      const color = Object.keys(categoryColors).find((key) =>
        category.includes(key),
      )
        ? categoryColors[category.split(" ")[0].toLowerCase()]
        : categoryColors.default;

      const marker = L.circleMarker([lat, lon], {
        color: color,
        radius: 8,
        fillColor: color,
        fillOpacity: 0.8,
        weight: 2,
      });

      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.name + " " + place.address)}`;

      const popupContent = `
        <div class="map-popup">
          <div class="popup-name">${place.name}</div>
          <div class="popup-category">${place.category.replace(/_/g, " ")}</div>
          <div class="popup-address">📍 ${place.address}</div>
          ${
            place.opening !== "Unknown"
              ? `<div class="popup-status ${place.opening === "Open Now" ? "open" : "closed"}">
                  ${place.opening === "Open Now" ? "🟢 Open Now" : "🔴 Closed"}
                </div>`
              : ""
          }
          <div class="popup-actions">
            <a href="${place.mapUrl}" target="_blank" class="popup-btn">📌 View on Maps</a>
            <a href="${directionsUrl}" target="_blank" class="popup-btn directions">🧭 Get Directions</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(markersLayer.current);

      const label = L.divIcon({
        className: "marker-label",
        html: `<div class="marker-number">${index + 1}</div>`,
        iconSize: [30, 30],
      });

      L.marker([lat, lon], { icon: label, interactive: false }).addTo(
        markersLayer.current,
      );
    });

    if (results.length > 0) {
      const group = new L.featureGroup([...markersLayer.current.getLayers()]);
      if (group.getBounds().isValid()) {
        map.current.fitBounds(group.getBounds(), { padding: [50, 50] });
      }
    }
  }, [results]);

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map-view" />
      {results.length > 0 && (
        <div className="map-legend">
          <div className="legend-title">Results: {results.length}</div>
          <div className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: "#00d4ff" }}
            />
            Search Center
          </div>
        </div>
      )}
    </div>
  );
}
