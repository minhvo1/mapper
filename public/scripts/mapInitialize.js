// Initialize Leaflet map
$(document).ready(function() {
  let map = L.map('map').setView([49.246292, -123.116226], 13);
  let tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  let markersArray = [];
  map.on('click', (event) => {
    var marker = L.marker([event.latlng.lat, event.latlng.lng]).addTo(map);
    markersArray.push(marker);
    console.log(markersArray);
  })

  //  Get map points on click
  let marker;
  let markers = [];
  $(".user-maps").on("click", ".map-name", function () {
    const key = $(this).attr("data-input");

    if (markers) {
      for (let i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
      }
    }
    $.ajax({
      type: "GET",
      url: `/api/maps/${key}`,
      success: (result) => {
        // console.log(result.data);
        const points = result.data;
        for (const point of points) {
          marker = new L.Marker([point.lat, point.long]).bindPopup(`Title: ${point.title}; Description: ${point.description}`);
          markers.push(marker);
          map.addLayer(marker);
        }
      },
    });
  });

});


