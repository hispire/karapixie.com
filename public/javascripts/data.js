var moreData = true;
function AddMoreContent(i){
      $.ajax({
	type: 'GET',
	url: '/work/' + i,
	success: function (data) {
           //Assuming the returned data is pure HTML
           $(data).insertBefore($('#placeHolder'));
	   moreData = true;
	   var filter = $('#filters a.active').attr('id');
	   filterData(filter);
	   galeryPopup();
	  
	}
      });
      $.get('/work/' + (i+1), function(data) {
        if(data == 'no more data') {
	  $('#moreData').hide();
	  moreData = false;
	  }
      });
 }

// Lazy load when scroll is near the end of the window
// TODO 
// Stop when ther is no more pages
// Show a loading gif
var i = 0;
$(window).scroll(function(){
//console.log($(window).scrollTop());     
  if  ($(window).scrollTop() == $(document).height() - $(window).height()){
    if(moreData == true) {
      i += 1;
      AddMoreContent(i); 
     }
  }
}); 
$('#moreData a').click(function(e){
  e.preventDefault();
  if(moreData == true) {
    //$('#placeHolder').html('<div id="loading" ><img src="/images/loading.png"> loading...</div>');
    i += 1;
    AddMoreContent(i);
  }
}); 
