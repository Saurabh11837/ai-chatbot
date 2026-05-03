import { response } from "express";
import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            trim: true,
        
        },
        description: {
            type: String,
            required: true,
        },
        material:{
            type: String,
        },
        price: {
            type: Number,
        },
        aiGenerated:{
            category: String,
            subCategory: String,
            tags:[String],
            sustainability: [String],
        },
        aiMeta: {
            prompt: String,
            response: String,
        },
    },
    { timestamps: true },
);
const Product = mongoose.model("Product", productSchema);
export default Product;