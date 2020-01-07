//1.require mongoose
const mongoose = require('mongoose');


//3.tạo Schema
const categoriesSchema = new mongoose.Schema({
  categoriesID: String,
  categories: String
}, { collection: 'categories' });

//4.tạo model

const categoriesModel = mongoose.model('categories', categoriesSchema);

module.exports.getAllCategories = function() {
  return categoriesModel.find();
}

module.exports.getListCategoriesByID = arrayID => categoriesModel.find().where('categoriesID').in(arrayID);
