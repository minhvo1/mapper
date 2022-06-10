$(document).ready(function () {
  $('.delete-map-form').on('submit', function (event) {
    event.preventDefault();
    console.log($(this).parent('li'))
    let mapId = $(this).parent('li').attr('data-map');
    console.log(mapId);
    $.ajax({
      type: "DELETE",
      url: `/api/maps/${mapId}`,
      success: (result) => {
        console.log('success');
      }
    })
  })
})
