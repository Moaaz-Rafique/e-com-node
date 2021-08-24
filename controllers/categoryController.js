var Category = require("../models/category");

exports.category_list = async (req, res) => {
  try {
    const data = await Category.find().exec();
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
    const data = await Category.findByIdAndRemove(req.query.id).exec();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
exports.update_category = async (req, res) => {
  try {
    const data = await Category.findByIdAndUpdate(
      req.body.id,
      req.body.updatedCategory
    ).exec();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
