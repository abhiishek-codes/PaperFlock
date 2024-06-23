const mongoose = require("mongoose");

const connectDb = async () => {
  const url = process.env.MONGO_URI;
  try {
    await mongoose.connect(url);
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw new Error(error.message);
  }
};

module.exports = connectDb;
