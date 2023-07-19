"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Idea = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const idea_schema = new mongoose_1.default.Schema({
    idea: {
        type: String,
    },
    userBackground: [
        {
            skills: [String],
            experience: [String],
        },
    ],
    excerpt: {
        type: String,
    },
    userInterests: [String],
    marketInformation: [
        {
            industry: String,
            trends: [String],
            gaps: [String],
        },
    ],
    problems: [String],
    targetAudience: [String],
    resources: [
        {
            capital: String,
            time: String,
            team: String,
        },
    ],
    auther: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    created_date: {
        type: Date,
        default: new Date(),
    },
});
exports.Idea = mongoose_1.default.model("Idea", idea_schema);
