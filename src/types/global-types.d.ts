import { Request } from "express";
import { User } from "../features/user/models/user.model";
declare global {
  namespace Express {
    export interface Request {
      user: any;
    }
  }
}
