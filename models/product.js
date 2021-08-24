var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ProductSchema = new Schema(
  {
    title: { type: String, required: true, maxLength: 100 },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true, maxLength: 500 },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    // user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // last_updated_by: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    //   default: this.user,
    //   required: true,
    // },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("Procuct", ProductSchema);
