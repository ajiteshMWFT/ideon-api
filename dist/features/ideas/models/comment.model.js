"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const commnet_schema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true,
    },
    comment_auther: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    idea_auther: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    idea: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Comment",
    },
});
exports.Comment = mongoose_1.default.model("Commnet", commnet_schema);
