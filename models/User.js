const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  basket: [
    {
      type: mongoose.Schema.Types.ObjectId,
       ref: "Product" 
    }
  ],
  isAdmin:
  {
    type: Boolean,
    default: false,
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
