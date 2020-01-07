const cartModel = require('../model/cart.model');
const orderModel = require('../model/order.model');



module.exports.checkout = async function(req, res){
    const body = req.body;
    const userID = req.user.id,
        name = body.name,
        phone = body.phone,
        address = body.address,
        status = 0,
        shipping = body.shipping,
        feeShipping = body.feeShipping,
        payment = body.payment;
    const date = Date.now();
    const timeline = {
        ordering: date,
        waiting: 0,
        delivering: 0,
        delivered: 0,
        canceled: 0
    }

    const cart = await cartModel.getCartByUserID(userID);
    
    await orderModel.addOrder(name, phone, address, cart, status, shipping, timeline, feeShipping, payment);
    cartModel.removeCart(cart);
    req.session.cart = null;
    res.status(200);
    res.send();
}