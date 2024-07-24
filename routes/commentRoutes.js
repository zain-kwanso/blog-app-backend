const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authenticateToken } = require("../Middleware/auth");

router.post("/create", authenticateToken, commentController.createComment);
router.get("/:id", commentController.getComment);
router.delete("/:id", authenticateToken, commentController.deleteComment);
router.put("/:id", authenticateToken, commentController.updateComment);

module.exports = router;
