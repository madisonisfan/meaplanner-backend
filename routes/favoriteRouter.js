const express = require("express");
const Favorite = require("../models/favoriteModel");
const authenticate = require("../authenticate");
const cors = require("./cors");

const favoriteRouter = express.Router();

module.exports = favoriteRouter;

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("recipes")
      .then((userFavoriteDoc) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(userFavoriteDoc);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((userFavoriteDoc) => {
        console.log(userFavoriteDoc);
        if (userFavoriteDoc) {
          req.body.forEach((recipeToAdd) => {
            if (!userFavoriteDoc.recipes.includes(recipeToAdd)) {
              console.log("adding recipe");
              userFavoriteDoc.recipes.push(recipeToAdd);
            }
          });
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(userFavoriteDoc);
        } else {
          Favorite.create({ user: req.user._id }).then((userFavoriteDoc) => {
            req.body.forEach((recipeToAdd) => {
              userFavoriteDoc.recipes.push(recipeToAdd);
            });

            userFavoriteDoc
              .save()
              .then((userFavoriteDoc) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(userFavoriteDoc);
              })
              .catch((err) => next(err));
          });
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites`);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({
      user: req.user._id,
    })
      .then((userFavoriteDoc) => {
        res.statusCode = 200;
        if (userFavoriteDoc) {
          res.setHeader("Content-Type", "application/json");
          res.json(userFavoriteDoc);
        } else {
          res.setHeader("Content-Type", "text/plain");
          res.end("You do not have any favorites to delete.");
        }
      })
      .catch((err) => next(err));
  });

favoriteRouter
  .route("/:recipeId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /favorites/${req.params.recipeId}`);
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((userFavoriteDoc) => {
        const recipeToAdd = req.params.recipeId;
        if (userFavoriteDoc) {
          if (userFavoriteDoc.recipes.includes(recipeToAdd)) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.end("That recipe is already in the list of favorites!");
          } else {
            userFavoriteDoc.recipes.push(recipeToAdd);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(userFavoriteDoc);
          }
        } else {
          Favorite.create({ user: req.user._id })
            .then((userFavoriteDoc) => {
              userFavoriteDoc.recipes.push(recipeToAdd);
              userFavoriteDoc
                .save()
                .then((userFavoriteDoc) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(userFavoriteDoc);
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites/${req.params.recipeId}`);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((userFavoriteDoc) => {
        if (userFavoriteDoc) {
          const newFavorites = userFavoriteDoc.recipes.filter(
            (recipe) => recipe._id.toString() !== req.params.recipeId
          );
          userFavoriteDoc.recipes = newFavorites;
          userFavoriteDoc
            .save()
            .then((userFavoriteDoc) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(userFavoriteDoc);
            })
            .catch((err) => next(err));
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.end("There are no favorites to delete.");
        }
      })
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
