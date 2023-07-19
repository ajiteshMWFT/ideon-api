"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idea_router = void 0;
const express_1 = require("express");
const idea_controller_1 = require("../controllers/idea.controller");
exports.idea_router = (0, express_1.Router)();
exports.idea_router.post('/generate-idea', idea_controller_1.generate_idea);
