import { Schema, model } from "mongoose";

const schema = new Schema({
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
        minlength: 3,
        maxlength: 1000,
        required: function () {
            return !(Array.isArray(this.attachment) && this.attachment.length > 0);
        }
    }, attachment: {
        type: [{
            secure_url: String,
            public_id: String
        }],
        default: []
    }


}, { timestamps: true })
const Message = model("Message", schema);
export default Message;