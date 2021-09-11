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
    const data = await Product.find().exec();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
const productsByCategory = async (categories, _id) => {
  try {
    const data = await Product.find({
      _id: { $ne: _id },
      categories: { $in: categories },
    })
      .limit(5)
      .populate("categories")
      .exec();
    return data;
  } catch (error) {
    console.log(error);
  }
};
exports.product_detail = async (req, res) => {
  try {
    const data = await Product.findById(req?.query?.id)
      // .populate("categories")
      .exec();
    let similar = data?.categories;
    similar = await productsByCategory(similar, data._id);
    res.json({ data, similar, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

exports.add_product = async (req, res) => {
  try {
    if (!req.files?.image) {
      throw "Image not uploaded successfully";
    }
    const image = req?.files?.image;
    req.body.image = image?.name || "Image is Not properly uploaded";
    const data = new Product(req?.body);
    await data.save();
    image.mv("./public/images/" + data._id + "/" + image?.name);
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
    if (req.files?.image) {
      const image = req?.files?.image;
      req.body.image = image?.name || "Image is Not properly uploaded";
      image.mv("./public/images/" + req.body._id + "/" + image?.name);
    }
    const oldData = await Product.findByIdAndUpdate(req.body._id, req.body);
    const data = await Product.findById(req.body._id);
    // console.log(req.body);
    // console.log(oldData);
    res.json({ data, oldData, success: true });
  } catch (error) {
    // console.log(error);
    res.json({ message: error.message, success: false });
  }
};
