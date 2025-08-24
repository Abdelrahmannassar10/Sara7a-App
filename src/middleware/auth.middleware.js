import { log } from "console";
import { Token } from "../DB/models/token.model.js";
import { User } from "../DB/models/user.model.js";
import { verifyToken } from "../utilies/token/index.js";

export const isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization;
    // console.log(token);
    if (!token) {
        return res.status(401).json({ message: "token is required " });
    }
    const blockedToken = await Token.findOne({ token, type: "access" });
    if (blockedToken) {
        throw Error("invalid Token (blocked)", { cause: 409 });
    };

    const payload =verifyToken({token, secretKey: process.env.SECRET_KEY});

    if (!payload) {
        return res.status(401).json({ message: "Invalid token (payload not found)" });
    }
    const userExist = await User.findById(payload.id);
    if (!userExist) {
        return res.status(404).json({ message: "User not found" });
    }
    console.log(userExist.credentialUpdatedAt, new Date(payload.iat * 1000));

    if (userExist.credentialUpdatedAt > new Date(payload.iat * 1000)) {
        return res.status(401).json({ message: "Token expired (credential updated)" });
    }
    req.user = userExist;
    next();
}