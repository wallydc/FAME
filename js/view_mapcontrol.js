// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com

if (typeof ACCESS_TOKEN !== 'undefined' && ACCESS_TOKEN) {
  mapboxgl.accessToken = ACCESS_TOKEN;
} else {
  console.warn('ACCESS_TOKEN is not defined');
}
window.addEventListener("load", () => {
  if (typeof ACCESS_TOKEN !== 'undefined' && ACCESS_TOKEN && typeof MapboxGeocoder !== 'undefined') {
    const geocoder = new MapboxGeocoder();
    geocoder.accessToken = ACCESS_TOKEN;
    geocoder.options = {
      proximity: [122.3464996, 12.8567958],
    };
    geocoder.marker = true;
    geocoder.mapboxgl = mapboxgl;
  }
});

// Your Parse server url and headers
const DRAW_API_URL = (typeof BASE_URL !== 'undefined' && BASE_URL) ? `${BASE_URL}1/classes/Draw` : '';
const DEV_API_URL = (typeof BASE_URL !== 'undefined' && BASE_URL) ? `${BASE_URL}1/classes/Devices` : '';

const headers = (typeof APP_ID !== 'undefined' && typeof REST_API_KEY !== 'undefined') ? {
  "X-Parse-Application-Id": APP_ID,
  "X-Parse-REST-API-Key": REST_API_KEY,
  "Content-Type": "application/json",
} : {};

// -----

// -----

let popup = null;
let popupInfo = null;
let popuppathpointsInfo = null;
let popuppathlineInfo = null;
let markerInfo = null;

let mymarker = [];

// state
let currentVessel = null;
let currentGeo = null; // { line, pointsCollection }

// -----

const closeBtn = document.createElement("button");

// Handle close button
closeBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearBtn.style.display = "none";
  suggestionsBox.innerHTML = "";
  
  // Reset the arrow direction
  dropdownBtn.classList.remove("rotate");

  if (popupInfo) {
    popupInfo.remove();
    popupInfo = null;
  }
  if (markerInfo) {
    markerInfo.remove();
    markerInfo = null;
  }
  // Reset map to original view
  map.flyTo({
    center: initialView.center,
    zoom: initialView.zoom,
  });
});

// Zoom to device with popup
function zoomToDevice(device) {
  if (!device.longitude || !device.latitude) {
    console.log("No location data for this device.");
    return;
  }
  const coords = [device.longitude, device.latitude];

  // to reset popup
  if (popup && typeof popup.remove === 'function') popup.remove();

  clearPath();

  map.flyTo({
    center: coords,
    zoom: 12,
  });

  // Create popup with close button this for search result
  const popupContent = document.createElement("div");
  popupContent.innerHTML = `
  <div style="font-size:15px;">
  <strong>${device.Name || device.Identifier}</strong><br>
  Model: ${device.Model || "N/A"}<br>
  Status: ${device.Status || "N/A"}<br>
  Group: ${device.Group || "N/A"}<br>
  Created: ${new Date(device.createdAt).toLocaleString() || "N/A"}<br>
  <button style="margin-top:8px;padding:5px 10px;background:#0078ff;color:#fff;border:none;border-radius:5px;cursor:pointer;">
      More
  </button>
  </div>`;

  closeBtn.innerHTML = "&times;";
  closeBtn.className = "popup-close-btn";
  popupContent.appendChild(closeBtn);

  popupInfo = new mapboxgl.Popup({
    offset: -25,
    closeOnClick: false,
    closeButton: true,
  })
    .setDOMContent(popupContent)
    .setLngLat(coords)
    .addTo(map);

}

// Zoom to device with popup
function zoomToGroup(device) {
  if (!device.longitude || !device.latitude) {
    console.log("No location data for this device.");
    return;
  }
  const coords = [device.longitude, device.latitude];

  // to reset popup
  if (popup && typeof popup.remove === 'function') popup.remove();

  clearPath();

  // Create popup with close button this for search result
  const popupContent = document.createElement("div");
  popupContent.innerHTML = `
  <div style="font-size:15px;">
  <strong><h2>${device.Name || device.Identifier}</h2></strong><br>
  <span class="info">Group: ${device.Group || "N/A"}</span><br>
  </div>`;

  closeBtn.innerHTML = "&times;";
  closeBtn.className = "popup-close-btn";
  popupContent.appendChild(closeBtn);

  popupInfo = new mapboxgl.Popup({
    offset: -25,
    closeOnClick: false,
    closeButton: true,
  })
    .setDOMContent(popupContent)
    .setLngLat(coords)
    .addTo(map);

}

// Load Markers
async function loadMarkers() {
  console.log("load JSON");

  // Create the popup
  popup = new mapboxgl.Popup({
    offset: 25,
    closeOnClick: false,
    closeButton: true,
  });

  try {
    const response = await fetch(DEV_API_URL, {
      method: "GET",
      headers: headers,
    });

    const data = await response.json();

    // Loop through using arrow function
    data.results.forEach((item, index) => {
      const lat = item.latitude;
      const lng = item.longitude;
      const Name = item.Name;
      const Model = item.Model;
      const Status = item.Status;

      // Assuming Parse returns an array of GeoJSON Polygon or LineString drawPin:
      const drawPin = {
        objectId: item.objectId,
        Name: item.Name,
        Model: item.Model,
        latitude: item.latitude,
        longitude: item.longitude,
      };

      console.log(drawPin);

      // Marker location and info
      const markerData = {
        coordinates: [lng, lat],
        info: `<br><h3>${Name}</h3><span class="info"><p>${Model}</p></span>`,
      };

      const el = document.createElement("div");
      el.className = "marker ";
      el.id = Status || "Unknown";

      // Add a marker to the map
      mymarker = new mapboxgl.Marker({
        element: el,
      })
        .setLngLat(markerData.coordinates)
        .addTo(map);

      // Use both click and touchstart for mobile compatibility
      el.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent ghost clicks
        openPopup(markerData);
      });

      el.addEventListener("touchstart", (e) => {
        e.stopPropagation(); // Prevent ghost clicks
        openPopup(markerData);
      });

      function openPopup(markerData) {
        popup
          .setLngLat(markerData.coordinates)
          .setHTML(markerData.info)
          .addTo(map);
      }
    });
  } catch (error) {
    console.error("Failed to load data:", error);
  }


}

