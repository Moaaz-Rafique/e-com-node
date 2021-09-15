var User = require("../models/user");
var Category = require("../models/category");
var Product = require("../models/product");
var Cart = require("../models/cart");

var async = require("async");

const cloudinary = require("cloudinary");
console.log({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

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
  // console.log(cloudinary);
  try {
    if (!req.files?.image) {
      throw "Image not uploaded successfully";
    }
    const image = req?.files?.image;
    req.body.image = image?.name || "Image is Not properly uploaded";
    cloudinary.v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    cloudinary.v2.uploader.upload(req?.files?.upload?.path, (result) => {
      // This will return the output after the code is exercuted both in the terminal and web browser
      // When successful, the output will consist of the metadata of the uploaded file one after the other. These include the name, type, size and many more.
      console.log(req?.files?.image?.path);
      console.log("my--Image result cloudinary", result);
      // if (result.public_id) {

      // // The results in the web browser will be returned inform of plain text formart. We shall use the util that we required at the top of this code to do this.
      //     res.writeHead(200, { 'content-type': 'text/plain' });
      //     res.write('received uploads:\n\n');
      //     res.end(util.inspect({ fields: fields, files: files }));
      // }
    });

    const data = new Product(req?.body);
    await data.save();
    image.mv("./public/images/" + data._id + "/" + image?.name);
    res.json({ data, success: true });
  } catch (error) {
    console.log("My error-------->", error);
    res.json({
      message: error.message,
      error,
      success: false,
      myKeys: {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      },
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
