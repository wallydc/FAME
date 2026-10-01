// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com

mapboxgl.accessToken = ACCESS_TOKEN;
window.addEventListener("load", () => {
  const geocoder = new MapboxGeocoder();
  geocoder.accessToken = ACCESS_TOKEN;
  geocoder.options = {
    proximity: [122.3464996, 12.8567958],
  };
  geocoder.marker = true;
  geocoder.mapboxgl = mapboxgl;
  // map.addControl(geocoder);
});

// Your Parse server url and headers
const DRAW_API_URL = `${BASE_URL}1/classes/Draw`;
const DEV_API_URL = `${BASE_URL}1/classes/Devices`;

const headers = {
  "X-Parse-Application-Id": APP_ID,
  "X-Parse-REST-API-Key": REST_API_KEY,
  "Content-Type": "application/json", // Tells the server you're sending JSON
};

// -----

// ==== ELEMENTS ====
const locModal = document.getElementById("groupModal");
const searchGroup = document.getElementById("groupSearch");
const listContainer = document.getElementById("listContainer");
const closeModalBtn = document.getElementById("closeLocModal");

// Optional: button that opens the modal
const openModalBtn = document.getElementById("openLocModal"); // create this in HTML

// ==== OPEN MODAL ====
function openLocModal() {
  locModal.style.display = "flex";
  searchGroup.focus();

  sessionStorage.setItem("locClicked", false);

  // Fetch groups only once
  fetchGroupDevices();

  closeBtn.click();
  hideMarkers();

  // to reset popup
  popup.remove();
}

// ==== CLOSE MODAL ====
function closeLocModal() {
  locModal.style.display = "none";
  searchGroup.value = "";
  listContainer.innerHTML = "";

  sessionStorage.setItem("locClicked", true);
  $("#loc").removeClass("active");
  $(".fa-location-dot").removeClass("activecontrol");
  showMarkers();
}

// ==== FETCH GROUPS FROM PARSE ====
async function fetchGroupDevices(keyword = "") {
  listContainer.innerHTML = "Loading...";

  let url = DEV_API_URL;

  if (keyword) {
    const where = encodeURIComponent(
      JSON.stringify({
        Group: {
          $regex: keyword,
          $options: "i", // case-insensitive
        },
      }),
    );
    url += `?where=${where}`;
  }

  try {
    const res = await fetch(url, {
      headers: headers,
    });

    const data = await res.json();
    renderList(data.results || []);
  } catch (e) {
    listContainer.innerHTML = "Error loading results";
  }
}

