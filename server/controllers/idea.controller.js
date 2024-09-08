import { IdeaModel } from "../models/IdeaModel";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";

export const createIdea = async (req, res) => {
  try {
    const { title, description, requirements, email } = req.body;

    const newIdea = new IdeaModel({
      title,
      description,
      requirements,
      email,
    });

    const savedIdea = await newIdea.save();

    return res
      .status(201)
      .json(new ApiResponse(200, "Created successfully!", savedIdea));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Can't Create Idea!", error));
  }
};
