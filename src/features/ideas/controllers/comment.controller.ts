import { Request, Response } from "express";
import { Comment } from "../models/comment.model";

export const create_comment = async (req: Request, res: Response) => {
  try {
    const { content, idea_auther, idea } = req.body;
    const new_comment = new Comment({
      comment_auther: req.user._id,
      content,
      idea_auther,
      idea,
    });
    await new_comment.save();
    res.status(200).json({ message: "comment added succesfully", new_comment });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const get_all_comments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;

    const total_comments: number = await Comment.countDocuments({ idea: id });
    const total_pages: number = Math.ceil(total_comments / limit);
    const skip: number = (page - 1) * limit;
    // const comments = comments.find({idea:id})

    const comments = await Comment.find({ idea: id, is_reply:false })

      .skip(skip)
      .limit(limit)
      .exec();

    if (total_comments == 0) {
      res.status(404).json({ message: "no projects found" });
    } else {
      res.status(200).json({
        comments,
        total_comments,
        total_pages,
        currentPage: page,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
};

export const create_reply = async (req: Request, res: Response) => {
  try {
    const { content, idea_auther, idea, parent_comment } = req.body;
    const new_comment = new Comment({
      comment_auther: req.user._id,
      content,
      idea_auther,
      idea,
      parent_comment
    });
    await new_comment.save();
    res.status(200).json({ message: "comment added succesfully", new_comment });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const get_all_reply = async (req: Request, res: Response) => {
  try {
    const { id, parent_comment } = req.params;
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;

    const total_comments: number = await Comment.countDocuments({ idea: id });
    const total_pages: number = Math.ceil(total_comments / limit);
    const skip: number = (page - 1) * limit;
    // const comments = comments.find({idea:id})

    const comments = await Comment.find({ idea: id,parent_comment,is_reply:true })
      .skip(skip)
      .limit(limit)
      .exec();

    if (total_comments == 0) {
      res.status(404).json({ message: "no projects found" });
    } else {
      res.status(200).json({
        comments,
        total_comments,
        total_pages,
        currentPage: page,

      });
    }
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
};
