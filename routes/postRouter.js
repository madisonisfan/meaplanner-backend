const express = require("express");
const postRouter = express.Router();
const Post = require("../models/postModel");

postRouter
  .route("/")
  .get((req, res, next) => {
    Post.find()
      .then((posts) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(posts);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Post.create(req.body)
      .then((post) => {
        console.log("Post created: ", post);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(post);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("PUT operation not support on /posts");
  })
  .delete((req, res, next) => {
    Post.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.json(response);
      })
      .catch((err) => next(err));
  });

module.exports = postRouter;
