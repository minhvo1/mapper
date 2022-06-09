$(() => {
  $("body").on("click", ".favorite-button", function (e) {
    console.log("add fav");

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
});
