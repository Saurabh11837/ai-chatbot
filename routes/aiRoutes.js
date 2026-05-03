import express from "express";
import { generateTagsController } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate-tags", generateTagsController);

export default router;