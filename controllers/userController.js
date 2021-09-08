var User = require("../models/user");
(bcrypt = require("bcrypt")),
  (exports.user_list = async (req, res) => {
    try {
      console.log(req.user);
      const data = await User.find().exec();
      res.json({ data, success: true });
    } catch (error) {
      res.json({ message: error.message, success: false });
    }
  });
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
    // console.log(req)
    data = await data.save();
    res.json({ data, success: true });
  } catch (error) {
    try {
      if (error.name == "ValidationError") {
        if (error?.errors?.email?.message) {
          res.json({ message: error?.errors?.email?.message, success: false });
        } else if (error?.errors?.id?.message) {
          res.json({ message: error?.errors?.id?.message, success: false });
        }
      } else throw new Error("Value does not exist");
    } catch (e) {
      res.json({ message: error.message, success: false });
    }
  }
};

exports.user_login = async (req, res, next) => {
  try {
    const data = await User.findOne({ email: req.body.email }).exec();

    const passwordMatch = await bcrypt.compare(
      req?.body?.passwordHash,
      data.passwordHash
    );
    if (passwordMatch) res.json({ data, success: true, passwordMatch });
    else throw new Error("Password Not Matched");
  } catch (error) {
    res.json({
      message: error.message,
      success: false,
    });
  }
};