function renderList(items) {
  listContainer.innerHTML = "";

  if (!items.length) {
    listContainer.innerHTML = "No results";
    return;
  }

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
        <strong>Group : ${item.Group}</strong><br/>
        <small>(${item.Name})</small>
      `;

    div.onclick = () => {
      locModal.classList.remove("open");

      if (item.longitude && item.latitude) {
        map.flyTo({
          center: [item.longitude, item.latitude],
          zoom: 12,
        });

        new mapboxgl.Marker()
          .setLngLat([item.longitude, item.latitude])
          // .addTo(map);

        showMarkers();
        sessionStorage.setItem("locClicked", true);
        zoomToGroup(item);
        closeLocModal();
      }
    };

    listContainer.appendChild(div);
  });
}

/* ---------------- SEARCH (AUTO FILTER) ---------------- */
let debounceTimer;

searchGroup.addEventListener("input", () => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    fetchGroupDevices(searchGroup.value.trim());
  }, 400);
});

closeModalBtn.addEventListener("click", closeLocModal);

// Optional open button
if (openModalBtn) {
  openModalBtn.addEventListener("click", openLocModal);
}

// -----

const clearBtn = document.getElementById("clear-btn");
const searchInput = document.getElementById("search-input");
const suggestionsBox = document.getElementById("suggestions");

function closeDropdown() {
    suggestionsBox.innerHTML = "";
    dropdownBtn.classList.remove("rotate");
}

// Show/hide clear button
searchInput.addEventListener("input", () => {
  clearBtn.style.display = searchInput.value ? "inline" : "none";
  if (searchInput.value) {
    fetchSuggestions(searchInput.value);
    // Optional: Reset arrow because this is a filtered search, not the "All" list
    dropdownBtn.classList.remove("rotate");
  } else {
    suggestionsBox.innerHTML = "";
  }
});

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearBtn.style.display = "none";
  closeDropdown();
  suggestionsBox.innerHTML = "";
});

// Fetch suggestions from Parse REST API
async function fetchSuggestions(query) {
  try {
    const response = await fetch(
      DEV_API_URL +
        "?where=" +
        encodeURIComponent(
          JSON.stringify({
            $or: [
              { Name: { $regex: query, $options: "i" } },
              { Model: { $regex: query, $options: "i" } },
              { Status: { $regex: query, $options: "i" } },
              { Group: { $regex: query, $options: "i" } },
              { Identifier: { $regex: query, $options: "i" } },
              { createdAt: { $regex: query, $options: "i" } },
              { objectId: { $regex: query, $options: "i" } },
            ],
          }),
        ),
      {
        headers: headers,
      },
    );

    const data = await response.json();
    showSuggestions(data.results || []);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
  }
}

// THIS FUNCTION TO SHOW SUGGESTIONS FROM SEARCH
// Show suggestions
function showSuggestions(results) {
  suggestionsBox.innerHTML = "";
  results.forEach((item) => {
    const div = document.createElement("div");
    div.className = "suggestion";

    // const div = document.createElement("div");
    // div.textContent = `${item.Name || item.Identifier || "Unnamed"} (${item.Model || "Unknown"})`;
    const date = new Date(item.createdAt);
    const formatted =
      date.toLocaleDateString() + " " + date.toLocaleTimeString();

    const left = document.createElement("div");

    // left.style.flex = '1';
    left.style.display = "flex";
    left.style.flexWrap = "wrap";
    left.style.flexDirection = "column";

    left.innerHTML = `<div><span style="font-size: 14px; font-weight:800; color:#555">${item.Name}</span> </div>
    <div>Status :<span style="font-weight:400; color:#555">${item.Status}</span> </div>
    <div><span style="font-weight:400; color:#555">${formatted}</span> </div>`;

    const right = document.createElement("div");
    right.style.textAlign = "right";
    right.style.minWidth = "40%";
    right.innerHTML = `<div class="meta"><span>${item.objectId}</span> </div>
    <div class="meta">Group :<span>${item.Group}</span> </div>`;

    div.appendChild(left);
    div.appendChild(right);

    /* div.addEventListener("click", () => {
      suggestionsBox.innerHTML = "";
      searchInput.value = item.Name || item.Identifier;
      clearBtn.style.display = "inline";
      zoomToDevice(item);
    }); */

    // In your showSuggestions function when an item is clicked:
    div.addEventListener("click", () => {
      suggestionsBox.innerHTML = "";
      searchInput.value = item.Name || item.Identifier;
      clearBtn.style.display = "inline";
      closeDropdown(); // Arrow resets here too!
      zoomToDevice(item);
    });

    suggestionsBox.appendChild(div);
  });
}

const dropdownBtn = document.getElementById("dropdown-btn");

// Toggle dropdown showing all items
dropdownBtn.addEventListener("click", () => {
  // Toggle the rotation class
  dropdownBtn.classList.toggle("rotate");

  if (suggestionsBox.innerHTML !== "") {
    suggestionsBox.innerHTML = "";
    // Optional: Ensure class is removed if manually closed
    dropdownBtn.classList.remove("rotate");
  } else {
    fetchAllDevices();
  }
});

// Also, update your 'click outside' listener to reset the arrow
document.addEventListener("click", (e) => {
  if (!e.target.closest(".searchbox")) {
    suggestionsBox.innerHTML = "";
    dropdownBtn.classList.remove("rotate"); // Reset arrow direction
  }
});

// Fetch ALL devices from Parse REST API
async function fetchAllDevices() {
  try {
    // No "where" clause or an empty one to get all records
    const response = await fetch(DEV_API_URL, {
      headers: headers,
    });

    const data = await response.json();
    // Reuse your existing showSuggestions function to render the UI
    showSuggestions(data.results || []);
  } catch (err) {
    console.error("Error fetching all devices:", err);
  }
}

// Optional: Close dropdown if user clicks outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".searchbox")) {
    suggestionsBox.innerHTML = "";
  }
});

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
  popup.remove();

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

  /* new mapboxgl.Popup()
  .setLngLat(coords)
  .setHTML(popupContent)
  .addTo(map); */
}

// Zoom to device with popup
function zoomToGroup(device) {
  if (!device.longitude || !device.latitude) {
    console.log("No location data for this device.");
    return;
  }
  const coords = [device.longitude, device.latitude];

  // to reset popup
  popup.remove();

  clearPath();

/*   map.flyTo({
    center: coords,
    zoom: 12,
  }); */

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

loadMarkers();

// -----
// THIS FOR THE CARDS WITH LEFT AND RIGHT ARROWS
// Fetch Data
// async function fetchData() {
//   try {
//     const response = await fetch(DEV_API_URL, {
//       method: "GET",
//       headers: headers,
//     });

//     const data = await response.json();
//     renderCards(data);
//   } catch (error) {
//     console.error("Failed to load data:", error);
//   }
// }

// const scrollWrapper = document.getElementById("findnames");
// const leftBtn = document.getElementById("leftBtn");
// const rightBtn = document.getElementById("rightBtn");

// scrollWrapper.innerHTML = ""; // Clear old items

// function renderCards(data) {
//   data.results.forEach((item) => {
//     const card = document.createElement("div");
//     card.className = "card2 gp_box line_" + item.Status;

//     card.innerHTML = `
//       <div class=hoveffect" style="float: left; margin: 10px; display: flex;">
//           <img src="uploaded_images/${item.Photo}.jpeg" class="photo"/>
//       </div>
//       <div class="">${item.Name}</div>
//       <div class="${item.Status} user_online" style="display: flex; margin: 10px;"></div>
//     `;

//     // card.textContent = item.Name;
//     scrollWrapper.appendChild(card);
//   });

//   updateArrows();
// }

// function scrollGoLeft() {
//   scrollWrapper.scrollBy({ left: -300, behavior: "smooth" });
// }

// function scrollGoRight() {
//   scrollWrapper.scrollBy({ left: 300, behavior: "smooth" });
// }

// function updateArrows() {
//   const containerWidth = scrollWrapper.clientWidth;
//   const contentWidth = scrollWrapper.scrollWidth;
//   const scrollLeftPos = scrollWrapper.scrollLeft;

//   if (contentWidth <= containerWidth) {
//     leftBtn.classList.add("hidden");
//     rightBtn.classList.add("hidden");
//   } else {
//     leftBtn.classList.toggle("hidden", scrollLeftPos === 0);
//     rightBtn.classList.toggle(
//       "hidden",
//       scrollLeftPos + containerWidth >= contentWidth - 5,
//     );
//   }
// }

// leftBtn.addEventListener("click", () => {
//   scrollGoLeft();
//   setTimeout(updateArrows, 400);
// });

// rightBtn.addEventListener("click", () => {
//   scrollGoRight();
//   setTimeout(updateArrows, 400);
// });

// scrollWrapper.addEventListener("scroll", updateArrows);
// window.addEventListener("resize", updateArrows);

// Initialize
// fetchData();

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

const draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {},
  modes: {
    ...MapboxDraw.modes,
    draw_circle: CustomCircleMode, // Registers your local plugin directly
  },
});


// map.addControl(draw);
// -----

// const draw = new MapboxDraw({
//   displayControlsDefault: false,
//   controls: {
    // line_string: true,
    // polygon: true,
    // trash: true
  // },
  // Add these custom modes to enable circle drawing
  /* modes: {
    ...MapboxDraw.modes,
    draw_circle: MapboxCircleDraw.Mode,
    direct_select: MapboxCircleDraw.DirectSelectMode,
    simple_select: MapboxCircleDraw.SimpleSelectMode,
  }, */
// });

map.addControl(draw);
sessionStorage.setItem("editMode", true);
sessionStorage.setItem("trackClicked", true);
sessionStorage.setItem("locClicked", true);

// FUNCTION FOR HIDE AND SHOW MARKERS
function showMarkers() {
  const elements = document.querySelectorAll(".marker");
  for (const element of elements) {
    element.style.zIndex = "0"; // Set the desired z-index value
  }
  console.log("Z-index of all elements with 'marker' set to 0.");
}

