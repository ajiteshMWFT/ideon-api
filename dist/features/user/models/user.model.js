"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_schema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    is_email_verified: {
        type: Boolean,
        default: false,
    },
    email_verification_token: {
        type: String,
    },
    profile_pic: {
        type: String,
    },
});
exports.User = mongoose_1.default.model("User", user_schema);
