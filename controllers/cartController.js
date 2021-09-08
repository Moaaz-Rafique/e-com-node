var Cart = require("../models/cart");

exports.cart_list = async (req, res) => {
  try {
    const data = await Cart.find().populate("product").exec();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

exports.user_cart = async (req, res) => {
  try {
    const data = await Cart.find({ user: req.query.user })
      .populate("product")
      .exec();
    console.log("data", req.query);
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
exports.user_current_cart = async (req, res) => {
  try {
    const data = await Cart.find({ user: req.query.user, status: "added" })
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
    // console.log(req.user);
    // req.body.user;
    if (req?.body?.user) {
      let data = await Cart.findOne({
        user: req?.body?.user,
        product: req?.body?.product,
        status: "added",
      }).exec();
      if (data) {
        res.json({ data, success: true });
        // res.json({})
        return;
      }
    }
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
    const oldData = await Cart.findByIdAndUpdate(req.body._id, req.body);
    const data = await Cart.findById(req.body._id);
    res.json({ data, oldData, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
