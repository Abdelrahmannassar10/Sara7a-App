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
