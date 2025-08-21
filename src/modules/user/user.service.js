import { User } from "../../DB/models/user.model.js"
import cloudinary, { deleteFile } from "../../utilies/cloud/cloudinary.config.js";
import fs from "fs";
export const deleteUser = async (req, res, next) => {
    if(req.user.profilePicture.public_id) {
        deleteFile(`saraha_App/users/${req.user._id}`);
    }
    await User.deleteOne({ _id: req.user._id });
    return res.status(200).json({ message: "user deleted successfully", success: true });
};
export const uploadProfilePicture = async (req, res, next) => {
    const { id } = req.user._id;
    const userExist = await User.findByIdAndUpdate(id, { profilePicture: req.file.path }, { new: true });
    if (!userExist) {
        throw Error("user not found", { cause: 404 });
    }
    return res.status(200).json({
        message: "Profile picture uploaded successfully", success: true, data:
            userExist
    });
};
export const uploadProfilePictureCloud = async (req, res, next) => {
    const user = req.user;
    const file = req.file;
    let uploadOptions ={folder: `saraha_App/users/${user._id}/profilePicture`,}
    if(user.profilePicture.public_id) {
        uploadOptions.public_id = user.profilePicture.public_id;
        delete uploadOptions.folder;
    }
    const { secure_url, public_id } = await uploadfile({
        path: file.path,
        options: uploadOptions
    });
    await User.updateOne({ _id: user._id }, { profilePicture: { secure_url, public_id } });
    res.status(200).json({
        message: "Profile picture uploaded successfully",
        success: true,
        data: { secure_url, public_id }
    });

};