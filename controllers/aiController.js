import Product from "../models/Product.js";
import { generateProductTags } from "../services/tagGenerator.js";

export const generateTagsController = async (req, res) => {
  try {
    const { productName, description, material, price } = req.body;

    if (!productName || !description) {
      return res.status(400).json({
        success: false,
        message: "Product name and description are required",
      });
    }

    // Call Gemini AI
    const aiResult = await generateProductTags({
      productName,
      description,
      
    });

    if (!aiResult.success) {
      return res.status(500).json({
        success: false,
        message: "AI generation failed",
      });
    }

    // Save to DB
    const product = await Product.create({
      productName,
      description,
      material,
      price,

      aiGenerated: aiResult.data,

      aiMeta: {
        prompt: aiResult.prompt,
        response: aiResult.rawResponse,
      },
    });
    console.log("Tag generated:", product);
    res.status(200).json({
      success: true,
      message: "AI tags generated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Controller Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};