const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const DocumentModel = require("../model/documentModel");
const mongoose = require("mongoose");
const { log } = require("npmlog");

const getAllDocuments = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) return res.status(404).json({ message: "Invalid User" });
  const keywords = {
    $or: [{ owner: userId }, { "collaborators.user": userId }],
  };

  try {
    const documents = await DocumentModel.find(keywords)
      .populate({
        path: "owner",
        select: "username email",
      })
      .populate({
        path: "collaborators.user",
        select: "username email",
      });

    if (!documents) {
      return res.status(404).json({ message: "Documents not found" });
    }

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const createDocument = asyncHandler(async (req, res) => {
  const { title, collaborators = [], content = "" } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const data = {
    title,
    owner: req.user._id,
    content,
    collaborators: collaborators,
  };

  try {
    const document = await DocumentModel.create(data);

    let fulldocument = await DocumentModel.findById(document._id)
      .populate("owner", "-password")
      .populate("content");

    fulldocument = await fulldocument.populate({
      path: "collaborators.user",
      select: "username email",
    });

    if (!fulldocument) {
      return res.status(404).json({ message: "Document could not be created" });
    }

    res.status(200).json(fulldocument);
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const deleteDOcument = asyncHandler(async (req, res) => {
  try {
    const documentId = req.params.id;
    const deletedDocument = await DocumentModel.findByIdAndDelete(documentId);
    if (!deletedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const updateCollab = asyncHandler(async (req, res) => {
  try {
    const { documentId, newCollaborators } = req.body;
    const document = await DocumentModel.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const newCollaboratorIds = newCollaborators.map((collab) => collab.user);
    //console.log(newCollaboratorIds);
    const { collaborators } = document;

    const collabdata = collaborators.filter(
      (collab) => !newCollaboratorIds.includes(collab?.user?.toString())
    );

    //console.log(collabdata);

    let newCollaboratorsData = newCollaborators.map((collaborator) => ({
      user: collaborator.user,
      role: collaborator.role,
    }));

    newCollaboratorsData = [...collabdata, ...newCollaboratorsData];

    const updatedDocument = await DocumentModel.findByIdAndUpdate(
      documentId,
      {
        collaborators: newCollaboratorsData,
      },
      {
        new: true,
      }
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: "Failed to update document" });
    }

    res.status(200).json({
      message: "Document updated successfully",
      document: updatedDocument,
    });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getopendoc = asyncHandler(async (req, res) => {
  try {
    const documentId = req.params.id;
    const document = await DocumentModel.findById(documentId)
      .populate({
        path: "owner",
        select: "username email",
      })
      .populate({
        path: "collaborators.user",
        select: "username email",
      });
    if (!document)
      return res.status(402).json({ message: "Document not found" });
    res.status(200).json(document);
  } catch (error) {
    console.log(error.message);
  }
});

const updateDocument = asyncHandler(async (req, res) => {
  const documentId = req.params.id;
  const { content } = req.body;

  if (!content || !content.ops || !Array.isArray(content.ops)) {
    return res.status(400).json({ message: "Invalid content format" });
  }

  try {
    const document = await DocumentModel.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const text = content.ops.map((op) => op.insert).join("");

    document.content = text;
    const updatedDocument = await document.save();

    res.status(200).json({
      message: "Document updated successfully",
      document: updatedDocument,
    });
  } catch (err) {
    console.error(err.message);

    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid document ID" });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  getAllDocuments,
  createDocument,
  deleteDOcument,
  updateCollab,
  getopendoc,
  updateDocument,
};
