var User = require("../models/user");
var Category = require("../models/category");
var Product = require("../models/product");
var Cart = require("../models/cart");
var async = require("async");
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname));
  },
  onError: function (err, next) {
    console.log("error", err);
    next(err);
  },
  filename: function (req, file, cb) {
    // console.log("storage filename", file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const cloudinary = require("cloudinary");
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// console.log("product Controller", {
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

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
// exports.add_product2 = async (req, res) => {
//   console.log("------------add_product2-----------------");
//   const upload = multer({ storage }).single("image");

//   const uploadImage = await upload(req, res, async (err) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log("file uploaded to server");
//     // console.log("req.files", req.file);
//     const result = await cloudinary.v2.uploader.upload(req.file.path);
//     res.json({ result });
//   });
// };

exports.add_product = async (req, res) => {
  // console.log(req);

  try {
    const upload = multer({ storage }).single("image");
    const MyError = null;
    upload(req, res, async (err) => {
      try {
        if (err || !req?.file) {
          console.error(err);
          throw new Error("Image not uploaded successfully");
        }
        console.log("file uploaded to server");

        const result = await cloudinary.v2.uploader.upload(req?.file?.path);
        req.body.image = result?.url;
        const fs = require("fs");
        fs.unlinkSync(req?.file?.path);

        const frontData = new Product(req?.body);
        const data = await frontData.save();
        res.json({ data, success: true });
      } catch (error) {
        res.json({
          message: error.message,
          // error,
          success: false,
        });
      }
    });
  } catch (error) {
    // console.log("My error-------->", error);
    res.json({
      message: error.message,
      error: error,
      success: false,
    });
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
