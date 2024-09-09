import cloudinary from "../config/cloudinary.config";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { ProjectModel } from "../models/ProjectModel";
import { StudentModel } from "../models/StudentModel";

const createProject = async (req, res) => {
  const {
    email,
    title,
    domain,
    abstract,
    description,
    videolink,
    githublink,
    collegename
  } = req.body;

  const user = await StudentModel.findOne({email})
  console.log(user.email);

  if (!user){
    return res.status(404).json(new ApiError(404,"User doesn't exist!"))
  }

  let imageUrl = null;
  
  if (req.file) {
    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) {
             return reject(error);
            } else {
              return resolve(result);
            }
          }
        ); 
        stream.end(req.file.buffer); 
      });
      imageUrl = result.secure_url;
      // console.log(imageUrl);
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return res
        .status(500)
        .json(new ApiError(500, "Error uploading image", error));
    }
  }

  try {
    const newProject = new ProjectModel({
      email,
      title,
      domain,
      abstract,
      description,
      videolink,
      githublink,
      collegename, 
      image: imageUrl,
    });
  
    newProject.save();
   
    res
      .status(201)
      .json(new ApiResponse(201, "Project uploaded successfully!", [newProject,user.name]));
  } catch (error) {
    console.error("Error uploading project:", error);
    res.status(500).json(new ApiError(500, "Error uploading project", error));
  }
};

export const fetchProject = async(req,res) => {
    try {
      const projects = await ProjectModel.find()

      res.status(200).json(new ApiResponse(200,"Projects fetched successfully!"))
    } catch (error) {
      res.status(500).json(new ApiError(500,"Internal server error!"))
    }
}

export default createProject;
