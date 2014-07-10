var express = require('express');
var router = express.Router();
var CatalogModel = require('.././js/mongoose').CatalogModel; 
var CategoryModel = require('.././js/mongoose').CategoryModel;
var getCategory = require('.././js/cms-helpers').getCategory;


router.get('/', getCategory, function(req, res, next) {
    CatalogModel.find({}, null, {skip: 0, limit: 4}).populate('category').exec(function(err, items){
      res.render('content/work', {items:items});  
  })
}) 

router.get('/:category/:page', getCategory, function(req, res, next) {
  var category = req.params.category;
  var data;
  var page = req.params.page;
  var limit = 4;
  page = page * limit;
  if(category == 'all') { 
    CatalogModel.find({}, null, {skip: page, limit: limit}).populate('category').exec(function(err, items){ 
      if(items.length > 0) {
        res.render('content/data', {items:items});
      } else {
        res.send('no more data');
      }
    })
  } else {
    CatalogModel.find({}, null, {skip: page, limit: limit}).populate('category').where('category').equals(category).exec(function(err, items){
      if(items.length > 0) {
        res.render('content/data', {items:items});
      } else {
        res.send('no more data');
      }
    })
  }


}) 

module.exports = router;
