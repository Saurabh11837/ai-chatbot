import { generateListingFromAI } from "../services/aiListingService.js";

export const generateProductListing = async (req, res) => {
  try {
    const { productName, material, price, targetMarket } = req.body;

    if (!productName) {
      return res.status(400).json({
        success: false,
        message: "Product name is required"
      });
    }

    const aiResult = await generateListingFromAI({
      productName,
      material,
      price,
      targetMarket
    });
    console.log("AI Listing Result:", aiResult);
    res.json({
      success: true,
      message: "AI product listing generated",
      data: aiResult
    });

  } catch (error) {
    console.error("AI Listing Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate listing"
    });
  }
};