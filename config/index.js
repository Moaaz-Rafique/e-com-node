var mongoose = require("mongoose");

//Set up default mongoose connection
var mongoDB = process.env.MONGO_DB;

// console.log(mongoDB);
// console.log("from config js process", process.env.PORT);

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = mongoose;
