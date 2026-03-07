const Analytics = require("../models/Analytics");
const Portfolio = require("../models/Portfolio");
const mongoose = require("mongoose");


/*
=====================================
ACCOUNT DASHBOARD ANALYTICS
=====================================
Shows:
- total visits
- unique visitors
- total published sites
- conversion rate
=====================================
*/

exports.getDashboardAnalytics = async (req, res) => {

  try {

    const portfolios = await Portfolio.find({
      userId: req.user.id
    });

    const portfolioIds = portfolios.map(p => p._id);

    const totalVisits = await Analytics.countDocuments({
      portfolioId: { $in: portfolioIds }
    });

    const uniqueVisitors = await Analytics.distinct(
      "sessionId",
      { portfolioId: { $in: portfolioIds } }
    );

    const publishedSites = portfolios.filter(
      p => p.isPublished
    ).length;

    const conversionRate = totalVisits
      ? ((publishedSites / totalVisits) * 100).toFixed(2)
      : 0;

    res.json({
      totalVisits,
      uniqueVisitors: uniqueVisitors.length,
      publishedSites,
      conversionRate
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to load dashboard analytics"
    });

  }

};



/*
=====================================
PORTFOLIO ANALYTICS
=====================================
Shows:
- visits
- unique visitors
- bounce rate
- visits over time
- device types
- countries
- referrers
=====================================
*/

exports.getPortfolioAnalytics = async (req, res) => {

  try {

    const portfolioId = new mongoose.Types.ObjectId(
      req.params.portfolioId
    );

    /*
    --------------------------
    TOTAL VISITS
    --------------------------
    */

    const totalVisits = await Analytics.countDocuments({
      portfolioId
    });

    /*
    --------------------------
    UNIQUE VISITORS
    --------------------------
    */

    const uniqueVisitors = await Analytics.distinct(
      "sessionId",
      { portfolioId }
    );



    /*
    --------------------------
    VISITS OVER TIME
    --------------------------
    */

    const visitsOverTime = await Analytics.aggregate([
      { $match: { portfolioId } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$visitedAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);



    /*
    --------------------------
    DEVICE TYPES
    --------------------------
    */

    const deviceTypes = await Analytics.aggregate([
      { $match: { portfolioId } },
      {
        $group: {
          _id: "$device",
          count: { $sum: 1 }
        }
      }
    ]);



    /*
    --------------------------
    TOP COUNTRIES
    --------------------------
    */

    const countries = await Analytics.aggregate([
      { $match: { portfolioId } },
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);



    /*
    --------------------------
    REFERRER SOURCES
    --------------------------
    */

    const referrers = await Analytics.aggregate([
      { $match: { portfolioId } },
      {
        $group: {
          _id: "$referrer",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);



    /*
    --------------------------
    BOUNCE RATE
    --------------------------
    */

    const sessions = await Analytics.aggregate([
      { $match: { portfolioId } },
      {
        $group: {
          _id: "$sessionId",
          count: { $sum: 1 }
        }
      }
    ]);

    const bouncedSessions = sessions.filter(
      s => s.count === 1
    ).length;

    const bounceRate = sessions.length
      ? ((bouncedSessions / sessions.length) * 100).toFixed(2)
      : 0;



    /*
    --------------------------
    RESPONSE
    --------------------------
    */

    res.json({
      totalVisits,
      uniqueVisitors: uniqueVisitors.length,
      bounceRate,
      visitsOverTime,
      deviceTypes,
      countries,
      referrers
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to load portfolio analytics"
    });

  }

};