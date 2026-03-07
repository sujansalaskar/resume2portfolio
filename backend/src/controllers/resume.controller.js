const fs = require("fs");
const pdfParse = require("pdf-parse");
const { parseResumeWithAI } = require("../services/ai.service");

exports.uploadResume = async (req, res) => {
  try {

    console.log("Uploaded file:", req.file);

    const buffer = fs.readFileSync(req.file.path);

    const parsed = await pdfParse(buffer);

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