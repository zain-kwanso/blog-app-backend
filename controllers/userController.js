const { User } = require("../models");
const statusCodes = require("../constants/statusCodes");

// exports.createUser = async (req, res) => {
//   try {
//     const user = await User.create(req.body);
//     return res.status(statusCodes.CREATED).json(user);
//   } catch (error) {
//     return res.status(statusCodes.BAD_REQUEST).json({ error: error.message });
//   }
// };

// exports.getUser = async (req, res) => {
//   try {
//     const user = await User.findByPk(req.params.id);
//     if (user) {
//       return res.status(statusCodes.SUCCESS).json(user);
//     }
//     return res.status(statusCodes.NOT_FOUND).json({ error: "User not found" });
//   } catch (error) {
//     return res.status(statusCodes.BAD_REQUEST).json({ error: error.message });
//   }
// };

// exports.getAllUser = async (req, res) => {
//   try {
//     const allUsers = await User.findAll({
//       offset: 0,
//       limit: 2,
//     });
//     if (allUsers) {
//       return res.status(statusCodes.SUCCESS).json(allUsers);
//     }
//     return res.status(statusCodes.NOT_FOUND).json({ error: "Users not found" });
//   } catch (error) {
//     res.status(statusCodes.BAD_REQUEST).json({ error: error.message });
//   }
// };

// exports.deleteUser = async (req, res) => {
//   try {
//     const deletedUser = await User.destroy({
//       where: {
//         userID: req.params.id,
//       },
//     });
//     if (deletedUser) {
//       res.status(statusCodes.SUCCESS).json(deletedUser);
//     } else {
//       res.status(statusCodes.NOT_FOUND).json({ error: "User not found" });
//     }
//   } catch (error) {
//     res.status(statusCodes.BAD_REQUEST).json({ error: error.message });
//   }
// };

// exports.getPostByUser = async (req, res) => {
//   try {
//     const posts = await Post.findAll({
//       where: {
//         userID: req.user.userID,
//       },
//       include: {
//         model: Comment,
//         where: { parentID: null }, // Fetch only top-level comments
//         required: false,
//         include: {
//           model: Comment,
//           as: "replies",
//           required: false,
//           include: {
//             model: Comment,
//             as: "replies",
//             required: false,
//           },
//         },
//       },
//     });
//     if (posts) {
//       return res.status(statusCodes.SUCCESS).json(posts);
//     }
//     return res.status(statusCodes.NOT_FOUND).json({ error: "Posts not found" });
//   } catch (error) {
//     return res.status(statusCodes.BAD_REQUEST).json({ error: error.message });
//   }
// };
