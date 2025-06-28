import jwt from "jsonwebtoken";
import User from "../models/auth_model.js";

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) return res.status(401).json({ message: "Invalid token" });

    next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export default authenticateUser;
