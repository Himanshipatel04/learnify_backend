import { IdeaModel } from "../models/IdeaModel";
import { MentorModel } from "../models/MentorModel";
import { ProjectModel } from "../models/ProjectModel";
import { StudentModel } from "../models/StudentModel";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

export const getAllUsers = async (req, res) => {
  try {
    const users = await StudentModel.find();

    res.status(200).json(new ApiResponse(200, "Users fetched", users));
  } catch (error) {
    console.log("Error while fetching students for admin!", error);
  }
};


export const deleteUsers = async(req,res) => {
  try {
    console.log("heelo");
    const {id} = req.params
    const user = await StudentModel.findById(id);
    if (!user){
      return res.status(404).json(new ApiError(404,"User not found!"))
    }
    await StudentModel.findByIdAndDelete(id);
   return res.status(200).json(new ApiResponse(200,"Deleted successfully!"))
  } catch (error) {
    console.log("Error while deleting User!",error);
  }
}

export const deleteProject = async(req,res) => {
  try {
    const {id} = req.params
    // console.log("hihih");
    const project = await ProjectModel.findById(id)
    if (!project){
      return res.status(404).json(new ApiError(404,"Project not found!"))
    }
    await ProjectModel.findByIdAndDelete(id)
    return res.status(200).json(new ApiResponse(200,"Deleted successfully!"))
  } catch (error) {
    console.log("Error while deleting project!",error);
  }
}

export const deleteIdea = async(req,res) => {
  try {
    const {id} = req.params
    // console.log("hihih");
    const idea = await IdeaModel.findById(id)
    if (!idea){
      return res.status(404).json(new ApiError(404,"Idea not found!"))
    }
    await IdeaModel.findByIdAndDelete(id)
    return res.status(200).json(new ApiResponse(200,"Deleted successfully!"))
  } catch (error) {
    console.log("Error while deleting idea!",error);
  }
}

export const deleteMentor = async(req,res) => {
  try {
    const {id} = req.params
    // console.log("hihih");
    const mentor = await MentorModel.findById(id)
    if (!mentor){
      return res.status(404).json(new ApiError(404,"Mentor not found!"))
    }
    await MentorModel.findByIdAndDelete(id)
    return res.status(200).json(new ApiResponse(200,"Deleted successfully!"))
  } catch (error) {
    console.log("Error while deleting Mentor!",error);
  }
}

export const findValues = async(req,res) => {
  try {
    const users = await StudentModel.countDocuments({})
    const projects = await ProjectModel.countDocuments({})
    const ideas = await IdeaModel.countDocuments({})
    const mentors = await MentorModel.countDocuments({})
    return res.status(200).json(new ApiResponse(200,"Fetched numbers!",{users,projects,ideas,mentors}))
  } catch (error) {
    console.log("Error while fetching values!",error);
  }
}