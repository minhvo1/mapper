// Create new map name element
const createMapNameElement = (mapName) => {

  let $mapElement = `
    <li>
      <p>${mapName.slice(8)}</p>
    </li>
   `;
   return $mapElement;
};

// New map form submission
$(() => {
  $('.map-form').on('submit', function(event) {
    event.preventDefault();
    const mapName = $(this).serialize();
    $.ajax({
      type: 'POST',
      url: '/api/maps',
      data: mapName,
      success: function(data) {
        console.log(data);
      }
    })

    $('.map-list').append(createMapNameElement(mapName));
  })
})
