const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const { uploadImage } = require("../controllers/upload.controller");

router.post("/image", auth, uploadImage);

module.exports = router;
