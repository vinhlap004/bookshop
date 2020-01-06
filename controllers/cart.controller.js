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

module.exports.remove_item = async function(req, res){
    const idProduct = req.body.id;
    
    //remove in db
    if (req.user) {
        const idUser = req.user.id;
        await CartModel.removeProduct(idProduct, idUser);
    }

    //remove in session and update quantity, totalprice
    const totalQuantity = req.session.cart.totalQuantity-1;
    if (req.session.cart.totalQuantity == 1){
        req.session.cart = {items : {}, totalQuantity : 0, totalPrice : 0};
    } else{
        const cart = req.session.cart;
        const priceProductDel = cart.items[idProduct].price;
        const quantityProductDel = cart.items[idProduct].quantity;
        cart.totalQuantity--;
        delete cart.items[idProduct];
        cart.totalPrice = cart.totalPrice - priceProductDel*quantityProductDel;
        req.session.cart = cart;
    }
    const data = {totalQuantity: req.session.cart.totalQuantity, totalPrice: req.session.cart.totalPrice};
    res.status(200);

    res.send(data);
}

module.exports.increase_item = async function(req, res){
    //update cart in session
    const productID = req.body.id;
    const cart = req.session.cart;
    const quantity = ++cart.items[productID].quantity;
    
    const price = cart.items[productID].price;
    cart.totalPrice += price;
    req.session.cart = cart;

    //update cart in db
    if (req.user){
        const userID = req.user.id;
        await CartModel.changeProductQuantity(productID, userID, true, price, quantity);
    }
    res.status(200);
    res.send();
}

module.exports.descrease_item = async function(req, res){
    //update cart in session
    const productID = req.body.id;
    const cart = req.session.cart;
    const quantity = --cart.items[productID].quantity;
    const price = cart.items[productID].price;
    cart.totalPrice -= price;
    req.session.cart = cart;

    //update cart in db
    if (req.user){
        const userID = req.user.id;
        await CartModel.changeProductQuantity(productID, userID, false, price, quantity);
    }
    res.status(200);
    res.send();
}

module.exports.fillCheckout = (req, res) => {
    if (req.user)
        res.render('checkout');
    else
        res.render('login');
}