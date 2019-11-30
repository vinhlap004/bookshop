require('dotenv').config()
//1.require mongoose
var mongoose = require('mongoose');

//2.connect
if (mongoose.connect(process.env.DB_HOST,{useNewUrlParser:true,useUnifiedTopology: true })){
	console.log('connected to database\n');
}

//3.tạo Schema
var usersSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  phonenumber: Number
}, { collection: 'users' });

//4.tạo model
var users = mongoose.model('users', usersSchema);
module.exports = users;