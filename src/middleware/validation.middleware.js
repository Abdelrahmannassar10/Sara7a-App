import Joi from "joi";
export const isValid= (schema)=> {
    return (req, res, next) => {
        const data = {...req.body, ...req.params, ...req.query};
        const { value, error } = schema.validate(data, {
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
email:Joi.string().email({tlds:{allow: ["com"]}}) ,
password:Joi.string().min(5).max(100),
phoneNumber:Joi.string().min(10).max(15),
dob:Joi.date(),
name:Joi.string().min(3).max(30),
otp:Joi.string().length(5) ,
repassword :(ref)=> Joi.string().valid(Joi.ref(ref)) ,
objectId: Joi.string().hex().length(24),
}
