$(document).ready(function () {
  $.ajax({
    type: 'GET',
    url: '/api/maps',
    success: (result) => {
      renderUserMaps(result.data);
    }
  })

  $(document).ajaxComplete(function () {
    // Find div element in unordered list
    $('.map-list').children().children().on('click', function () {
      $('.map-list').children().children().css('background-color', '#f9f9fb');
      $('.map-list').children().css('font-weight', '400');
      $(this).css('background-color', '#dadfe8');
      $(this).parent().css('font-weight', '600');
    })
  })
});

// Render user existing maps
const renderUserMaps = function (data) {
  for (let element of data) {
    let $mapElement = `
    <li>
      <div><p class="map-name" data-input="${element.id}">${element.map_name}</p></div>
    </li>
   `;
   $('.map-list').append($mapElement);
  }
}








