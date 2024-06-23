const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ message: "Not Authorized: Invalid Authorization Header" });
    }
    const token = header.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not Authorized: Token not found" });
    }
    const verified = await jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({ message: "Not Authorized: Invalid Token" });
    }
    const user = await User.findById(verified.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not Authorized: User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protect middleware:", error);
    return res
      .status(401)
      .json({ message: "Not Authorized: " + error.message });
  }
};

module.exports = protect;
