import { MentorModel } from "../models/MentorModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import cloudinary from "../config/cloudinary.config.js";
import { MentorProjects } from "../models/MentorProjectModel.js";

const generateAccessAndRefreshToken = async (uid) => {
  try {
    const mentor = await MentorModel.findOne({ _id: uid });
    if (!mentor) {
      throw new ApiError(404, "Mentor not found!");
    }
    const accessToken = mentor.generateAccessToken();
    const refreshToken = mentor.generateRefreshToken();

    mentor.refreshToken = refreshToken;
    mentor.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error in generateAccessAndRefreshToken for mentor", error);
  }
};

export const registerMentor = async (req, res) => {
  try {
    const { name, email, designation, company, linked, password } = req.body;
    const image = req.file;

    const mentorExists = await MentorModel.findOne({ email });

    if (mentorExists) {
      return res.status(400).json(new ApiError(400, "Mentor already exists!"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl = null;
    if (image) {
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          stream.end(image.buffer);
        });
        imageUrl = result.secure_url;
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return res
          .status(500)
          .json(new ApiError(500, "Error uploading image", error));
      }
    }

    const newMentor = await MentorModel.create({
      name,
      email,
      designation,
      company,
      linked,
      password: hashedPassword,
      image: imageUrl,
    });

    newMentor.save();
    res
      .status(201)
      .json(new ApiResponse(201, "Mentor created successfully", newMentor));
  } catch (error) {
    console.log("Error in registerMentor", error);
  }
};

export const loginMentor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const mentor = await MentorModel.findOne({ email });

    if (!mentor) {
      return res.status(404).json(new ApiError(404, "Mentor not found!"));
    }

    const isPasswordCorrect = await mentor.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json(new ApiError(400, "Incorrect Password for Mentor!"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      mentor._id
    );

    const options = { httpOnly: true, sameSite: "None", secure: true };

    const mentorIn = await MentorModel.findById(mentor._id).select(
      "-refreshToken -password"
    );

    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json(
        new ApiResponse(200, "Mentor logged in successfully", {
          user: { accessToken, mentorIn },
        })
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Error in loginMentor"));
  }
};

export const getMentorUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found!"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "User fetched successfully!", user));
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

export const logout = async (req, res) => {
  try {
    await MentorModel.findByIdAndUpdate(
      req.user?._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      { new: true }
    );

    const options = { httpOnly: true };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, "Logged out successfully!"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Error while logging out in mentor!"));
    console.log("Error while logging out for mentor", error);
  }
};

export const getMentors = async (req, res) => {
  const mentors = await MentorModel.find();
  res.status(200).json(new ApiResponse(200, "Mentors fetched!", mentors));
};

export const createMentorProject = async (req, res) => {
  const { email, title, domain, abstract, description, videolink, githublink } =
    req.body;

  const user = await MentorModel.findOne({ email });
  // console.log(user.email);

  if (!user) {
    return res.status(404).json(new ApiError(404, "Mentor doesn't exist!"));
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
    const newProject = new MentorProjects({
      email,
      title,
      domain,
      abstract,
      description,
      videolink,
      githublink,
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

export const getProjects = async (req, res) => {
  try {
    const projects = await MentorProjects.find();
    return res
      .status(200)
      .json(new ApiResponse(200, "Projects fetched!", projects));
  } catch (error) {
    console.log("Error in getProjects", error);
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await MentorProjects.findById(id);
    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not found!"));
    }
    const mentor = await MentorModel.findOne({ email: project.email });
    if (!mentor) {
      return res.status(404).json(new ApiError(404, "Mentor not found!"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Project fetched!", [project, mentor]));
  } catch (error) {
    console.log("Error in getProjectById", error);
  }
};
