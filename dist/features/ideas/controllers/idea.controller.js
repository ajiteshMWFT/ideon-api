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
Object.defineProperty(exports, "__esModule", { value: true });
exports.idea_details = exports.idea_list = exports.generate_idea = void 0;
const openai_1 = require("openai");
const idea_model_1 = require("../models/idea.model");
const configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
const generate_idea = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { skills, experience, userInterests, industry, trends, gaps, problems, targetAudience, capital, time, team, } = req.body;
        const prompt = `
            use follwoing json  to generate startup idea-
         userBackground: {
           skills: ${skills},
           experience: ${experience}
         },
         userInterests:  ${userInterests},
         marketInformation: {
           industry:  ${industry},
           trends:  ${trends},
           gaps:  ${gaps}
         },
         problems:  ${problems},
         targetAudience:  ${targetAudience},
         resources: {
           capital:  ${capital},
           time:  ${time},
           team:  ${team}
       }
      `;
        const chat_completion = yield openai.createChatCompletion({
            // stream: true,
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: prompt,
                },
            ],
        }
        // { responseType: "stream" }
        );
        const idea = (_a = chat_completion.data.choices[0].message) === null || _a === void 0 ? void 0 : _a.content;
        // console.log(chat_completion.data.choices[0].message?.content);
        const new_idea = new idea_model_1.Idea({
            idea: idea,
            // user: req.user._id,
            userBackground: [{ skills, experience }],
            userInterests,
            marketInformation: [
                {
                    industry,
                    trends,
                    gaps,
                },
            ],
            problems,
            targetAudience,
            resources: [
                {
                    capital,
                    time,
                    team,
                },
            ],
        });
        yield new_idea.save();
        res.status(200).json({ message: "idea created succesfully", new_idea });
    }
    catch (error) {
        res.status(500).json({ message: "server error", error });
        console.log(error);
    }
});
exports.generate_idea = generate_idea;
const idea_list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const search_term = req.query.search;
        const sort_by = req.query.sortBy;
        const sort_order = parseInt(req.query.sortOrder) || 1;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort_options = {};
        if (sort_by === "last_modified") {
            sort_options.created_date = sort_order;
        }
        const query = {};
        if (search_term) {
            query.idea = { $regex: search_term, $options: "i" };
            query.userBackground.skills = search_term;
            query.userBackground.experience = search_term;
            query.userInterests = search_term;
            query.marketInformation.industry = search_term;
            query.marketInformation.trends = search_term;
            query.marketInformation.gaps = search_term;
            query.problems = search_term;
            query.targetAudience = search_term;
            query.resources.capital = search_term;
            query.resources.time = search_term;
            query.resources.team = search_term;
        }
        const total_idea = yield idea_model_1.Idea.countDocuments(query);
        const total_pages = Math.ceil(total_idea / limit);
        const skip = (page - 1) * limit;
        const projects = yield idea_model_1.Idea.find(query)
            .sort(sort_options)
            .skip(skip)
            .limit(limit)
            .exec();
        if (total_idea == 0) {
            res.status(404).json({ message: "no projects found" });
        }
        else {
            res.status(200).json({
                projects,
                total_idea,
                total_pages,
                currentPage: page,
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: "server error", error });
    }
});
exports.idea_list = idea_list;
const idea_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idea = yield idea_model_1.Idea.findOne({ _id: req.params.id });
        if (!idea) {
            res.status(404).json({ message: "Idea not found" });
        }
        res.status(200).json({ message: "idea found", idea });
    }
    catch (error) {
        res.status(500).json({ message: "server error", error });
    }
});
exports.idea_details = idea_details;
