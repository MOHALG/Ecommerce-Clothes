const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    // supplier: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Supplier",
    //     required: true, 
    // },
    name: {
        type: String,
        required: true,
    },
    inStock: {
        type: Boolean,
        required: true,
        default: true,
    },
}); 

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
