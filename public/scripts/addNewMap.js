// Create new map name element
const createMapNameElement = (mapName) => {
  let newMapName = decodeURI(mapName);
  let $mapElement = `
    <li>
      <div class="single-map-name">
        <p>${newMapName.slice(8)}</p>
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

    $.ajax({
      type: "POST",
      url: "/api/maps",
      data: mapName,
      success: function (result) {
        console.log(result);
        window.currentMapId = result.data.id;
      },
    });

    $(".map-list").append(createMapNameElement(mapName));
  });
});
