var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  id: { type: String },
  username: { type: String, required: true, maxLength: 20 },
  email: {
    type: String,
    // required: true,
    trim: true,
    lowercase: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  loginType: {
    type: String,
    required: true,
    enum: ["email", "google", "facebook"],
    default: "email",
  },
  imageUrl: { type: String },
  passwordHash: { type: String },

  // loginInfo: { type: Object, required: true },
});

module.exports = mongoose.model("User", UserSchema);
