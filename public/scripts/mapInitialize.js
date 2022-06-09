// Initialize Leaflet map
$(document).ready(function () {
  window.currentUser = $(".logo").attr("data-user");

  window.map = initializeMap();

  $(".map-list").on("click", "div", function () {
    const mapId = $(this).children().attr("data-input");

    window.currentMapId = mapId;

    renderAllMarkers();
    renderMarkerList();
    //delete & edit markers
    editDeleteHandler();
  });

  createMarkers();

  $(".marker-list-pop").on("click", ".marker-list-btn", function (e) {
    e.preventDefault();

    const pointId = $(this).next().attr("data-point");

    $.ajax({
      type: "GET",
      url: `/api/maps/point/${pointId}`,
      success: (result) => {
        window.map.flyTo([result.data.lat, result.data.long], 17);
      },
    });
  });
});

const markerPopup = (markerInfo) => {
  const $popUpInfo = `
    <div class="marker-info" data-point="${markerInfo.point_id}">
      <p class="marker-info-title">${markerInfo.title}</p>
      <p class="marker-info-description">${markerInfo.description}</p>
      <img class="marker-info-img" src="${markerInfo.image_url}" style="width: 200px"></img>
      <div class="marker-info-buttons">
        <button class="delete-marker-btn">Delete</button>
        <button class="edit-marker-btn">Edit</button>
      </div>
  `;
  return $popUpInfo;
};

const renderAllMarkers = () => {
  // removes markers before render new markers
  window.map.eachLayer((layer) => {
    if (!layer._url) window.map.removeLayer(layer);
  });
  // get all markers
  $.ajax({
    type: "GET",
    url: `/api/maps/${window.currentMapId}`,
    success: (result) => {
      const points = result.data;

      for (const point of points) {
        window.marker = new L.Marker([point.lat, point.long]).bindPopup(
          markerPopup(point),
          { maxWidth: "auto" }
        );
        window.map.addLayer(window.marker);
      }
    },
  });
};

const renderMarkerList = () => {
  $(".marker-list-pop").empty();

  $.ajax({
    type: "GET",
    url: `/api/maps/${window.currentMapId}`,
    success: (result) => {
      const points = result.data;

      for (let marker of points) {
        const $div = `
        <div class="marker-list-item">
          <button class="marker-list-btn"> ${marker.title} </button>
          <div class="marker-list-input" data-point="${marker.point_id}"></div>
        </div>
      `;
        $(".marker-list-pop").append($div);
      }
    },
  });
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

    window.map.addLayer(marker);
    marker.bindPopup(renderMarkerInfoForm()).openPopup();

    marker.getPopup().on("remove", function () {
      window.map.removeLayer(marker);
      renderAllMarkers();
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
          marker.closePopup();
          marker.bindPopup(markerPopup(result.data)).openPopup();
          renderMarkerList();
        },
        error: function (err) {
          alert(err.responseJSON.message);
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
        const markerId = $(".marker-info").attr("data-point");

        $(".delete-marker-btn").on("click", function (e) {
          e.preventDefault();

          $.ajax({
            type: "DELETE",
            url: `/api/maps/points/${markerId}`,
            success: (result) => {
              window.map.removeLayer(layer);
              renderAllMarkers();
            },
            error: (err) => {
              alert(err.responseJSON.message);
              renderAllMarkers();
            },
          });
        });

        $(".edit-marker-btn").on("click", function (e) {
          e.preventDefault();

          const lat = layer._latlng.lat;
          const long = layer._latlng.lng;

          $.ajax({
            type: "GET",
            url: `/api/maps/point/${markerId}`,
            success: (result) => {
              layer.bindPopup(renderEditForm(result.data));
              //inside edit form
              $(".edit-marker-form").on("submit", function (e) {
                e.preventDefault();
                const data = $(this).serialize();

                $.ajax({
                  type: "PATCH",
                  url: `/api/maps/point/${markerId}`,
                  data,
                  success: (editedRes) => {
                    layer.bindPopup(markerPopup(editedRes.data)).closePopup();
                  },
                  error: (err) => {
                    alert(err.responseJSON.message);
                    layer.bindPopup(markerPopup(result.data));
                  },
                });
              });
            },
            error: (err) => {
              console.log(err.message);
            },
          });
          layer.getPopup().on("remove", function (e) {
            renderAllMarkers();
          });
        });
      });
    });
  });
};
