import { IdeaModel } from "../models/IdeaModel.js";
import { MentorModel } from "../models/MentorModel.js";
import { MentorProjects } from "../models/MentorProjectModel.js";
import { ProjectModel } from "../models/ProjectModel.js";
import { StudentModel } from "../models/StudentModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

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

export const deleteProjectMentor = async(req,res) => {
  try {
    const {id} = req.params
    const project = await MentorProjects.findById(id)
    if (!project){
      return res.status(404).json(new ApiError(404,"Project not found!"))
    }
    await MentorProjects.findByIdAndDelete(id)
    return res.status(200).json(new ApiResponse(200,"Deleted successfully!"))
    
  } catch (error) {
    console.log("Error while deleting project of mentor!",error);
  }
}

const adminCredentials = {
    email: "himanshi@gmail.com",
    password: bcrypt.hashSync("654321", 10)
   
};

export const adminLogin = (req, res) => {
  const { email, password } = req.body;


  if (email === adminCredentials.email) {
      
      const isPasswordValid = bcrypt.compareSync(password, adminCredentials.password);

      if (isPasswordValid) {
          const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
          res.cookie('token', token, {
                httpOnly: true, 
                sameSite: 'None',  
                maxAge: 3600000     
            });
          return res.status(200).json({ token, message: "Admin login successful!" });
      }

      return res.status(401).json({ message: "Invalid email or password" });
  }

  return res.status(401).json({ message: "Invalid email or password" });
};
