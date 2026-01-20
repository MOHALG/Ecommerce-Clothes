const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Products.js");
const Supplier = require("../models/Supplier.js");
const router = express.Router(); 

// Get all products
router.get("/", async (req, res) => {
    const allProducts = await Product.find({});
    res.render("./products/index.ejs", { products: allProducts });
});

// get create new product form
router.get("/new", async (req, res) => {
    res.render("create-new-products.ejs");
});

// post route to create new product

router.post("/", async (req, res) => {
    // Convert checkbox "on" to boolean
    req.body.inStock = req.body.inStock === "on";
    console.log(req.body);
    const newProduct = await Product.create(req.body);
    res.redirect("/products");
});



// Get single product details (dynamic route LAST)
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("products/show.ejs", { product });
});




module.exports = router;