function hideMarkers() {
  const elements = document.querySelectorAll(".marker");
  for (const element of elements) {
    element.style.zIndex = "-1"; // Set the desired z-index value
  }
  console.log("Z-index of all elements with 'marker' set to -1.");
}
// -----

function checkLoc() {
  let locstatus = JSON.parse(sessionStorage.getItem("locClicked"));
  console.log(locstatus ? "Location is true" : "Location is false");
  (locstatus ? openLocModal : closeLocModal)(); // Simplified if/else
}

function checkTracked() {
  let trckstatus = JSON.parse(sessionStorage.getItem("trackClicked"));
  console.log(trckstatus ? "Track is true" : "Track is false");
  (trckstatus ? openModal : hideModal)(); // Simplified if/else
}

document.getElementById("location").addEventListener("click", function () {
  $("#loc").toggleClass("active");
  $("#trk").removeClass("active");
  $("#rte").removeClass("active");
  $("#geo").removeClass("active");

  $(".fa-location-dot").toggleClass("activecontrol");
  $(".fa-ship").removeClass("activecontrol");
  $(".fa-route").removeClass("activecontrol");
  $(".fa-street-view").removeClass("activecontrol");

  $(".forgeofenceControls").removeClass("geofenceControls");
  $(".forrouteControls").removeClass("geofenceControls");

  // Hide the modal
  $("#modalBackdrop").hide();

  showMarkers();
  sessionStorage.setItem("trackClicked", true);
  
  checkActiveStatus();
  checkIfAllInactive();

  // if (currentGeo) {
    clearPath();
    fitInitialView();
  // } else {
    checkLoc();
  // }


});

document.getElementById("track").addEventListener("click", function () {
  $("#loc").removeClass("active");
  $("#trk").toggleClass("active");
  $("#rte").removeClass("active");
  $("#geo").removeClass("active");

  $(".fa-location-dot").removeClass("activecontrol");
  $(".fa-ship").toggleClass("activecontrol");
  $(".fa-route").removeClass("activecontrol");
  $(".fa-street-view").removeClass("activecontrol");

  $(".forgeofenceControls").removeClass("geofenceControls");
  $(".forrouteControls").removeClass("geofenceControls");

  // Show the modal
  /*   if (!$("#trk").hasClass("active")) {
    $("#modalBackdrop").show();
  } */

  // Hide the modal
  $("#groupModal").hide();
  
  
  if (currentGeo) {
    clearPath();
    fitInitialView();
    $("#trk").removeClass("active");
    $(".fa-ship").removeClass("activecontrol");
  } else {
    checkTracked();
  }

  sessionStorage.setItem("locClicked", true);
  checkActiveStatus();
  checkIfAllInactive();

});

document.getElementById("route").addEventListener("click", function () {
  $("#loc").removeClass("active");
  $("#trk").removeClass("active");
  $("#rte").toggleClass("active");
  $("#geo").removeClass("active");

  $(".fa-location-dot").removeClass("activecontrol");
  $(".fa-ship").removeClass("activecontrol");
  $(".fa-route").toggleClass("activecontrol");
  $(".fa-street-view").removeClass("activecontrol");

  console.log("Test draw route");
  sessionStorage.setItem("drawMode", "LineString");
  $(".forgeofenceControls").removeClass("geofenceControls");
  $(".forrouteControls").toggleClass("geofenceControls");

  // Hide the modal
  $("#modalBackdrop").hide();
  $("#groupModal").hide();

  showMarkers();
  sessionStorage.setItem("trackClicked", true);

  if (currentGeo) {
    clearPath();
  }
  fitInitialView();

  sessionStorage.setItem("locClicked", true);
  checkActiveStatus();
  checkIfAllInactive();
});

document.getElementById("geofence").addEventListener("click", function () {
  $("#loc").removeClass("active");
  $("#trk").removeClass("active");
  $("#rte").removeClass("active");
  $("#geo").toggleClass("active");

  $(".fa-location-dot").removeClass("activecontrol");
  $(".fa-ship").removeClass("activecontrol");
  $(".fa-route").removeClass("activecontrol");
  $(".fa-street-view").toggleClass("activecontrol");

  console.log("Test draw polygon");
  sessionStorage.setItem("drawMode", "Polygon");
  $(".forgeofenceControls").toggleClass("geofenceControls");
  $(".forrouteControls").removeClass("geofenceControls");

  // Hide the modal
  $("#modalBackdrop").hide();
  $("#groupModal").hide();

  showMarkers();
  sessionStorage.setItem("trackClicked", true);

  if (currentGeo) {
    clearPath();
  }
  fitInitialView();

  sessionStorage.setItem("locClicked", true);
  checkActiveStatus();
  checkIfAllInactive();
});

// checking the status if active
function checkActiveStatus() {
  const listItems = document.querySelectorAll("#itemList li");

  map.removeControl(draw);

  listItems.forEach((li, index) => {
    const div = li.querySelector("div");
    const isActive = div.classList.contains("active");

    // Use switch statement based on isActive
    switch (isActive) {
      case true:
        console.log(`Item ${index + 1} is ACTIVE`);
        map.addControl(draw);
        break;
      case false:
        console.log(`Item ${index + 1} is NOT active`);

        break;
      default:
        console.log(`Item ${index + 1} status unknown`);
    }
  });
}

// checking the status if all not active
const items = document.querySelectorAll(".topline");
function checkIfAllInactive() {
  const allInactive = [...items].every(
    (item) => !item.classList.contains("active"),
  );
  console.log(allInactive);
  if (allInactive === true) {
    sessionStorage.removeItem("drawMode");
    console.log("All items are inactive");
    map.addControl(draw);
    // sessionStorage.setItem('editMode', false);
    // drawloadMode();
    resetloadMode();
  } else {
    console.log("Some items are active");
  }
}

// Add this line directly underneath your function!
window.checkIfAllInactive = checkIfAllInactive;


sessionStorage.setItem("reset", false);
// let isDrawControlAdded = false;
let isDrawControlAdded = JSON.parse(sessionStorage.getItem("reset"));

function polygonDraw() {
  console.log("test ko yun click");

  const box = document.getElementById("geo");
  if (box.classList.contains("active")) {
    alert("The box is active!");
    map.addControl(draw);
  } else {
    alert("The box is NOT active!");
    map.removeControl(draw);
  }
}

