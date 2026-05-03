import express from "express"
import {
 signup,
 verifyOTP,
 login,
 completeProfile,
 forgotPassword,
 resetPassword,
 logout

} from "../controllers/authController.js"
import passport from "passport";
import { generateToken } from "../utils/generateToken.js";
import {optionalAuthMiddleware} from "../middleware/optionalMiddleware.js"
import {authMiddleware} from "../middleware/authMiddleware.js"
import {userCheck} from "../controllers/authController.js"
const router = express.Router()

// for sso signup user

// step 1: Redirect to Google
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

// STEP 2: Callback
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "http://localhost:3000/login",
    }),
    async (req, res) => {
        try{
            const user = req.user;

            // JWT
            const token = generateToken(user._id);

            // Cookie
            res.cookie("token", token , {
                httpOnly: true,
                secure : true,
                sameSite: "strict",

            });

            // Redirect frontend
            res.redirect("http://localhost:3000/ai-chat");

        }catch(err){
            console.error("Google auth error : ",err);
            res.redirect("http://localhost:3000/login");

        }
    }
)






router.post("/signup",signup)
router.get("/user",authMiddleware ,userCheck)
router.post("/verify-otp",verifyOTP)

router.post("/login",login)
router.post("/forgot-password",forgotPassword  )
router.post("/reset-password",resetPassword)
router.post("/complete-profile",authMiddleware,completeProfile)


router.post("/logout",logout)
export default router


//************************************* */
// import express from "express";
// import passport from "passport";
// import { generateToken } from "../utils/generateToken.js";
// import {
//   signup,
//   verifyOTP,
//   login,
//   completeProfile,
//   forgotPassword,
//   resetPassword,
//   logout,
//   userCheck,
// } from "../controllers/authController.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";
// import { optionalAuthMiddleware } from "../middleware/optionalMiddleware.js";

// const router = express.Router();

// /* ==========================
//    🔹 Google SSO Routes
//    ========================== */

// // Step 1: Redirect user to Google login
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// // Step 2: Google callback
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     session: false,
//     failureRedirect: "http://localhost:3000/login",
//   }),
//   async (req, res) => {
//     try {
//       const user = req.user;

//       // Generate JWT token
//       const token = generateToken(user._id);

//       // Store token in secure cookie
//       res.cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//       });

//       // Redirect to frontend chat page
//       res.redirect("http://localhost:3000/ai-chat");
//     } catch (err) {
//       console.error("Google SSO error:", err);
//       res.redirect("http://localhost:3000/login");
//     }
//   }
// );

// /* ==========================
//    🔹 Email/Password Auth Routes
//    ========================== */

// // // Signup with email & password
// // router.post("/signup", signup);

// // // Verify OTP after signup
// // router.post("/verify-otp", verifyOTP);

// // // Login with email & password
// // router.post("/login", login);

// // // Forgot password
// // router.post("/forgot-password", forgotPassword);

// // // Reset password
// // router.post("/reset-password", resetPassword);

// // // Complete user profile (protected)
// // router.post("/complete-profile", authMiddleware, completeProfile);

// // // Logout
// // router.post("/logout", authMiddleware, logout);

// // // Get current user info (protected)
// // router.get("/user", authMiddleware, userCheck);

// // export default router;





