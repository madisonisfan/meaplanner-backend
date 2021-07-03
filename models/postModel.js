const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    commentContent: {
      type: String,
      required: true,
    },
    commentCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const postSchema = new Schema(
  {
    postContent: {
      type: String,
      required: true,
    },
    postType: {
      type: String,
      required: true,
    },
    postCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
