import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const generateListingFromAI = async ({
  productName,
  description,
}) => {
  
// First promt for generating tags
// const prompt = `
// Generate an ecommerce product listing.

// Return ONLY JSON.

// Fields:
// title
// shortDescription
// fullDescription
// category
// tags
// seoKeywords

// Product:
// Name: ${productName}
// Material: ${material}
// Price: ${price}
// Target Market: ${targetMarket}

// Return format:

// {
//  "title":"",
//  "shortDescription":"",
//  "fullDescription":"",
//  "category":"",
//  "tags":[],
//  "seoKeywords":[]
// }
// `;

// Second prompt for generating tags based on the listing information
// const prompt = `
// You are an e-commerce SEO expert.

// Analyze the product and generate optimized search tags.

// Product Information:
// Name: ${productName}
// Description: ${description}
// Material: ${material}
// Category: ${category}

// Rules:
// - Generate 8 to 12 short tags
// - Tags should be SEO friendly
// - Tags must be relevant for e-commerce search
// - Avoid duplicate tags

// Return JSON only:

// {
//  "category": "",
//  "subCategory": "",
//  "tags": [],
//  "sustainability": []
// }
// `
// Short and focused prompt for generating tags based on the product information.
const prompt = `
You are an e-commerce SEO and product tagging expert.

Product Information:
Name: ${productName}
Description: ${description}

Rules:
1. Generate 10 to 12 highly relevant SEO-friendly tags.
2. Include category, subcategory, and sustainability info if applicable.
3. Tags should be short and suitable for search/discovery.
4. Format output strictly in JSON:

{
  "category": "",
  "subCategory": "",
  "tags": [],
  "sustainability": []
}
`;


const response = await groq.chat.completions.create({
  model: process.env.GROQ_MODEL,
  messages: [
    {
      role: "user",
      content: prompt
    }
  ]
});

const text = response.choices[0].message.content;

const clean = text.replace(/```json|```/g, "").trim();

const jsonMatch = clean.match(/\{[\s\S]*\}/);

if (!jsonMatch) {
  throw new Error("Invalid AI JSON response");
}

return JSON.parse(jsonMatch[0]);

};