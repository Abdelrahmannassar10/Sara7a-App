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
}
