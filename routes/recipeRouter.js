const express = require("express");
const recipeRouter = express.Router();
const Recipe = require("../models/recipeModel");
const authenticate = require("../authenticate");

recipeRouter
  .route("/")
  .get((req, res, next) => {
    Recipe.find()
      .then((recipes) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(recipes);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Recipe.create(req.body)
      .then((recipe) => {
        console.log("Recipe added: ", recipe);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(recipe);
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("PUT operation not support on /recipes");
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Recipe.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.json(response);
      })
      .catch((err) => next(err));
  });

recipeRouter
  .route("/:recipeId")
  .get((req, res, next) => {
    Recipe.findById(req.params.recipeId)
      .then((recipe) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(recipe);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end(`POST operation not support on /recipes/${req.params.recipeId}`);
  })

  .put(authenticate.verifyUser, (req, res, next) => {
    Recipe.findByIdAndUpdate(
      req.params.recipeId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((recipe) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(recipe);
      })
      .catch((err) => next(err));
  })
  .delete(
    authenticate.verifyUser,

    (req, res, next) => {
      Recipe.findByIdAndDelete(req.params.recipeId)
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

module.exports = recipeRouter;

/* FOR TESTING
{
    "recipeName": "pasta",
    "recipeDescription": "recipe description", 
    "imageUrl": "image url...", 
    "cooktime": 25, 
    "preptime": 10,
    "calories" :120, "servings": 5, 
    "ingredients": "ingredients..." ,"instructions": "instructions..."
}

*/
