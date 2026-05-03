import mongoose, { mongo } from "mongoose";

const chatSchema = new mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messageId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        required: false,
    }],

    title: {
        type: String,
        required: true
    }

}, { timestamps: true });

export default mongoose.model("Chat", chatSchema);