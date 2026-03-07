const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");

const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  deleteAccount
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);
router.put("/profile", auth, updateProfile);
router.put("/password", auth, updatePassword);
router.delete("/account", auth, deleteAccount);

module.exports = router;