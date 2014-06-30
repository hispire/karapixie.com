
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

function sendForm(formId, method, url, callback) { 
  
    $.ajax({
        type: method,
        url: url,
        data: $(formId).serialize(),
	statusCode: {
	  200: function(data){
	    if(callback) {
	      callback;
	    } 
	    location.href = formId;
            $(formId).fadeOut("fast", function(){
              $('#status').show().text(data);
              setTimeout("$.fancybox.close()", 2000);
            });

	  },
	  500: function() {
            $(formId).fadeOut("fast", function(){
              $('#status').show().text('Sorry! Error sending form, try again later.');
              setTimeout("$.fancybox.close()", 2000);
            });
	  }
	}

    });
    
}



function validateEmail(email) {
  var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if(filter.test(email)) {
    $("#email").removeClass("bg__icon--error");
    $("#email").addClass("bg__icon--success");
    return true;
  } else {
    $("#email").removeClass("bg__icon--success");
    $("#email").addClass("bg__icon--error");
    return false;
  }
  
}

function checkFormVal(element, length) {
  
  var val = $(element).val();
  if (val.length <= length) {
    $(element).addClass("bg__icon--error");
    $(element).removeClass("bg__icon--success");
    return false;
  } else {
   $(element).addClass("bg__icon--success");
   $(element).removeClass("bg__icon--error");
   return true;
  }
};

$(document).on('click', "#buyRequest #submit", function(){
    console.log('validating');
    var emailval = $("#email").val();
    var msgval = $("#message").val();
    var msglen = msgval.length;
    
    if (msglen < 4) {
        $('#msgError p').replaceWith('<p>Please write a message</p>');
    } else {
      $('#msgError p').replaceWith('<p></p>');;
    }
    checkFormVal('#name', 2);
    checkFormVal('#subject', 3);

    if (validateEmail(emailval) == true && msglen >= 4 && checkFormVal('#subject', 4) == true && checkFormVal('#name', 2) == true) {
      $("#submit").hide();
      $("#sendText").show();
      sendForm('#buyRequest', 'POST', '/contact');
    }
});

$(document).on('click', "#addProduct #submit", function(){
  $(this).hide();
  $("#sendText").show();
  sendForm('#addProduct', 'POST', '/api/catalog', populateData());
});

$(document).on('click', "#addProduct #updateSubmit", function(){
  $(this).hide();
  console.log($('#addProduct').serialize());
  $("#sendText").show();
  sendForm('#addProduct', 'PUT', '/api/catalog', populateData());
});


// MAGNIFIC ZOOM IMALGES ONCLICK
$(document).ready(function() {
   $( "#intro" ).parent().css("overflow", "hidden");
   galeryPopup();  
    // Elevate Zoom when hover image 
    //$('#zoom_01').elevateZoom();

$(document).on('click', ".modalbox#moreInfo", function(e){
  var title = $(this).siblings("h4").text();
  console.log(title);
  $('#subject').val(title);
  $('#status').hide();
  $("#buyRequest").show();
  $("#submit").show();
  $("#sendText").hide();
  
});

$(document).on('click', ".modalbox#addItem", function(e){
  $("#addProduct input[type=submit]").attr("id","submit");
  $('#status').hide();
  $("#addProduct").show();
  $("#addProduct #submit").show();
  $("#sendText").hide();
  
});

$(document).on('click', ".modalbox#editItem", function(e){
  var id = $(this).attr('rel');
  $('#status').hide();
  $("#addProduct").show();
  $("#addProduct input[type=submit]").attr("id","updateSubmit");
  $("#addProduct #updateSubmit").show();
  $("#sendText").hide();
  $.ajax({
    url: "/api/catalog/" + id, 
    type: "GET",
    dataType: "json",
    success: function (data) {
      $("#addProduct #title").val(data.title);
      $("#addProduct #imgUrl").val('');
      $("#addProduct #description").val(data.description);
      $("#addProduct #height").val(data.height);
      $("#addProduct #width").val(data.width);
      $("#addProduct #itemId").val(data._id);

    }
  })

  
});

$('.modalbox').fancybox();
$("#buyRequest, #addProduct").submit(function() {
    return false;
});


}); 

$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
    ajaxStop: function() { $body.removeClass("loading"); }    
});
  


