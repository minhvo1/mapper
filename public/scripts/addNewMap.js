$(() => {
  $('.map-form').on('submit', function(event) {
    event.preventDefault();
    const mapName = $(this).serialize();
    $.ajax({
      type: 'POST',
      url: '/api/maps',
      data: mapName,
      success: function(data) {
        console.log(data);
      }
    })
  })
})
