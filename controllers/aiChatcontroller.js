import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { getAIResponseWithSuggestions } from "../services/aiChatService.js";
import User from "../models/User.js";


// export const sendMessageStream = async (req, res) => {

//   try {

//     const { chatId, message } = req.body;

//     if (!message) {
//       return res.status(400).json({
//         success: false,
//         message: "Message required"
//       });
//     }

//     let chat;

//     if (!chatId) {

//       chat = await Chat.create({
//         title: message.split(" ").slice(0,5).join(" ")
//       });

//     } else {

//       chat = await Chat.findById(chatId);

//       if (!chat) {
//         return res.status(404).json({
//           success:false,
//           message:"Chat not found"
//         });
//       }

//     }

//     // Save user message
//     await Message.create({
//       chatId: chat._id,
//       role: "user",
//       content: message
//     });

//     // Get chat history
//     const messages = await Message.find({ chatId: chat._id })
//       .sort({ createdAt: 1 });

//     const formattedMessages = messages.map(msg => ({
//       role: msg.role,
//       content: msg.content
//     }));


//     // Response headers for streaming
//     res.setHeader("Content-Type", "text/plain");
//     res.setHeader("Transfer-Encoding", "chunked");

//     const stream = await streamAIReply(formattedMessages);

//     let fullReply = "";

//     for await (const chunk of stream) {

//       const token = chunk.choices[0]?.delta?.content || "";

//       fullReply += token;

//       res.write(token); // send token to frontend
//     }

//     res.end();

//     // Save final AI message
//     await Message.create({
//       chatId: chat._id,
//       role: "assistant",
//       content: fullReply
//     });

//   } catch (error) {

//     console.log(error);

//     res.status(500).json({
//       success:false
//     });

//   }

// };


// Second update - Collecting stream into one string and sending JSON response at the end (Postman-friendly)
// export const sendMessageStream = async (req, res) => {
//   try {
//     const { chatId, message } = req.body;

//     if (!message) {
//       return res.status(400).json({ success: false, message: "Message required" });
//     }

//     let chat;

//     if (!chatId) {
//       chat = await Chat.create({
//         title: message.split(" ").slice(0, 5).join(" ")
//       });
//     } else {
//       chat = await Chat.findById(chatId);
//       if (!chat) {
//         return res.status(404).json({ success: false, message: "Chat not found" });
//       }
//     }

//     // Save user message
//     await Message.create({
//       chatId: chat._id,
//       role: "user",
//       content: message
//     });

//     // Get chat history
//     const messages = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 });
//     const formattedMessages = messages.map(msg => ({
//       role: msg.role,
//       content: msg.content
//     }));

//     // Get AI reply (stream)
//     const stream = await streamAIReply(formattedMessages);

//     let fullReply = "";

//     // Collect all tokens into one string
//     for await (const chunk of stream) {
//       const token = chunk.choices[0]?.delta?.content || "";
//       fullReply += token;
//     }

//     // Save AI message in DB
//     await Message.create({
//       chatId: chat._id,
//       role: "assistant",
//       content: fullReply
//     });

//     // Send JSON response to frontend (Postman-friendly)
//     res.status(200).json({
//       success: true,
//       chatId: chat._id,
//       reply: fullReply
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false });
//   }
// };

// Third Update - Clean up multiple newlines in AI response before saving/sending
// export const sendMessageStream = async (req, res) => {
//   try {
//     const { chatId, message } = req.body;

//     const userId = req.optionalMiddleware?.id || null; // Get user ID from auth middleware

//     console.log("User ID from auth middleware in sendMessageStream:", userId);

//     console.log("Message: ",message);
//     if (!message) {
//       return res.status(400).json({ success: false, message: "Message required" });
//     }

//     let chat;

//     if (!chatId) {
//       // Create new chat
//       chat = await Chat.create({
//         title: message.split(" ").slice(0, 5).join(" ")
//       });
//     } else {
//       // Existing chat
//       chat = await Chat.findById(chatId);
//       if (!chat) {
//         return res.status(404).json({ success: false, message: "Chat not found" });
//       }
//     }
//     console.log("Chat Id: ",chatId);

//     await Message.create({
//       chatId: chat._id,
//       role: "user",
//       content: message
//     });

