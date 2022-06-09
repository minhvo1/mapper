$(() => {
  $("body").on("click", ".favorite-button", function (e) {

    console.log($(this));
    const mapId = $(this).attr("data-input");

    $.ajax({
      type: "POST",
      url: "/api/favmaps",
      data: { mapId },
      success: (result) => {

      },
    });
  });

  // $.ajax({
  //   type: "DELETE",
  //   url: `/api/favmaps/${mapId}`,
  //   success: (result) => {
  //     console.log("map removed from fav list");
  //   },
  //   error: (err) => {
  //     console.log(err);
  //   },
  // });
});
