import jwt from "jsonwebtoken";

// export const optionalAuthMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization || "";
//   // const authHeader=req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");
//   const token = authHeader.split(" ")[1];
//   console.log("Atuh Header", authHeader);
//   if (!token) {
//     // No token sent, proceed as anonymous user
//     console.log("Token is empty in optionalMiddleware",token);
//     req.middleware = null;
//     return next();
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.optionalMiddleware = { id: decoded.id };
//     next();
//   } catch (err) {
//     // Invalid token, but don't block, proceed as anonymous user
//     req.optionalMiddleware = null;
//     next();
//   }
// };



export const optionalAuthMiddleware = (req, res, next) => {
  try {

    let token = null;
    console.log("Cookies:", req.cookies);
    // 1️⃣ cookie se token
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 2️⃣ Authorization header se token
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace("Bearer ", "");
    }

    if (!token) {
      console.log("Token not found");
      req.optionalMiddleware = null;
      return next(); // optional middleware hai, block nahi karna
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.optionalMiddleware = { id: decoded.id };

    next();

  } catch (err) {

    console.log("Optional Middleware Error:", err.message);

    req.optionalMiddleware = null;

    next();
  }
};

