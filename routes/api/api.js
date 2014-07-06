/**
 * TODO
 * 
 * Refactor POST
 * Send the data for the CATEGORY field with dataForm when validate form
 * Send error messages when item not found in DB and redirect and render error
 * 
 * FIX error when update image if the image already exist
 * FIX error when delete item if it has no image.
 * Upload image and then submit form-data
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
router.route('/catalog')
.get(getCategory, function(req, res){
  CatalogModel.find().populate('category').exec(function(err, items) {
    if(err) {
      console.log(err);
      res.status(500);
      res.send('Sorry error with DB');
    } else {
      res.format({
        'text/plain': function(){
          res.send('hey');
        },
  
        'text/html': function(){
          res.locals.items = items;
          res.render('catalog-data');
        },
  
        'application/json': function(){
           res.json(items);
        }
      });
    }
  }); 
})

.post(requireUser("admin"), multipartMiddleware, function(req, res) {

    console.log(req.body.imgUrl);
    req.assert('title', 'Please write a title').notEmpty();
    req.assert('description', 'Please write a description').len(5, 1000);
    var valErrors = req.validationErrors();
    var dataForm = {};
 
    // check if the filename is empty so the user didn't upload an image 
    if(req.body.imgUrl === '') {
      if(valErrors){  
	
        valErrors.push({param: 'file', msg: 'Please upload a picture'});
      } else {
        valErrors = {param: 'file', msg: 'Please upload a picture'};
      }
    }
    if(valErrors) {
      console.log('val errors');
      
      // delete tmp images if there is an error validating the form
      deleteFile(tmp_path);
      dataForm.title = req.body.title;
      dataForm.description = req.body.description;
      req.flash('dataForm', dataForm);
      req.flash('valErrors', valErrors);
      res.send('Val Errors!');
     
      } else {
	
	   
	console.log("POST: ");
	console.log(req.body);
	var query = {title: req.body.title}; 
	var item = new CatalogModel({
	title : req.body.title,
	category: req.body.category,
	height: req.body.height,
	width: req.body.width,
	description : req.body.description,
	images: [{kind: "detail", url: req.body.imgUrl}]
	});
	//var categories = req.body.categories; 
	CatalogModel.findOne(query, function(err, itemname){
	    if (itemname) {
	      err = 'The item already exists';
	      return res.send(err);
	    } else { 
	      item.save(function(err,item){
		if (err) {
		  console.log(err);
		  return res.send(err);
		} else {
		  res.send('Success');
		  //res.redirect('/admin/catalog');
	    
	    // send response to cath it with javascript in client side AJAX controller)
	    //retStatus = 'Success';
	    //res.send({
	      //retStatus : retStatus,
	      //redirectTo: '/admin/products'
	    //});
		}
	      });
	    }
	}); 
  }
})

.put(requireUser("admin"), function(req, res) {
  // PUT method to modify element with a hacked POST form with PUT input
  CatalogModel.findById(req.body.item_id, function(err, item) {
    if(req.body.imgUrl != '') {
      console.log('uploading');
      deleteFile('./public' + item.images[0].url);
      item.images = [{kind: "detail", url: req.body.imgUrl}];
      item.title = req.body.title,
      item.height = req.body.height,
      item.width = req.body.width,
      item.category = req.body.category,
      item.description = req.body.description,
      item.save(function(err,item){
        if (err) {
          console.log(err);
          return res.send(err);
        } else {
          res.send('Success');
        }
      })
    } else {
      // delete tmp images if there is an error validating the form
      item.title = req.body.title,
      item.category = req.body.category,
      item.height = req.body.height,
      item.width = req.body.width,
      item.description = req.body.description,
      item.save(function(err,item){
        if (err) {
          console.log(err);
          return res.send(err);
        } else {
          res.send('Success');
        }
      })
    }
  })
})

router.post('/catalog/upload', requireUser("admin"), multipartMiddleware, function(req, res) {
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

router.get('/catalog/:id', getCategory, function(req, res) {
  CatalogModel.findById(req.params.id).populate('category').exec(function(err, item) {
    if(!item) {
      console.log('no product with taht id');
      return res.send('No product with that id');
    }
    if(err) {
      return console.log(err);
    } else {
      res.format({
        'text/plain': function(){
          res.send('hey');
        },
  
        'text/html': function(){
          res.locals.item = item;
          res.render('catalog-item');
        },
  
        'application/json': function(){
           res.json(item);
        }
      });
    }
  }); 
})



router.delete('/catalog/:id', requireUser("admin"), function(req, res) {
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
    res.send('Removed');
      });
    });
  }); 

module.exports = router;
