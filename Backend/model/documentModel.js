const mongoose = require("mongoose");

// Define the document schema
const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed, // Change the type to Mixed
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastReadBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["read", "write"],
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
