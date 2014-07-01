/**
 * TODO
 * 
 * Refactor POST
 * Send the data for the CATEGORY field with dataForm when validate form
 * Send error messages when item not found in DB and redirect and render error
 * 
 * FIX error when update image if the image already exist
 * FIX error when delete item if it has no image.
 * Mix implementation for req.flash and express-validator
 * 
 */


var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir:'./public/images'});
var requireUser = require('../.././js/cms-helpers').requireUser;
var renameFile = require('../.././js/cms-helpers').renameFile;
var deleteFile = require('../.././js/cms-helpers').deleteFile;
var getCategory = require('../.././js/cms-helpers').getCategory;
var CatalogModel = require('../.././js/mongoose').CatalogModel; 
var flash = require('express-flash');
var expressValidator = require('express-validator');
var fs = require('fs');

/**
 * Products REST API
 */
router.route('/')
.get(requireUser("admin"), getCategory, function(req, res){
  CatalogModel.find().populate('category').exec(function(err, items) {
    if(err) {
      console.log(err);
      res.status(500);
      res.send('Sorry error with DB');
    } else {
      res.format({
        'text/plain': function(){
          res.send('/api/catalog to retrieve data');
        },
  
        'text/html': function(){
          res.locals.items = items;
          res.render('catalog');
        },
  
        'application/json': function(){
           res.send('/api/catalog to retrieve data');
        }
      });
    }
  }); 
})



router.post('/upload', requireUser("admin"), multipartMiddleware, function(req, res) {
  // get the temporary location of the file
  console.log(req.files.files);
  console.log(req.files.file.path);
  console.log(req.files.file.originalFilename);
  var tmp_path = req.files.file.path;
  var target_path = './public/images/' + req.files.file.name;
  var url_img = '/images/' + req.files.file.name;
  // move the file from the temporary location to the intended location
  renameFile(tmp_path, target_path, function(err, msg) {
    if (err) {
      console.log('error renaming and moving image');
      res.send = 'An error ocurred! Sorry try again' + err;
      //res.redirect('/admin/catalog');
    } else {
      res.send(url_img);
    }
  });
});


router.delete('/:id', requireUser("admin"), function(req, res) {
  return CatalogModel.findById(req.params.id, function(err, item) {
    if(!item) {
      console.log('no item with taht id');
      return res.send('No item with that id');
    }
    return item.remove(function(err) {
      var img_url = './public' + item.images[0].url;
      fs.unlink(img_url, function(err) {
        if(err) throw err;
      });
      if(err) {
        console.log(err); 
        res.send({error: err});
      }
    console.log("removed");
    retStatus = 'Success';
    // res.redirect('/team');
    res.send({
      retStatus : retStatus,
      redirectTo: '/admin/catalog'
      });
    });
  }); 
});

module.exports = router;
