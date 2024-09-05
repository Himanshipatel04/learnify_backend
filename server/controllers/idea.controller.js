import mongoose from "mongoose";
import { IdeaModel } from "../models/IdeaModel";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";

export const createIdea = async (req, res) => {
    try {
        const { title, description, requirements, user } = req.body; 
    
        const newIdea = new IdeaModel({
            title,
            description,
            requirements,
            user,
        });

        const savedIdea = await newIdea.save();

        res.status(201).json(new ApiResponse(200,"Created successfully!",savedIdea))
    } catch (error) {
       
       res.status(500).json(new ApiError(500,"Can't Create",error))
    }
};


