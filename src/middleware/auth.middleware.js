import { User } from "../DB/models/user.model.js";
import { verifyToken } from "../utilies/token/index.js";

export const isAuthenticated =async(req,res,next)=>{
    const token =req.headers.authorization;
    if(!token){
        return res.status(401).json({message:"token is required "});
    }
    const payload = verifyToken(token);
    if(!payload){
        return res.status(401).json({message:"Invalid token"});
    }
    const userExist = await User.findById(payload.id);
    if(!userExist){
        return res.status(404).json({message:"User not found"});
    }
    req.user = userExist;
    next();
}