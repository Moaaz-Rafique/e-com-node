var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CartSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  count: { type: Number, default: 1 },
  status: {
    type: String,
    required: true,
    enum: ["added", "removed", "bought"],
    default: 'added',
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Cart", CartSchema);
