const cloudinary = require("../config/cloudinary");

exports.uploadImage = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ message: "No image provided" });
        }

        const result = await cloudinary.uploader.upload(image, {
            folder: "portfolio-builder",
            resource_type: "image",
        });

        res.json({ url: result.secure_url });
    } catch (err) {
        console.error("Image upload error:", err);
        res.status(500).json({
            message: "Image upload failed",
            error: err.message,
        });
    }
};
