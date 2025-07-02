import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    let token = null;

    // First try Authorization header (for production cross-domain)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
    // Fallback to cookies (for local development)
    else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ msg: "unauthorized - No token provided" });
    }

    // Verify your own JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ msg: "unauthorized - invalid token" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log("error:", error.message);
    return res.status(500).json({ msg: "server error" });
  }
};
