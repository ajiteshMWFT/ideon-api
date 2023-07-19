import mongoose from "mongoose";

const commnet_schema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  comment_auther: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  idea_auther: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  idea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Idea",
  },
  date: {
    type: Date,
    default: new Date(),
  },
  is_reply: {
    type: Boolean,
    default: false,
  },
  parent_comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
});

export const Comment = mongoose.model("Commnet", commnet_schema);
