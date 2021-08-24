var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  color: { type: String, default: "white" },
});
module.exports = mongoose.model("Category", CategorySchema);
