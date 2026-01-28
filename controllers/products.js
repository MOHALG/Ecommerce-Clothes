const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Products.js");
const Supplier = require("../models/Supplier.js");
const router = express.Router(); 
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'public/images');
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

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

router.post("/", upload.single('image'), async (req, res) => {
    // Convert checkbox "on" to boolean
    req.body.inStock = req.body.inStock === "on";
    // Save the image path if file was uploaded
    if (req.file) {
        req.body.image = req.file.filename;
    }
    console.log(req.body);
    const newProduct = await Product.create(req.body);
    res.redirect("/products");
});

//router for editing a product
router.get("/:id/edit", async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("edit.ejs", { product });
});

// put route to update a product
router.put("/:id", async (req, res) => {
    req.body.inStock = req.body.inStock === "on";
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.redirect("/products");
});
// router to delete a product

router.get("/:id/delete", async (req, res) => {
    const deleteProduct = await Product.findById(req.params.id);
    res.render("delete.ejs", { product: deleteProduct });
});

// Delete route to delete a product
router.delete("/:id", async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/products");
});

// Get single product details (dynamic route LAST)
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("products/show.ejs", { product });
});




module.exports = router;