const jwt = require("jsonwebtoken");

function generateToken(payload, options = {}) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET in environment");
  }
  return jwt.sign(payload, secret, { expiresIn: "7d", ...options });
}

module.exports = { generateToken };

