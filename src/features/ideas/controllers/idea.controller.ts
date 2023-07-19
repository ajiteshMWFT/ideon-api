import { Request, Response } from "express";
import { Configuration, OpenAIApi } from "openai";
import { Idea } from "../models/idea.model";
import mongoose from "mongoose";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const generate_idea = async (req: Request, res: Response) => {
  try {
    const {
      skills,
      experience,
      userInterests,
      industry,
      trends,
      gaps,
      problems,
      targetAudience,
      capital,
      time,
      team,
    } = req.body;

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
    const chat_completion = await openai.createChatCompletion(
      {
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
    const idea = chat_completion.data.choices[0].message?.content;
    // console.log(chat_completion.data.choices[0].message?.content);

    const new_idea = new Idea({
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

    await new_idea.save();
    res.status(200).json({ message: "idea created succesfully", new_idea });
  } catch (error) {
    res.status(500).json({ message: "server error", error });
    console.log(error);
  }
};

export const idea_list = async (req: Request, res: Response) => {
  try {
    const search_term: string = req.query.search as string;
    const sort_by: string = req.query.sortBy as string;
    const sort_order: number = parseInt(req.query.sortOrder as string) || 1;
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;

    const sort_options: any = {};
    if (sort_by === "last_modified") {
      sort_options.created_date = sort_order;
    }
    const query: any = {};
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

    const total_idea: number = await Idea.countDocuments(query);
    const total_pages: number = Math.ceil(total_idea / limit);
    const skip: number = (page - 1) * limit;

    const projects = await Idea.find(query)
      .sort(sort_options)
      .skip(skip)
      .limit(limit)
      .exec();

    if (total_idea == 0) {
      res.status(404).json({ message: "no projects found" });
    } else {
      res.status(200).json({
        projects,
        total_idea,
        total_pages,
        currentPage: page,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
};

export const idea_details = async (req: Request, res: Response) => {
  try {
    const idea = await Idea.findOne({ _id: req.params.id });
    if (!idea) {
      res.status(404).json({ message: "Idea not found" });
    }
    res.status(200).json({ message: "idea found", idea });
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
};
