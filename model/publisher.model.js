//1.require mongoose
const mongoose = require('mongoose');

//3.tạo Schema
const publisherSchema = new mongoose.Schema({
  publisherID: String,
  publisher: String
}, { collection: 'publishers' });

//4.tạo model
const publisherModel = mongoose.model('publishers', publisherSchema);


module.exports.getAllPublishers = function(){
  return publisherModel.find();
}
module.exports.getPublisherByID = function(id){
  return publisherModel.findById(id);
}
module.exports.getPublisherByName = function(name){
  return publisherModel.findOne({publisherID: name});
}