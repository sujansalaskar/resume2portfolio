const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", require("./routes/auth.routes"));
const authMiddleware = require("./middlewares/auth.middleware");

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user
  })
})
app.use("/api/portfolio", require("./routes/portfolio.routes"))
app.use("/api/analytics", require("./routes/analytics.routes"));
app.use("/api/resume", require("./routes/resume.routes"));
app.use("/api/upload", require("./routes/upload.routes"));
app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});