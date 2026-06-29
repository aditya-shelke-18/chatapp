import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socker.js";
import openai from "../lib/openai.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        const unreadCounts = await Message.aggregate([
            { $match: { receiverId: loggedInUserId, seen: false } },
            { $group: { _id: "$senderId", count: { $sum: 1 } } }
        ]);

        const unreadMap = {};
        unreadCounts.forEach(({ _id, count }) => { unreadMap[_id.toString()] = count; });

        const usersWithUnread = filteredUsers.map(user => ({
            ...user.toObject(),
            unreadCount: unreadMap[user._id.toString()] || 0
        }));

        res.status(200).json(usersWithUnread);
    }
    catch(err){
        console.log("Error in getting users for sidebar", err.message);
        res.status(500).send({message:"Internal Server Error"})
    }
};

export const getMessages = async (req, res) => {
    try {
       const {id:userToChatId} = req.params
       const myId = req.user._id
        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })

       res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getting messages", err.message);
        res.status(500).send({message:"Internal Server Error"})
    }
};

export const sendMessages = async (req, res) => {
    try {
       const { text, image, file, fileName, fileType } = req.body;
       const { id:receiverId } = req.params;
       const senderId = req.user._id;

       let imageUrl;
       if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.url;
       }

       let fileUrl;
       if(file){
            const uploadResponse = await cloudinary.uploader.upload(file, {
                resource_type: "auto",
                public_id: fileName,
            });
            fileUrl = uploadResponse.secure_url;
       }

       const newMessage = new Message({
           senderId,
           receiverId,
           text,
           image: imageUrl,
           file: fileUrl,
           fileName,
           fileType,
           reactions: []
       })

       await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage);
        if (newMessage.text) {
            generateAndEmitSmartReplies(newMessage, receiverSocketId);
            translateAndEmit(newMessage, senderId, receiverId, receiverSocketId);
        }
    }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sending messages", error.message);
        res.status(500).send({message:"Internal Server Error"})
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const userId = req.user._id;
        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ message: "Message not found" });
        if (message.senderId.toString() !== userId.toString())
            return res.status(403).json({ message: "Not authorized" });
        await message.deleteOne();
        const receiverSocketId = getReceiverSocketId(message.receiverId);
        const senderSocketId = getReceiverSocketId(message.senderId);
        [receiverSocketId, senderSocketId].forEach(sid => {
            if (sid) io.to(sid).emit("messageDeleted", messageId);
        });
        res.status(200).json({ success: true });
    } catch (error) {
        console.log("Error in deleteMessage", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const translateAndEmit = async (message, senderId, receiverId, receiverSocketId) => {
    try {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_openai_api_key_here") return;

        const [sender, receiver] = await Promise.all([
            User.findById(senderId).select("preferredLanguage"),
            User.findById(receiverId).select("preferredLanguage"),
        ]);

        const senderLang = sender?.preferredLanguage || "en";
        const receiverLang = receiver?.preferredLanguage || "en";

        if (senderLang === receiverLang) return;

        // Check cache first
        const cached = message.translations?.get(receiverLang);
        if (cached) {
            io.to(receiverSocketId).emit("translatedMessage", {
                messageId: message._id.toString(),
                language: receiverLang,
                translatedText: cached,
            });
            return;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a translation engine. Translate the given text accurately and naturally. Return only the translated text, nothing else." },
                { role: "user", content: `Translate this message to language code "${receiverLang}": ${message.text}` }
            ],
            max_tokens: 300,
            temperature: 0.3,
        });

        const translatedText = completion.choices[0].message.content.trim();

        // Cache in DB
        await Message.findByIdAndUpdate(message._id, {
            $set: { [`translations.${receiverLang}`]: translatedText }
        });

        io.to(receiverSocketId).emit("translatedMessage", {
            messageId: message._id.toString(),
            language: receiverLang,
            translatedText,
        });
    } catch (error) {
        console.log("Error in translateAndEmit:", error.message);
    }
};

const generateAndEmitSmartReplies = async (message, receiverSocketId) => {
    try {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_openai_api_key_here") {
            console.log("Smart replies skipped: OPENAI_API_KEY not configured");
            return;
        }

        const lastMessages = await Message.find({
            $or: [
                { senderId: message.senderId, receiverId: message.receiverId },
                { senderId: message.receiverId, receiverId: message.senderId }
            ]
        }).sort({ createdAt: -1 }).limit(10);

        const conversation = lastMessages.reverse()
            .map(msg => `${msg.senderId}: ${msg.text || "[media]"}`)
            .join("\n");

        const prompt = `You are a smart reply assistant for a chat app.

Recent conversation:
${conversation}

The latest message received is: "${message.text}"

Generate exactly 3 short reply suggestions with different tones.
Rules:
- Each reply must be under 12 words
- Replies must be natural and contextually relevant
- Tones: Professional, Friendly, Short

Return ONLY valid JSON in this exact format:
{"replies":[{"tone":"Professional","text":"..."},{"tone":"Friendly","text":"..."},{"tone":"Short","text":"..."}]}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            max_tokens: 200,
            temperature: 0.7,
        });

        const parsed = JSON.parse(completion.choices[0].message.content);
        const replies = parsed.replies;

        if (!Array.isArray(replies) || replies.length === 0) return;

        io.to(receiverSocketId).emit("smartReplies", { messageId: message._id.toString(), replies });
    } catch (error) {
        console.log("Error generating smart replies:", error.message);
    }
};

export const markSeen = async (req, res) => {
    try {
        const { id: senderId } = req.params;
        const receiverId = req.user._id;
        await Message.updateMany({ senderId, receiverId, seen: false }, { seen: true });
        res.status(200).json({ success: true });
    } catch (error) {
        console.log("Error in markSeen", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const addReaction = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { emoji } = req.body;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        const existingReaction = message.reactions.find(r => r.userId.toString() === userId.toString());
        
        if (existingReaction) {
            if (existingReaction.emoji === emoji) {
                message.reactions = message.reactions.filter(r => r.userId.toString() !== userId.toString());
            } else {
                existingReaction.emoji = emoji;
            }
        } else {
            message.reactions.push({ userId, emoji });
        }

        await message.save();

        const receiverSocketId = getReceiverSocketId(message.receiverId);
        const senderSocketId = getReceiverSocketId(message.senderId);
        
        [receiverSocketId, senderSocketId].forEach(socketId => {
            if (socketId) {
                io.to(socketId).emit("messageReaction", { messageId, reactions: message.reactions });
            }
        });

        res.status(200).json(message);
    } catch (error) {
        console.log("Error in adding reaction", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};