import Joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const messageSchema = Joi.object({
    content: Joi.string().min(3).max(1000),
    receiver: generalFields.objectId.required(),
    sender: generalFields.objectId
}).required();
