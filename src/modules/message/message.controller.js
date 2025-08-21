import { Router } from "express";
import * as MessageRouter from "./message.service.js";
import {uploadfile} from "../../utilies//multer/multer.cloud.js";
import { isValid } from "../../middleware/validation.middleware.js";
const router = Router();
router.post("/:receiver", uploadfile().array("attachment", 3), isValid(), MessageRouter.createMessage);
export default router;