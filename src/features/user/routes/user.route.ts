import { Router } from "express";
import { login_user, register_user, verify_user } from "../controllers/user.controller";

const user_router = Router()

user_router.post('/register',register_user)
user_router.post('/confirmation', verify_user)
user_router.post('/login', login_user)
user_router.post('/update')
user_router.get('/:id')



