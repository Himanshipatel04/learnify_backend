import { StudentModel } from "../models/StudentModel";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
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
  };

  res.
  status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(200, "Student Logged in successfully!", {
      user: { accessToken, loggedInUser },
    })
  );
};


