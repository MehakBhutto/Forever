const express = require('express');
const {placeOrder, placeOrderStripe, verifyStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus} = require('../controllers/orderController');
const adminAuth = require('../middleware/adminAuth');
const authUser = require('../middleware/auth');

const orderRouter = express.Router()

//Admin Features
orderRouter.post('/list',adminAuth,allOrders);
orderRouter.post('/status',adminAuth, updateStatus)

//Payment Features
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);

//User Feature
orderRouter.post('/userorders', authUser, userOrders);

//verify payment
orderRouter.post('/verifyStripe', authUser, verifyStripe)
module.exports = orderRouter;