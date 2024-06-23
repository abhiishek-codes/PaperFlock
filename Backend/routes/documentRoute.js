const express = require("express");
const router = express.Router();
const protect = require("../middleware/authValidation");
const {
  getAllDocuments,
  createDocument,
  deleteDOcument,
  updateCollab,
  getopendoc,
  updateDocument,
} = require("../controller/documentController");

router.get("/", protect, getAllDocuments);
router.post("/create", protect, createDocument);
router.delete("/delete/:id", protect, deleteDOcument);
router.put("/updateAccess", protect, updateCollab);
router.route("/:id").get(protect, getopendoc).post(protect, updateDocument);

module.exports = router;
