const express = require("express");
const router = express.Router();
const {
  loginSchemaValidation,
  signupSchemaValidation,
} = require("../middleware/zodValidation");
const {
  userLogin,
  userSignup,
  getallUsers,
} = require("../controller/authController");
const protect = require("../middleware/authValidation");

router.post("/login", loginSchemaValidation, userLogin);
router.post("/signup", signupSchemaValidation, userSignup);
router.get("/", protect, getallUsers);

module.exports = router;
