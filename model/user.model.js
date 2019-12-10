//1.require mongoose
const mongoose = require('mongoose');

// //2.connect
// if (mongoose.connect(process.env.DB_HOST,{useNewUrlParser:true,useUnifiedTopology: true })){
// 	console.log('connected to database\n');
// }

//3.tạo Schema
var usersSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  phonenumber: Number
}, { collection: 'users' });

//4.tạo model
const users = mongoose.model('users', usersSchema);
module.exports.getUserByID = function(id){
  return users.findById(id);
}

module.exports.createUser = function(email, password, name, phonenumber){
  return new users ({email, password, name, phonenumber});
}

module.exports.findEmail = function(email){
  console.log("email: " + email);
  return users.findOne({email: email});
}
