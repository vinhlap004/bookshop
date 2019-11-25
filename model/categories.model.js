require('dotenv').config()
//1.require mongoose
var mongoose = require('mongoose');

//2.connect
if (mongoose.connect(process.env.DB_HOST,{useNewUrlParser:true,useUnifiedTopology: true })){
	console.log('connected to database\n');
}

//3.tạo Schema
var categoriesSchema = new mongoose.Schema({
  categoriesID: String,
  categories: String
}, { collection: 'categories' });

//4.tạo model

var categories = mongoose.model('categories', categoriesSchema);
module.exports = categories;

