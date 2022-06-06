$(document).ready(function () {
  $.ajax({
    type: 'GET',
    url: '/api/maps',
    success: (result) => {
      renderUserMaps(result.data);
    }
  })

});

// Render user existing maps
const renderUserMaps = function (data) {
  for (let element of data) {
    let $mapElement = `
    <li>
      <p class="map-name" data-input="${element.id}">${element.map_name}</p>
    </li>
   `;
   $('.map-list').append($mapElement);
  }
}




