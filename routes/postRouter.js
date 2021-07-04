const express = require("express");
const postRouter = express.Router();
const Post = require("../models/postModel");
const authenticate = require("../authenticate");

postRouter
  .route("/")
  .get((req, res, next) => {
    Post.find()
      .populate("postCreator")
      .then((posts) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(posts);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    req.body.postCreator = req.user._id;
    Post.create(req.body)
      .then((post) => {
        console.log("Post created: ", post);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(post);
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("PUT operation not support on /posts");
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Post.deleteMany()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

postRouter
  .route("/:postId")
  .get((req, res, next) => {
    Post.findById(req.params.postId)
      .then((post) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(post);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end(`POST operation not support on /posts/${req.params.postId}`);
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Post.findById(req.params.postId)
      .then((post) => {
        if (post) {
          if (post.postCreator._id.equals(req.user._id)) {
            if (req.body.postContent) {
              post.postContent = req.body.postContent;
            }
            if (req.body.postType) {
              post.postType = req.body.postType;
            }

            post
              .save()
              .then((post) => {
                res.statusCode = 200;
                res.setHeader("Conten-Type", "application/json");
                res.json(post);
              })
              .catch((err) => next(err));
          } else {
            const err = new Error("You are not the post creator");
            err.status = 404;
            return next(err);
          }
        } else {
          const err = new Error(`Post ${req.params.postId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Post.findById(req.params.postId)
      .then((post) => {
        if (post) {
          if (post.postCreator._id.equals(req.user._id)) {
            Post.findByIdAndDelete(req.params.postId)
              .then((response) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(response);
              })
              .catch((err) => next(err));
          } else {
            const err = new Error(`You are not the post creator`);
            err.status = 404;
            return next(err);
          }
        } else {
          const err = new Error(`Post ${req.params.postId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

/*
  Post.findById(req.params.postId)
      .then((post) => {
        if (post) {
          if (post.postCreator._id.equals(req.user._id)) {
            post.remove();
          } else {
            const err = new Error(`You are not the post creator`);
            err.status = 404;
            return next(err);
          }
        } else {
          const err = new Error(`Post ${req.params.postId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));

  */

postRouter
  .route("/:postId/comments")
  .get((req, res, next) => {
    Post.findById(req.params.postId)
      .populate("comments.commentCreator")
      .then((post) => {
        if (post) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(post.comments);
        } else {
          err = new Error(`Post ${req.params.postId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Post.findById(req.params.postId)
      .then((post) => {
        if (post) {
          req.body.commentCreator = req.user._id;
          post.comments.push(req.body);
          post
            .save()
            .then((post) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(post);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Post ${req.params.postId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /posts/${req.params.postId}/comments`
    );
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Post.findById(req.params.postId)
        .then((post) => {
          if (post) {
            for (let i = post.comments.length - 1; i >= 0; i--) {
              post.comments.id(post.comments[i]._id).remove();
            }
            post
              .save()
              .then((post) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(post);
              })
              .catch((err) => next(err));
          } else {
            err = new Error(`Post ${req.params.postId} not found`);
            err.status = 404;
            return next(err);
          }
        })
        .catch((err) => next(err));
    }
  );

postRouter
  .route("/:postId/comments/:commentId")
  .get((req, res, next) => {
    Post.findById(req.params.postId)
      .populate("comments.commentCreator")
      .then((post) => {
        const comment = post.comments.id(req.params.commentId);
        if (post && comment) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(post.comments.id(req.params.commentId));
        } else if (!post) {
          const err = new Error(`Post ${req.params.postId} not found`);
          err.status = 404;
          return next(err);
        } else {
          const err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /posts/${req.params.postId}/comments/${req.params.commentId}`
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Post.findById(req.params.postId)
      .then((post) => {
        const comment = post.comments.id(req.params.commentId);
        if (post && comment) {
          //console.log(comment.commentCreator._id.equals(req.user._id));
          if (comment.commentCreator._id.equals(req.user._id)) {
            if (req.body.commentContent) {
              comment.commentContent = req.body.commentContent;
            }
            post
              .save()
              .then((post) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(post);
              })
              .catch((err) => next(err));
          } else {
            const err = new Error(`You are not the comment creator`);
            err.status = 404;
            return next(err);
          }
        } else if (!post) {
          const err = new Error(`Post ${req.params.postId} not found`);
          err.status = 404;
          return next(err);
        } else {
          const err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Post.findById(req.params.postId)
      .then((post) => {
        const comment = post.comments.id(req.params.commentId);
        if (post && comment) {
          /*console.log(req.user._id);
          console.log(comment.author._id);
          console.log(comment.author._id.equals(req.user._id));*/
          if (comment.commentCreator._id.equals(req.user._id)) {
            //console.log("removing comment");
            comment.remove();
            post
              .save()
              .then((post) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(post);
              })
              .catch((err) => next(err));
          } else {
            const err = new Error(`You are not the comment creator`);
            err.status = 404;
            return next(err);
          }
        } else if (!post) {
          err = new Error(`Post ${req.params.campsiteId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });
module.exports = postRouter;
