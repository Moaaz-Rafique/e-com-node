var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: { type: String, required: true, maxLength: 20 },
  // loginInfo: { type: Object, required: true },
});

module.exports = mongoose.model("User", UserSchema);
