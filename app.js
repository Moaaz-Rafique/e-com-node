var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const fileUpload = require("express-fileupload");
var indexRouter = require("./routes/index");
var catalogRouter = require("./routes/catalog");

const dotenv = require("dotenv");

const results = dotenv.config();

var db = require("./config");
var app = express();
//process.env.TIMES
//Import the mongoose module

//Get the default connection

//Bind connection to error event (to get notification of connection errors)
try {
  db.connection
    .on("error", console.error.bind(console, "MongoDB connection error:"))
    .once("open", function () {
      console.log("connected");
    });
} catch (err) {
  // try {
  // } catch (error) {
  //   console.log(error);
  // }
  console.log(err);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Function to serve all static files
// inside public directory.
app.use(express.static("public"));

app.use("/public/images", express.static("images"));

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  fileUpload({
    createParentPath: true,
  })
);

var myLogger = function (req, res, next) {
  req.user = {
    _id: "6123a3b8b1094424685248cc",
    name: "mzr",
    __v: 0,
  };
  next();
};
app.use("/api/", myLogger, indexRouter);
app.use("/api/catalog", myLogger, catalogRouter);
// catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
