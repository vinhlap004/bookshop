//1.require mongoose
var mongoose = require('mongoose');


//3.tạo Schema
var productsSchema = new mongoose.Schema({
  title: String,
  price: Number,
  author: String,
  categoriesID: [String],
  publisherID: String,
  info: String,
  img: [String],
  countView: Number,
  count: Number
}, { collection: 'products' });

//4.tạo model
const productModel = mongoose.model('products', productsSchema);

module.exports.getTotalProduct = function(minPrice, maxPrice, publisherID, categoriesID, regex){
  minPrice = parseInt(minPrice) - 1;
  maxPrice = parseInt(maxPrice) + 1;

  if (regex == null)
    return productModel.find({ price: { $gt: minPrice, $lt: maxPrice }, publisherID: { $in: publisherID }, categoriesID: { $in: categoriesID } })
                    .count();
    return productModel.find({ $or: [{ title: regex }, { author: regex }], price: { $gt: minPrice, $lt: maxPrice }, publisherID: { $in: publisherID }, categoriesID: { $in: categoriesID } })
                   .count();
}
module.exports.getProductByAttr = function(minPrice, maxPrice, publisherID, categoriesID, regex){
  minPrice = parseInt(minPrice) - 1;
  maxPrice = parseInt(maxPrice) + 1;

  if (regex == null)
    return productModel.find({price: {$gt: minPrice, $lt : maxPrice}, publisherID: {$in: publisherID}, categoriesID: {$in: categoriesID}})
  return productModel.find({ $or: [{title: regex}, {author: regex}], price: {$gt: minPrice, $lt : maxPrice}, publisherID: {$in: publisherID}, categoriesID: {$in: categoriesID}})
}
module.exports.sortProduct = function(productObject, sortBy){
  return productObject.sort(sortBy);
}
module.exports.getProductAtPage = function(productObject, page, products_per_page){
  return productObject.skip(page*products_per_page).limit(products_per_page);
}
module.exports.getProductByID = function(id){
  return productModel.findById(id).exec();
}
module.exports.getRelatedProduct = product => 
  productModel.find({$or : [{author: product.author}, {categoriesID: product.categoriesID}]}).limit(16);

module.exports.getAllProduct = () => productModel.find();


