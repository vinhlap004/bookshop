const ProductModel = require('../model/products.model');
const UserModel = require('../model/user.model');
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userID: String,
    items: [Object],
    totalQuantity: Number,
    totalPrice: Number
}, {collection: 'carts'});

const carts = mongoose.model('carts', cartSchema);


module.exports.init = function(Cart){
    if (!Cart){
        const cart = {items : {}, totalQuantity : 0, totalPrice : 0};
        return cart;
    }
    return Cart;
}
module.exports.add = async function(Cart, idProduct){
    //exist product
    if (Cart.items[idProduct]){
        Cart.items[idProduct].quantity++;
    }else{
        const product = await ProductModel.getProductByID(idProduct);
        const item = {title: product.title, quantity: 1, price: product.price, img: product.img[0]};
        Cart.items[idProduct] = item;
        Cart.totalQuantity++;
    }
    Cart.totalPrice += Cart.items[idProduct].price;
    return Cart;
}

module.exports.update = async function(cart, userID){
    await carts.remove({userID: userID});
    let arrayItems = [];
    const totalQuantity = cart.totalQuantity, totalPrice = cart.totalPrice;
    for (const proID in cart.items){
        arrayItems.push({productID: proID, quantity: cart.items[proID].quantity})
    }
    const newCart = new carts({
        userID: userID,
        items : arrayItems,
        totalQuantity: totalQuantity,
        totalPrice: totalPrice
    })
    await newCart.save();
}

module.exports.get = async userID => {
    const cartModel = await carts.findOne({userID: userID});
    if(!cartModel){
        return null;
    }
    //put item to array
    var arrayItems = {};
    for (i=0;i<cartModel.items.length; i++){
        const proID = cartModel.items[i].productID;
        const product = await ProductModel.getProductByID(proID);
        const newItem = {
            title: product.title,
            quantity: cartModel.items[i].quantity,
            price: product.price,
            img: product.img[0]
        };
        arrayItems[proID] = newItem;
    }
    const cartSession = {
        items: arrayItems,
        totalQuantity: cartModel.totalQuantity,
        totalPrice: cartModel.totalPrice
    };
    return cartSession;
};

