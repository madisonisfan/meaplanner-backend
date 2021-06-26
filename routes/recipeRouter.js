const express = require("express");
const recipeRouter = express.Router();

recipeRouter
  .route("/")
  .get((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("will retrieve all recipes");
  })
  .post((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end(`will post recipes with name: ${req.body.recipeName}`);
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("PUT operation not support on /recipes");
  })
  .delete((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("DELETE operation not support on /recipes");
  });

module.exports = recipeRouter;
