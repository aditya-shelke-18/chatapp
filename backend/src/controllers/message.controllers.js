import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socker.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
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
       const { text, image } = req.body;
       const { id:receiverId } = req.params;
       const senderId = req.user._id;

       let imageUrl;
       if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.url;
       }

       const newMessage = new Message({
           senderId,
           receiverId,
           text,
           image:imageUrl,
           reactions: []
       })

       await newMessage.save();

    
    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sending messages", error.message);
        res.status(500).send({message:"Internal Server Error"})
        
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