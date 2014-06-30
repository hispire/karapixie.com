var imgUrl;

$("#Upload").uploadFile({
 url:'/admin/catalog/upload',
  multiple:true,
  dragdropWidth: '100%',
  statusBarWidth: '100%',
  maxFileSize:1024*1300,
  onSubmit:function(files)
{

},
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

// Delete product
$(document).on('click', '#productList li a.linkdeleteproduct', function(e) {
  e.preventDefault();
  var id = $(this).attr('rel');
  deleteData('/admin/catalog/', id);
  });
