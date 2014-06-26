/**
 * TODO
 * 
 * Mix req.flash with flash-validator to use req.flash for the errors in a form
 * 
 */






var express = require('express');
var router = express.Router();
var email = require('.././js/email.js');


router.route('/')
.get(function (req, res) {
  res.render('content/contact');
  
})
.post(function (req, res) {
  req.assert('name', 'Please enter your name').notEmpty();
  //req.assert('email', 'Please enter your email').notEmpty();
  req.assert('email', 'Valid email required').isEmail();
  req.assert('message', 'Please write a message').len(5, 1000);
  //var mappedErrors = req.validationErrors(true);
  var valErrors = req.validationErrors();
  var dataForm = {};
  console.log(valErrors);
  //construct the email sending module
  
  //send Email
  if(!valErrors) {
    email.smtpConfig.sendMail(email.mailOptions(req.body.email, req.body.name, req.body.subject, req.body.message), function (error, response) {
      //Email not sent
      if (error) {
        req.flash('error', 'An arror ocurred sending the request!');
	res.redirect('/contact/#contact');
	console.log(error);
      }
     //email sent successfully
      else {
        req.flash('info', 'Request sent! I will responde as soon as possible');
        res.redirect('/contact/#contact');

    //res.end("Email sent successfully");
      }
    });
  }
  else {
    dataForm.name = req.body.name;
    dataForm.email = req.body.email;
    //app.locals.msg = msg;
    req.flash('dataForm', dataForm);
    req.flash('valErrors', valErrors);
    res.redirect('/contact/#contact-form');
    
  }
});
router.get('/:title', function (req, res) {
  res.locals.title = req.params.title;
  res.render('content/contact');
  
})


module.exports = router;