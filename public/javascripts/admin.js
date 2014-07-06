var imgUrl;
function uploadFile() {
  $("#Upload").uploadFile({
    url:'/api/catalog/upload',
    multiple:true,
    dragdropWidth: '100%',
    statusBarWidth: '100%',
    maxFileSize:1024*1300,
    
    onSuccess:function(files,data,xhr)
    {
      imgUrl = data	
      console.log(imgUrl);
      $('#imgUrl').val(imgUrl);
    },
    afterUploadAll:function()
    {
      $("#eventsmessage").html($("#eventsmessage").html()+"<br/>All files are uploaded");
    }
  }); 
};

// Check response
function checkResponse( response ) {
  // Check for a successful response
  if (response.retStatus === 'Success') {
    if (response.redirectTo) {
      window.location = response.redirectTo;
      }
    } else {
       alert('Error: ' + response.error);
       } 
}


// Delete User
function deleteData(url, id) {

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this item?');
    
    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: url + id
        }).done(function( response ) {

         populateData();

            // Update the table
            //populateTable();

        })

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

}

$(document).on('click', ".modalbox#addItem", function(e){
  $("#addItemForm input[type=submit]").attr("id","submit");
  $('#status').hide();
  $("#addItemForm").show();
  $("#addItemForm #submit").show();
  $("#sendText").hide();
  
});

$(document).on('click', ".modalbox#editItem", function(e){
  var id = $(this).attr('rel');
  $('#status').hide();
  $("#addItemForm").show();
  $("#addItemForm select option").removeAttr("selected");
  $("#addItemForm input[type=submit]").attr("id","updateSubmit");
  $("#addItemForm #updateSubmit").show();
  $("#sendText").hide();
  $.ajax({
    url: "/api/catalog/" + id, 
    type: "GET",
    dataType: "json",
    success: function (data) {
      $("#addItemForm #title").val(data.title);
      $("#addItemForm select option[value='" + data.category._id + "']").attr("selected","selected");
      console.log(data.category._id);
      $("#addItemForm #imgUrl").val('');
      $("#addItemForm #description").val(data.description);
      $("#addItemForm #height").val(data.height);
      $("#addItemForm #width").val(data.width);
      $("#addItemForm #itemId").val(data._id);

    }
  })

  
});
$("#addItem").hide();
$(document).on('click', "#linkCatalog", function() {
  $(this).hide();
  populateData();
  $("#addItem").show();
});

$(document).on('click', "#addItemForm #submit", function(){
  $(this).hide();
  $("#sendText").show();
  var populate = true;
  sendForm('#addItemForm', 'POST', '/api/catalog', populate);
});

$(document).on('click', "#addItemForm #updateSubmit", function(){
  $(this).hide();
  $("#sendText").show();
  var populate = true;
  sendForm('#addItemForm', 'PUT', '/api/catalog', populate);
});

// Delete product
$(document).on('click', '#productList li a.linkdeleteproduct', function(e) {
  e.preventDefault();
  var id = $(this).attr('rel');
  deleteData('/api/catalog/', id);
  });
