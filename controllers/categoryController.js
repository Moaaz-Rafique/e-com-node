var Category = require("../models/category");

exports.category_list = async (req, res) => {
  try {
    const data = await Category.find({ active: true }).exec();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
exports.category_detail = async (req, res) => {
  try {
    const data = await Category.findById(req.query.id).populate("user").exec();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
exports.add_category = async (req, res) => {
  try {
    let data = new Category(req.body);
    data = await data.save();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

exports.remove_category = async (req, res) => {
  try {
    const data = await Category.findByIdAndUpdate(req?.body?.id, {
      active: false,
    }).exec();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
exports.update_category = async (req, res) => {
  try {
    const oldData = await Category.findByIdAndUpdate(
      req.body.id,
      req.body
    ).exec();
    const data = await Category.findById(req.body.id).exec();
    // console.log(req.body, data);
    res.json({ data, oldData, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
