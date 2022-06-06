// Initialize Leaflet map
$(document).ready(function() {
  let map = L.map('map').setView([49.246292, -123.116226], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  let markersArray = [];
  map.on('click', (event) => {
    var marker = L.marker([event.latlng.lat, event.latlng.lng]).addTo(map);
    markersArray.push(marker);
    console.log(markersArray);
  })


  $('.user-maps').on('click', '.map-name', function () {
    const key = $(this).attr('data-input');
    console.log($(this).attr('data-input'));
    $.ajax({
      type: 'GET',
      url: `/api/maps/${key}`,
      success: (result) => {
        console.log(result);

      }

    })
  })

});


