import { Schema  ,model} from "mongoose";

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
        required:() =>{
            if(this.attachment.length > 0){
                return true;
            }
            return false;   
        }
    },
    attachment: [{
        secure_url: String,
        public_id: String
    }],
}, { timestamps: true })
const Message = model("Message", schema);
export default Message;