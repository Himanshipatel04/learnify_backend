import cloudinary from "../config/cloudinary.config.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ProjectModel } from "../models/ProjectModel.js";
import { StudentModel } from "../models/StudentModel.js";

const createProject = async (req, res) => {
  const {
    email,
    title,
    domain,
    abstract,
    description,
    videolink,
    githublink,
    collegename,
  } = req.body;

  const user = await StudentModel.findOne({ email });
  // console.log(user.email);

  if (!user) {
    return res.status(404).json(new ApiError(404, "User doesn't exist!"));
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
      .json(
        new ApiResponse(201, "Project uploaded successfully!", [
          newProject,
          user.name,
        ])
      );
  } catch (error) {
    console.error("Error uploading project:", error);
    res.status(500).json(new ApiError(500, "Error uploading project", error));
  }
};

export const fetchProject = async (req, res) => {
  try {
    const projects = await ProjectModel.find();

    res
      .status(200)
      .json(new ApiResponse(200, "Projects fetched successfully!", projects));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Internal server error!"));
  }
};

export const fetchProjectById = async (req, res) => {
  const projectID = req.params.id;
  try {
    const project = await ProjectModel.findById(projectID);

    if (!project) {
      return res.status(404).send("Project not found");
    }

    const name = await StudentModel.findOne({ email: project.email });

    if (!name) {
      return res.status(400).json(new ApiError(400, "Something went wrong!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Fetched successfully!", [project, name]));
  } catch (error) {}
};

export const groupProject = async (req, res) => {
  try {
    const groupedProjects = await ProjectModel.aggregate([
      {
        $group: {
          _id: "$collegename", // Group by collegeName
          projects: { $push: "$$ROOT" }, // Push all project data
          totalProjects: { $sum: 1 }, // Count total projects per college
        },
      },
    ]);
   return res
      .status(200)
      .json(new ApiResponse(200, "Projects fetched!", groupedProjects));
  } catch (error) {
    console.log("Error grouping Projects by college", error);
  }
};

export const groupDomain = async (req, res) => {
  try {
    const domainData = await ProjectModel.aggregate([
      {
        $group: {
          _id: "$domain",
          domainSegregated: { $push: "$$ROOT" },
          totalProjects: { $sum: 1 },
        },
      },
    ]);
    return res
      .status(200)
      .json(new ApiResponse(200, "Projects fetched!", domainData));
  } catch (error) {
    console.log("Error grouping Projects by domain", error);
  }
};

export default createProject;
