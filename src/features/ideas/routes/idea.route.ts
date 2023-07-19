import { Router } from "express";
import { generate_idea, idea_details, idea_list, user_idea_list } from "../controllers/idea.controller";
import { authenticate } from "../../../middleware/auth.middleware";
export const idea_router = Router()

idea_router.post('/generate-idea',authenticate, generate_idea )

idea_router.get('/ideas', idea_list )

idea_router.get('/idea/:id',idea_details)
idea_router.get('/user-ideas',user_idea_list)