function togglepolygonDraw() {
  if (isDrawControlAdded) {
    map.removeControl(draw);
    // this.textContent = 'Show Draw Control';
  } else {
    map.addControl(draw);
    // this.textContent = 'Hide Draw Control';
  }
  isDrawControlAdded = !isDrawControlAdded;

  if (map.getLayer("my-layer")) {
    map.removeLayer("my-layer");
  }
}

function togglerouteDraw() {
  if (isDrawControlAdded) {
    map.removeControl(draw);
    // this.textContent = 'Show Draw Control';
  } else {
    map.addControl(draw);
    // this.textContent = 'Hide Draw Control';
  }
  isDrawControlAdded = !isDrawControlAdded;

  if (map.getLayer("my-layer")) {
    map.removeLayer("my-layer");
  }
}

function enableLine() {
  draw.changeMode("draw_line_string");
}
// Add this line directly underneath your function!
window.enableLine = enableLine;

// -----

// -----

function enableDrawCircle() {
  console.log("Draw Mode: Circle");

  sessionStorage.setItem("drawMode", "Polygon");

  draw.changeMode("draw_circle");
}

// Add this line directly underneath your function!
window.enableDrawCircle = enableDrawCircle;

// Keep your existing function, but ensure it updates the drawMode
function enableDraw() {
  console.log("Draw Mode: Polygon");
  sessionStorage.setItem("drawMode", "Polygon");
  draw.changeMode("draw_polygon");
}

// Add this line directly underneath your function!
window.enableDraw = enableDraw;

function changeStyle(style) {
  map.setStyle(style);
}
// Add this line directly underneath your function!
window.changeStyle = changeStyle;


let selectedFeature = null;

function checkStatus() {
  let status = JSON.parse(sessionStorage.getItem("editMode"));
  console.log(status ? "Status is true" : "Status is false");
  (status ? drawTrash : trashDraw)(); // Simplified if/else
}

// Add this line directly underneath your function!
window.checkStatus = checkStatus;

function trashDraw() {
  if (!selectedFeature) {
    alert("No feature has been selected for deletion.");
    return;
  }

  const objectId = selectedFeature.properties.objectId;
  const getType = selectedFeature.geometry.type;
  const confirmDelete = confirm(
    `Are you sure you want to delete the ${getType} with ID: ${objectId}?`,
  );

  if (!confirmDelete)
    if (confirmDelete === false) {
      alert(getType + " deletion has been canceled");
      return;
    }

  fetch(DRAW_API_URL + "/" + objectId, {
    method: "DELETE",
    headers: headers,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if (!response.ok) {
        throw new Error("Failed to delete");
      }
      return response.json(); // Parse response JSON
    })
    .then((result) => {
      // Remove from map source
      draw.trash();
      alert("Feature deleted successfully.");
      selectedFeature = null;
    })
    .catch((err) => {
      alert("Error deleting feature: " + err.message);
    });
}

function drawTrash() {
  if (!selectedFeature) {
    alert("No feature has been selected for deletion.");
    return;
  }
  draw.trash();
  selectedFeature = null;
}

function resetDraw() {
  draw.deleteAll();
}

// Add this line directly underneath your function!
window.resetDraw = resetDraw;

function saveGeoJSON() {
  const userId = localStorage.getItem("UserObjectId");
  const geojson = draw.getAll();
  console.log(geojson);

  const getLength = geojson.features.length;

  if (getLength <= 0) {
    alert("Kindly draw first!");
  }

  for (let i = 0; i < geojson.features.length; i++) {
    let id = geojson.features[i].id;
    let type = geojson.features[i].type;
    let properties = geojson.features[i].properties;
    let geometry = geojson.features[i].geometry;

    const lastIndex = geojson.features.length - 1;
    console.log(id);
    console.log(type);
    console.log(properties);
    console.log(geometry);
    console.log("last index " + lastIndex);

    // Sample data you want to send
    const data = {
      ObjId: userId,
      id: id,
      type: type,
      properties: JSON.stringify(properties),
      geometry: JSON.stringify(geometry),
    };

    console.log(data);
    // Send POST request

    fetch(DRAW_API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse response JSON
      })
      .then((result) => {
        console.log("Data saved successfully:", result);
        if (i == lastIndex) {
          alert("Data saved successfully:");
        }
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        // alert('Failed to save data');
      });
  }
}

// Add this line directly underneath your function!
window.saveGeoJSON = saveGeoJSON;

// -----

// -----
// let isEditMode = false;
function drawloadMode() {
  // FIX 1: Safely check for string representation "true"
  let isEditMode = sessionStorage.getItem("editMode") === "true";

  const SavePoly = document.getElementById("btnSavePoly");
  const SaveLine = document.getElementById("btnSaveLine");

  // FIX 2: Remember this is a collection array
  const spanElement = document.getElementsByClassName("tooltip");

  const iconeditpoly = document.getElementById("editpolyIcon");
  const iconeditline = document.getElementById("editlineIcon");

  const circleBtn = document.getElementById("btnCircle");
  const polyBtn = document.getElementById("btnPolygon");
  const lineBtn = document.getElementById("btnLine");
  const ResetPoly = document.getElementById("btnResetPoly");
  const ResetLine = document.getElementById("btnResetLine");

  const iconCircle = document.getElementById("iconCircle");
  const iconPoly = document.getElementById("iconPoly");
  const iconLine = document.getElementById("iconLine");
  const iconResetPoly = document.getElementById("iconPolyreset");
  const iconResetLine = document.getElementById("iconLinereset");

  if (isEditMode) {
    // FIX 2: Access your array elements using indexes instead of mutating the collection object
    if (spanElement.length > 9) {
      spanElement[4].innerHTML = "Back";
      spanElement[9].innerHTML = "Back";
    }

    // FIX 1: Explicitly save as a string
    sessionStorage.setItem("editMode", "false");

    SavePoly.disabled = true;
    SaveLine.disabled = true;
    circleBtn.disabled = true;
    polyBtn.disabled = true;
    lineBtn.disabled = true;
    ResetPoly.disabled = true;
    ResetLine.disabled = true;

    if (typeof checkActiveStatus === "function") checkActiveStatus();
    if (typeof checkIfAllInactive === "function") checkIfAllInactive();

    iconCircle.classList.add("disabled-icon");
    iconPoly.classList.add("disabled-icon");
    iconLine.classList.add("disabled-icon");
    iconeditpoly.classList.add("disabled-icon");
    iconeditline.classList.add("disabled-icon");
    iconResetPoly.classList.add("disabled-icon");
    iconResetLine.classList.add("disabled-icon");

    // Execution path is now safe to run!
    jsonLoad();
  } else {
    // FIX 2: Access array elements cleanly
    if (spanElement.length > 9) {
      spanElement[4].innerHTML = "Save JSON";
      spanElement[9].innerHTML = "Save JSON";
    }

    // FIX 1: Explicitly save as a string
    sessionStorage.setItem("editMode", "true");

    SavePoly.disabled = false;
    SaveLine.disabled = false;
    circleBtn.disabled = false;
    polyBtn.disabled = false;
    lineBtn.disabled = false;
    ResetPoly.disabled = false;
    ResetLine.disabled = false;

    if (typeof checkActiveStatus === "function") checkActiveStatus();
    if (typeof checkIfAllInactive === "function") checkIfAllInactive();

    iconCircle.classList.remove("disabled-icon");
    iconPoly.classList.remove("disabled-icon");
    iconLine.classList.remove("disabled-icon");
    iconeditpoly.classList.remove("disabled-icon");
    iconeditline.classList.remove("disabled-icon");
    iconResetPoly.classList.remove("disabled-icon");
    iconResetLine.classList.remove("disabled-icon");

    jsonUnload();
  }
}

