// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import passport from "passport";
// import "./config/passport.js"

// import auth from "./routes/authRoutes.js";
// import aiRoutes from "./routes/aiRoutes.js";
// import aiListingRoutes from "./routes/aiListingRoutes.js";
// import aiProposalRoutes from "./routes/aiProposalRoutes.js";
// import aiChatRoutes from "./routes/aiChatRoutes.js";
// import cookieParser from "cookie-parser";

// dotenv.config();

// const app = express();

// // app.use(cors());
// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true
// }));
// app.use(express.json());
// app.use(cookieParser());

// app.use(passport.initialize())

// app.use("/api/ai", aiRoutes);
// app.use("/api/ai", aiListingRoutes);

// app.use("/api/ai", aiProposalRoutes);

// app.use("/api/chat", aiChatRoutes);
// app.use("/api/auth", auth);
// app.get("/", (req, res) => {
//   res.send("Rayeva AI System Running");
// });

// export default app;


//************************************************************ */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";

// 🔹 Passport config for Google SSO
import "./config/passport.js";

// 🔹 Routes
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import aiListingRoutes from "./routes/aiListingRoutes.js";
import aiProposalRoutes from "./routes/aiProposalRoutes.js";
import aiChatRoutes from "./routes/aiChatRoutes.js";

dotenv.config();

const app = express();

// 🔹 CORS setup for frontend

const allowedOrigins = [
  "http://localhost:3000",
  "https://presonal-ai-chatbot.vercel.app"
]
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if(!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }else {
        return callback(new Error("CORS policy: Origin not allowed"));
      }
    },
    credentials: true, // allow cookies
  })
);

// 🔹 JSON parser
app.use(express.json());

// 🔹 Cookie parser
app.use(cookieParser());

// 🔹 Passport initialize for SSO
app.use(passport.initialize());

// 🔹 API Routes
app.use("/api/auth", authRoutes);       // Auth routes (login, signup, SSO)
app.use("/api/ai", aiRoutes);           // AI generic routes
app.use("/api/ai", aiListingRoutes);    // AI listing routes
app.use("/api/ai", aiProposalRoutes);   // AI proposal routes
app.use("/api/chat", aiChatRoutes);     // AI chat routes

// 🔹 Health check
app.get("/", (req, res) => {
  res.send("Rayeva AI System Running");
});

export default app;


