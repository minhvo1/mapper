// Create new map name element
const createMapNameElement = (mapInfo) => {
  let $mapElement = `
    <li>
      <div>
        <p class="map-name" data-input="${mapInfo.id}">
          ${mapInfo.map_name} <span>by ${mapInfo.first_name}</span>
        </p>

      </div>
    </li>
   `;

  return $mapElement;
};

// New map form submission
$(() => {
  $(".map-form").on("submit", function (event) {
    event.preventDefault();
    const mapName = $(this).serialize().trim();

    // remove markers before render new markers
    if (window.markers) {
      for (let i = 0; i < window.markers.length; i++) {
        window.map.removeLayer(window.markers[i]);
      }
    }

    $.ajax({
      type: "POST",
      url: "/api/maps",
      data: mapName,
      success: function (result) {
        window.currentMapId = result.data.id;

        $(".map-list").append(createMapNameElement(result.data));
        $(".map-form-input").val("");
      },
    });
  });
});
