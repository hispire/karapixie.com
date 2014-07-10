/**
 * TODO
 * 
 * Refactor POST
 * Send the data for the CATEGORY field with dataForm when validate form
 * Send error messages when item not found in DB and redirect and render error
 * Delete image if cancel or close form submit
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
var randomString = require('../.././js/cms-helpers').randomString;
var getCategory = require('../.././js/cms-helpers').getCategory;
var CatalogModel = require('../.././js/mongoose').CatalogModel; 
var flash = require('express-flash');
var expressValidator = require('express-validator');
var fs = require('fs');
var imagemagick = require('imagemagick-native');
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
      dataForm.title = req.body.title;
      dataForm.description = req.body.description;
      req.flash('dataForm', dataForm);
      req.flash('valErrors', valErrors);
      res.send('Incorrect Data!');
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
	images: [{kind: "detail", url: req.body.imgDetailUrl},
                 {kind: "thumbnail", url: req.body.imgThumbUrl}]
	});
	//var categories = req.body.categories; 
	CatalogModel.findOne(query, function(err, itemname){
	    if (itemname) {
	      err = 'The item already exists';
	      res.send(err);
	    } else { 
	      item.save(function(err,item){
		if (err) {
		  console.log(err);
		  res.send(err);
		} else {
		  res.send('Success');
		}
	      });
	    }
	}); 
  }
})

.put(requireUser("admin"), function(req, res) {
  // PUT method to modify element with a hacked POST form with PUT input
  console.log(req.body);
  CatalogModel.findById(req.body.item_id, function(err, item) {
    if(!item) {
      console.log('no item with taht id');
      res.send('No item with that id');
    }
    if(err) {
      res.send(err);
    } else {
      if(req.body.imgDetailUrl != '') {
        deleteFile('./public' + item.images[0].url);
        deleteFile('./public' + item.images[1].url);
        item.images = [{kind: "detail", url: req.body.imgDetailUrl},
                       {kind: "thumbnail", url: req.body.imgThumbUrl}];
      }
      // delete tmp images if there is an error validating the form
      item.title = req.body.title,
      item.category = req.body.category,
      item.sold = req.body.sold,
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
  console.log(req.files);
  var tmp_path = req.files.file.path;
  var img_name = randomString(16);
  var target_path = './public/images/' + img_name + '.jpg';
  var url_img = '/images/' + img_name + '.jpg';
  // move the file from the temporary location to the intended location
  renameFile(tmp_path, target_path, function(err, msg) {
    if (err) {
      console.log(err);
      res.send = 'An error ocurred! Sorry try again' + err;
      //res.redirect('/admin/catalog');
    } else {
      var imageFull = fs.readFileSync(target_path);
      var resizedBuffer = imagemagick.convert({
          srcData: imageFull, // provide a Buffer instance
          height: 400,
          resizeStyle: "aspectfit",
          quality: 80,
          format: 'JPEG'
      });
      var thumbPath = './public/images/thumbs/' + img_name + '-small' + '.jpg';
      var thumbUrl = '/images/thumbs/' + img_name + '-small' + '.jpg';
      fs.writeFileSync(thumbPath, resizedBuffer, 'binary');
      res.send({'imgDetail': url_img, 'imgThumb': thumbUrl});
    }
  });
});

router.get('/catalog/:id', getCategory, function(req, res) {
  CatalogModel.findById(req.params.id).populate('category').exec(function(err, item) {
    if(!item) {
      console.log('no item with taht id');
      res.send('No item with that id');
    }
    if(err) {
      console.log(err);
      res.send(err);
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
  CatalogModel.findById(req.params.id, function(err, item) {
    if(!item) {
      console.log('no item with taht id');
      res.send('No item with that id');
    }
    if(err) {
      console.log(err);
      res.send(err);
    } else {
      item.remove(function(err) {
        deleteFile('./public' + item.images[0].url);
        deleteFile('./public' + item.images[1].url);
        if(err) {
          console.log(err); 
          res.send({error: err});
        } else {
          console.log("removed");
          res.send('Removed');
        }
      });
    }
  });
}); 

module.exports = router;
