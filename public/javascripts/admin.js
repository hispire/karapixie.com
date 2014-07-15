var imgUrl;
function uploadFile() {
  $("#Upload").uploadFile({
    url:'/api/catalog/upload',
    multiple:true,
    dragdropWidth: '100%',
    statusBarWidth: '100%',
    maxFileSize:1024*1300,
    allowedTypes: 'jpg',
    
    onSuccess:function(files,data,xhr)
    {
      imgDetailUrl = data.imgDetail;
      imgThumbUrl = data.imgThumb;
      $('#imgDetailUrl').val(imgDetailUrl);
      $('#imgThumbUrl').val(imgThumbUrl);
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
  $('#addItemForm').find("input[type=text], input[type=number], textarea").val("");
  $("#addItemForm #submit").show();
  $("#sendText").hide();
  
});

$(document).on('click', ".modalbox.editItem", function(e){
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
      if(data.sold == true) {
	$("#addItemForm #checkboxSold").attr("checked","checked");
      }
      $("#addItemForm #description").val(data.description);
      $("#addItemForm #height").val(data.height);
      $("#addItemForm #width").val(data.width);
      $("#addItemForm #itemId").val(data._id);

    }
  })

  
});
$("#addItem").hide();
$(document).on('click', "#linkCatalog", function() {
  $('#wysiwyg').hide();
  $('.linkSectionHtml').show();
  $(this).hide();
  $('#catalog').show();
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
  
tinymce.init({
  selector: "textarea.edit-html",
  menubar: false,
  plugins: [ 'link' ],
  toolbar: 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | link'
  });

$('#wysiwyg').hide();

$(document).on('click', ".linkSectionHtml", function() {
  $('#wysiwyg').show();
  $('#linkCatalog').show();
  $("#addItem").hide();
  $('#catalog').hide();
  $("#wysiwyg button[type=submit]").attr("id","updateSubmit");
  var section = $(this).attr('rel');
  var ed = tinyMCE.get('html_content');
  $.ajax({
    type: 'GET',
    dataType: "json",
    url: '/content-html/' + section,
    success: function(data) {
      console.log(data);
      $('#section').val(data.section);  
      $("#section").attr("disabled","disabled");
      $('#section_title').val(data.title);  
      ed.setContent(data.body);
      
    }
  });

  $(this).hide();
});

$(document).on('click', "#wysiwyg #updateSubmit", function(){
  var ed = tinyMCE.get('html_content');
  var section = $('#section').val();
  $("#sendText").show();
  $.ajax({
    type: 'PUT',
    url: '/content-html/' + section,
    data: {
      'section': $('#section').val(),  
      'title': $('#section_title').val(),  
      'body': ed.getContent()  
    },
    complete: function(data) {
      $('#status').show().text(data);
    }
  });
  $("#sendText").hide();
});


$(document).on('click', "#wysiwyg #htmlSubmit", function(){
  var ed = tinyMCE.get('html_content');
  $("#sendText").show();
  $.ajax({
    type: 'POST',
    url: '/content-html',
    data: {
      'section': $('#section').val(),  
      'title': $('#title').val(),  
      'body': ed.getContent()  
    }
  });
  $("#sendText").hide();
});

