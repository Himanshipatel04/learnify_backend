import mongoose from "mongoose";

const IdeaSchema = mongoose.Schema(
  {
   
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
      },
  },
  {
    timestamps: true,
  }
);

export const IdeaModel = mongoose.model("Idea",IdeaSchema)
