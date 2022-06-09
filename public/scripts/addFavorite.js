$(() => {
  $("body").on("click", ".favorite-button", function (e) {
    console.log("add fav");

    console.log($(this));
    const mapId = $(this).attr("data-input");

    $.ajax({
      type: "POST",
      url: "/api/favmaps",
      data: { mapId },
      success: (result) => {
        console.log(result);
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
