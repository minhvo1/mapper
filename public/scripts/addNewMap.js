// Create new map name element
const createMapNameElement = (mapInfo) => {
  let $mapElement = `
    <li>
      <div>
        <p class="map-name" data-input="${mapInfo.id}">${safeHtml(
    mapInfo.map_name
  )}</p>
        <p class="map-creator">${mapInfo.creator_name}</p>
        <button class="favorite-button" data-input="${
          mapInfo.id
        }" type="submit"><i class="fa-regular fa-heart data-fav="false"></i></button>
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
    window.map.eachLayer((layer) => {
      if (!layer._url) window.map.removeLayer(layer);
    });

    $.ajax({
      type: "POST",
      url: "/api/maps",
      data: mapName,
      success: function (result) {
        window.currentMapId = result.data.id;
        $(".map-list").append(createMapNameElement(result.data));
        $(".map-form-input").val("");
        $(".map-list")
          .find("li")
          .find("div")
          .css("background-color", "#f9f9fb");
        $(".map-list").find("li").find("div").css("box-shadow", "");
        $(".map-list")
          .find("li")
          .find("div")
          .find("button")
          .css("display", "none");
        $(".map-list").find("li").css("font-weight", "400");
        $(`p[data-input='${window.currentMapId}']`)
          .parent()
          .css("background-color", "#dadfe8");
        $(`p[data-input='${window.currentMapId}']`)
          .parent()
          .css("box-shadow", "0.1rem 0.1rem #ced3db");
        $(`p[data-input='${window.currentMapId}']`)
          .parent()
          .find("button")
          .css("display", "block");
        $(`p[data-input='${window.currentMapId}']`)
          .parent()
          .parent()
          .css("font-weight", "600");
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
