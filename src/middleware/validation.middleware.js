import joi from "joi";
export const isValid= (schema)=> {
    return (req, res, next) => {
        const { value, error } = schema.validate(req.body, {
            abortEarly: false
        });
        if (error) {
            let errorMessage = error.details.map(detail => detail.message).join(', ');
            throw Error(errorMessage, { cause: 400 });
        }
        next();
    };
};
export const generalFields={
email:joi.string().email({tlds:{allow: ["com"]}}) ,
password:joi.string().min(5).max(100),
phoneNumber:joi.string().min(10).max(15),
dob:joi.date(),
name:joi.string().min(3).max(30),
otp:joi.string().length(5) ,
repassword :(ref)=> joi.string().valid(joi.ref(ref))
}
