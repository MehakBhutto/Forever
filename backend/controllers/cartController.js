const userModel = require("../models/userModel");


//add products to user cart
const addtoCart = async(req, res) => {
    try{

        const userId = req.body.userId;
        const { itemId, size } = req.body;

        const userData = await userModel.findById(userId);
        const cartData = await userData.cartData;

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }else{
                cartData[itemId][size] = 1;
            }
        }else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        await userModel.findByIdAndUpdate(userId, {cartData});
        
        res.json({success:true, messsage:"Added to Cart"})

    }catch(e){
        console.log(e.message)
        res.json({success:false, messsage:e.message})
    }
}

//update yser cart
const updateCart = async(req, res) => {
    try{

        const userId = req.body.userId;
        const {itemId, size, quantity} = req.body;

        const userData = await userModel.findById(userId);
        const cartData = await userData.cartData;

        cartData[itemId][size] = quantity
        await userModel.findByIdAndUpdate(userId, {cartData});
        
        res.json({success:true, messsage:"Cart Updated"})

    }catch(e){
        console.log(e.message)
        res.json({success:false, messsage:e.message})
    }
}

//get user cart data
const getUserCart = async(req, res) => {
    try{

        const userId = req.body.userId;

        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData

        res.json({success:true, cartData})

    }catch(e){
        console.log(e.message)
        res.json({success:false, messsage:e.message})
    }
}

module.exports = { addtoCart, updateCart, getUserCart}