async function jsonLoad() {
  console.log("load JSON triggered cleanly");

  let mydrawMode = sessionStorage.getItem("drawMode");
  // FIX 3: Convert to standard lowercase format to stay safe against typos
  const targetMode = mydrawMode ? mydrawMode.toLowerCase() : "";

  try {
    const response = await fetch(DRAW_API_URL, {
      method: "GET",
      headers: headers,
    });

    const data = await response.json();

    if (!data.results) {
      console.warn("No results key found inside API response object.");
      return;
    }

    data.results.forEach((item, index) => {
      let parsedGeometry;
      try {
        parsedGeometry =
          typeof item.geometry === "string"
            ? JSON.parse(item.geometry)
            : item.geometry;
      } catch (e) {
        console.error(
          "Failed parsing coordinate geometry string on index:",
          index,
          e,
        );
        return;
      }

      const drawFeature = {
        id: item.id || item.objectId, // Mapbox Draw expects unique feature identifiers
        type: "Feature",
        properties: {
          objectId: item.objectId,
          ...item.properties,
        },
        geometry: parsedGeometry,
      };

      // FIX 3: Force lowercase check match mapping evaluation
      let drawMode = drawFeature.geometry.type.toLowerCase();

      if (targetMode === drawMode) {
        draw.add(drawFeature);
        console.log("Rendered shape layer successfully:", drawFeature.id);
      }
    });
  } catch (error) {
    console.error("Failed to load Polygon or LineString:", error);
  }
}

function jsonUnload() {
  console.log("unload JSON triggered");
  if (typeof draw !== "undefined") {
    draw.deleteAll(); // Wipe map clean upon interface unloading toggle
  }
}

window.jsonLoad = jsonLoad;
window.jsonUnload = jsonUnload;

// Add this line directly underneath your function!
window.drawloadMode = drawloadMode;

function resetloadMode() {
  sessionStorage.setItem("editMode", true);
  // const toggleiconBtnBtn = document.getElementById('btnSave');
  const SavePoly = document.getElementById("btnSavePoly");
  const SaveLine = document.getElementById("btnSaveLine");
  // const icon = toggleiconBtnBtn.querySelector('i');
  const spanElement = document.getElementsByClassName("tooltip");

  const iconeditpoly = document.getElementById("editpolyIcon");
  const iconeditline = document.getElementById("editlineIcon");

  const circleBtn = document.getElementById("btnCircle");
  const polyBtn = document.getElementById("btnPolygon");
  const lineBtn = document.getElementById("btnLine");
  const ResetPoly = document.getElementById("btnResetPoly");
  const ResetLine = document.getElementById("btnResetLine");

  const iconCircle = document.getElementById("iconCircle");
  const iconPoly = document.getElementById("iconPoly");
  const iconLine = document.getElementById("iconLine");
  const iconResetPoly = document.getElementById("iconPolyreset");
  const iconResetLine = document.getElementById("iconLinereset");

  // Toggle the enabled state
  // toggleiconBtnBtn.disabled = false;
  SavePoly.disabled = false;
  SaveLine.disabled = false;
  circleBtn.disabled = false;
  polyBtn.disabled = false;
  lineBtn.disabled = false;
  ResetPoly.disabled = false;
  ResetLine.disabled = false;
  iconResetPoly.disabled = false;
  iconResetLine.disabled = false;

  // Update to save mode
  // icon.className = 'fas fa-save';

  // Change the entire class name
  // iconeditpoly.className = 'fas fa-save';
  // iconeditline.className = 'fas fa-save';

  // Simplified with ternary operator
  // spanElement.textContent = 'Save JSON';
  // spanElement[3].innerHTML = spanElement.textContent;
  spanElement.textContent = "Load JSON";
  spanElement[4].innerHTML = spanElement.textContent;

  iconCircle.classList.remove("disabled-icon");
  iconPoly.classList.remove("disabled-icon");
  iconLine.classList.remove("disabled-icon");
  iconeditpoly.classList.remove("disabled-icon");
  iconeditline.classList.remove("disabled-icon");
  iconResetPoly.classList.remove("disabled-icon");
  iconResetLine.classList.remove("disabled-icon");
}

// Add this line directly underneath your function!
window.resetloadMode = resetloadMode;

map.on("draw.selectionchange", (e) => {
  const feature = e.features[0];
  selectedFeature = feature;
  if (feature) {
    console.log("Selected:", feature);
  }

  if (feature != undefined) {
    console.log(feature.id);
    console.log(feature.properties.objectId);
  }
});

/* map.on("draw.selectionchange", (e) => {
  const feature = e.features[0];

  if (!feature) return;

  draw.changeMode("simple_select", {
    featureIds: [feature.id],
  });
}); */

map.on("draw.update", async (e) => {
  const updatedFeature = e.features[0];
  const objectId = updatedFeature.properties.objectId;

  if (!objectId) return;

  await updateFeatureOnParse(objectId, updatedFeature);
});

