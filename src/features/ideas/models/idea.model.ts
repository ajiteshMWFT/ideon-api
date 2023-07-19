import mongoose from "mongoose";

const idea_schema = new mongoose.Schema({
  idea: {
    type: String,
  },
  userBackground: [{
    skills: [String],
    experience: [String],
  }],
  userInterests: [String],
  marketInformation: [{
    industry: String,
    trends: [String],
    gaps: [String],
  }],
  problems: [String],
  targetAudience: [String],
  resources: [{
    capital: String,
    time: String,
    team: String,
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  created_date:{
    type:Date,
    default: new Date()
  }
});

export const Idea = mongoose.model("Idea", idea_schema);
