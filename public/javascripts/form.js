function sendForm(formId, method, url, populate) { 
  
    $.ajax({
        type: method,
        url: url,
        data: $(formId).serialize(),
	statusCode: {
	  200: function(data){
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
	},
	complete: function() {
	  console.log('complete put');
	  if (populate) {
	    populateData();
	  }
	}

    }).done(function() {
        console.log('put done'); 
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

$(document).on('click', ".modalbox#moreInfo", function(e){
  var title = $(this).siblings("h4").text();
  console.log(title);
  $('#subject').val(title);
  $('#status').hide();
  $("#buyRequest").show();
  $("#submit").show();
  $("#sendText").hide();
  
});
