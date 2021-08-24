#! /usr/bin/env node
console.log(
  "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);
// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require("async");

var User = require("./models/user");
var Category = require("./models/category");
var Product = require("./models/product");
var Cart = require("./models/cart");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var users = [];
var categories = [];
var carts = [];
var products = [];

function userCreate(name, loginInfo) {}
async.series(
  [createGenreAuthors, createBooks, createBookInstances],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("BOOKInstances: " + bookinstances);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
