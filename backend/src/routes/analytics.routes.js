const router = require("express").Router();

const auth = require("../middlewares/auth.middleware");

const {
  getDashboardAnalytics,
  getPortfolioAnalytics
} = require("../controllers/analytics.controller");


// Account dashboard analytics
router.get("/dashboard", auth, getDashboardAnalytics);


// Individual portfolio analytics
router.get("/portfolio/:portfolioId", auth, getPortfolioAnalytics);


module.exports = router;