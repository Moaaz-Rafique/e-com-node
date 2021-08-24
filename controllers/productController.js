var User = require("../models/user");
var Category = require("../models/category");
var Product = require("../models/product");
var Cart = require("../models/cart");

var async = require("async");

exports.index = function (req, res) {
  async.parallel(
    {
      user_count: function (callback) {
        User.countDocuments({}, callback);
      },
      category_count: function (callback) {
        Category.countDocuments({}, callback);
      },
      Cart_count: function (callback) {
        Cart.countDocuments({}, callback);
      },
      product_count: function (callback) {
        Product.countDocuments({}, callback);
      },
    },
    function (err, results) {
      res.json(results);
    }
  );
};
exports.product_list = async (req, res) => {
  try {
    const data = await Product.find().populate("categories").exec();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
exports.product_detail = async (req, res) => {
  try {
    const data = await Product.findById(req.query.id)
      .populate("categories")
      .exec();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

exports.add_product = async (req, res) => {
  try {
    const data = new Product(req.body);
    await data.save();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
exports.remove_product = async (req, res) => {
  try {
    const data = await Product.findByIdAndRemove(req.query.id).exec();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
exports.update_product = async (req, res) => {
  try {
    const data = await Product.findByIdAndUpdate(
      req.body.id,
      req.body.updatedProduct
    ).exec();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
