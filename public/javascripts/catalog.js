//TODO
// RENDER THE DATA USING JSON RESPONSE
// SEE WHAT IS FASTER
// 1. RECIEVE HTML TEMPLATE AND ADD IT INTO THE HTML VIA JS
// 2. RECIEVE JSON AND RENDER THE HTML VIA JS

function populateData() {

  $.ajax({
    url: "/api/catalog", 
    type: "GET",
    dataType: "html"    
  }).done(function(data){
    console.log('populating data');
    $('#catalog').html(data);
    uploadFile();
    $("#addItemForm, #addCategoryForm").submit(function() {
    console.log('SUBMIT');
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






