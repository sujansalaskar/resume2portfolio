const Portfolio = require("../models/Portfolio");
const Analytics = require("../models/Analytics");

// CREATE PORTFOLIO
exports.createPortfolio = async (req, res) => {
  try {

    const { username, theme, content, profilePictureUrl, socialLinks, projects, experience, education } = req.body;

    const existing = await Portfolio.findOne({ username });

    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const portfolio = await Portfolio.create({
      userId: req.user.id,
      username,
      theme,
      content,
      profilePictureUrl: profilePictureUrl || "",
      socialLinks: socialLinks || {},
      projects: projects || [],
      experience: experience || [],
      education: education || [],
    });

    res.json(portfolio);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to create portfolio"
    });

  }
};



// PUBLISH PORTFOLIO
exports.publishPortfolio = async (req, res) => {

  try {

    const { portfolioId } = req.body;

    const portfolio = await Portfolio.findByIdAndUpdate(
      portfolioId,
      { isPublished: true },
      { new: true }
    );

    res.json(portfolio);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Publish failed"
    });

  }

};


// UNPUBLISH PORTFOLIO
exports.unpublishPortfolio = async (req, res) => {

  try {

    const { portfolioId } = req.body;

    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: portfolioId, userId: req.user.id },
      { isPublished: false },
      { new: true }
    );

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.json(portfolio);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Unpublish failed"
    });

  }

};



// GET PORTFOLIO (PUBLIC + TRACK VISIT)
exports.getPortfolioByUsername = async (req, res) => {

  try {

    const portfolio = await Portfolio.findOne({
      username: req.params.username,
      isPublished: true
    });

    if (!portfolio) {
      return res.status(404).json({
        message: "Portfolio not found"
      });
    }

    const sessionId = req.headers["x-session-id"];

    // Prevent duplicate visit within 10 minutes
    const recentVisit = await Analytics.findOne({
      portfolioId: portfolio._id,
      sessionId,
      visitedAt: { $gt: new Date(Date.now() - 10 * 60 * 1000) }
    });

    if (!recentVisit && sessionId) {

      // Parse device type from user-agent
      const ua = (req.headers["user-agent"] || "").toLowerCase();
      let deviceType = "Desktop";
      if (/tablet|ipad|playbook|silk/.test(ua)) {
        deviceType = "Tablet";
      } else if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/.test(ua)) {
        deviceType = "Mobile";
      }

      // Clean up referrer into a readable source name
      const rawReferrer = req.headers["referer"] || "direct";
      let referrer = "Direct";
      if (rawReferrer !== "direct") {
        try {
          const hostname = new URL(rawReferrer).hostname.replace("www.", "");
          const map = {
            "google.com": "Google", "google.co.in": "Google",
            "linkedin.com": "LinkedIn",
            "twitter.com": "Twitter", "x.com": "Twitter",
            "github.com": "GitHub",
            "facebook.com": "Facebook",
            "instagram.com": "Instagram",
            "youtube.com": "YouTube",
            "reddit.com": "Reddit",
          };
          referrer = map[hostname] || hostname;
        } catch {
          referrer = rawReferrer;
        }
      }

      await Analytics.create({
        portfolioId: portfolio._id,
        sessionId,
        ip: req.ip,
        device: deviceType,
        referrer,
        visitedAt: new Date()
      });

    }

    res.json(portfolio);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Error loading portfolio"
    });

  }

};

exports.getMyPortfolios = async (req, res) => {

  try {

    const portfolios = await Portfolio.find({
      userId: req.user.id
    }).sort({ createdAt: -1 })

    res.json(portfolios)

  } catch (err) {

    res.status(500).json({ message: "Failed to fetch portfolios" })

  }

}

exports.deletePortfolio = async (req, res) => {

  try {

    const portfolio = await Portfolio.findOneAndDelete({
      _id: req.params.portfolioId,
      userId: req.user.id
    })

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" })
    }

    res.json({ message: "Portfolio deleted" })

  } catch (err) {

    res.status(500).json({ message: "Delete failed" })

  }

}

exports.updatePortfolio = async (req, res) => {

  try {

    const portfolio = await Portfolio.findOneAndUpdate(

      {
        _id: req.params.portfolioId,
        userId: req.user.id
      },

      {
        content: req.body.content,
        profilePictureUrl: req.body.profilePictureUrl,
        socialLinks: req.body.socialLinks,
        projects: req.body.projects,
        experience: req.body.experience,
        education: req.body.education,
      },

      { new: true }

    )

    res.json(portfolio)

  } catch (err) {

    res.status(500).json({ message: "Update failed" })

  }

}

exports.previewPortfolio = async (req, res) => {

  try {

    const portfolio = await Portfolio.findOne({
      _id: req.params.portfolioId,
      userId: req.user.id
    })

    res.json(portfolio)

  } catch (err) {

    res.status(500).json({ message: "Preview failed" })

  }

}