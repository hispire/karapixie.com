function populateData() {

  $.ajax({
    url: "/api/catalog", 
    type: "GET",
    dataType: "html"    
  }).done(function(data){
    console.log('populating data');
    $('#catalog').html(data);
    uploadFile();
    $("#addItemForm").submit(function() {
    return false;
    });
  });
};
function getItemById(id) {
  $.ajax({
    url: "/api/catalog/" + id, 
    type: "GET",
    dataType: "json",
    success: function (data) {
      return data;
    }
  })
};






