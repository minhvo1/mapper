// Create new map name element
const createMapNameElement = (mapInfo) => {
  let $mapElement = `
    <li>
      <div>
        <p class="map-name" data-input="${mapInfo.id}">
          ${mapInfo.map_name} <span> by ${mapInfo.creator_name}</span>
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
        $(".map-list").find('li').find('div').css("background-color", "#f9f9fb");
        $(".map-list").find('li').find('div').css("box-shadow", "");
        $(".map-list").find('li').css("font-weight", "400");
        $(`p[data-input='${window.currentMapId}']`).parent().css("background-color", "#dadfe8");
        $(`p[data-input='${window.currentMapId}']`).parent().css("box-shadow", "0.1rem 0.1rem #ced3db");
        $(`p[data-input='${window.currentMapId}']`).parent().parent().css("font-weight", "600");
      },
    });
  });
});
