const { z } = require("zod");

const signupSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Name must be at least 1 character long" })
    .max(30, { message: "Name cannot exceed 30 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/^[a-zA-Z0-9!@#$%^&*()_+\[\]{}|;:',.<>/?-]+$/, {
      message: "Password must be alphanumeric and can include valid Symbol",
    }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const signupSchemaValidation = (req, res, next) => {
  try {
    const data = signupSchema.parse(req.body);
    next();
  } catch (error) {
    console.error("Signup validation error:", error.errors);
    res.status(400).json({ error: error.errors });
  }
};

// Middleware for validating login schema
const loginSchemaValidation = (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    next();
  } catch (error) {
    console.error("Login validation error:", error.errors);
    res.status(400).json({ error: error.errors });
  }
};

module.exports = {
  signupSchemaValidation,
  loginSchemaValidation,
};
