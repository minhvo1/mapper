// Initialize Leaflet map
$(document).ready(function () {
  window.currentUser = $(".logo").attr("data-user");

  window.map = initializeMap();

  let marker;
  window.markers = [];

  $(".map-list").on("click", "div", function () {
    const mapId = $(this).children().attr("data-input");
    // console.log(mapId);
    window.currentMapId = mapId;
    // remove markers before render new markers

    if (window.markers) {
      for (let i = 0; i < window.markers.length; i++) {
        window.map.removeLayer(window.markers[i]);
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
          window.map.addLayer(marker);
          // console.log(map);
        }
      },
    });

    //delete & edit markers
    editDeleteHandler();
  });

  createMarkers();
});

const markerPopup = (markerInfo) => {
  const $popUpInfo = `
    <div class="marker-user" data-user="${window.currentUser}"></div>
    <div class="marker-info">
      <p class="marker-info-title">${markerInfo.title}</p>
      <p class="marker-info-description">${markerInfo.description}</p>
      <img class="marker-info-img" src="${markerInfo.image_url}" style="width: 200px"></img>
      <div class="marker-info-buttons">
        <button class="delete-marker-btn">Delete</button>
        <button class="edit-marker-btn">Edit</button>
      </div>
    </div>
  `;

  return $popUpInfo;

  /* <img src="${markerInfo.image_url}"></img> */
};

const createMarkers = () => {
  window.map.on("click", function (event) {
    // lat, long, title, description, imageUrl
    if (!window.currentMapId) {
      alert("create/select map before you add markers");
      return;
    }

    let marker = new L.marker([event.latlng.lat, event.latlng.lng]);
    window.marker = marker;

    window.map.addLayer(window.marker);
    window.marker.bindPopup(renderMarkerInfoForm()).openPopup();

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
          window.markers.push(window.marker);
          window.marker.closePopup();
          window.marker.bindPopup(markerPopup(result.data)).openPopup();
        },
        error: function (err) {
          console.log(err);
          alert(err.responseJSON.message);
          window.map.removeLayer(window.marker);
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

const renderEditForm = (data) => {
  const $markerForm = `
    <div class="marker-form-container">
      <p class="add-marker-header">Edit a marker</p>
      <form class="edit-marker-form">
        <input type="text" id="markerName" name="markerName" placeholder="Title" value="${data.title}"></input>
        <input type="textarea" id="markerDesc" name="markerDesc" placeholder="Description" value="${data.description}"></input>
        <input type="text" id="markerImgUrl" name="markerImgUrl" placeholder="Image URL" value="${data.image_url}"></input>
        <div class="edit-marker-form-button">
          <button><strong>Edit</strong></button>
        </div>
      </form>
    </div>
  `;
  return $markerForm;
};

const initializeMap = () => {
  // Initialize the map
  let map = L.map("map");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.control
    .zoom({
      position: "topright",
    })
    .addTo(map);

  map.locate({ setView: true, maxZoom: 13, drag: true });

  return map;
};

const editDeleteHandler = () => {
  $(document).ajaxComplete(function () {
    window.map.eachLayer((layer) => {
      layer.on("click", function (e) {
        $(".delete-marker-btn").on("click", function (e) {
          e.preventDefault();

          const lat = layer._latlng.lat;
          const long = layer._latlng.lng;

          $.ajax({
            type: "DELETE",
            url: `/api/maps/points?lat=${lat}&long=${long}`,
            success: (result) => {
              window.map.removeLayer(layer);
            },
            error: (err) => {
              alert(err.responseJSON.message);
            },
          });
        });

        $(".edit-marker-btn").on("click", function (e) {
          e.preventDefault();

          const lat = layer._latlng.lat;
          const long = layer._latlng.lng;

          $.ajax({
            type: "GET",
            url: `/api/maps/point/single?lat=${lat}&long=${long}`,
            success: (result) => {
              layer.bindPopup(renderEditForm(result.data));

              //inside edit form
              $(".edit-marker-form").on("submit", function (e) {
                e.preventDefault();
                const data = $(this).serialize();

                $.ajax({
                  type: "PATCH",
                  url: `/api/maps/point/edit?lat=${lat}&long=${long}`,
                  data,
                  success: (editedRes) => {
                    return layer.bindPopup(markerPopup(editedRes.data));
                  },
                  error: (err) => {
                    alert(err.responseJSON.message);
                    return layer.bindPopup(markerPopup(result.data));
                  },
                });
              });
            },
            error: (err) => {
              console.log(err.message);
            },
          });
        });
      });
    });
  });
};
