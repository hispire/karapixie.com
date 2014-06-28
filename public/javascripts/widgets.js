
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
    delegate: 'a#popup-image:visible',
    type: 'image',
    gallery: { 
      enabled:true
      
    }
  })
  
}

function sendForm(formId) {    
    $.ajax({
        type: 'POST',
        url: '/contact',
        data: $(formId).serialize(),
        success: function(data) {
            if(data == "Success") {
	      location.href = formId;
                $(formId).fadeOut("fast", function(){
		  $('#status').show();
                    setTimeout("$.fancybox.close()", 2000);
                });
            }
        }
    });
    
}

function validateEmail(email) {
  var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if(filter.test(email)) {
    return true;
  } else {
    return false;
  }
  
}

$(document).on('click', "#submit", function(){
    console.log('validating');
    var nameval = $("#name").val();
    var emailval = $("#email").val();
    var subjectval = $("#subject").val();
    var msgval = $("#message").val();
    var msglen = msgval.length;
    var mailvalid = validateEmail(emailval);
    
    if (mailvalid == false) {
      $("#email").removeClass("bg__icon--success");
        $("#email").addClass("bg__icon--error");
    } else {
      $("#email").removeClass("bg__icon--error");
      $("#email").addClass("bg__icon--success");
    }
    
    if (msglen < 4) {
        $('#msgError p').replaceWith('<p>Please write a message</p>');
    } else {
      $('#msgError p').replaceWith('<p></p>');;
    }
    if (nameval.length < 3) {
        $("#name").addClass("bg__icon--error");
	$("#name").removeClass("bg__icon--success");
    } else {
     $("#name").addClass("bg__icon--success");
     $("#name").removeClass("bg__icon--error"); 
      
    }
    if (subjectval.length < 3) {
        $("#subject").addClass("bg__icon--error");
	$("#subject").removeClass("bg__icon--success");
    } else {
      $("#subject").addClass("bg__icon--success");
      $("#subject").removeClass("bg__icon--error");
    }
    if (mailvalid == true && msglen >= 4 && subjectval.length >= 3 && nameval.length >= 3) {
      $("#submit").hide();
      $("#sendText").show();
      sendForm('#buyRequest');
    }
});



// MAGNIFIC ZOOM IMALGES ONCLICK
$(document).ready(function() {
   $( "#intro" ).parent().css("overflow", "hidden");
   galeryPopup();  
    // Elevate Zoom when hover image 
    //$('#zoom_01').elevateZoom();
$(document).on('click', ".modalbox", function(e){
  var title = $(this).siblings("h4").text();
  console.log(title);
  $('#subject').val(title);
  $('#status').hide();
  $("#buyRequest").show();
  $("#submit").show();
  $("#sendText").hide();
  
});
$('.modalbox').fancybox();
$("#buyRequest").submit(function() {
    return false;
});


}); 

$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
    ajaxStop: function() { $body.removeClass("loading"); }    
});
  