//     // Get chat history
//     const messages = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 });
//     const formattedMessages = messages.map(msg => ({
//       role: msg.role,
//       content: msg.content
//     }));

//     // ✅ Get AI response and suggestions (not a stream)
//     const { reply, suggestions } = await getAIResponseWithSuggestions(formattedMessages);
//     console.log("AI Reply: ", reply);
//     console.log("AI Suggestions: ", suggestions);
//     // Optional: clean up multiple consecutive newlines
//     const fullReply = reply.replace(/\n{3,}/g, "\n\n").trim();

//     // Save AI reply in DB
//     await Message.create({
//       chatId: chat._id,
//       role: "assistant",
//       content: fullReply
//     });

//     // Send JSON response to frontend
//     res.status(200).json({
//       success: true,
//       chatId: chat._id,
//       reply: fullReply,
//       suggestions // array of follow-up questions
//     });

//   } catch (error) {
//     console.error("sendMessageStream error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// ----> Fourth update (Original )
// export const sendMessageStream = async (req, res) => {
//   try {
//     const { chatId, message } = req.body;
//     const userId = req.user?.id || null;

//     console.log("User ID from auth middleware in sendMessageStream:", userId);
//     console.log("Message: ", message);
//     console.log("Chat ID: ", chatId);
//     if (!message) {
//       return res.status(400).json({
//         success: false,
//         message: "Message required"
//       });
//     }

//     let chat = null;
//     let formattedMessages = [];

//     // 🟡 CASE 1: GUEST USER (NO DB)
//     if (!userId) {
//       // frontend se pura conversation bhejna padega
//       formattedMessages = req.body.messages || [];

//       formattedMessages.push({
//         role: "user",
//         content: message
//       });

//       const { reply, suggestions } =
//         await getAIResponseWithSuggestions(formattedMessages);

//       return res.status(200).json({
//         success: true,
//         chatId: null, // no DB chat
//         reply: reply.replace(/\n{3,}/g, "\n\n").trim(),
//         suggestions,
//         isGuest: true
//       });
//     }

//     // 🟢 CASE 2: LOGGED IN USER (DB FLOW)

//     if (!chatId) {
//       chat = await Chat.create({
//         userId,
//         title: message.split(" ").slice(0, 5).join(" ")
//       });
//     } else {
//       chat = await Chat.findById(chatId);
//       if (!chat) {
//         return res.status(404).json({
//           success: false,
//           message: "Chat not found"
//         });
//       }
//     }

//     await Message.create({
//       chatId: chat._id,
//       role: "user",
//       content: message
//     });

//     const messages = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 });

//     formattedMessages = messages.map(msg => ({
//       role: msg.role,
//       content: msg.content
//     }));

//     const { reply, suggestions } =
//       await getAIResponseWithSuggestions(formattedMessages);

//     const fullReply = reply.replace(/\n{3,}/g, "\n\n").trim();

//     await Message.create({
//       chatId: chat._id,
//       role: "assistant",
//       content: fullReply
//     });
//     console.log("AI Reply: ", fullReply);
//     console.log("Chat ID: ", chat._id);
//     res.status(200).json({
//       success: true,
//       chatId: chat._id,
//       reply: fullReply,
//       suggestions,
//       isGuest: false
//     });

//   } catch (error) {
//     console.error("sendMessageStream error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// };

