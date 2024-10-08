import { IdeaModel } from "../models/IdeaModel.js";
import { StudentModel } from "../models/StudentModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";

const generateAccessAndRefreshToken = async (uid) => {
  try {
    const user = await StudentModel.findById(uid);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens!"
    );
  }
};

export const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  const userExists = await StudentModel.findOne({ email });

  if (userExists) {
    throw new ApiError(409, "User already exits!");
  } 

  const hashedPassword = await bcrypt.hash(password, 10);

  const student = await StudentModel.create({
    name,
    password: hashedPassword,
    email,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "User created successfully!", student));
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await StudentModel.findOne({ email });

    if (!user) {
      res.status(404).json(new ApiError(404, "User not found!"));
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      res.status(400).json(new ApiError(400, "Incorrect Password!"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await StudentModel.findById(user._id).select(
      "-refreshToken -password"
    );

    const options = {
      httpOnly: true,
      secure: true, 
      sameSite: 'None',
    };

    // console.log(accessToken);
    // console.log(refreshToken);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, "Student Logged in successfully!", {
          user: { accessToken, loggedInUser },
        })
      );
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

export const getStudentUser = async (req, res) => {
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
    // console.log("hello");
    await StudentModel.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    const options ={
      httpOnly:true,
      secure: true, 
      sameSite: 'None',
    }

    res.status(200).clearCookie('accessToken',options).clearCookie('refreshToken',options).json(new ApiResponse(200, "Logged out successfully!"));

  } catch(error) {
    res.status(500).json(new ApiError(500, "Error while logging out!"));
  }
};

export const studentIdeas = async(req,res) => {
  try{ 
    //  console.log("hello");
       const {email} = req.params.email
       const ideas = await IdeaModel.find({email})
       return res.status(200).json(new ApiResponse(200,"Fetched",ideas))
  }
  catch(error){
          console.log("Error while fetching ideas for users!",error);
  }
}