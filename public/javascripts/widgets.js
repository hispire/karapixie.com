
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
function galeryPopup() {
    
  $('.gallery__container').magnificPopup({
    delegate: 'a.popup-image:visible',
    type: 'image',
    gallery: { 
      enabled:true
      
    }
  })
  
}


// MAGNIFIC ZOOM IMALGES ONCLICK
$(document).ready(function() {
   $( "#intro" ).parent().css("overflow", "hidden");
   galeryPopup();  
  
  $('.modalbox').fancybox();
  // Disable default behavior of submit buttons in forms.
  $('#buyRequest, #addItemForm, #wysiwyg, #addCategoryForm').submit(function() {
      console.log('NO SUBMIT DEFAULT');
      return false;
  });

  // Load and animation when an ajax request start.
  $body = $("body");
  $(document).on({
      ajaxStart: function() { $body.addClass("loading");    },
      ajaxStop: function() { $body.removeClass("loading"); }    
  });
  
}); 


