import { StudentModel } from "../models/StudentModel.js";
import ApiError from "../utils/ApiError";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.body?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      res.status(401).json(new ApiError(401, "Unauthorized access!"));
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await StudentModel.find(decodeToken.email).select(
      "-refreshToken -password"
    );

    if (!user) {
      res.status(404).json(new ApiError(404, "User not found!"));
    }

    req.user = user;

    next();
  } catch (error) {
      res.status(401).json(new ApiError(401, error?.message || "Invalid Access Token!"))
  }
};
