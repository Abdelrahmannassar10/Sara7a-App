import joi from "joi";
export const registerSchema =joi.object({
            fullName: joi.string().required(),
            email: joi.string().email(),
            password: joi.string().min(6).required(),
            phoneNumber: joi.string(),
            dob: joi.date().less('now')
        }).or('email', 'phoneNumber');