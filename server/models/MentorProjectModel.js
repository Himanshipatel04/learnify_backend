import mongoose from "mongoose";

const ProjectSchema = mongoose.Schema(
  {
    email:{
      type: String,
      required:true,
    },
    title: {
      type: String,
      required: true,
    }, 
    domain: {
      type: String,
      required: true,
    },
    abstract: {
      type: String,
      required: true,
    }, 
    description: {
      type: String,
      required: true,
    },
    videolink: {
      type: String,
    },
    githublink: {
      type: String,
    },
    image: {
      type: String, 
    },
  },
  {
    timestamps: true,
  }
);

export const MentorProjects = mongoose.model("MentorProject",ProjectSchema)
