var mongoose = require("mongoose");

//Set up default mongoose connection
var mongoDB = process.env.MONGO_DB;

// console.log(mongoDB);
// console.log("from app js process", process.env.MONGO_DB);

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = mongoose;
