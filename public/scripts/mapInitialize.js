// Initialize Leaflet map
$(document).ready(function () {
  let map = initializeMap();

  let marker;
  window.markers = [];
  $(".user-maps").on("click", "div", function () {
    const mapId = $(this).children().attr("data-input");

    window.currentMapId = mapId;
    // remove markers before render new markers
    if (window.markers) {
      for (let i = 0; i < window.markers.length; i++) {
        map.removeLayer(window.markers[i]);
      }
    }

    $.ajax({
      type: "GET",
      url: `/api/maps/${mapId}`,
      success: (result) => {
        // console.log(result.data);
        const points = result.data;
        for (const point of points) {
          marker = new L.Marker([point.lat, point.long]).bindPopup(
            markerPopup(point),
            { maxWidth: "auto" }
          );
          window.markers.push(marker);
          map.addLayer(marker);
        }
      },
    });
  });
  createMarkers(map);

  marker.on("click", (event) => {
    console.log(this, "yes");
  });
});

const markerPopup = (markerInfo) => {
  const $popUpInfo = `
    <p>${markerInfo.title}</p>
    <p>${markerInfo.description}</p>
    <img src="${markerInfo.image_url}"></img>
  `;

  return $popUpInfo;
};

const createMarkers = (map) => {
  map.on("click", (event) => {
    // console.log(window.currentMapId);
    // lat, long, title, description, imageUrl

    $.ajax({
      type: "POST",
      url: `/api/maps/${window.currentMapId}`,
      data: {
        lat: event.latlng.lat,
        long: event.latlng.lng,
      },
      success: function (result) {
        let marker = L.marker([event.latlng.lat, event.latlng.lng]).bindPopup(
          markerPopup(result)
        );
        console.log(marker);
        window.markers.push(marker);
        map.addLayer(marker);
      },
    });
  });
};

const renderMarkerInfoForm = () => {
  const $markerForm = ``

  `
}

const initializeMap = () => {
  // Initialize the map
  const map = L.map("map");

  // Get the tile layer from OpenStreetMaps
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    // Specify the maximum zoom of the map
    maxZoom: 19,

    // Set the attribution for OpenStreetMaps
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  map.locate({ setView: true, maxZoom: 13, drag: true });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  return map;
};
