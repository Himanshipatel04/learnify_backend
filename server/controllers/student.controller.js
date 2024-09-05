import { StudentModel } from "../models/StudentModel";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import bcrypt from "bcrypt";



export const registerUser = async (req, res) => {
    const { email, password, name } = req.body;
 
    const userExists = await StudentModel.findOne({ $or: [{ name }, { email }] });
  
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