async function updateFeatureOnParse(objectId, updatedFeature) {
  // Sample data you want to send
  const data = {
    geometry: JSON.stringify(updatedFeature.geometry),
  };

  console.log(data);
  const response = await fetch(DRAW_API_URL + "/" + objectId, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(data),
  });

  const result = await response.json();
  console.log("Update result:", result);
}

function handleAction() {
  let isEditMode = JSON.parse(sessionStorage.getItem("editMode"));
  (isEditMode ? save : edit)(); // Simplified if/else
}
// Add this line directly underneath your function!
window.handleAction = handleAction;


function save() {
  // alert('Saving...');
  saveGeoJSON();
}

function edit() {
  alert("Editing...");
}
// -----

function layer_default() {
  let box = document.getElementById("map-controls");
  box.classList.toggle("divexpanded");
}

// Slide functionality
document.getElementById("btnlayer").addEventListener("click", function () {
  this.classList.toggle("active");
  let box = document.getElementById("map-controls");
  box.classList.toggle("divexpanded");
});

/* function toggleWidth() {
      let box = document.getElementById("map-controls");
      box.classList.toggle("divexpanded");
    } */

// Zoom in functionality
document.getElementById("zoom-in").addEventListener("click", function () {
  let currentZoom = map.getZoom();
  map.zoomTo(currentZoom + 1);
});

// Zoom out functionality
document.getElementById("zoom-out").addEventListener("click", function () {
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

// Dummy sample vessels with tracks (lat, lng, datetime)
const LOCAL_VESSELS = [];

// UI refs
const modalBackdrop = document.getElementById("modalBackdrop");
// const openModalBtn = document.getElementById("trackBtn");
const closeModal = document.getElementById("closeModal");
const vesselSearch = document.getElementById("vesselSearch");
const suggestionsEl = document.getElementById("track_suggestions");
// const useSampleBtn = document.getElementById("useSampleBtn");
const toast = document.getElementById("toast");

// modal helpers
function openModal() {
  modalBackdrop.style.display = "flex";
  vesselSearch.value = "";
  renderSuggestions(LOCAL_VESSELS);
  vesselSearch.focus();
  sessionStorage.setItem("trackClicked", false);

  closeBtn.click();
  hideMarkers();

  // to reset popup
  popup.remove();
}

function hideModal() {
  modalBackdrop.style.display = "none";
  sessionStorage.setItem("trackClicked", true);
  $("#trk").removeClass("active");
  $(".fa-ship").removeClass("activecontrol");
  showMarkers();
}

closeModal.addEventListener("click", hideModal);
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) hideModal();
});

// render suggestion list
function renderSuggestions(arr) {
  console.log(arr);
  suggestionsEl.innerHTML = "";
  if (!arr || arr.length === 0) {
    suggestionsEl.innerHTML =
      '<div style="padding:12px" class="muted">No results</div>';
    return;
  }
  arr.forEach((v) => {
    const d = document.createElement("div");
    d.className = "track_suggestion-item";
    d.innerHTML = `<strong>${escapeHtml(
      v.Name,
    )}</strong><div class="muted">id: ${escapeHtml(
      v.objectId,
    )} &middot; mmsi: ${escapeHtml(v.mmsi || "—")}</div>`;
    d.addEventListener("click", () => {
      selectVessel(v);
    });
    suggestionsEl.appendChild(d);
  });
}

vesselSearch.addEventListener("input", (e) => {
  const q = (e.target.value || "").trim().toLowerCase();
  if (!q) return renderSuggestions(LOCAL_VESSELS);
  const filtered = LOCAL_VESSELS.filter(
    (v) =>
      (v.Name || "").toLowerCase().includes(q) ||
      (v.objectId || "").toLowerCase().includes(q) ||
      (v.mmsi || "").toLowerCase().includes(q),
  );
  renderSuggestions(filtered);
});

// select vessel from modal: hide modal, draw path
function selectVessel(vessel) {
  hideModal();
  drawVessel(vessel);
  hideMarkers();
}

// draw vessel path on map
function drawVessel(vessel) {
  if (!vessel || !Array.isArray(vessel.Track) || vessel.Track.length === 0) {
    toastMsg("No track data for this vessel");
    return;
  }
  currentVessel = vessel;

  // create GeoJSON
  const coords = vessel.Track.map((p) => [Number(p.lng), Number(p.lat)]);
  const lineFeature = {
    type: "Feature",
    properties: { objectId: vessel.objectId, name: vessel.Name },
    geometry: { type: "LineString", coordinates: coords },
  };
  const pointFeatures = vessel.Track.map((p, i) => ({
    type: "Feature",
    properties: { index: i, datetime: p.datetime },
    geometry: {
      type: "Point",
      coordinates: [Number(p.lng), Number(p.lat)],
    },
  }));
  const pointsCollection = {
    type: "FeatureCollection",
    features: pointFeatures,
  };

  currentGeo = { line: lineFeature, points: pointsCollection };

  // remove old sources/layers
  if (map.getLayer("path-line")) map.removeLayer("path-line");
  if (map.getSource("path-line")) map.removeSource("path-line");
  if (map.getLayer("path-points")) map.removeLayer("path-points");
  if (map.getSource("path-points")) map.removeSource("path-points");

  // add sources
  map.addSource("path-line", { type: "geojson", data: lineFeature });
  map.addLayer({
    id: "path-line",
    type: "line",
    source: "path-line",
    paint: { "line-width": 4, "line-color": "#ff8c00" },
  });

  map.addSource("path-points", {
    type: "geojson",
    data: pointsCollection,
  });
  map.addLayer({
    id: "path-points",
    type: "circle",
    source: "path-points",
    paint: {
      "circle-radius": 6,
      "circle-color": "#ffffff",
      "circle-stroke-color": "#ff8c00",
      "circle-stroke-width": 2,
    },
  });

  // fit to bounds
  const bounds = coords.reduce(
    (b, c) => b.extend(c),
    new mapboxgl.LngLatBounds(coords[0], coords[0]),
  );
  map.fitBounds(bounds, { padding: 60 });

  toastMsg(`Drew path for ${vessel.Name}`);
}

// clear path and state
function clearPath() {
  currentVessel = null;
  currentGeo = null;
  if (map.getLayer("path-line")) map.removeLayer("path-line");
  if (map.getSource("path-line")) map.removeSource("path-line");
  if (map.getLayer("path-points")) map.removeLayer("path-points");
  if (map.getSource("path-points")) map.removeSource("path-points");
}

