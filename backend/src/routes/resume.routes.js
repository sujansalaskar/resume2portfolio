const router = require("express").Router();
const multer = require("multer");
const auth = require("../middlewares/auth.middleware");

const { uploadResume } = require("../controllers/resume.controller");

const storage = multer.memoryStorage();

const upload = multer({ storage });

router.post("/upload", auth, upload.single("resume"), uploadResume);

module.exports = router;