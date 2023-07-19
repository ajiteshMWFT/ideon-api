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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../features/user/models/user.model");
// interface AuthenticatedRequest extends Request {
//   user?: any;
// }
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if JWT token exists in the session cookie
        const token = req.cookies.session;
        if (!token) {
            return res
                .status(401)
                .json({ message: "No token, authorization denied" });
        }
        // Verify and decode the JWT token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res
                .status(401)
                .json({ message: "Invalid token, authorization denied" });
        }
        const user = yield user_model_1.User.findById(decoded.user._id);
        // Attach the decoded user ID to the request object for future use
        req.user = user;
        // Continue to the protected route
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json;
    }
});
exports.authenticate = authenticate;
