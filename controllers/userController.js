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
      let existingData = await User.findOne({ id: req?.body?.id });
      if (existingData) {
        res.json({ existingData, success: true, newUser:false });
        return;
      }
    }
    if(req?.body?.email){
      let existingData = await User.findOne({ email: req?.body?.email ,loginType: "email"});
      if (existingData) {
        throw new Error("This email is already in use try to login instead")
      }
    }
    let data = new User(req.body);
    // console.log(req)
    // console.log(data)
    data = await data.save();
    res.json({ data, success: true, newUser:true });
  } catch (error) {    
      res.json({ message: error.message, success: false });    
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
