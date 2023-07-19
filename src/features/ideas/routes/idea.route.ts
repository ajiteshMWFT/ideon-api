import { Router } from "express";
import { generate_idea } from "../controllers/idea.controller";
export const idea_router = Router()

idea_router.post('/generate-idea',generate_idea )