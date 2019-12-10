//1.require mongoose
const mongoose = require('mongoose');

//3.tạo Schema
const publisherSchema = new mongoose.Schema({
  publisherID: String,
  publisher: String
}, { collection: 'publishers' });

//4.tạo model
const publishers = mongoose.model('publishers', publisherSchema);
module.exports = publishers;

module.exports.getAllPublishers = function(){
  return publishers.find();
}
module.exports.getPublisherByID = function(id){
  return publishers.findById(id);
}
module.exports.getPublisherByName = function(name){
  return publishers.findOne({publisherID: name});
}