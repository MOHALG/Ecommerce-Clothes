const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const Product = require("../models/Products.js");
// Add product to basket
router.post('/add/:productId', async (req,res) => {
    const userId = req.session.user._id;
    const productId = req.params.productId;
    const user =  await User.findById(userId);
    user.basket.push(productId);
    await user.save();
    res.redirect('/products');
});

// view basket 
router.get('/', async (req,res) => {
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate('basket');
    
    res.render('basket/index.ejs', { basket: user.basket });
});
//clear basket
router.post('/clear', async (req,res) => {
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    user.basket = [];
    await user.save();
    res.redirect('/basket');
});

// process checkout
router.post('/checkout', async (req,res) => {
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate('basket');
    // Here you would typically handle payment processing and order creation
    user.basket = [];
    await user.save();
    res.send("Checkout complete! Thank you for your purchase.");
});



module.exports = router;