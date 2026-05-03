import express from "express";
import { generateProductListing } from "../controllers/aiListingController.js";

const router = express.Router();

router.post("/generate-listing", generateProductListing);

export default router;