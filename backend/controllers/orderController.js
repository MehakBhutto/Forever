const orderModel = require('../models/orderModel');
const userModel = require('../models/userModel');
const Stripe = require('stripe')

//global variables
const currency = 'usd'
const delivery_charge = 10;

//gateay initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//Placing orders using COD Method
const placeOrder = async (req, res) => {
    try {

        const userId = req.body.userId;
        const { items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({ success: true, message: 'Order Placed Successfully' });

    } catch (e) {
        console.log(e.message);
        res.json({ success: false, message: e.message })
    }
}

//Place order using Strpe Method
const placeOrderStripe = async (req, res) => {
    try{

        const userId = req.body.userId;
        const { items, amount, address } = req.body
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item)=> ({
            price_data: {
                currency:currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price *100,
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency:currency,
                product_data: {
                    name: 'Delievery Charges'
                },
                unit_amount: delivery_charge * 100,
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:  `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({success:true, session_url:session.url})
    }catch(e){
        console.log(e.message);
        res.json({ success: false, message: e.message })
    }
}

//verify stripe
const verifyStripe = async (req,res) =>{
    try{
        const userId = req.body.userId;
        const { orderId, success } = req.body

        if(success === "true"){{
            await orderModel.findByIdAndUpdate(orderId, {payment: true})
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true})
        }}else{
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: false})
        }
    }catch(e){
        console.log(e.message);
        res.json({ success: false, message: e.message })
    }
}

//Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => { }

//All Orders data for Admin Panel
const allOrders = async (req, res) => {
    try {

        const orders = await orderModel.find({})
        res.json({ success: true, orders })

    } catch (e) {
        console.log(e.message);
        res.json({ success: false, message: e.message })
    }
}

//User order Data for Frontend
const userOrders = async (req, res) => {
    try {

        const userId = req.body.userId;

        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })

    } catch (e) {
        console.log(e.message);
        res.json({ success: false, message: e.message })
    }
}

//update order status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: 'Status updated' })

    } catch (e) {
        res.json({ success: false, message: e.message })

    }
}

module.exports = { placeOrder, placeOrderStripe, verifyStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus }