import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
 {
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
    },
    originalLanguage: {
        type: String,
        default: "en",
    },
    translations: {
        type: Map,
        of: String,
        default: {},
    },
    image: {
        type: String,
    },
    file: {
        type: String,
    },
    fileName: {
        type: String,
    },
    fileType: {
        type: String,
    },
    seen: {
        type: Boolean,
        default: false,
    },
    reactions: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        emoji: {
            type: String,
            required: true
        }
    }]
 },
{
    timestamps:true,

}
);

const Message = mongoose.model("Message",messageSchema);
export default Message;


