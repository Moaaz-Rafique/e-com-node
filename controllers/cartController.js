var Cart = require("../models/cart");

exports.cart_list = async (req, res) => {
  try {
    const data = await Cart.find({ user: req.body.user })
      .populate("product")
      .exec();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

exports.cart_detail = async (req, res) => {
  try {
    const data = await Cart.findById(req.query.id).populate("user").exec();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

exports.add_cart = async (req, res) => {
  try {
    console.log(req.user);
    req.body.user = req.user._id;
    let data = new Cart(req.body);
    data = await data.save();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
exports.remove_cart_by_cart_id = async (req, res) => {
  try {
    const data = await Cart.findByIdAndRemove(req.body.id, "products").exec();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
exports.update_cart = async (req, res) => {
  try {
    const data = await Cart.findByIdAndUpdate(
      req.body.id,
      req.body.updatedCart
    ).exec();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
