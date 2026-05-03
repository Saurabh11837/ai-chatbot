import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export const generateProductTags = async (
  productData
) => {
  try {

    const prompt = `
Analyze this product and return JSON only.

Fields required:
1.category
2.subCategory
3.tags
4.sustainability
5.Generate 10 to 12 highly relevant SEO-friendly tags.

Product:
Name: ${productData.productName}
Description: ${productData.description}
Material: ${productData.material}
Price: ${productData.price}

Return format:

{
 "category": "",
 "subCategory": "",
 "tags": [],
 "sustainability": []
}
`;

// const prompt = `
// You are an e-commerce SEO and product tagging expert.

// Product Information:
// Name: ${productName}
// Description: ${description}

// Rules:
// 1. Generate 10 to 12 highly relevant SEO-friendly tags.
// 2. Include category, subcategory, and sustainability info if applicable.
// 3. Tags should be short and suitable for search/discovery.
// 4. Format output strictly in JSON:

// {
//   "category": "",
//   "subCategory": "",
//   "tags": [],
//   "sustainability": []
// }
// `;

// const prompt = `
// You are an expert e-commerce product tag generator.

// Given the product information and description below, generate a list of 10 to 12 **highly relevant and product-specific SEO-friendly tags** that would help customers discover this product online. 

// - Do NOT include generic terms like "Ecommerce Product", "Online Shopping", "Product Details", or any unrelated tags.
// - Focus ONLY on tags directly related to the product features, material, use case, and benefits.
// - Use concise and impactful tags.
// - Return JSON ONLY in the format:

// {
//   "tags": [ ...array of tags... ]
// }

// Product Name: ${productName}
// Product Description: ${description}
// `;

    const response = await client.chat.completions.create({
      model: process.env.GROQ_MODEL,
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const text = response.choices[0].message.content;

const clean = text.replace(/```json|```/g, "").trim();

const jsonMatch = clean.match(/\{[\s\S]*\}/);

if (!jsonMatch) {
  throw new Error("AI did not return valid JSON");
}

const parsed = JSON.parse(jsonMatch[0]);
    return {
      success: true,
      data: parsed,
      prompt,
      rawResponse: text
    };

  } catch (error) {

    console.error("Groq AI Error:", error);

    return {
      success: false,
      error: error.message
    };

  }
};