function fitInitialView() {
  map.easeTo({
    center: initialView.center,
    zoom: initialView.zoom,
    duration: 700,
  });
  if (popuppathpointsInfo) {
    popuppathpointsInfo.remove();
    popuppathpointsInfo = null;
  }
  if (popuppathlineInfo) {
    popuppathlineInfo.remove();
    popuppathlineInfo = null;
  }
  showMarkers();
}

// click handlers for points
map.on("click", "path-points", (e) => {
  const f = e.features[0];
  const [lng, lat] = f.geometry.coordinates;
  const index = f.properties.index;
  const datetime = f.properties.datetime || "unknown";

  // Create popup with close button
  const pathContent = document.createElement("div");
  pathContent.innerHTML = `<div><strong>${escapeHtml(
    currentVessel.Name,
  )}</strong><div class="muted">point #${index}</div><div style="margin-top:6px">Lat: ${lat.toFixed(
    6,
  )}<br>Lon: ${lng.toFixed(6)}<br>Time: ${escapeHtml(
    datetime,
  )}</div><div class="popup-actions"><button class="btn" onclick="window.__viewMore('${
    currentVessel.objectId
  }', ${index})">View more</button><button class="btn ghost" onclick="window.__share('${
    currentVessel.objectId
  }', ${index})">Share</button></div></div>`;

  const closeBtnpoints = document.createElement("button");
  closeBtnpoints.innerHTML = "&times;";
  closeBtnpoints.className = "popup-close-btn";
  pathContent.appendChild(closeBtnpoints);

  popuppathpointsInfo = new mapboxgl.Popup()
    .setLngLat([lng, lat])
    .setDOMContent(pathContent)
    .addTo(map);

  // Handle close button
  closeBtnpoints.addEventListener("click", () => {
    // to reset popup
    popuppathpointsInfo.remove();
    clearPath();
    fitInitialView();
  });
});

// click handler for line — find nearest point on track and show popup for that point
map.on("click", "path-line", (e) => {
  if (!currentGeo) return;
  const clickLngLat = e.lngLat; // {lng, lat}
  const pts = currentGeo.points.features.map((f) => ({
    coords: f.geometry.coordinates,
    props: f.properties,
  }));
  let minDist = Infinity,
    nearest = null,
    nearestIdx = 0;
  for (let i = 0; i < pts.length; i++) {
    const c = pts[i].coords;
    const d =
      (c[0] - clickLngLat.lng) * (c[0] - clickLngLat.lng) +
      (c[1] - clickLngLat.lat) * (c[1] - clickLngLat.lat);
    if (d < minDist) {
      minDist = d;
      nearest = pts[i];
      nearestIdx = i;
    }
  }
  if (!nearest) return;
  const lng = nearest.coords[0],
    lat = nearest.coords[1];
  const datetime = nearest.props.datetime || "unknown";

  // Create popup with close button
  const pathContent = document.createElement("div");
  pathContent.innerHTML = `<div><strong>${escapeHtml(
    currentVessel.Name,
  )}</strong><div class="muted">nearest point #${nearestIdx}</div><div style="margin-top:6px">Lat: ${lat.toFixed(
    6,
  )}<br>Lon: ${lng.toFixed(6)}<br>Time: ${escapeHtml(
    datetime,
  )}</div><div class="popup-actions"><button class="btn" onclick="window.__viewMore('${
    currentVessel.objectId
  }', ${nearestIdx})">View more</button><button class="btn ghost" onclick="window.__share('${
    currentVessel.objectId
  }', ${nearestIdx})">Share</button></div></div>`;

  const closeBtnline = document.createElement("button");
  closeBtnline.innerHTML = "&times;";
  closeBtnline.className = "popup-close-btn";
  pathContent.appendChild(closeBtnline);

  popuppathlineInfo = new mapboxgl.Popup()
    .setLngLat([lng, lat])
    .setDOMContent(pathContent)
    .addTo(map);

  // Handle close button
  closeBtnline.addEventListener("click", () => {
    // to reset popup
    popuppathlineInfo.remove();
    clearPath();
    fitInitialView();
  });
});

// touchstart handlers for points
map.on("touchstart", "path-points", (e) => {
  if (popuppathpointsInfo) {
    popuppathpointsInfo.remove();
    popuppathpointsInfo = null;
  }
  if (popuppathlineInfo) {
    popuppathlineInfo.remove();
    popuppathlineInfo = null;
  }
  const f = e.features[0];
  const [lng, lat] = f.geometry.coordinates;
  const index = f.properties.index;
  const datetime = f.properties.datetime || "unknown";

  // Create popup with close button
  const pathContent = document.createElement("div");
  pathContent.innerHTML = `<div><strong>${escapeHtml(
    currentVessel.Name,
  )}</strong><div class="muted">point #${index}</div><div style="margin-top:6px">Lat: ${lat.toFixed(
    6,
  )}<br>Lon: ${lng.toFixed(6)}<br>Time: ${escapeHtml(
    datetime,
  )}</div><div class="popup-actions"><button class="btn" onclick="window.__viewMore('${
    currentVessel.objectId
  }', ${index})">View more</button><button class="btn ghost" onclick="window.__share('${
    currentVessel.objectId
  }', ${index})">Share</button></div></div>`;

  const closeBtnpoints = document.createElement("button");
  closeBtnpoints.innerHTML = "&times;";
  closeBtnpoints.className = "popup-close-btn";
  pathContent.appendChild(closeBtnpoints);

  popuppathpointsInfo = new mapboxgl.Popup()
    .setLngLat([lng, lat])
    .setDOMContent(pathContent)
    .addTo(map);

  // Handle close button
  closeBtnpoints.addEventListener("click", () => {
    // to reset popup
    popuppathpointsInfo.remove();
    clearPath();
    fitInitialView();
  });
});

