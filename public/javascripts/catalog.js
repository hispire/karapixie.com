function populateData() {

  $.ajax({
    url: "/api/catalog", 
    type: "GET",
    dataType: "html"    
  }).done(function(data){
    console.log('populating data');
    $('#catalog').html(data);
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


populateData();



