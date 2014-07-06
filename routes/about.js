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
  res.render('content/about');
  
})

module.exports = router;