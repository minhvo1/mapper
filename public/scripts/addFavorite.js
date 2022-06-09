$(() => {
  $("body").on("click", ".favorite-button", function (e) {
    const mapId = $(this).attr("data-input");

    const favCheck = $(this).children().attr("data-fav");

    if (favCheck === "false" || favCheck === undefined) {
      $(this).children().attr("data-fav", "true");
      $.ajax({
        type: "POST",
        url: "/api/favmaps",
        data: { mapId },
        success: (result) => {
          console.log("map added from fav list");
          $(".map-list").empty();
          loadAllMapList();
        },
      });
    } else if (favCheck === "true") {
      $(this).children().attr("data-fav", "false");
      $.ajax({
        type: "DELETE",
        url: `/api/favmaps/${mapId}`,
        success: (result) => {
          console.log("map removed from fav list");
          $(".map-list").empty();
          loadAllMapList();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  });
});
