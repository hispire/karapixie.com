
// SLIDESHOW

/*$(function() {
  $(".rslides").responsiveSlides({
    auto: true,             // Boolean: Animate automatically, true or false
    speed: 500,            // Integer: Speed of the transition, in milliseconds
    timeout: 8000,          // Integer: Time between slide transitions, in milliseconds
    pager: false,           // Boolean: Show pager, true or false
    nav: true,             // Boolean: Show navigation, true or false
    random: false,          // Boolean: Randomize the order of the slides, true or false
    pause: false,           // Boolean: Pause on hover, true or false
    pauseControls: true,    // Boolean: Pause when hovering controls, true or false
    prevText: "",   // String: Text for the "previous" button
    nextText: "",       // String: Text for the "next" button
    maxwidth: "",           // Integer: Max-width of the slideshow, in pixels
    navContainer: ".slideshow",       // Selector: Where controls should be appended to, default is after the 'ul'
    manualControls: "",     // Selector: Declare custom pager navigation
    namespace: "rslides",   // String: Change the default namespace used
    before: function(){},   // Function: Before callback
    after: function(){}     // Function: After callback
  });
});*/


 function AddMoreContent(i){
      $.get('/work/' + i, function(data) {
           //Assuming the returned data is pure HTML
           $(data).insertBefore($('#placeHolder'));
	   var filter = $('#filters a.active').attr('id');
	   filterData(filter);
	   galeryPopup();
      });
 }
 
function galeryPopup() {
    
  $('.gallery__container').magnificPopup({
    delegate: 'a:visible',
    type: 'image',
    gallery: { 
      enabled:true
      
    }
  })
  
}

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


// MAGNIFIC ZOOM IMALGES ONCLICK
$(document).ready(function() {
   $( "#intro" ).parent().css("overflow", "hidden");
   galeryPopup();  
    // DYNAMIC FILTER DATA
  
    //when a link in the filters div is clicked...  
    $('#filters a').click(function(e){
  
        //prevent the default behaviour of the link  
        e.preventDefault();
	// remove all the active classes
	$('#filters a').removeClass('active');
	// add active class to the current element clicked
	$(this).addClass('active');
  
        //get the id of the clicked link(which is equal to classes of our content  
        var filter = $(this).attr('id');  
	filterData(filter);
        
  
    }); 
    // Elevate Zoom when hover image 
    //$('#zoom_01').elevateZoom();
    
    // Lazy load when scroll is near the end of the window
    // TODO 
    // Stop when ther is no more pages
    // Show a loading gif
    var i = 0;
    $(window).scroll(function(){
      console.log($(window).scrollTop());
      
      if  ($(window).scrollTop() == $(document).height() - $(window).height()){
	i += 1;
           AddMoreContent(i); 
      }
 }); 
      $('#moreData').click(function(e){
      e.preventDefault();
      i += 1;
      AddMoreContent(i);
    });


});  
  


