import { StudentModel } from "../models/StudentModel.js";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.body?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log(token,".......");
    
    console.log("hello guys");
    
    if (!token) {
      console.log("Token not found");
      return res
        .status(401)
        .json(new ApiError(401, "Unauthorized access to website!"));
    }
  

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    

    const user = await StudentModel.findOne({
      email: decodeToken.email,
    }).select("-refreshToken -password");

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found!"));
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error fetching user:", error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json(new ApiError(401, "Invalid or expired token."));
    }

    return res
      .status(500)
      .json(new ApiError(500, "An error occurred while fetching the user."));
  }
};
