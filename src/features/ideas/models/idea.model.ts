import mongoose from "mongoose";

const idea_schema = new mongoose.Schema({
  idea: {
    type: String,
  },
  userBackground: [
    {
      skills: [String],
      experience: [String],
    },
  ],
  excerpt: {
    type: String,
  },
  userInterests: [String],
  marketInformation: [
    {
      industry: String,
      trends: [String],
      gaps: [String],
    },
  ],
  problems: [String],
  targetAudience: [String],
  resources: [
    {
      capital: String,
      time: String,
      team: String,
    },
  ],
  auther: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  created_date: {
    type: Date,
    default: new Date(),
  },
});

export const Idea = mongoose.model("Idea", idea_schema);
