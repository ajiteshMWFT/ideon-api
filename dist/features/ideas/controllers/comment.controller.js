"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_all_reply = exports.create_reply = exports.get_all_comments = exports.create_comment = void 0;
const comment_model_1 = require("../models/comment.model");
const create_comment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, idea_auther, idea } = req.body;
        const new_comment = new comment_model_1.Comment({
            comment_auther: req.user._id,
            content,
            idea_auther,
            idea,
        });
        yield new_comment.save();
        res.status(200).json({ message: "comment added succesfully", new_comment });
    }
    catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
});
exports.create_comment = create_comment;
const get_all_comments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const total_comments = yield comment_model_1.Comment.countDocuments({ idea: id });
        const total_pages = Math.ceil(total_comments / limit);
        const skip = (page - 1) * limit;
        // const comments = comments.find({idea:id})
        const comments = yield comment_model_1.Comment.find({ idea: id, is_reply: false })
            .skip(skip)
            .limit(limit)
            .exec();
        if (total_comments == 0) {
            res.status(404).json({ message: "no projects found" });
        }
        else {
            res.status(200).json({
                comments,
                total_comments,
                total_pages,
                currentPage: page,
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: "server error", error });
    }
});
exports.get_all_comments = get_all_comments;
const create_reply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, idea_auther, idea, parent_comment } = req.body;
        const new_comment = new comment_model_1.Comment({
            comment_auther: req.user._id,
            content,
            idea_auther,
            idea,
            parent_comment
        });
        yield new_comment.save();
        res.status(200).json({ message: "comment added succesfully", new_comment });
    }
    catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
});
exports.create_reply = create_reply;
const get_all_reply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, parent_comment } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const total_comments = yield comment_model_1.Comment.countDocuments({ idea: id });
        const total_pages = Math.ceil(total_comments / limit);
        const skip = (page - 1) * limit;
        // const comments = comments.find({idea:id})
        const comments = yield comment_model_1.Comment.find({ idea: id, parent_comment, is_reply: true })
            .skip(skip)
            .limit(limit)
            .exec();
        if (total_comments == 0) {
            res.status(404).json({ message: "no projects found" });
        }
        else {
            res.status(200).json({
                comments,
                total_comments,
                total_pages,
                currentPage: page,
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: "server error", error });
    }
});
exports.get_all_reply = get_all_reply;
