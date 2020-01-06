//1.require mongoose
const mongoose = require('mongoose');


//3.tạo Schema
var usersSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  address: String,
  phonenumber: Number,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  orderAddress: Object
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
  return users.findOne({email: email});
}

module.exports.updateOrderAddressByID = (userID, name, phone, address) => {
   const orderAddress = {
     name: name,
     phone: phone,
     address: address
   }
   return users.findOneAndUpdate({_id: userID}, {orderAddress: orderAddress}, {new: true});
}
