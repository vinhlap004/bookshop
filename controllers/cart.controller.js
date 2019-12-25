const CartModel = require('../model/cart.model')

module.exports.add_to_cart = async function(req, res){
    //get id product
    const idProduct = req.body.id;
    
    let idCart = req.session.cart;
    let cart = await CartModel.init(idCart)
    //add product to cart
    cart = await CartModel.add(cart, idProduct);
    req.session.cart = cart;
    if(req.user){
        CartModel.update(cart, req.user.id);
        
    }
    console.log(req.session.cart);
    res.json({totalQuantity: cart.totalQuantity});
}