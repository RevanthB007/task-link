import { Schema } from "mongoose";

const NotificationSchema = new Schema({
    senderId:{
        type: String,
        required: [true, "sender id is required"],
    },
    receiverId:{
        type: String,
        required: [true, "receiver id is required"],
    },
    content:{
        type: String,
        required: [true, "content is required"],
    }

},
{timestamps: true}
)