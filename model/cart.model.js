const ProductModel = require('./product.model');
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userID: String,
    items: [
        {
            productID: String,
            quantity: Number
        }
    ],
    totalQuantity: Number,
    totalPrice: Number
}, {collection: 'carts'});

const cartModel = mongoose.model('carts', cartSchema);


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
    Cart.totalPrice += parseInt(Cart.items[idProduct].price);
    return Cart;
}

module.exports.syncCart = async function(cart, userID){
    const cartObject = await cartModel.findOne({userID: userID});
    if (cartObject){
        await Promise.all(cartObject.items.map(async item => {
            let isExistProduct = false;
            const productID = item.productID;
            for (const itemKey in cart.items){
                if(productID==itemKey){
                    cart.items[itemKey].quantity += parseInt(item.quantity);
                    isExistProduct = true;
                    break;
                }
            }
            if (!isExistProduct){
                const product = await ProductModel.getProductByID(productID);
                cart.items[productID] = {
                    title: product.title,
                    img: product.img[0],
                    price: product.price,
                    quantity: item.quantity
                }
            }
        })

        )

        
        //edit total quantity + total price
        cart.totalQuantity = 0;
        cart.totalPrice = 0;
        let arrayItems = []
        for (const itemKey in cart.items){
            cart.totalQuantity = parseInt(cart.totalQuantity) + 1;
            cart.totalPrice += parseInt(cart.items[itemKey].price) * parseInt(cart.items[itemKey].quantity);
            arrayItems.push({productID: itemKey, quantity: cart.items[itemKey].quantity});
        }
        const newCart = new cartModel({
            userID: userID,
            items: arrayItems,
            totalPrice: cart.totalPrice,
            totalQuantity: cart.totalQuantity
        })
        await cartModel.remove({userID: userID})
        await newCart.save();
        return cart;
    }else{
        let arrayItems = [];
        const totalQuantity = cart.totalQuantity, totalPrice = cart.totalPrice;
        for (const proID in cart.items) {
            arrayItems.push({ productID: proID, quantity: cart.items[proID].quantity })
        }
        const newCart = new cartModel({
            userID: userID,
            items: arrayItems,
            totalQuantity: totalQuantity,
            totalPrice: totalPrice
        })
        newCart.save();
        return cart;
    }
    
}

module.exports.update = async (productID, userID) => {
    const cartDB = await cartModel.findOne({userID: userID});
    const product  = await ProductModel.getProductByID(productID);
    if (!cartDB){
        const newCart = new cartModel({
            userID: userID,
            items: {
                productID: productID,
                quantity: 1
            },
            totalPrice: product.price,
            totalQuantity: 1
        });
        await newCart.save();
    }else{
        for (const item of cartDB.items){
            if (item.productID == productID){
                //const newQuantity = item.quantity + 1;
                item.quantity++;
                const newTotalPrice = cartDB.totalPrice+ product.price;
                await cartModel.findOneAndUpdate({userID: userID}, {totalPrice: newTotalPrice, items: cartDB.items});
                return;
            }
        }
        cartDB.items.push({productID: productID, quantity: 1});
        cartDB.totalPrice += product.price;
        cartDB.totalQuantity += 1;
        cartDB.save();
    }
    
}

module.exports.get = async userID => {
    const cartObject = await cartModel.findOne({userID: userID}).exec();
    if(!cartObject){
        return null;
    }
    //put item to array
    var arrayItems = {};

    await Promise.all(cartObject.items.map(async item => {
        const product = await ProductModel.getProductByID(item.productID);
        const newItem = {
            title: product.title,
            quantity: item.quantity,
            price: product.price,
            img: product.img[0]
        };
        arrayItems[item.productID] = newItem;
    }))

    const cartSession = {
        items: arrayItems,
        totalQuantity: cartObject.totalQuantity,
        totalPrice: cartObject.totalPrice
    };
    return cartSession;
};

module.exports.removeProduct = async (idProduct, idUser) => {
    const cart = await cartModel.findOne({userID: idUser});
    if (cart.totalQuantity == 1){
        cart.remove();
        return;
    }
    for (const index in cart.items){
        if (cart.items[index].productID == idProduct) {
            const quantityProductDel = cart.items[index].quantity;
            const product = await ProductModel.getProductByID(idProduct);
            const priceProductDel = product.price;
            const totalQuantity = cart.totalQuantity - 1;
            const totalPrice = cart.totalPrice - quantityProductDel*priceProductDel;
            await cart.updateOne({totalPrice: totalPrice, totalQuantity: totalQuantity});
            await cart.updateOne({$pull: {items: {productID: idProduct}}});
            return;
        }
    }

}

module.exports.changeProductQuantity = async (productID, userID, isIncrease, price, quantity) => {
    const cart = await cartModel.findOne({userID: userID});
    var totalPrice = 0;
    if (isIncrease) {
        totalPrice = parseInt(cart.totalPrice) + parseInt(price);
    } else {
        totalPrice = cart.totalPrice - price;
    }
    await cartModel.findOneAndUpdate({userID: userID}, {$set: {totalPrice: totalPrice, "items.$[elem].quantity": quantity}}, {arrayFilters: [{"elem.productID": {$in: [productID]}}]});
}

module.exports.getCartByUserID = userID => cartModel.findOne({userID: userID});

module.exports.removeCart = function(cart){
    cart.remove();
}