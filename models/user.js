var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator')
var Schema = mongoose.Schema;
bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  id: { type: String },
  username: { type: String, required: true, maxLength: 20 },
  email: {
    type: String,
    // required: true,
    trim: true,
    lowercase: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  loginType: {
    type: String,
    required: true,
    enum: ["email", "google", "facebook"],
    default: "email",
  },
  imageUrl: { type: String },
  passwordHash: { type: String },
  
  // loginInfo: { type: Object, required: true },
});
UserSchema.path('id').required(function(){
  return this.loginType!=='email'
})
UserSchema.path('email').required(function() {
  return this.loginType === 'email'
}) 
UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('passwordHash')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) {
        console.log("erroooor")
        return next(err);
      }
      // hash the password using our new salt
      bcrypt.hash(user.passwordHash, salt, function(err, hash) {
          if (err) {
            console.log("erroooor2")            
            return next(err)
          }
          // override the cleartext password with the hashed one
          user.passwordHash = hash;
          next();
      });
  });
});
   
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  // console.log(candidatePassword)
  
};
UserSchema.plugin(uniqueValidator, {message:"This email already exists, try to login instead"});
module.exports = mongoose.model("User", UserSchema);
