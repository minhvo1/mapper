$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "/api/maps",
    success: (result) => {
      renderUserMaps(result.data);
    },
    error: (err) => {
      console.log("error getting map lists", err.message);
    },
  });

  $(document).ajaxComplete(function () {
    // Find div element in unordered list
    $(".map-list")
      .children()
      .children()
      .on("click", function () {
        $(".map-list").children().children().css("background-color", "#f9f9fb");
        $(".map-list").children().children().css("box-shadow", "");
        $(".map-list").children().children().children('button').css("display", "none");
        $(".map-list").children().css("font-weight", "400");
        $(this).css("background-color", "#dadfe8");
        $(this).css("box-shadow", "0.1rem 0.1rem #ced3db");
        $(this).children('button').css("display", "block");
        $(this).parent().css("font-weight", "600");
      });
  });
});

// Render user existing maps
const renderUserMaps = function (data) {
  for (let element of data) {
    let $mapElement = `
    <li>
      <div>
        <p class="map-name" data-input="${element.id}">${element.map_name}</p>
        <p class="map-creator">${element.first_name}</p>
        <button class="favorite-button" type="submit">Fav</button>
      </div>
    </li>
   `;
    $(".map-list").append($mapElement);
  }
};
