//1.require mongoose
var mongoose = require('mongoose');

//2.connect
if (mongoose.connect('mongodb+srv://linh796:linh796@cluster0-lbsr0.mongodb.net/bookshop?retryWrites=true&w=majority')){
	console.log('connected to database\n');
}

//3.tạo Schema
var publisherSchema = new mongoose.Schema({
  publisherID: String,
  publisher: String
}, { collection: 'publishers' });

//4.tạo model
var publishers = mongoose.model('publishers', publisherSchema);
module.exports = publishers;
