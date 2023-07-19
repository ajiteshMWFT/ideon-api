import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../features/user/models/user.model";
// interface AuthenticatedRequest extends Request {
//   user?: any;
// }
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if JWT token exists in the session cookie
    const token = req.cookies.session;
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Invalid token, authorization denied" });
    }
    const user = await User.findById(decoded.user._id);
    // Attach the decoded user ID to the request object for future use
    req.user = user ;
    // Continue to the protected route
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json;
  }
};
