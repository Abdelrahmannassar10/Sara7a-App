import { Router } from "express";
import * as userRouter from "./user.service.js"
import { uploadfile } from "../../utilies/multer/index.js";
import { fileValidation } from "../../middleware/file-validation.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
const router = Router();
router.delete("/:id", isAuthenticated, userRouter.deleteUser);
router.post("/upload-profile-picture",isAuthenticated,uploadfile({folder:"profilePicture" ,allowedType:["image/png" ,"image/jpeg"]}).single("profilePicture") , fileValidation(),userRouter.uploadProfilePicture);
export default router;