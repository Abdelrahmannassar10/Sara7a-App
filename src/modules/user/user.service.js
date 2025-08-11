import { JWT } from "google-auth-library";
import { User } from "../../DB/models/user.model.js"
import { verifyToken } from "../../utilies/token/index.js";
import fs from "fs";
export const deleteUser = async (req, res, next) => {
        //get data from params
    if(req.user.profilePicture){
        fs.unlinkSync(req.user.profilePicture);
    }
        const { id } = req.user._id;
        //check for the user and delete it
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            throw Error("user not founded", { cause: 404 });
        }
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
}