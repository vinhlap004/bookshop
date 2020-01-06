//1.require mongoose
var mongoose = require('mongoose');


//3.tạo Schema
var categoriesSchema = new mongoose.Schema({
  categoriesID: String,
  categories: String
}, { collection: 'categories' });

//4.tạo model

var categories = mongoose.model('categories', categoriesSchema);

module.exports.getAllCategories = function() {
  return categories.find();
}

module.exports.getListCategoriesByID = arrayID => categories.find().where('categoriesID').in(arrayID);
