import cloudinary, { uploadfiles } from "../../utilies/cloud/cloudinary.config.js";
import Message from "../../DB/models/message.model.js";
export const createMessage = async (req, res) => {
    const {content} =req.body;
    const {receiver} = req.params;
    const {files} = req;
    //upload files to cloud storage
    console.log(files);

    const attachment = await uploadfiles(files, {
        folder: `saraha-App/users/${receiver}/messages`
    });
    await Message.create({
        content,
        receiver,
        attachment,
        sender: req.user?._id
    });
    res.status(201).json({ message: "Message created successfully" });
};
export const getMessage = async (req, res) => {
    const {id} = req.params;
    const messages = await Message.findOne({ _id: id  , receiver :req.user.id} ,{},{
        populate: {
            path: "receiver",
            select: "-password -createdAt -updatedAt -deletedAt -__v -_id -credentialUpdatedAt -userAgent -isVerified -lastName  -firstName"
        }
    });
    res.status(200).json(messages);
};
