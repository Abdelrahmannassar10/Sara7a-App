// function asyncHandler(fn){
//     return function(req, res, next){
//         fn(req, res, next).catch(error => {
//             next(error);
//         });
//     }
// }
// this is a utility function to handle async errors in Express.js , in express version 5 and above, 
// you can use the built-in error handling middleware that automatically catches async errors,

import { Token } from "../../DB/models/token.model.js";
import { generateToken, verifyToken } from "../token/index.js";

//  so this utility may not be necessary in newer versions.
export const globalErrorHandler = async (err, req, res, next) => {
    // if(req.file){
    //     fs.unlinkSync(req.file.path);
    // }
    try {
        if (err.message == "jwt expired") {
            const refreshToken = req.headers.refreshtoken;
            const payload = verifyToken(refreshToken);
            const tokenExist = await Token.findOneAndDelete({ token: refreshToken, user: payload.id, type: "refresh" });
            if (!tokenExist) {
                throw Error("invaled token (refresh token not found)", { cause: 409 });
            }
            const accessToken = generateToken({
                payload: { id: payload.id },
                options: { expiresIn: "5s" }
            });
            const newRefreshToken = generateToken({
                payload: { id: payload.id },
                options: { expiresIn: "15m" }
            });
            await Token.create({ token: newRefreshToken, user: payload.id, type: "refresh" });
            //send response
            return res.status(200).json({ message: "refresh token successfully", success: true, data: { accessToken, refreshToken: newRefreshToken } });
        }
        res.status(err.cause || 500).json({ message: err.message, success: false, error: err.stack });
    } catch (error) {
        res.status(error.cause || 500).json({ message: error.message, success: false, error: error.stack });
    }
}