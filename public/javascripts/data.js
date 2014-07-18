//TODO
// Increment i only per each category when click
// Fix no more data flag


var moreContent = true;
var i = 0;
function AddMoreContent(page, cat){
      $.ajax({
	type: 'GET',
	url: '/work/' + cat + '/' + page,
	success: function (data) {
           //Assuming the returned data is pure HTML
           $(data).insertBefore($('#placeHolder'));
	   var category = $('#filters a.active').attr('id');
	   //filterData(category);
	   galeryPopup();
           $.ajax({
	     type: 'GET',
	     url: '/work/' + cat + '/' + (page + 1),
	     success: function (data) {
               if(data == 'no more data') {
	         $('#moreData').hide();
	         moreContent = false;
               }
	     }
           });  
	}
      });
}

// FILTER DATA ONLY CLIENT JS
function filterData(filter) {
  if (filter == 'all') {
        //show all the list items  
        $('#catalogList li').show();
	
	} else {
  
        /*using the :not attribute and the filter class in it we are selecting 
        only the list items that don't have that class and hide them '*/  
        $('#catalogList li:not(#' + filter + ')').hide();
	$('#catalogList li:not(#' + filter + ')').removeClass('animated fadeInUp');
	// show all elements that do share filter
	$('#catalogList li#' + filter).show(); 
	$('#catalogList li#' + filter).addClass('animated fadeInUp');
	}
  
  
}

// DYNAMIC FILTER DATA  
//when a link in the filters div is clicked...  
$('#filters a').click(function(e){
  i = 0;
  //prevent the default behaviour of the link  
  e.preventDefault();
  $('#catalogList').html('<div class="l" id="placeHolder"></div>');
  // remove all the active classes
  $('#filters a').removeClass('active');
  // add active class to the current element clicked
  $(this).addClass('active');
  //get the id of the clicked link(which is equal to classes of our content  
  var category = $(this).attr('id'); 
  moreContent = true;
  $('#moreData').show();
  AddMoreContent(i, category);
}); 
 

// Lazy load when scroll is near the end of the window
// TODO 
// Stop when ther is no more pages
// Show a loading gif

$(window).scroll(function(){
//console.log($(window).scrollTop());     
  if  ($(window).scrollTop() == $(document).height() - $(window).height()){
    console.log(moreContent);
    if(moreContent == true) {
      var category = $('#filters a.active').attr('id');
      console.log(category);
      i += 1;
      AddMoreContent(i, category);
    }
  }
}); 
$('#moreData a').click(function(e){
  e.preventDefault();
  if(moreContent == true) {
    //$('#placeHolder').html('<div id="loading" ><img src="/images/loading.png"> loading...</div>');
    var category = $('#filters a.active').attr('id');
    i += 1;
    AddMoreContent(i, category); 
  }
}); 
