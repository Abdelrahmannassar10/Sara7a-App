import { User } from "../../DB/models/user.model.js";
import { Token } from "../../DB/models/token.model.js"
import { sendEmail } from "../../utilies/email/index.js";
import { generateOTP } from "../../utilies/otp/index.js";
import { OAuth2Client } from "google-auth-library";
import { generateToken, refreshToken } from "../../utilies/token/index.js";
import { comparePassword, hashPassword } from "../../utilies/hash/index.js";
export const register = async (req, res, next) => {
    //extract data from body
    const { fullName, email, password, phoneNumber, dob } = req.body;
    //check if user is already exist 
    const userExist = await User.findOne({
        $or: [
            {
                $and: [
                    { email: email },
                    { email: { $ne: null } },
                    { email: { $exists: true } }
                ]
            },
            {
                $and: [
                    { phoneNumber: phoneNumber },
                    { phoneNumber: { $ne: null } },
                    { phoneNumber: { $exists: true } }
                ]
            }]
    });
    if (userExist) {
        throw Error("User is already Exist", { cause: 404 });
    }
    //generate otp 
    //convert password to hashed 
    //send verification email to the user
    //create the user in the system   
    const user = new User({ fullName, email, phoneNumber, password: hashPassword(password), dob });
    const { otp, otpExpire } = generateOTP({ expiredTime: 15 * 60 * 1000 });
    user.otp = otp;
    user.otpExpire = otpExpire;
    if (email) {
        await sendEmail({
            to: email, subject: "verify your account your OTP ", html: `Your OTP is: ${otp}`
        });
    }
    await user.save();
    //send token
    //send response
    return res.status(200).json({ message: "User created successfully", success: true });
};
export const verifyAccount = async (req, res, next) => {
    const { email, otp } = req.body;
    const userExist = await User.findOne({ email, otp, otpExpire: { $gt: Date.now() } });
    if (!userExist) {
        throw Error("invalid otp", { cause: 401 });
    }
    userExist.isVerified = true;
    userExist.otp = undefined;
    userExist.otpExpire = undefined;
    await userExist.save();
    res.status(200).json({ message: "User verified successfully", success: true });
};
export const sendOtp = async (req, res, next) => {
    const { email } = req.body;
    const { otp, otpExpire } = generateOTP({ expiredTime: 2 * 60 * 1000 });
    await User.findOneAndUpdate({ email }, { otp, otpExpire });
    await sendEmail({
        to: email, subject: " your OTP ", html: `Your OTP is: ${otp}`
    });
    return res.status(200).json({ message: "otp sent successfully", success: true });
};
export const loginWithGoogle = async (req, res, next) => {
    const { idToken } = req.body;
    const client = new OAuth2Client("412343051772-ehb44181t0vbj7fh56m90fbpvn37gltm.apps.googleusercontent.com");
    const ticket = await client.verifyIdToken({ idToken });
    const payload = ticket.getPayload();
    let userExist = await User.findOne({ email: payload.email })
    if (!userExist) {
        userExist = await User.create({
            email: payload.email,
            phoneNumber: payload.phone,
            dob: payload.birthdate,
            isVerified: true,
            fullName: payload.name,
            userAgent: "google"
        });
    }
    const token = generateToken(userExist, "15m");
    return res.status(200).json({ message: "login successfully", success: true, data: { token } });

};
export const login = async (req, res, next) => {
    //get data from user
    const { email, phoneNumber, password } = req.body;
    //check if user exist
    const userExist = await User.findOne({
        $or: [{
            $and: [
                { email: { $exists: true } },
                { email: { $ne: null } },
                { email: email }]

        }, {
            $and: [
                { phoneNumber: { $exists: true } },
                { phoneNumber: { $ne: null } },
                { phoneNumber: phoneNumber }]
        }
        ]
    })
    if (!userExist) {
        throw Error("invalid credential !!!!!!", { cause: 400 });
    }
    if (userExist.isVerified === false) {
        throw Error("User is not verified", { cause: 401 });
    }
    if(userExist.deletedAt) {
        userExist.deletedAt = undefined;
        await userExist.save();
    }
    //compare passwords
    const match = comparePassword(password, userExist.password);
    if (!match) {
        throw Error("invalid credential !!!!!!", { cause: 400 });
    }
    //generate token
    const accessToken = generateToken({
        payload: { id: userExist._id, email: userExist.email } ,
        options: { expiresIn: "15m" }
    });
    const refreshtoken = generateToken({
        payload: { id: userExist._id },
        options: { expiresIn: "7d" }
    })
    await Token.create({ token: refreshtoken, user: userExist._id, type: "refresh" });
    //send response
    return res.status(200).json({ message: "user login successfully ", success: true, data: { accessToken, refreshtoken } });
};
export const refresh_Token = async (req, res, next) => {
    const newToken = refreshToken(req.user);
    return res.status(200).json({ message: "Token refreshed successfully", success: true, token: newToken });
};
export const updatePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    //compare old password
    const match = comparePassword(oldPassword, user.password);
    if (!match) {
        throw Error("Invalid old password", { cause: 400 });
    }
    //update password
    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();
    return res.status(200).json({ message: "Password updated successfully", success: true });
};
export const resetPassword = async (req, res, next) => {
    const { email, newPassword, otp } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
        throw Error("user not found", { cause: 404 });
    }
    if (userExist.otp !== otp) {
        throw Error("invalid otp", { cause: 409 });
    }
    if (userExist.otpExpire < Date.now()) {
        throw Error("otp expired", { cause: 409 });
    }
    userExist.password = hashPassword(newPassword);
    userExist.otp = undefined;
    userExist.otpExpire = undefined;
    userExist.credentialUpdatedAt = Date.now();
    userExist.otp = undefined;
    userExist.otpExpire = undefined;
    await userExist.save();
    await Token.deleteMany({ user: userExist._id, type: "refresh" });
    return res.status(200).json({ message: "Password reset successfully", success: true });
};
export const logout = async (req, res, next) => {
    const token = req.headers.authorization;
    await Token.create({ token, user: req.user.id });
    return res.status(200).json({ message: "User logout successfully", success: true });
}