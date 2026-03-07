const pdfParse = require("pdf-parse");
const { parseResumeWithAI } = require("../services/ai.service");

exports.uploadResume = async (req, res) => {
  try {

    console.log("Uploaded file:", req.file ? req.file.originalname : "none");

    if (!req.file) {
      return res.status(400).json({ message: "No resume file provided" });
    }

    const parsed = await pdfParse(req.file.buffer);

    console.log("Extracted text length:", parsed.text.length);

    const aiResult = await parseResumeWithAI(parsed.text);

    const cleaned = aiResult.replace(/```json|```/g, "");

    const structuredData = JSON.parse(cleaned);

    res.json({
      resume: structuredData
    });

  } catch (err) {

    console.error("Resume parsing error:", err);

    res.status(500).json({
      message: "Resume parsing failed",
      error: err.message
    });

  }
};