//1.require mongoose
var mongoose = require('mongoose');

//2.connect
if (mongoose.connect('mongodb+srv://linh796:linh796@cluster0-lbsr0.mongodb.net/bookshop?retryWrites=true&w=majority')){
	console.log('connected to database\n');
}

//3.tạo Schema
var productsSchema = new mongoose.Schema({
  title: String,
  price: Number,
  author: String,
  categoriesID: String,
  publisherID: String,
  info: String,
  img: [String]
}, { collection: 'products' });

//4.tạo model
var products = mongoose.model('products', productsSchema);
module.exports = products;
