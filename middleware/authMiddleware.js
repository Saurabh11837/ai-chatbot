import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    let token;

    // 1️⃣ Get token from cookie (preferred)
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 2️⃣ Fallback: Authorization header
    else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log("Cookies:", req.cookies);
    console.log("Headers:", req.headers.cookie);
    // ❌ No token
    if (!token) {
      console.log("Token not found in authMiddleware");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing",
      });
    }
    console.log("Token authMiddleware : ",token)
    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token : ",decoded)
    // 4️⃣ Attach user info to request
    req.user = {
      id: decoded.userId || decoded.id,
    };

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    // अलग-अलग error handle करो
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired, please login again",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
    });
  }
};