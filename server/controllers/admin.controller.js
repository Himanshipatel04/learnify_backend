import { StudentModel } from "../models/StudentModel";
import ApiResponse from "../utils/ApiResponse";

export const getAllUsers = async (req, res) => {
  try {
    const users = await StudentModel.find();

    res.status(200).json(new ApiResponse(200, "Users fetched", users));
  } catch (error) {
    console.log("Error while fetching students for admin!", error);
  }
};
