const jwt = require("jsonwebtoken");

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function getUserFromAuthHeader(authHeader) {
  try {
    if (!authHeader) return null;
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return null;
    const token = parts[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

function requireAuth(context) {
  if (!context.user) {
    const err = new Error("Unauthorized. Missing/invalid token.");
    err.code = "UNAUTHORIZED";
    throw err;
  }
}

module.exports = { signToken, getUserFromAuthHeader, requireAuth };