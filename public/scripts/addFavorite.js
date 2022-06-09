$(() => {
  $("body").on("click", ".favorite-button", function (e) {

    const mapId = $(this).attr("data-input");
    $.ajax({
      type: "POST",
      url: "/api/favmaps",
      data: { mapId },
      success: (result) => {

      },
    });
  });
});
