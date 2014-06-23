var express = require('express');
var router = express.Router();
var CatalogModel = require('.././js/mongoose').CatalogModel; 

function renderpage (pagetemplate, pagetitle) {
  return function(req, res) {
    res.render(pagetemplate, {title: pagetitle});
  };
};

router.get('/', function(req, res, next) {
    res.render('content/intro');    
}) 

router.get('/index', function(req, res, next) {
    CatalogModel.find().sort('-modified').limit(4).populate('category').exec(function(err, items){
    res.render('content/index', {items:items});  
  })
  
}) 

router.get('/lang/:locale', function(req, res, next) {
  res.cookie('locale', req.params.locale);
  res.redirect('/index'); 
});
module.exports = router;
