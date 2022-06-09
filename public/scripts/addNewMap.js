// Create new map name element
const createMapNameElement = (mapInfo) => {
  let $mapElement = `
    <li>
      <div>
        <p class="map-name" data-input="${mapInfo.id}">
          ${safeHtml(mapInfo.map_name)} <span> by ${mapInfo.creator_name}</span>
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

/** XSS prevent */
const safeHtml = function (str) {
  let div = document.createElement("div"); // create a new div
  div.appendChild(document.createTextNode(str)); // append a TextNode to div
  return div.innerHTML;
};
