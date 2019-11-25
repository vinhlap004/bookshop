require('dotenv').config()
//1.require mongoose
var mongoose = require('mongoose');

//2.connect
if (mongoose.connect(process.env.DB_HOST,{useNewUrlParser:true,useUnifiedTopology: true })){
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
