$(() => {
  $("body").on("click", ".favorite-button", function (e) {
    console.log("yes");
    const mapId = $(this).attr("data-input");
    console.log(mapId);

    const favCheck = $(this).children().attr("data-fav");
    console.log(favCheck);

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
