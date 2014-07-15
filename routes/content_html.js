/**
 * TODO
 * 
 * Mix req.flash with flash-validator to use req.flash for the errors in a form
 * 
 */






var express = require('express');
var router = express.Router();
var requireUser = require('.././js/cms-helpers').requireUser;
var ContentModel = require('.././js/mongoose').ContentModel;


router.route('/')
.post(requireUser("admin"), function (req, res) {
  console.log(req.body);
  var query = {title: req.body.title};
  var content = new ContentModel({
    section: req.body.section,
    title: req.body.title,
    body: req.body.body
  });
  ContentModel.findOne(query, function(err, title){
    if (title) {
      err = 'The item already exists';
      res.send(err);
    } else { 
      content.save(function(err,content){
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          res.send('Success');
        }
      });
    }
  });  
})

router.put('/:section', requireUser("admin"), function (req, res) {
  var query = {section: req.params.section};
  ContentModel.findOne(query, function(err, content){
    if (content) {
      content.section = req.body.section,
      content.title = req.body.title,
      content.body = req.body.body,
      content.save(function(err){
        if (err) {
          console.log(err);
          return res.send(err);
        } else {
          res.send('Success');
        }
      })
    } else {
      res.send(err); 
    }  
  });  
});

router.get('/:section', function (req, res) {
  var query = {section: req.params.section};
  ContentModel.findOne(query, function(err, content){
    if (content) {
      res.json(content);
    } else {
      res.send(err); 
    }  
  });  
});

module.exports = router;