var mongoose = require('mongoose');
var crypto = require('crypto');
var log = require('./log')(module);
var config = require('./config');

mongoose.connect(config.get('mongoose:uri'));


var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

// Mongo Shema

var Schema = mongoose.Schema;

// Article

var Images = new Schema({
    kind: {
        type: String,
        enum: ['thumbnail', 'detail'],
        required: true
    },
    url: { 
      type: String, 
      required: true 
    }
});



// Category
var Category = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  }

});

var CategoryModel = mongoose.model('Category', Category);


// Catalog Item
var CatalogItem = new Schema({
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    height: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    images: [Images],
    modified: { 
      type: Date, 
      default: Date.now 
    }
});

CatalogItem.path('title').validate(function (v) {
    return v.length > 1 && v.length < 70;
});

var CatalogModel = mongoose.model('CatalogItem', CatalogItem);


// Roles
var Role = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  }

});

var RoleModel = mongoose.model('Role', Role);


// User
var User = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    role: {
      type: Schema.Types.ObjectId, 
      ref: 'Role'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

User.methods.encryptPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 512).toString('base64');
    //less secure - return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

User.virtual('userId')
    .get(function () {
        return this.id;
    });

User.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(512).toString('base64');
        //less secure - this.salt = crypto.randomBytes(32).toString('base64');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });


User.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

var UserModel = mongoose.model('User', User);



module.exports.mongoose = mongoose;
module.exports.CatalogModel = CatalogModel;
module.exports.UserModel = UserModel;
module.exports.RoleModel = RoleModel;
module.exports.CategoryModel = CategoryModel;

