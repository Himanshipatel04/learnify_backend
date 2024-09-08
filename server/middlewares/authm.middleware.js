import { MentorModel } from "../models/MentorModel";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";

export const verifyJWTM = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.body?.accessToken ||
      req.headers['authorization']?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json(new ApiError(401, "Unauthorized access to website! (Token not found)"));
    }

    // Verify the token
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the mentor by email
    const mentor = await MentorModel.findOne({ email: decodeToken.email }).select(
      "-password -refreshToken"
    );

    if (!mentor) {
      return res.status(404).json(new ApiError(404, "Mentor not found!"));
    }

    // Attach the user (mentor) object to the request
    req.user = mentor;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error from mentor auth middleware:", error);
    return res.status(500).json(new ApiError(500, "Internal server error during authentication"));
  }
};
