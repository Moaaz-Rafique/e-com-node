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
    if (req?.body?.id) {
      let existingData = await User.findOne({ id: req?.body?.id }).exec();
      if (existingData) {
        res.json({ existingData, success: true });
        // res.json({})
        return;
      }
    }
    let data = new User(req.body);
    data = await data.save();
    res.json({ data, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
exports.user_login = async (req, res) => {
  try {
    const data = await User.findOne({
      email: req.body.email,
      passwordHash: req.body.passwordHash,
    }).exec();
    if (data == null) {
      throw new Error("User not found");
    }
    res.json({ data, success: true });
  } catch (error) {
    res.json({
      message: error.message,
      passwordHash: req.body.passwordHash,
      success: false,
    });
  }
};
