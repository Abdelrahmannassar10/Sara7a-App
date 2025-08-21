import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";
export const registerSchema = joi.object({
    fullName: joi.string().required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    phoneNumber: generalFields.phoneNumber.required(),
    dob: generalFields.dob.required()
}).or('email', 'phoneNumber').required();
export const loginSchema = joi.object({
    email: generalFields.email.required(),
    password: generalFields.password.required()
});
export const resetPasswordSchema = joi.object({
    email: generalFields.email.required(),
    otp: generalFields.otp.required(),
    newPassword: generalFields.password.required(),
    repassword: generalFields.repassword("newPassword").required()
});