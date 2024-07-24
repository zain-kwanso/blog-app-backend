const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authenticateToken } = require("../Middleware/auth");

router.post("/create", authenticateToken, postController.createPost);
router.get("/", authenticateToken, postController.getAllPosts);
router.get("/user", authenticateToken, postController.getPostsByUser);
router.delete("/:id", authenticateToken, postController.deletePost);
router.put("/:id", authenticateToken, postController.updatePost);

module.exports = router;