// This is temporary code for streaming output like chatGPT. We will replace it with getAIResponseWithSuggestions in the next update, which will give us the full reply and suggestions in one go (no streaming).
export const sendMessageStream = async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const userId = req.user?.id || null;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message required",
      });
    }

    let chat = null;

    // 🟢 CREATE / FIND CHAT
    if (userId) {
      if (!chatId) {
        chat = await Chat.create({
          userId,
          title: message.split(" ").slice(0, 5).join(" "),
        });
      } else {
        chat = await Chat.findById(chatId);
      }

      await Message.create({
        chatId: chat._id,
        role: "user",
        content: message,
      });
    }

    const messages = userId
      ? await Message.find({ chatId: chat._id }).sort({ createdAt: 1 })
      : [];

    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    formattedMessages.push({
      role: "user",
      content: message,
    });

    const { reply } =
      await getAIResponseWithSuggestions(formattedMessages);

    const fullReply = reply.replace(/\n{3,}/g, "\n\n").trim();

    if (userId) {
      await Message.create({
        chatId: chat._id,
        role: "assistant",
        content: fullReply,
      });
    }

    // ✅ STREAM START
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    // ✅ SEND META FIRST
    res.write(
      `__META__${JSON.stringify({
        chatId: chat?._id || null,
        isGuest: !userId,
      })}__END__`
    );

    const words = fullReply.split(" ");

    for (let i = 0; i < words.length; i++) {
      res.write(words[i] + " ");
      await new Promise((r) => setTimeout(r, 30));
    }

    res.end(); // ✅ ONLY ONCE

  } catch (error) {
    console.error("sendMessageStream error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
};

// export const getChats = async (req, res) => {
//   try {

//     const chats = await Chat.find({
//       userId: req.user.id
//     }).sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       chats
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false
//     });

//   }

// };

// export const getChats = async (req, res) => {

//   try {

//     const userId = req.optionalMiddleware?.id;

//     // Guest user
//     if (!userId) {
//       return res.status(200).json({
//         success: true,
//         chats: []
//       });
//     }

//     const chats = await Chat.find({})
//       .sort({ createdAt: -1 });
//     console.log("Chats from DB :- ", chats) 
//     res.status(200).json({
//       success: true,
//       chats
//     });

//   } catch (error) {

//     console.error("getChats error:", error);

//     res.status(500).json({
//       success:false,
//       error:error.message
//     });

//   }

// };


// export const sendMessageStream = async (req, res) => {
//   try {
//     const { chatId, message } = req.body;

//     const userId = req.optionalMiddleware?.id || null;

//     console.log("User ID from auth middleware in sendMessageStream:", userId);

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "User not authenticated"
//       });
//     }

//     console.log("Message: ", message);

//     if (!message) {
//       return res.status(400).json({ success: false, message: "Message required" });
//     }

//     let chat;

//     if (!chatId) {
//       // ✅ FIXED: userId added
//       chat = await Chat.create({
//         userId: userId,
//         title: message.split(" ").slice(0, 5).join(" ")
//       });
//     } else {
//       chat = await Chat.findById(chatId);
//       if (!chat) {
//         return res.status(404).json({ success: false, message: "Chat not found" });
//       }
//     }

//     console.log("Chat Id: ", chatId);

//     await Message.create({
//       chatId: chat._id,
//       role: "user",
//       content: message
//     });

//     const messages = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 });

//     const formattedMessages = messages.map(msg => ({
//       role: msg.role,
//       content: msg.content
//     }));

//     const { reply, suggestions } = await getAIResponseWithSuggestions(formattedMessages);

//     console.log("AI Reply: ", reply);

//     const fullReply = reply.replace(/\n{3,}/g, "\n\n").trim();

//     await Message.create({
//       chatId: chat._id,
//       role: "assistant",
//       content: fullReply
//     });

//     res.status(200).json({
//       success: true,
//       chatId: chat._id,
//       reply: fullReply,
//       suggestions
//     });

//   } catch (error) {
//     console.error("sendMessageStream error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


export const getChats = async (req, res) => {
  try {
    const userId = req.optionalMiddleware?.id;

    if (!userId) {
      return res.status(200).json({
        success: true,
        chats: []
      });
    }

    const chats = await Chat.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      chats
    });

  } catch (error) {
    console.error("getChats error:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getMessages = async (req, res) => {
  try {

    const { chatId } = req.params;

    // Check if chat belongs to logged-in user
    // const chat = await Chat.findOne({
    //   _id: chatId,
    //   userId: req.middleware?.id
    // });
    const chat = await Chat.findById(chatId)
      .populate("messageId");


    if (!chat) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access or chat not found"
      });
    }

    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      messages
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};


/* =========================
   RENAME CHAT
========================= */

export const renameChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { title },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to rename chat",
    });
  }
};


/* =========================
   DELETE CHAT
========================= */

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findByIdAndDelete(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // delete all messages of that chat
    await Message.deleteMany({ chatId });

    res.json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete chat",
    });
  }
};


