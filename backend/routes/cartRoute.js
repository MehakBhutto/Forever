const express = require('express');
const {addtoCart, updateCart, getUserCart} = require('../controllers/cartController');
const authUser = require('../middleware/auth')
const cartRouter = express.Router();

cartRouter.post('/get',authUser,getUserCart);
cartRouter.post('/add',authUser,addtoCart);
cartRouter.post('/update',authUser, updateCart);

module.exports = cartRouter;