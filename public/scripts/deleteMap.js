$(document).ready(function () {
  $(".delete-map-form").on("submit", function (event) {
    event.preventDefault();
    console.log($(this).parent().parent("li"));
    let mapId = $(this).parent().parent("li").attr("data-map");
    console.log(mapId);
    $.ajax({
      type: "DELETE",
      url: `/api/maps/${mapId}`,
      success: (result) => {
        $(this).parent().parent("li").remove();
      },
    });
  });
});
