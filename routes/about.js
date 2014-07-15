/**
 * TODO
 * 
 * Mix req.flash with flash-validator to use req.flash for the errors in a form
 * 
 */






var express = require('express');
var router = express.Router();
var ContentModel = require('.././js/mongoose').ContentModel;


router.route('/')
.get(function (req, res) {
  var query = {section: 'about'};
  ContentModel.findOne(query, function(err, content){
    if (content) {
      res.render('content/about', {content: content});
    } else {
      res.send(err); 
    }
    
  });  
})

module.exports = router;