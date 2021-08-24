var User = require("../models/user");

exports.user_list = async (req, res) => {
  try {
    console.log(req.user);
    const data = await User.find().exec();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
exports.user_detail = async (req, res) => {
  try {
    const data = await User.findOne(req.body.id).exec();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
exports.user_signup = async (req, res) => {
  try {
    let data = new User(req.body);
    data = await data.save();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
exports.user_login = async (req, res) => {
  try {
    const data = await User.findOne({ name: req.body.name });
    if (data == null) {
      throw new Error("User not found");
    }
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
