// imports
const express = require("express") //importing express package
const app = express() // creates a express application
const dotenv = require("dotenv").config() //this allows me to use my .env values in this file
const mongoose = require("mongoose")
const morgan = require('morgan')
const authController = require("./controllers/auth.js");
const indexController = require("./controllers/index.routes.js");
const session = require('express-session');
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");
const methodOverride = require('method-override')
const productsController = require("./controllers/products.js");
const basketController = require("./controllers/basket.js");


// middleware
app.set('view engine', 'ejs');
app.use(express.static('public')) // my app will serve all static files from public folder
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passUserToView)














async function connectToDB(){ //connection to the database
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to Database")
    }
    catch(error){
        console.log("Error Occured",error)
    }
}


connectToDB() // connect to database












// Routes go here
app.use('/auth',authController)
app.use("/", indexController);



// PROTECTED ROUTES:
app.use(isSignedIn)
app.use('/basket',basketController)
app.use('/products',productsController)  // Admins need login to manage products
// Everything under the user NEEDS to be logged in to se







app.listen(3000,()=>{
    console.log('App is working')
}) // Listen on Port 3000
