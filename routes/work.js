var express = require('express');
var router = express.Router();
var CatalogModel = require('.././js/mongoose').CatalogModel; 


router.get('/', function(req, res, next) {
    
    CatalogModel.find({}, null, {skip: 0, limit: 4}).sort('id').populate('category').exec(function(err, items){
    items.forEach(function(item) {
      console.log(item._id);
    });
    res.render('content/work', {items:items});  
  })
  
}) 

router.get('/:page', function(req, res, next) {
    
    var page = req.params.page;
    var limit = 4;
    page = page * limit;
    CatalogModel.find({}, null, {skip: page, limit: limit}).sort('id').populate('category').exec(function(err, items){
      if(items.length > 0) {
        res.render('content/data', {items:items});  
      } else {
        res.send('no more data');
      }
  })

  
}) 
/*router.get('/', function(req, res, next) {
    CatalogModel.find().populate('category', {name: 'Oil'}).exec(function(err, items){
    res.render('content/work', {items:items});  
  })
  
})*/

module.exports = router;
