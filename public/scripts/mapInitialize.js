// Initialize Leaflet map
$(document).ready(function () {
  window.map = initializeMap();
  let map = window.map;

  let marker;
  window.markers = [];

  $(".map-list").on("click", "div", function () {
    const mapId = $(this).children().attr("data-input");
    // console.log(mapId);
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

  $(".delete-marker-btn").on("click", function (e) {
    e.preventDefault();
    window.map.removeLayer(marker);
  });

  createMarkers();

  marker.on("click", function (e) {
    console.log(e);
  });
});

const markerPopup = (markerInfo) => {
  const $popUpInfo = `
    <p>${markerInfo.title}</p>
    <p>${markerInfo.description}</p>
    <img src="${markerInfo.image_url}" style="width: 200px"></img>

  `;

  {
    /* <img src="${markerInfo.image_url}"></img> */
  }
  return $popUpInfo;
};

const createMarkers = () => {
  window.map.on("click", function (event) {
    // lat, long, title, description, imageUrl
    if (!window.currentMapId) {
      alert("create/select map before you add markers");
      return;
    }

    let marker = new L.marker([event.latlng.lat, event.latlng.lng]);
    window.map.addLayer(marker);
    marker.bindPopup(renderMarkerInfoForm()).openPopup();

    marker.getPopup().on("remove", function () {
      window.map.removeLayer(marker);
    });

    $(".marker-form").on("submit", function (e) {
      e.preventDefault();

      let data =
        $(this).serialize() +
        `&lat=${event.latlng.lat}&long=${event.latlng.lng}`;

      $.ajax({
        type: "POST",
        url: `/api/maps/${window.currentMapId}`,
        data,
        success: function (result) {
          console.log(result);
          window.markers.push(marker);
          // marker.closePopup();
          // marker.unbindPopup();
          marker.bindPopup(markerPopup(result.data));
        },
        error: function () {
          window.map.removeLayer(marker);
        },
      });
    });
  });
};

const renderMarkerInfoForm = () => {
  const $markerForm = `
    <div class="marker-form-container">
      <p class="add-marker-header">Add a marker</p>
      <form class="marker-form">
        <input type="text" id="markerName" name="markerName" placeholder="Title"></input>
        <input type="textarea" id="markerDesc" name="markerDesc" placeholder="Description"></input>
        <input type="text" id="markerImgUrl" name="markerImgUrl" placeholder="Image URL"></input>
        <button><strong>Create</strong></button>
      </form>
    </div>
  `;
  return $markerForm;
};

const initializeMap = () => {
  // Initialize the map
  let map = L.map("map");

  map.locate({ setView: true, maxZoom: 13, drag: true });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  return map;
};
