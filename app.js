var createError = require("http-errors");
var express = require("express");
var path = require("path");

var logger = require("morgan");
const passport = require("passport");
const authenticate = require("./authenticate");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const recipeRouter = require("./routes/recipeRouter");
const postRouter = require("./routes/postRouter");
const uploadRouter = require("./routes/uploadRouter");
const favoriteRouter = require("./routes/favoriteRouter");

var app = express();

const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/mealplanner";

const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(
  () => console.log("Connectly correctly to server"),
  (err) => console.log(err)
);

app.use(passport.initialize());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/recipes", recipeRouter);
app.use("/posts", postRouter);
app.use("/imageUpload", uploadRouter);
app.use("/favorite", favoriteRouter);

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