// -----

// Initial map setup
const initialView = { center: [122.3464996, 12.85679583], zoom: 6.8 };

const map = new mapboxgl.Map({
  container: "map",
  // style: 'mapbox://styles/mapbox-map-design/cm4r19bcm00ao01qvhp3jc2gi',
  style: "mapbox://styles/mapbox/streets-v11",
  center: initialView.center,
  zoom: initialView.zoom,
});

// -----
// Remove the import lines completely

const drawModes = { ...MapboxDraw.modes };
if (typeof CustomCircleMode !== 'undefined') {
  drawModes.draw_circle = CustomCircleMode;
}
const draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {},
  modes: drawModes,
});


map.addControl(draw);

// -----

// -----

function layer_default() {
  let box = document.getElementById("map-controls");
  box.classList.toggle("divexpanded");
}

// Slide functionality
const el_btnlayer = document.getElementById("btnlayer"); if (el_btnlayer) el_btnlayer.addEventListener("click", function () {
  this.classList.toggle("active");
  let box = document.getElementById("map-controls");
  box.classList.toggle("divexpanded");
});

// Zoom in functionality
const el_zoom_in = document.getElementById("zoom-in"); if (el_zoom_in) el_zoom_in.addEventListener("click", function () {
  let currentZoom = map.getZoom();
  map.zoomTo(currentZoom + 1);
});

// Zoom out functionality
const el_zoom_out = document.getElementById("zoom-out"); if (el_zoom_out) el_zoom_out.addEventListener("click", function () {
  let currentZoom = map.getZoom();
  map.zoomTo(currentZoom - 1);
});

// Show location functionality
function showLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = [
          position.coords.longitude,
          position.coords.latitude,
        ];

        // Center map on user location
        map.flyTo({ center: userLocation, zoom: 14 });

        // Add marker for user's location
        new mapboxgl.Marker().setLngLat(userLocation).addTo(map);
      },
      () => {
        alert("Unable to retrieve location");
      },
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Add this line directly underneath your function!
window.showLocation = showLocation;

// Different Layers functionality
document.getElementById("default_btn").addEventListener("click", function () {
  this.classList.add("active");
  document.getElementById("satellite_btn").classList.remove("active");
  document.getElementById("terrain_btn").classList.remove("active");
  document.getElementById("hybrid_btn").classList.remove("active");
  document.getElementById("dark_btn").classList.remove("active");
  document.getElementById("light_btn").classList.remove("active");
  // map.setStyle('mapbox://styles/mapbox/streets-v11');
  // map.setStyle('mapbox://styles/mapbox-map-design/cm4r19bcm00ao01qvhp3jc2gi');
});

document.getElementById("satellite_btn").addEventListener("click", function () {
  this.classList.add("active");
  document.getElementById("default_btn").classList.remove("active");
  document.getElementById("terrain_btn").classList.remove("active");
  document.getElementById("hybrid_btn").classList.remove("active");
  document.getElementById("dark_btn").classList.remove("active");
  document.getElementById("light_btn").classList.remove("active");
  // map.setStyle('mapbox://styles/mapbox/satellite-v9');
});

document.getElementById("terrain_btn").addEventListener("click", function () {
  this.classList.add("active");
  document.getElementById("default_btn").classList.remove("active");
  document.getElementById("satellite_btn").classList.remove("active");
  document.getElementById("hybrid_btn").classList.remove("active");
  document.getElementById("dark_btn").classList.remove("active");
  document.getElementById("light_btn").classList.remove("active");
  // map.setStyle('mapbox://styles/mapbox/outdoors-v11');
});

document.getElementById("hybrid_btn").addEventListener("click", function () {
  this.classList.add("active");
  document.getElementById("default_btn").classList.remove("active");
  document.getElementById("satellite_btn").classList.remove("active");
  document.getElementById("terrain_btn").classList.remove("active");
  document.getElementById("dark_btn").classList.remove("active");
  document.getElementById("light_btn").classList.remove("active");
  // map.setStyle('mapbox://styles/mapbox/satellite-streets-v11');
});

document.getElementById("dark_btn").addEventListener("click", function () {
  this.classList.add("active");
  document.getElementById("default_btn").classList.remove("active");
  document.getElementById("satellite_btn").classList.remove("active");
  document.getElementById("terrain_btn").classList.remove("active");
  document.getElementById("hybrid_btn").classList.remove("active");
  document.getElementById("light_btn").classList.remove("active");
  // map.setStyle('mapbox://styles/mapbox/dark-v10');
});

document.getElementById("light_btn").addEventListener("click", function () {
  this.classList.add("active");
  document.getElementById("default_btn").classList.remove("active");
  document.getElementById("satellite_btn").classList.remove("active");
  document.getElementById("terrain_btn").classList.remove("active");
  document.getElementById("hybrid_btn").classList.remove("active");
  document.getElementById("dark_btn").classList.remove("active");
  // map.setStyle('mapbox://styles/mapbox/light-v10');
});

// -----

// init: try to load parse list (optional)
map.on("load", () => {
  loadMarkers();
  // fetchVesselsFromParse();
  // checkUrlHash();
});