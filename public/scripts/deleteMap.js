$(document).ready(function () {
  $('.delete-map-form').on('submit', function (event) {
    event.preventDefault();
    console.log($(this).parent('div'))
    let mapId = $(this).parent('div').attr('data-map');
    console.log(mapId);
    $.ajax({
      type: "DELETE",
      url: `/api/maps/${mapId}`,
    })
  })
})