// touchstart handler for line — find nearest point on track and show popup for that point
map.on("touchstart", "path-line", (e) => {
  if (popuppathpointsInfo) {
    popuppathpointsInfo.remove();
    popuppathpointsInfo = null;
  }
  if (popuppathlineInfo) {
    popuppathlineInfo.remove();
    popuppathlineInfo = null;
  }
  if (!currentGeo) return;
  const clickLngLat = e.lngLat; // {lng, lat}
  const pts = currentGeo.points.features.map((f) => ({
    coords: f.geometry.coordinates,
    props: f.properties,
  }));
  let minDist = Infinity,
    nearest = null,
    nearestIdx = 0;
  for (let i = 0; i < pts.length; i++) {
    const c = pts[i].coords;
    const d =
      (c[0] - clickLngLat.lng) * (c[0] - clickLngLat.lng) +
      (c[1] - clickLngLat.lat) * (c[1] - clickLngLat.lat);
    if (d < minDist) {
      minDist = d;
      nearest = pts[i];
      nearestIdx = i;
    }
  }
  if (!nearest) return;
  const lng = nearest.coords[0],
    lat = nearest.coords[1];
  const datetime = nearest.props.datetime || "unknown";

  // Create popup with close button
  const pathContent = document.createElement("div");
  pathContent.innerHTML = `<div><strong>${escapeHtml(
    currentVessel.Name,
  )}</strong><div class="muted">nearest point #${nearestIdx}</div><div style="margin-top:6px">Lat: ${lat.toFixed(
    6,
  )}<br>Lon: ${lng.toFixed(6)}<br>Time: ${escapeHtml(
    datetime,
  )}</div><div class="popup-actions"><button class="btn" onclick="window.__viewMore('${
    currentVessel.objectId
  }', ${nearestIdx})">View more</button><button class="btn ghost" onclick="window.__share('${
    currentVessel.objectId
  }', ${nearestIdx})">Share</button></div></div>`;

  const closeBtnline = document.createElement("button");
  closeBtnline.innerHTML = "&times;";
  closeBtnline.className = "popup-close-btn";
  pathContent.appendChild(closeBtnline);

  popuppathlineInfo = new mapboxgl.Popup()
    .setLngLat([lng, lat])
    .setDOMContent(pathContent)
    .addTo(map);

  // Handle close button
  closeBtnline.addEventListener("click", () => {
    // to reset popup
    popuppathlineInfo.remove();
    clearPath();
    fitInitialView();
  });
});

// change cursor when hovering
map.on(
  "mouseenter",
  "path-points",
  () => (map.getCanvas().style.cursor = "pointer"),
);
map.on("mouseleave", "path-points", () => (map.getCanvas().style.cursor = ""));
map.on(
  "mouseenter",
  "path-line",
  () => (map.getCanvas().style.cursor = "pointer"),
);
map.on("mouseleave", "path-line", () => (map.getCanvas().style.cursor = ""));

// bind global actions for popup buttons
window.__viewMore = function (objectId, index) {
  const vessel =
    currentVessel && currentVessel.objectId === objectId
      ? currentVessel
      : LOCAL_VESSELS.find((v) => v.objectId === objectId);
  if (!vessel) return alert("Vessel not found");
  const payload = {
    vessel: vessel.Name,
    objectId: vessel.objectId,
    point: vessel.track[index],
  };
  const w = window.open("", "_blank");
  w.document.write(
    "<pre>" + escapeHtml(JSON.stringify(payload, null, 2)) + "</pre>",
  );
};

window.__share = function (objectId, index) {
  const shareUrl =
    window.location.href.split("#")[0] +
    `#v=${encodeURIComponent(objectId)}&i=${index}`;
  navigator.clipboard &&
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toastMsg("Share link copied to clipboard");
      })
      .catch(() => {
        prompt("Copy this URL", shareUrl);
      });
};

// small toast helper
function toastMsg(text, timeout = 2200) {
  toast.textContent = text;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, timeout);
}

// simple html escape
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Optionally: fetch vessel list from Parse and replace LOCAL_VESSELS
async function fetchVesselsFromParse() {
  try {
    if (APP_ID.includes("YOUR_") || REST_API_KEY.includes("YOUR_")) {
      throw new Error("Parse credentials not set");
    }
    const res = await fetch(`${DEV_API_URL}`, {
      headers: headers,
    });
    if (!res.ok) throw new Error("Parse fetch failed");
    const json = await res.json();
    if (json.results && Array.isArray(json.results)) {
      const parsed = json.results.map((r) => ({
        objectId: r.objectId,
        Name: r.Name || r.objectId,
        mmsi: r.mmsi || "",
        Track: r.Track || [],
      }));
      /* const parsed = json.results.map((r) => {
  let track = r.Track || [];

  // If Track is a string, try to parse it into an array
  if (typeof track === "string") {
    try {
      track = JSON.parse(track);
    } catch (e) {
      track = []; // fallback if parsing fails
    }
  }

  return {
    objectId: r.objectId,
    Name: r.Name || r.objectId,
    mmsi: r.mmsi || "",
    Track: Array.isArray(track) ? track : [track], // ensure it's always an array
  };
}); */

      console.log("Fetched from Parse:", parsed);
      LOCAL_VESSELS.length = 0;
      parsed.forEach((p) => LOCAL_VESSELS.push(p));
      renderSuggestions(LOCAL_VESSELS);
      toastMsg("Loaded vessels from Parse");
    } else {
      toastMsg("No parse results");
    }
  } catch (err) {
    console.warn(err);
    toastMsg("Using local sample (could not fetch Parse)");
  }
}

// If URL contains #v=objectId&i=index then auto-select
function checkUrlHash() {
  const h = location.hash.slice(1);
  if (!h) return;
  const params = new URLSearchParams(h.replace(/&/g, "&"));
  const v = params.get("v");
  const i = parseInt(params.get("i"));
  if (!v) return;
  const found = LOCAL_VESSELS.find((x) => x.objectId === v);
  if (found) {
    drawVessel(found);
    if (!isNaN(i) && found.track[i]) {
      map.once("moveend", () => {
        const point = found.track[i];
        new mapboxgl.Popup()
          .setLngLat([Number(point.lng), Number(point.lat)])
          .setHTML(
            `<div><strong>${escapeHtml(
              found.Name,
            )}</strong><div class="muted">point #${i}</div><div style="margin-top:6px">Lat: ${Number(
              point.lat,
            ).toFixed(6)}<br>Lon: ${Number(point.lng).toFixed(
              6,
            )}<br>Time: ${escapeHtml(point.datetime)}</div></div>`,
          )
          .addTo(map);
      });
    }
  }
}

// init: try to load parse list (optional)
map.on("load", () => {
  fetchVesselsFromParse();
  checkUrlHash();
});

// expose helpful functions for debug
window.__drawVessel = drawVessel;
