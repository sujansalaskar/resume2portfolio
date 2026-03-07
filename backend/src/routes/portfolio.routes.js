const router = require("express").Router()

const auth = require("../middlewares/auth.middleware")

const {
    createPortfolio,
    publishPortfolio,
    unpublishPortfolio,
    getPortfolioByUsername,
    getMyPortfolios,
    deletePortfolio,
    updatePortfolio,
} = require("../controllers/portfolio.controller")

router.post("/create", auth, createPortfolio)

router.post("/publish", auth, publishPortfolio)
router.post("/unpublish", auth, unpublishPortfolio)

router.get("/my", auth, getMyPortfolios)

router.get("/:username", getPortfolioByUsername)

router.delete("/:portfolioId", auth, deletePortfolio)
router.patch("/:portfolioId", auth, updatePortfolio)

module.exports = router