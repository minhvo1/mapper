$(() => {
  $("body").on("click", ".favorite-button", function (e) {
    e.preventDefault();
    const mapId = $(this).attr("data-input");

    const favCheck = $(this).children().attr("data-fav");

    if (favCheck === "false" || favCheck === undefined) {
      $(this).children().attr("data-fav", "true");
      $.ajax({
        type: "POST",
        url: "/api/favmaps",
        data: { mapId },
        success: (result) => {
          $(this).children().removeClass("fa-regular").addClass("fa-solid");
          $(this).children().css("color", "#db3b53");
        },
      });
    } else if (favCheck === "true") {
      $(this).children().attr("data-fav", "false");
      $.ajax({
        type: "DELETE",
        url: `/api/favmaps/${mapId}`,
        success: (result) => {
          $(this).children().removeClass("fa-solid").addClass("fa-regular");
          $(this).children().css("color", "black");
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  });
});
